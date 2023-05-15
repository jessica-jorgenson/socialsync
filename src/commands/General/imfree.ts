import { Pagination, PaginationType } from '@discordx/pagination';
import { Category } from '@discordx/utilities';
import {
    ApplicationCommandOptionType,
    CommandInteraction,
    EmbedBuilder,
    User,
} from 'discord.js';
import { Client } from 'discordx';
import { injectable } from 'tsyringe';

import { Discord, Slash, SlashOption } from '@decorators';
import { getColor } from '@utils/functions';
import fetch from 'node-fetch';

@Discord()
@Category('General')
export default class ImFreeCommand {
    @Slash({
        name: 'imfree',
    })
    async imfree(
        @SlashOption({
            name: 'availability',
            type: ApplicationCommandOptionType.String,
            required: true,
        })
        input: string,
        interaction: CommandInteraction,
        client: Client,
        { localize }: InteractionData
    ) {
        const endpoint = 'https://api.openai.com/v1/completions';
        const model = 'text-davinci-003';
        const max_tokens = 256;
        const now = new Date();
        const localTime = now.toLocaleTimeString();
        const localDate = now.toLocaleDateString();

        const prompt = `"""
        From this text: ${input}
    Give me a list of UNIX timestamps of the times that would match that text
    Assume these times are for the next two weeks unless specified otherwise
    Add "<t:" before the timestamp, and ":F>" after
    Take into account that the current local time is ${localTime}, and today is ${localDate}. 
    """`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                max_tokens: max_tokens,
            }),
        });
        const result: any = await response.json();
        interaction.followUp(result);
    }
}
