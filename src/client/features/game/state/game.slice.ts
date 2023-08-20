import axios, { AxiosError } from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "@client/redux";
import { PUBLIC_URL, debugMessage, deepCopy, guessCardName } from "@client/utils";
import { appFacade, APP_PAGE } from "@client/features/app";
import {
  CARD_STATUS,
  COUNTDOWN_ACTION_TYPE,
  GAME_POSITION,
  GAME_STATUS,
  initialGame,
  initialLevelPool,
  ICard,
  IGame,
  ILeaderboardPlayer,
  MAX_CARDS,
  levelModifierDifficulty,
  LEVEL_DIFFICULTY_KEY,
  defaultLevel,
} from "@client/features/game";
import { soundStageFacade } from "@client/features/sound-stage";

/* Create game slice in state */
const gameSlice = createSlice({
  name: "GAME",
  initialState: initialGame,
  reducers: {
    CLEAN_COUNTDOWN_ACTIONS: (state) => {
      const currentTime = new Date().getTime();
      state.countdownActions = state.countdownActions.filter((countdownAction) => countdownAction.startTime + countdownAction.duration > currentTime);
    },
    LEVEL_INITIALIZE: (
      state,
      action: {
        payload: { levelActive: IGame["levelActive"]; levelNumber: IGame["levelNumber"]; pointsCurrent: IGame["pointsCurrent"] };
      },
    ) => {
      state.levelActive = action.payload.levelActive;
      state.levelNumber = action.payload.levelNumber;
      state.pointsCurrent = action.payload.pointsCurrent;
    },
    LEVEL_LOADED: (state, action: { payload: { cards: IGame["cards"] } }) => {
      state.cards = action.payload.cards;
      state.status = GAME_STATUS.ACTIVE;
    },
    LEVEL_END: (
      state,
      action: { payload: { cards: IGame["cards"]; levelPool: IGame["levelPool"]; levelNumberNext: IGame["levelNumberNext"]; status: IGame["status"] } },
    ) => {
      state.cards = action.payload.cards;
      state.levelPool = action.payload.levelPool;
      state.levelNumberNext = action.payload.levelNumberNext;
      state.status = action.payload.status;
    },
    PAUSE: (state, action: { payload: { countdownActions: IGame["countdownActions"] } }) => {
      state.countdownActions = action.payload.countdownActions;
      state.status = GAME_STATUS.PAUSED;
    },
    PROCESS_GUESS: (state, action: { payload: { cards: IGame["cards"]; leaderboard: IGame["leaderboard"]; pointsCurrent: IGame["pointsCurrent"] } }) => {
      state.cards = action.payload.cards;
      state.leaderboard = action.payload.leaderboard;
      state.pointsCurrent = action.payload.pointsCurrent;
    },
    RESUME: (state, action: { payload: { countdownActions: IGame["countdownActions"] } }) => {
      state.countdownActions = action.payload.countdownActions;
      state.status = GAME_STATUS.ACTIVE;
    },
    START: (state, action: { payload: { difficulty: IGame["difficulty"]; levelActive: IGame["levelActive"]; levelPool: IGame["levelPool"] } }) => {
      return {
        ...initialGame,
        difficulty: action.payload.difficulty,
        levelActive: action.payload.levelActive,
        levelPool: action.payload.levelPool,
      };
    },
    UPDATE_CARDS: (state, action: { payload: { cards: IGame["cards"] } }) => {
      state.cards = action.payload.cards;
    },
    UPDATE_POSITIONS: (state, action: { payload: { positions: IGame["positions"] } }) => {
      state.positions = action.payload.positions;
    },
    UPDATE_COUNTDOWN_ACTIONS: (state, action: { payload: { countdownActions: IGame["countdownActions"] } }) => {
      state.countdownActions = action.payload.countdownActions;
    },
  },
});

const gameThunks = {
  /* Adds an action with an argument after a given timeout countdown duration */
  countdownActionAdd:
    (countdownActionType: COUNTDOWN_ACTION_TYPE, duration: number, countdownActionArgument?: GAME_POSITION | ICard["id"]): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`countdownActionAdd(${countdownActionType}, ${duration}, ${countdownActionArgument})`);

      const game = gameFacade.selector(getState());
      let countdownActions = deepCopy(game.countdownActions);

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
      dispatch(gameFacade.action.UPDATE_COUNTDOWN_ACTIONS({ countdownActions }));
    },

  /* Fire a countdown action timeout, then clears from state */
  countdownActionFire:
    (countdownAction: COUNTDOWN_ACTION_TYPE, args?: GAME_POSITION | ICard["id"]): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`countdownActionFire(${countdownAction}, ${args})`);

      switch (countdownAction) {
        case COUNTDOWN_ACTION_TYPE.CARD_ACTIVATE:
          dispatch(gameFacade.thunk.cardActivate(args as GAME_POSITION));
          break;
        case COUNTDOWN_ACTION_TYPE.CARD_EXPIRE:
          dispatch(gameFacade.thunk.cardExpire(args as ICard["id"]));
          break;
        case COUNTDOWN_ACTION_TYPE.LEVEL_END:
          dispatch(gameFacade.thunk.levelEnd());
          break;
      }
      dispatch(gameFacade.action.CLEAN_COUNTDOWN_ACTIONS());
    },

  /* Fire a countdown action timeout, then clears from state */
  countdownActionClear: (): AppThunk => (dispatch, getState) => {
    debugMessage(`countdownActionClear()`);

    const game = gameFacade.selector(getState());

    game.countdownActions.forEach((countdownAction) => {
      window.clearTimeout(countdownAction.timeout);
    });

    dispatch(gameFacade.action.UPDATE_COUNTDOWN_ACTIONS({ countdownActions: [] }));
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

    dispatch(gameFacade.action.PAUSE({ countdownActions }));
  },

  /* Resumes game from paused state */
  gameResume: (): AppThunk => (dispatch, getState) => {
    debugMessage(`gameResume()`);

    const game = gameFacade.selector(getState());
    let countdownActions = deepCopy(game.countdownActions);

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
    dispatch(gameFacade.action.RESUME({ countdownActions }));
  },

  /* Start the game from initial state */
  gameStart:
    (difficulty: LEVEL_DIFFICULTY_KEY, levelID: string): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`gameStart(${difficulty}, ${levelID})`);

      const levelPool = deepCopy(initialLevelPool).map((level) => ({
        ...level,
        ...levelModifierDifficulty[difficulty],
      }));

      const levelActive = levelPool.find((level) => level.id === levelID) || defaultLevel;

      dispatch(gameFacade.action.START({ difficulty, levelActive, levelPool }));
      dispatch(appFacade.thunk.transitionOutPage(() => dispatch(gameFacade.thunk.levelLoad())));
    },

  /* Initialize the next level based on the last level performance and start it */
  levelInitialize:
    (levelID: string): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`levelInitialize(${levelID})`);

      const game = gameFacade.selector(getState());

      const levelNumber = game.levelNumberNext;
      const levelActive = game.levelPool.find((level) => level.id === levelID) || defaultLevel;

      dispatch(
        gameFacade.action.LEVEL_INITIALIZE({
          levelActive,
          levelNumber,
          pointsCurrent: 0,
        }),
      );

      dispatch(gameFacade.thunk.levelLoad());
    },

  /* Load the next level */
  levelLoad: (): AppThunk => async (dispatch, getState) => {
    debugMessage(`levelLoad()`);

    const game = gameFacade.selector(getState());

    const url = new URL("/cards", PUBLIC_URL);
    Object.entries(game.levelActive.params).forEach((param) => {
      if (param[0] && param[1]) {
        url.searchParams.set(param[0], param[1]);
      }
    });

    let apiError: AxiosError | boolean = false;
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
            position: GAME_POSITION.NONE,
            status: CARD_STATUS.PENDING,
          }) as ICard,
      )
      .slice(0, MAX_CARDS);

    if (cards.length !== MAX_CARDS) {
      dispatch(appFacade.thunk.handleError(`Card Load Error (${cards.length} cards loaded).`));
      return;
    }

    // Save the new level information
    dispatch(gameFacade.action.LEVEL_LOADED({ cards }));

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
  levelEnd:
    (override: boolean = false): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`levelEnd(${override})`);

      const game = gameFacade.selector(getState());

      if (game.status !== GAME_STATUS.ACTIVE) {
        return;
      }

      const cards = deepCopy(game.cards).map((card) => ({
        ...card,
        status: card.status === CARD_STATUS.ACTIVE || card.status === CARD_STATUS.PENDING ? CARD_STATUS.EXPIRED : card.status,
      }));

      // Check if they actually won the round, or skip was used to override
      const status = override || game.pointsCurrent >= game.levelActive.pointsPass ? GAME_STATUS.INACTIVE : GAME_STATUS.LOST;

      let levelNumberNext = 0;
      if (status === GAME_STATUS.INACTIVE) {
        levelNumberNext = game.levelNumber + 1;
        if (game.pointsCurrent >= game.levelActive.pointsSkip) {
          levelNumberNext++;
        }
      }

      const levelPool = deepCopy(game.levelPool)
        .filter((level) => !level.maxNumber || !(level.id === game.levelActive.id || levelNumberNext > level.maxNumber))
        .sort(() => 0.5 - Math.random());

      dispatch(gameFacade.action.LEVEL_END({ cards, levelPool, levelNumberNext, status }));
      dispatch(gameFacade.thunk.countdownActionClear());
      dispatch(appFacade.thunk.transitionPage(APP_PAGE.RESULTS));
    },

  /* Activate a card in a given position */
  cardActivate:
    (position: GAME_POSITION): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`cardActivate(${position})`);

      const game = gameFacade.selector(getState());

      let cards = deepCopy(game.cards);

      // Find the next waiting card
      const cardIndex = cards.findIndex((card) => card.status === CARD_STATUS.PENDING);

      // If no waiting cards are found, return
      if (cardIndex < 0) {
        let positions = { ...game.positions };

        if (position === GAME_POSITION.NONE) {
          position = GAME_POSITION.ONE;
        }
        positions[position] = true;
        dispatch(gameFacade.action.UPDATE_POSITIONS({ positions }));

        const newPositions = gameFacade.selector(getState()).positions;

        // If there are no other active cards either, level is over
        if (newPositions.one && newPositions.two && newPositions.three && cards.filter((card) => card.status === CARD_STATUS.ACTIVE).length < 1) {
          dispatch(gameFacade.thunk.countdownActionAdd(COUNTDOWN_ACTION_TYPE.LEVEL_END, 500));
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

      dispatch(gameFacade.action.UPDATE_CARDS({ cards }));
    },

  /* Card expires and times out, gets replace by new card */
  cardExpire:
    (id: ICard["id"]): AppThunk =>
    (dispatch, getState) => {
      debugMessage(`cardExpire(${id})`);

      const game = gameFacade.selector(getState());

      let cards = deepCopy(game.cards);

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
      dispatch(gameFacade.action.UPDATE_CARDS({ cards }));

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

      let cards = deepCopy(game.cards),
        leaderboard = deepCopy(game.leaderboard),
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

      // For each active card, check the guess
      cardsActive.every((card) => {
        if (!guessCardName(guess, card.name, card.is_legend)) {
          return true;
        }

        // Set card to solved
        cardIndex = cards.findIndex((cardOld) => cardOld.id === card.id);
        guessCorrect = true;

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

      dispatch(
        gameFacade.action.PROCESS_GUESS({
          cards,
          leaderboard,
          pointsCurrent,
        }),
      );

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
