import { LEVEL_PARAM_RESET, ILevel, ILevelParams, LEVEL_MODIFIER_KEYS, levelModifiers } from "@client/features/game/models";

export const generateLevel = (MODIFIER_KEYS: LEVEL_MODIFIER_KEYS[], oldLevel?: ILevel): ILevel => {
  let level: ILevel = {
    number: oldLevel.number || 0,
    pointsPass: oldLevel.pointsPass || 0,
    pointsSkip: oldLevel.pointsSkip || 0,
    labels: oldLevel.labels || {},
    params: oldLevel.params || {},
  };

  MODIFIER_KEYS.forEach((MODIFIER_KEY) => {
    level.labels = {
      ...level?.labels,
      ...levelModifiers[MODIFIER_KEY]?.labels,
    };
    level.params = {
      ...level?.params,
      ...levelModifiers[MODIFIER_KEY]?.params,
    };
  });

  Object.entries(level.params).forEach(([key, value]) => {
    if (value === LEVEL_PARAM_RESET) {
      delete level.params[key as keyof ILevelParams];
    }
  });

  return level;
};

export const initialLevels: ILevel[] = [
  generateLevel([LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 1,
    pointsPass: 6,
    pointsSkip: 12,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 2,
    pointsPass: 8,
    pointsSkip: 16,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 3,
    pointsPass: 10,
    pointsSkip: 18,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 4,
    pointsPass: 12,
    pointsSkip: 20,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 5,
    pointsPass: 14,
    pointsSkip: 22,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 6,
    pointsPass: 16,
    pointsSkip: 24,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.ERA_ALL, LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 7,
    pointsPass: 12,
    pointsSkip: 18,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.ERA_ALL, LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 8,
    pointsPass: 14,
    pointsSkip: 20,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.ERA_ALL, LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 9,
    pointsPass: 16,
    pointsSkip: 22,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.ERA_ALL, LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION], {
    number: 10,
    pointsPass: 18,
    pointsSkip: 24,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.ERA_ALL, LEVEL_MODIFIER_KEYS.SET_TYPE_ALL], {
    number: 11,
    pointsPass: 16,
    pointsSkip: 22,
  }),
  generateLevel([LEVEL_MODIFIER_KEYS.ERA_ALL, LEVEL_MODIFIER_KEYS.SET_TYPE_ALL], {
    number: 12,
    pointsPass: 18,
    pointsSkip: 24,
  }),
];
