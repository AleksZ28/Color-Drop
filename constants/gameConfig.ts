export const dropColors = ["#FF0000", "#FFFF00", "#0000FF", "#FF8000", "#00FF00", "#FF00FF"];

export const colorComposition: { [key: string]: string[] } = {
  "#FF0000": ["red"],
  "#FFFF00": ["yellow"],
  "#0000FF": ["blue"],
  "#FF8000": ["red", "yellow"],
  "#00FF00": ["yellow", "blue"],
  "#FF00FF": ["red", "blue"]
};

export const tutorialSequence = ["#FF0000", "#FFFF00", "#FF8000", "#0000FF", "#0000FF"];

export const buffers = [
  {
    color: "#FF0000",
    fromAngleDeg: 0,
    toAngleDeg: 120
  },
  {
    color: "#FFFF00",
    fromAngleDeg: 120,
    toAngleDeg: 240
  },
  {
    color: "#0000FF",
    fromAngleDeg: 240,
    toAngleDeg: 360
  },
  {
    color: "#FF8000",
    fromAngleDeg: 100,
    toAngleDeg: 140
  },
  {
    color: "#00FF00",
    fromAngleDeg: 220,
    toAngleDeg: 260
  },
  {
    color: "#FF00FF",
    fromAngleDeg: 340,
    toAngleDeg: 20
  }
]

export const baseSpeedValue = 300;
export const tutorialSpeedValue = 150;
export const maxSpeedValue = 900;
export const speedMultiplier = 2;
export const multiplierThreshold = 3;
export const livesCount = 2;
export const dropRadiusValue = 20;

export const UPDATE_API_URL = "https://aleksz.dev/api/colordrop/version";