export interface IPageProps {
  classes?: string;
  children?: React.ReactNode;
}

export const messages = {
  loss: [
    "Sorry, it was a state-based action.",
    "Better luck next time!",
    "That's not so bad!",
    "Okay, okay, you're getting there!",
    "Hey that wasn't the worst!",
    "Impressive job, even if you still died.",
    "You really (almost) made it!",
  ],
  win: [
    "Wizard's hat off to you!",
    "Yes, yes, let the magic flow through you.",
    "Watch where you point those lightning bolts!",
    "That's just... magical!",
    "Impressive!",
    "You're heating up!",
    "You're a wizard, Harry!",
    "Not even mana burn can getcha!",
  ],
};
