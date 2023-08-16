export const LEVEL_PARAM_RESET = "reset";

export enum LEVEL_PARAM_KEYS {
  MAX_DATE = "maxDate",
  MIN_DATE = "minDate",
  SET_TYPE = "setType",
}

export interface ILevelParams {
  [LEVEL_PARAM_KEYS.MAX_DATE]?: string | typeof LEVEL_PARAM_RESET;
  [LEVEL_PARAM_KEYS.MIN_DATE]?: string | typeof LEVEL_PARAM_RESET;
  [LEVEL_PARAM_KEYS.SET_TYPE]?: string | typeof LEVEL_PARAM_RESET;
}

export enum LEVEL_MODIFIER_TYPES {
  ERA = "Era",
  SET_TYPE = "Set Type",
}

export interface ILevelModifiers {
  labels?: {
    [key in LEVEL_MODIFIER_TYPES]?: string;
  };
  params?: ILevelParams;
}

export enum LEVEL_MODIFIER_KEYS {
  ERA_1993_1997 = "era-1993-1997",
  ERA_1998_2002 = "era-1998-2002",
  ERA_2003_2007 = "era-2003-2007",
  ERA_2008_2012 = "era-2008-2012",
  ERA_2013_2018 = "era-2013-2018",
  ERA_2019_NOW = "era-2019-now",
  ERA_ALL = "era-all",
  SET_TYPE_CORE_EXPANSION = "set-type-core-expansion",
  SET_TYPE_ALL = "set-type-all",
}

export const levelModifiers: { [key in LEVEL_MODIFIER_KEYS]?: ILevelModifiers } = {
  [LEVEL_MODIFIER_KEYS.ERA_1993_1997]: {
    labels: {
      [LEVEL_MODIFIER_TYPES.ERA]: "1993–1997",
    },
    params: {
      minDate: LEVEL_PARAM_RESET,
      maxDate: "1997-12-31",
    },
  },
  [LEVEL_MODIFIER_KEYS.ERA_1998_2002]: {
    labels: {
      [LEVEL_MODIFIER_TYPES.ERA]: "1998–2002",
    },
    params: {
      minDate: "1998-01-01",
      maxDate: "2002-12-31",
    },
  },
  [LEVEL_MODIFIER_KEYS.ERA_2003_2007]: {
    labels: {
      [LEVEL_MODIFIER_TYPES.ERA]: "2003–2007",
    },
    params: {
      minDate: "2003-01-01",
      maxDate: "2007-12-31",
    },
  },
  [LEVEL_MODIFIER_KEYS.ERA_2008_2012]: {
    labels: {
      [LEVEL_MODIFIER_TYPES.ERA]: "2008–2012",
    },
    params: {
      minDate: "2008-01-01",
      maxDate: "2012-12-31",
    },
  },
  [LEVEL_MODIFIER_KEYS.ERA_2013_2018]: {
    labels: {
      [LEVEL_MODIFIER_TYPES.ERA]: "2013–2018",
    },
    params: {
      minDate: "2013-01-01",
      maxDate: "2018-12-31",
    },
  },
  [LEVEL_MODIFIER_KEYS.ERA_2019_NOW]: {
    labels: {
      [LEVEL_MODIFIER_TYPES.ERA]: "2019–Now",
    },
    params: {
      minDate: "2019-01-01",
      maxDate: LEVEL_PARAM_RESET,
    },
  },
  [LEVEL_MODIFIER_KEYS.ERA_ALL]: {
    labels: {
      [LEVEL_MODIFIER_TYPES.ERA]: "All",
    },
    params: {
      minDate: LEVEL_PARAM_RESET,
      maxDate: LEVEL_PARAM_RESET,
    },
  },
  [LEVEL_MODIFIER_KEYS.SET_TYPE_CORE_EXPANSION]: {
    labels: {
      [LEVEL_MODIFIER_TYPES.SET_TYPE]: "Core/Expansion",
    },
    params: {
      setType: "core-expansion",
    },
  },
  [LEVEL_MODIFIER_KEYS.SET_TYPE_ALL]: {
    labels: {
      [LEVEL_MODIFIER_TYPES.SET_TYPE]: "All",
    },
    params: {
      setType: LEVEL_PARAM_RESET,
    },
  },
};

export const levelEraOptions: { [key in LEVEL_MODIFIER_KEYS]?: string } = [
  LEVEL_MODIFIER_KEYS.ERA_1993_1997,
  LEVEL_MODIFIER_KEYS.ERA_1998_2002,
  LEVEL_MODIFIER_KEYS.ERA_2003_2007,
  LEVEL_MODIFIER_KEYS.ERA_2008_2012,
  LEVEL_MODIFIER_KEYS.ERA_2013_2018,
  LEVEL_MODIFIER_KEYS.ERA_2019_NOW,
].reduce(
  (prev, key) => ({
    ...prev,
    [key]: levelModifiers[key].labels[LEVEL_MODIFIER_TYPES.ERA],
  }),
  {},
);

export interface ILevel extends ILevelModifiers {
  number: number;
  pointsPass: number;
  pointsSkip: number;
}

export interface ILevelActive extends ILevel {
  pointsCurrent: number;
}
