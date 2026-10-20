/* Shared DOM references and transient application UI state. */
export const edgesGroup = document.querySelector('#edgesGroup');
export const nodesGroup = document.querySelector('#nodesGroup');
export const squadGroup = document.querySelector('#squadGroup');
export const routeHL = document.querySelector('#routeHighlight');

export const navCard = document.querySelector('#navCard');
export const navCardBody = document.querySelector('#navCardBody');
export const squadCard = document.querySelector('#squadCard');
export const squadCardBody = document.querySelector('#squadCardBody');
export const telemetryCard = document.querySelector('#telemetryCard');
export const sosCard = document.querySelector('#sosCard');
export const sosCardBody = document.querySelector('#sosCardBody');
export const transcriptLog = document.querySelector('#transcriptLog');
export const textInput = document.querySelector('#textInput');
export const btnSendText = document.querySelector('#btnSendText');
export const btnMic = document.querySelector('#btnMic');
export const micStatus = document.querySelector('#micStatus');
export const clockDisplay = document.querySelector('#clockDisplay');
export const blizzardOvl = document.querySelector('#blizzardOverlay');

// Telemetry fields
export const telWind = document.querySelector('#telWind');
export const telTemp = document.querySelector('#telTemp');
export const telVis = document.querySelector('#telVis');
export const telSnow = document.querySelector('#telSnow');
export const telLift = document.querySelector('#telLift');
export const telIce = document.querySelector('#telIce');

export const telemetryElements = { telWind, telTemp, telVis, telSnow, telLift, telIce };

// API Key modal
export const apiKeyModal = document.querySelector('#apiKeyModal');
export const btnApiKey = document.querySelector('#btnApiKey');
export const btnCloseKeyModal = document.querySelector('#btnCloseKeyModal');
export const btnCancelKey = document.querySelector('#btnCancelKey');
export const btnSaveKey = document.querySelector('#btnSaveKey');
export const geminiKeyInput = document.querySelector('#geminiKeyInput');
export const groqKeyInput = document.querySelector('#groqKeyInput');

// Resort modal & switcher
export const btnChangeResort = document.querySelector('#btnChangeResort');
export const btnTopBarDeleteCustomResort = document.querySelector('#btnTopBarDeleteCustomResort');
export const topBarResortName = document.querySelector('#topBarResortName');
export const topBarResortAlt = document.querySelector('#topBarResortAlt');
export const resortModal = document.querySelector('#resortModal');
export const btnCloseResortModal = document.querySelector('#btnCloseResortModal');
export const resortSearchInput = document.querySelector('#resortSearchInput');
export const btnAiGenerateResort = document.querySelector('#btnAiGenerateResort');
export const resortStatusMessage = document.querySelector('#resortStatusMessage');
export const resortsListContainer = document.querySelector('#resortsListContainer');

// Account modal & switcher
export const btnSwitchAccount = document.querySelector('#btnSwitchAccount');
export const accountModal = document.querySelector('#accountModal');
export const btnCloseAccountModal = document.querySelector('#btnCloseAccountModal');
export const accountsListContainer = document.querySelector('#accountsListContainer');
export const customAccountName = document.querySelector('#customAccountName');
export const customAccountRole = document.querySelector('#customAccountRole');
export const customAccountSector = document.querySelector('#customAccountSector');
export const customColorSelector = document.querySelector('#customColorSelector');
export const customAvatarSelector = document.querySelector('#customAvatarSelector');
export const btnCreateSkierProfile = document.querySelector('#btnCreateSkierProfile');
export const chkAutoLoginCreated = document.querySelector('#chkAutoLoginCreated');
export const topBarAccountName = document.querySelector('#topBarAccountName');
export const topBarAccountLoc = document.querySelector('#topBarAccountLoc');

// HUD Navigation Tabs & Radio Comms
export const tabBtnTactical = document.querySelector('#tabBtnTactical');
export const tabBtnRadio = document.querySelector('#tabBtnRadio');
export const radioUnreadBadge = document.querySelector('#radioUnreadBadge');
export const tabViewTactical = document.querySelector('#tabViewTactical');
export const tabViewRadio = document.querySelector('#tabViewRadio');
export const radioFeed = document.querySelector('#radioFeed');
export const radioMsgCount = document.querySelector('#radioMsgCount');
export const activeChannelFilterLabel = document.querySelector('#activeChannelFilterLabel');
export const radioChannelFilters = document.querySelector('#radioChannelFilters');

export const appState = { activeTab: 'tactical', lastSOSTime: 0 };
