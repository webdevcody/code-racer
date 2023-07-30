import { RacePage } from "../page-objects/pages/RacePage";
export class RaceBL {
    
    public static runTypingRace(spans: any): RacePage{
        const NEW_LINE = "⏎\n";
        let code = "";
        let isIndentWhiteSpace = false;
        for (let i = 0; i < spans.length; i++) {
            const char = spans[i].innerText;
            if (char !== " " && isIndentWhiteSpace) {
            // Encounter non-whitespace character when isIndentWhiteSpace=true
            // Unset isIndentWhiteSpace back to false
            isIndentWhiteSpace = false;
            }
            if (char === " " && isIndentWhiteSpace) {
            continue;
            }
            code += char === NEW_LINE ? "\n" : char;
            if (char === NEW_LINE) {
            // When we encounter new line, the following whitespace up to
            // encounting non-whitespace character will be considered indent whitespace.
            // Since our app auto indent, we don't type it
            isIndentWhiteSpace = true;
            }
        }
        cy.get('[data-cy="race-practice-input"]').type(code, {
            force: true,
            parseSpecialCharSequences: false,
            delay: 30,
            waitForAnimations: true,
        });
        return new RacePage();
    }
}