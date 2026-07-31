import { expect, it } from "vitest";
import { privacyDocument, termsDocument } from "../../src/reference/legal-pages";

it("defines the agreed browser-local privacy document", () => {
  expect(privacyDocument).toEqual({
    title: "Privacy Policy",
    lastUpdated: "Last updated: July 27, 2026",
    sections: [
      { heading: "What we collect", paragraphs: ["There is no account or sign-in."] },
      { heading: "Farm data", paragraphs: ["Projects stay in this browser."] },
      {
        heading: "Payments",
        paragraphs: [
          "There is no cloud sync, share links, payments, memberships, or supporter features.",
        ],
      },
      {
        heading: "Analytics",
        paragraphs: [
          "This browser-local product does not provide analytics or tracking services.",
        ],
      },
      { heading: "Cookies", paragraphs: ["This browser-local product does not use sign-in cookies."] },
      {
        heading: "Third parties",
        paragraphs: [
          "Projects are not sent to a cloud service or shared with third parties.",
        ],
      },
      {
        heading: "Data deletion",
        paragraphs: [
          "You can delete local data by deleting projects or clearing this site's data in your browser.",
        ],
      },
      { heading: "Local use", paragraphs: ["JSON import and export happen only when you choose them."] },
    ],
  });
});

it("defines the agreed browser-local terms document", () => {
  expect(termsDocument).toEqual({
    title: "Terms of Service",
    lastUpdated: "Last updated: July 27, 2026",
    sections: [
      {
        heading: "What this is",
        paragraphs: [
          "Stardew Planner is a browser-local fan-made tool for planning farm layouts in Stardew Valley. Projects stay in this browser. It is not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
        ],
      },
      { heading: "Accounts", paragraphs: ["There is no account or sign-in."] },
      {
        heading: "Online features",
        paragraphs: [
          "There is no cloud sync, share links, payments, memberships, or supporter features.",
        ],
      },
      {
        heading: "Your data",
        paragraphs: [
          "JSON import and export happen only when you choose them. You can delete local data by deleting projects or clearing this site's data in your browser.",
        ],
      },
      { heading: "Availability", paragraphs: ["The product is provided as-is with no uptime guarantees."] },
      {
        heading: "Game assets",
        paragraphs: [
          "Stardew Valley game assets are the property of ConcernedApe. They are used here for this fan-made planning tool.",
        ],
      },
      {
        heading: "Local use",
        paragraphs: ["This browser-local product does not provide contact or support features."],
      },
    ],
  });
});
