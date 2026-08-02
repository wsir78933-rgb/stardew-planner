const referenceRuntimeRootSelector = "#reference-runtime-root";
const canvasContainerSelector = ".canvas-container";
const toolbarSelector = ".toolbar";
const canvasContainerClassName = "canvas-container";
const toolbarClassName = "toolbar";
const toolGroupClassName = "tool-group";
const separatorClassName = "separator";
const wheelZoomGroupClassName = "reference-runtime-wheel-zoom-group";
const wheelZoomSeparatorClassName = "reference-runtime-wheel-zoom-separator";
const wheelZoomSeparatorMarkerAttribute =
  "data-reference-runtime-wheel-zoom-separator";
const wheelZoomGroupMarkerAttribute = "data-reference-runtime-wheel-zoom-group";
const wheelZoomButtonMarkerAttribute =
  "data-reference-runtime-wheel-zoom-button";
const wheelZoomStableMarkerValue = "true";
const wheelZoomInstallationMarkerAttribute =
  "data-reference-runtime-wheel-zoom-mode-toggle";
const wheelZoomInstallationMarkerValue = "installed";
const eraseActionTitle = "Erase (E)";
const undoActionTitle = "Undo (Ctrl+Z)";
const enableWheelZoomLabel = "Enable wheel zoom";
const disableWheelZoomLabel = "Disable wheel zoom";
const wheelZoomButtonText = "Zoom";

const wheelZoomInstallationsByRuntimeRoot = new WeakMap();

function describeReceivedValue(receivedValue) {
  if (typeof receivedValue === "string") {
    return JSON.stringify(receivedValue);
  }

  if (receivedValue === undefined) {
    return "undefined";
  }

  return JSON.stringify(receivedValue);
}

function assertReferenceRuntimeDocumentCompatibleBoundary(referenceRuntimeDocument) {
  if (
    typeof referenceRuntimeDocument !== "object" ||
    referenceRuntimeDocument === null ||
    typeof referenceRuntimeDocument.querySelectorAll !== "function" ||
    typeof referenceRuntimeDocument.createElement !== "function" ||
    typeof referenceRuntimeDocument.addEventListener !== "function"
  ) {
    throw new TypeError(
      `Reference runtime document must provide callable querySelectorAll, createElement, and addEventListener methods. Received: ${describeReceivedValue(referenceRuntimeDocument)}.`,
    );
  }
}

function selectExactlyOne(referenceRuntimeDocument, selector, expectedDescription) {
  const selectedElements = Array.from(referenceRuntimeDocument.querySelectorAll(selector));

  if (selectedElements.length !== 1) {
    throw new Error(
      `Expected exactly one ${expectedDescription}. Selector: ${JSON.stringify(selector)}. Received count: ${String(selectedElements.length)}.`,
    );
  }

  return selectedElements[0];
}

function selectExactlyOneToolbarActionButton(toolbar, actionTitle) {
  const actionButtons = Array.from(toolbar.querySelectorAll("button")).filter(
    (toolbarButton) => toolbarButton.getAttribute("title") === actionTitle,
  );

  if (actionButtons.length !== 1) {
    throw new Error(
      `Expected exactly one toolbar button with title ${JSON.stringify(actionTitle)}. Received count: ${String(actionButtons.length)}.`,
    );
  }

  return actionButtons[0];
}

function describeReferenceRuntimeElementTag(referenceRuntimeElement) {
  return referenceRuntimeElement === null
    ? null
    : referenceRuntimeElement.tagName ?? null;
}

function describeReferenceRuntimeElementClass(referenceRuntimeElement) {
  if (referenceRuntimeElement === null) {
    return null;
  }

  const classAttribute = referenceRuntimeElement.getAttribute("class");
  if (classAttribute !== null) {
    return classAttribute;
  }

  if (referenceRuntimeElement.classList.contains(toolGroupClassName)) {
    return toolGroupClassName;
  }

  if (referenceRuntimeElement.classList.contains(separatorClassName)) {
    return separatorClassName;
  }

  if (referenceRuntimeElement.classList.contains(canvasContainerClassName)) {
    return canvasContainerClassName;
  }

  if (referenceRuntimeElement.classList.contains(toolbarClassName)) {
    return toolbarClassName;
  }

  return null;
}

function describeReferenceRuntimeElementTitle(referenceRuntimeElement) {
  return referenceRuntimeElement === null
    ? null
    : referenceRuntimeElement.getAttribute("title");
}

function assertReferenceRuntimeDescendant(
  referenceRuntimeRoot,
  referenceRuntimeElement,
  elementDescription,
) {
  for (
    let ancestor = referenceRuntimeElement;
    ancestor !== null;
    ancestor = ancestor.parentElement
  ) {
    if (ancestor === referenceRuntimeRoot) {
      return;
    }
  }

  throw new Error(
    `Resolved ${elementDescription} must be below the reference runtime root. Received ${elementDescription} tag: ${JSON.stringify(describeReferenceRuntimeElementTag(referenceRuntimeElement))}. Received ${elementDescription} class: ${JSON.stringify(describeReferenceRuntimeElementClass(referenceRuntimeElement))}.`,
  );
}

function resolveDirectToolbarToolGroup(toolbar, actionButton, actionTitle) {
  const actionToolGroup = actionButton.parentElement;

  if (
    actionToolGroup === null ||
    !actionToolGroup.classList.contains(toolGroupClassName)
  ) {
    throw new Error(
      `Toolbar action button must be inside a .${toolGroupClassName}. Received action title: ${JSON.stringify(actionTitle)}. Received action parent tag: ${JSON.stringify(describeReferenceRuntimeElementTag(actionToolGroup))}. Received action parent class: ${JSON.stringify(describeReferenceRuntimeElementClass(actionToolGroup))}.`,
    );
  }

  if (actionToolGroup.parentElement !== toolbar) {
    throw new Error(
      `Toolbar action button must be in a direct .${toolGroupClassName} child of the resolved toolbar. Received action title: ${JSON.stringify(actionTitle)}. Received toolbar tag: ${JSON.stringify(describeReferenceRuntimeElementTag(actionToolGroup.parentElement))}. Received toolbar class: ${JSON.stringify(describeReferenceRuntimeElementClass(actionToolGroup.parentElement))}.`,
    );
  }

  return actionToolGroup;
}

function describeToolbarChildAtIndex(toolbarChildren, childIndex, childDescription) {
  const toolbarChild = toolbarChildren[childIndex] ?? null;

  return `Received ${childDescription} index: ${String(childIndex)}. Received ${childDescription} tag: ${JSON.stringify(describeReferenceRuntimeElementTag(toolbarChild))}. Received ${childDescription} class: ${JSON.stringify(describeReferenceRuntimeElementClass(toolbarChild))}. Received ${childDescription} title: ${JSON.stringify(describeReferenceRuntimeElementTitle(toolbarChild))}.`;
}

function resolveRetainedUndoSeparator(toolbar, eraseToolGroup, undoToolGroup) {
  const toolbarChildren = Array.from(toolbar.children);
  const eraseToolGroupIndex = toolbarChildren.indexOf(eraseToolGroup);
  const undoToolGroupIndex = toolbarChildren.indexOf(undoToolGroup);
  const retainedUndoSeparatorIndex = undoToolGroupIndex - 1;
  const retainedUndoSeparator =
    toolbarChildren[retainedUndoSeparatorIndex] ?? null;

  if (
    retainedUndoSeparator === null ||
    !retainedUndoSeparator.classList.contains(separatorClassName)
  ) {
    throw new Error(
      `Expected a .${separatorClassName} directly before the undo tool group. ${describeToolbarChildAtIndex(toolbarChildren, retainedUndoSeparatorIndex, "retained undo separator")}`,
    );
  }

  if (eraseToolGroupIndex >= retainedUndoSeparatorIndex) {
    throw new Error(
      `Expected the erase tool group to precede the retained undo separator. ${describeToolbarChildAtIndex(toolbarChildren, eraseToolGroupIndex, "erase tool group")} ${describeToolbarChildAtIndex(toolbarChildren, retainedUndoSeparatorIndex, "retained undo separator")} ${describeToolbarChildAtIndex(toolbarChildren, undoToolGroupIndex, "undo tool group")}`,
    );
  }

  return retainedUndoSeparator;
}

function collectDescendantElementsWithAttribute(
  referenceRuntimeElement,
  attributeName,
) {
  const matchingElements = [];

  for (const childElement of Array.from(referenceRuntimeElement.children)) {
    if (childElement.getAttribute(attributeName) !== null) {
      matchingElements.push(childElement);
    }

    matchingElements.push(
      ...collectDescendantElementsWithAttribute(childElement, attributeName),
    );
  }

  return matchingElements;
}

function assertSingleCompatibleStableMarkerValue(
  markerElement,
  markerAttribute,
  markerDescription,
) {
  const markerValue = markerElement.getAttribute(markerAttribute);

  if (markerValue !== wheelZoomStableMarkerValue) {
    throw new Error(
      `Existing ${markerDescription} marker must equal ${JSON.stringify(wheelZoomStableMarkerValue)}. Received marker value: ${describeReceivedValue(markerValue)}. Received marker tag: ${JSON.stringify(describeReferenceRuntimeElementTag(markerElement))}. Received marker class: ${JSON.stringify(describeReferenceRuntimeElementClass(markerElement))}.`,
    );
  }
}

function assertExistingWheelZoomElementContract(
  wheelZoomElement,
  elementDescription,
  expectedTagName,
  expectedClassNames,
) {
  const hasExpectedClasses = expectedClassNames.every((className) =>
    wheelZoomElement.classList.contains(className),
  );

  if (
    wheelZoomElement.tagName !== expectedTagName ||
    !hasExpectedClasses
  ) {
    throw new Error(
      `Existing ${elementDescription} has an incompatible structure. Received tag: ${JSON.stringify(describeReferenceRuntimeElementTag(wheelZoomElement))}. Received class: ${JSON.stringify(describeReferenceRuntimeElementClass(wheelZoomElement))}.`,
    );
  }
}

function resolveExistingWheelZoomToolbarControl(runtimeContract) {
  const wheelZoomSeparators = collectDescendantElementsWithAttribute(
    runtimeContract.toolbar,
    wheelZoomSeparatorMarkerAttribute,
  );
  const wheelZoomGroups = collectDescendantElementsWithAttribute(
    runtimeContract.toolbar,
    wheelZoomGroupMarkerAttribute,
  );
  const wheelZoomButtons = collectDescendantElementsWithAttribute(
    runtimeContract.toolbar,
    wheelZoomButtonMarkerAttribute,
  );
  const markerCounts = [
    wheelZoomSeparators.length,
    wheelZoomGroups.length,
    wheelZoomButtons.length,
  ];

  if (markerCounts.every((markerCount) => markerCount === 0)) {
    return null;
  }

  if (markerCounts.some((markerCount) => markerCount !== 1)) {
    throw new Error(
      `Expected either zero stable wheel zoom markers or exactly one compatible structure. Received stable marker counts: separator=${String(wheelZoomSeparators.length)}, group=${String(wheelZoomGroups.length)}, button=${String(wheelZoomButtons.length)}.`,
    );
  }

  const wheelZoomSeparator = wheelZoomSeparators[0];
  const wheelZoomGroup = wheelZoomGroups[0];
  const wheelZoomButton = wheelZoomButtons[0];
  const toolbarChildren = Array.from(runtimeContract.toolbar.children);
  const eraseToolGroupIndex = toolbarChildren.indexOf(runtimeContract.eraseToolGroup);
  const wheelZoomSeparatorIndex = toolbarChildren.indexOf(wheelZoomSeparator);
  const wheelZoomGroupIndex = toolbarChildren.indexOf(wheelZoomGroup);
  const retainedUndoSeparatorIndex = toolbarChildren.indexOf(
    runtimeContract.retainedUndoSeparator,
  );
  const undoToolGroupIndex = toolbarChildren.indexOf(runtimeContract.undoToolGroup);

  assertSingleCompatibleStableMarkerValue(
    wheelZoomSeparator,
    wheelZoomSeparatorMarkerAttribute,
    "wheel zoom separator",
  );
  assertSingleCompatibleStableMarkerValue(
    wheelZoomGroup,
    wheelZoomGroupMarkerAttribute,
    "wheel zoom group",
  );
  assertSingleCompatibleStableMarkerValue(
    wheelZoomButton,
    wheelZoomButtonMarkerAttribute,
    "wheel zoom button",
  );
  assertExistingWheelZoomElementContract(
    wheelZoomSeparator,
    "wheel zoom separator",
    "DIV",
    [separatorClassName, wheelZoomSeparatorClassName],
  );
  assertExistingWheelZoomElementContract(
    wheelZoomGroup,
    "wheel zoom group",
    "DIV",
    [toolGroupClassName, wheelZoomGroupClassName],
  );
  assertExistingWheelZoomElementContract(
    wheelZoomButton,
    "wheel zoom button",
    "BUTTON",
    [],
  );

  if (
    wheelZoomSeparator.parentElement !== runtimeContract.toolbar ||
    wheelZoomGroup.parentElement !== runtimeContract.toolbar ||
    wheelZoomButton.parentElement !== wheelZoomGroup ||
    wheelZoomGroup.children.length !== 1 ||
    toolbarChildren[eraseToolGroupIndex + 1] !== wheelZoomSeparator ||
    toolbarChildren[wheelZoomSeparatorIndex + 1] !== wheelZoomGroup ||
    toolbarChildren[wheelZoomGroupIndex + 1] !== runtimeContract.retainedUndoSeparator ||
    toolbarChildren[retainedUndoSeparatorIndex + 1] !== runtimeContract.undoToolGroup
  ) {
    throw new Error(
      `Existing wheel zoom markers must form the direct Erase/separator/group/retained-separator/Undo structure. ${describeToolbarChildAtIndex(toolbarChildren, eraseToolGroupIndex, "erase tool group")} ${describeToolbarChildAtIndex(toolbarChildren, wheelZoomSeparatorIndex, "wheel zoom separator")} ${describeToolbarChildAtIndex(toolbarChildren, wheelZoomGroupIndex, "wheel zoom group")} ${describeToolbarChildAtIndex(toolbarChildren, retainedUndoSeparatorIndex, "retained undo separator")} ${describeToolbarChildAtIndex(toolbarChildren, undoToolGroupIndex, "undo tool group")}`,
    );
  }

  if (
    wheelZoomButton.getAttribute("type") !== "button" ||
    wheelZoomButton.innerHTML !== wheelZoomButtonText ||
    wheelZoomButton.getAttribute("aria-pressed") !== "false" ||
    wheelZoomButton.getAttribute("aria-label") !== enableWheelZoomLabel ||
    wheelZoomButton.getAttribute("title") !== enableWheelZoomLabel
  ) {
    throw new Error(
      `Existing wheel zoom button is incompatible. Received button type: ${describeReceivedValue(wheelZoomButton.getAttribute("type"))}. Received button aria-pressed: ${describeReceivedValue(wheelZoomButton.getAttribute("aria-pressed"))}. Received button aria-label: ${describeReceivedValue(wheelZoomButton.getAttribute("aria-label"))}. Received button title: ${describeReceivedValue(wheelZoomButton.getAttribute("title"))}. Received button content: ${describeReceivedValue(wheelZoomButton.innerHTML)}.`,
    );
  }

  return { wheelZoomButton };
}

function assertFirstTimeWheelZoomInsertionPosition(runtimeContract) {
  const toolbarChildren = Array.from(runtimeContract.toolbar.children);
  const eraseToolGroupIndex = toolbarChildren.indexOf(runtimeContract.eraseToolGroup);
  const retainedUndoSeparatorIndex = toolbarChildren.indexOf(
    runtimeContract.retainedUndoSeparator,
  );
  const undoToolGroupIndex = toolbarChildren.indexOf(runtimeContract.undoToolGroup);

  if (eraseToolGroupIndex + 1 !== retainedUndoSeparatorIndex) {
    throw new Error(
      `Expected the retained undo separator directly after the erase tool group before first wheel zoom insertion. ${describeToolbarChildAtIndex(toolbarChildren, eraseToolGroupIndex, "erase tool group")} ${describeToolbarChildAtIndex(toolbarChildren, eraseToolGroupIndex + 1, "child after erase tool group")} ${describeToolbarChildAtIndex(toolbarChildren, retainedUndoSeparatorIndex, "retained undo separator")} ${describeToolbarChildAtIndex(toolbarChildren, undoToolGroupIndex, "undo tool group")}`,
    );
  }
}

function resolveReferenceRuntimeWheelZoomContract(referenceRuntimeDocument) {
  const referenceRuntimeRoot = selectExactlyOne(
    referenceRuntimeDocument,
    referenceRuntimeRootSelector,
    "reference runtime root",
  );
  const canvasContainer = selectExactlyOne(
    referenceRuntimeDocument,
    canvasContainerSelector,
    "canvas container",
  );
  const toolbar = selectExactlyOne(
    referenceRuntimeDocument,
    toolbarSelector,
    "toolbar",
  );
  assertReferenceRuntimeDescendant(
    referenceRuntimeRoot,
    canvasContainer,
    "canvas container",
  );
  assertReferenceRuntimeDescendant(referenceRuntimeRoot, toolbar, "toolbar");
  const eraseButton = selectExactlyOneToolbarActionButton(toolbar, eraseActionTitle);
  const undoButton = selectExactlyOneToolbarActionButton(toolbar, undoActionTitle);
  const eraseToolGroup = resolveDirectToolbarToolGroup(
    toolbar,
    eraseButton,
    eraseActionTitle,
  );
  const undoToolGroup = resolveDirectToolbarToolGroup(
    toolbar,
    undoButton,
    undoActionTitle,
  );
  const retainedUndoSeparator = resolveRetainedUndoSeparator(
    toolbar,
    eraseToolGroup,
    undoToolGroup,
  );

  return {
    referenceRuntimeDocument,
    referenceRuntimeRoot,
    canvasContainer,
    toolbar,
    eraseToolGroup,
    undoToolGroup,
    retainedUndoSeparator,
  };
}

function readExistingWheelZoomInstallation(referenceRuntimeRoot) {
  const installationMarker = referenceRuntimeRoot.getAttribute(
    wheelZoomInstallationMarkerAttribute,
  );
  const existingInstallation = wheelZoomInstallationsByRuntimeRoot.get(
    referenceRuntimeRoot,
  );

  if (installationMarker === null && existingInstallation === undefined) {
    return null;
  }

  if (
    installationMarker !== wheelZoomInstallationMarkerValue ||
    existingInstallation === undefined
  ) {
    throw new Error(
      `Wheel zoom installation marker does not match a valid installation record. Received marker: ${describeReceivedValue(installationMarker)}.`,
    );
  }

  return existingInstallation;
}

function assertWheelZoomEnabledValue(isWheelZoomEnabled) {
  if (typeof isWheelZoomEnabled !== "boolean") {
    throw new TypeError(
      `Wheel zoom enabled state must be a boolean. Received: ${describeReceivedValue(isWheelZoomEnabled)}.`,
    );
  }
}

function applyWheelZoomButtonState(wheelZoomButton, isWheelZoomEnabled) {
  const actionLabel = isWheelZoomEnabled
    ? disableWheelZoomLabel
    : enableWheelZoomLabel;

  wheelZoomButton.setAttribute("aria-pressed", String(isWheelZoomEnabled));
  wheelZoomButton.setAttribute("aria-label", actionLabel);
  wheelZoomButton.setAttribute("title", actionLabel);
}

function createWheelZoomState() {
  let isWheelZoomEnabled = false;
  let wheelZoomButton = null;

  return {
    isWheelZoomEnabled() {
      return isWheelZoomEnabled;
    },
    setWheelZoomEnabled(nextWheelZoomEnabledValue) {
      assertWheelZoomEnabledValue(nextWheelZoomEnabledValue);
      isWheelZoomEnabled = nextWheelZoomEnabledValue;

      if (wheelZoomButton !== null) {
        applyWheelZoomButtonState(wheelZoomButton, isWheelZoomEnabled);
      }
    },
    attachWheelZoomButton(nextWheelZoomButton) {
      wheelZoomButton = nextWheelZoomButton;
      applyWheelZoomButtonState(wheelZoomButton, isWheelZoomEnabled);
    },
  };
}

function createWheelZoomButton(referenceRuntimeDocument, wheelZoomState) {
  const wheelZoomButton = referenceRuntimeDocument.createElement("button");

  wheelZoomButton.setAttribute(
    wheelZoomButtonMarkerAttribute,
    wheelZoomStableMarkerValue,
  );
  wheelZoomButton.setAttribute("type", "button");
  wheelZoomButton.innerHTML = wheelZoomButtonText;
  connectWheelZoomButtonToState(wheelZoomButton, wheelZoomState);

  return wheelZoomButton;
}

function connectWheelZoomButtonToState(wheelZoomButton, wheelZoomState) {
  wheelZoomButton.addEventListener("click", () => {
    wheelZoomState.setWheelZoomEnabled(!wheelZoomState.isWheelZoomEnabled());
  });
  wheelZoomState.attachWheelZoomButton(wheelZoomButton);
}

function insertWheelZoomToolbarControl(runtimeContract, wheelZoomButton) {
  const wheelZoomSeparator = runtimeContract.referenceRuntimeDocument.createElement(
    "div",
  );
  const wheelZoomGroup = runtimeContract.referenceRuntimeDocument.createElement("div");

  wheelZoomSeparator.setAttribute(
    wheelZoomSeparatorMarkerAttribute,
    wheelZoomStableMarkerValue,
  );
  wheelZoomGroup.setAttribute(
    wheelZoomGroupMarkerAttribute,
    wheelZoomStableMarkerValue,
  );
  wheelZoomSeparator.classList.add(separatorClassName);
  wheelZoomSeparator.classList.add(wheelZoomSeparatorClassName);
  wheelZoomGroup.classList.add(toolGroupClassName);
  wheelZoomGroup.classList.add(wheelZoomGroupClassName);
  wheelZoomGroup.append(wheelZoomButton);
  runtimeContract.toolbar.insertBefore(
    wheelZoomSeparator,
    runtimeContract.retainedUndoSeparator,
  );
  runtimeContract.toolbar.insertBefore(
    wheelZoomGroup,
    runtimeContract.retainedUndoSeparator,
  );
}

function installWheelEventGate(
  referenceRuntimeDocument,
  canvasContainer,
  wheelZoomState,
) {
  referenceRuntimeDocument.addEventListener(
    "wheel",
    (wheelEvent) => {
      if (wheelZoomState.isWheelZoomEnabled()) {
        return;
      }

      if (
        wheelEvent.target !== null &&
        typeof wheelEvent.target.closest === "function" &&
        wheelEvent.target.closest(canvasContainerSelector) === canvasContainer
      ) {
        wheelEvent.stopPropagation();
      }
    },
    true,
  );
}

function storeWheelZoomInstallation(referenceRuntimeRoot, wheelZoomState) {
  const wheelZoomInstallation = Object.freeze({
    isWheelZoomEnabled: wheelZoomState.isWheelZoomEnabled,
    setWheelZoomEnabled: wheelZoomState.setWheelZoomEnabled,
  });

  referenceRuntimeRoot.setAttribute(
    wheelZoomInstallationMarkerAttribute,
    wheelZoomInstallationMarkerValue,
  );
  wheelZoomInstallationsByRuntimeRoot.set(
    referenceRuntimeRoot,
    wheelZoomInstallation,
  );

  return wheelZoomInstallation;
}

export function installReferenceRuntimeWheelZoomModeToggle(
  referenceRuntimeDocument,
) {
  assertReferenceRuntimeDocumentCompatibleBoundary(referenceRuntimeDocument);
  const runtimeContract = resolveReferenceRuntimeWheelZoomContract(
    referenceRuntimeDocument,
  );
  const existingInstallation = readExistingWheelZoomInstallation(
    runtimeContract.referenceRuntimeRoot,
  );

  if (existingInstallation !== null) {
    return existingInstallation;
  }

  const existingWheelZoomToolbarControl = resolveExistingWheelZoomToolbarControl(
    runtimeContract,
  );

  if (existingWheelZoomToolbarControl === null) {
    assertFirstTimeWheelZoomInsertionPosition(runtimeContract);
  }

  const wheelZoomState = createWheelZoomState();
  const wheelZoomButton =
    existingWheelZoomToolbarControl === null
      ? createWheelZoomButton(referenceRuntimeDocument, wheelZoomState)
      : existingWheelZoomToolbarControl.wheelZoomButton;

  if (existingWheelZoomToolbarControl !== null) {
    connectWheelZoomButtonToState(wheelZoomButton, wheelZoomState);
  } else {
    insertWheelZoomToolbarControl(runtimeContract, wheelZoomButton);
  }
  installWheelEventGate(
    referenceRuntimeDocument,
    runtimeContract.canvasContainer,
    wheelZoomState,
  );

  return storeWheelZoomInstallation(
    runtimeContract.referenceRuntimeRoot,
    wheelZoomState,
  );
}
