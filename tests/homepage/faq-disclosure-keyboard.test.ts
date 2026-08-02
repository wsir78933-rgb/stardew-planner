import { describe, expect, it } from "vitest";
import {
  handleFaqSummaryKeyDown,
  type FaqSummaryKeyboardEvent,
} from "../../src/homepage/faq-disclosure-keyboard";

type FaqParentTagName = "DETAILS" | "DIV" | null;

type FaqKeyboardCase = {
  description: string;
  key: string;
  parentTagName: FaqParentTagName;
  initialOpen: boolean;
  expectedOpen: boolean | null;
  expectedDefaultPrevented: boolean;
  expectedErrorMessage: string | null;
};

function createFaqSummaryKeyboardEvent(
  key: string,
  parentTagName: FaqParentTagName,
  initialOpen: boolean,
): {
  event: FaqSummaryKeyboardEvent;
  parentElement: { tagName: string; open: boolean } | null;
  wasDefaultPrevented: () => boolean;
} {
  let defaultPrevented = false;
  const parentElement =
    parentTagName === null
      ? null
      : { tagName: parentTagName, open: initialOpen };

  return {
    event: {
      key,
      preventDefault: () => {
        defaultPrevented = true;
      },
      currentTarget: { parentElement },
    } as unknown as FaqSummaryKeyboardEvent,
    parentElement,
    wasDefaultPrevented: () => defaultPrevented,
  };
}

const faqKeyboardCases: FaqKeyboardCase[] = [
  {
    description: "opens a closed disclosure with Enter",
    key: "Enter",
    parentTagName: "DETAILS",
    initialOpen: false,
    expectedOpen: true,
    expectedDefaultPrevented: true,
    expectedErrorMessage: null,
  },
  {
    description: "closes an open disclosure with Space",
    key: " ",
    parentTagName: "DETAILS",
    initialOpen: true,
    expectedOpen: false,
    expectedDefaultPrevented: true,
    expectedErrorMessage: null,
  },
  {
    description: "leaves a disclosure unchanged with ArrowDown",
    key: "ArrowDown",
    parentTagName: "DETAILS",
    initialOpen: false,
    expectedOpen: false,
    expectedDefaultPrevented: false,
    expectedErrorMessage: null,
  },
  {
    description: "reports a non-details parent tag with Enter",
    key: "Enter",
    parentTagName: "DIV",
    initialOpen: false,
    expectedOpen: null,
    expectedDefaultPrevented: true,
    expectedErrorMessage: "DIV",
  },
  {
    description: "reports a missing parent with Enter",
    key: "Enter",
    parentTagName: null,
    initialOpen: false,
    expectedOpen: null,
    expectedDefaultPrevented: true,
    expectedErrorMessage: "null",
  },
];

describe("handleFaqSummaryKeyDown", () => {
  it.each(faqKeyboardCases)("$description", (faqKeyboardCase) => {
    const keyboardEvent = createFaqSummaryKeyboardEvent(
      faqKeyboardCase.key,
      faqKeyboardCase.parentTagName,
      faqKeyboardCase.initialOpen,
    );

    if (faqKeyboardCase.expectedErrorMessage === null) {
      handleFaqSummaryKeyDown(keyboardEvent.event);
    } else {
      expect(() => handleFaqSummaryKeyDown(keyboardEvent.event)).toThrow(
        faqKeyboardCase.expectedErrorMessage,
      );
    }

    expect(keyboardEvent.wasDefaultPrevented()).toBe(
      faqKeyboardCase.expectedDefaultPrevented,
    );

    if (faqKeyboardCase.expectedOpen !== null) {
      expect(keyboardEvent.parentElement?.open).toBe(
        faqKeyboardCase.expectedOpen,
      );
    }
  });
});
