import axios, { AxiosError } from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "@client/redux";
import { PUBLIC_URL, debugMessage, fuzzyCompare } from "@client/utils";
import { appFacade, APP_PAGE } from "@client/features/app";
import {
  COUNTDOWN_ACTION_TYPE,
  GAME_STATUS,
  initialGame,
  ICard,
  ILeaderboardPlayer,
  GAME_POSITION,
  CARD_STATUS,
  initialLevels,
  levelEraOptions,
  POSITION_NONE,
  MAX_CARDS,
  LEVEL_MODIFIER_KEYS,
  generateLevel,
} from "@client/features/game";
import { soundStageFacade } from "@client/features/sound-stage";

/* Create game slice in state */
const gameSlice = createSlice({
  name: "GAME",
  initialState: initialGame,
  reducers: {
    START: (state, action) => {
      const game = { ...initialGame };
      game.levels = action.payload;
      return { ...game };
    },
    UPDATE_STATUS: (state, action) => {
      state.status = action.payload;
    },
    UPDATE_POINTS: (state, action) => {
      state.pointsCurrent = action.payload;
    },
    UPDATE_LEVELS: (state, action) => {
      state.levels = [...action.payload.map((a: any) => ({ ...a }))];
    },
    UPDATE_LEVEL_ACTIVE: (state, action) => {
      state.levelActive = action.payload;
    },
    UPDATE_CARDS: (state, action) => {
      state.cards = [...action.payload];
    },
    UPDATE_LEADERBOARD: (state, action) => {
      state.leaderboard = [...action.payload];
    },
    UPDATE_POSITIONS: (state, action) => {
      state.positions = { ...action.payload };
    },
    UPDATE_COUNTDOWN_ACTIONS: (state, action) => {
      state.countdownActions = [...action.payload];
    },
    PAUSE: (state, action) => {
      state.countdownActions = action.payload;
      state.status = GAME_STATUS.PAUSED;
    },
    RESUME: (state, action) => {
      state.countdownActions = action.payload;
      state.status = GAME_STATUS.ACTIVE;
    },
    CLEAN_COUNTDOWN_ACTIONS: (state) => {
      const currentTime = new Date().getTime();
      state.countdownActions = state.countdownActions.filter((countdownAction) => countdownAction.startTime + countdownAction.duration > currentTime);
    },
  },
});

const gameThunks = {
  // Adds an action with an argument after a given timeout countdown duration
  countdownActionAdd:
    (countdownActionType: COUNTDOWN_ACTION_TYPE, duration: number, countdownActionArgument?: GAME_POSITION | ICard["id"]): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`countdownActionAdd(${countdownActionType}, ${duration}, ${countdownActionArgument})`);

      const game = gameFacade.selector(getState());
      let countdownActions = game.countdownActions.map((a) => ({ ...a }));

      const countdown = {
        startTime: new Date().getTime(),
        duration: duration,
        timeout: window.setTimeout(() => {
          dispatch(gameFacade.thunk.countdownActionFire(countdownActionType, countdownActionArgument));
        }, duration),
        actionType: countdownActionType,
        actionArgument: countdownActionArgument,
      };
      countdownActions.push(countdown);

      // Save the new countdown
      dispatch(gameFacade.action.UPDATE_COUNTDOWN_ACTIONS(countdownActions));
    },

  // Fire a countdown action timeout, then clears from state
  countdownActionFire:
    (countdownAction: COUNTDOWN_ACTION_TYPE, args?: GAME_POSITION | ICard["id"]): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`countdownActionFire(${countdownAction}, ${args})`);

      switch (countdownAction) {
        case COUNTDOWN_ACTION_TYPE.CARD_ACTIVATE:
          // TODO: Pass correctly typed arguments
          //@ts-ignore
          dispatch(gameFacade.thunk.cardActivate(args));
          break;
        case COUNTDOWN_ACTION_TYPE.CARD_EXPIRE:
          dispatch(gameFacade.thunk.cardExpire(args));
          break;
        case COUNTDOWN_ACTION_TYPE.LEVEL_END:
          dispatch(gameFacade.thunk.levelEnd());
          break;
      }
      dispatch(gameFacade.action.CLEAN_COUNTDOWN_ACTIONS());
    },

  /* Pauses game and updates all saved countdown actions */
  gamePause: (): AppThunk => (dispatch, getState) => {
    debugMessage(`gamePause()`);

    const game = gameFacade.selector(getState());

    // Only pause if game status is active
    if (game.status !== GAME_STATUS.ACTIVE) {
      return;
    }

    const currentTime = new Date().getTime();
    const countdownActions = game.countdownActions.map((countdownAction) => {
      window.clearTimeout(countdownAction.timeout);
      return {
        startTime: 0,
        duration: countdownAction.startTime + countdownAction.duration - currentTime,
        timeout: 0,
        actionType: countdownAction.actionType,
        actionArgument: countdownAction.actionArgument,
      };
    });

    dispatch(gameFacade.action.PAUSE(countdownActions));
  },

  /* Resumes game from paused state */
  gameResume: (): AppThunk => (dispatch, getState) => {
    debugMessage(`gameResume()`);

    const game = gameFacade.selector(getState());
    let countdownActions = game.countdownActions.map((a) => ({ ...a }));

    const newStartTime = new Date().getTime();
    countdownActions = countdownActions.map((countdownAction) => ({
      startTime: newStartTime,
      duration: countdownAction.duration,
      timeout: window.setTimeout(() => {
        dispatch(gameFacade.thunk.countdownActionFire(countdownAction.actionType, countdownAction.actionArgument));
      }, countdownAction.duration),
      actionType: countdownAction.actionType,
      actionArgument: countdownAction.actionArgument,
    }));

    // Save the new countdowns
    dispatch(gameFacade.action.RESUME(countdownActions));
  },

  /* Start the game from initial state */
  gameStart:
    (startEra: keyof typeof levelEraOptions): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`gameStart(${startEra})`);

      const levels = initialLevels.map((level) => (level.number < 7 ? generateLevel([startEra], { ...level }) : { ...level }));

      dispatch(gameFacade.action.START(levels));
      dispatch(appFacade.thunk.transitionOutPage(() => dispatch(gameFacade.thunk.levelLoad())));
    },

  /* Initialize the next level based on the last level performance and start it */
  levelInit: (): AppThunk => (dispatch, getState) => {
    debugMessage(`levelInit()`);

    const game = gameFacade.selector(getState());

    let advance = 1;
    if (game.pointsCurrent >= game.levels[game.levelActive].pointsSkip) {
      advance++;
    }

    let levels = game.levels.map((a) => ({ ...a }));
    let nextLevel = 0;
    for (let i = 1; i <= advance; i++) {
      nextLevel = levels.findIndex((level) => level.number === levels[game.levelActive].number + i);
      if (nextLevel < 0) {
        levels.push({
          ...levels[game.levelActive],
          number: levels[game.levelActive].number + i,
          pointsPass: Math.min(levels[game.levelActive].pointsPass + i, MAX_CARDS),
        });
        nextLevel = levels.length - 1;
      }
    }

    dispatch(gameFacade.action.UPDATE_LEVELS(levels));
    dispatch(gameFacade.action.UPDATE_LEVEL_ACTIVE(nextLevel));
    dispatch(gameFacade.action.UPDATE_POINTS(0));

    dispatch(gameFacade.thunk.levelLoad());
  },

  /* Load the next level */
  levelLoad: (): AppThunk => async (dispatch, getState) => {
    debugMessage(`levelLoad()`);

    const game = gameFacade.selector(getState());
    const url = new URL("/cards", PUBLIC_URL);
    Object.entries(game.levels[game.levelActive].params).forEach((param) => {
      if (param[0] && param[1]) {
        url.searchParams.set(param[0], param[1]);
      }
    });

    let apiError: AxiosError | undefined;
    const response = await axios.get(url.toString()).catch((error: AxiosError) => {
      apiError = error;
    });

    if (apiError || !response || response.status !== 200) {
      dispatch(appFacade.thunk.handleError(`Level Load Error: ${response && response.statusText ? response?.statusText : apiError}`));
      return;
    }

    const cards = response.data
      .map(
        (card: ICard) =>
          ({
            ...card,
            position: POSITION_NONE.NONE,
            status: CARD_STATUS.PENDING,
          }) as ICard,
      )
      .slice(0, MAX_CARDS);

    if (cards.length !== MAX_CARDS) {
      dispatch(appFacade.thunk.handleError(`Card Load Error (${cards.length} cards loaded).`));
      return;
    }

    // Save the new level information
    dispatch(gameFacade.action.UPDATE_STATUS(GAME_STATUS.ACTIVE));
    dispatch(gameFacade.action.UPDATE_CARDS(cards));

    // Start the next level
    dispatch(appFacade.thunk.transitionInPage(APP_PAGE.GAME_ROUND, () => dispatch(gameFacade.thunk.levelStart())));
  },

  /* Begin playing a level */
  levelStart: (): AppThunk => (dispatch, getState) => {
    debugMessage(`levelStart()`);

    dispatch(gameFacade.thunk.countdownActionAdd(COUNTDOWN_ACTION_TYPE.CARD_ACTIVATE, 500, GAME_POSITION.ONE));
    dispatch(gameFacade.thunk.countdownActionAdd(COUNTDOWN_ACTION_TYPE.CARD_ACTIVATE, 1500, GAME_POSITION.TWO));
    dispatch(gameFacade.thunk.countdownActionAdd(COUNTDOWN_ACTION_TYPE.CARD_ACTIVATE, 2500, GAME_POSITION.THREE));
  },

  /* Level ends and updates status */
  levelEnd: (): AppThunk => (dispatch, getState) => {
    debugMessage(`levelEnd()`);

    const game = gameFacade.selector(getState());

    if (game.status !== GAME_STATUS.ACTIVE) {
      return;
    }

    // Check if they actually won the round
    const gameStatus = game.pointsCurrent >= game.levels[game.levelActive].pointsPass ? GAME_STATUS.INACTIVE : GAME_STATUS.LOST;

    dispatch(gameFacade.action.UPDATE_STATUS(gameStatus));

    dispatch(appFacade.thunk.transitionPage(APP_PAGE.RESULTS));
  },

  /* Activate a card in a given position */
  cardActivate:
    (position: GAME_POSITION | POSITION_NONE): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`cardActivate(${position})`);

      const game = gameFacade.selector(getState());

      let cards = game.cards.map((a) => ({ ...a }));

      // Find the next waiting card
      const cardIndex = cards.findIndex((card) => card.status === CARD_STATUS.PENDING);

      // If no waiting cards are found, return
      if (cardIndex < 0) {
        let positions = { ...game.positions };

        if (position === POSITION_NONE.NONE) {
          position = GAME_POSITION.ONE;
        }
        positions[position] = true;
        dispatch(gameFacade.action.UPDATE_POSITIONS(positions));

        const newPositions = gameFacade.selector(getState()).positions;

        // If there are no other active cards either, level is over
        if (newPositions.one && newPositions.two && newPositions.three && cards.filter((card) => card.status === CARD_STATUS.ACTIVE).length < 1) {
          dispatch(gameFacade.thunk.countdownActionAdd(COUNTDOWN_ACTION_TYPE.LEVEL_END, 1000));
        }
        return;
      }

      cards[cardIndex].status = CARD_STATUS.ACTIVE;
      cards[cardIndex].position = position;

      // TODO: Add hint type hiding logic

      // Expire the card in 20s
      dispatch(gameFacade.thunk.countdownActionAdd(COUNTDOWN_ACTION_TYPE.CARD_EXPIRE, 20000, cards[cardIndex].id));

      // Play new card sound
      dispatch(soundStageFacade.action.PLAY_SOUND("card-new"));

      dispatch(gameFacade.action.UPDATE_CARDS(cards));
    },

  /* Card expires and times out, gets replace by new card */
  cardExpire:
    (id: ICard["id"]): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`cardExpire(${id})`);

      const game = gameFacade.selector(getState());

      let cards = game.cards.map((a) => ({ ...a }));

      const cardIndex = cards.findIndex((card) => card.id === id);

      // Expiring card not found
      if (cardIndex < 0) {
        return;
      }

      // Card is not Active state
      if (cards[cardIndex].status !== CARD_STATUS.ACTIVE) {
        return;
      }

      cards[cardIndex].status = CARD_STATUS.EXPIRED;

      // Add sound effect "card-missed"
      dispatch(soundStageFacade.action.PLAY_SOUND("card-missed"));

      // Save new cards in state
      dispatch(gameFacade.action.UPDATE_CARDS(cards));

      // Free the position in 1s
      const position = cards[cardIndex].position;
      if (position !== "none") {
        dispatch(gameFacade.thunk.countdownActionAdd(COUNTDOWN_ACTION_TYPE.CARD_ACTIVATE, 3000, position));
      }
    },

  /* Handle guesses */
  guessProcess:
    (username: string, guess: string): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`guessProcess(${username}, ${guess})`);

      const game = gameFacade.selector(getState());
      const now = Date.now();

      // Exit if game is not active
      if (game.status !== GAME_STATUS.ACTIVE) {
        return;
      }

      let cards = game.cards.map((a) => ({ ...a })),
        leaderboard = game.leaderboard.map((a) => ({ ...a })),
        pointsCurrent = game.pointsCurrent;

      // Simplify input username
      username = username.trim().toLowerCase();

      const cardsActive = cards.filter(
        (card) => card.status === CARD_STATUS.ACTIVE || (card.solved && card.status === CARD_STATUS.SOLVED && card.solved > now - 2000),
      );

      // If no active cards, ignore
      if (cardsActive.length < 1) {
        return;
      }

      // Check guess against all active cards
      let guessCorrect = false;
      let cardIndex = -1;

      // For each active card
      cardsActive.every((card) => {
        // If the guess is incorrect, return
        const guessScore = fuzzyCompare(guess, card.name);
        if (guessScore < 0.9) {
          // Additional guess check for legendary creatures
          const legendBeforeCommaIndex = card.name.indexOf(",");
          if (legendBeforeCommaIndex < 2) {
            return true;
          }
          const guessLegendScore = fuzzyCompare(guess, card.name.substring(0, legendBeforeCommaIndex));
          if (guessLegendScore < 0.9) {
            return true;
          }
        }

        // Then guess must be correct
        guessCorrect = true;

        // Set card to solved
        cardIndex = cards.findIndex((cardOld) => cardOld.id === card.id);

        return false;
      });

      // If the guess was not correct or the index was not found, return false
      if (!guessCorrect || cardIndex < 0) {
        return false;
      }

      const gracePeriod = cards[cardIndex].status === CARD_STATUS.SOLVED && cards[cardIndex].solved;

      // If there are already solvers for this card, return false
      if (cards[cardIndex].solvers && cards[cardIndex].solvers.findIndex((solver) => solver === username) >= 0) {
        return false;
      }

      cards[cardIndex].status = CARD_STATUS.SOLVED;
      cards[cardIndex].solvers = cards[cardIndex].solvers ? [...cards[cardIndex].solvers, username] : [username];

      // Find if player already exists
      const playerIndex = leaderboard.findIndex((player: ILeaderboardPlayer) => player.username === username);

      // TODO: Variable points
      const points = 1;

      // If player exists, add a point. If not, add to leaderboard
      if (playerIndex >= 0) {
        leaderboard[playerIndex].points += points;
      } else {
        leaderboard.push({
          added: now,
          points: points,
          username: username,
        });
      }

      // If the card is not yet solved and in grace period
      if (!gracePeriod) {
        // Add points to round
        pointsCurrent += points;
        cards[cardIndex].solved = now;
      }

      // Sort leaderboard by top points and first to get a point
      leaderboard.sort((a, b) => (a.points > b.points || (a.points === b.points && a.added < b.added) ? -1 : 1));

      dispatch(gameFacade.action.UPDATE_CARDS(cards));
      dispatch(gameFacade.action.UPDATE_LEADERBOARD(leaderboard));
      dispatch(gameFacade.action.UPDATE_POINTS(pointsCurrent));

      if (!gracePeriod) {
        // Add sound effect "card-solved"
        dispatch(soundStageFacade.action.PLAY_SOUND("card-solved"));

        // Free the position in 3s
        dispatch(gameFacade.thunk.countdownActionAdd(COUNTDOWN_ACTION_TYPE.CARD_ACTIVATE, 3000, cards[cardIndex].position));
      }
    },
};

export const gameFacade = {
  action: gameSlice.actions,
  selector: (state: RootState) => state.game,
  thunk: gameThunks,
};

export const gameReducer = gameSlice.reducer;
