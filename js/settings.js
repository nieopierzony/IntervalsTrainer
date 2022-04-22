"use strict";

const MIN_GAMES_AMOUNT = 1;
const MAX_GAMES_AMOUNT = 99;

const defaultSettings = {
  gamesAmount: 10,
  clefs: { g: true, f: false },
  accidentals: { natural: true, sharp: true, flat: false },
  onlyAudio: false,
};

const gamesAmountInput = getElement("gamesAmountInput");

const clefGCheckbox = getElement("clefG");
const clefFCheckbox = getElement("clefF");

const sharpCheckbox = getElement("sharp");
const flatCheckbox = getElement("flat");
const naturalCheckbox = getElement("natural");

const staffCheckbox = getElement("withStaff");
const audioCheckbox = getElement("audio");

const inputsToSettings = [
  {
    input: gamesAmountInput,
    valueName: "value",
    path: "gamesAmount",
    format: (val) => +val,
    validate: (value) => {
      const isValidNumber = !isNaN(+value);
      const isInLimit = value <= MAX_GAMES_AMOUNT || value <= MIN_GAMES_AMOUNT;
      return isValidNumber && isInLimit;
    },
  },
  { input: clefGCheckbox, valueName: "checked", path: "clefs.g" },
  { input: clefFCheckbox, valueName: "checked", path: "clefs.f" },
  { input: sharpCheckbox, valueName: "checked", path: "accidentals.sharp" },
  { input: flatCheckbox, valueName: "checked", path: "accidentals.flat" },
  { input: naturalCheckbox, valueName: "checked", path: "accidentals.natural" },
  {
    input: staffCheckbox,
    valueName: "checked",
    path: "onlyAudio",
    format: (val) => !val,
  },
  { input: audioCheckbox, valueName: "checked", path: "onlyAudio" },
];

const inputChangeHandler = ({ srcElement }) => {
  try {
    const { id } = srcElement;
    const { gameSettings, resolvePath, updateValueByPath } = window;
    const relation = inputsToSettings.find((el) => el.input.id === id);
    if (!relation) throw new Error("Relation not found", srcElement);
    const { valueName, path, validate, format } = relation;
    let resolvedSettingsValue = resolvePath(gameSettings, path);
    const isValidData = validate ? validate(srcElement[valueName]) : true;
    if (!isValidData) {
      // Set old value
      srcElement[valueName] = resolvedSettingsValue;
      throw new Error("Data are not valid");
    }
    const formatted = format
      ? format(srcElement[valueName])
      : srcElement[valueName];
    updateValueByPath(gameSettings, path, formatted);
    updateSettings();
  } catch (err) {
    console.error(err);
  }
};

const updateSettings = (newData = window.gameSettings) =>
  window.setLocalStorageItem("settings", newData);

const loadSettings = () => {
  const settings = window.getLocalStorageItem("settings");
  if (!settings) {
    const isUpdateOk = updateSettings(defaultSettings);
    if (!isUpdateOk) throw new Error("Update was not ok");
    return loadSettings();
  }
  window.gameSettings = settings;
  const { resolvePath, gameSettings } = window;
  for (const toChange of inputsToSettings) {
    const { input, valueName, path, format } = toChange;
    const resolvedData = resolvePath(gameSettings, path);
    const formatted = format ? format(resolvedData) : resolvedData;
    input[valueName] = formatted;
    input.addEventListener("change", inputChangeHandler);
  }
};

/* Games amount */
const gamesAmountMinus = getElement("amountMinus");
const gamesAmountPlus = getElement("amountPlus");

const setGamesAmount = (amount = defaultSettings.gamesAmount) => {
  gamesAmountInput.value = amount;
  window.gameSettings.gamesAmount = amount;
  updateSettings();
};

const decrementGamesAmount = () => {
  const { gamesAmount } = window.gameSettings;
  if (gamesAmount <= MIN_GAMES_AMOUNT) return;
  setGamesAmount(gamesAmount - 1);
};

const incrementGamesAmount = () => {
  const { gamesAmount } = window.gameSettings;
  if (gamesAmount >= MAX_GAMES_AMOUNT) return;
  setGamesAmount(gamesAmount + 1);
};

gamesAmountMinus.addEventListener("click", decrementGamesAmount);
gamesAmountPlus.addEventListener("click", incrementGamesAmount);

loadSettings();
