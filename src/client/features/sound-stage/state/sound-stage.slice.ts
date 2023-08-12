import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@client/redux";
import { initialSoundStage } from "@client/features/sound-stage";

const soundStageSlice = createSlice({
  name: "SOUND_STAGE",
  initialState: initialSoundStage,
  reducers: {
    TOGGLE_MUTE: (state, action) => {
      state.muted = action.payload;
    },
    PLAY_SOUND: (state, action) => {
      const key: string = action.payload;
      const sound = state.sounds.find((sound) => sound.name === key);
      if (sound) {
        state.sound = sound.name;
        state.updated = Date.now();
      }
    },
  },
});

export const soundStageFacade = {
  action: soundStageSlice.actions,
  selector: (state: RootState) => state.soundStage,
  thunk: {},
};

export const soundStageReducer = soundStageSlice.reducer;
