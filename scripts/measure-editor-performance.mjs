import { fileURLToPath } from "node:url";

export const REQUIRED_EDITOR_PERFORMANCE_MARKS = [
  "editor:island-mounted",
  "editor:project-state-ready",
  "editor:pixi-module-ready",
  "editor:default-map-fetched",
  "editor:default-map-parsed",
  "editor:required-textures-ready",
  "editor:canvas-mounted",
  "editor:interactive",
];

export const EDITOR_INTERACTIVE_THRESHOLDS = {
  "desktop:cold": 1500,
  "desktop:warm": 800,
  "mobile:cold": 2500,
  "mobile:warm": 800,
};

const acceptedArgumentNames = new Set([
  "--base-url",
  "--cdp-http-url",
  "--viewport",
  "--cache",
  "--samples",
  "--max-interactive-ms",
]);

const viewportMeasurements = {
  desktop: {
    height: 720,
    isMobile: false,
    width: 1280,
  },
  mobile: {
    height: 844,
    isMobile: true,
    width: 390,
  },
};

export const FAST_4G_NETWORK_CONDITIONS = {
  connectionType: "cellular4g",
  downloadThroughput: 9_000_000 / 8 * 0.9,
  latency: 60 * 2.75,
  offline: false,
  uploadThroughput: 1_500_000 / 8 * 0.9,
};

function parseArgumentValuePairs(argumentValues) {
  if (argumentValues.length % 2 !== 0) {
    throw new Error(
      `Expected option/value pairs, received ${JSON.stringify(argumentValues)}.`,
    );
  }

  const parsedArguments = new Map();

  for (let argumentIndex = 0; argumentIndex < argumentValues.length; argumentIndex += 2) {
    const argumentName = argumentValues[argumentIndex];
    const argumentValue = argumentValues[argumentIndex + 1];

    if (!acceptedArgumentNames.has(argumentName)) {
      throw new Error(
        `Unsupported measurement option ${JSON.stringify(argumentName)}. Received ${JSON.stringify(argumentValues)}.`,
      );
    }

    if (parsedArguments.has(argumentName)) {
      throw new Error(
        `Measurement option ${argumentName} was provided more than once. Received ${JSON.stringify(argumentValues)}.`,
      );
    }

    parsedArguments.set(argumentName, argumentValue);
  }

  return parsedArguments;
}

function readRequiredArgument(parsedArguments, argumentName) {
  const argumentValue = parsedArguments.get(argumentName);

  if (typeof argumentValue !== "string" || argumentValue.length === 0) {
    throw new Error(
      `Missing required measurement option ${argumentName}. Received ${JSON.stringify(Object.fromEntries(parsedArguments))}.`,
    );
  }

  return argumentValue;
}

function normalizeHttpUrl(receivedUrl, argumentName) {
  let parsedUrl;

  try {
    parsedUrl = new URL(receivedUrl);
  } catch {
    throw new Error(
      `Measurement option ${argumentName} must be an absolute HTTP URL, received ${JSON.stringify(receivedUrl)}.`,
    );
  }

  if (
    (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") ||
    parsedUrl.search.length > 0 ||
    parsedUrl.hash.length > 0
  ) {
    throw new Error(
      `Measurement option ${argumentName} must be an absolute HTTP URL without query or hash, received ${JSON.stringify(receivedUrl)}.`,
    );
  }

  return parsedUrl.href.replace(/\/$/, "");
}

function readAcceptedChoice(parsedArguments, argumentName, acceptedValues) {
  const receivedValue = readRequiredArgument(parsedArguments, argumentName);

  if (!acceptedValues.includes(receivedValue)) {
    throw new Error(
      `Measurement option ${argumentName} received ${JSON.stringify(receivedValue)}. Expected one of ${JSON.stringify(acceptedValues)}.`,
    );
  }

  return receivedValue;
}

function readOptionalPositiveNumber(parsedArguments, argumentName) {
  const receivedValue = parsedArguments.get(argumentName);

  if (receivedValue === undefined) {
    return undefined;
  }

  const parsedValue = Number(receivedValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error(
      `Measurement option ${argumentName} received ${JSON.stringify(receivedValue)}. Expected a finite positive number.`,
    );
  }

  return parsedValue;
}

export function parseEditorPerformanceMeasurementArguments(argumentValues) {
  const parsedArguments = parseArgumentValuePairs(argumentValues);
  const baseUrl = normalizeHttpUrl(
    readRequiredArgument(parsedArguments, "--base-url"),
    "--base-url",
  );
  const cdpHttpUrl = normalizeHttpUrl(
    readRequiredArgument(parsedArguments, "--cdp-http-url"),
    "--cdp-http-url",
  );
  const viewportKind = readAcceptedChoice(parsedArguments, "--viewport", [
    "desktop",
    "mobile",
  ]);
  const cacheMode = readAcceptedChoice(parsedArguments, "--cache", [
    "cold",
    "warm",
  ]);
  const receivedSampleCount = readRequiredArgument(parsedArguments, "--samples");
  const sampleCount = Number(receivedSampleCount);

  if (!Number.isInteger(sampleCount) || sampleCount < 3) {
    throw new Error(
      `Measurement option --samples received ${JSON.stringify(receivedSampleCount)}. Expected an integer of at least 3.`,
    );
  }

  const measurementOptions = {
    baseUrl,
    cacheMode,
    cdpHttpUrl,
    sampleCount,
    viewportKind,
  };
  const maximumInteractiveMilliseconds = readOptionalPositiveNumber(
    parsedArguments,
    "--max-interactive-ms",
  );

  if (maximumInteractiveMilliseconds === undefined) {
    return measurementOptions;
  }

  return {
    ...measurementOptions,
    maximumInteractiveMilliseconds,
  };
}

export function calculateSortedMedian(recordedValues) {
  if (!Array.isArray(recordedValues) || recordedValues.length === 0) {
    throw new Error(
      `Cannot calculate a median from recorded values ${JSON.stringify(recordedValues)}.`,
    );
  }

  const sortedValues = [...recordedValues].sort((leftValue, rightValue) => leftValue - rightValue);
  const middleValueIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 1) {
    return sortedValues[middleValueIndex];
  }

  return (sortedValues[middleValueIndex - 1] + sortedValues[middleValueIndex]) / 2;
}

export function findMissingEditorPerformanceMarks(recordedMarkNames) {
  return REQUIRED_EDITOR_PERFORMANCE_MARKS.filter(
    (requiredMarkName) => !recordedMarkNames.includes(requiredMarkName),
  );
}

export function findForbiddenFrozenRuntimeRequests(requestedUrls) {
  return requestedUrls.filter(
    (requestedUrl) =>
      requestedUrl.includes("/reference-runtime/") ||
      requestedUrl.includes("/_app/immutable/"),
  );
}

export function getMissingCdpRuntimeApiNames(runtimeApi = globalThis) {
  return ["fetch", "WebSocket"].filter(
    (requiredApiName) => typeof runtimeApi[requiredApiName] !== "function",
  );
}

export function assertCdpRuntimeApis(runtimeApi = globalThis) {
  const missingApiNames = getMissingCdpRuntimeApiNames(runtimeApi);

  if (missingApiNames.length > 0) {
    throw new Error(
      `Node ${runtimeApi.process?.version ?? "unknown"} is missing required CDP APIs ${missingApiNames.join(", ")}.`,
    );
  }
}

function createWebSocketConnection(webSocketDebuggerUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketDebuggerUrl);
    let opened = false;

    socket.addEventListener("open", () => {
      opened = true;
      resolve(socket);
    });
    socket.addEventListener("error", () => {
      if (!opened) {
        reject(
          new Error(
            `Failed to connect to the CDP WebSocket URL ${JSON.stringify(webSocketDebuggerUrl)}.`,
          ),
        );
      }
    });
  });
}

function createCdpConnection(webSocketDebuggerUrl) {
  const pendingCommands = new Map();
  const eventListenersByMethod = new Map();
  let nextCommandId = 1;
  let socket;

  function rejectPendingCommands(closeReason) {
    for (const pendingCommand of pendingCommands.values()) {
      pendingCommand.reject(
        new Error(
          `CDP WebSocket closed before command completion. Close event received ${JSON.stringify(closeReason)}.`,
        ),
      );
    }

    pendingCommands.clear();
  }

  return {
    async connect() {
      socket = await createWebSocketConnection(webSocketDebuggerUrl);
      socket.addEventListener("message", (messageEvent) => {
        const parsedMessage = JSON.parse(String(messageEvent.data));

        if (typeof parsedMessage.id === "number") {
          const pendingCommand = pendingCommands.get(parsedMessage.id);

          if (!pendingCommand) {
            return;
          }

          pendingCommands.delete(parsedMessage.id);

          if (parsedMessage.error) {
            pendingCommand.reject(
              new Error(
                `CDP command ${pendingCommand.method} failed with ${JSON.stringify(parsedMessage.error)}.`,
              ),
            );
            return;
          }

          pendingCommand.resolve(parsedMessage.result);
          return;
        }

        const eventListeners = eventListenersByMethod.get(parsedMessage.method) ?? [];

        for (const eventListener of eventListeners) {
          eventListener(parsedMessage.params ?? {});
        }
      });
      socket.addEventListener("close", (closeEvent) => {
        rejectPendingCommands({
          code: closeEvent.code,
          reason: closeEvent.reason,
        });
      });
    },
    close() {
      if (socket) {
        socket.close();
      }
    },
    on(eventMethod, eventListener) {
      const eventListeners = eventListenersByMethod.get(eventMethod) ?? [];
      eventListeners.push(eventListener);
      eventListenersByMethod.set(eventMethod, eventListeners);
    },
    send(commandMethod, commandParameters = {}) {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error(
          `Cannot send CDP command ${commandMethod} because the WebSocket is not open.`,
        );
      }

      const commandId = nextCommandId;
      nextCommandId += 1;

      return new Promise((resolve, reject) => {
        pendingCommands.set(commandId, {
          method: commandMethod,
          reject,
          resolve,
        });
        socket.send(
          JSON.stringify({
            id: commandId,
            method: commandMethod,
            params: commandParameters,
          }),
        );
      });
    },
  };
}

async function createDebuggablePageTarget(cdpHttpUrl) {
  const createdTargetResponse = await fetch(
    `${cdpHttpUrl}/json/new?${encodeURIComponent("about:blank")}`,
    {
      method: "PUT",
    },
  );

  if (!createdTargetResponse.ok) {
    throw new Error(
      `Could not create a debuggable page target at ${cdpHttpUrl}. Received HTTP ${createdTargetResponse.status}.`,
    );
  }

  const createdTarget = await createdTargetResponse.json();

  if (typeof createdTarget.webSocketDebuggerUrl !== "string") {
    throw new Error(
      `Created CDP target did not include webSocketDebuggerUrl. Received ${JSON.stringify(createdTarget)}.`,
    );
  }

  return createdTarget;
}

function createPageMeasurementBootstrap() {
  return `(() => {
    const measuredEntries = {
      cumulativeLayoutShift: 0,
      interactionDuration: null,
      largestContentfulPaint: null,
      longTaskCount: 0,
    };
    const supportedEntryTypes = typeof PerformanceObserver === "function"
      ? PerformanceObserver.supportedEntryTypes
      : [];
    if (supportedEntryTypes.includes("largest-contentful-paint")) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          measuredEntries.largestContentfulPaint = entry.startTime;
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    }
    if (supportedEntryTypes.includes("layout-shift")) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            measuredEntries.cumulativeLayoutShift += entry.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    }
    if (supportedEntryTypes.includes("event")) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.interactionId > 0) {
            measuredEntries.interactionDuration = Math.max(
              measuredEntries.interactionDuration ?? 0,
              entry.duration,
            );
          }
        }
      }).observe({ type: "event", buffered: true, durationThreshold: 16 });
    }
    if (supportedEntryTypes.includes("longtask")) {
      new PerformanceObserver((entryList) => {
        measuredEntries.longTaskCount += entryList.getEntries().length;
      }).observe({ type: "longtask", buffered: true });
    }
    window.__plannerEditorMeasurement = measuredEntries;
  })();`;
}

function createInteractiveMeasurementExpression() {
  return `new Promise((resolve, reject) => {
    const deadlineTimestamp = performance.now() + 15000;
    const readMeasurement = () => {
      const marks = performance
        .getEntriesByType("mark")
        .filter((entry) => entry.name.startsWith("editor:"))
        .map((entry) => ({ name: entry.name, startTime: entry.startTime }));
      const interactiveMark = marks.find((mark) => mark.name === "editor:interactive");
      if (interactiveMark) {
        resolve(JSON.stringify({
          marks,
          pageMetrics: window.__plannerEditorMeasurement ?? null,
        }));
        return;
      }
      if (performance.now() >= deadlineTimestamp) {
        reject(new Error("editor:interactive was not recorded within 15000ms."));
        return;
      }
      setTimeout(readMeasurement, 25);
    };
    readMeasurement();
  })`;
}

function parseRuntimeEvaluationValue(evaluationResult, description) {
  if (evaluationResult.exceptionDetails) {
    throw new Error(
      `${description} failed with ${evaluationResult.exceptionDetails.text}: ${evaluationResult.exceptionDetails.exception?.description ?? "no exception detail"}.`,
    );
  }

  if (typeof evaluationResult.result?.value !== "string") {
    throw new Error(
      `${description} did not return a JSON string. Received ${JSON.stringify(evaluationResult.result)}.`,
    );
  }

  return JSON.parse(evaluationResult.result.value);
}

async function getCanvasInteractionCoordinates(cdpConnection) {
  const evaluationResult = await cdpConnection.send("Runtime.evaluate", {
    expression: `JSON.stringify((() => {
      const plannerCanvas = document.querySelector("canvas");
      if (!plannerCanvas) {
        return null;
      }
      plannerCanvas.scrollIntoView({ block: "center", inline: "center" });
      const canvasBounds = plannerCanvas.getBoundingClientRect();
      return {
        x: canvasBounds.left + canvasBounds.width / 2,
        y: canvasBounds.top + canvasBounds.height / 2,
      };
    })())`,
    returnByValue: true,
  });
  const interactionCoordinates = parseRuntimeEvaluationValue(
    evaluationResult,
    "Canvas interaction coordinate measurement",
  );

  if (
    typeof interactionCoordinates?.x !== "number" ||
    typeof interactionCoordinates?.y !== "number"
  ) {
    throw new Error(
      `Could not locate an interactive planner canvas. Received ${JSON.stringify(interactionCoordinates)}.`,
    );
  }

  return interactionCoordinates;
}

async function recordCanvasInteraction(cdpConnection) {
  const interactionCoordinates = await getCanvasInteractionCoordinates(cdpConnection);

  await cdpConnection.send("Input.dispatchMouseEvent", {
    button: "left",
    clickCount: 1,
    type: "mousePressed",
    x: interactionCoordinates.x,
    y: interactionCoordinates.y,
  });
  await cdpConnection.send("Input.dispatchMouseEvent", {
    button: "left",
    clickCount: 1,
    type: "mouseReleased",
    x: interactionCoordinates.x,
    y: interactionCoordinates.y,
  });
}

async function readPageMetricsAfterInteraction(cdpConnection) {
  const evaluationResult = await cdpConnection.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `new Promise((resolve) => {
      setTimeout(() => resolve(JSON.stringify(window.__plannerEditorMeasurement ?? null)), 250);
    })`,
    returnByValue: true,
  });

  return parseRuntimeEvaluationValue(
    evaluationResult,
    "Page metric measurement after canvas interaction",
  );
}

async function configureMeasurementSession(cdpConnection, viewportKind, cacheMode) {
  const viewportMeasurement = viewportMeasurements[viewportKind];

  await cdpConnection.send("Network.enable");
  await cdpConnection.send("Page.enable");
  await cdpConnection.send("Performance.enable");
  await cdpConnection.send("Emulation.setDeviceMetricsOverride", {
    deviceScaleFactor: 1,
    height: viewportMeasurement.height,
    mobile: viewportMeasurement.isMobile,
    width: viewportMeasurement.width,
  });
  await cdpConnection.send("Network.setCacheDisabled", {
    cacheDisabled: cacheMode === "cold",
  });

  if (cacheMode === "cold") {
    await cdpConnection.send("Network.clearBrowserCache");
  }

  if (viewportKind === "mobile" && cacheMode === "cold") {
    await cdpConnection.send(
      "Network.emulateNetworkConditions",
      FAST_4G_NETWORK_CONDITIONS,
    );
    return;
  }

  await cdpConnection.send("Network.emulateNetworkConditions", {
    connectionType: "none",
    downloadThroughput: -1,
    latency: 0,
    offline: false,
    uploadThroughput: -1,
  });
}

async function measureEditorSample(measurementOptions) {
  const createdTarget = await createDebuggablePageTarget(
    measurementOptions.cdpHttpUrl,
  );
  const cdpConnection = createCdpConnection(createdTarget.webSocketDebuggerUrl);
  const requestedUrls = [];

  try {
    await cdpConnection.connect();
    cdpConnection.on("Network.requestWillBeSent", ({ request }) => {
      if (typeof request?.url === "string") {
        requestedUrls.push(request.url);
      }
    });
    await configureMeasurementSession(
      cdpConnection,
      measurementOptions.viewportKind,
      measurementOptions.cacheMode,
    );
    await cdpConnection.send("Page.addScriptToEvaluateOnNewDocument", {
      source: createPageMeasurementBootstrap(),
    });
    await cdpConnection.send("Page.navigate", {
      url: measurementOptions.baseUrl,
    });

    const evaluationResult = await cdpConnection.send("Runtime.evaluate", {
      awaitPromise: true,
      expression: createInteractiveMeasurementExpression(),
      returnByValue: true,
    });
    const measuredPageState = parseRuntimeEvaluationValue(
      evaluationResult,
      "Interactive performance measurement",
    );
    const recordedMarkNames = measuredPageState.marks.map((mark) => mark.name);
    const missingMarkNames = findMissingEditorPerformanceMarks(recordedMarkNames);

    if (missingMarkNames.length > 0) {
      throw new Error(
        `Measurement sample is missing marks ${JSON.stringify(missingMarkNames)}. Received marks ${JSON.stringify(recordedMarkNames)}.`,
      );
    }

    const forbiddenRuntimeRequests =
      findForbiddenFrozenRuntimeRequests(requestedUrls);

    if (forbiddenRuntimeRequests.length > 0) {
      throw new Error(
        `React measurement requested retired runtime assets ${JSON.stringify(forbiddenRuntimeRequests)}.`,
      );
    }

    const interactiveMark = measuredPageState.marks.find(
      (mark) => mark.name === "editor:interactive",
    );
    await recordCanvasInteraction(cdpConnection);
    const pageMetrics = await readPageMetricsAfterInteraction(cdpConnection);

    return {
      interactiveMilliseconds: interactiveMark.startTime,
      marks: measuredPageState.marks,
      pageMetrics,
      requestedUrls,
    };
  } finally {
    cdpConnection.close();
  }
}

async function warmEditorCache(measurementOptions) {
  await measureEditorSample({
    ...measurementOptions,
    cacheMode: "warm",
  });
}

export function assertInteractiveThreshold(measurementOptions, medianInteractiveMilliseconds) {
  const thresholdKey = `${measurementOptions.viewportKind}:${measurementOptions.cacheMode}`;
  const maximumInteractiveMilliseconds =
    measurementOptions.maximumInteractiveMilliseconds ??
    EDITOR_INTERACTIVE_THRESHOLDS[thresholdKey];

  if (medianInteractiveMilliseconds > maximumInteractiveMilliseconds) {
    throw new Error(
      `Interactive median ${medianInteractiveMilliseconds}ms exceeded ${maximumInteractiveMilliseconds}ms for ${thresholdKey}.`,
    );
  }
}

async function runEditorPerformanceMeasurement(measurementOptions) {
  assertCdpRuntimeApis();

  if (measurementOptions.cacheMode === "warm") {
    await warmEditorCache(measurementOptions);
  }

  const samples = [];

  for (let sampleIndex = 0; sampleIndex < measurementOptions.sampleCount; sampleIndex += 1) {
    const sample = await measureEditorSample(measurementOptions);
    samples.push(sample);
    console.log(
      JSON.stringify({
        interactiveMilliseconds: sample.interactiveMilliseconds,
        marks: sample.marks,
        pageMetrics: sample.pageMetrics,
        requestedUrls: sample.requestedUrls,
        sample: sampleIndex + 1,
      }),
    );
  }

  const medianInteractiveMilliseconds = calculateSortedMedian(
    samples.map((sample) => sample.interactiveMilliseconds),
  );
  assertInteractiveThreshold(measurementOptions, medianInteractiveMilliseconds);

  console.log(
    JSON.stringify({
      medianInteractiveMilliseconds,
      sampleCount: samples.length,
      thresholdMilliseconds:
        measurementOptions.maximumInteractiveMilliseconds ??
        EDITOR_INTERACTIVE_THRESHOLDS[
          `${measurementOptions.viewportKind}:${measurementOptions.cacheMode}`
        ],
    }),
  );
}

const scriptFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === scriptFilePath) {
  const measurementOptions = parseEditorPerformanceMeasurementArguments(
    process.argv.slice(2),
  );
  await runEditorPerformanceMeasurement(measurementOptions);
}
