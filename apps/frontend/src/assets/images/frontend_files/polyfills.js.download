// node_modules/zone.js/fesm2015/zone.js
var global = globalThis;
function __symbol__(name) {
  const symbolPrefix = global["__Zone_symbol_prefix"] || "__zone_symbol__";
  return symbolPrefix + name;
}
function initZone() {
  const performance = global["performance"];
  function mark(name) {
    performance && performance["mark"] && performance["mark"](name);
  }
  function performanceMeasure(name, label) {
    performance && performance["measure"] && performance["measure"](name, label);
  }
  mark("Zone");
  const _ZoneImpl = class _ZoneImpl {
    static assertZonePatched() {
      if (global["Promise"] !== patches["ZoneAwarePromise"]) {
        throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)");
      }
    }
    static get root() {
      let zone = _ZoneImpl.current;
      while (zone.parent) {
        zone = zone.parent;
      }
      return zone;
    }
    static get current() {
      return _currentZoneFrame.zone;
    }
    static get currentTask() {
      return _currentTask;
    }
    // tslint:disable-next-line:require-internal-with-underscore
    static __load_patch(name, fn, ignoreDuplicate = false) {
      if (patches.hasOwnProperty(name)) {
        const checkDuplicate = global[__symbol__("forceDuplicateZoneCheck")] === true;
        if (!ignoreDuplicate && checkDuplicate) {
          throw Error("Already loaded patch: " + name);
        }
      } else if (!global["__Zone_disable_" + name]) {
        const perfName = "Zone:" + name;
        mark(perfName);
        patches[name] = fn(global, _ZoneImpl, _api);
        performanceMeasure(perfName, perfName);
      }
    }
    get parent() {
      return this._parent;
    }
    get name() {
      return this._name;
    }
    constructor(parent, zoneSpec) {
      this._parent = parent;
      this._name = zoneSpec ? zoneSpec.name || "unnamed" : "<root>";
      this._properties = zoneSpec && zoneSpec.properties || {};
      this._zoneDelegate = new _ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
    }
    get(key) {
      const zone = this.getZoneWith(key);
      if (zone)
        return zone._properties[key];
    }
    getZoneWith(key) {
      let current = this;
      while (current) {
        if (current._properties.hasOwnProperty(key)) {
          return current;
        }
        current = current._parent;
      }
      return null;
    }
    fork(zoneSpec) {
      if (!zoneSpec)
        throw new Error("ZoneSpec required!");
      return this._zoneDelegate.fork(this, zoneSpec);
    }
    wrap(callback, source) {
      if (typeof callback !== "function") {
        throw new Error("Expecting function got: " + callback);
      }
      const _callback = this._zoneDelegate.intercept(this, callback, source);
      const zone = this;
      return function() {
        return zone.runGuarded(_callback, this, arguments, source);
      };
    }
    run(callback, applyThis, applyArgs, source) {
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }
    runGuarded(callback, applyThis = null, applyArgs, source) {
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        try {
          return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }
    runTask(task, applyThis, applyArgs) {
      if (task.zone != this) {
        throw new Error("A task can only be run in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
      }
      const zoneTask = task;
      const { type, data: { isPeriodic = false, isRefreshable = false } = {} } = task;
      if (task.state === notScheduled && (type === eventTask || type === macroTask)) {
        return;
      }
      const reEntryGuard = task.state != running;
      reEntryGuard && zoneTask._transitionTo(running, scheduled);
      const previousTask = _currentTask;
      _currentTask = zoneTask;
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        if (type == macroTask && task.data && !isPeriodic && !isRefreshable) {
          task.cancelFn = void 0;
        }
        try {
          return this._zoneDelegate.invokeTask(this, zoneTask, applyThis, applyArgs);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        const state = task.state;
        if (state !== notScheduled && state !== unknown) {
          if (type == eventTask || isPeriodic || isRefreshable && state === scheduling) {
            reEntryGuard && zoneTask._transitionTo(scheduled, running, scheduling);
          } else {
            const zoneDelegates = zoneTask._zoneDelegates;
            this._updateTaskCount(zoneTask, -1);
            reEntryGuard && zoneTask._transitionTo(notScheduled, running, notScheduled);
            if (isRefreshable) {
              zoneTask._zoneDelegates = zoneDelegates;
            }
          }
        }
        _currentZoneFrame = _currentZoneFrame.parent;
        _currentTask = previousTask;
      }
    }
    scheduleTask(task) {
      if (task.zone && task.zone !== this) {
        let newZone = this;
        while (newZone) {
          if (newZone === task.zone) {
            throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${task.zone.name}`);
          }
          newZone = newZone.parent;
        }
      }
      task._transitionTo(scheduling, notScheduled);
      const zoneDelegates = [];
      task._zoneDelegates = zoneDelegates;
      task._zone = this;
      try {
        task = this._zoneDelegate.scheduleTask(this, task);
      } catch (err) {
        task._transitionTo(unknown, scheduling, notScheduled);
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      if (task._zoneDelegates === zoneDelegates) {
        this._updateTaskCount(task, 1);
      }
      if (task.state == scheduling) {
        task._transitionTo(scheduled, scheduling);
      }
      return task;
    }
    scheduleMicroTask(source, callback, data, customSchedule) {
      return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, void 0));
    }
    scheduleMacroTask(source, callback, data, customSchedule, customCancel) {
      return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
    }
    scheduleEventTask(source, callback, data, customSchedule, customCancel) {
      return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
    }
    cancelTask(task) {
      if (task.zone != this)
        throw new Error("A task can only be cancelled in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
      if (task.state !== scheduled && task.state !== running) {
        return;
      }
      task._transitionTo(canceling, scheduled, running);
      try {
        this._zoneDelegate.cancelTask(this, task);
      } catch (err) {
        task._transitionTo(unknown, canceling);
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      this._updateTaskCount(task, -1);
      task._transitionTo(notScheduled, canceling);
      task.runCount = -1;
      return task;
    }
    _updateTaskCount(task, count) {
      const zoneDelegates = task._zoneDelegates;
      if (count == -1) {
        task._zoneDelegates = null;
      }
      for (let i = 0; i < zoneDelegates.length; i++) {
        zoneDelegates[i]._updateTaskCount(task.type, count);
      }
    }
  };
  _ZoneImpl.__symbol__ = __symbol__;
  let ZoneImpl = _ZoneImpl;
  const DELEGATE_ZS = {
    name: "",
    onHasTask: (delegate, _, target, hasTaskState) => delegate.hasTask(target, hasTaskState),
    onScheduleTask: (delegate, _, target, task) => delegate.scheduleTask(target, task),
    onInvokeTask: (delegate, _, target, task, applyThis, applyArgs) => delegate.invokeTask(target, task, applyThis, applyArgs),
    onCancelTask: (delegate, _, target, task) => delegate.cancelTask(target, task)
  };
  class _ZoneDelegate {
    get zone() {
      return this._zone;
    }
    constructor(zone, parentDelegate, zoneSpec) {
      this._taskCounts = {
        "microTask": 0,
        "macroTask": 0,
        "eventTask": 0
      };
      this._zone = zone;
      this._parentDelegate = parentDelegate;
      this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
      this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
      this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this._zone : parentDelegate._forkCurrZone);
      this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
      this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
      this._interceptCurrZone = zoneSpec && (zoneSpec.onIntercept ? this._zone : parentDelegate._interceptCurrZone);
      this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
      this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
      this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this._zone : parentDelegate._invokeCurrZone);
      this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
      this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
      this._handleErrorCurrZone = zoneSpec && (zoneSpec.onHandleError ? this._zone : parentDelegate._handleErrorCurrZone);
      this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
      this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
      this._scheduleTaskCurrZone = zoneSpec && (zoneSpec.onScheduleTask ? this._zone : parentDelegate._scheduleTaskCurrZone);
      this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
      this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
      this._invokeTaskCurrZone = zoneSpec && (zoneSpec.onInvokeTask ? this._zone : parentDelegate._invokeTaskCurrZone);
      this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
      this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
      this._cancelTaskCurrZone = zoneSpec && (zoneSpec.onCancelTask ? this._zone : parentDelegate._cancelTaskCurrZone);
      this._hasTaskZS = null;
      this._hasTaskDlgt = null;
      this._hasTaskDlgtOwner = null;
      this._hasTaskCurrZone = null;
      const zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
      const parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
      if (zoneSpecHasTask || parentHasTask) {
        this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
        this._hasTaskDlgt = parentDelegate;
        this._hasTaskDlgtOwner = this;
        this._hasTaskCurrZone = this._zone;
        if (!zoneSpec.onScheduleTask) {
          this._scheduleTaskZS = DELEGATE_ZS;
          this._scheduleTaskDlgt = parentDelegate;
          this._scheduleTaskCurrZone = this._zone;
        }
        if (!zoneSpec.onInvokeTask) {
          this._invokeTaskZS = DELEGATE_ZS;
          this._invokeTaskDlgt = parentDelegate;
          this._invokeTaskCurrZone = this._zone;
        }
        if (!zoneSpec.onCancelTask) {
          this._cancelTaskZS = DELEGATE_ZS;
          this._cancelTaskDlgt = parentDelegate;
          this._cancelTaskCurrZone = this._zone;
        }
      }
    }
    fork(targetZone, zoneSpec) {
      return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new ZoneImpl(targetZone, zoneSpec);
    }
    intercept(targetZone, callback, source) {
      return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) : callback;
    }
    invoke(targetZone, callback, applyThis, applyArgs, source) {
      return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) : callback.apply(applyThis, applyArgs);
    }
    handleError(targetZone, error) {
      return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) : true;
    }
    scheduleTask(targetZone, task) {
      let returnTask = task;
      if (this._scheduleTaskZS) {
        if (this._hasTaskZS) {
          returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
        }
        returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
        if (!returnTask)
          returnTask = task;
      } else {
        if (task.scheduleFn) {
          task.scheduleFn(task);
        } else if (task.type == microTask) {
          scheduleMicroTask(task);
        } else {
          throw new Error("Task is missing scheduleFn.");
        }
      }
      return returnTask;
    }
    invokeTask(targetZone, task, applyThis, applyArgs) {
      return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
    }
    cancelTask(targetZone, task) {
      let value;
      if (this._cancelTaskZS) {
        value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
      } else {
        if (!task.cancelFn) {
          throw Error("Task is not cancelable");
        }
        value = task.cancelFn(task);
      }
      return value;
    }
    hasTask(targetZone, isEmpty) {
      try {
        this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
      } catch (err) {
        this.handleError(targetZone, err);
      }
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _updateTaskCount(type, count) {
      const counts = this._taskCounts;
      const prev = counts[type];
      const next = counts[type] = prev + count;
      if (next < 0) {
        throw new Error("More tasks executed then were scheduled.");
      }
      if (prev == 0 || next == 0) {
        const isEmpty = {
          microTask: counts["microTask"] > 0,
          macroTask: counts["macroTask"] > 0,
          eventTask: counts["eventTask"] > 0,
          change: type
        };
        this.hasTask(this._zone, isEmpty);
      }
    }
  }
  class ZoneTask {
    constructor(type, source, callback, options, scheduleFn, cancelFn) {
      this._zone = null;
      this.runCount = 0;
      this._zoneDelegates = null;
      this._state = "notScheduled";
      this.type = type;
      this.source = source;
      this.data = options;
      this.scheduleFn = scheduleFn;
      this.cancelFn = cancelFn;
      if (!callback) {
        throw new Error("callback is not defined");
      }
      this.callback = callback;
      const self2 = this;
      if (type === eventTask && options && options.useG) {
        this.invoke = ZoneTask.invokeTask;
      } else {
        this.invoke = function() {
          return ZoneTask.invokeTask.call(global, self2, this, arguments);
        };
      }
    }
    static invokeTask(task, target, args) {
      if (!task) {
        task = this;
      }
      _numberOfNestedTaskFrames++;
      try {
        task.runCount++;
        return task.zone.runTask(task, target, args);
      } finally {
        if (_numberOfNestedTaskFrames == 1) {
          drainMicroTaskQueue();
        }
        _numberOfNestedTaskFrames--;
      }
    }
    get zone() {
      return this._zone;
    }
    get state() {
      return this._state;
    }
    cancelScheduleRequest() {
      this._transitionTo(notScheduled, scheduling);
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _transitionTo(toState, fromState1, fromState2) {
      if (this._state === fromState1 || this._state === fromState2) {
        this._state = toState;
        if (toState == notScheduled) {
          this._zoneDelegates = null;
        }
      } else {
        throw new Error(`${this.type} '${this.source}': can not transition to '${toState}', expecting state '${fromState1}'${fromState2 ? " or '" + fromState2 + "'" : ""}, was '${this._state}'.`);
      }
    }
    toString() {
      if (this.data && typeof this.data.handleId !== "undefined") {
        return this.data.handleId.toString();
      } else {
        return Object.prototype.toString.call(this);
      }
    }
    // add toJSON method to prevent cyclic error when
    // call JSON.stringify(zoneTask)
    toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount
      };
    }
  }
  const symbolSetTimeout = __symbol__("setTimeout");
  const symbolPromise = __symbol__("Promise");
  const symbolThen = __symbol__("then");
  let _microTaskQueue = [];
  let _isDrainingMicrotaskQueue = false;
  let nativeMicroTaskQueuePromise;
  function nativeScheduleMicroTask(func) {
    if (!nativeMicroTaskQueuePromise) {
      if (global[symbolPromise]) {
        nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
      }
    }
    if (nativeMicroTaskQueuePromise) {
      let nativeThen = nativeMicroTaskQueuePromise[symbolThen];
      if (!nativeThen) {
        nativeThen = nativeMicroTaskQueuePromise["then"];
      }
      nativeThen.call(nativeMicroTaskQueuePromise, func);
    } else {
      global[symbolSetTimeout](func, 0);
    }
  }
  function scheduleMicroTask(task) {
    if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
      nativeScheduleMicroTask(drainMicroTaskQueue);
    }
    task && _microTaskQueue.push(task);
  }
  function drainMicroTaskQueue() {
    if (!_isDrainingMicrotaskQueue) {
      _isDrainingMicrotaskQueue = true;
      while (_microTaskQueue.length) {
        const queue = _microTaskQueue;
        _microTaskQueue = [];
        for (let i = 0; i < queue.length; i++) {
          const task = queue[i];
          try {
            task.zone.runTask(task, null, null);
          } catch (error) {
            _api.onUnhandledError(error);
          }
        }
      }
      _api.microtaskDrainDone();
      _isDrainingMicrotaskQueue = false;
    }
  }
  const NO_ZONE = { name: "NO ZONE" };
  const notScheduled = "notScheduled", scheduling = "scheduling", scheduled = "scheduled", running = "running", canceling = "canceling", unknown = "unknown";
  const microTask = "microTask", macroTask = "macroTask", eventTask = "eventTask";
  const patches = {};
  const _api = {
    symbol: __symbol__,
    currentZoneFrame: () => _currentZoneFrame,
    onUnhandledError: noop,
    microtaskDrainDone: noop,
    scheduleMicroTask,
    showUncaughtError: () => !ZoneImpl[__symbol__("ignoreConsoleErrorUncaughtError")],
    patchEventTarget: () => [],
    patchOnProperties: noop,
    patchMethod: () => noop,
    bindArguments: () => [],
    patchThen: () => noop,
    patchMacroTask: () => noop,
    patchEventPrototype: () => noop,
    isIEOrEdge: () => false,
    getGlobalObjects: () => void 0,
    ObjectDefineProperty: () => noop,
    ObjectGetOwnPropertyDescriptor: () => void 0,
    ObjectCreate: () => void 0,
    ArraySlice: () => [],
    patchClass: () => noop,
    wrapWithCurrentZone: () => noop,
    filterProperties: () => [],
    attachOriginToPatched: () => noop,
    _redefineProperty: () => noop,
    patchCallbacks: () => noop,
    nativeScheduleMicroTask
  };
  let _currentZoneFrame = { parent: null, zone: new ZoneImpl(null, null) };
  let _currentTask = null;
  let _numberOfNestedTaskFrames = 0;
  function noop() {
  }
  performanceMeasure("Zone", "Zone");
  return ZoneImpl;
}
function loadZone() {
  const global2 = globalThis;
  const checkDuplicate = global2[__symbol__("forceDuplicateZoneCheck")] === true;
  if (global2["Zone"] && (checkDuplicate || typeof global2["Zone"].__symbol__ !== "function")) {
    throw new Error("Zone already loaded.");
  }
  global2["Zone"] ??= initZone();
  return global2["Zone"];
}
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ObjectDefineProperty = Object.defineProperty;
var ObjectGetPrototypeOf = Object.getPrototypeOf;
var ObjectCreate = Object.create;
var ArraySlice = Array.prototype.slice;
var ADD_EVENT_LISTENER_STR = "addEventListener";
var REMOVE_EVENT_LISTENER_STR = "removeEventListener";
var ZONE_SYMBOL_ADD_EVENT_LISTENER = __symbol__(ADD_EVENT_LISTENER_STR);
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = __symbol__(REMOVE_EVENT_LISTENER_STR);
var TRUE_STR = "true";
var FALSE_STR = "false";
var ZONE_SYMBOL_PREFIX = __symbol__("");
function wrapWithCurrentZone(callback, source) {
  return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
  return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = __symbol__;
var isWindowExists = typeof window !== "undefined";
var internalWindow = isWindowExists ? window : void 0;
var _global = isWindowExists && internalWindow || globalThis;
var REMOVE_ATTRIBUTE = "removeAttribute";
function bindArguments(args, source) {
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === "function") {
      args[i] = wrapWithCurrentZone(args[i], source + "_" + i);
    }
  }
  return args;
}
function patchPrototype(prototype, fnNames) {
  const source = prototype.constructor["name"];
  for (let i = 0; i < fnNames.length; i++) {
    const name = fnNames[i];
    const delegate = prototype[name];
    if (delegate) {
      const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name);
      if (!isPropertyWritable(prototypeDesc)) {
        continue;
      }
      prototype[name] = ((delegate2) => {
        const patched = function() {
          return delegate2.apply(this, bindArguments(arguments, source + "." + name));
        };
        attachOriginToPatched(patched, delegate2);
        return patched;
      })(delegate);
    }
  }
}
function isPropertyWritable(propertyDesc) {
  if (!propertyDesc) {
    return true;
  }
  if (propertyDesc.writable === false) {
    return false;
  }
  return !(typeof propertyDesc.get === "function" && typeof propertyDesc.set === "undefined");
}
var isWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
var isNode = !("nw" in _global) && typeof _global.process !== "undefined" && _global.process.toString() === "[object process]";
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var isMix = typeof _global.process !== "undefined" && _global.process.toString() === "[object process]" && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var zoneSymbolEventNames$1 = {};
var enableBeforeunloadSymbol = zoneSymbol("enable_beforeunload");
var wrapFn = function(event) {
  event = event || _global.event;
  if (!event) {
    return;
  }
  let eventNameSymbol = zoneSymbolEventNames$1[event.type];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[event.type] = zoneSymbol("ON_PROPERTY" + event.type);
  }
  const target = this || event.target || _global;
  const listener = target[eventNameSymbol];
  let result;
  if (isBrowser && target === internalWindow && event.type === "error") {
    const errorEvent = event;
    result = listener && listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
    if (result === true) {
      event.preventDefault();
    }
  } else {
    result = listener && listener.apply(this, arguments);
    if (
      // https://github.com/angular/angular/issues/47579
      // https://www.w3.org/TR/2011/WD-html5-20110525/history.html#beforeunloadevent
      // This is the only specific case we should check for. The spec defines that the
      // `returnValue` attribute represents the message to show the user. When the event
      // is created, this attribute must be set to the empty string.
      event.type === "beforeunload" && // To prevent any breaking changes resulting from this change, given that
      // it was already causing a significant number of failures in G3, we have hidden
      // that behavior behind a global configuration flag. Consumers can enable this
      // flag explicitly if they want the `beforeunload` event to be handled as defined
      // in the specification.
      _global[enableBeforeunloadSymbol] && // The IDL event definition is `attribute DOMString returnValue`, so we check whether
      // `typeof result` is a string.
      typeof result === "string"
    ) {
      event.returnValue = result;
    } else if (result != void 0 && !result) {
      event.preventDefault();
    }
  }
  return result;
};
function patchProperty(obj, prop, prototype) {
  let desc = ObjectGetOwnPropertyDescriptor(obj, prop);
  if (!desc && prototype) {
    const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
    if (prototypeDesc) {
      desc = { enumerable: true, configurable: true };
    }
  }
  if (!desc || !desc.configurable) {
    return;
  }
  const onPropPatchedSymbol = zoneSymbol("on" + prop + "patched");
  if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
    return;
  }
  delete desc.writable;
  delete desc.value;
  const originalDescGet = desc.get;
  const originalDescSet = desc.set;
  const eventName = prop.slice(2);
  let eventNameSymbol = zoneSymbolEventNames$1[eventName];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[eventName] = zoneSymbol("ON_PROPERTY" + eventName);
  }
  desc.set = function(newValue) {
    let target = this;
    if (!target && obj === _global) {
      target = _global;
    }
    if (!target) {
      return;
    }
    const previousValue = target[eventNameSymbol];
    if (typeof previousValue === "function") {
      target.removeEventListener(eventName, wrapFn);
    }
    originalDescSet && originalDescSet.call(target, null);
    target[eventNameSymbol] = newValue;
    if (typeof newValue === "function") {
      target.addEventListener(eventName, wrapFn, false);
    }
  };
  desc.get = function() {
    let target = this;
    if (!target && obj === _global) {
      target = _global;
    }
    if (!target) {
      return null;
    }
    const listener = target[eventNameSymbol];
    if (listener) {
      return listener;
    } else if (originalDescGet) {
      let value = originalDescGet.call(this);
      if (value) {
        desc.set.call(this, value);
        if (typeof target[REMOVE_ATTRIBUTE] === "function") {
          target.removeAttribute(prop);
        }
        return value;
      }
    }
    return null;
  };
  ObjectDefineProperty(obj, prop, desc);
  obj[onPropPatchedSymbol] = true;
}
function patchOnProperties(obj, properties, prototype) {
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      patchProperty(obj, "on" + properties[i], prototype);
    }
  } else {
    const onProperties = [];
    for (const prop in obj) {
      if (prop.slice(0, 2) == "on") {
        onProperties.push(prop);
      }
    }
    for (let j = 0; j < onProperties.length; j++) {
      patchProperty(obj, onProperties[j], prototype);
    }
  }
}
var originalInstanceKey = zoneSymbol("originalInstance");
function patchClass(className) {
  const OriginalClass = _global[className];
  if (!OriginalClass)
    return;
  _global[zoneSymbol(className)] = OriginalClass;
  _global[className] = function() {
    const a = bindArguments(arguments, className);
    switch (a.length) {
      case 0:
        this[originalInstanceKey] = new OriginalClass();
        break;
      case 1:
        this[originalInstanceKey] = new OriginalClass(a[0]);
        break;
      case 2:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
        break;
      case 3:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
        break;
      case 4:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
        break;
      default:
        throw new Error("Arg list too long.");
    }
  };
  attachOriginToPatched(_global[className], OriginalClass);
  const instance = new OriginalClass(function() {
  });
  let prop;
  for (prop in instance) {
    if (className === "XMLHttpRequest" && prop === "responseBlob")
      continue;
    (function(prop2) {
      if (typeof instance[prop2] === "function") {
        _global[className].prototype[prop2] = function() {
          return this[originalInstanceKey][prop2].apply(this[originalInstanceKey], arguments);
        };
      } else {
        ObjectDefineProperty(_global[className].prototype, prop2, {
          set: function(fn) {
            if (typeof fn === "function") {
              this[originalInstanceKey][prop2] = wrapWithCurrentZone(fn, className + "." + prop2);
              attachOriginToPatched(this[originalInstanceKey][prop2], fn);
            } else {
              this[originalInstanceKey][prop2] = fn;
            }
          },
          get: function() {
            return this[originalInstanceKey][prop2];
          }
        });
      }
    })(prop);
  }
  for (prop in OriginalClass) {
    if (prop !== "prototype" && OriginalClass.hasOwnProperty(prop)) {
      _global[className][prop] = OriginalClass[prop];
    }
  }
}
function patchMethod(target, name, patchFn) {
  let proto = target;
  while (proto && !proto.hasOwnProperty(name)) {
    proto = ObjectGetPrototypeOf(proto);
  }
  if (!proto && target[name]) {
    proto = target;
  }
  const delegateName = zoneSymbol(name);
  let delegate = null;
  if (proto && (!(delegate = proto[delegateName]) || !proto.hasOwnProperty(delegateName))) {
    delegate = proto[delegateName] = proto[name];
    const desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
    if (isPropertyWritable(desc)) {
      const patchDelegate = patchFn(delegate, delegateName, name);
      proto[name] = function() {
        return patchDelegate(this, arguments);
      };
      attachOriginToPatched(proto[name], delegate);
    }
  }
  return delegate;
}
function patchMacroTask(obj, funcName, metaCreator) {
  let setNative = null;
  function scheduleTask(task) {
    const data = task.data;
    data.args[data.cbIdx] = function() {
      task.invoke.apply(this, arguments);
    };
    setNative.apply(data.target, data.args);
    return task;
  }
  setNative = patchMethod(obj, funcName, (delegate) => function(self2, args) {
    const meta = metaCreator(self2, args);
    if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === "function") {
      return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
    } else {
      return delegate.apply(self2, args);
    }
  });
}
function attachOriginToPatched(patched, original) {
  patched[zoneSymbol("OriginalDelegate")] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIE() {
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1) {
      return true;
    }
  } catch (error) {
  }
  return false;
}
function isIEOrEdge() {
  if (isDetectedIEOrEdge) {
    return ieOrEdge;
  }
  isDetectedIEOrEdge = true;
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1 || ua.indexOf("Edge/") !== -1) {
      ieOrEdge = true;
    }
  } catch (error) {
  }
  return ieOrEdge;
}
function isFunction(value) {
  return typeof value === "function";
}
function isNumber(value) {
  return typeof value === "number";
}
var passiveSupported = false;
if (typeof window !== "undefined") {
  try {
    const options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    passiveSupported = false;
  }
}
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
  useG: true
};
var zoneSymbolEventNames = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = new RegExp("^" + ZONE_SYMBOL_PREFIX + "(\\w+)(true|false)$");
var IMMEDIATE_PROPAGATION_SYMBOL = zoneSymbol("propagationStopped");
function prepareEventNames(eventName, eventNameToString) {
  const falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
  const trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
  const symbol = ZONE_SYMBOL_PREFIX + falseEventName;
  const symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
  zoneSymbolEventNames[eventName] = {};
  zoneSymbolEventNames[eventName][FALSE_STR] = symbol;
  zoneSymbolEventNames[eventName][TRUE_STR] = symbolCapture;
}
function patchEventTarget(_global2, api, apis, patchOptions) {
  const ADD_EVENT_LISTENER = patchOptions && patchOptions.add || ADD_EVENT_LISTENER_STR;
  const REMOVE_EVENT_LISTENER = patchOptions && patchOptions.rm || REMOVE_EVENT_LISTENER_STR;
  const LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.listeners || "eventListeners";
  const REMOVE_ALL_LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.rmAll || "removeAllListeners";
  const zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
  const ADD_EVENT_LISTENER_SOURCE = "." + ADD_EVENT_LISTENER + ":";
  const PREPEND_EVENT_LISTENER = "prependListener";
  const PREPEND_EVENT_LISTENER_SOURCE = "." + PREPEND_EVENT_LISTENER + ":";
  const invokeTask = function(task, target, event) {
    if (task.isRemoved) {
      return;
    }
    const delegate = task.callback;
    if (typeof delegate === "object" && delegate.handleEvent) {
      task.callback = (event2) => delegate.handleEvent(event2);
      task.originalDelegate = delegate;
    }
    let error;
    try {
      task.invoke(task, target, [event]);
    } catch (err) {
      error = err;
    }
    const options = task.options;
    if (options && typeof options === "object" && options.once) {
      const delegate2 = task.originalDelegate ? task.originalDelegate : task.callback;
      target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate2, options);
    }
    return error;
  };
  function globalCallback(context, event, isCapture) {
    event = event || _global2.event;
    if (!event) {
      return;
    }
    const target = context || event.target || _global2;
    const tasks = target[zoneSymbolEventNames[event.type][isCapture ? TRUE_STR : FALSE_STR]];
    if (tasks) {
      const errors = [];
      if (tasks.length === 1) {
        const err = invokeTask(tasks[0], target, event);
        err && errors.push(err);
      } else {
        const copyTasks = tasks.slice();
        for (let i = 0; i < copyTasks.length; i++) {
          if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
            break;
          }
          const err = invokeTask(copyTasks[i], target, event);
          err && errors.push(err);
        }
      }
      if (errors.length === 1) {
        throw errors[0];
      } else {
        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];
          api.nativeScheduleMicroTask(() => {
            throw err;
          });
        }
      }
    }
  }
  const globalZoneAwareCallback = function(event) {
    return globalCallback(this, event, false);
  };
  const globalZoneAwareCaptureCallback = function(event) {
    return globalCallback(this, event, true);
  };
  function patchEventTargetMethods(obj, patchOptions2) {
    if (!obj) {
      return false;
    }
    let useGlobalCallback = true;
    if (patchOptions2 && patchOptions2.useG !== void 0) {
      useGlobalCallback = patchOptions2.useG;
    }
    const validateHandler = patchOptions2 && patchOptions2.vh;
    let checkDuplicate = true;
    if (patchOptions2 && patchOptions2.chkDup !== void 0) {
      checkDuplicate = patchOptions2.chkDup;
    }
    let returnTarget = false;
    if (patchOptions2 && patchOptions2.rt !== void 0) {
      returnTarget = patchOptions2.rt;
    }
    let proto = obj;
    while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
      proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && obj[ADD_EVENT_LISTENER]) {
      proto = obj;
    }
    if (!proto) {
      return false;
    }
    if (proto[zoneSymbolAddEventListener]) {
      return false;
    }
    const eventNameToString = patchOptions2 && patchOptions2.eventNameToString;
    const taskData = {};
    const nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
    const nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] = proto[REMOVE_EVENT_LISTENER];
    const nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] = proto[LISTENERS_EVENT_LISTENER];
    const nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] = proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
    let nativePrependEventListener;
    if (patchOptions2 && patchOptions2.prepend) {
      nativePrependEventListener = proto[zoneSymbol(patchOptions2.prepend)] = proto[patchOptions2.prepend];
    }
    function buildEventListenerOptions(options, passive) {
      if (!passiveSupported && typeof options === "object" && options) {
        return !!options.capture;
      }
      if (!passiveSupported || !passive) {
        return options;
      }
      if (typeof options === "boolean") {
        return { capture: options, passive: true };
      }
      if (!options) {
        return { passive: true };
      }
      if (typeof options === "object" && options.passive !== false) {
        return { ...options, passive: true };
      }
      return options;
    }
    const customScheduleGlobal = function(task) {
      if (taskData.isExisting) {
        return;
      }
      return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
    };
    const customCancelGlobal = function(task) {
      if (!task.isRemoved) {
        const symbolEventNames = zoneSymbolEventNames[task.eventName];
        let symbolEventName;
        if (symbolEventNames) {
          symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
        }
        const existingTasks = symbolEventName && task.target[symbolEventName];
        if (existingTasks) {
          for (let i = 0; i < existingTasks.length; i++) {
            const existingTask = existingTasks[i];
            if (existingTask === task) {
              existingTasks.splice(i, 1);
              task.isRemoved = true;
              if (task.removeAbortListener) {
                task.removeAbortListener();
                task.removeAbortListener = null;
              }
              if (existingTasks.length === 0) {
                task.allRemoved = true;
                task.target[symbolEventName] = null;
              }
              break;
            }
          }
        }
      }
      if (!task.allRemoved) {
        return;
      }
      return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
    };
    const customScheduleNonGlobal = function(task) {
      return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customSchedulePrepend = function(task) {
      return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customCancelNonGlobal = function(task) {
      return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
    };
    const customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
    const customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
    const compareTaskCallbackVsDelegate = function(task, delegate) {
      const typeOfDelegate = typeof delegate;
      return typeOfDelegate === "function" && task.callback === delegate || typeOfDelegate === "object" && task.originalDelegate === delegate;
    };
    const compare = patchOptions2 && patchOptions2.diff ? patchOptions2.diff : compareTaskCallbackVsDelegate;
    const unpatchedEvents = Zone[zoneSymbol("UNPATCHED_EVENTS")];
    const passiveEvents = _global2[zoneSymbol("PASSIVE_EVENTS")];
    function copyEventListenerOptions(options) {
      if (typeof options === "object" && options !== null) {
        const newOptions = { ...options };
        if (options.signal) {
          newOptions.signal = options.signal;
        }
        return newOptions;
      }
      return options;
    }
    const makeAddListener = function(nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget2 = false, prepend = false) {
      return function() {
        const target = this || _global2;
        let eventName = arguments[0];
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        let delegate = arguments[1];
        if (!delegate) {
          return nativeListener.apply(this, arguments);
        }
        if (isNode && eventName === "uncaughtException") {
          return nativeListener.apply(this, arguments);
        }
        let isHandleEvent = false;
        if (typeof delegate !== "function") {
          if (!delegate.handleEvent) {
            return nativeListener.apply(this, arguments);
          }
          isHandleEvent = true;
        }
        if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
          return;
        }
        const passive = passiveSupported && !!passiveEvents && passiveEvents.indexOf(eventName) !== -1;
        const options = copyEventListenerOptions(buildEventListenerOptions(arguments[2], passive));
        const signal = options?.signal;
        if (signal?.aborted) {
          return;
        }
        if (unpatchedEvents) {
          for (let i = 0; i < unpatchedEvents.length; i++) {
            if (eventName === unpatchedEvents[i]) {
              if (passive) {
                return nativeListener.call(target, eventName, delegate, options);
              } else {
                return nativeListener.apply(this, arguments);
              }
            }
          }
        }
        const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
        const once = options && typeof options === "object" ? options.once : false;
        const zone = Zone.current;
        let symbolEventNames = zoneSymbolEventNames[eventName];
        if (!symbolEventNames) {
          prepareEventNames(eventName, eventNameToString);
          symbolEventNames = zoneSymbolEventNames[eventName];
        }
        const symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
        let existingTasks = target[symbolEventName];
        let isExisting = false;
        if (existingTasks) {
          isExisting = true;
          if (checkDuplicate) {
            for (let i = 0; i < existingTasks.length; i++) {
              if (compare(existingTasks[i], delegate)) {
                return;
              }
            }
          }
        } else {
          existingTasks = target[symbolEventName] = [];
        }
        let source;
        const constructorName = target.constructor["name"];
        const targetSource = globalSources[constructorName];
        if (targetSource) {
          source = targetSource[eventName];
        }
        if (!source) {
          source = constructorName + addSource + (eventNameToString ? eventNameToString(eventName) : eventName);
        }
        taskData.options = options;
        if (once) {
          taskData.options.once = false;
        }
        taskData.target = target;
        taskData.capture = capture;
        taskData.eventName = eventName;
        taskData.isExisting = isExisting;
        const data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : void 0;
        if (data) {
          data.taskData = taskData;
        }
        if (signal) {
          taskData.options.signal = void 0;
        }
        const task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
        if (signal) {
          taskData.options.signal = signal;
          const onAbort = () => task.zone.cancelTask(task);
          nativeListener.call(signal, "abort", onAbort, { once: true });
          task.removeAbortListener = () => signal.removeEventListener("abort", onAbort);
        }
        taskData.target = null;
        if (data) {
          data.taskData = null;
        }
        if (once) {
          taskData.options.once = true;
        }
        if (!(!passiveSupported && typeof task.options === "boolean")) {
          task.options = options;
        }
        task.target = target;
        task.capture = capture;
        task.eventName = eventName;
        if (isHandleEvent) {
          task.originalDelegate = delegate;
        }
        if (!prepend) {
          existingTasks.push(task);
        } else {
          existingTasks.unshift(task);
        }
        if (returnTarget2) {
          return target;
        }
      };
    };
    proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
    if (nativePrependEventListener) {
      proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
    }
    proto[REMOVE_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const options = arguments[2];
      const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
      const delegate = arguments[1];
      if (!delegate) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      if (validateHandler && !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
        return;
      }
      const symbolEventNames = zoneSymbolEventNames[eventName];
      let symbolEventName;
      if (symbolEventNames) {
        symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
      }
      const existingTasks = symbolEventName && target[symbolEventName];
      if (existingTasks) {
        for (let i = 0; i < existingTasks.length; i++) {
          const existingTask = existingTasks[i];
          if (compare(existingTask, delegate)) {
            existingTasks.splice(i, 1);
            existingTask.isRemoved = true;
            if (existingTasks.length === 0) {
              existingTask.allRemoved = true;
              target[symbolEventName] = null;
              if (!capture && typeof eventName === "string") {
                const onPropertySymbol = ZONE_SYMBOL_PREFIX + "ON_PROPERTY" + eventName;
                target[onPropertySymbol] = null;
              }
            }
            existingTask.zone.cancelTask(existingTask);
            if (returnTarget) {
              return target;
            }
            return;
          }
        }
      }
      return nativeRemoveEventListener.apply(this, arguments);
    };
    proto[LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const listeners = [];
      const tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
        listeners.push(delegate);
      }
      return listeners;
    };
    proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (!eventName) {
        const keys = Object.keys(target);
        for (let i = 0; i < keys.length; i++) {
          const prop = keys[i];
          const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
          let evtName = match && match[1];
          if (evtName && evtName !== "removeListener") {
            this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
          }
        }
        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, "removeListener");
      } else {
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        const symbolEventNames = zoneSymbolEventNames[eventName];
        if (symbolEventNames) {
          const symbolEventName = symbolEventNames[FALSE_STR];
          const symbolCaptureEventName = symbolEventNames[TRUE_STR];
          const tasks = target[symbolEventName];
          const captureTasks = target[symbolCaptureEventName];
          if (tasks) {
            const removeTasks = tasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
          if (captureTasks) {
            const removeTasks = captureTasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
        }
      }
      if (returnTarget) {
        return this;
      }
    };
    attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
    attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
    if (nativeRemoveAllListeners) {
      attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
    }
    if (nativeListeners) {
      attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
    }
    return true;
  }
  let results = [];
  for (let i = 0; i < apis.length; i++) {
    results[i] = patchEventTargetMethods(apis[i], patchOptions);
  }
  return results;
}
function findEventTasks(target, eventName) {
  if (!eventName) {
    const foundTasks = [];
    for (let prop in target) {
      const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
      let evtName = match && match[1];
      if (evtName && (!eventName || evtName === eventName)) {
        const tasks = target[prop];
        if (tasks) {
          for (let i = 0; i < tasks.length; i++) {
            foundTasks.push(tasks[i]);
          }
        }
      }
    }
    return foundTasks;
  }
  let symbolEventName = zoneSymbolEventNames[eventName];
  if (!symbolEventName) {
    prepareEventNames(eventName);
    symbolEventName = zoneSymbolEventNames[eventName];
  }
  const captureFalseTasks = target[symbolEventName[FALSE_STR]];
  const captureTrueTasks = target[symbolEventName[TRUE_STR]];
  if (!captureFalseTasks) {
    return captureTrueTasks ? captureTrueTasks.slice() : [];
  } else {
    return captureTrueTasks ? captureFalseTasks.concat(captureTrueTasks) : captureFalseTasks.slice();
  }
}
function patchEventPrototype(global2, api) {
  const Event = global2["Event"];
  if (Event && Event.prototype) {
    api.patchMethod(Event.prototype, "stopImmediatePropagation", (delegate) => function(self2, args) {
      self2[IMMEDIATE_PROPAGATION_SYMBOL] = true;
      delegate && delegate.apply(self2, args);
    });
  }
}
function patchQueueMicrotask(global2, api) {
  api.patchMethod(global2, "queueMicrotask", (delegate) => {
    return function(self2, args) {
      Zone.current.scheduleMicroTask("queueMicrotask", args[0]);
    };
  });
}
var taskSymbol = zoneSymbol("zoneTask");
function patchTimer(window2, setName, cancelName, nameSuffix) {
  let setNative = null;
  let clearNative = null;
  setName += nameSuffix;
  cancelName += nameSuffix;
  const tasksByHandleId = {};
  function scheduleTask(task) {
    const data = task.data;
    data.args[0] = function() {
      return task.invoke.apply(this, arguments);
    };
    const handleOrId = setNative.apply(window2, data.args);
    if (isNumber(handleOrId)) {
      data.handleId = handleOrId;
    } else {
      data.handle = handleOrId;
      data.isRefreshable = isFunction(handleOrId.refresh);
    }
    return task;
  }
  function clearTask(task) {
    const { handle, handleId } = task.data;
    return clearNative.call(window2, handle ?? handleId);
  }
  setNative = patchMethod(window2, setName, (delegate) => function(self2, args) {
    if (isFunction(args[0])) {
      const options = {
        isRefreshable: false,
        isPeriodic: nameSuffix === "Interval",
        delay: nameSuffix === "Timeout" || nameSuffix === "Interval" ? args[1] || 0 : void 0,
        args
      };
      const callback = args[0];
      args[0] = function timer() {
        try {
          return callback.apply(this, arguments);
        } finally {
          const { handle: handle2, handleId: handleId2, isPeriodic: isPeriodic2, isRefreshable: isRefreshable2 } = options;
          if (!isPeriodic2 && !isRefreshable2) {
            if (handleId2) {
              delete tasksByHandleId[handleId2];
            } else if (handle2) {
              handle2[taskSymbol] = null;
            }
          }
        }
      };
      const task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
      if (!task) {
        return task;
      }
      const { handleId, handle, isRefreshable, isPeriodic } = task.data;
      if (handleId) {
        tasksByHandleId[handleId] = task;
      } else if (handle) {
        handle[taskSymbol] = task;
        if (isRefreshable && !isPeriodic) {
          const originalRefresh = handle.refresh;
          handle.refresh = function() {
            const { zone, state } = task;
            if (state === "notScheduled") {
              task._state = "scheduled";
              zone._updateTaskCount(task, 1);
            } else if (state === "running") {
              task._state = "scheduling";
            }
            return originalRefresh.call(this);
          };
        }
      }
      return handle ?? handleId ?? task;
    } else {
      return delegate.apply(window2, args);
    }
  });
  clearNative = patchMethod(window2, cancelName, (delegate) => function(self2, args) {
    const id = args[0];
    let task;
    if (isNumber(id)) {
      task = tasksByHandleId[id];
      delete tasksByHandleId[id];
    } else {
      task = id?.[taskSymbol];
      if (task) {
        id[taskSymbol] = null;
      } else {
        task = id;
      }
    }
    if (task?.type) {
      if (task.cancelFn) {
        task.zone.cancelTask(task);
      }
    } else {
      delegate.apply(window2, args);
    }
  });
}
function patchCustomElements(_global2, api) {
  const { isBrowser: isBrowser2, isMix: isMix2 } = api.getGlobalObjects();
  if (!isBrowser2 && !isMix2 || !_global2["customElements"] || !("customElements" in _global2)) {
    return;
  }
  const callbacks = [
    "connectedCallback",
    "disconnectedCallback",
    "adoptedCallback",
    "attributeChangedCallback",
    "formAssociatedCallback",
    "formDisabledCallback",
    "formResetCallback",
    "formStateRestoreCallback"
  ];
  api.patchCallbacks(api, _global2.customElements, "customElements", "define", callbacks);
}
function eventTargetPatch(_global2, api) {
  if (Zone[api.symbol("patchEventTarget")]) {
    return;
  }
  const { eventNames, zoneSymbolEventNames: zoneSymbolEventNames2, TRUE_STR: TRUE_STR2, FALSE_STR: FALSE_STR2, ZONE_SYMBOL_PREFIX: ZONE_SYMBOL_PREFIX2 } = api.getGlobalObjects();
  for (let i = 0; i < eventNames.length; i++) {
    const eventName = eventNames[i];
    const falseEventName = eventName + FALSE_STR2;
    const trueEventName = eventName + TRUE_STR2;
    const symbol = ZONE_SYMBOL_PREFIX2 + falseEventName;
    const symbolCapture = ZONE_SYMBOL_PREFIX2 + trueEventName;
    zoneSymbolEventNames2[eventName] = {};
    zoneSymbolEventNames2[eventName][FALSE_STR2] = symbol;
    zoneSymbolEventNames2[eventName][TRUE_STR2] = symbolCapture;
  }
  const EVENT_TARGET = _global2["EventTarget"];
  if (!EVENT_TARGET || !EVENT_TARGET.prototype) {
    return;
  }
  api.patchEventTarget(_global2, api, [EVENT_TARGET && EVENT_TARGET.prototype]);
  return true;
}
function patchEvent(global2, api) {
  api.patchEventPrototype(global2, api);
}
function filterProperties(target, onProperties, ignoreProperties) {
  if (!ignoreProperties || ignoreProperties.length === 0) {
    return onProperties;
  }
  const tip = ignoreProperties.filter((ip) => ip.target === target);
  if (!tip || tip.length === 0) {
    return onProperties;
  }
  const targetIgnoreProperties = tip[0].ignoreProperties;
  return onProperties.filter((op) => targetIgnoreProperties.indexOf(op) === -1);
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
  if (!target) {
    return;
  }
  const filteredProperties = filterProperties(target, onProperties, ignoreProperties);
  patchOnProperties(target, filteredProperties, prototype);
}
function getOnEventNames(target) {
  return Object.getOwnPropertyNames(target).filter((name) => name.startsWith("on") && name.length > 2).map((name) => name.substring(2));
}
function propertyDescriptorPatch(api, _global2) {
  if (isNode && !isMix) {
    return;
  }
  if (Zone[api.symbol("patchEvents")]) {
    return;
  }
  const ignoreProperties = _global2["__Zone_ignore_on_properties"];
  let patchTargets = [];
  if (isBrowser) {
    const internalWindow2 = window;
    patchTargets = patchTargets.concat([
      "Document",
      "SVGElement",
      "Element",
      "HTMLElement",
      "HTMLBodyElement",
      "HTMLMediaElement",
      "HTMLFrameSetElement",
      "HTMLFrameElement",
      "HTMLIFrameElement",
      "HTMLMarqueeElement",
      "Worker"
    ]);
    const ignoreErrorProperties = isIE() ? [{ target: internalWindow2, ignoreProperties: ["error"] }] : [];
    patchFilteredProperties(internalWindow2, getOnEventNames(internalWindow2), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow2));
  }
  patchTargets = patchTargets.concat([
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "IDBIndex",
    "IDBRequest",
    "IDBOpenDBRequest",
    "IDBDatabase",
    "IDBTransaction",
    "IDBCursor",
    "WebSocket"
  ]);
  for (let i = 0; i < patchTargets.length; i++) {
    const target = _global2[patchTargets[i]];
    target && target.prototype && patchFilteredProperties(target.prototype, getOnEventNames(target.prototype), ignoreProperties);
  }
}
function patchBrowser(Zone2) {
  Zone2.__load_patch("legacy", (global2) => {
    const legacyPatch = global2[Zone2.__symbol__("legacyPatch")];
    if (legacyPatch) {
      legacyPatch();
    }
  });
  Zone2.__load_patch("timers", (global2) => {
    const set = "set";
    const clear = "clear";
    patchTimer(global2, set, clear, "Timeout");
    patchTimer(global2, set, clear, "Interval");
    patchTimer(global2, set, clear, "Immediate");
  });
  Zone2.__load_patch("requestAnimationFrame", (global2) => {
    patchTimer(global2, "request", "cancel", "AnimationFrame");
    patchTimer(global2, "mozRequest", "mozCancel", "AnimationFrame");
    patchTimer(global2, "webkitRequest", "webkitCancel", "AnimationFrame");
  });
  Zone2.__load_patch("blocking", (global2, Zone3) => {
    const blockingMethods = ["alert", "prompt", "confirm"];
    for (let i = 0; i < blockingMethods.length; i++) {
      const name = blockingMethods[i];
      patchMethod(global2, name, (delegate, symbol, name2) => {
        return function(s, args) {
          return Zone3.current.run(delegate, global2, args, name2);
        };
      });
    }
  });
  Zone2.__load_patch("EventTarget", (global2, Zone3, api) => {
    patchEvent(global2, api);
    eventTargetPatch(global2, api);
    const XMLHttpRequestEventTarget = global2["XMLHttpRequestEventTarget"];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
      api.patchEventTarget(global2, api, [XMLHttpRequestEventTarget.prototype]);
    }
  });
  Zone2.__load_patch("MutationObserver", (global2, Zone3, api) => {
    patchClass("MutationObserver");
    patchClass("WebKitMutationObserver");
  });
  Zone2.__load_patch("IntersectionObserver", (global2, Zone3, api) => {
    patchClass("IntersectionObserver");
  });
  Zone2.__load_patch("FileReader", (global2, Zone3, api) => {
    patchClass("FileReader");
  });
  Zone2.__load_patch("on_property", (global2, Zone3, api) => {
    propertyDescriptorPatch(api, global2);
  });
  Zone2.__load_patch("customElements", (global2, Zone3, api) => {
    patchCustomElements(global2, api);
  });
  Zone2.__load_patch("XHR", (global2, Zone3) => {
    patchXHR(global2);
    const XHR_TASK = zoneSymbol("xhrTask");
    const XHR_SYNC = zoneSymbol("xhrSync");
    const XHR_LISTENER = zoneSymbol("xhrListener");
    const XHR_SCHEDULED = zoneSymbol("xhrScheduled");
    const XHR_URL = zoneSymbol("xhrURL");
    const XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol("xhrErrorBeforeScheduled");
    function patchXHR(window2) {
      const XMLHttpRequest = window2["XMLHttpRequest"];
      if (!XMLHttpRequest) {
        return;
      }
      const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
      function findPendingTask(target) {
        return target[XHR_TASK];
      }
      let oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
      let oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
      if (!oriAddListener) {
        const XMLHttpRequestEventTarget = window2["XMLHttpRequestEventTarget"];
        if (XMLHttpRequestEventTarget) {
          const XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget.prototype;
          oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
          oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        }
      }
      const READY_STATE_CHANGE = "readystatechange";
      const SCHEDULED = "scheduled";
      function scheduleTask(task) {
        const data = task.data;
        const target = data.target;
        target[XHR_SCHEDULED] = false;
        target[XHR_ERROR_BEFORE_SCHEDULED] = false;
        const listener = target[XHR_LISTENER];
        if (!oriAddListener) {
          oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
          oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        }
        if (listener) {
          oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
        }
        const newListener = target[XHR_LISTENER] = () => {
          if (target.readyState === target.DONE) {
            if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
              const loadTasks = target[Zone3.__symbol__("loadfalse")];
              if (target.status !== 0 && loadTasks && loadTasks.length > 0) {
                const oriInvoke = task.invoke;
                task.invoke = function() {
                  const loadTasks2 = target[Zone3.__symbol__("loadfalse")];
                  for (let i = 0; i < loadTasks2.length; i++) {
                    if (loadTasks2[i] === task) {
                      loadTasks2.splice(i, 1);
                    }
                  }
                  if (!data.aborted && task.state === SCHEDULED) {
                    oriInvoke.call(task);
                  }
                };
                loadTasks.push(task);
              } else {
                task.invoke();
              }
            } else if (!data.aborted && target[XHR_SCHEDULED] === false) {
              target[XHR_ERROR_BEFORE_SCHEDULED] = true;
            }
          }
        };
        oriAddListener.call(target, READY_STATE_CHANGE, newListener);
        const storedTask = target[XHR_TASK];
        if (!storedTask) {
          target[XHR_TASK] = task;
        }
        sendNative.apply(target, data.args);
        target[XHR_SCHEDULED] = true;
        return task;
      }
      function placeholderCallback() {
      }
      function clearTask(task) {
        const data = task.data;
        data.aborted = true;
        return abortNative.apply(data.target, data.args);
      }
      const openNative = patchMethod(XMLHttpRequestPrototype, "open", () => function(self2, args) {
        self2[XHR_SYNC] = args[2] == false;
        self2[XHR_URL] = args[1];
        return openNative.apply(self2, args);
      });
      const XMLHTTPREQUEST_SOURCE = "XMLHttpRequest.send";
      const fetchTaskAborting = zoneSymbol("fetchTaskAborting");
      const fetchTaskScheduling = zoneSymbol("fetchTaskScheduling");
      const sendNative = patchMethod(XMLHttpRequestPrototype, "send", () => function(self2, args) {
        if (Zone3.current[fetchTaskScheduling] === true) {
          return sendNative.apply(self2, args);
        }
        if (self2[XHR_SYNC]) {
          return sendNative.apply(self2, args);
        } else {
          const options = {
            target: self2,
            url: self2[XHR_URL],
            isPeriodic: false,
            args,
            aborted: false
          };
          const task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
          if (self2 && self2[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted && task.state === SCHEDULED) {
            task.invoke();
          }
        }
      });
      const abortNative = patchMethod(XMLHttpRequestPrototype, "abort", () => function(self2, args) {
        const task = findPendingTask(self2);
        if (task && typeof task.type == "string") {
          if (task.cancelFn == null || task.data && task.data.aborted) {
            return;
          }
          task.zone.cancelTask(task);
        } else if (Zone3.current[fetchTaskAborting] === true) {
          return abortNative.apply(self2, args);
        }
      });
    }
  });
  Zone2.__load_patch("geolocation", (global2) => {
    if (global2["navigator"] && global2["navigator"].geolocation) {
      patchPrototype(global2["navigator"].geolocation, ["getCurrentPosition", "watchPosition"]);
    }
  });
  Zone2.__load_patch("PromiseRejectionEvent", (global2, Zone3) => {
    function findPromiseRejectionHandler(evtName) {
      return function(e) {
        const eventTasks = findEventTasks(global2, evtName);
        eventTasks.forEach((eventTask) => {
          const PromiseRejectionEvent = global2["PromiseRejectionEvent"];
          if (PromiseRejectionEvent) {
            const evt = new PromiseRejectionEvent(evtName, {
              promise: e.promise,
              reason: e.rejection
            });
            eventTask.invoke(evt);
          }
        });
      };
    }
    if (global2["PromiseRejectionEvent"]) {
      Zone3[zoneSymbol("unhandledPromiseRejectionHandler")] = findPromiseRejectionHandler("unhandledrejection");
      Zone3[zoneSymbol("rejectionHandledHandler")] = findPromiseRejectionHandler("rejectionhandled");
    }
  });
  Zone2.__load_patch("queueMicrotask", (global2, Zone3, api) => {
    patchQueueMicrotask(global2, api);
  });
}
function patchPromise(Zone2) {
  Zone2.__load_patch("ZoneAwarePromise", (global2, Zone3, api) => {
    const ObjectGetOwnPropertyDescriptor2 = Object.getOwnPropertyDescriptor;
    const ObjectDefineProperty2 = Object.defineProperty;
    function readableObjectToString(obj) {
      if (obj && obj.toString === Object.prototype.toString) {
        const className = obj.constructor && obj.constructor.name;
        return (className ? className : "") + ": " + JSON.stringify(obj);
      }
      return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    const __symbol__2 = api.symbol;
    const _uncaughtPromiseErrors = [];
    const isDisableWrappingUncaughtPromiseRejection = global2[__symbol__2("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== false;
    const symbolPromise = __symbol__2("Promise");
    const symbolThen = __symbol__2("then");
    const creationTrace = "__creationTrace__";
    api.onUnhandledError = (e) => {
      if (api.showUncaughtError()) {
        const rejection = e && e.rejection;
        if (rejection) {
          console.error("Unhandled Promise rejection:", rejection instanceof Error ? rejection.message : rejection, "; Zone:", e.zone.name, "; Task:", e.task && e.task.source, "; Value:", rejection, rejection instanceof Error ? rejection.stack : void 0);
        } else {
          console.error(e);
        }
      }
    };
    api.microtaskDrainDone = () => {
      while (_uncaughtPromiseErrors.length) {
        const uncaughtPromiseError = _uncaughtPromiseErrors.shift();
        try {
          uncaughtPromiseError.zone.runGuarded(() => {
            if (uncaughtPromiseError.throwOriginal) {
              throw uncaughtPromiseError.rejection;
            }
            throw uncaughtPromiseError;
          });
        } catch (error) {
          handleUnhandledRejection(error);
        }
      }
    };
    const UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__2("unhandledPromiseRejectionHandler");
    function handleUnhandledRejection(e) {
      api.onUnhandledError(e);
      try {
        const handler = Zone3[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
        if (typeof handler === "function") {
          handler.call(this, e);
        }
      } catch (err) {
      }
    }
    function isThenable(value) {
      return value && value.then;
    }
    function forwardResolution(value) {
      return value;
    }
    function forwardRejection(rejection) {
      return ZoneAwarePromise.reject(rejection);
    }
    const symbolState = __symbol__2("state");
    const symbolValue = __symbol__2("value");
    const symbolFinally = __symbol__2("finally");
    const symbolParentPromiseValue = __symbol__2("parentPromiseValue");
    const symbolParentPromiseState = __symbol__2("parentPromiseState");
    const source = "Promise.then";
    const UNRESOLVED = null;
    const RESOLVED = true;
    const REJECTED = false;
    const REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
      return (v) => {
        try {
          resolvePromise(promise, state, v);
        } catch (err) {
          resolvePromise(promise, false, err);
        }
      };
    }
    const once = function() {
      let wasCalled = false;
      return function wrapper(wrappedFunction) {
        return function() {
          if (wasCalled) {
            return;
          }
          wasCalled = true;
          wrappedFunction.apply(null, arguments);
        };
      };
    };
    const TYPE_ERROR = "Promise resolved with itself";
    const CURRENT_TASK_TRACE_SYMBOL = __symbol__2("currentTaskTrace");
    function resolvePromise(promise, state, value) {
      const onceWrapper = once();
      if (promise === value) {
        throw new TypeError(TYPE_ERROR);
      }
      if (promise[symbolState] === UNRESOLVED) {
        let then = null;
        try {
          if (typeof value === "object" || typeof value === "function") {
            then = value && value.then;
          }
        } catch (err) {
          onceWrapper(() => {
            resolvePromise(promise, false, err);
          })();
          return promise;
        }
        if (state !== REJECTED && value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
          clearRejectedNoCatch(value);
          resolvePromise(promise, value[symbolState], value[symbolValue]);
        } else if (state !== REJECTED && typeof then === "function") {
          try {
            then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
          } catch (err) {
            onceWrapper(() => {
              resolvePromise(promise, false, err);
            })();
          }
        } else {
          promise[symbolState] = state;
          const queue = promise[symbolValue];
          promise[symbolValue] = value;
          if (promise[symbolFinally] === symbolFinally) {
            if (state === RESOLVED) {
              promise[symbolState] = promise[symbolParentPromiseState];
              promise[symbolValue] = promise[symbolParentPromiseValue];
            }
          }
          if (state === REJECTED && value instanceof Error) {
            const trace = Zone3.currentTask && Zone3.currentTask.data && Zone3.currentTask.data[creationTrace];
            if (trace) {
              ObjectDefineProperty2(value, CURRENT_TASK_TRACE_SYMBOL, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: trace
              });
            }
          }
          for (let i = 0; i < queue.length; ) {
            scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
          }
          if (queue.length == 0 && state == REJECTED) {
            promise[symbolState] = REJECTED_NO_CATCH;
            let uncaughtPromiseError = value;
            try {
              throw new Error("Uncaught (in promise): " + readableObjectToString(value) + (value && value.stack ? "\n" + value.stack : ""));
            } catch (err) {
              uncaughtPromiseError = err;
            }
            if (isDisableWrappingUncaughtPromiseRejection) {
              uncaughtPromiseError.throwOriginal = true;
            }
            uncaughtPromiseError.rejection = value;
            uncaughtPromiseError.promise = promise;
            uncaughtPromiseError.zone = Zone3.current;
            uncaughtPromiseError.task = Zone3.currentTask;
            _uncaughtPromiseErrors.push(uncaughtPromiseError);
            api.scheduleMicroTask();
          }
        }
      }
      return promise;
    }
    const REJECTION_HANDLED_HANDLER = __symbol__2("rejectionHandledHandler");
    function clearRejectedNoCatch(promise) {
      if (promise[symbolState] === REJECTED_NO_CATCH) {
        try {
          const handler = Zone3[REJECTION_HANDLED_HANDLER];
          if (handler && typeof handler === "function") {
            handler.call(this, { rejection: promise[symbolValue], promise });
          }
        } catch (err) {
        }
        promise[symbolState] = REJECTED;
        for (let i = 0; i < _uncaughtPromiseErrors.length; i++) {
          if (promise === _uncaughtPromiseErrors[i].promise) {
            _uncaughtPromiseErrors.splice(i, 1);
          }
        }
      }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
      clearRejectedNoCatch(promise);
      const promiseState = promise[symbolState];
      const delegate = promiseState ? typeof onFulfilled === "function" ? onFulfilled : forwardResolution : typeof onRejected === "function" ? onRejected : forwardRejection;
      zone.scheduleMicroTask(source, () => {
        try {
          const parentPromiseValue = promise[symbolValue];
          const isFinallyPromise = !!chainPromise && symbolFinally === chainPromise[symbolFinally];
          if (isFinallyPromise) {
            chainPromise[symbolParentPromiseValue] = parentPromiseValue;
            chainPromise[symbolParentPromiseState] = promiseState;
          }
          const value = zone.run(delegate, void 0, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
          resolvePromise(chainPromise, true, value);
        } catch (error) {
          resolvePromise(chainPromise, false, error);
        }
      }, chainPromise);
    }
    const ZONE_AWARE_PROMISE_TO_STRING = "function ZoneAwarePromise() { [native code] }";
    const noop = function() {
    };
    const AggregateError = global2.AggregateError;
    class ZoneAwarePromise {
      static toString() {
        return ZONE_AWARE_PROMISE_TO_STRING;
      }
      static resolve(value) {
        if (value instanceof ZoneAwarePromise) {
          return value;
        }
        return resolvePromise(new this(null), RESOLVED, value);
      }
      static reject(error) {
        return resolvePromise(new this(null), REJECTED, error);
      }
      static withResolvers() {
        const result = {};
        result.promise = new ZoneAwarePromise((res, rej) => {
          result.resolve = res;
          result.reject = rej;
        });
        return result;
      }
      static any(values) {
        if (!values || typeof values[Symbol.iterator] !== "function") {
          return Promise.reject(new AggregateError([], "All promises were rejected"));
        }
        const promises = [];
        let count = 0;
        try {
          for (let v of values) {
            count++;
            promises.push(ZoneAwarePromise.resolve(v));
          }
        } catch (err) {
          return Promise.reject(new AggregateError([], "All promises were rejected"));
        }
        if (count === 0) {
          return Promise.reject(new AggregateError([], "All promises were rejected"));
        }
        let finished = false;
        const errors = [];
        return new ZoneAwarePromise((resolve, reject) => {
          for (let i = 0; i < promises.length; i++) {
            promises[i].then((v) => {
              if (finished) {
                return;
              }
              finished = true;
              resolve(v);
            }, (err) => {
              errors.push(err);
              count--;
              if (count === 0) {
                finished = true;
                reject(new AggregateError(errors, "All promises were rejected"));
              }
            });
          }
        });
      }
      static race(values) {
        let resolve;
        let reject;
        let promise = new this((res, rej) => {
          resolve = res;
          reject = rej;
        });
        function onResolve(value) {
          resolve(value);
        }
        function onReject(error) {
          reject(error);
        }
        for (let value of values) {
          if (!isThenable(value)) {
            value = this.resolve(value);
          }
          value.then(onResolve, onReject);
        }
        return promise;
      }
      static all(values) {
        return ZoneAwarePromise.allWithCallback(values);
      }
      static allSettled(values) {
        const P = this && this.prototype instanceof ZoneAwarePromise ? this : ZoneAwarePromise;
        return P.allWithCallback(values, {
          thenCallback: (value) => ({ status: "fulfilled", value }),
          errorCallback: (err) => ({ status: "rejected", reason: err })
        });
      }
      static allWithCallback(values, callback) {
        let resolve;
        let reject;
        let promise = new this((res, rej) => {
          resolve = res;
          reject = rej;
        });
        let unresolvedCount = 2;
        let valueIndex = 0;
        const resolvedValues = [];
        for (let value of values) {
          if (!isThenable(value)) {
            value = this.resolve(value);
          }
          const curValueIndex = valueIndex;
          try {
            value.then((value2) => {
              resolvedValues[curValueIndex] = callback ? callback.thenCallback(value2) : value2;
              unresolvedCount--;
              if (unresolvedCount === 0) {
                resolve(resolvedValues);
              }
            }, (err) => {
              if (!callback) {
                reject(err);
              } else {
                resolvedValues[curValueIndex] = callback.errorCallback(err);
                unresolvedCount--;
                if (unresolvedCount === 0) {
                  resolve(resolvedValues);
                }
              }
            });
          } catch (thenErr) {
            reject(thenErr);
          }
          unresolvedCount++;
          valueIndex++;
        }
        unresolvedCount -= 2;
        if (unresolvedCount === 0) {
          resolve(resolvedValues);
        }
        return promise;
      }
      constructor(executor) {
        const promise = this;
        if (!(promise instanceof ZoneAwarePromise)) {
          throw new Error("Must be an instanceof Promise.");
        }
        promise[symbolState] = UNRESOLVED;
        promise[symbolValue] = [];
        try {
          const onceWrapper = once();
          executor && executor(onceWrapper(makeResolver(promise, RESOLVED)), onceWrapper(makeResolver(promise, REJECTED)));
        } catch (error) {
          resolvePromise(promise, false, error);
        }
      }
      get [Symbol.toStringTag]() {
        return "Promise";
      }
      get [Symbol.species]() {
        return ZoneAwarePromise;
      }
      then(onFulfilled, onRejected) {
        let C = this.constructor?.[Symbol.species];
        if (!C || typeof C !== "function") {
          C = this.constructor || ZoneAwarePromise;
        }
        const chainPromise = new C(noop);
        const zone = Zone3.current;
        if (this[symbolState] == UNRESOLVED) {
          this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
        } else {
          scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
        }
        return chainPromise;
      }
      catch(onRejected) {
        return this.then(null, onRejected);
      }
      finally(onFinally) {
        let C = this.constructor?.[Symbol.species];
        if (!C || typeof C !== "function") {
          C = ZoneAwarePromise;
        }
        const chainPromise = new C(noop);
        chainPromise[symbolFinally] = symbolFinally;
        const zone = Zone3.current;
        if (this[symbolState] == UNRESOLVED) {
          this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
        } else {
          scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
        }
        return chainPromise;
      }
    }
    ZoneAwarePromise["resolve"] = ZoneAwarePromise.resolve;
    ZoneAwarePromise["reject"] = ZoneAwarePromise.reject;
    ZoneAwarePromise["race"] = ZoneAwarePromise.race;
    ZoneAwarePromise["all"] = ZoneAwarePromise.all;
    const NativePromise = global2[symbolPromise] = global2["Promise"];
    global2["Promise"] = ZoneAwarePromise;
    const symbolThenPatched = __symbol__2("thenPatched");
    function patchThen(Ctor) {
      const proto = Ctor.prototype;
      const prop = ObjectGetOwnPropertyDescriptor2(proto, "then");
      if (prop && (prop.writable === false || !prop.configurable)) {
        return;
      }
      const originalThen = proto.then;
      proto[symbolThen] = originalThen;
      Ctor.prototype.then = function(onResolve, onReject) {
        const wrapped = new ZoneAwarePromise((resolve, reject) => {
          originalThen.call(this, resolve, reject);
        });
        return wrapped.then(onResolve, onReject);
      };
      Ctor[symbolThenPatched] = true;
    }
    api.patchThen = patchThen;
    function zoneify(fn) {
      return function(self2, args) {
        let resultPromise = fn.apply(self2, args);
        if (resultPromise instanceof ZoneAwarePromise) {
          return resultPromise;
        }
        let ctor = resultPromise.constructor;
        if (!ctor[symbolThenPatched]) {
          patchThen(ctor);
        }
        return resultPromise;
      };
    }
    if (NativePromise) {
      patchThen(NativePromise);
      patchMethod(global2, "fetch", (delegate) => zoneify(delegate));
    }
    Promise[Zone3.__symbol__("uncaughtPromiseErrors")] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
  });
}
function patchToString(Zone2) {
  Zone2.__load_patch("toString", (global2) => {
    const originalFunctionToString = Function.prototype.toString;
    const ORIGINAL_DELEGATE_SYMBOL = zoneSymbol("OriginalDelegate");
    const PROMISE_SYMBOL = zoneSymbol("Promise");
    const ERROR_SYMBOL = zoneSymbol("Error");
    const newFunctionToString = function toString() {
      if (typeof this === "function") {
        const originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
        if (originalDelegate) {
          if (typeof originalDelegate === "function") {
            return originalFunctionToString.call(originalDelegate);
          } else {
            return Object.prototype.toString.call(originalDelegate);
          }
        }
        if (this === Promise) {
          const nativePromise = global2[PROMISE_SYMBOL];
          if (nativePromise) {
            return originalFunctionToString.call(nativePromise);
          }
        }
        if (this === Error) {
          const nativeError = global2[ERROR_SYMBOL];
          if (nativeError) {
            return originalFunctionToString.call(nativeError);
          }
        }
      }
      return originalFunctionToString.call(this);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    const originalObjectToString = Object.prototype.toString;
    const PROMISE_OBJECT_TO_STRING = "[object Promise]";
    Object.prototype.toString = function() {
      if (typeof Promise === "function" && this instanceof Promise) {
        return PROMISE_OBJECT_TO_STRING;
      }
      return originalObjectToString.call(this);
    };
  });
}
function patchCallbacks(api, target, targetName, method, callbacks) {
  const symbol = Zone.__symbol__(method);
  if (target[symbol]) {
    return;
  }
  const nativeDelegate = target[symbol] = target[method];
  target[method] = function(name, opts, options) {
    if (opts && opts.prototype) {
      callbacks.forEach(function(callback) {
        const source = `${targetName}.${method}::` + callback;
        const prototype = opts.prototype;
        try {
          if (prototype.hasOwnProperty(callback)) {
            const descriptor = api.ObjectGetOwnPropertyDescriptor(prototype, callback);
            if (descriptor && descriptor.value) {
              descriptor.value = api.wrapWithCurrentZone(descriptor.value, source);
              api._redefineProperty(opts.prototype, callback, descriptor);
            } else if (prototype[callback]) {
              prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
            }
          } else if (prototype[callback]) {
            prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
          }
        } catch {
        }
      });
    }
    return nativeDelegate.call(target, name, opts, options);
  };
  api.attachOriginToPatched(target[method], nativeDelegate);
}
function patchUtil(Zone2) {
  Zone2.__load_patch("util", (global2, Zone3, api) => {
    const eventNames = getOnEventNames(global2);
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
    api.patchMacroTask = patchMacroTask;
    const SYMBOL_BLACK_LISTED_EVENTS = Zone3.__symbol__("BLACK_LISTED_EVENTS");
    const SYMBOL_UNPATCHED_EVENTS = Zone3.__symbol__("UNPATCHED_EVENTS");
    if (global2[SYMBOL_UNPATCHED_EVENTS]) {
      global2[SYMBOL_BLACK_LISTED_EVENTS] = global2[SYMBOL_UNPATCHED_EVENTS];
    }
    if (global2[SYMBOL_BLACK_LISTED_EVENTS]) {
      Zone3[SYMBOL_BLACK_LISTED_EVENTS] = Zone3[SYMBOL_UNPATCHED_EVENTS] = global2[SYMBOL_BLACK_LISTED_EVENTS];
    }
    api.patchEventPrototype = patchEventPrototype;
    api.patchEventTarget = patchEventTarget;
    api.isIEOrEdge = isIEOrEdge;
    api.ObjectDefineProperty = ObjectDefineProperty;
    api.ObjectGetOwnPropertyDescriptor = ObjectGetOwnPropertyDescriptor;
    api.ObjectCreate = ObjectCreate;
    api.ArraySlice = ArraySlice;
    api.patchClass = patchClass;
    api.wrapWithCurrentZone = wrapWithCurrentZone;
    api.filterProperties = filterProperties;
    api.attachOriginToPatched = attachOriginToPatched;
    api._redefineProperty = Object.defineProperty;
    api.patchCallbacks = patchCallbacks;
    api.getGlobalObjects = () => ({
      globalSources,
      zoneSymbolEventNames,
      eventNames,
      isBrowser,
      isMix,
      isNode,
      TRUE_STR,
      FALSE_STR,
      ZONE_SYMBOL_PREFIX,
      ADD_EVENT_LISTENER_STR,
      REMOVE_EVENT_LISTENER_STR
    });
  });
}
function patchCommon(Zone2) {
  patchPromise(Zone2);
  patchToString(Zone2);
  patchUtil(Zone2);
}
var Zone$1 = loadZone();
patchCommon(Zone$1);
patchBrowser(Zone$1);
/*! Bundled license information:

zone.js/fesm2015/zone.js:
  (**
   * @license Angular v<unknown>
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)
*/


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy96b25lLmpzL2Zlc20yMDE1L3pvbmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAbGljZW5zZSBBbmd1bGFyIHY8dW5rbm93bj5cbiAqIChjKSAyMDEwLTIwMjQgR29vZ2xlIExMQy4gaHR0cHM6Ly9hbmd1bGFyLmlvL1xuICogTGljZW5zZTogTUlUXG4gKi9cbmNvbnN0IGdsb2JhbCA9IGdsb2JhbFRoaXM7XG4vLyBfX1pvbmVfc3ltYm9sX3ByZWZpeCBnbG9iYWwgY2FuIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgem9uZVxuLy8gc3ltYm9sIHByZWZpeCB3aXRoIGEgY3VzdG9tIG9uZSBpZiBuZWVkZWQuXG5mdW5jdGlvbiBfX3N5bWJvbF9fKG5hbWUpIHtcbiAgICBjb25zdCBzeW1ib2xQcmVmaXggPSBnbG9iYWxbJ19fWm9uZV9zeW1ib2xfcHJlZml4J10gfHwgJ19fem9uZV9zeW1ib2xfXyc7XG4gICAgcmV0dXJuIHN5bWJvbFByZWZpeCArIG5hbWU7XG59XG5mdW5jdGlvbiBpbml0Wm9uZSgpIHtcbiAgICBjb25zdCBwZXJmb3JtYW5jZSA9IGdsb2JhbFsncGVyZm9ybWFuY2UnXTtcbiAgICBmdW5jdGlvbiBtYXJrKG5hbWUpIHtcbiAgICAgICAgcGVyZm9ybWFuY2UgJiYgcGVyZm9ybWFuY2VbJ21hcmsnXSAmJiBwZXJmb3JtYW5jZVsnbWFyayddKG5hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwZXJmb3JtYW5jZU1lYXN1cmUobmFtZSwgbGFiZWwpIHtcbiAgICAgICAgcGVyZm9ybWFuY2UgJiYgcGVyZm9ybWFuY2VbJ21lYXN1cmUnXSAmJiBwZXJmb3JtYW5jZVsnbWVhc3VyZSddKG5hbWUsIGxhYmVsKTtcbiAgICB9XG4gICAgbWFyaygnWm9uZScpO1xuICAgIGNsYXNzIFpvbmVJbXBsIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgIHN0YXRpYyB7IHRoaXMuX19zeW1ib2xfXyA9IF9fc3ltYm9sX187IH1cbiAgICAgICAgc3RhdGljIGFzc2VydFpvbmVQYXRjaGVkKCkge1xuICAgICAgICAgICAgaWYgKGdsb2JhbFsnUHJvbWlzZSddICE9PSBwYXRjaGVzWydab25lQXdhcmVQcm9taXNlJ10pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1pvbmUuanMgaGFzIGRldGVjdGVkIHRoYXQgWm9uZUF3YXJlUHJvbWlzZSBgKHdpbmRvd3xnbG9iYWwpLlByb21pc2VgICcgK1xuICAgICAgICAgICAgICAgICAgICAnaGFzIGJlZW4gb3ZlcndyaXR0ZW4uXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICdNb3N0IGxpa2VseSBjYXVzZSBpcyB0aGF0IGEgUHJvbWlzZSBwb2x5ZmlsbCBoYXMgYmVlbiBsb2FkZWQgJyArXG4gICAgICAgICAgICAgICAgICAgICdhZnRlciBab25lLmpzIChQb2x5ZmlsbGluZyBQcm9taXNlIGFwaSBpcyBub3QgbmVjZXNzYXJ5IHdoZW4gem9uZS5qcyBpcyBsb2FkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnSWYgeW91IG11c3QgbG9hZCBvbmUsIGRvIHNvIGJlZm9yZSBsb2FkaW5nIHpvbmUuanMuKScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgcm9vdCgpIHtcbiAgICAgICAgICAgIGxldCB6b25lID0gWm9uZUltcGwuY3VycmVudDtcbiAgICAgICAgICAgIHdoaWxlICh6b25lLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIHpvbmUgPSB6b25lLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB6b25lO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgY3VycmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiBfY3VycmVudFpvbmVGcmFtZS56b25lO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgY3VycmVudFRhc2soKSB7XG4gICAgICAgICAgICByZXR1cm4gX2N1cnJlbnRUYXNrO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICAgICAgICBzdGF0aWMgX19sb2FkX3BhdGNoKG5hbWUsIGZuLCBpZ25vcmVEdXBsaWNhdGUgPSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKHBhdGNoZXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBgY2hlY2tEdXBsaWNhdGVgIG9wdGlvbiBpcyBkZWZpbmVkIGZyb20gZ2xvYmFsIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgLy8gc28gaXQgd29ya3MgZm9yIGFsbCBtb2R1bGVzLlxuICAgICAgICAgICAgICAgIC8vIGBpZ25vcmVEdXBsaWNhdGVgIGNhbiB3b3JrIGZvciB0aGUgc3BlY2lmaWVkIG1vZHVsZVxuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrRHVwbGljYXRlID0gZ2xvYmFsW19fc3ltYm9sX18oJ2ZvcmNlRHVwbGljYXRlWm9uZUNoZWNrJyldID09PSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICghaWdub3JlRHVwbGljYXRlICYmIGNoZWNrRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdBbHJlYWR5IGxvYWRlZCBwYXRjaDogJyArIG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFnbG9iYWxbJ19fWm9uZV9kaXNhYmxlXycgKyBuYW1lXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmZOYW1lID0gJ1pvbmU6JyArIG5hbWU7XG4gICAgICAgICAgICAgICAgbWFyayhwZXJmTmFtZSk7XG4gICAgICAgICAgICAgICAgcGF0Y2hlc1tuYW1lXSA9IGZuKGdsb2JhbCwgWm9uZUltcGwsIF9hcGkpO1xuICAgICAgICAgICAgICAgIHBlcmZvcm1hbmNlTWVhc3VyZShwZXJmTmFtZSwgcGVyZk5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGdldCBwYXJlbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIGdldCBuYW1lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3RydWN0b3IocGFyZW50LCB6b25lU3BlYykge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHpvbmVTcGVjID8gem9uZVNwZWMubmFtZSB8fCAndW5uYW1lZCcgOiAnPHJvb3Q+JztcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSAoem9uZVNwZWMgJiYgem9uZVNwZWMucHJvcGVydGllcykgfHwge307XG4gICAgICAgICAgICB0aGlzLl96b25lRGVsZWdhdGUgPSBuZXcgX1pvbmVEZWxlZ2F0ZSh0aGlzLCB0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50Ll96b25lRGVsZWdhdGUsIHpvbmVTcGVjKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQoa2V5KSB7XG4gICAgICAgICAgICBjb25zdCB6b25lID0gdGhpcy5nZXRab25lV2l0aChrZXkpO1xuICAgICAgICAgICAgaWYgKHpvbmUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvbmUuX3Byb3BlcnRpZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBnZXRab25lV2l0aChrZXkpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQuX3Byb3BlcnRpZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQuX3BhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGZvcmsoem9uZVNwZWMpIHtcbiAgICAgICAgICAgIGlmICghem9uZVNwZWMpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdab25lU3BlYyByZXF1aXJlZCEnKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lRGVsZWdhdGUuZm9yayh0aGlzLCB6b25lU3BlYyk7XG4gICAgICAgIH1cbiAgICAgICAgd3JhcChjYWxsYmFjaywgc291cmNlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RpbmcgZnVuY3Rpb24gZ290OiAnICsgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgX2NhbGxiYWNrID0gdGhpcy5fem9uZURlbGVnYXRlLmludGVyY2VwdCh0aGlzLCBjYWxsYmFjaywgc291cmNlKTtcbiAgICAgICAgICAgIGNvbnN0IHpvbmUgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9uZS5ydW5HdWFyZGVkKF9jYWxsYmFjaywgdGhpcywgYXJndW1lbnRzLCBzb3VyY2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBydW4oY2FsbGJhY2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpIHtcbiAgICAgICAgICAgIF9jdXJyZW50Wm9uZUZyYW1lID0geyBwYXJlbnQ6IF9jdXJyZW50Wm9uZUZyYW1lLCB6b25lOiB0aGlzIH07XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lRGVsZWdhdGUuaW52b2tlKHRoaXMsIGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIF9jdXJyZW50Wm9uZUZyYW1lID0gX2N1cnJlbnRab25lRnJhbWUucGFyZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJ1bkd1YXJkZWQoY2FsbGJhY2ssIGFwcGx5VGhpcyA9IG51bGwsIGFwcGx5QXJncywgc291cmNlKSB7XG4gICAgICAgICAgICBfY3VycmVudFpvbmVGcmFtZSA9IHsgcGFyZW50OiBfY3VycmVudFpvbmVGcmFtZSwgem9uZTogdGhpcyB9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fem9uZURlbGVnYXRlLmludm9rZSh0aGlzLCBjYWxsYmFjaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fem9uZURlbGVnYXRlLmhhbmRsZUVycm9yKHRoaXMsIGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBfY3VycmVudFpvbmVGcmFtZSA9IF9jdXJyZW50Wm9uZUZyYW1lLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBydW5UYXNrKHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKSB7XG4gICAgICAgICAgICBpZiAodGFzay56b25lICE9IHRoaXMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgdGFzayBjYW4gb25seSBiZSBydW4gaW4gdGhlIHpvbmUgb2YgY3JlYXRpb24hIChDcmVhdGlvbjogJyArXG4gICAgICAgICAgICAgICAgICAgICh0YXNrLnpvbmUgfHwgTk9fWk9ORSkubmFtZSArXG4gICAgICAgICAgICAgICAgICAgICc7IEV4ZWN1dGlvbjogJyArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSArXG4gICAgICAgICAgICAgICAgICAgICcpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB6b25lVGFzayA9IHRhc2s7XG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy83NzgsIHNvbWV0aW1lcyBldmVudFRhc2tcbiAgICAgICAgICAgIC8vIHdpbGwgcnVuIGluIG5vdFNjaGVkdWxlZChjYW5jZWxlZCkgc3RhdGUsIHdlIHNob3VsZCBub3QgdHJ5IHRvXG4gICAgICAgICAgICAvLyBydW4gc3VjaCBraW5kIG9mIHRhc2sgYnV0IGp1c3QgcmV0dXJuXG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIGRhdGE6IHsgaXNQZXJpb2RpYyA9IGZhbHNlLCBpc1JlZnJlc2hhYmxlID0gZmFsc2UgfSA9IHt9IH0gPSB0YXNrO1xuICAgICAgICAgICAgaWYgKHRhc2suc3RhdGUgPT09IG5vdFNjaGVkdWxlZCAmJiAodHlwZSA9PT0gZXZlbnRUYXNrIHx8IHR5cGUgPT09IG1hY3JvVGFzaykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZUVudHJ5R3VhcmQgPSB0YXNrLnN0YXRlICE9IHJ1bm5pbmc7XG4gICAgICAgICAgICByZUVudHJ5R3VhcmQgJiYgem9uZVRhc2suX3RyYW5zaXRpb25UbyhydW5uaW5nLCBzY2hlZHVsZWQpO1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNUYXNrID0gX2N1cnJlbnRUYXNrO1xuICAgICAgICAgICAgX2N1cnJlbnRUYXNrID0gem9uZVRhc2s7XG4gICAgICAgICAgICBfY3VycmVudFpvbmVGcmFtZSA9IHsgcGFyZW50OiBfY3VycmVudFpvbmVGcmFtZSwgem9uZTogdGhpcyB9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBtYWNyb1Rhc2sgJiYgdGFzay5kYXRhICYmICFpc1BlcmlvZGljICYmICFpc1JlZnJlc2hhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2suY2FuY2VsRm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lRGVsZWdhdGUuaW52b2tlVGFzayh0aGlzLCB6b25lVGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3pvbmVEZWxlZ2F0ZS5oYW5kbGVFcnJvcih0aGlzLCBlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHRhc2sncyBzdGF0ZSBpcyBub3RTY2hlZHVsZWQgb3IgdW5rbm93biwgdGhlbiBpdCBoYXMgYWxyZWFkeSBiZWVuIGNhbmNlbGxlZFxuICAgICAgICAgICAgICAgIC8vIHdlIHNob3VsZCBub3QgcmVzZXQgdGhlIHN0YXRlIHRvIHNjaGVkdWxlZFxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gdGFzay5zdGF0ZTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09IG5vdFNjaGVkdWxlZCAmJiBzdGF0ZSAhPT0gdW5rbm93bikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBldmVudFRhc2sgfHwgaXNQZXJpb2RpYyB8fCAoaXNSZWZyZXNoYWJsZSAmJiBzdGF0ZSA9PT0gc2NoZWR1bGluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlRW50cnlHdWFyZCAmJiB6b25lVGFzay5fdHJhbnNpdGlvblRvKHNjaGVkdWxlZCwgcnVubmluZywgc2NoZWR1bGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB6b25lRGVsZWdhdGVzID0gem9uZVRhc2suX3pvbmVEZWxlZ2F0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVUYXNrQ291bnQoem9uZVRhc2ssIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlRW50cnlHdWFyZCAmJiB6b25lVGFzay5fdHJhbnNpdGlvblRvKG5vdFNjaGVkdWxlZCwgcnVubmluZywgbm90U2NoZWR1bGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1JlZnJlc2hhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgem9uZVRhc2suX3pvbmVEZWxlZ2F0ZXMgPSB6b25lRGVsZWdhdGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9jdXJyZW50Wm9uZUZyYW1lID0gX2N1cnJlbnRab25lRnJhbWUucGFyZW50O1xuICAgICAgICAgICAgICAgIF9jdXJyZW50VGFzayA9IHByZXZpb3VzVGFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzY2hlZHVsZVRhc2sodGFzaykge1xuICAgICAgICAgICAgaWYgKHRhc2suem9uZSAmJiB0YXNrLnpvbmUgIT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgdGFzayB3YXMgcmVzY2hlZHVsZWQsIHRoZSBuZXdab25lXG4gICAgICAgICAgICAgICAgLy8gc2hvdWxkIG5vdCBiZSB0aGUgY2hpbGRyZW4gb2YgdGhlIG9yaWdpbmFsIHpvbmVcbiAgICAgICAgICAgICAgICBsZXQgbmV3Wm9uZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5ld1pvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1pvbmUgPT09IHRhc2suem9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoYGNhbiBub3QgcmVzY2hlZHVsZSB0YXNrIHRvICR7dGhpcy5uYW1lfSB3aGljaCBpcyBkZXNjZW5kYW50cyBvZiB0aGUgb3JpZ2luYWwgem9uZSAke3Rhc2suem9uZS5uYW1lfWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld1pvbmUgPSBuZXdab25lLnBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8oc2NoZWR1bGluZywgbm90U2NoZWR1bGVkKTtcbiAgICAgICAgICAgIGNvbnN0IHpvbmVEZWxlZ2F0ZXMgPSBbXTtcbiAgICAgICAgICAgIHRhc2suX3pvbmVEZWxlZ2F0ZXMgPSB6b25lRGVsZWdhdGVzO1xuICAgICAgICAgICAgdGFzay5fem9uZSA9IHRoaXM7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhc2sgPSB0aGlzLl96b25lRGVsZWdhdGUuc2NoZWR1bGVUYXNrKHRoaXMsIHRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vIHNob3VsZCBzZXQgdGFzaydzIHN0YXRlIHRvIHVua25vd24gd2hlbiBzY2hlZHVsZVRhc2sgdGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBlcnIgbWF5IGZyb20gcmVzY2hlZHVsZSwgc28gdGhlIGZyb21TdGF0ZSBtYXliZSBub3RTY2hlZHVsZWRcbiAgICAgICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8odW5rbm93biwgc2NoZWR1bGluZywgbm90U2NoZWR1bGVkKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBASmlhTGlQYXNzaW9uLCBzaG91bGQgd2UgY2hlY2sgdGhlIHJlc3VsdCBmcm9tIGhhbmRsZUVycm9yP1xuICAgICAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZS5oYW5kbGVFcnJvcih0aGlzLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXNrLl96b25lRGVsZWdhdGVzID09PSB6b25lRGVsZWdhdGVzKSB7XG4gICAgICAgICAgICAgICAgLy8gd2UgaGF2ZSB0byBjaGVjayBiZWNhdXNlIGludGVybmFsbHkgdGhlIGRlbGVnYXRlIGNhbiByZXNjaGVkdWxlIHRoZSB0YXNrLlxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRhc2tDb3VudCh0YXNrLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXNrLnN0YXRlID09IHNjaGVkdWxpbmcpIHtcbiAgICAgICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8oc2NoZWR1bGVkLCBzY2hlZHVsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlTWljcm9UYXNrKHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZVRhc2sobmV3IFpvbmVUYXNrKG1pY3JvVGFzaywgc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIHVuZGVmaW5lZCkpO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlTWFjcm9UYXNrKHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlVGFzayhuZXcgWm9uZVRhc2sobWFjcm9UYXNrLCBzb3VyY2UsIGNhbGxiYWNrLCBkYXRhLCBjdXN0b21TY2hlZHVsZSwgY3VzdG9tQ2FuY2VsKSk7XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVFdmVudFRhc2soc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVUYXNrKG5ldyBab25lVGFzayhldmVudFRhc2ssIHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwpKTtcbiAgICAgICAgfVxuICAgICAgICBjYW5jZWxUYXNrKHRhc2spIHtcbiAgICAgICAgICAgIGlmICh0YXNrLnpvbmUgIT0gdGhpcylcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgdGFzayBjYW4gb25seSBiZSBjYW5jZWxsZWQgaW4gdGhlIHpvbmUgb2YgY3JlYXRpb24hIChDcmVhdGlvbjogJyArXG4gICAgICAgICAgICAgICAgICAgICh0YXNrLnpvbmUgfHwgTk9fWk9ORSkubmFtZSArXG4gICAgICAgICAgICAgICAgICAgICc7IEV4ZWN1dGlvbjogJyArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSArXG4gICAgICAgICAgICAgICAgICAgICcpJyk7XG4gICAgICAgICAgICBpZiAodGFzay5zdGF0ZSAhPT0gc2NoZWR1bGVkICYmIHRhc2suc3RhdGUgIT09IHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8oY2FuY2VsaW5nLCBzY2hlZHVsZWQsIHJ1bm5pbmcpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLl96b25lRGVsZWdhdGUuY2FuY2VsVGFzayh0aGlzLCB0YXNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBlcnJvciBvY2N1cnMgd2hlbiBjYW5jZWxUYXNrLCB0cmFuc2l0IHRoZSBzdGF0ZSB0byB1bmtub3duXG4gICAgICAgICAgICAgICAgdGFzay5fdHJhbnNpdGlvblRvKHVua25vd24sIGNhbmNlbGluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fem9uZURlbGVnYXRlLmhhbmRsZUVycm9yKHRoaXMsIGVycik7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGFza0NvdW50KHRhc2ssIC0xKTtcbiAgICAgICAgICAgIHRhc2suX3RyYW5zaXRpb25Ubyhub3RTY2hlZHVsZWQsIGNhbmNlbGluZyk7XG4gICAgICAgICAgICB0YXNrLnJ1bkNvdW50ID0gLTE7XG4gICAgICAgICAgICByZXR1cm4gdGFzaztcbiAgICAgICAgfVxuICAgICAgICBfdXBkYXRlVGFza0NvdW50KHRhc2ssIGNvdW50KSB7XG4gICAgICAgICAgICBjb25zdCB6b25lRGVsZWdhdGVzID0gdGFzay5fem9uZURlbGVnYXRlcztcbiAgICAgICAgICAgIGlmIChjb3VudCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRhc2suX3pvbmVEZWxlZ2F0ZXMgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB6b25lRGVsZWdhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgem9uZURlbGVnYXRlc1tpXS5fdXBkYXRlVGFza0NvdW50KHRhc2sudHlwZSwgY291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IERFTEVHQVRFX1pTID0ge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgb25IYXNUYXNrOiAoZGVsZWdhdGUsIF8sIHRhcmdldCwgaGFzVGFza1N0YXRlKSA9PiBkZWxlZ2F0ZS5oYXNUYXNrKHRhcmdldCwgaGFzVGFza1N0YXRlKSxcbiAgICAgICAgb25TY2hlZHVsZVRhc2s6IChkZWxlZ2F0ZSwgXywgdGFyZ2V0LCB0YXNrKSA9PiBkZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGFyZ2V0LCB0YXNrKSxcbiAgICAgICAgb25JbnZva2VUYXNrOiAoZGVsZWdhdGUsIF8sIHRhcmdldCwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpID0+IGRlbGVnYXRlLmludm9rZVRhc2sodGFyZ2V0LCB0YXNrLCBhcHBseVRoaXMsIGFwcGx5QXJncyksXG4gICAgICAgIG9uQ2FuY2VsVGFzazogKGRlbGVnYXRlLCBfLCB0YXJnZXQsIHRhc2spID0+IGRlbGVnYXRlLmNhbmNlbFRhc2sodGFyZ2V0LCB0YXNrKSxcbiAgICB9O1xuICAgIGNsYXNzIF9ab25lRGVsZWdhdGUge1xuICAgICAgICBnZXQgem9uZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0cnVjdG9yKHpvbmUsIHBhcmVudERlbGVnYXRlLCB6b25lU3BlYykge1xuICAgICAgICAgICAgdGhpcy5fdGFza0NvdW50cyA9IHtcbiAgICAgICAgICAgICAgICAnbWljcm9UYXNrJzogMCxcbiAgICAgICAgICAgICAgICAnbWFjcm9UYXNrJzogMCxcbiAgICAgICAgICAgICAgICAnZXZlbnRUYXNrJzogMCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl96b25lID0gem9uZTtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudERlbGVnYXRlID0gcGFyZW50RGVsZWdhdGU7XG4gICAgICAgICAgICB0aGlzLl9mb3JrWlMgPSB6b25lU3BlYyAmJiAoem9uZVNwZWMgJiYgem9uZVNwZWMub25Gb3JrID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5fZm9ya1pTKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmtEbGd0ID0gem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uRm9yayA/IHBhcmVudERlbGVnYXRlIDogcGFyZW50RGVsZWdhdGUuX2ZvcmtEbGd0KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmtDdXJyWm9uZSA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uRm9yayA/IHRoaXMuX3pvbmUgOiBwYXJlbnREZWxlZ2F0ZS5fZm9ya0N1cnJab25lKTtcbiAgICAgICAgICAgIHRoaXMuX2ludGVyY2VwdFpTID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25JbnRlcmNlcHQgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9pbnRlcmNlcHRaUyk7XG4gICAgICAgICAgICB0aGlzLl9pbnRlcmNlcHREbGd0ID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25JbnRlcmNlcHQgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9pbnRlcmNlcHREbGd0KTtcbiAgICAgICAgICAgIHRoaXMuX2ludGVyY2VwdEN1cnJab25lID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25JbnRlcmNlcHQgPyB0aGlzLl96b25lIDogcGFyZW50RGVsZWdhdGUuX2ludGVyY2VwdEN1cnJab25lKTtcbiAgICAgICAgICAgIHRoaXMuX2ludm9rZVpTID0gem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW52b2tlID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5faW52b2tlWlMpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlRGxndCA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW52b2tlID8gcGFyZW50RGVsZWdhdGUgOiBwYXJlbnREZWxlZ2F0ZS5faW52b2tlRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VDdXJyWm9uZSA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW52b2tlID8gdGhpcy5fem9uZSA6IHBhcmVudERlbGVnYXRlLl9pbnZva2VDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvclpTID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25IYW5kbGVFcnJvciA/IHpvbmVTcGVjIDogcGFyZW50RGVsZWdhdGUuX2hhbmRsZUVycm9yWlMpO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3JEbGd0ID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25IYW5kbGVFcnJvciA/IHBhcmVudERlbGVnYXRlIDogcGFyZW50RGVsZWdhdGUuX2hhbmRsZUVycm9yRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvckN1cnJab25lID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25IYW5kbGVFcnJvciA/IHRoaXMuX3pvbmUgOiBwYXJlbnREZWxlZ2F0ZS5faGFuZGxlRXJyb3JDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZVRhc2taUyA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uU2NoZWR1bGVUYXNrID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5fc2NoZWR1bGVUYXNrWlMpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVUYXNrRGxndCA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uU2NoZWR1bGVUYXNrID8gcGFyZW50RGVsZWdhdGUgOiBwYXJlbnREZWxlZ2F0ZS5fc2NoZWR1bGVUYXNrRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZVRhc2tDdXJyWm9uZSA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uU2NoZWR1bGVUYXNrID8gdGhpcy5fem9uZSA6IHBhcmVudERlbGVnYXRlLl9zY2hlZHVsZVRhc2tDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrWlMgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZVRhc2sgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9pbnZva2VUYXNrWlMpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlVGFza0RsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZVRhc2sgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9pbnZva2VUYXNrRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrQ3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZVRhc2sgPyB0aGlzLl96b25lIDogcGFyZW50RGVsZWdhdGUuX2ludm9rZVRhc2tDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrWlMgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkNhbmNlbFRhc2sgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9jYW5jZWxUYXNrWlMpO1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGFza0RsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkNhbmNlbFRhc2sgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9jYW5jZWxUYXNrRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrQ3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkNhbmNlbFRhc2sgPyB0aGlzLl96b25lIDogcGFyZW50RGVsZWdhdGUuX2NhbmNlbFRhc2tDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9oYXNUYXNrWlMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5faGFzVGFza0RsZ3QgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5faGFzVGFza0RsZ3RPd25lciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9oYXNUYXNrQ3VyclpvbmUgPSBudWxsO1xuICAgICAgICAgICAgY29uc3Qgem9uZVNwZWNIYXNUYXNrID0gem9uZVNwZWMgJiYgem9uZVNwZWMub25IYXNUYXNrO1xuICAgICAgICAgICAgY29uc3QgcGFyZW50SGFzVGFzayA9IHBhcmVudERlbGVnYXRlICYmIHBhcmVudERlbGVnYXRlLl9oYXNUYXNrWlM7XG4gICAgICAgICAgICBpZiAoem9uZVNwZWNIYXNUYXNrIHx8IHBhcmVudEhhc1Rhc2spIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBuZWVkIHRvIHJlcG9ydCBoYXNUYXNrLCB0aGFuIHRoaXMgWlMgbmVlZHMgdG8gZG8gcmVmIGNvdW50aW5nIG9uIHRhc2tzLiBJbiBzdWNoXG4gICAgICAgICAgICAgICAgLy8gYSBjYXNlIGFsbCB0YXNrIHJlbGF0ZWQgaW50ZXJjZXB0b3JzIG11c3QgZ28gdGhyb3VnaCB0aGlzIFpELiBXZSBjYW4ndCBzaG9ydCBjaXJjdWl0IGl0LlxuICAgICAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2taUyA9IHpvbmVTcGVjSGFzVGFzayA/IHpvbmVTcGVjIDogREVMRUdBVEVfWlM7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFzVGFza0RsZ3QgPSBwYXJlbnREZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNUYXNrRGxndE93bmVyID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNUYXNrQ3VyclpvbmUgPSB0aGlzLl96b25lO1xuICAgICAgICAgICAgICAgIGlmICghem9uZVNwZWMub25TY2hlZHVsZVRhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVUYXNrWlMgPSBERUxFR0FURV9aUztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVUYXNrRGxndCA9IHBhcmVudERlbGVnYXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZVRhc2tDdXJyWm9uZSA9IHRoaXMuX3pvbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghem9uZVNwZWMub25JbnZva2VUYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludm9rZVRhc2taUyA9IERFTEVHQVRFX1pTO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrRGxndCA9IHBhcmVudERlbGVnYXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrQ3VyclpvbmUgPSB0aGlzLl96b25lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXpvbmVTcGVjLm9uQ2FuY2VsVGFzaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrWlMgPSBERUxFR0FURV9aUztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGFza0RsZ3QgPSBwYXJlbnREZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGFza0N1cnJab25lID0gdGhpcy5fem9uZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yayh0YXJnZXRab25lLCB6b25lU3BlYykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmtaU1xuICAgICAgICAgICAgICAgID8gdGhpcy5fZm9ya1pTLm9uRm9yayh0aGlzLl9mb3JrRGxndCwgdGhpcy56b25lLCB0YXJnZXRab25lLCB6b25lU3BlYylcbiAgICAgICAgICAgICAgICA6IG5ldyBab25lSW1wbCh0YXJnZXRab25lLCB6b25lU3BlYyk7XG4gICAgICAgIH1cbiAgICAgICAgaW50ZXJjZXB0KHRhcmdldFpvbmUsIGNhbGxiYWNrLCBzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnRlcmNlcHRaU1xuICAgICAgICAgICAgICAgID8gdGhpcy5faW50ZXJjZXB0WlMub25JbnRlcmNlcHQodGhpcy5faW50ZXJjZXB0RGxndCwgdGhpcy5faW50ZXJjZXB0Q3VyclpvbmUsIHRhcmdldFpvbmUsIGNhbGxiYWNrLCBzb3VyY2UpXG4gICAgICAgICAgICAgICAgOiBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgICBpbnZva2UodGFyZ2V0Wm9uZSwgY2FsbGJhY2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnZva2VaU1xuICAgICAgICAgICAgICAgID8gdGhpcy5faW52b2tlWlMub25JbnZva2UodGhpcy5faW52b2tlRGxndCwgdGhpcy5faW52b2tlQ3VyclpvbmUsIHRhcmdldFpvbmUsIGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKVxuICAgICAgICAgICAgICAgIDogY2FsbGJhY2suYXBwbHkoYXBwbHlUaGlzLCBhcHBseUFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGhhbmRsZUVycm9yKHRhcmdldFpvbmUsIGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlRXJyb3JaU1xuICAgICAgICAgICAgICAgID8gdGhpcy5faGFuZGxlRXJyb3JaUy5vbkhhbmRsZUVycm9yKHRoaXMuX2hhbmRsZUVycm9yRGxndCwgdGhpcy5faGFuZGxlRXJyb3JDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgZXJyb3IpXG4gICAgICAgICAgICAgICAgOiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlVGFzayh0YXJnZXRab25lLCB0YXNrKSB7XG4gICAgICAgICAgICBsZXQgcmV0dXJuVGFzayA9IHRhc2s7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2NoZWR1bGVUYXNrWlMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faGFzVGFza1pTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblRhc2suX3pvbmVEZWxlZ2F0ZXMucHVzaCh0aGlzLl9oYXNUYXNrRGxndE93bmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuVGFzayA9IHRoaXMuX3NjaGVkdWxlVGFza1pTLm9uU2NoZWR1bGVUYXNrKHRoaXMuX3NjaGVkdWxlVGFza0RsZ3QsIHRoaXMuX3NjaGVkdWxlVGFza0N1cnJab25lLCB0YXJnZXRab25lLCB0YXNrKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJldHVyblRhc2spXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblRhc2sgPSB0YXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suc2NoZWR1bGVGbikge1xuICAgICAgICAgICAgICAgICAgICB0YXNrLnNjaGVkdWxlRm4odGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRhc2sudHlwZSA9PSBtaWNyb1Rhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVNaWNyb1Rhc2sodGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Rhc2sgaXMgbWlzc2luZyBzY2hlZHVsZUZuLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXR1cm5UYXNrO1xuICAgICAgICB9XG4gICAgICAgIGludm9rZVRhc2sodGFyZ2V0Wm9uZSwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnZva2VUYXNrWlNcbiAgICAgICAgICAgICAgICA/IHRoaXMuX2ludm9rZVRhc2taUy5vbkludm9rZVRhc2sodGhpcy5faW52b2tlVGFza0RsZ3QsIHRoaXMuX2ludm9rZVRhc2tDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpXG4gICAgICAgICAgICAgICAgOiB0YXNrLmNhbGxiYWNrLmFwcGx5KGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBjYW5jZWxUYXNrKHRhcmdldFpvbmUsIHRhc2spIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYW5jZWxUYXNrWlMpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX2NhbmNlbFRhc2taUy5vbkNhbmNlbFRhc2sodGhpcy5fY2FuY2VsVGFza0RsZ3QsIHRoaXMuX2NhbmNlbFRhc2tDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgdGFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRhc2suY2FuY2VsRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1Rhc2sgaXMgbm90IGNhbmNlbGFibGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0YXNrLmNhbmNlbEZuKHRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGhhc1Rhc2sodGFyZ2V0Wm9uZSwgaXNFbXB0eSkge1xuICAgICAgICAgICAgLy8gaGFzVGFzayBzaG91bGQgbm90IHRocm93IGVycm9yIHNvIG90aGVyIFpvbmVEZWxlZ2F0ZVxuICAgICAgICAgICAgLy8gY2FuIHN0aWxsIHRyaWdnZXIgaGFzVGFzayBjYWxsYmFja1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNUYXNrWlMgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFzVGFza1pTLm9uSGFzVGFzayh0aGlzLl9oYXNUYXNrRGxndCwgdGhpcy5faGFzVGFza0N1cnJab25lLCB0YXJnZXRab25lLCBpc0VtcHR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKHRhcmdldFpvbmUsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgIF91cGRhdGVUYXNrQ291bnQodHlwZSwgY291bnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cyA9IHRoaXMuX3Rhc2tDb3VudHM7XG4gICAgICAgICAgICBjb25zdCBwcmV2ID0gY291bnRzW3R5cGVdO1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IChjb3VudHNbdHlwZV0gPSBwcmV2ICsgY291bnQpO1xuICAgICAgICAgICAgaWYgKG5leHQgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNb3JlIHRhc2tzIGV4ZWN1dGVkIHRoZW4gd2VyZSBzY2hlZHVsZWQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJldiA9PSAwIHx8IG5leHQgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzRW1wdHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIG1pY3JvVGFzazogY291bnRzWydtaWNyb1Rhc2snXSA+IDAsXG4gICAgICAgICAgICAgICAgICAgIG1hY3JvVGFzazogY291bnRzWydtYWNyb1Rhc2snXSA+IDAsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VGFzazogY291bnRzWydldmVudFRhc2snXSA+IDAsXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZTogdHlwZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzVGFzayh0aGlzLl96b25lLCBpc0VtcHR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjbGFzcyBab25lVGFzayB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHR5cGUsIHNvdXJjZSwgY2FsbGJhY2ssIG9wdGlvbnMsIHNjaGVkdWxlRm4sIGNhbmNlbEZuKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgICAgIHRoaXMuX3pvbmUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5ydW5Db3VudCA9IDA7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZXMgPSBudWxsO1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9ICdub3RTY2hlZHVsZWQnO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gb3B0aW9ucztcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVGbiA9IHNjaGVkdWxlRm47XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEZuID0gY2FuY2VsRm47XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsYmFjayBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAvLyBUT0RPOiBASmlhTGlQYXNzaW9uIG9wdGlvbnMgc2hvdWxkIGhhdmUgaW50ZXJmYWNlXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gZXZlbnRUYXNrICYmIG9wdGlvbnMgJiYgb3B0aW9ucy51c2VHKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZva2UgPSBab25lVGFzay5pbnZva2VUYXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZva2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBab25lVGFzay5pbnZva2VUYXNrLmNhbGwoZ2xvYmFsLCBzZWxmLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGludm9rZVRhc2sodGFzaywgdGFyZ2V0LCBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgICAgICAgICB0YXNrID0gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMrKztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGFzay5ydW5Db3VudCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrLnpvbmUucnVuVGFzayh0YXNrLCB0YXJnZXQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkcmFpbk1pY3JvVGFza1F1ZXVlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnZXQgem9uZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzdGF0ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBjYW5jZWxTY2hlZHVsZVJlcXVlc3QoKSB7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9uVG8obm90U2NoZWR1bGVkLCBzY2hlZHVsaW5nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgX3RyYW5zaXRpb25Ubyh0b1N0YXRlLCBmcm9tU3RhdGUxLCBmcm9tU3RhdGUyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUgPT09IGZyb21TdGF0ZTEgfHwgdGhpcy5fc3RhdGUgPT09IGZyb21TdGF0ZTIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHRvU3RhdGU7XG4gICAgICAgICAgICAgICAgaWYgKHRvU3RhdGUgPT0gbm90U2NoZWR1bGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLnR5cGV9ICcke3RoaXMuc291cmNlfSc6IGNhbiBub3QgdHJhbnNpdGlvbiB0byAnJHt0b1N0YXRlfScsIGV4cGVjdGluZyBzdGF0ZSAnJHtmcm9tU3RhdGUxfScke2Zyb21TdGF0ZTIgPyBcIiBvciAnXCIgKyBmcm9tU3RhdGUyICsgXCInXCIgOiAnJ30sIHdhcyAnJHt0aGlzLl9zdGF0ZX0nLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAmJiB0eXBlb2YgdGhpcy5kYXRhLmhhbmRsZUlkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuaGFuZGxlSWQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWRkIHRvSlNPTiBtZXRob2QgdG8gcHJldmVudCBjeWNsaWMgZXJyb3Igd2hlblxuICAgICAgICAvLyBjYWxsIEpTT04uc3RyaW5naWZ5KHpvbmVUYXNrKVxuICAgICAgICB0b0pTT04oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgICAgICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgIHpvbmU6IHRoaXMuem9uZS5uYW1lLFxuICAgICAgICAgICAgICAgIHJ1bkNvdW50OiB0aGlzLnJ1bkNvdW50LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8gIE1JQ1JPVEFTSyBRVUVVRVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIGNvbnN0IHN5bWJvbFNldFRpbWVvdXQgPSBfX3N5bWJvbF9fKCdzZXRUaW1lb3V0Jyk7XG4gICAgY29uc3Qgc3ltYm9sUHJvbWlzZSA9IF9fc3ltYm9sX18oJ1Byb21pc2UnKTtcbiAgICBjb25zdCBzeW1ib2xUaGVuID0gX19zeW1ib2xfXygndGhlbicpO1xuICAgIGxldCBfbWljcm9UYXNrUXVldWUgPSBbXTtcbiAgICBsZXQgX2lzRHJhaW5pbmdNaWNyb3Rhc2tRdWV1ZSA9IGZhbHNlO1xuICAgIGxldCBuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2U7XG4gICAgZnVuY3Rpb24gbmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2soZnVuYykge1xuICAgICAgICBpZiAoIW5hdGl2ZU1pY3JvVGFza1F1ZXVlUHJvbWlzZSkge1xuICAgICAgICAgICAgaWYgKGdsb2JhbFtzeW1ib2xQcm9taXNlXSkge1xuICAgICAgICAgICAgICAgIG5hdGl2ZU1pY3JvVGFza1F1ZXVlUHJvbWlzZSA9IGdsb2JhbFtzeW1ib2xQcm9taXNlXS5yZXNvbHZlKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2UpIHtcbiAgICAgICAgICAgIGxldCBuYXRpdmVUaGVuID0gbmF0aXZlTWljcm9UYXNrUXVldWVQcm9taXNlW3N5bWJvbFRoZW5dO1xuICAgICAgICAgICAgaWYgKCFuYXRpdmVUaGVuKSB7XG4gICAgICAgICAgICAgICAgLy8gbmF0aXZlIFByb21pc2UgaXMgbm90IHBhdGNoYWJsZSwgd2UgbmVlZCB0byB1c2UgYHRoZW5gIGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgLy8gaXNzdWUgMTA3OFxuICAgICAgICAgICAgICAgIG5hdGl2ZVRoZW4gPSBuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2VbJ3RoZW4nXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5hdGl2ZVRoZW4uY2FsbChuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2UsIGZ1bmMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsW3N5bWJvbFNldFRpbWVvdXRdKGZ1bmMsIDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlTWljcm9UYXNrKHRhc2spIHtcbiAgICAgICAgLy8gaWYgd2UgYXJlIG5vdCBydW5uaW5nIGluIGFueSB0YXNrLCBhbmQgdGhlcmUgaGFzIG5vdCBiZWVuIGFueXRoaW5nIHNjaGVkdWxlZFxuICAgICAgICAvLyB3ZSBtdXN0IGJvb3RzdHJhcCB0aGUgaW5pdGlhbCB0YXNrIGNyZWF0aW9uIGJ5IG1hbnVhbGx5IHNjaGVkdWxpbmcgdGhlIGRyYWluXG4gICAgICAgIGlmIChfbnVtYmVyT2ZOZXN0ZWRUYXNrRnJhbWVzID09PSAwICYmIF9taWNyb1Rhc2tRdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGFyZSBub3QgcnVubmluZyBpbiBUYXNrLCBzbyB3ZSBuZWVkIHRvIGtpY2tzdGFydCB0aGUgbWljcm90YXNrIHF1ZXVlLlxuICAgICAgICAgICAgbmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2soZHJhaW5NaWNyb1Rhc2tRdWV1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGFzayAmJiBfbWljcm9UYXNrUXVldWUucHVzaCh0YXNrKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZHJhaW5NaWNyb1Rhc2tRdWV1ZSgpIHtcbiAgICAgICAgaWYgKCFfaXNEcmFpbmluZ01pY3JvdGFza1F1ZXVlKSB7XG4gICAgICAgICAgICBfaXNEcmFpbmluZ01pY3JvdGFza1F1ZXVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHdoaWxlIChfbWljcm9UYXNrUXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcXVldWUgPSBfbWljcm9UYXNrUXVldWU7XG4gICAgICAgICAgICAgICAgX21pY3JvVGFza1F1ZXVlID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gcXVldWVbaV07XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnpvbmUucnVuVGFzayh0YXNrLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hcGkub25VbmhhbmRsZWRFcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfYXBpLm1pY3JvdGFza0RyYWluRG9uZSgpO1xuICAgICAgICAgICAgX2lzRHJhaW5pbmdNaWNyb3Rhc2tRdWV1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vLyAgQk9PVFNUUkFQXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgY29uc3QgTk9fWk9ORSA9IHsgbmFtZTogJ05PIFpPTkUnIH07XG4gICAgY29uc3Qgbm90U2NoZWR1bGVkID0gJ25vdFNjaGVkdWxlZCcsIHNjaGVkdWxpbmcgPSAnc2NoZWR1bGluZycsIHNjaGVkdWxlZCA9ICdzY2hlZHVsZWQnLCBydW5uaW5nID0gJ3J1bm5pbmcnLCBjYW5jZWxpbmcgPSAnY2FuY2VsaW5nJywgdW5rbm93biA9ICd1bmtub3duJztcbiAgICBjb25zdCBtaWNyb1Rhc2sgPSAnbWljcm9UYXNrJywgbWFjcm9UYXNrID0gJ21hY3JvVGFzaycsIGV2ZW50VGFzayA9ICdldmVudFRhc2snO1xuICAgIGNvbnN0IHBhdGNoZXMgPSB7fTtcbiAgICBjb25zdCBfYXBpID0ge1xuICAgICAgICBzeW1ib2w6IF9fc3ltYm9sX18sXG4gICAgICAgIGN1cnJlbnRab25lRnJhbWU6ICgpID0+IF9jdXJyZW50Wm9uZUZyYW1lLFxuICAgICAgICBvblVuaGFuZGxlZEVycm9yOiBub29wLFxuICAgICAgICBtaWNyb3Rhc2tEcmFpbkRvbmU6IG5vb3AsXG4gICAgICAgIHNjaGVkdWxlTWljcm9UYXNrOiBzY2hlZHVsZU1pY3JvVGFzayxcbiAgICAgICAgc2hvd1VuY2F1Z2h0RXJyb3I6ICgpID0+ICFab25lSW1wbFtfX3N5bWJvbF9fKCdpZ25vcmVDb25zb2xlRXJyb3JVbmNhdWdodEVycm9yJyldLFxuICAgICAgICBwYXRjaEV2ZW50VGFyZ2V0OiAoKSA9PiBbXSxcbiAgICAgICAgcGF0Y2hPblByb3BlcnRpZXM6IG5vb3AsXG4gICAgICAgIHBhdGNoTWV0aG9kOiAoKSA9PiBub29wLFxuICAgICAgICBiaW5kQXJndW1lbnRzOiAoKSA9PiBbXSxcbiAgICAgICAgcGF0Y2hUaGVuOiAoKSA9PiBub29wLFxuICAgICAgICBwYXRjaE1hY3JvVGFzazogKCkgPT4gbm9vcCxcbiAgICAgICAgcGF0Y2hFdmVudFByb3RvdHlwZTogKCkgPT4gbm9vcCxcbiAgICAgICAgaXNJRU9yRWRnZTogKCkgPT4gZmFsc2UsXG4gICAgICAgIGdldEdsb2JhbE9iamVjdHM6ICgpID0+IHVuZGVmaW5lZCxcbiAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHk6ICgpID0+IG5vb3AsXG4gICAgICAgIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcjogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBPYmplY3RDcmVhdGU6ICgpID0+IHVuZGVmaW5lZCxcbiAgICAgICAgQXJyYXlTbGljZTogKCkgPT4gW10sXG4gICAgICAgIHBhdGNoQ2xhc3M6ICgpID0+IG5vb3AsXG4gICAgICAgIHdyYXBXaXRoQ3VycmVudFpvbmU6ICgpID0+IG5vb3AsXG4gICAgICAgIGZpbHRlclByb3BlcnRpZXM6ICgpID0+IFtdLFxuICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQ6ICgpID0+IG5vb3AsXG4gICAgICAgIF9yZWRlZmluZVByb3BlcnR5OiAoKSA9PiBub29wLFxuICAgICAgICBwYXRjaENhbGxiYWNrczogKCkgPT4gbm9vcCxcbiAgICAgICAgbmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2s6IG5hdGl2ZVNjaGVkdWxlTWljcm9UYXNrLFxuICAgIH07XG4gICAgbGV0IF9jdXJyZW50Wm9uZUZyYW1lID0geyBwYXJlbnQ6IG51bGwsIHpvbmU6IG5ldyBab25lSW1wbChudWxsLCBudWxsKSB9O1xuICAgIGxldCBfY3VycmVudFRhc2sgPSBudWxsO1xuICAgIGxldCBfbnVtYmVyT2ZOZXN0ZWRUYXNrRnJhbWVzID0gMDtcbiAgICBmdW5jdGlvbiBub29wKCkgeyB9XG4gICAgcGVyZm9ybWFuY2VNZWFzdXJlKCdab25lJywgJ1pvbmUnKTtcbiAgICByZXR1cm4gWm9uZUltcGw7XG59XG5cbmZ1bmN0aW9uIGxvYWRab25lKCkge1xuICAgIC8vIGlmIGdsb2JhbFsnWm9uZSddIGFscmVhZHkgZXhpc3RzIChtYXliZSB6b25lLmpzIHdhcyBhbHJlYWR5IGxvYWRlZCBvclxuICAgIC8vIHNvbWUgb3RoZXIgbGliIGFsc28gcmVnaXN0ZXJlZCBhIGdsb2JhbCBvYmplY3QgbmFtZWQgWm9uZSksIHdlIG1heSBuZWVkXG4gICAgLy8gdG8gdGhyb3cgYW4gZXJyb3IsIGJ1dCBzb21ldGltZXMgdXNlciBtYXkgbm90IHdhbnQgdGhpcyBlcnJvci5cbiAgICAvLyBGb3IgZXhhbXBsZSxcbiAgICAvLyB3ZSBoYXZlIHR3byB3ZWIgcGFnZXMsIHBhZ2UxIGluY2x1ZGVzIHpvbmUuanMsIHBhZ2UyIGRvZXNuJ3QuXG4gICAgLy8gYW5kIHRoZSAxc3QgdGltZSB1c2VyIGxvYWQgcGFnZTEgYW5kIHBhZ2UyLCBldmVyeXRoaW5nIHdvcmsgZmluZSxcbiAgICAvLyBidXQgd2hlbiB1c2VyIGxvYWQgcGFnZTIgYWdhaW4sIGVycm9yIG9jY3VycyBiZWNhdXNlIGdsb2JhbFsnWm9uZSddIGFscmVhZHkgZXhpc3RzLlxuICAgIC8vIHNvIHdlIGFkZCBhIGZsYWcgdG8gbGV0IHVzZXIgY2hvb3NlIHdoZXRoZXIgdG8gdGhyb3cgdGhpcyBlcnJvciBvciBub3QuXG4gICAgLy8gQnkgZGVmYXVsdCwgaWYgZXhpc3RpbmcgWm9uZSBpcyBmcm9tIHpvbmUuanMsIHdlIHdpbGwgbm90IHRocm93IHRoZSBlcnJvci5cbiAgICBjb25zdCBnbG9iYWwgPSBnbG9iYWxUaGlzO1xuICAgIGNvbnN0IGNoZWNrRHVwbGljYXRlID0gZ2xvYmFsW19fc3ltYm9sX18oJ2ZvcmNlRHVwbGljYXRlWm9uZUNoZWNrJyldID09PSB0cnVlO1xuICAgIGlmIChnbG9iYWxbJ1pvbmUnXSAmJiAoY2hlY2tEdXBsaWNhdGUgfHwgdHlwZW9mIGdsb2JhbFsnWm9uZSddLl9fc3ltYm9sX18gIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWm9uZSBhbHJlYWR5IGxvYWRlZC4nKTtcbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6ZSBnbG9iYWwgYFpvbmVgIGNvbnN0YW50LlxuICAgIGdsb2JhbFsnWm9uZSddID8/PSBpbml0Wm9uZSgpO1xuICAgIHJldHVybiBnbG9iYWxbJ1pvbmUnXTtcbn1cblxuLyoqXG4gKiBTdXBwcmVzcyBjbG9zdXJlIGNvbXBpbGVyIGVycm9ycyBhYm91dCB1bmtub3duICdab25lJyB2YXJpYWJsZVxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHt1bmRlZmluZWRWYXJzLGdsb2JhbFRoaXMsbWlzc2luZ1JlcXVpcmV9XG4gKi9cbi8vIGlzc3VlICM5ODksIHRvIHJlZHVjZSBidW5kbGUgc2l6ZSwgdXNlIHNob3J0IG5hbWVcbi8qKiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICovXG5jb25zdCBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuLyoqIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAqL1xuY29uc3QgT2JqZWN0RGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4vKiogT2JqZWN0LmdldFByb3RvdHlwZU9mICovXG5jb25zdCBPYmplY3RHZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbi8qKiBPYmplY3QuY3JlYXRlICovXG5jb25zdCBPYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuLyoqIEFycmF5LnByb3RvdHlwZS5zbGljZSAqL1xuY29uc3QgQXJyYXlTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbi8qKiBhZGRFdmVudExpc3RlbmVyIHN0cmluZyBjb25zdCAqL1xuY29uc3QgQUREX0VWRU5UX0xJU1RFTkVSX1NUUiA9ICdhZGRFdmVudExpc3RlbmVyJztcbi8qKiByZW1vdmVFdmVudExpc3RlbmVyIHN0cmluZyBjb25zdCAqL1xuY29uc3QgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUiA9ICdyZW1vdmVFdmVudExpc3RlbmVyJztcbi8qKiB6b25lU3ltYm9sIGFkZEV2ZW50TGlzdGVuZXIgKi9cbmNvbnN0IFpPTkVfU1lNQk9MX0FERF9FVkVOVF9MSVNURU5FUiA9IF9fc3ltYm9sX18oQUREX0VWRU5UX0xJU1RFTkVSX1NUUik7XG4vKiogem9uZVN5bWJvbCByZW1vdmVFdmVudExpc3RlbmVyICovXG5jb25zdCBaT05FX1NZTUJPTF9SRU1PVkVfRVZFTlRfTElTVEVORVIgPSBfX3N5bWJvbF9fKFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIpO1xuLyoqIHRydWUgc3RyaW5nIGNvbnN0ICovXG5jb25zdCBUUlVFX1NUUiA9ICd0cnVlJztcbi8qKiBmYWxzZSBzdHJpbmcgY29uc3QgKi9cbmNvbnN0IEZBTFNFX1NUUiA9ICdmYWxzZSc7XG4vKiogWm9uZSBzeW1ib2wgcHJlZml4IHN0cmluZyBjb25zdC4gKi9cbmNvbnN0IFpPTkVfU1lNQk9MX1BSRUZJWCA9IF9fc3ltYm9sX18oJycpO1xuZnVuY3Rpb24gd3JhcFdpdGhDdXJyZW50Wm9uZShjYWxsYmFjaywgc291cmNlKSB7XG4gICAgcmV0dXJuIFpvbmUuY3VycmVudC53cmFwKGNhbGxiYWNrLCBzb3VyY2UpO1xufVxuZnVuY3Rpb24gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUoc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCkge1xuICAgIHJldHVybiBab25lLmN1cnJlbnQuc2NoZWR1bGVNYWNyb1Rhc2soc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCk7XG59XG5jb25zdCB6b25lU3ltYm9sID0gX19zeW1ib2xfXztcbmNvbnN0IGlzV2luZG93RXhpc3RzID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5jb25zdCBpbnRlcm5hbFdpbmRvdyA9IGlzV2luZG93RXhpc3RzID8gd2luZG93IDogdW5kZWZpbmVkO1xuY29uc3QgX2dsb2JhbCA9IChpc1dpbmRvd0V4aXN0cyAmJiBpbnRlcm5hbFdpbmRvdykgfHwgZ2xvYmFsVGhpcztcbmNvbnN0IFJFTU9WRV9BVFRSSUJVVEUgPSAncmVtb3ZlQXR0cmlidXRlJztcbmZ1bmN0aW9uIGJpbmRBcmd1bWVudHMoYXJncywgc291cmNlKSB7XG4gICAgZm9yIChsZXQgaSA9IGFyZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzW2ldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBhcmdzW2ldID0gd3JhcFdpdGhDdXJyZW50Wm9uZShhcmdzW2ldLCBzb3VyY2UgKyAnXycgKyBpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJncztcbn1cbmZ1bmN0aW9uIHBhdGNoUHJvdG90eXBlKHByb3RvdHlwZSwgZm5OYW1lcykge1xuICAgIGNvbnN0IHNvdXJjZSA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvclsnbmFtZSddO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm5OYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBuYW1lID0gZm5OYW1lc1tpXTtcbiAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBwcm90b3R5cGVbbmFtZV07XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgY29uc3QgcHJvdG90eXBlRGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpO1xuICAgICAgICAgICAgaWYgKCFpc1Byb3BlcnR5V3JpdGFibGUocHJvdG90eXBlRGVzYykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3RvdHlwZVtuYW1lXSA9ICgoZGVsZWdhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRjaGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkodGhpcywgYmluZEFyZ3VtZW50cyhhcmd1bWVudHMsIHNvdXJjZSArICcuJyArIG5hbWUpKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwYXRjaGVkLCBkZWxlZ2F0ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGNoZWQ7XG4gICAgICAgICAgICB9KShkZWxlZ2F0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBpc1Byb3BlcnR5V3JpdGFibGUocHJvcGVydHlEZXNjKSB7XG4gICAgaWYgKCFwcm9wZXJ0eURlc2MpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChwcm9wZXJ0eURlc2Mud3JpdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICEodHlwZW9mIHByb3BlcnR5RGVzYy5nZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHByb3BlcnR5RGVzYy5zZXQgPT09ICd1bmRlZmluZWQnKTtcbn1cbmNvbnN0IGlzV2ViV29ya2VyID0gdHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGU7XG4vLyBNYWtlIHN1cmUgdG8gYWNjZXNzIGBwcm9jZXNzYCB0aHJvdWdoIGBfZ2xvYmFsYCBzbyB0aGF0IFdlYlBhY2sgZG9lcyBub3QgYWNjaWRlbnRhbGx5IGJyb3dzZXJpZnlcbi8vIHRoaXMgY29kZS5cbmNvbnN0IGlzTm9kZSA9ICEoJ253JyBpbiBfZ2xvYmFsKSAmJlxuICAgIHR5cGVvZiBfZ2xvYmFsLnByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAgX2dsb2JhbC5wcm9jZXNzLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcbmNvbnN0IGlzQnJvd3NlciA9ICFpc05vZGUgJiYgIWlzV2ViV29ya2VyICYmICEhKGlzV2luZG93RXhpc3RzICYmIGludGVybmFsV2luZG93WydIVE1MRWxlbWVudCddKTtcbi8vIHdlIGFyZSBpbiBlbGVjdHJvbiBvZiBudywgc28gd2UgYXJlIGJvdGggYnJvd3NlciBhbmQgbm9kZWpzXG4vLyBNYWtlIHN1cmUgdG8gYWNjZXNzIGBwcm9jZXNzYCB0aHJvdWdoIGBfZ2xvYmFsYCBzbyB0aGF0IFdlYlBhY2sgZG9lcyBub3QgYWNjaWRlbnRhbGx5IGJyb3dzZXJpZnlcbi8vIHRoaXMgY29kZS5cbmNvbnN0IGlzTWl4ID0gdHlwZW9mIF9nbG9iYWwucHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBfZ2xvYmFsLnByb2Nlc3MudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nICYmXG4gICAgIWlzV2ViV29ya2VyICYmXG4gICAgISEoaXNXaW5kb3dFeGlzdHMgJiYgaW50ZXJuYWxXaW5kb3dbJ0hUTUxFbGVtZW50J10pO1xuY29uc3Qgem9uZVN5bWJvbEV2ZW50TmFtZXMkMSA9IHt9O1xuY29uc3QgZW5hYmxlQmVmb3JldW5sb2FkU3ltYm9sID0gem9uZVN5bWJvbCgnZW5hYmxlX2JlZm9yZXVubG9hZCcpO1xuY29uc3Qgd3JhcEZuID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvOTExLCBpbiBJRSwgc29tZXRpbWVzXG4gICAgLy8gZXZlbnQgd2lsbCBiZSB1bmRlZmluZWQsIHNvIHdlIG5lZWQgdG8gdXNlIHdpbmRvdy5ldmVudFxuICAgIGV2ZW50ID0gZXZlbnQgfHwgX2dsb2JhbC5ldmVudDtcbiAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGV2ZW50TmFtZVN5bWJvbCA9IHpvbmVTeW1ib2xFdmVudE5hbWVzJDFbZXZlbnQudHlwZV07XG4gICAgaWYgKCFldmVudE5hbWVTeW1ib2wpIHtcbiAgICAgICAgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXMkMVtldmVudC50eXBlXSA9IHpvbmVTeW1ib2woJ09OX1BST1BFUlRZJyArIGV2ZW50LnR5cGUpO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IGV2ZW50LnRhcmdldCB8fCBfZ2xvYmFsO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gdGFyZ2V0W2V2ZW50TmFtZVN5bWJvbF07XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAoaXNCcm93c2VyICYmIHRhcmdldCA9PT0gaW50ZXJuYWxXaW5kb3cgJiYgZXZlbnQudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAvLyB3aW5kb3cub25lcnJvciBoYXZlIGRpZmZlcmVudCBzaWduYXR1cmVcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0dsb2JhbEV2ZW50SGFuZGxlcnMvb25lcnJvciN3aW5kb3cub25lcnJvclxuICAgICAgICAvLyBhbmQgb25lcnJvciBjYWxsYmFjayB3aWxsIHByZXZlbnQgZGVmYXVsdCB3aGVuIGNhbGxiYWNrIHJldHVybiB0cnVlXG4gICAgICAgIGNvbnN0IGVycm9yRXZlbnQgPSBldmVudDtcbiAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICAgIGxpc3RlbmVyICYmXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBlcnJvckV2ZW50Lm1lc3NhZ2UsIGVycm9yRXZlbnQuZmlsZW5hbWUsIGVycm9yRXZlbnQubGluZW5vLCBlcnJvckV2ZW50LmNvbG5vLCBlcnJvckV2ZW50LmVycm9yKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gbGlzdGVuZXIgJiYgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy80NzU3OVxuICAgICAgICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvMjAxMS9XRC1odG1sNS0yMDExMDUyNS9oaXN0b3J5Lmh0bWwjYmVmb3JldW5sb2FkZXZlbnRcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgb25seSBzcGVjaWZpYyBjYXNlIHdlIHNob3VsZCBjaGVjayBmb3IuIFRoZSBzcGVjIGRlZmluZXMgdGhhdCB0aGVcbiAgICAgICAgLy8gYHJldHVyblZhbHVlYCBhdHRyaWJ1dGUgcmVwcmVzZW50cyB0aGUgbWVzc2FnZSB0byBzaG93IHRoZSB1c2VyLiBXaGVuIHRoZSBldmVudFxuICAgICAgICAvLyBpcyBjcmVhdGVkLCB0aGlzIGF0dHJpYnV0ZSBtdXN0IGJlIHNldCB0byB0aGUgZW1wdHkgc3RyaW5nLlxuICAgICAgICBldmVudC50eXBlID09PSAnYmVmb3JldW5sb2FkJyAmJlxuICAgICAgICAgICAgLy8gVG8gcHJldmVudCBhbnkgYnJlYWtpbmcgY2hhbmdlcyByZXN1bHRpbmcgZnJvbSB0aGlzIGNoYW5nZSwgZ2l2ZW4gdGhhdFxuICAgICAgICAgICAgLy8gaXQgd2FzIGFscmVhZHkgY2F1c2luZyBhIHNpZ25pZmljYW50IG51bWJlciBvZiBmYWlsdXJlcyBpbiBHMywgd2UgaGF2ZSBoaWRkZW5cbiAgICAgICAgICAgIC8vIHRoYXQgYmVoYXZpb3IgYmVoaW5kIGEgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gZmxhZy4gQ29uc3VtZXJzIGNhbiBlbmFibGUgdGhpc1xuICAgICAgICAgICAgLy8gZmxhZyBleHBsaWNpdGx5IGlmIHRoZXkgd2FudCB0aGUgYGJlZm9yZXVubG9hZGAgZXZlbnQgdG8gYmUgaGFuZGxlZCBhcyBkZWZpbmVkXG4gICAgICAgICAgICAvLyBpbiB0aGUgc3BlY2lmaWNhdGlvbi5cbiAgICAgICAgICAgIF9nbG9iYWxbZW5hYmxlQmVmb3JldW5sb2FkU3ltYm9sXSAmJlxuICAgICAgICAgICAgLy8gVGhlIElETCBldmVudCBkZWZpbml0aW9uIGlzIGBhdHRyaWJ1dGUgRE9NU3RyaW5nIHJldHVyblZhbHVlYCwgc28gd2UgY2hlY2sgd2hldGhlclxuICAgICAgICAgICAgLy8gYHR5cGVvZiByZXN1bHRgIGlzIGEgc3RyaW5nLlxuICAgICAgICAgICAgdHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJlc3VsdCAhPSB1bmRlZmluZWQgJiYgIXJlc3VsdCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmZ1bmN0aW9uIHBhdGNoUHJvcGVydHkob2JqLCBwcm9wLCBwcm90b3R5cGUpIHtcbiAgICBsZXQgZGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApO1xuICAgIGlmICghZGVzYyAmJiBwcm90b3R5cGUpIHtcbiAgICAgICAgLy8gd2hlbiBwYXRjaCB3aW5kb3cgb2JqZWN0LCB1c2UgcHJvdG90eXBlIHRvIGNoZWNrIHByb3AgZXhpc3Qgb3Igbm90XG4gICAgICAgIGNvbnN0IHByb3RvdHlwZURlc2MgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBwcm9wKTtcbiAgICAgICAgaWYgKHByb3RvdHlwZURlc2MpIHtcbiAgICAgICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHRoZSBkZXNjcmlwdG9yIG5vdCBleGlzdHMgb3IgaXMgbm90IGNvbmZpZ3VyYWJsZVxuICAgIC8vIGp1c3QgcmV0dXJuXG4gICAgaWYgKCFkZXNjIHx8ICFkZXNjLmNvbmZpZ3VyYWJsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9uUHJvcFBhdGNoZWRTeW1ib2wgPSB6b25lU3ltYm9sKCdvbicgKyBwcm9wICsgJ3BhdGNoZWQnKTtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG9uUHJvcFBhdGNoZWRTeW1ib2wpICYmIG9ialtvblByb3BQYXRjaGVkU3ltYm9sXSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIEEgcHJvcGVydHkgZGVzY3JpcHRvciBjYW5ub3QgaGF2ZSBnZXR0ZXIvc2V0dGVyIGFuZCBiZSB3cml0YWJsZVxuICAgIC8vIGRlbGV0aW5nIHRoZSB3cml0YWJsZSBhbmQgdmFsdWUgcHJvcGVydGllcyBhdm9pZHMgdGhpcyBlcnJvcjpcbiAgICAvL1xuICAgIC8vIFR5cGVFcnJvcjogcHJvcGVydHkgZGVzY3JpcHRvcnMgbXVzdCBub3Qgc3BlY2lmeSBhIHZhbHVlIG9yIGJlIHdyaXRhYmxlIHdoZW4gYVxuICAgIC8vIGdldHRlciBvciBzZXR0ZXIgaGFzIGJlZW4gc3BlY2lmaWVkXG4gICAgZGVsZXRlIGRlc2Mud3JpdGFibGU7XG4gICAgZGVsZXRlIGRlc2MudmFsdWU7XG4gICAgY29uc3Qgb3JpZ2luYWxEZXNjR2V0ID0gZGVzYy5nZXQ7XG4gICAgY29uc3Qgb3JpZ2luYWxEZXNjU2V0ID0gZGVzYy5zZXQ7XG4gICAgLy8gc2xpY2UoMikgY3V6ICdvbmNsaWNrJyAtPiAnY2xpY2snLCBldGNcbiAgICBjb25zdCBldmVudE5hbWUgPSBwcm9wLnNsaWNlKDIpO1xuICAgIGxldCBldmVudE5hbWVTeW1ib2wgPSB6b25lU3ltYm9sRXZlbnROYW1lcyQxW2V2ZW50TmFtZV07XG4gICAgaWYgKCFldmVudE5hbWVTeW1ib2wpIHtcbiAgICAgICAgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXMkMVtldmVudE5hbWVdID0gem9uZVN5bWJvbCgnT05fUFJPUEVSVFknICsgZXZlbnROYW1lKTtcbiAgICB9XG4gICAgZGVzYy5zZXQgPSBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgLy8gaW4gc29tZSBvZiB3aW5kb3dzJ3Mgb25wcm9wZXJ0eSBjYWxsYmFjaywgdGhpcyBpcyB1bmRlZmluZWRcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBjaGVjayBpdFxuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcztcbiAgICAgICAgaWYgKCF0YXJnZXQgJiYgb2JqID09PSBfZ2xvYmFsKSB7XG4gICAgICAgICAgICB0YXJnZXQgPSBfZ2xvYmFsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHRhcmdldFtldmVudE5hbWVTeW1ib2xdO1xuICAgICAgICBpZiAodHlwZW9mIHByZXZpb3VzVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgd3JhcEZuKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpc3N1ZSAjOTc4LCB3aGVuIG9ubG9hZCBoYW5kbGVyIHdhcyBhZGRlZCBiZWZvcmUgbG9hZGluZyB6b25lLmpzXG4gICAgICAgIC8vIHdlIHNob3VsZCByZW1vdmUgaXQgd2l0aCBvcmlnaW5hbERlc2NTZXRcbiAgICAgICAgb3JpZ2luYWxEZXNjU2V0ICYmIG9yaWdpbmFsRGVzY1NldC5jYWxsKHRhcmdldCwgbnVsbCk7XG4gICAgICAgIHRhcmdldFtldmVudE5hbWVTeW1ib2xdID0gbmV3VmFsdWU7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgd3JhcEZuLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vIFRoZSBnZXR0ZXIgd291bGQgcmV0dXJuIHVuZGVmaW5lZCBmb3IgdW5hc3NpZ25lZCBwcm9wZXJ0aWVzIGJ1dCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBhblxuICAgIC8vIHVuYXNzaWduZWQgcHJvcGVydHkgaXMgbnVsbFxuICAgIGRlc2MuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBpbiBzb21lIG9mIHdpbmRvd3MncyBvbnByb3BlcnR5IGNhbGxiYWNrLCB0aGlzIGlzIHVuZGVmaW5lZFxuICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGNoZWNrIGl0XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzO1xuICAgICAgICBpZiAoIXRhcmdldCAmJiBvYmogPT09IF9nbG9iYWwpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IF9nbG9iYWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGFyZ2V0W2V2ZW50TmFtZVN5bWJvbF07XG4gICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9yaWdpbmFsRGVzY0dldCkge1xuICAgICAgICAgICAgLy8gcmVzdWx0IHdpbGwgYmUgbnVsbCB3aGVuIHVzZSBpbmxpbmUgZXZlbnQgYXR0cmlidXRlLFxuICAgICAgICAgICAgLy8gc3VjaCBhcyA8YnV0dG9uIG9uY2xpY2s9XCJmdW5jKCk7XCI+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhlIG9uY2xpY2sgZnVuY3Rpb24gaXMgaW50ZXJuYWwgcmF3IHVuY29tcGlsZWQgaGFuZGxlclxuICAgICAgICAgICAgLy8gdGhlIG9uY2xpY2sgd2lsbCBiZSBldmFsdWF0ZWQgd2hlbiBmaXJzdCB0aW1lIGV2ZW50IHdhcyB0cmlnZ2VyZWQgb3JcbiAgICAgICAgICAgIC8vIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZCwgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvNTI1XG4gICAgICAgICAgICAvLyBzbyB3ZSBzaG91bGQgdXNlIG9yaWdpbmFsIG5hdGl2ZSBnZXQgdG8gcmV0cmlldmUgdGhlIGhhbmRsZXJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG9yaWdpbmFsRGVzY0dldC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVzYy5zZXQuY2FsbCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbUkVNT1ZFX0FUVFJJQlVURV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgT2JqZWN0RGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjKTtcbiAgICBvYmpbb25Qcm9wUGF0Y2hlZFN5bWJvbF0gPSB0cnVlO1xufVxuZnVuY3Rpb24gcGF0Y2hPblByb3BlcnRpZXMob2JqLCBwcm9wZXJ0aWVzLCBwcm90b3R5cGUpIHtcbiAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHBhdGNoUHJvcGVydHkob2JqLCAnb24nICsgcHJvcGVydGllc1tpXSwgcHJvdG90eXBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3Qgb25Qcm9wZXJ0aWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChwcm9wLnNsaWNlKDAsIDIpID09ICdvbicpIHtcbiAgICAgICAgICAgICAgICBvblByb3BlcnRpZXMucHVzaChwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG9uUHJvcGVydGllcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgcGF0Y2hQcm9wZXJ0eShvYmosIG9uUHJvcGVydGllc1tqXSwgcHJvdG90eXBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnN0IG9yaWdpbmFsSW5zdGFuY2VLZXkgPSB6b25lU3ltYm9sKCdvcmlnaW5hbEluc3RhbmNlJyk7XG4vLyB3cmFwIHNvbWUgbmF0aXZlIEFQSSBvbiBgd2luZG93YFxuZnVuY3Rpb24gcGF0Y2hDbGFzcyhjbGFzc05hbWUpIHtcbiAgICBjb25zdCBPcmlnaW5hbENsYXNzID0gX2dsb2JhbFtjbGFzc05hbWVdO1xuICAgIGlmICghT3JpZ2luYWxDbGFzcylcbiAgICAgICAgcmV0dXJuO1xuICAgIC8vIGtlZXAgb3JpZ2luYWwgY2xhc3MgaW4gZ2xvYmFsXG4gICAgX2dsb2JhbFt6b25lU3ltYm9sKGNsYXNzTmFtZSldID0gT3JpZ2luYWxDbGFzcztcbiAgICBfZ2xvYmFsW2NsYXNzTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGEgPSBiaW5kQXJndW1lbnRzKGFyZ3VtZW50cywgY2xhc3NOYW1lKTtcbiAgICAgICAgc3dpdGNoIChhLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoYVswXSwgYVsxXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XSA9IG5ldyBPcmlnaW5hbENsYXNzKGFbMF0sIGFbMV0sIGFbMl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdLCBhWzJdLCBhWzNdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmcgbGlzdCB0b28gbG9uZy4nKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gYXR0YWNoIG9yaWdpbmFsIGRlbGVnYXRlIHRvIHBhdGNoZWQgZnVuY3Rpb25cbiAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQoX2dsb2JhbFtjbGFzc05hbWVdLCBPcmlnaW5hbENsYXNzKTtcbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBPcmlnaW5hbENsYXNzKGZ1bmN0aW9uICgpIHsgfSk7XG4gICAgbGV0IHByb3A7XG4gICAgZm9yIChwcm9wIGluIGluc3RhbmNlKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD00NDcyMVxuICAgICAgICBpZiAoY2xhc3NOYW1lID09PSAnWE1MSHR0cFJlcXVlc3QnICYmIHByb3AgPT09ICdyZXNwb25zZUJsb2InKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZVtwcm9wXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIF9nbG9iYWxbY2xhc3NOYW1lXS5wcm90b3R5cGVbcHJvcF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdLmFwcGx5KHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0sIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIE9iamVjdERlZmluZVByb3BlcnR5KF9nbG9iYWxbY2xhc3NOYW1lXS5wcm90b3R5cGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdID0gd3JhcFdpdGhDdXJyZW50Wm9uZShmbiwgY2xhc3NOYW1lICsgJy4nICsgcHJvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2VlcCBjYWxsYmFjayBpbiB3cmFwcGVkIGZ1bmN0aW9uIHNvIHdlIGNhblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZSBpdCBpbiBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIG5hdGl2ZSBvbmUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0sIGZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0gPSBmbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkocHJvcCk7XG4gICAgfVxuICAgIGZvciAocHJvcCBpbiBPcmlnaW5hbENsYXNzKSB7XG4gICAgICAgIGlmIChwcm9wICE9PSAncHJvdG90eXBlJyAmJiBPcmlnaW5hbENsYXNzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICBfZ2xvYmFsW2NsYXNzTmFtZV1bcHJvcF0gPSBPcmlnaW5hbENsYXNzW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gcGF0Y2hNZXRob2QodGFyZ2V0LCBuYW1lLCBwYXRjaEZuKSB7XG4gICAgbGV0IHByb3RvID0gdGFyZ2V0O1xuICAgIHdoaWxlIChwcm90byAmJiAhcHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgcHJvdG8gPSBPYmplY3RHZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgfVxuICAgIGlmICghcHJvdG8gJiYgdGFyZ2V0W25hbWVdKSB7XG4gICAgICAgIC8vIHNvbWVob3cgd2UgZGlkIG5vdCBmaW5kIGl0LCBidXQgd2UgY2FuIHNlZSBpdC4gVGhpcyBoYXBwZW5zIG9uIElFIGZvciBXaW5kb3cgcHJvcGVydGllcy5cbiAgICAgICAgcHJvdG8gPSB0YXJnZXQ7XG4gICAgfVxuICAgIGNvbnN0IGRlbGVnYXRlTmFtZSA9IHpvbmVTeW1ib2wobmFtZSk7XG4gICAgbGV0IGRlbGVnYXRlID0gbnVsbDtcbiAgICBpZiAocHJvdG8gJiYgKCEoZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdKSB8fCAhcHJvdG8uaGFzT3duUHJvcGVydHkoZGVsZWdhdGVOYW1lKSkpIHtcbiAgICAgICAgZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdID0gcHJvdG9bbmFtZV07XG4gICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgcHJvdG9bbmFtZV0gaXMgd3JpdGFibGVcbiAgICAgICAgLy8gc29tZSBwcm9wZXJ0eSBpcyByZWFkb25seSBpbiBzYWZhcmksIHN1Y2ggYXMgSHRtbENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYlxuICAgICAgICBjb25zdCBkZXNjID0gcHJvdG8gJiYgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcbiAgICAgICAgaWYgKGlzUHJvcGVydHlXcml0YWJsZShkZXNjKSkge1xuICAgICAgICAgICAgY29uc3QgcGF0Y2hEZWxlZ2F0ZSA9IHBhdGNoRm4oZGVsZWdhdGUsIGRlbGVnYXRlTmFtZSwgbmFtZSk7XG4gICAgICAgICAgICBwcm90b1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0Y2hEZWxlZ2F0ZSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tuYW1lXSwgZGVsZWdhdGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWxlZ2F0ZTtcbn1cbi8vIFRPRE86IEBKaWFMaVBhc3Npb24sIHN1cHBvcnQgY2FuY2VsIHRhc2sgbGF0ZXIgaWYgbmVjZXNzYXJ5XG5mdW5jdGlvbiBwYXRjaE1hY3JvVGFzayhvYmosIGZ1bmNOYW1lLCBtZXRhQ3JlYXRvcikge1xuICAgIGxldCBzZXROYXRpdmUgPSBudWxsO1xuICAgIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0YXNrLmRhdGE7XG4gICAgICAgIGRhdGEuYXJnc1tkYXRhLmNiSWR4XSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhc2suaW52b2tlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICAgIHNldE5hdGl2ZS5hcHBseShkYXRhLnRhcmdldCwgZGF0YS5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgfVxuICAgIHNldE5hdGl2ZSA9IHBhdGNoTWV0aG9kKG9iaiwgZnVuY05hbWUsIChkZWxlZ2F0ZSkgPT4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgY29uc3QgbWV0YSA9IG1ldGFDcmVhdG9yKHNlbGYsIGFyZ3MpO1xuICAgICAgICBpZiAobWV0YS5jYklkeCA+PSAwICYmIHR5cGVvZiBhcmdzW21ldGEuY2JJZHhdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUobWV0YS5uYW1lLCBhcmdzW21ldGEuY2JJZHhdLCBtZXRhLCBzY2hlZHVsZVRhc2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gY2F1c2UgYW4gZXJyb3IgYnkgY2FsbGluZyBpdCBkaXJlY3RseS5cbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHBhdGNoZWQsIG9yaWdpbmFsKSB7XG4gICAgcGF0Y2hlZFt6b25lU3ltYm9sKCdPcmlnaW5hbERlbGVnYXRlJyldID0gb3JpZ2luYWw7XG59XG5sZXQgaXNEZXRlY3RlZElFT3JFZGdlID0gZmFsc2U7XG5sZXQgaWVPckVkZ2UgPSBmYWxzZTtcbmZ1bmN0aW9uIGlzSUUoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdWEgPSBpbnRlcm5hbFdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICBpZiAodWEuaW5kZXhPZignTVNJRSAnKSAhPT0gLTEgfHwgdWEuaW5kZXhPZignVHJpZGVudC8nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNJRU9yRWRnZSgpIHtcbiAgICBpZiAoaXNEZXRlY3RlZElFT3JFZGdlKSB7XG4gICAgICAgIHJldHVybiBpZU9yRWRnZTtcbiAgICB9XG4gICAgaXNEZXRlY3RlZElFT3JFZGdlID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB1YSA9IGludGVybmFsV2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICAgIGlmICh1YS5pbmRleE9mKCdNU0lFICcpICE9PSAtMSB8fCB1YS5pbmRleE9mKCdUcmlkZW50LycpICE9PSAtMSB8fCB1YS5pbmRleE9mKCdFZGdlLycpICE9PSAtMSkge1xuICAgICAgICAgICAgaWVPckVkZ2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyB9XG4gICAgcmV0dXJuIGllT3JFZGdlO1xufVxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7bWlzc2luZ1JlcXVpcmV9XG4gKi9cbi8vIE5vdGUgdGhhdCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycyBhcmUgbm93IHN1cHBvcnRlZCBieSBtb3N0IG1vZGVybiBicm93c2Vycyxcbi8vIGluY2x1ZGluZyBDaHJvbWUsIEZpcmVmb3gsIFNhZmFyaSwgYW5kIEVkZ2UuIFRoZXJlJ3MgYSBwZW5kaW5nIGNoYW5nZSB0aGF0XG4vLyB3b3VsZCByZW1vdmUgc3VwcG9ydCBmb3IgbGVnYWN5IGJyb3dzZXJzIGJ5IHpvbmUuanMuIFJlbW92aW5nIGBwYXNzaXZlU3VwcG9ydGVkYFxuLy8gZnJvbSB0aGUgY29kZWJhc2Ugd2lsbCByZWR1Y2UgdGhlIGZpbmFsIGNvZGUgc2l6ZSBmb3IgZXhpc3RpbmcgYXBwcyB0aGF0IHN0aWxsIHVzZSB6b25lLmpzLlxubGV0IHBhc3NpdmVTdXBwb3J0ZWQgPSBmYWxzZTtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGFzc2l2ZVN1cHBvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gTm90ZTogV2UgcGFzcyB0aGUgYG9wdGlvbnNgIG9iamVjdCBhcyB0aGUgZXZlbnQgaGFuZGxlciB0b28uIFRoaXMgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGVcbiAgICAgICAgLy8gc2lnbmF0dXJlIG9mIGBhZGRFdmVudExpc3RlbmVyYCBvciBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAgYnV0IGVuYWJsZXMgdXMgdG8gcmVtb3ZlIHRoZSBoYW5kbGVyXG4gICAgICAgIC8vIHdpdGhvdXQgYW4gYWN0dWFsIGhhbmRsZXIuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0Jywgb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0ZXN0Jywgb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgcGFzc2l2ZVN1cHBvcnRlZCA9IGZhbHNlO1xuICAgIH1cbn1cbi8vIGFuIGlkZW50aWZpZXIgdG8gdGVsbCBab25lVGFzayBkbyBub3QgY3JlYXRlIGEgbmV3IGludm9rZSBjbG9zdXJlXG5jb25zdCBPUFRJTUlaRURfWk9ORV9FVkVOVF9UQVNLX0RBVEEgPSB7XG4gICAgdXNlRzogdHJ1ZSxcbn07XG5jb25zdCB6b25lU3ltYm9sRXZlbnROYW1lcyA9IHt9O1xuY29uc3QgZ2xvYmFsU291cmNlcyA9IHt9O1xuY29uc3QgRVZFTlRfTkFNRV9TWU1CT0xfUkVHWCA9IG5ldyBSZWdFeHAoJ14nICsgWk9ORV9TWU1CT0xfUFJFRklYICsgJyhcXFxcdyspKHRydWV8ZmFsc2UpJCcpO1xuY29uc3QgSU1NRURJQVRFX1BST1BBR0FUSU9OX1NZTUJPTCA9IHpvbmVTeW1ib2woJ3Byb3BhZ2F0aW9uU3RvcHBlZCcpO1xuZnVuY3Rpb24gcHJlcGFyZUV2ZW50TmFtZXMoZXZlbnROYW1lLCBldmVudE5hbWVUb1N0cmluZykge1xuICAgIGNvbnN0IGZhbHNlRXZlbnROYW1lID0gKGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSkgKyBGQUxTRV9TVFI7XG4gICAgY29uc3QgdHJ1ZUV2ZW50TmFtZSA9IChldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpICsgVFJVRV9TVFI7XG4gICAgY29uc3Qgc3ltYm9sID0gWk9ORV9TWU1CT0xfUFJFRklYICsgZmFsc2VFdmVudE5hbWU7XG4gICAgY29uc3Qgc3ltYm9sQ2FwdHVyZSA9IFpPTkVfU1lNQk9MX1BSRUZJWCArIHRydWVFdmVudE5hbWU7XG4gICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXSA9IHt9O1xuICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV1bRkFMU0VfU1RSXSA9IHN5bWJvbDtcbiAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdW1RSVUVfU1RSXSA9IHN5bWJvbENhcHR1cmU7XG59XG5mdW5jdGlvbiBwYXRjaEV2ZW50VGFyZ2V0KF9nbG9iYWwsIGFwaSwgYXBpcywgcGF0Y2hPcHRpb25zKSB7XG4gICAgY29uc3QgQUREX0VWRU5UX0xJU1RFTkVSID0gKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuYWRkKSB8fCBBRERfRVZFTlRfTElTVEVORVJfU1RSO1xuICAgIGNvbnN0IFJFTU9WRV9FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnJtKSB8fCBSRU1PVkVfRVZFTlRfTElTVEVORVJfU1RSO1xuICAgIGNvbnN0IExJU1RFTkVSU19FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmxpc3RlbmVycykgfHwgJ2V2ZW50TGlzdGVuZXJzJztcbiAgICBjb25zdCBSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnJtQWxsKSB8fCAncmVtb3ZlQWxsTGlzdGVuZXJzJztcbiAgICBjb25zdCB6b25lU3ltYm9sQWRkRXZlbnRMaXN0ZW5lciA9IHpvbmVTeW1ib2woQUREX0VWRU5UX0xJU1RFTkVSKTtcbiAgICBjb25zdCBBRERfRVZFTlRfTElTVEVORVJfU09VUkNFID0gJy4nICsgQUREX0VWRU5UX0xJU1RFTkVSICsgJzonO1xuICAgIGNvbnN0IFBSRVBFTkRfRVZFTlRfTElTVEVORVIgPSAncHJlcGVuZExpc3RlbmVyJztcbiAgICBjb25zdCBQUkVQRU5EX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSA9ICcuJyArIFBSRVBFTkRfRVZFTlRfTElTVEVORVIgKyAnOic7XG4gICAgY29uc3QgaW52b2tlVGFzayA9IGZ1bmN0aW9uICh0YXNrLCB0YXJnZXQsIGV2ZW50KSB7XG4gICAgICAgIC8vIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UsIGNoZWNrIGlzUmVtb3ZlZCB3aGljaCBpcyBzZXRcbiAgICAgICAgLy8gYnkgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAgICAgICBpZiAodGFzay5pc1JlbW92ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgZGVsZWdhdGUgPT09ICdvYmplY3QnICYmIGRlbGVnYXRlLmhhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIGJpbmQgdmVyc2lvbiBvZiBoYW5kbGVFdmVudCB3aGVuIGludm9rZVxuICAgICAgICAgICAgdGFzay5jYWxsYmFjayA9IChldmVudCkgPT4gZGVsZWdhdGUuaGFuZGxlRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgdGFzay5vcmlnaW5hbERlbGVnYXRlID0gZGVsZWdhdGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaW52b2tlIHN0YXRpYyB0YXNrLmludm9rZVxuICAgICAgICAvLyBuZWVkIHRvIHRyeS9jYXRjaCBlcnJvciBoZXJlLCBvdGhlcndpc2UsIHRoZSBlcnJvciBpbiBvbmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgLy8gd2lsbCBicmVhayB0aGUgZXhlY3V0aW9ucyBvZiB0aGUgb3RoZXIgZXZlbnQgbGlzdGVuZXJzLiBBbHNvIGVycm9yIHdpbGxcbiAgICAgICAgLy8gbm90IHJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXIgd2hlbiBgb25jZWAgb3B0aW9ucyBpcyB0cnVlLlxuICAgICAgICBsZXQgZXJyb3I7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0YXNrLmludm9rZSh0YXNrLCB0YXJnZXQsIFtldmVudF0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0YXNrLm9wdGlvbnM7XG4gICAgICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zLm9uY2UpIHtcbiAgICAgICAgICAgIC8vIGlmIG9wdGlvbnMub25jZSBpcyB0cnVlLCBhZnRlciBpbnZva2Ugb25jZSByZW1vdmUgbGlzdGVuZXIgaGVyZVxuICAgICAgICAgICAgLy8gb25seSBicm93c2VyIG5lZWQgdG8gZG8gdGhpcywgbm9kZWpzIGV2ZW50RW1pdHRlciB3aWxsIGNhbCByZW1vdmVMaXN0ZW5lclxuICAgICAgICAgICAgLy8gaW5zaWRlIEV2ZW50RW1pdHRlci5vbmNlXG4gICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICAgICAgICB0YXJnZXRbUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRhcmdldCwgZXZlbnQudHlwZSwgZGVsZWdhdGUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGdsb2JhbENhbGxiYWNrKGNvbnRleHQsIGV2ZW50LCBpc0NhcHR1cmUpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvOTExLCBpbiBJRSwgc29tZXRpbWVzXG4gICAgICAgIC8vIGV2ZW50IHdpbGwgYmUgdW5kZWZpbmVkLCBzbyB3ZSBuZWVkIHRvIHVzZSB3aW5kb3cuZXZlbnRcbiAgICAgICAgZXZlbnQgPSBldmVudCB8fCBfZ2xvYmFsLmV2ZW50O1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXZlbnQudGFyZ2V0IGlzIG5lZWRlZCBmb3IgU2Ftc3VuZyBUViBhbmQgU291cmNlQnVmZmVyXG4gICAgICAgIC8vIHx8IGdsb2JhbCBpcyBuZWVkZWQgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvMTkwXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGNvbnRleHQgfHwgZXZlbnQudGFyZ2V0IHx8IF9nbG9iYWw7XG4gICAgICAgIGNvbnN0IHRhc2tzID0gdGFyZ2V0W3pvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50LnR5cGVdW2lzQ2FwdHVyZSA/IFRSVUVfU1RSIDogRkFMU0VfU1RSXV07XG4gICAgICAgIGlmICh0YXNrcykge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICAgICAgICAvLyBpbnZva2UgYWxsIHRhc2tzIHdoaWNoIGF0dGFjaGVkIHRvIGN1cnJlbnQgdGFyZ2V0IHdpdGggZ2l2ZW4gZXZlbnQudHlwZSBhbmQgY2FwdHVyZSA9IGZhbHNlXG4gICAgICAgICAgICAvLyBmb3IgcGVyZm9ybWFuY2UgY29uY2VybiwgaWYgdGFzay5sZW5ndGggPT09IDEsIGp1c3QgaW52b2tlXG4gICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyID0gaW52b2tlVGFzayh0YXNrc1swXSwgdGFyZ2V0LCBldmVudCk7XG4gICAgICAgICAgICAgICAgZXJyICYmIGVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy84MzZcbiAgICAgICAgICAgICAgICAvLyBjb3B5IHRoZSB0YXNrcyBhcnJheSBiZWZvcmUgaW52b2tlLCB0byBhdm9pZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgb3Igb3RoZXIgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICBjb25zdCBjb3B5VGFza3MgPSB0YXNrcy5zbGljZSgpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29weVRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudCAmJiBldmVudFtJTU1FRElBVEVfUFJPUEFHQVRJT05fU1lNQk9MXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gaW52b2tlVGFzayhjb3B5VGFza3NbaV0sIHRhcmdldCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBlcnIgJiYgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTaW5jZSB0aGVyZSBpcyBvbmx5IG9uZSBlcnJvciwgd2UgZG9uJ3QgbmVlZCB0byBzY2hlZHVsZSBtaWNyb1Rhc2tcbiAgICAgICAgICAgIC8vIHRvIHRocm93IHRoZSBlcnJvci5cbiAgICAgICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gZXJyb3JzW2ldO1xuICAgICAgICAgICAgICAgICAgICBhcGkubmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gZ2xvYmFsIHNoYXJlZCB6b25lQXdhcmVDYWxsYmFjayB0byBoYW5kbGUgYWxsIGV2ZW50IGNhbGxiYWNrIHdpdGggY2FwdHVyZSA9IGZhbHNlXG4gICAgY29uc3QgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbENhbGxiYWNrKHRoaXMsIGV2ZW50LCBmYWxzZSk7XG4gICAgfTtcbiAgICAvLyBnbG9iYWwgc2hhcmVkIHpvbmVBd2FyZUNhbGxiYWNrIHRvIGhhbmRsZSBhbGwgZXZlbnQgY2FsbGJhY2sgd2l0aCBjYXB0dXJlID0gdHJ1ZVxuICAgIGNvbnN0IGdsb2JhbFpvbmVBd2FyZUNhcHR1cmVDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsQ2FsbGJhY2sodGhpcywgZXZlbnQsIHRydWUpO1xuICAgIH07XG4gICAgZnVuY3Rpb24gcGF0Y2hFdmVudFRhcmdldE1ldGhvZHMob2JqLCBwYXRjaE9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdXNlR2xvYmFsQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy51c2VHICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHVzZUdsb2JhbENhbGxiYWNrID0gcGF0Y2hPcHRpb25zLnVzZUc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsaWRhdGVIYW5kbGVyID0gcGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy52aDtcbiAgICAgICAgbGV0IGNoZWNrRHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuY2hrRHVwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNoZWNrRHVwbGljYXRlID0gcGF0Y2hPcHRpb25zLmNoa0R1cDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmV0dXJuVGFyZ2V0ID0gZmFsc2U7XG4gICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVyblRhcmdldCA9IHBhdGNoT3B0aW9ucy5ydDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcHJvdG8gPSBvYmo7XG4gICAgICAgIHdoaWxlIChwcm90byAmJiAhcHJvdG8uaGFzT3duUHJvcGVydHkoQUREX0VWRU5UX0xJU1RFTkVSKSkge1xuICAgICAgICAgICAgcHJvdG8gPSBPYmplY3RHZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcm90byAmJiBvYmpbQUREX0VWRU5UX0xJU1RFTkVSXSkge1xuICAgICAgICAgICAgLy8gc29tZWhvdyB3ZSBkaWQgbm90IGZpbmQgaXQsIGJ1dCB3ZSBjYW4gc2VlIGl0LiBUaGlzIGhhcHBlbnMgb24gSUUgZm9yIFdpbmRvdyBwcm9wZXJ0aWVzLlxuICAgICAgICAgICAgcHJvdG8gPSBvYmo7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcm90bykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm90b1t6b25lU3ltYm9sQWRkRXZlbnRMaXN0ZW5lcl0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBldmVudE5hbWVUb1N0cmluZyA9IHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuZXZlbnROYW1lVG9TdHJpbmc7XG4gICAgICAgIC8vIFdlIHVzZSBhIHNoYXJlZCBnbG9iYWwgYHRhc2tEYXRhYCB0byBwYXNzIGRhdGEgZm9yIGBzY2hlZHVsZUV2ZW50VGFza2AsXG4gICAgICAgIC8vIGVsaW1pbmF0aW5nIHRoZSBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3Qgc29sZWx5IGZvciBwYXNzaW5nIGRhdGEuXG4gICAgICAgIC8vIFdBUk5JTkc6IFRoaXMgb2JqZWN0IGhhcyBhIHN0YXRpYyBsaWZldGltZSwgbWVhbmluZyBpdCBpcyBub3QgY3JlYXRlZFxuICAgICAgICAvLyBlYWNoIHRpbWUgYGFkZEV2ZW50TGlzdGVuZXJgIGlzIGNhbGxlZC4gSXQgaXMgaW5zdGFudGlhdGVkIG9ubHkgb25jZVxuICAgICAgICAvLyBhbmQgY2FwdHVyZWQgYnkgcmVmZXJlbmNlIGluc2lkZSB0aGUgYGFkZEV2ZW50TGlzdGVuZXJgIGFuZFxuICAgICAgICAvLyBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAgZnVuY3Rpb25zLiBEbyBub3QgYWRkIGFueSBuZXcgcHJvcGVydGllcyB0byB0aGlzXG4gICAgICAgIC8vIG9iamVjdCwgYXMgZG9pbmcgc28gd291bGQgbmVjZXNzaXRhdGUgbWFpbnRhaW5pbmcgdGhlIGluZm9ybWF0aW9uXG4gICAgICAgIC8vIGJldHdlZW4gYGFkZEV2ZW50TGlzdGVuZXJgIGNhbGxzLlxuICAgICAgICBjb25zdCB0YXNrRGF0YSA9IHt9O1xuICAgICAgICBjb25zdCBuYXRpdmVBZGRFdmVudExpc3RlbmVyID0gKHByb3RvW3pvbmVTeW1ib2xBZGRFdmVudExpc3RlbmVyXSA9IHByb3RvW0FERF9FVkVOVF9MSVNURU5FUl0pO1xuICAgICAgICBjb25zdCBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyID0gKHByb3RvW3pvbmVTeW1ib2woUkVNT1ZFX0VWRU5UX0xJU1RFTkVSKV0gPVxuICAgICAgICAgICAgcHJvdG9bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXSk7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUxpc3RlbmVycyA9IChwcm90b1t6b25lU3ltYm9sKExJU1RFTkVSU19FVkVOVF9MSVNURU5FUildID1cbiAgICAgICAgICAgIHByb3RvW0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0pO1xuICAgICAgICBjb25zdCBuYXRpdmVSZW1vdmVBbGxMaXN0ZW5lcnMgPSAocHJvdG9bem9uZVN5bWJvbChSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUildID1cbiAgICAgICAgICAgIHByb3RvW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSk7XG4gICAgICAgIGxldCBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lcjtcbiAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucHJlcGVuZCkge1xuICAgICAgICAgICAgbmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXIgPSBwcm90b1t6b25lU3ltYm9sKHBhdGNoT3B0aW9ucy5wcmVwZW5kKV0gPVxuICAgICAgICAgICAgICAgIHByb3RvW3BhdGNoT3B0aW9ucy5wcmVwZW5kXTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyB1dGlsIGZ1bmN0aW9uIHdpbGwgYnVpbGQgYW4gb3B0aW9uIG9iamVjdCB3aXRoIHBhc3NpdmUgb3B0aW9uXG4gICAgICAgICAqIHRvIGhhbmRsZSBhbGwgcG9zc2libGUgaW5wdXQgZnJvbSB0aGUgdXNlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkRXZlbnRMaXN0ZW5lck9wdGlvbnMob3B0aW9ucywgcGFzc2l2ZSkge1xuICAgICAgICAgICAgaWYgKCFwYXNzaXZlU3VwcG9ydGVkICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgLy8gZG9lc24ndCBzdXBwb3J0IHBhc3NpdmUgYnV0IHVzZXIgd2FudCB0byBwYXNzIGFuIG9iamVjdCBhcyBvcHRpb25zLlxuICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCBub3Qgd29yayBvbiBzb21lIG9sZCBicm93c2VyLCBzbyB3ZSBqdXN0IHBhc3MgYSBib29sZWFuXG4gICAgICAgICAgICAgICAgLy8gYXMgdXNlQ2FwdHVyZSBwYXJhbWV0ZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gISFvcHRpb25zLmNhcHR1cmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXBhc3NpdmVTdXBwb3J0ZWQgfHwgIXBhc3NpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY2FwdHVyZTogb3B0aW9ucywgcGFzc2l2ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcGFzc2l2ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zLnBhc3NpdmUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4ub3B0aW9ucywgcGFzc2l2ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VzdG9tU2NoZWR1bGVHbG9iYWwgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRhc2sgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlLFxuICAgICAgICAgICAgLy8ganVzdCByZXR1cm4sIGJlY2F1c2Ugd2UgdXNlIHRoZSBzaGFyZWQgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgaGVyZS5cbiAgICAgICAgICAgIGlmICh0YXNrRGF0YS5pc0V4aXN0aW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIuY2FsbCh0YXNrRGF0YS50YXJnZXQsIHRhc2tEYXRhLmV2ZW50TmFtZSwgdGFza0RhdGEuY2FwdHVyZSA/IGdsb2JhbFpvbmVBd2FyZUNhcHR1cmVDYWxsYmFjayA6IGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrLCB0YXNrRGF0YS5vcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluIHRoZSBjb250ZXh0IG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzLCB0aGlzIGZ1bmN0aW9uIHdpbGwgYmVcbiAgICAgICAgICogY2FsbGVkIGF0IHRoZSBlbmQgYnkgYGNhbmNlbFRhc2tgLCB3aGljaCwgaW4gdHVybiwgY2FsbHMgYHRhc2suY2FuY2VsRm5gLlxuICAgICAgICAgKiBDYW5jZWxsaW5nIGEgdGFzayBpcyBwcmltYXJpbHkgdXNlZCB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzIGZyb21cbiAgICAgICAgICogdGhlIHRhc2sgdGFyZ2V0LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY3VzdG9tQ2FuY2VsR2xvYmFsID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIC8vIGlmIHRhc2sgaXMgbm90IG1hcmtlZCBhcyBpc1JlbW92ZWQsIHRoaXMgY2FsbCBpcyBkaXJlY3RseVxuICAgICAgICAgICAgLy8gZnJvbSBab25lLnByb3RvdHlwZS5jYW5jZWxUYXNrLCB3ZSBzaG91bGQgcmVtb3ZlIHRoZSB0YXNrXG4gICAgICAgICAgICAvLyBmcm9tIHRhc2tzTGlzdCBvZiB0YXJnZXQgZmlyc3RcbiAgICAgICAgICAgIGlmICghdGFzay5pc1JlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbdGFzay5ldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIGxldCBzeW1ib2xFdmVudE5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1t0YXNrLmNhcHR1cmUgPyBUUlVFX1NUUiA6IEZBTFNFX1NUUl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFza3MgPSBzeW1ib2xFdmVudE5hbWUgJiYgdGFzay50YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFzayA9IGV4aXN0aW5nVGFza3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrID09PSB0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGlzUmVtb3ZlZCB0byBkYXRhIGZvciBmYXN0ZXIgaW52b2tlVGFzayBjaGVja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suaXNSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFzay5yZW1vdmVBYm9ydExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sucmVtb3ZlQWJvcnRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnJlbW92ZUFib3J0TGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIHRhc2tzIGZvciB0aGUgZXZlbnROYW1lICsgY2FwdHVyZSBoYXZlIGdvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBnbG9iYWxab25lQXdhcmVDYWxsYmFjayBhbmQgcmVtb3ZlIHRoZSB0YXNrIGNhY2hlIGZyb20gdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suYWxsUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sudGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGFsbCB0YXNrcyBmb3IgdGhlIGV2ZW50TmFtZSArIGNhcHR1cmUgaGF2ZSBnb25lLFxuICAgICAgICAgICAgLy8gd2Ugd2lsbCByZWFsbHkgcmVtb3ZlIHRoZSBnbG9iYWwgZXZlbnQgY2FsbGJhY2ssXG4gICAgICAgICAgICAvLyBpZiBub3QsIHJldHVyblxuICAgICAgICAgICAgaWYgKCF0YXNrLmFsbFJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2sudGFyZ2V0LCB0YXNrLmV2ZW50TmFtZSwgdGFzay5jYXB0dXJlID8gZ2xvYmFsWm9uZUF3YXJlQ2FwdHVyZUNhbGxiYWNrIDogZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2ssIHRhc2sub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlTm9uR2xvYmFsID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIHJldHVybiBuYXRpdmVBZGRFdmVudExpc3RlbmVyLmNhbGwodGFza0RhdGEudGFyZ2V0LCB0YXNrRGF0YS5ldmVudE5hbWUsIHRhc2suaW52b2tlLCB0YXNrRGF0YS5vcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY3VzdG9tU2NoZWR1bGVQcmVwZW5kID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIHJldHVybiBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2tEYXRhLnRhcmdldCwgdGFza0RhdGEuZXZlbnROYW1lLCB0YXNrLmludm9rZSwgdGFza0RhdGEub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbUNhbmNlbE5vbkdsb2JhbCA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2sudGFyZ2V0LCB0YXNrLmV2ZW50TmFtZSwgdGFzay5pbnZva2UsIHRhc2sub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlID0gdXNlR2xvYmFsQ2FsbGJhY2sgPyBjdXN0b21TY2hlZHVsZUdsb2JhbCA6IGN1c3RvbVNjaGVkdWxlTm9uR2xvYmFsO1xuICAgICAgICBjb25zdCBjdXN0b21DYW5jZWwgPSB1c2VHbG9iYWxDYWxsYmFjayA/IGN1c3RvbUNhbmNlbEdsb2JhbCA6IGN1c3RvbUNhbmNlbE5vbkdsb2JhbDtcbiAgICAgICAgY29uc3QgY29tcGFyZVRhc2tDYWxsYmFja1ZzRGVsZWdhdGUgPSBmdW5jdGlvbiAodGFzaywgZGVsZWdhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVPZkRlbGVnYXRlID0gdHlwZW9mIGRlbGVnYXRlO1xuICAgICAgICAgICAgcmV0dXJuICgodHlwZU9mRGVsZWdhdGUgPT09ICdmdW5jdGlvbicgJiYgdGFzay5jYWxsYmFjayA9PT0gZGVsZWdhdGUpIHx8XG4gICAgICAgICAgICAgICAgKHR5cGVPZkRlbGVnYXRlID09PSAnb2JqZWN0JyAmJiB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPT09IGRlbGVnYXRlKSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBhcmUgPSBwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmRpZmYgPyBwYXRjaE9wdGlvbnMuZGlmZiA6IGNvbXBhcmVUYXNrQ2FsbGJhY2tWc0RlbGVnYXRlO1xuICAgICAgICBjb25zdCB1bnBhdGNoZWRFdmVudHMgPSBab25lW3pvbmVTeW1ib2woJ1VOUEFUQ0hFRF9FVkVOVFMnKV07XG4gICAgICAgIGNvbnN0IHBhc3NpdmVFdmVudHMgPSBfZ2xvYmFsW3pvbmVTeW1ib2woJ1BBU1NJVkVfRVZFTlRTJyldO1xuICAgICAgICBmdW5jdGlvbiBjb3B5RXZlbnRMaXN0ZW5lck9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBkZXN0cnVjdHVyZSB0aGUgdGFyZ2V0IGBvcHRpb25zYCBvYmplY3Qgc2luY2UgaXQgbWF5XG4gICAgICAgICAgICAgICAgLy8gYmUgZnJvemVuIG9yIHNlYWxlZCAocG9zc2libHkgcHJvdmlkZWQgaW1wbGljaXRseSBieSBhIHRoaXJkLXBhcnR5XG4gICAgICAgICAgICAgICAgLy8gbGlicmFyeSksIG9yIGl0cyBwcm9wZXJ0aWVzIG1heSBiZSByZWFkb25seS5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdPcHRpb25zID0geyAuLi5vcHRpb25zIH07XG4gICAgICAgICAgICAgICAgLy8gVGhlIGBzaWduYWxgIG9wdGlvbiB3YXMgcmVjZW50bHkgaW50cm9kdWNlZCwgd2hpY2ggY2F1c2VkIHJlZ3Jlc3Npb25zIGluXG4gICAgICAgICAgICAgICAgLy8gdGhpcmQtcGFydHkgc2NlbmFyaW9zIHdoZXJlIGBBYm9ydENvbnRyb2xsZXJgIHdhcyBkaXJlY3RseSBwcm92aWRlZCB0b1xuICAgICAgICAgICAgICAgIC8vIGBhZGRFdmVudExpc3RlbmVyYCBhcyBvcHRpb25zLiBGb3IgaW5zdGFuY2UsIGluIGNhc2VzIGxpa2VcbiAgICAgICAgICAgICAgICAvLyBgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGNhbGxiYWNrLCBhYm9ydENvbnRyb2xsZXJJbnN0YW5jZSlgLFxuICAgICAgICAgICAgICAgIC8vIHdoaWNoIGlzIHZhbGlkIGJlY2F1c2UgYEFib3J0Q29udHJvbGxlcmAgaW5jbHVkZXMgYSBgc2lnbmFsYCBnZXR0ZXIsIHNwcmVhZGluZ1xuICAgICAgICAgICAgICAgIC8vIGB7Li4ub3B0aW9uc31gIHdvdWxkbid0IGNvcHkgdGhlIGBzaWduYWxgLiBBZGRpdGlvbmFsbHksIHVzaW5nIGBPYmplY3QuY3JlYXRlYFxuICAgICAgICAgICAgICAgIC8vIGlzbid0IGZlYXNpYmxlIHNpbmNlIGBBYm9ydENvbnRyb2xsZXJgIGlzIGEgYnVpbHQtaW4gb2JqZWN0IHR5cGUsIGFuZCBhdHRlbXB0aW5nXG4gICAgICAgICAgICAgICAgLy8gdG8gY3JlYXRlIGEgbmV3IG9iamVjdCBkaXJlY3RseSB3aXRoIGl0IGFzIHRoZSBwcm90b3R5cGUgbWlnaHQgcmVzdWx0IGluXG4gICAgICAgICAgICAgICAgLy8gdW5leHBlY3RlZCBiZWhhdmlvci5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zaWduYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3T3B0aW9ucy5zaWduYWwgPSBvcHRpb25zLnNpZ25hbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld09wdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYWtlQWRkTGlzdGVuZXIgPSBmdW5jdGlvbiAobmF0aXZlTGlzdGVuZXIsIGFkZFNvdXJjZSwgY3VzdG9tU2NoZWR1bGVGbiwgY3VzdG9tQ2FuY2VsRm4sIHJldHVyblRhcmdldCA9IGZhbHNlLCBwcmVwZW5kID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuICAgICAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lID0gcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBkZWxlZ2F0ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNOb2RlICYmIGV2ZW50TmFtZSA9PT0gJ3VuY2F1Z2h0RXhjZXB0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBkb24ndCBwYXRjaCB1bmNhdWdodEV4Y2VwdGlvbiBvZiBub2RlanMgdG8gcHJldmVudCBlbmRsZXNzIGxvb3BcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGNyZWF0ZSB0aGUgYmluZCBkZWxlZ2F0ZSBmdW5jdGlvbiBmb3IgaGFuZGxlRXZlbnRcbiAgICAgICAgICAgICAgICAvLyBjYXNlIGhlcmUgdG8gaW1wcm92ZSBhZGRFdmVudExpc3RlbmVyIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgLy8gd2Ugd2lsbCBjcmVhdGUgdGhlIGJpbmQgZGVsZWdhdGUgd2hlbiBpbnZva2VcbiAgICAgICAgICAgICAgICBsZXQgaXNIYW5kbGVFdmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGVsZWdhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkZWxlZ2F0ZS5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXNIYW5kbGVFdmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0ZUhhbmRsZXIgJiYgIXZhbGlkYXRlSGFuZGxlcihuYXRpdmVMaXN0ZW5lciwgZGVsZWdhdGUsIHRhcmdldCwgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3NpdmUgPSBwYXNzaXZlU3VwcG9ydGVkICYmICEhcGFzc2l2ZUV2ZW50cyAmJiBwYXNzaXZlRXZlbnRzLmluZGV4T2YoZXZlbnROYW1lKSAhPT0gLTE7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGNvcHlFdmVudExpc3RlbmVyT3B0aW9ucyhidWlsZEV2ZW50TGlzdGVuZXJPcHRpb25zKGFyZ3VtZW50c1syXSwgcGFzc2l2ZSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpZ25hbCA9IG9wdGlvbnM/LnNpZ25hbDtcbiAgICAgICAgICAgICAgICBpZiAoc2lnbmFsPy5hYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBzaWduYWwgaXMgYW4gYWJvcnRlZCBvbmUsIGp1c3QgcmV0dXJuIHdpdGhvdXQgYXR0YWNoaW5nIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodW5wYXRjaGVkRXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHVucGF0Y2hlZCBsaXN0XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5wYXRjaGVkRXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lID09PSB1bnBhdGNoZWRFdmVudHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFzc2l2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmF0aXZlTGlzdGVuZXIuY2FsbCh0YXJnZXQsIGV2ZW50TmFtZSwgZGVsZWdhdGUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGNhcHR1cmUgPSAhb3B0aW9ucyA/IGZhbHNlIDogdHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJyA/IHRydWUgOiBvcHRpb25zLmNhcHR1cmU7XG4gICAgICAgICAgICAgICAgY29uc3Qgb25jZSA9IG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnID8gb3B0aW9ucy5vbmNlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgICAgICBsZXQgc3ltYm9sRXZlbnROYW1lcyA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKCFzeW1ib2xFdmVudE5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXBhcmVFdmVudE5hbWVzKGV2ZW50TmFtZSwgZXZlbnROYW1lVG9TdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1tjYXB0dXJlID8gVFJVRV9TVFIgOiBGQUxTRV9TVFJdO1xuICAgICAgICAgICAgICAgIGxldCBleGlzdGluZ1Rhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgbGV0IGlzRXhpc3RpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBhbHJlYWR5IGhhdmUgdGFzayByZWdpc3RlcmVkXG4gICAgICAgICAgICAgICAgICAgIGlzRXhpc3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhpc3RpbmdUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wYXJlKGV4aXN0aW5nVGFza3NbaV0sIGRlbGVnYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYW1lIGNhbGxiYWNrLCBzYW1lIGNhcHR1cmUsIHNhbWUgZXZlbnQgbmFtZSwganVzdCByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrcyA9IHRhcmdldFtzeW1ib2xFdmVudE5hbWVdID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2U7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RydWN0b3JOYW1lID0gdGFyZ2V0LmNvbnN0cnVjdG9yWyduYW1lJ107XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0U291cmNlID0gZ2xvYmFsU291cmNlc1tjb25zdHJ1Y3Rvck5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlID0gdGFyZ2V0U291cmNlW2V2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3Rvck5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNvdXJjZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEluIHRoZSBjb2RlIGJlbG93LCBgb3B0aW9uc2Agc2hvdWxkIG5vIGxvbmdlciBiZSByZWFzc2lnbmVkOyBpbnN0ZWFkLCBpdFxuICAgICAgICAgICAgICAgIC8vIHNob3VsZCBvbmx5IGJlIG11dGF0ZWQuIFRoaXMgaXMgYmVjYXVzZSB3ZSBwYXNzIHRoYXQgb2JqZWN0IHRvIHRoZSBuYXRpdmVcbiAgICAgICAgICAgICAgICAvLyBgYWRkRXZlbnRMaXN0ZW5lcmAuXG4gICAgICAgICAgICAgICAgLy8gSXQncyBnZW5lcmFsbHkgcmVjb21tZW5kZWQgdG8gdXNlIHRoZSBzYW1lIG9iamVjdCByZWZlcmVuY2UgZm9yIG9wdGlvbnMuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBlbnN1cmVzIGNvbnNpc3RlbmN5IGFuZCBhdm9pZHMgcG90ZW50aWFsIGlzc3Vlcy5cbiAgICAgICAgICAgICAgICB0YXNrRGF0YS5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHVzaW5nIGBhZGRFdmVudExpc3RlbmVyYCB3aXRoIHRoZSBgb25jZWAgb3B0aW9uLCB3ZSBkb24ndCBwYXNzXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBgb25jZWAgb3B0aW9uIGRpcmVjdGx5IHRvIHRoZSBuYXRpdmUgYGFkZEV2ZW50TGlzdGVuZXJgIG1ldGhvZC5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW5zdGVhZCwgd2Uga2VlcCB0aGUgYG9uY2VgIHNldHRpbmcgYW5kIGhhbmRsZSBpdCBvdXJzZWx2ZXMuXG4gICAgICAgICAgICAgICAgICAgIHRhc2tEYXRhLm9wdGlvbnMub25jZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXNrRGF0YS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgdGFza0RhdGEuY2FwdHVyZSA9IGNhcHR1cmU7XG4gICAgICAgICAgICAgICAgdGFza0RhdGEuZXZlbnROYW1lID0gZXZlbnROYW1lO1xuICAgICAgICAgICAgICAgIHRhc2tEYXRhLmlzRXhpc3RpbmcgPSBpc0V4aXN0aW5nO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB1c2VHbG9iYWxDYWxsYmFjayA/IE9QVElNSVpFRF9aT05FX0VWRU5UX1RBU0tfREFUQSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAvLyBrZWVwIHRhc2tEYXRhIGludG8gZGF0YSB0byBhbGxvdyBvblNjaGVkdWxlRXZlbnRUYXNrIHRvIGFjY2VzcyB0aGUgdGFzayBpbmZvcm1hdGlvblxuICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEudGFza0RhdGEgPSB0YXNrRGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNpZ25hbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHVzaW5nIGBhZGRFdmVudExpc3RlbmVyYCB3aXRoIHRoZSBgc2lnbmFsYCBvcHRpb24sIHdlIGRvbid0IHBhc3NcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGBzaWduYWxgIG9wdGlvbiBkaXJlY3RseSB0byB0aGUgbmF0aXZlIGBhZGRFdmVudExpc3RlbmVyYCBtZXRob2QuXG4gICAgICAgICAgICAgICAgICAgIC8vIEluc3RlYWQsIHdlIGtlZXAgdGhlIGBzaWduYWxgIHNldHRpbmcgYW5kIGhhbmRsZSBpdCBvdXJzZWx2ZXMuXG4gICAgICAgICAgICAgICAgICAgIHRhc2tEYXRhLm9wdGlvbnMuc2lnbmFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBUaGUgYHNjaGVkdWxlRXZlbnRUYXNrYCBmdW5jdGlvbiB3aWxsIHVsdGltYXRlbHkgY2FsbCBgY3VzdG9tU2NoZWR1bGVHbG9iYWxgLFxuICAgICAgICAgICAgICAgIC8vIHdoaWNoIGluIHR1cm4gY2FsbHMgdGhlIG5hdGl2ZSBgYWRkRXZlbnRMaXN0ZW5lcmAuIFRoaXMgaXMgd2h5IGB0YXNrRGF0YS5vcHRpb25zYFxuICAgICAgICAgICAgICAgIC8vIGlzIHVwZGF0ZWQgYmVmb3JlIHNjaGVkdWxpbmcgdGhlIHRhc2ssIGFzIGBjdXN0b21TY2hlZHVsZUdsb2JhbGAgdXNlc1xuICAgICAgICAgICAgICAgIC8vIGB0YXNrRGF0YS5vcHRpb25zYCB0byBwYXNzIGl0IHRvIHRoZSBuYXRpdmUgYGFkZEV2ZW50TGlzdGVuZXJgLlxuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSB6b25lLnNjaGVkdWxlRXZlbnRUYXNrKHNvdXJjZSwgZGVsZWdhdGUsIGRhdGEsIGN1c3RvbVNjaGVkdWxlRm4sIGN1c3RvbUNhbmNlbEZuKTtcbiAgICAgICAgICAgICAgICBpZiAoc2lnbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRhc2sgaXMgc2NoZWR1bGVkLCB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBzaWduYWwgYmFjayB0byB0YXNrLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgdGFza0RhdGEub3B0aW9ucy5zaWduYWwgPSBzaWduYWw7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdyYXBwaW5nIGB0YXNrYCBpbiBhIHdlYWsgcmVmZXJlbmNlIHdvdWxkIG5vdCBwcmV2ZW50IG1lbW9yeSBsZWFrcy4gV2VhayByZWZlcmVuY2VzIGFyZVxuICAgICAgICAgICAgICAgICAgICAvLyBwcmltYXJpbHkgdXNlZCBmb3IgcHJldmVudGluZyBzdHJvbmcgcmVmZXJlbmNlcyBjeWNsZXMuIGBvbkFib3J0YCBpcyBhbHdheXMgcmVhY2hhYmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFzIGl0J3MgYW4gZXZlbnQgbGlzdGVuZXIsIHNvIGl0cyBjbG9zdXJlIHJldGFpbnMgYSBzdHJvbmcgcmVmZXJlbmNlIHRvIHRoZSBgdGFza2AuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB0YXNrLnpvbmUuY2FuY2VsVGFzayh0YXNrKTtcbiAgICAgICAgICAgICAgICAgICAgbmF0aXZlTGlzdGVuZXIuY2FsbChzaWduYWwsICdhYm9ydCcsIG9uQWJvcnQsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byByZW1vdmUgdGhlIGBhYm9ydGAgbGlzdGVuZXIgd2hlbiB0aGUgZXZlbnQgbGlzdGVuZXIgaXMgZ29pbmcgdG8gYmUgcmVtb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgLy8gYXMgaXQgY3JlYXRlcyBhIGNsb3N1cmUgdGhhdCBjYXB0dXJlcyBgdGFza2AuIFRoaXMgY2xvc3VyZSByZXRhaW5zIGEgcmVmZXJlbmNlIHRvIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyBgdGFza2Agb2JqZWN0IGV2ZW4gYWZ0ZXIgaXQgZ29lcyBvdXQgb2Ygc2NvcGUsIHByZXZlbnRpbmcgYHRhc2tgIGZyb20gYmVpbmcgZ2FyYmFnZVxuICAgICAgICAgICAgICAgICAgICAvLyBjb2xsZWN0ZWQuXG4gICAgICAgICAgICAgICAgICAgIHRhc2sucmVtb3ZlQWJvcnRMaXN0ZW5lciA9ICgpID0+IHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgY2xlYXIgdGFza0RhdGEudGFyZ2V0IHRvIGF2b2lkIG1lbW9yeSBsZWFrXG4gICAgICAgICAgICAgICAgLy8gaXNzdWUsIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIwNDQyXG4gICAgICAgICAgICAgICAgdGFza0RhdGEudGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAvLyBuZWVkIHRvIGNsZWFyIHVwIHRhc2tEYXRhIGJlY2F1c2UgaXQgaXMgYSBnbG9iYWwgb2JqZWN0XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS50YXNrRGF0YSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGhhdmUgdG8gc2F2ZSB0aG9zZSBpbmZvcm1hdGlvbiB0byB0YXNrIGluIGNhc2VcbiAgICAgICAgICAgICAgICAvLyBhcHBsaWNhdGlvbiBtYXkgY2FsbCB0YXNrLnpvbmUuY2FuY2VsVGFzaygpIGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFza0RhdGEub3B0aW9ucy5vbmNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEoIXBhc3NpdmVTdXBwb3J0ZWQgJiYgdHlwZW9mIHRhc2sub3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBub3Qgc3VwcG9ydCBwYXNzaXZlLCBhbmQgd2UgcGFzcyBhbiBvcHRpb24gb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGFkZEV2ZW50TGlzdGVuZXIsIHdlIHNob3VsZCBzYXZlIHRoZSBvcHRpb25zIHRvIHRhc2tcbiAgICAgICAgICAgICAgICAgICAgdGFzay5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFzay50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgdGFzay5jYXB0dXJlID0gY2FwdHVyZTtcbiAgICAgICAgICAgICAgICB0YXNrLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoaXNIYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIG9yaWdpbmFsIGRlbGVnYXRlIGZvciBjb21wYXJlIHRvIGNoZWNrIGR1cGxpY2F0ZVxuICAgICAgICAgICAgICAgICAgICB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPSBkZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFwcmVwZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3MucHVzaCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3MudW5zaGlmdCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJldHVyblRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHByb3RvW0FERF9FVkVOVF9MSVNURU5FUl0gPSBtYWtlQWRkTGlzdGVuZXIobmF0aXZlQWRkRXZlbnRMaXN0ZW5lciwgQUREX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCwgcmV0dXJuVGFyZ2V0KTtcbiAgICAgICAgaWYgKG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBwcm90b1tQUkVQRU5EX0VWRU5UX0xJU1RFTkVSXSA9IG1ha2VBZGRMaXN0ZW5lcihuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lciwgUFJFUEVORF9FVkVOVF9MSVNURU5FUl9TT1VSQ0UsIGN1c3RvbVNjaGVkdWxlUHJlcGVuZCwgY3VzdG9tQ2FuY2VsLCByZXR1cm5UYXJnZXQsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RvW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IF9nbG9iYWw7XG4gICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBhcmd1bWVudHNbMl07XG4gICAgICAgICAgICBjb25zdCBjYXB0dXJlID0gIW9wdGlvbnMgPyBmYWxzZSA6IHR5cGVvZiBvcHRpb25zID09PSAnYm9vbGVhbicgPyB0cnVlIDogb3B0aW9ucy5jYXB0dXJlO1xuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWxpZGF0ZUhhbmRsZXIgJiZcbiAgICAgICAgICAgICAgICAhdmFsaWRhdGVIYW5kbGVyKG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIsIGRlbGVnYXRlLCB0YXJnZXQsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgICAgIGxldCBzeW1ib2xFdmVudE5hbWU7XG4gICAgICAgICAgICBpZiAoc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbY2FwdHVyZSA/IFRSVUVfU1RSIDogRkFMU0VfU1RSXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFza3MgPSBzeW1ib2xFdmVudE5hbWUgJiYgdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgICAgICAvLyBgZXhpc3RpbmdUYXNrc2AgbWF5IG5vdCBleGlzdCBpZiB0aGUgYGFkZEV2ZW50TGlzdGVuZXJgIHdhcyBjYWxsZWQgYmVmb3JlXG4gICAgICAgICAgICAvLyBpdCB3YXMgcGF0Y2hlZCBieSB6b25lLmpzLiBQbGVhc2UgcmVmZXIgdG8gdGhlIGF0dGFjaGVkIGlzc3VlIGZvclxuICAgICAgICAgICAgLy8gY2xhcmlmaWNhdGlvbiwgcGFydGljdWxhcmx5IGFmdGVyIHRoZSBgaWZgIGNvbmRpdGlvbiwgYmVmb3JlIGNhbGxpbmdcbiAgICAgICAgICAgIC8vIHRoZSBuYXRpdmUgYHJlbW92ZUV2ZW50TGlzdGVuZXJgLlxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdUYXNrID0gZXhpc3RpbmdUYXNrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUoZXhpc3RpbmdUYXNrLCBkZWxlZ2F0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGlzUmVtb3ZlZCB0byBkYXRhIGZvciBmYXN0ZXIgaW52b2tlVGFzayBjaGVja1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrLmlzUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGwgdGFza3MgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlIGhhdmUgZ29uZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgYW5kIHJlbW92ZSB0aGUgdGFzayBjYWNoZSBmcm9tIHRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFzay5hbGxSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW4gdGhlIHRhcmdldCwgd2UgaGF2ZSBhbiBldmVudCBsaXN0ZW5lciB3aGljaCBpcyBhZGRlZCBieSBvbl9wcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN1Y2ggYXMgdGFyZ2V0Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHt9LCBzbyB3ZSBuZWVkIHRvIGNsZWFyIHRoaXMgaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0eSB0b28gaWYgYWxsIGRlbGVnYXRlcyB3aXRoIGNhcHR1cmU9ZmFsc2Ugd2VyZSByZW1vdmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly8gZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzMxNjQzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvNTQ1ODFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNhcHR1cmUgJiYgdHlwZW9mIGV2ZW50TmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb25Qcm9wZXJ0eVN5bWJvbCA9IFpPTkVfU1lNQk9MX1BSRUZJWCArICdPTl9QUk9QRVJUWScgKyBldmVudE5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtvblByb3BlcnR5U3ltYm9sXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW4gYWxsIG90aGVyIGNvbmRpdGlvbnMsIHdoZW4gYGFkZEV2ZW50TGlzdGVuZXJgIGlzIGNhbGxlZCBhZnRlciBiZWluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGF0Y2hlZCBieSB6b25lLmpzLCB3ZSB3b3VsZCBhbHdheXMgZmluZCBhbiBldmVudCB0YXNrIG9uIHRoZSBgRXZlbnRUYXJnZXRgLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIHRyaWdnZXIgYGNhbmNlbEZuYCBvbiB0aGUgYGV4aXN0aW5nVGFza2AsIGxlYWRpbmcgdG8gYGN1c3RvbUNhbmNlbEdsb2JhbGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB1bHRpbWF0ZWx5IHJlbW92ZXMgYW4gZXZlbnQgbGlzdGVuZXIgYW5kIGNsZWFucyB1cCB0aGUgYWJvcnQgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIChpZiBhbiBgQWJvcnRTaWduYWxgIHdhcyBwcm92aWRlZCB3aGVuIHNjaGVkdWxpbmcgYSB0YXNrKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFzay56b25lLmNhbmNlbFRhc2soZXhpc3RpbmdUYXNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXR1cm5UYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvOTMwXG4gICAgICAgICAgICAvLyBXZSBtYXkgZW5jb3VudGVyIGEgc2l0dWF0aW9uIHdoZXJlIHRoZSBgYWRkRXZlbnRMaXN0ZW5lcmAgd2FzXG4gICAgICAgICAgICAvLyBjYWxsZWQgb24gdGhlIGV2ZW50IHRhcmdldCBiZWZvcmUgem9uZS5qcyBpcyBsb2FkZWQsIHJlc3VsdGluZ1xuICAgICAgICAgICAgLy8gaW4gbm8gdGFzayBiZWluZyBzdG9yZWQgb24gdGhlIGV2ZW50IHRhcmdldCBkdWUgdG8gaXRzIGludm9jYXRpb25cbiAgICAgICAgICAgIC8vIG9mIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24uIEluIHRoaXMgc2NlbmFyaW8sIHdlIHNpbXBseSBuZWVkIHRvXG4gICAgICAgICAgICAvLyBpbnZva2UgdGhlIG5hdGl2ZSBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAuXG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgICBwcm90b1tMSVNURU5FUlNfRVZFTlRfTElTVEVORVJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuICAgICAgICAgICAgbGV0IGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgZXZlbnROYW1lID0gcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKGV2ZW50TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHRhc2tzID0gZmluZEV2ZW50VGFza3ModGFyZ2V0LCBldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSB0YXNrc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgZGVsZWdhdGUgPSB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPyB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgOiB0YXNrLmNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5wdXNoKGRlbGVnYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lcnM7XG4gICAgICAgIH07XG4gICAgICAgIHByb3RvW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgfHwgX2dsb2JhbDtcbiAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBpZiAoIWV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9wID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBFVkVOVF9OQU1FX1NZTUJPTF9SRUdYLmV4ZWMocHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBldnROYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgICAgIC8vIGluIG5vZGVqcyBFdmVudEVtaXR0ZXIsIHJlbW92ZUxpc3RlbmVyIGV2ZW50IGlzXG4gICAgICAgICAgICAgICAgICAgIC8vIHVzZWQgZm9yIG1vbml0b3JpbmcgdGhlIHJlbW92ZUxpc3RlbmVyIGNhbGwsXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvIGp1c3Qga2VlcCByZW1vdmVMaXN0ZW5lciBldmVudExpc3RlbmVyIHVudGlsXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsbCBvdGhlciBldmVudExpc3RlbmVycyBhcmUgcmVtb3ZlZFxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZ0TmFtZSAmJiBldnROYW1lICE9PSAncmVtb3ZlTGlzdGVuZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRoaXMsIGV2dE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSByZW1vdmVMaXN0ZW5lciBsaXN0ZW5lciBmaW5hbGx5XG4gICAgICAgICAgICAgICAgdGhpc1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCAncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IHBhdGNoT3B0aW9ucy50cmFuc2ZlckV2ZW50TmFtZShldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW0ZBTFNFX1NUUl07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN5bWJvbENhcHR1cmVFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW1RSVUVfU1RSXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFza3MgPSB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FwdHVyZVRhc2tzID0gdGFyZ2V0W3N5bWJvbENhcHR1cmVFdmVudE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZVRhc2tzID0gdGFza3Muc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3ZlVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gcmVtb3ZlVGFza3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlbGVnYXRlID0gdGFzay5vcmlnaW5hbERlbGVnYXRlID8gdGFzay5vcmlnaW5hbERlbGVnYXRlIDogdGFzay5jYWxsYmFjaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCBldmVudE5hbWUsIGRlbGVnYXRlLCB0YXNrLm9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXB0dXJlVGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZVRhc2tzID0gY2FwdHVyZVRhc2tzLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbW92ZVRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHJlbW92ZVRhc2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tSRU1PVkVfRVZFTlRfTElTVEVORVJdLmNhbGwodGhpcywgZXZlbnROYW1lLCBkZWxlZ2F0ZSwgdGFzay5vcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXR1cm5UYXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gZm9yIG5hdGl2ZSB0b1N0cmluZyBwYXRjaFxuICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bQUREX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlQWRkRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tSRU1PVkVfRVZFTlRfTElTVEVORVJdLCBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyKTtcbiAgICAgICAgaWYgKG5hdGl2ZVJlbW92ZUFsbExpc3RlbmVycykge1xuICAgICAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlUmVtb3ZlQWxsTGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmF0aXZlTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlTGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFwaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0c1tpXSA9IHBhdGNoRXZlbnRUYXJnZXRNZXRob2RzKGFwaXNbaV0sIHBhdGNoT3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xufVxuZnVuY3Rpb24gZmluZEV2ZW50VGFza3ModGFyZ2V0LCBldmVudE5hbWUpIHtcbiAgICBpZiAoIWV2ZW50TmFtZSkge1xuICAgICAgICBjb25zdCBmb3VuZFRhc2tzID0gW107XG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IEVWRU5UX05BTUVfU1lNQk9MX1JFR1guZXhlYyhwcm9wKTtcbiAgICAgICAgICAgIGxldCBldnROYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV07XG4gICAgICAgICAgICBpZiAoZXZ0TmFtZSAmJiAoIWV2ZW50TmFtZSB8fCBldnROYW1lID09PSBldmVudE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFza3MgPSB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKHRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kVGFza3MucHVzaCh0YXNrc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvdW5kVGFza3M7XG4gICAgfVxuICAgIGxldCBzeW1ib2xFdmVudE5hbWUgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgIGlmICghc3ltYm9sRXZlbnROYW1lKSB7XG4gICAgICAgIHByZXBhcmVFdmVudE5hbWVzKGV2ZW50TmFtZSk7XG4gICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgfVxuICAgIGNvbnN0IGNhcHR1cmVGYWxzZVRhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZVtGQUxTRV9TVFJdXTtcbiAgICBjb25zdCBjYXB0dXJlVHJ1ZVRhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZVtUUlVFX1NUUl1dO1xuICAgIGlmICghY2FwdHVyZUZhbHNlVGFza3MpIHtcbiAgICAgICAgcmV0dXJuIGNhcHR1cmVUcnVlVGFza3MgPyBjYXB0dXJlVHJ1ZVRhc2tzLnNsaWNlKCkgOiBbXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBjYXB0dXJlVHJ1ZVRhc2tzXG4gICAgICAgICAgICA/IGNhcHR1cmVGYWxzZVRhc2tzLmNvbmNhdChjYXB0dXJlVHJ1ZVRhc2tzKVxuICAgICAgICAgICAgOiBjYXB0dXJlRmFsc2VUYXNrcy5zbGljZSgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHBhdGNoRXZlbnRQcm90b3R5cGUoZ2xvYmFsLCBhcGkpIHtcbiAgICBjb25zdCBFdmVudCA9IGdsb2JhbFsnRXZlbnQnXTtcbiAgICBpZiAoRXZlbnQgJiYgRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICAgIGFwaS5wYXRjaE1ldGhvZChFdmVudC5wcm90b3R5cGUsICdzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24nLCAoZGVsZWdhdGUpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBzZWxmW0lNTUVESUFURV9QUk9QQUdBVElPTl9TWU1CT0xdID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gY2FsbCB0aGUgbmF0aXZlIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblxuICAgICAgICAgICAgLy8gaW4gY2FzZSBpbiBzb21lIGh5YnJpZCBhcHBsaWNhdGlvbiwgc29tZSBwYXJ0IG9mXG4gICAgICAgICAgICAvLyBhcHBsaWNhdGlvbiB3aWxsIGJlIGNvbnRyb2xsZWQgYnkgem9uZSwgc29tZSBhcmUgbm90XG4gICAgICAgICAgICBkZWxlZ2F0ZSAmJiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7bWlzc2luZ1JlcXVpcmV9XG4gKi9cbmZ1bmN0aW9uIHBhdGNoUXVldWVNaWNyb3Rhc2soZ2xvYmFsLCBhcGkpIHtcbiAgICBhcGkucGF0Y2hNZXRob2QoZ2xvYmFsLCAncXVldWVNaWNyb3Rhc2snLCAoZGVsZWdhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBab25lLmN1cnJlbnQuc2NoZWR1bGVNaWNyb1Rhc2soJ3F1ZXVlTWljcm90YXNrJywgYXJnc1swXSk7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xuY29uc3QgdGFza1N5bWJvbCA9IHpvbmVTeW1ib2woJ3pvbmVUYXNrJyk7XG5mdW5jdGlvbiBwYXRjaFRpbWVyKHdpbmRvdywgc2V0TmFtZSwgY2FuY2VsTmFtZSwgbmFtZVN1ZmZpeCkge1xuICAgIGxldCBzZXROYXRpdmUgPSBudWxsO1xuICAgIGxldCBjbGVhck5hdGl2ZSA9IG51bGw7XG4gICAgc2V0TmFtZSArPSBuYW1lU3VmZml4O1xuICAgIGNhbmNlbE5hbWUgKz0gbmFtZVN1ZmZpeDtcbiAgICBjb25zdCB0YXNrc0J5SGFuZGxlSWQgPSB7fTtcbiAgICBmdW5jdGlvbiBzY2hlZHVsZVRhc2sodGFzaykge1xuICAgICAgICBjb25zdCBkYXRhID0gdGFzay5kYXRhO1xuICAgICAgICBkYXRhLmFyZ3NbMF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFzay5pbnZva2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaGFuZGxlT3JJZCA9IHNldE5hdGl2ZS5hcHBseSh3aW5kb3csIGRhdGEuYXJncyk7XG4gICAgICAgIC8vIFdobGlzdCBvbiBOb2RlLmpzIHdoZW4gZ2V0IGNhbiB0aGUgSUQgYnkgdXNpbmcgYFtTeW1ib2wudG9QcmltaXRpdmVdKClgIHdlIGRvXG4gICAgICAgIC8vIHRvIHRoaXMgc28gdGhhdCB3ZSBkbyBub3QgY2F1c2UgcG90ZW50YWxseSBsZWFrcyB3aGVuIHVzaW5nIGBzZXRUaW1lb3V0YFxuICAgICAgICAvLyBzaW5jZSB0aGlzIGNhbiBiZSBwZXJpb2RpYyB3aGVuIHVzaW5nIGAucmVmcmVzaGAuXG4gICAgICAgIGlmIChpc051bWJlcihoYW5kbGVPcklkKSkge1xuICAgICAgICAgICAgZGF0YS5oYW5kbGVJZCA9IGhhbmRsZU9ySWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkYXRhLmhhbmRsZSA9IGhhbmRsZU9ySWQ7XG4gICAgICAgICAgICAvLyBPbiBOb2RlLmpzIGEgdGltZW91dCBhbmQgaW50ZXJ2YWwgY2FuIGJlIHJlc3RhcnRlZCBvdmVyIGFuZCBvdmVyIGFnYWluIGJ5IHVzaW5nIHRoZSBgLnJlZnJlc2hgIG1ldGhvZC5cbiAgICAgICAgICAgIGRhdGEuaXNSZWZyZXNoYWJsZSA9IGlzRnVuY3Rpb24oaGFuZGxlT3JJZC5yZWZyZXNoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFzaztcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYXJUYXNrKHRhc2spIHtcbiAgICAgICAgY29uc3QgeyBoYW5kbGUsIGhhbmRsZUlkIH0gPSB0YXNrLmRhdGE7XG4gICAgICAgIHJldHVybiBjbGVhck5hdGl2ZS5jYWxsKHdpbmRvdywgaGFuZGxlID8/IGhhbmRsZUlkKTtcbiAgICB9XG4gICAgc2V0TmF0aXZlID0gcGF0Y2hNZXRob2Qod2luZG93LCBzZXROYW1lLCAoZGVsZWdhdGUpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGFyZ3NbMF0pKSB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGlzUmVmcmVzaGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzUGVyaW9kaWM6IG5hbWVTdWZmaXggPT09ICdJbnRlcnZhbCcsXG4gICAgICAgICAgICAgICAgZGVsYXk6IG5hbWVTdWZmaXggPT09ICdUaW1lb3V0JyB8fCBuYW1lU3VmZml4ID09PSAnSW50ZXJ2YWwnID8gYXJnc1sxXSB8fCAwIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBhcmdzWzBdO1xuICAgICAgICAgICAgYXJnc1swXSA9IGZ1bmN0aW9uIHRpbWVyKCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaXNzdWUtOTM0LCB0YXNrIHdpbGwgYmUgY2FuY2VsbGVkXG4gICAgICAgICAgICAgICAgICAgIC8vIGV2ZW4gaXQgaXMgYSBwZXJpb2RpYyB0YXNrIHN1Y2ggYXNcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW50ZXJ2YWxcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvNDAzODdcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYW51cCB0YXNrc0J5SGFuZGxlSWQgc2hvdWxkIGJlIGhhbmRsZWQgYmVmb3JlIHNjaGVkdWxlVGFza1xuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSBzb21lIHpvbmVTcGVjIG1heSBpbnRlcmNlcHQgYW5kIGRvZXNuJ3QgdHJpZ2dlclxuICAgICAgICAgICAgICAgICAgICAvLyBzY2hlZHVsZUZuKHNjaGVkdWxlVGFzaykgcHJvdmlkZWQgaGVyZS5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBoYW5kbGUsIGhhbmRsZUlkLCBpc1BlcmlvZGljLCBpc1JlZnJlc2hhYmxlIH0gPSBvcHRpb25zO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUGVyaW9kaWMgJiYgIWlzUmVmcmVzaGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluIG5vbi1ub2RlanMgZW52LCB3ZSByZW1vdmUgdGltZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb20gbG9jYWwgY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZUlkW2hhbmRsZUlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vZGUgcmV0dXJucyBjb21wbGV4IG9iamVjdHMgYXMgaGFuZGxlSWRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgcmVtb3ZlIHRhc2sgcmVmZXJlbmNlIGZyb20gdGltZXIgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlW3Rhc2tTeW1ib2xdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCB0YXNrID0gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUoc2V0TmFtZSwgYXJnc1swXSwgb3B0aW9ucywgc2NoZWR1bGVUYXNrLCBjbGVhclRhc2spO1xuICAgICAgICAgICAgaWYgKCF0YXNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBOb2RlLmpzIG11c3QgYWRkaXRpb25hbGx5IHN1cHBvcnQgdGhlIHJlZiBhbmQgdW5yZWYgZnVuY3Rpb25zLlxuICAgICAgICAgICAgY29uc3QgeyBoYW5kbGVJZCwgaGFuZGxlLCBpc1JlZnJlc2hhYmxlLCBpc1BlcmlvZGljIH0gPSB0YXNrLmRhdGE7XG4gICAgICAgICAgICBpZiAoaGFuZGxlSWQpIHtcbiAgICAgICAgICAgICAgICAvLyBmb3Igbm9uIG5vZGVqcyBlbnYsIHdlIHNhdmUgaGFuZGxlSWQ6IHRhc2tcbiAgICAgICAgICAgICAgICAvLyBtYXBwaW5nIGluIGxvY2FsIGNhY2hlIGZvciBjbGVhclRpbWVvdXRcbiAgICAgICAgICAgICAgICB0YXNrc0J5SGFuZGxlSWRbaGFuZGxlSWRdID0gdGFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGhhbmRsZSkge1xuICAgICAgICAgICAgICAgIC8vIGZvciBub2RlanMgZW52LCB3ZSBzYXZlIHRhc2tcbiAgICAgICAgICAgICAgICAvLyByZWZlcmVuY2UgaW4gdGltZXJJZCBPYmplY3QgZm9yIGNsZWFyVGltZW91dFxuICAgICAgICAgICAgICAgIGhhbmRsZVt0YXNrU3ltYm9sXSA9IHRhc2s7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVmcmVzaGFibGUgJiYgIWlzUGVyaW9kaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxSZWZyZXNoID0gaGFuZGxlLnJlZnJlc2g7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB6b25lLCBzdGF0ZSB9ID0gdGFzaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ25vdFNjaGVkdWxlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLl9zdGF0ZSA9ICdzY2hlZHVsZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpvbmUuX3VwZGF0ZVRhc2tDb3VudCh0YXNrLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHN0YXRlID09PSAncnVubmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLl9zdGF0ZSA9ICdzY2hlZHVsaW5nJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbFJlZnJlc2guY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlID8/IGhhbmRsZUlkID8/IHRhc2s7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBjYXVzZSBhbiBlcnJvciBieSBjYWxsaW5nIGl0IGRpcmVjdGx5LlxuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHdpbmRvdywgYXJncyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjbGVhck5hdGl2ZSA9IHBhdGNoTWV0aG9kKHdpbmRvdywgY2FuY2VsTmFtZSwgKGRlbGVnYXRlKSA9PiBmdW5jdGlvbiAoc2VsZiwgYXJncykge1xuICAgICAgICBjb25zdCBpZCA9IGFyZ3NbMF07XG4gICAgICAgIGxldCB0YXNrO1xuICAgICAgICBpZiAoaXNOdW1iZXIoaWQpKSB7XG4gICAgICAgICAgICAvLyBub24gbm9kZWpzIGVudi5cbiAgICAgICAgICAgIHRhc2sgPSB0YXNrc0J5SGFuZGxlSWRbaWRdO1xuICAgICAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVJZFtpZF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBub2RlanMgZW52ID8/IG90aGVyIGVudmlyb25tZW50cy5cbiAgICAgICAgICAgIHRhc2sgPSBpZD8uW3Rhc2tTeW1ib2xdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBpZFt0YXNrU3ltYm9sXSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXNrID0gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhc2s/LnR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0YXNrLmNhbmNlbEZuKSB7XG4gICAgICAgICAgICAgICAgLy8gRG8gbm90IGNhbmNlbCBhbHJlYWR5IGNhbmNlbGVkIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgIHRhc2suem9uZS5jYW5jZWxUYXNrKHRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gY2F1c2UgYW4gZXJyb3IgYnkgY2FsbGluZyBpdCBkaXJlY3RseS5cbiAgICAgICAgICAgIGRlbGVnYXRlLmFwcGx5KHdpbmRvdywgYXJncyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcGF0Y2hDdXN0b21FbGVtZW50cyhfZ2xvYmFsLCBhcGkpIHtcbiAgICBjb25zdCB7IGlzQnJvd3NlciwgaXNNaXggfSA9IGFwaS5nZXRHbG9iYWxPYmplY3RzKCk7XG4gICAgaWYgKCghaXNCcm93c2VyICYmICFpc01peCkgfHwgIV9nbG9iYWxbJ2N1c3RvbUVsZW1lbnRzJ10gfHwgISgnY3VzdG9tRWxlbWVudHMnIGluIF9nbG9iYWwpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvY3VzdG9tLWVsZW1lbnRzLmh0bWwjY29uY2VwdC1jdXN0b20tZWxlbWVudC1kZWZpbml0aW9uLWxpZmVjeWNsZS1jYWxsYmFja3NcbiAgICBjb25zdCBjYWxsYmFja3MgPSBbXG4gICAgICAgICdjb25uZWN0ZWRDYWxsYmFjaycsXG4gICAgICAgICdkaXNjb25uZWN0ZWRDYWxsYmFjaycsXG4gICAgICAgICdhZG9wdGVkQ2FsbGJhY2snLFxuICAgICAgICAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyxcbiAgICAgICAgJ2Zvcm1Bc3NvY2lhdGVkQ2FsbGJhY2snLFxuICAgICAgICAnZm9ybURpc2FibGVkQ2FsbGJhY2snLFxuICAgICAgICAnZm9ybVJlc2V0Q2FsbGJhY2snLFxuICAgICAgICAnZm9ybVN0YXRlUmVzdG9yZUNhbGxiYWNrJyxcbiAgICBdO1xuICAgIGFwaS5wYXRjaENhbGxiYWNrcyhhcGksIF9nbG9iYWwuY3VzdG9tRWxlbWVudHMsICdjdXN0b21FbGVtZW50cycsICdkZWZpbmUnLCBjYWxsYmFja3MpO1xufVxuXG5mdW5jdGlvbiBldmVudFRhcmdldFBhdGNoKF9nbG9iYWwsIGFwaSkge1xuICAgIGlmIChab25lW2FwaS5zeW1ib2woJ3BhdGNoRXZlbnRUYXJnZXQnKV0pIHtcbiAgICAgICAgLy8gRXZlbnRUYXJnZXQgaXMgYWxyZWFkeSBwYXRjaGVkLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHsgZXZlbnROYW1lcywgem9uZVN5bWJvbEV2ZW50TmFtZXMsIFRSVUVfU1RSLCBGQUxTRV9TVFIsIFpPTkVfU1lNQk9MX1BSRUZJWCB9ID0gYXBpLmdldEdsb2JhbE9iamVjdHMoKTtcbiAgICAvLyAgcHJlZGVmaW5lIGFsbCBfX3pvbmVfc3ltYm9sX18gKyBldmVudE5hbWUgKyB0cnVlL2ZhbHNlIHN0cmluZ1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBldmVudE5hbWUgPSBldmVudE5hbWVzW2ldO1xuICAgICAgICBjb25zdCBmYWxzZUV2ZW50TmFtZSA9IGV2ZW50TmFtZSArIEZBTFNFX1NUUjtcbiAgICAgICAgY29uc3QgdHJ1ZUV2ZW50TmFtZSA9IGV2ZW50TmFtZSArIFRSVUVfU1RSO1xuICAgICAgICBjb25zdCBzeW1ib2wgPSBaT05FX1NZTUJPTF9QUkVGSVggKyBmYWxzZUV2ZW50TmFtZTtcbiAgICAgICAgY29uc3Qgc3ltYm9sQ2FwdHVyZSA9IFpPTkVfU1lNQk9MX1BSRUZJWCArIHRydWVFdmVudE5hbWU7XG4gICAgICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV0gPSB7fTtcbiAgICAgICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXVtGQUxTRV9TVFJdID0gc3ltYm9sO1xuICAgICAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdW1RSVUVfU1RSXSA9IHN5bWJvbENhcHR1cmU7XG4gICAgfVxuICAgIGNvbnN0IEVWRU5UX1RBUkdFVCA9IF9nbG9iYWxbJ0V2ZW50VGFyZ2V0J107XG4gICAgaWYgKCFFVkVOVF9UQVJHRVQgfHwgIUVWRU5UX1RBUkdFVC5wcm90b3R5cGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhcGkucGF0Y2hFdmVudFRhcmdldChfZ2xvYmFsLCBhcGksIFtFVkVOVF9UQVJHRVQgJiYgRVZFTlRfVEFSR0VULnByb3RvdHlwZV0pO1xuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gcGF0Y2hFdmVudChnbG9iYWwsIGFwaSkge1xuICAgIGFwaS5wYXRjaEV2ZW50UHJvdG90eXBlKGdsb2JhbCwgYXBpKTtcbn1cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge2dsb2JhbFRoaXN9XG4gKi9cbmZ1bmN0aW9uIGZpbHRlclByb3BlcnRpZXModGFyZ2V0LCBvblByb3BlcnRpZXMsIGlnbm9yZVByb3BlcnRpZXMpIHtcbiAgICBpZiAoIWlnbm9yZVByb3BlcnRpZXMgfHwgaWdub3JlUHJvcGVydGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9uUHJvcGVydGllcztcbiAgICB9XG4gICAgY29uc3QgdGlwID0gaWdub3JlUHJvcGVydGllcy5maWx0ZXIoKGlwKSA9PiBpcC50YXJnZXQgPT09IHRhcmdldCk7XG4gICAgaWYgKCF0aXAgfHwgdGlwLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb25Qcm9wZXJ0aWVzO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRJZ25vcmVQcm9wZXJ0aWVzID0gdGlwWzBdLmlnbm9yZVByb3BlcnRpZXM7XG4gICAgcmV0dXJuIG9uUHJvcGVydGllcy5maWx0ZXIoKG9wKSA9PiB0YXJnZXRJZ25vcmVQcm9wZXJ0aWVzLmluZGV4T2Yob3ApID09PSAtMSk7XG59XG5mdW5jdGlvbiBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyh0YXJnZXQsIG9uUHJvcGVydGllcywgaWdub3JlUHJvcGVydGllcywgcHJvdG90eXBlKSB7XG4gICAgLy8gY2hlY2sgd2hldGhlciB0YXJnZXQgaXMgYXZhaWxhYmxlLCBzb21ldGltZXMgdGFyZ2V0IHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgLy8gYmVjYXVzZSBkaWZmZXJlbnQgYnJvd3NlciBvciBzb21lIDNyZCBwYXJ0eSBwbHVnaW4uXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmaWx0ZXJlZFByb3BlcnRpZXMgPSBmaWx0ZXJQcm9wZXJ0aWVzKHRhcmdldCwgb25Qcm9wZXJ0aWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICBwYXRjaE9uUHJvcGVydGllcyh0YXJnZXQsIGZpbHRlcmVkUHJvcGVydGllcywgcHJvdG90eXBlKTtcbn1cbi8qKlxuICogR2V0IGFsbCBldmVudCBuYW1lIHByb3BlcnRpZXMgd2hpY2ggdGhlIGV2ZW50IG5hbWUgc3RhcnRzV2l0aCBgb25gXG4gKiBmcm9tIHRoZSB0YXJnZXQgb2JqZWN0IGl0c2VsZiwgaW5oZXJpdGVkIHByb3BlcnRpZXMgYXJlIG5vdCBjb25zaWRlcmVkLlxuICovXG5mdW5jdGlvbiBnZXRPbkV2ZW50TmFtZXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldClcbiAgICAgICAgLmZpbHRlcigobmFtZSkgPT4gbmFtZS5zdGFydHNXaXRoKCdvbicpICYmIG5hbWUubGVuZ3RoID4gMilcbiAgICAgICAgLm1hcCgobmFtZSkgPT4gbmFtZS5zdWJzdHJpbmcoMikpO1xufVxuZnVuY3Rpb24gcHJvcGVydHlEZXNjcmlwdG9yUGF0Y2goYXBpLCBfZ2xvYmFsKSB7XG4gICAgaWYgKGlzTm9kZSAmJiAhaXNNaXgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoWm9uZVthcGkuc3ltYm9sKCdwYXRjaEV2ZW50cycpXSkge1xuICAgICAgICAvLyBldmVudHMgYXJlIGFscmVhZHkgYmVlbiBwYXRjaGVkIGJ5IGxlZ2FjeSBwYXRjaC5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpZ25vcmVQcm9wZXJ0aWVzID0gX2dsb2JhbFsnX19ab25lX2lnbm9yZV9vbl9wcm9wZXJ0aWVzJ107XG4gICAgLy8gZm9yIGJyb3dzZXJzIHRoYXQgd2UgY2FuIHBhdGNoIHRoZSBkZXNjcmlwdG9yOiAgQ2hyb21lICYgRmlyZWZveFxuICAgIGxldCBwYXRjaFRhcmdldHMgPSBbXTtcbiAgICBpZiAoaXNCcm93c2VyKSB7XG4gICAgICAgIGNvbnN0IGludGVybmFsV2luZG93ID0gd2luZG93O1xuICAgICAgICBwYXRjaFRhcmdldHMgPSBwYXRjaFRhcmdldHMuY29uY2F0KFtcbiAgICAgICAgICAgICdEb2N1bWVudCcsXG4gICAgICAgICAgICAnU1ZHRWxlbWVudCcsXG4gICAgICAgICAgICAnRWxlbWVudCcsXG4gICAgICAgICAgICAnSFRNTEVsZW1lbnQnLFxuICAgICAgICAgICAgJ0hUTUxCb2R5RWxlbWVudCcsXG4gICAgICAgICAgICAnSFRNTE1lZGlhRWxlbWVudCcsXG4gICAgICAgICAgICAnSFRNTEZyYW1lU2V0RWxlbWVudCcsXG4gICAgICAgICAgICAnSFRNTEZyYW1lRWxlbWVudCcsXG4gICAgICAgICAgICAnSFRNTElGcmFtZUVsZW1lbnQnLFxuICAgICAgICAgICAgJ0hUTUxNYXJxdWVlRWxlbWVudCcsXG4gICAgICAgICAgICAnV29ya2VyJyxcbiAgICAgICAgXSk7XG4gICAgICAgIGNvbnN0IGlnbm9yZUVycm9yUHJvcGVydGllcyA9IGlzSUUoKVxuICAgICAgICAgICAgPyBbeyB0YXJnZXQ6IGludGVybmFsV2luZG93LCBpZ25vcmVQcm9wZXJ0aWVzOiBbJ2Vycm9yJ10gfV1cbiAgICAgICAgICAgIDogW107XG4gICAgICAgIC8vIGluIElFL0VkZ2UsIG9uUHJvcCBub3QgZXhpc3QgaW4gd2luZG93IG9iamVjdCwgYnV0IGluIFdpbmRvd1Byb3RvdHlwZVxuICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIHBhc3MgV2luZG93UHJvdG90eXBlIHRvIGNoZWNrIG9uUHJvcCBleGlzdCBvciBub3RcbiAgICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoaW50ZXJuYWxXaW5kb3csIGdldE9uRXZlbnROYW1lcyhpbnRlcm5hbFdpbmRvdyksIGlnbm9yZVByb3BlcnRpZXMgPyBpZ25vcmVQcm9wZXJ0aWVzLmNvbmNhdChpZ25vcmVFcnJvclByb3BlcnRpZXMpIDogaWdub3JlUHJvcGVydGllcywgT2JqZWN0R2V0UHJvdG90eXBlT2YoaW50ZXJuYWxXaW5kb3cpKTtcbiAgICB9XG4gICAgcGF0Y2hUYXJnZXRzID0gcGF0Y2hUYXJnZXRzLmNvbmNhdChbXG4gICAgICAgICdYTUxIdHRwUmVxdWVzdCcsXG4gICAgICAgICdYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0JyxcbiAgICAgICAgJ0lEQkluZGV4JyxcbiAgICAgICAgJ0lEQlJlcXVlc3QnLFxuICAgICAgICAnSURCT3BlbkRCUmVxdWVzdCcsXG4gICAgICAgICdJREJEYXRhYmFzZScsXG4gICAgICAgICdJREJUcmFuc2FjdGlvbicsXG4gICAgICAgICdJREJDdXJzb3InLFxuICAgICAgICAnV2ViU29ja2V0JyxcbiAgICBdKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGNoVGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBfZ2xvYmFsW3BhdGNoVGFyZ2V0c1tpXV07XG4gICAgICAgIHRhcmdldCAmJlxuICAgICAgICAgICAgdGFyZ2V0LnByb3RvdHlwZSAmJlxuICAgICAgICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXModGFyZ2V0LnByb3RvdHlwZSwgZ2V0T25FdmVudE5hbWVzKHRhcmdldC5wcm90b3R5cGUpLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICB9XG59XG5cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xuZnVuY3Rpb24gcGF0Y2hCcm93c2VyKFpvbmUpIHtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgnbGVnYWN5JywgKGdsb2JhbCkgPT4ge1xuICAgICAgICBjb25zdCBsZWdhY3lQYXRjaCA9IGdsb2JhbFtab25lLl9fc3ltYm9sX18oJ2xlZ2FjeVBhdGNoJyldO1xuICAgICAgICBpZiAobGVnYWN5UGF0Y2gpIHtcbiAgICAgICAgICAgIGxlZ2FjeVBhdGNoKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgndGltZXJzJywgKGdsb2JhbCkgPT4ge1xuICAgICAgICBjb25zdCBzZXQgPSAnc2V0JztcbiAgICAgICAgY29uc3QgY2xlYXIgPSAnY2xlYXInO1xuICAgICAgICBwYXRjaFRpbWVyKGdsb2JhbCwgc2V0LCBjbGVhciwgJ1RpbWVvdXQnKTtcbiAgICAgICAgcGF0Y2hUaW1lcihnbG9iYWwsIHNldCwgY2xlYXIsICdJbnRlcnZhbCcpO1xuICAgICAgICBwYXRjaFRpbWVyKGdsb2JhbCwgc2V0LCBjbGVhciwgJ0ltbWVkaWF0ZScpO1xuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnLCAoZ2xvYmFsKSA9PiB7XG4gICAgICAgIHBhdGNoVGltZXIoZ2xvYmFsLCAncmVxdWVzdCcsICdjYW5jZWwnLCAnQW5pbWF0aW9uRnJhbWUnKTtcbiAgICAgICAgcGF0Y2hUaW1lcihnbG9iYWwsICdtb3pSZXF1ZXN0JywgJ21vekNhbmNlbCcsICdBbmltYXRpb25GcmFtZScpO1xuICAgICAgICBwYXRjaFRpbWVyKGdsb2JhbCwgJ3dlYmtpdFJlcXVlc3QnLCAnd2Via2l0Q2FuY2VsJywgJ0FuaW1hdGlvbkZyYW1lJyk7XG4gICAgfSk7XG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ2Jsb2NraW5nJywgKGdsb2JhbCwgWm9uZSkgPT4ge1xuICAgICAgICBjb25zdCBibG9ja2luZ01ldGhvZHMgPSBbJ2FsZXJ0JywgJ3Byb21wdCcsICdjb25maXJtJ107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tpbmdNZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gYmxvY2tpbmdNZXRob2RzW2ldO1xuICAgICAgICAgICAgcGF0Y2hNZXRob2QoZ2xvYmFsLCBuYW1lLCAoZGVsZWdhdGUsIHN5bWJvbCwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAocywgYXJncykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWm9uZS5jdXJyZW50LnJ1bihkZWxlZ2F0ZSwgZ2xvYmFsLCBhcmdzLCBuYW1lKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgnRXZlbnRUYXJnZXQnLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICAgICAgcGF0Y2hFdmVudChnbG9iYWwsIGFwaSk7XG4gICAgICAgIGV2ZW50VGFyZ2V0UGF0Y2goZ2xvYmFsLCBhcGkpO1xuICAgICAgICAvLyBwYXRjaCBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0J3MgYWRkRXZlbnRMaXN0ZW5lci9yZW1vdmVFdmVudExpc3RlbmVyXG4gICAgICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQgPSBnbG9iYWxbJ1hNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQnXTtcbiAgICAgICAgaWYgKFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQgJiYgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIGFwaS5wYXRjaEV2ZW50VGFyZ2V0KGdsb2JhbCwgYXBpLCBbWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldC5wcm90b3R5cGVdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdNdXRhdGlvbk9ic2VydmVyJywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgICAgIHBhdGNoQ2xhc3MoJ011dGF0aW9uT2JzZXJ2ZXInKTtcbiAgICAgICAgcGF0Y2hDbGFzcygnV2ViS2l0TXV0YXRpb25PYnNlcnZlcicpO1xuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgICAgICBwYXRjaENsYXNzKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicpO1xuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdGaWxlUmVhZGVyJywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgICAgIHBhdGNoQ2xhc3MoJ0ZpbGVSZWFkZXInKTtcbiAgICB9KTtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgnb25fcHJvcGVydHknLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICAgICAgcHJvcGVydHlEZXNjcmlwdG9yUGF0Y2goYXBpLCBnbG9iYWwpO1xuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdjdXN0b21FbGVtZW50cycsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgICAgICBwYXRjaEN1c3RvbUVsZW1lbnRzKGdsb2JhbCwgYXBpKTtcbiAgICB9KTtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgnWEhSJywgKGdsb2JhbCwgWm9uZSkgPT4ge1xuICAgICAgICAvLyBUcmVhdCBYTUxIdHRwUmVxdWVzdCBhcyBhIG1hY3JvdGFzay5cbiAgICAgICAgcGF0Y2hYSFIoZ2xvYmFsKTtcbiAgICAgICAgY29uc3QgWEhSX1RBU0sgPSB6b25lU3ltYm9sKCd4aHJUYXNrJyk7XG4gICAgICAgIGNvbnN0IFhIUl9TWU5DID0gem9uZVN5bWJvbCgneGhyU3luYycpO1xuICAgICAgICBjb25zdCBYSFJfTElTVEVORVIgPSB6b25lU3ltYm9sKCd4aHJMaXN0ZW5lcicpO1xuICAgICAgICBjb25zdCBYSFJfU0NIRURVTEVEID0gem9uZVN5bWJvbCgneGhyU2NoZWR1bGVkJyk7XG4gICAgICAgIGNvbnN0IFhIUl9VUkwgPSB6b25lU3ltYm9sKCd4aHJVUkwnKTtcbiAgICAgICAgY29uc3QgWEhSX0VSUk9SX0JFRk9SRV9TQ0hFRFVMRUQgPSB6b25lU3ltYm9sKCd4aHJFcnJvckJlZm9yZVNjaGVkdWxlZCcpO1xuICAgICAgICBmdW5jdGlvbiBwYXRjaFhIUih3aW5kb3cpIHtcbiAgICAgICAgICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0ID0gd2luZG93WydYTUxIdHRwUmVxdWVzdCddO1xuICAgICAgICAgICAgaWYgKCFYTUxIdHRwUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgIC8vIFhNTEh0dHBSZXF1ZXN0IGlzIG5vdCBhdmFpbGFibGUgaW4gc2VydmljZSB3b3JrZXJcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSA9IFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmRQZW5kaW5nVGFzayh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W1hIUl9UQVNLXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBvcmlBZGRMaXN0ZW5lciA9IFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlW1pPTkVfU1lNQk9MX0FERF9FVkVOVF9MSVNURU5FUl07XG4gICAgICAgICAgICBsZXQgb3JpUmVtb3ZlTGlzdGVuZXIgPSBYTUxIdHRwUmVxdWVzdFByb3RvdHlwZVtaT05FX1NZTUJPTF9SRU1PVkVfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICAgICAgaWYgKCFvcmlBZGRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQgPSB3aW5kb3dbJ1hNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQnXTtcbiAgICAgICAgICAgICAgICBpZiAoWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0UHJvdG90eXBlID0gWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgICAgIG9yaUFkZExpc3RlbmVyID0gWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldFByb3RvdHlwZVtaT05FX1NZTUJPTF9BRERfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICAgICAgICAgICAgICBvcmlSZW1vdmVMaXN0ZW5lciA9IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXRQcm90b3R5cGVbWk9ORV9TWU1CT0xfUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBSRUFEWV9TVEFURV9DSEFOR0UgPSAncmVhZHlzdGF0ZWNoYW5nZSc7XG4gICAgICAgICAgICBjb25zdCBTQ0hFRFVMRUQgPSAnc2NoZWR1bGVkJztcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRhc2suZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBkYXRhLnRhcmdldDtcbiAgICAgICAgICAgICAgICB0YXJnZXRbWEhSX1NDSEVEVUxFRF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbWEhSX0VSUk9SX0JFRk9SRV9TQ0hFRFVMRURdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSB0YXJnZXRbWEhSX0xJU1RFTkVSXTtcbiAgICAgICAgICAgICAgICBpZiAoIW9yaUFkZExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaUFkZExpc3RlbmVyID0gdGFyZ2V0W1pPTkVfU1lNQk9MX0FERF9FVkVOVF9MSVNURU5FUl07XG4gICAgICAgICAgICAgICAgICAgIG9yaVJlbW92ZUxpc3RlbmVyID0gdGFyZ2V0W1pPTkVfU1lNQk9MX1JFTU9WRV9FVkVOVF9MSVNURU5FUl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICBvcmlSZW1vdmVMaXN0ZW5lci5jYWxsKHRhcmdldCwgUkVBRFlfU1RBVEVfQ0hBTkdFLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xpc3RlbmVyID0gKHRhcmdldFtYSFJfTElTVEVORVJdID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LnJlYWR5U3RhdGUgPT09IHRhcmdldC5ET05FKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzb21ldGltZXMgb24gc29tZSBicm93c2VycyBYTUxIdHRwUmVxdWVzdCB3aWxsIGZpcmUgb25yZWFkeXN0YXRlY2hhbmdlIHdpdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlYWR5U3RhdGU9NCBtdWx0aXBsZSB0aW1lcywgc28gd2UgbmVlZCB0byBjaGVjayB0YXNrIHN0YXRlIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZGF0YS5hYm9ydGVkICYmIHRhcmdldFtYSFJfU0NIRURVTEVEXSAmJiB0YXNrLnN0YXRlID09PSBTQ0hFRFVMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIHRoZSB4aHIgaGFzIHJlZ2lzdGVyZWQgb25sb2FkIGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhhdCBpcyB0aGUgY2FzZSwgdGhlIHRhc2sgc2hvdWxkIGludm9rZSBhZnRlciBhbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvbmxvYWQgbGlzdGVuZXJzIGZpbmlzaC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbHNvIGlmIHRoZSByZXF1ZXN0IGZhaWxlZCB3aXRob3V0IHJlc3BvbnNlIChzdGF0dXMgPSAwKSwgdGhlIGxvYWQgZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgbm90IGJlIHRyaWdnZXJlZCwgaW4gdGhhdCBjYXNlLCB3ZSBzaG91bGQgYWxzbyBpbnZva2UgdGhlIHBsYWNlaG9sZGVyIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gY2xvc2UgdGhlIFhNTEh0dHBSZXF1ZXN0OjpzZW5kIG1hY3JvVGFzay5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zODc5NVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRUYXNrcyA9IHRhcmdldFtab25lLl9fc3ltYm9sX18oJ2xvYWRmYWxzZScpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LnN0YXR1cyAhPT0gMCAmJiBsb2FkVGFza3MgJiYgbG9hZFRhc2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JpSW52b2tlID0gdGFzay5pbnZva2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suaW52b2tlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmVlZCB0byBsb2FkIHRoZSB0YXNrcyBhZ2FpbiwgYmVjYXVzZSBpbiBvdGhlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9hZCBsaXN0ZW5lciwgdGhleSBtYXkgcmVtb3ZlIHRoZW1zZWx2ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRUYXNrcyA9IHRhcmdldFtab25lLl9fc3ltYm9sX18oJ2xvYWRmYWxzZScpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9hZFRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRUYXNrc1tpXSA9PT0gdGFzaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkVGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZGF0YS5hYm9ydGVkICYmIHRhc2suc3RhdGUgPT09IFNDSEVEVUxFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaUludm9rZS5jYWxsKHRhc2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkVGFza3MucHVzaCh0YXNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suaW52b2tlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIWRhdGEuYWJvcnRlZCAmJiB0YXJnZXRbWEhSX1NDSEVEVUxFRF0gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3Igb2NjdXJzIHdoZW4geGhyLnNlbmQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtYSFJfRVJST1JfQkVGT1JFX1NDSEVEVUxFRF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgb3JpQWRkTGlzdGVuZXIuY2FsbCh0YXJnZXQsIFJFQURZX1NUQVRFX0NIQU5HRSwgbmV3TGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JlZFRhc2sgPSB0YXJnZXRbWEhSX1RBU0tdO1xuICAgICAgICAgICAgICAgIGlmICghc3RvcmVkVGFzaykge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbWEhSX1RBU0tdID0gdGFzaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VuZE5hdGl2ZS5hcHBseSh0YXJnZXQsIGRhdGEuYXJncyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W1hIUl9TQ0hFRFVMRURdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIHBsYWNlaG9sZGVyQ2FsbGJhY2soKSB7IH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyVGFzayh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRhc2suZGF0YTtcbiAgICAgICAgICAgICAgICAvLyBOb3RlIC0gaWRlYWxseSwgd2Ugd291bGQgY2FsbCBkYXRhLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyIGhlcmUsIGJ1dCBpdCdzIHRvbyBsYXRlXG4gICAgICAgICAgICAgICAgLy8gdG8gcHJldmVudCBpdCBmcm9tIGZpcmluZy4gU28gaW5zdGVhZCwgd2Ugc3RvcmUgaW5mbyBmb3IgdGhlIGV2ZW50IGxpc3RlbmVyLlxuICAgICAgICAgICAgICAgIGRhdGEuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFib3J0TmF0aXZlLmFwcGx5KGRhdGEudGFyZ2V0LCBkYXRhLmFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgb3Blbk5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnb3BlbicsICgpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgc2VsZltYSFJfU1lOQ10gPSBhcmdzWzJdID09IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGZbWEhSX1VSTF0gPSBhcmdzWzFdO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGVuTmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBYTUxIVFRQUkVRVUVTVF9TT1VSQ0UgPSAnWE1MSHR0cFJlcXVlc3Quc2VuZCc7XG4gICAgICAgICAgICBjb25zdCBmZXRjaFRhc2tBYm9ydGluZyA9IHpvbmVTeW1ib2woJ2ZldGNoVGFza0Fib3J0aW5nJyk7XG4gICAgICAgICAgICBjb25zdCBmZXRjaFRhc2tTY2hlZHVsaW5nID0gem9uZVN5bWJvbCgnZmV0Y2hUYXNrU2NoZWR1bGluZycpO1xuICAgICAgICAgICAgY29uc3Qgc2VuZE5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnc2VuZCcsICgpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKFpvbmUuY3VycmVudFtmZXRjaFRhc2tTY2hlZHVsaW5nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhIGZldGNoIGlzIHNjaGVkdWxpbmcsIHNvIHdlIGFyZSB1c2luZyB4aHIgdG8gcG9seWZpbGwgZmV0Y2hcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGJlY2F1c2Ugd2UgYWxyZWFkeSBzY2hlZHVsZSBtYWNyb1Rhc2sgZm9yIGZldGNoLCB3ZSBzaG91bGRcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90IHNjaGVkdWxlIGEgbWFjcm9UYXNrIGZvciB4aHIgYWdhaW5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbmROYXRpdmUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWxmW1hIUl9TWU5DXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgWEhSIGlzIHN5bmMgdGhlcmUgaXMgbm8gdGFzayB0byBzY2hlZHVsZSwganVzdCBleGVjdXRlIHRoZSBjb2RlLlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VuZE5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHNlbGYsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHNlbGZbWEhSX1VSTF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1BlcmlvZGljOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBhYm9ydGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHNjaGVkdWxlTWFjcm9UYXNrV2l0aEN1cnJlbnRab25lKFhNTEhUVFBSRVFVRVNUX1NPVVJDRSwgcGxhY2Vob2xkZXJDYWxsYmFjaywgb3B0aW9ucywgc2NoZWR1bGVUYXNrLCBjbGVhclRhc2spO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZltYSFJfRVJST1JfQkVGT1JFX1NDSEVEVUxFRF0gPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFvcHRpb25zLmFib3J0ZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suc3RhdGUgPT09IFNDSEVEVUxFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8geGhyIHJlcXVlc3QgdGhyb3cgZXJyb3Igd2hlbiBzZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBzaG91bGQgaW52b2tlIHRhc2sgaW5zdGVhZCBvZiBsZWF2aW5nIGEgc2NoZWR1bGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwZW5kaW5nIG1hY3JvVGFza1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5pbnZva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgYWJvcnROYXRpdmUgPSBwYXRjaE1ldGhvZChYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgJ2Fib3J0JywgKCkgPT4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gZmluZFBlbmRpbmdUYXNrKHNlbGYpO1xuICAgICAgICAgICAgICAgIGlmICh0YXNrICYmIHR5cGVvZiB0YXNrLnR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIFhIUiBoYXMgYWxyZWFkeSBjb21wbGV0ZWQsIGRvIG5vdGhpbmcuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBYSFIgaGFzIGFscmVhZHkgYmVlbiBhYm9ydGVkLCBkbyBub3RoaW5nLlxuICAgICAgICAgICAgICAgICAgICAvLyBGaXggIzU2OSwgY2FsbCBhYm9ydCBtdWx0aXBsZSB0aW1lcyBiZWZvcmUgZG9uZSB3aWxsIGNhdXNlXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hY3JvVGFzayB0YXNrIGNvdW50IGJlIG5lZ2F0aXZlIG51bWJlclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFzay5jYW5jZWxGbiA9PSBudWxsIHx8ICh0YXNrLmRhdGEgJiYgdGFzay5kYXRhLmFib3J0ZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGFzay56b25lLmNhbmNlbFRhc2sodGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKFpvbmUuY3VycmVudFtmZXRjaFRhc2tBYm9ydGluZ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGFib3J0IGlzIGNhbGxlZCBmcm9tIGZldGNoIHBvbHlmaWxsLCB3ZSBuZWVkIHRvIGNhbGwgbmF0aXZlIGFib3J0IG9mIFhIUi5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFib3J0TmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlIGFyZSB0cnlpbmcgdG8gYWJvcnQgYW4gWEhSIHdoaWNoIGhhcyBub3QgeWV0IGJlZW4gc2VudCwgc28gdGhlcmUgaXMgbm9cbiAgICAgICAgICAgICAgICAvLyB0YXNrXG4gICAgICAgICAgICAgICAgLy8gdG8gY2FuY2VsLiBEbyBub3RoaW5nLlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgnZ2VvbG9jYXRpb24nLCAoZ2xvYmFsKSA9PiB7XG4gICAgICAgIC8vLyBHRU9fTE9DQVRJT05cbiAgICAgICAgaWYgKGdsb2JhbFsnbmF2aWdhdG9yJ10gJiYgZ2xvYmFsWyduYXZpZ2F0b3InXS5nZW9sb2NhdGlvbikge1xuICAgICAgICAgICAgcGF0Y2hQcm90b3R5cGUoZ2xvYmFsWyduYXZpZ2F0b3InXS5nZW9sb2NhdGlvbiwgWydnZXRDdXJyZW50UG9zaXRpb24nLCAnd2F0Y2hQb3NpdGlvbiddKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdQcm9taXNlUmVqZWN0aW9uRXZlbnQnLCAoZ2xvYmFsLCBab25lKSA9PiB7XG4gICAgICAgIC8vIGhhbmRsZSB1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb25cbiAgICAgICAgZnVuY3Rpb24gZmluZFByb21pc2VSZWplY3Rpb25IYW5kbGVyKGV2dE5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50VGFza3MgPSBmaW5kRXZlbnRUYXNrcyhnbG9iYWwsIGV2dE5hbWUpO1xuICAgICAgICAgICAgICAgIGV2ZW50VGFza3MuZm9yRWFjaCgoZXZlbnRUYXNrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdpbmRvd3MgaGFzIGFkZGVkIHVuaGFuZGxlZHJlamVjdGlvbiBldmVudCBsaXN0ZW5lclxuICAgICAgICAgICAgICAgICAgICAvLyB0cmlnZ2VyIHRoZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPSBnbG9iYWxbJ1Byb21pc2VSZWplY3Rpb25FdmVudCddO1xuICAgICAgICAgICAgICAgICAgICBpZiAoUHJvbWlzZVJlamVjdGlvbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBldnQgPSBuZXcgUHJvbWlzZVJlamVjdGlvbkV2ZW50KGV2dE5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlOiBlLnByb21pc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBlLnJlamVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRUYXNrLmludm9rZShldnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChnbG9iYWxbJ1Byb21pc2VSZWplY3Rpb25FdmVudCddKSB7XG4gICAgICAgICAgICBab25lW3pvbmVTeW1ib2woJ3VuaGFuZGxlZFByb21pc2VSZWplY3Rpb25IYW5kbGVyJyldID1cbiAgICAgICAgICAgICAgICBmaW5kUHJvbWlzZVJlamVjdGlvbkhhbmRsZXIoJ3VuaGFuZGxlZHJlamVjdGlvbicpO1xuICAgICAgICAgICAgWm9uZVt6b25lU3ltYm9sKCdyZWplY3Rpb25IYW5kbGVkSGFuZGxlcicpXSA9XG4gICAgICAgICAgICAgICAgZmluZFByb21pc2VSZWplY3Rpb25IYW5kbGVyKCdyZWplY3Rpb25oYW5kbGVkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgncXVldWVNaWNyb3Rhc2snLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICAgICAgcGF0Y2hRdWV1ZU1pY3JvdGFzayhnbG9iYWwsIGFwaSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhdGNoUHJvbWlzZShab25lKSB7XG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ1pvbmVBd2FyZVByb21pc2UnLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICAgICAgY29uc3QgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICAgICAgY29uc3QgT2JqZWN0RGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gICAgICAgIGZ1bmN0aW9uIHJlYWRhYmxlT2JqZWN0VG9TdHJpbmcob2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqICYmIG9iai50b1N0cmluZyA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNsYXNzTmFtZSA/IGNsYXNzTmFtZSA6ICcnKSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iaiA/IG9iai50b1N0cmluZygpIDogT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgX19zeW1ib2xfXyA9IGFwaS5zeW1ib2w7XG4gICAgICAgIGNvbnN0IF91bmNhdWdodFByb21pc2VFcnJvcnMgPSBbXTtcbiAgICAgICAgY29uc3QgaXNEaXNhYmxlV3JhcHBpbmdVbmNhdWdodFByb21pc2VSZWplY3Rpb24gPSBnbG9iYWxbX19zeW1ib2xfXygnRElTQUJMRV9XUkFQUElOR19VTkNBVUdIVF9QUk9NSVNFX1JFSkVDVElPTicpXSAhPT0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHN5bWJvbFByb21pc2UgPSBfX3N5bWJvbF9fKCdQcm9taXNlJyk7XG4gICAgICAgIGNvbnN0IHN5bWJvbFRoZW4gPSBfX3N5bWJvbF9fKCd0aGVuJyk7XG4gICAgICAgIGNvbnN0IGNyZWF0aW9uVHJhY2UgPSAnX19jcmVhdGlvblRyYWNlX18nO1xuICAgICAgICBhcGkub25VbmhhbmRsZWRFcnJvciA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXBpLnNob3dVbmNhdWdodEVycm9yKCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWplY3Rpb24gPSBlICYmIGUucmVqZWN0aW9uO1xuICAgICAgICAgICAgICAgIGlmIChyZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIFByb21pc2UgcmVqZWN0aW9uOicsIHJlamVjdGlvbiBpbnN0YW5jZW9mIEVycm9yID8gcmVqZWN0aW9uLm1lc3NhZ2UgOiByZWplY3Rpb24sICc7IFpvbmU6JywgZS56b25lLm5hbWUsICc7IFRhc2s6JywgZS50YXNrICYmIGUudGFzay5zb3VyY2UsICc7IFZhbHVlOicsIHJlamVjdGlvbiwgcmVqZWN0aW9uIGluc3RhbmNlb2YgRXJyb3IgPyByZWplY3Rpb24uc3RhY2sgOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFwaS5taWNyb3Rhc2tEcmFpbkRvbmUgPSAoKSA9PiB7XG4gICAgICAgICAgICB3aGlsZSAoX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1bmNhdWdodFByb21pc2VFcnJvciA9IF91bmNhdWdodFByb21pc2VFcnJvcnMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvci56b25lLnJ1bkd1YXJkZWQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVuY2F1Z2h0UHJvbWlzZUVycm9yLnRocm93T3JpZ2luYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB1bmNhdWdodFByb21pc2VFcnJvci5yZWplY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB1bmNhdWdodFByb21pc2VFcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVVbmhhbmRsZWRSZWplY3Rpb24oZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgVU5IQU5ETEVEX1BST01JU0VfUkVKRUNUSU9OX0hBTkRMRVJfU1lNQk9MID0gX19zeW1ib2xfXygndW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbkhhbmRsZXInKTtcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVW5oYW5kbGVkUmVqZWN0aW9uKGUpIHtcbiAgICAgICAgICAgIGFwaS5vblVuaGFuZGxlZEVycm9yKGUpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gWm9uZVtVTkhBTkRMRURfUFJPTUlTRV9SRUpFQ1RJT05fSEFORExFUl9TWU1CT0xdO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikgeyB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNUaGVuYWJsZSh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnRoZW47XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZm9yd2FyZFJlc29sdXRpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmb3J3YXJkUmVqZWN0aW9uKHJlamVjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFpvbmVBd2FyZVByb21pc2UucmVqZWN0KHJlamVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3ltYm9sU3RhdGUgPSBfX3N5bWJvbF9fKCdzdGF0ZScpO1xuICAgICAgICBjb25zdCBzeW1ib2xWYWx1ZSA9IF9fc3ltYm9sX18oJ3ZhbHVlJyk7XG4gICAgICAgIGNvbnN0IHN5bWJvbEZpbmFsbHkgPSBfX3N5bWJvbF9fKCdmaW5hbGx5Jyk7XG4gICAgICAgIGNvbnN0IHN5bWJvbFBhcmVudFByb21pc2VWYWx1ZSA9IF9fc3ltYm9sX18oJ3BhcmVudFByb21pc2VWYWx1ZScpO1xuICAgICAgICBjb25zdCBzeW1ib2xQYXJlbnRQcm9taXNlU3RhdGUgPSBfX3N5bWJvbF9fKCdwYXJlbnRQcm9taXNlU3RhdGUnKTtcbiAgICAgICAgY29uc3Qgc291cmNlID0gJ1Byb21pc2UudGhlbic7XG4gICAgICAgIGNvbnN0IFVOUkVTT0xWRUQgPSBudWxsO1xuICAgICAgICBjb25zdCBSRVNPTFZFRCA9IHRydWU7XG4gICAgICAgIGNvbnN0IFJFSkVDVEVEID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IFJFSkVDVEVEX05PX0NBVENIID0gMDtcbiAgICAgICAgZnVuY3Rpb24gbWFrZVJlc29sdmVyKHByb21pc2UsIHN0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gKHYpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBzdGF0ZSwgdik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIERvIG5vdCByZXR1cm4gdmFsdWUgb3IgeW91IHdpbGwgYnJlYWsgdGhlIFByb21pc2Ugc3BlYy5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB3YXNDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiB3cmFwcGVyKHdyYXBwZWRGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3YXNDYWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB3YXNDYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVkRnVuY3Rpb24uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgVFlQRV9FUlJPUiA9ICdQcm9taXNlIHJlc29sdmVkIHdpdGggaXRzZWxmJztcbiAgICAgICAgY29uc3QgQ1VSUkVOVF9UQVNLX1RSQUNFX1NZTUJPTCA9IF9fc3ltYm9sX18oJ2N1cnJlbnRUYXNrVHJhY2UnKTtcbiAgICAgICAgLy8gUHJvbWlzZSBSZXNvbHV0aW9uXG4gICAgICAgIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHByb21pc2UsIHN0YXRlLCB2YWx1ZSkge1xuICAgICAgICAgICAgY29uc3Qgb25jZVdyYXBwZXIgPSBvbmNlKCk7XG4gICAgICAgICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFRZUEVfRVJST1IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb21pc2Vbc3ltYm9sU3RhdGVdID09PSBVTlJFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgLy8gc2hvdWxkIG9ubHkgZ2V0IHZhbHVlLnRoZW4gb25jZSBiYXNlZCBvbiBwcm9taXNlIHNwZWMuXG4gICAgICAgICAgICAgICAgbGV0IHRoZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlbiA9IHZhbHVlICYmIHZhbHVlLnRoZW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBvbmNlV3JhcHBlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBmYWxzZSwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09IFJFSkVDVEVEICYmXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSAmJlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5oYXNPd25Qcm9wZXJ0eShzeW1ib2xTdGF0ZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuaGFzT3duUHJvcGVydHkoc3ltYm9sVmFsdWUpICYmXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlW3N5bWJvbFN0YXRlXSAhPT0gVU5SRVNPTFZFRCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclJlamVjdGVkTm9DYXRjaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIHZhbHVlW3N5bWJvbFN0YXRlXSwgdmFsdWVbc3ltYm9sVmFsdWVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RhdGUgIT09IFJFSkVDVEVEICYmIHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIG9uY2VXcmFwcGVyKG1ha2VSZXNvbHZlcihwcm9taXNlLCBzdGF0ZSkpLCBvbmNlV3JhcHBlcihtYWtlUmVzb2x2ZXIocHJvbWlzZSwgZmFsc2UpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25jZVdyYXBwZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGZhbHNlLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xTdGF0ZV0gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcXVldWUgPSBwcm9taXNlW3N5bWJvbFZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xWYWx1ZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2Vbc3ltYm9sRmluYWxseV0gPT09IHN5bWJvbEZpbmFsbHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBwcm9taXNlIGlzIGdlbmVyYXRlZCBieSBQcm9taXNlLnByb3RvdHlwZS5maW5hbGx5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHN0YXRlIGlzIHJlc29sdmVkLCBzaG91bGQgaWdub3JlIHRoZSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCB1c2UgcGFyZW50IHByb21pc2UgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlW3N5bWJvbFN0YXRlXSA9IHByb21pc2Vbc3ltYm9sUGFyZW50UHJvbWlzZVN0YXRlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlW3N5bWJvbFZhbHVlXSA9IHByb21pc2Vbc3ltYm9sUGFyZW50UHJvbWlzZVZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyByZWNvcmQgdGFzayBpbmZvcm1hdGlvbiBpbiB2YWx1ZSB3aGVuIGVycm9yIG9jY3Vycywgc28gd2UgY2FuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIHNvbWUgYWRkaXRpb25hbCB3b3JrIHN1Y2ggYXMgcmVuZGVyIGxvbmdTdGFja1RyYWNlXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQgJiYgdmFsdWUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgbG9uZ1N0YWNrVHJhY2Vab25lIGlzIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYWNlID0gWm9uZS5jdXJyZW50VGFzayAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpvbmUuY3VycmVudFRhc2suZGF0YSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpvbmUuY3VycmVudFRhc2suZGF0YVtjcmVhdGlvblRyYWNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9ubHkga2VlcCB0aGUgbG9uZyBzdGFjayB0cmFjZSBpbnRvIGVycm9yIHdoZW4gaW4gbG9uZ1N0YWNrVHJhY2Vab25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHkodmFsdWUsIENVUlJFTlRfVEFTS19UUkFDRV9TWU1CT0wsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cmFjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVzb2x2ZU9yUmVqZWN0KHByb21pc2UsIHF1ZXVlW2krK10sIHF1ZXVlW2krK10sIHF1ZXVlW2krK10sIHF1ZXVlW2krK10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPT0gMCAmJiBzdGF0ZSA9PSBSRUpFQ1RFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xTdGF0ZV0gPSBSRUpFQ1RFRF9OT19DQVRDSDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1bmNhdWdodFByb21pc2VFcnJvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIZXJlIHdlIHRocm93cyBhIG5ldyBFcnJvciB0byBwcmludCBtb3JlIHJlYWRhYmxlIGVycm9yIGxvZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBpZiB0aGUgdmFsdWUgaXMgbm90IGFuIGVycm9yLCB6b25lLmpzIGJ1aWxkcyBhbiBgRXJyb3JgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT2JqZWN0IGhlcmUgdG8gYXR0YWNoIHRoZSBzdGFjayBpbmZvcm1hdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2F1Z2h0IChpbiBwcm9taXNlKTogJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlT2JqZWN0VG9TdHJpbmcodmFsdWUpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlICYmIHZhbHVlLnN0YWNrID8gJ1xcbicgKyB2YWx1ZS5zdGFjayA6ICcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3IgPSBlcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNEaXNhYmxlV3JhcHBpbmdVbmNhdWdodFByb21pc2VSZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBkaXNhYmxlIHdyYXBwaW5nIHVuY2F1Z2h0IHByb21pc2UgcmVqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlIHRoZSB2YWx1ZSBpbnN0ZWFkIG9mIHdyYXBwaW5nIGl0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnRocm93T3JpZ2luYWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3IucmVqZWN0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvci5wcm9taXNlID0gcHJvbWlzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvci50YXNrID0gWm9uZS5jdXJyZW50VGFzaztcbiAgICAgICAgICAgICAgICAgICAgICAgIF91bmNhdWdodFByb21pc2VFcnJvcnMucHVzaCh1bmNhdWdodFByb21pc2VFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuc2NoZWR1bGVNaWNyb1Rhc2soKTsgLy8gdG8gbWFrZSBzdXJlIHRoYXQgaXQgaXMgcnVubmluZ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVzb2x2aW5nIGFuIGFscmVhZHkgcmVzb2x2ZWQgcHJvbWlzZSBpcyBhIG5vb3AuXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBSRUpFQ1RJT05fSEFORExFRF9IQU5ETEVSID0gX19zeW1ib2xfXygncmVqZWN0aW9uSGFuZGxlZEhhbmRsZXInKTtcbiAgICAgICAgZnVuY3Rpb24gY2xlYXJSZWplY3RlZE5vQ2F0Y2gocHJvbWlzZSkge1xuICAgICAgICAgICAgaWYgKHByb21pc2Vbc3ltYm9sU3RhdGVdID09PSBSRUpFQ1RFRF9OT19DQVRDSCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIG5vIGNhdGNoIHN0YXR1c1xuICAgICAgICAgICAgICAgIC8vIGFuZCBxdWV1ZS5sZW5ndGggPiAwLCBtZWFucyB0aGVyZSBpcyBhIGVycm9yIGhhbmRsZXJcbiAgICAgICAgICAgICAgICAvLyBoZXJlIHRvIGhhbmRsZSB0aGUgcmVqZWN0ZWQgcHJvbWlzZSwgd2Ugc2hvdWxkIHRyaWdnZXJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3dzLnJlamVjdGlvbmhhbmRsZWQgZXZlbnRIYW5kbGVyIG9yIG5vZGVqcyByZWplY3Rpb25IYW5kbGVkXG4gICAgICAgICAgICAgICAgLy8gZXZlbnRIYW5kbGVyXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IFpvbmVbUkVKRUNUSU9OX0hBTkRMRURfSEFORExFUl07XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyICYmIHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgeyByZWplY3Rpb246IHByb21pc2Vbc3ltYm9sVmFsdWVdLCBwcm9taXNlOiBwcm9taXNlIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHsgfVxuICAgICAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sU3RhdGVdID0gUkVKRUNURUQ7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlID09PSBfdW5jYXVnaHRQcm9taXNlRXJyb3JzW2ldLnByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF91bmNhdWdodFByb21pc2VFcnJvcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlUmVzb2x2ZU9yUmVqZWN0KHByb21pc2UsIHpvbmUsIGNoYWluUHJvbWlzZSwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIGNsZWFyUmVqZWN0ZWROb0NhdGNoKHByb21pc2UpO1xuICAgICAgICAgICAgY29uc3QgcHJvbWlzZVN0YXRlID0gcHJvbWlzZVtzeW1ib2xTdGF0ZV07XG4gICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHByb21pc2VTdGF0ZVxuICAgICAgICAgICAgICAgID8gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgICAgID8gb25GdWxmaWxsZWRcbiAgICAgICAgICAgICAgICAgICAgOiBmb3J3YXJkUmVzb2x1dGlvblxuICAgICAgICAgICAgICAgIDogdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICAgICAgPyBvblJlamVjdGVkXG4gICAgICAgICAgICAgICAgICAgIDogZm9yd2FyZFJlamVjdGlvbjtcbiAgICAgICAgICAgIHpvbmUuc2NoZWR1bGVNaWNyb1Rhc2soc291cmNlLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50UHJvbWlzZVZhbHVlID0gcHJvbWlzZVtzeW1ib2xWYWx1ZV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzRmluYWxseVByb21pc2UgPSAhIWNoYWluUHJvbWlzZSAmJiBzeW1ib2xGaW5hbGx5ID09PSBjaGFpblByb21pc2Vbc3ltYm9sRmluYWxseV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ZpbmFsbHlQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcHJvbWlzZSBpcyBnZW5lcmF0ZWQgZnJvbSBmaW5hbGx5IGNhbGwsIGtlZXAgcGFyZW50IHByb21pc2UncyBzdGF0ZSBhbmQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluUHJvbWlzZVtzeW1ib2xQYXJlbnRQcm9taXNlVmFsdWVdID0gcGFyZW50UHJvbWlzZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5Qcm9taXNlW3N5bWJvbFBhcmVudFByb21pc2VTdGF0ZV0gPSBwcm9taXNlU3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIG5vdCBwYXNzIHZhbHVlIHRvIGZpbmFsbHkgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB6b25lLnJ1bihkZWxlZ2F0ZSwgdW5kZWZpbmVkLCBpc0ZpbmFsbHlQcm9taXNlICYmIGRlbGVnYXRlICE9PSBmb3J3YXJkUmVqZWN0aW9uICYmIGRlbGVnYXRlICE9PSBmb3J3YXJkUmVzb2x1dGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgPyBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBbcGFyZW50UHJvbWlzZVZhbHVlXSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKGNoYWluUHJvbWlzZSwgdHJ1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgZXJyb3Igb2NjdXJzLCBzaG91bGQgYWx3YXlzIHJldHVybiB0aGlzIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKGNoYWluUHJvbWlzZSwgZmFsc2UsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBjaGFpblByb21pc2UpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFpPTkVfQVdBUkVfUFJPTUlTRV9UT19TVFJJTkcgPSAnZnVuY3Rpb24gWm9uZUF3YXJlUHJvbWlzZSgpIHsgW25hdGl2ZSBjb2RlXSB9JztcbiAgICAgICAgY29uc3Qgbm9vcCA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICAgICAgY29uc3QgQWdncmVnYXRlRXJyb3IgPSBnbG9iYWwuQWdncmVnYXRlRXJyb3I7XG4gICAgICAgIGNsYXNzIFpvbmVBd2FyZVByb21pc2Uge1xuICAgICAgICAgICAgc3RhdGljIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBaT05FX0FXQVJFX1BST01JU0VfVE9fU1RSSU5HO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGljIHJlc29sdmUodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBab25lQXdhcmVQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVQcm9taXNlKG5ldyB0aGlzKG51bGwpLCBSRVNPTFZFRCwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGljIHJlamVjdChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUHJvbWlzZShuZXcgdGhpcyhudWxsKSwgUkVKRUNURUQsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRpYyB3aXRoUmVzb2x2ZXJzKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wcm9taXNlID0gbmV3IFpvbmVBd2FyZVByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yZXNvbHZlID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucmVqZWN0ID0gcmVqO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0aWMgYW55KHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWVzIHx8IHR5cGVvZiB2YWx1ZXNbU3ltYm9sLml0ZXJhdG9yXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFnZ3JlZ2F0ZUVycm9yKFtdLCAnQWxsIHByb21pc2VzIHdlcmUgcmVqZWN0ZWQnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB2IG9mIHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goWm9uZUF3YXJlUHJvbWlzZS5yZXNvbHZlKHYpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoW10sICdBbGwgcHJvbWlzZXMgd2VyZSByZWplY3RlZCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoW10sICdBbGwgcHJvbWlzZXMgd2VyZSByZWplY3RlZCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBab25lQXdhcmVQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9taXNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXNbaV0udGhlbigodikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5pc2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEFnZ3JlZ2F0ZUVycm9yKGVycm9ycywgJ0FsbCBwcm9taXNlcyB3ZXJlIHJlamVjdGVkJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0aWMgcmFjZSh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzb2x2ZTtcbiAgICAgICAgICAgICAgICBsZXQgcmVqZWN0O1xuICAgICAgICAgICAgICAgIGxldCBwcm9taXNlID0gbmV3IHRoaXMoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUgPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCA9IHJlajtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvblJlc29sdmUodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9uUmVqZWN0KGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0aWMgYWxsKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBab25lQXdhcmVQcm9taXNlLmFsbFdpdGhDYWxsYmFjayh2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGljIGFsbFNldHRsZWQodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgUCA9IHRoaXMgJiYgdGhpcy5wcm90b3R5cGUgaW5zdGFuY2VvZiBab25lQXdhcmVQcm9taXNlID8gdGhpcyA6IFpvbmVBd2FyZVByb21pc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFAuYWxsV2l0aENhbGxiYWNrKHZhbHVlcywge1xuICAgICAgICAgICAgICAgICAgICB0aGVuQ2FsbGJhY2s6ICh2YWx1ZSkgPT4gKHsgc3RhdHVzOiAnZnVsZmlsbGVkJywgdmFsdWUgfSksXG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2s6IChlcnIpID0+ICh7IHN0YXR1czogJ3JlamVjdGVkJywgcmVhc29uOiBlcnIgfSksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0aWMgYWxsV2l0aENhbGxiYWNrKHZhbHVlcywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzb2x2ZTtcbiAgICAgICAgICAgICAgICBsZXQgcmVqZWN0O1xuICAgICAgICAgICAgICAgIGxldCBwcm9taXNlID0gbmV3IHRoaXMoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUgPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCA9IHJlajtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBTdGFydCBhdCAyIHRvIHByZXZlbnQgcHJlbWF0dXJlbHkgcmVzb2x2aW5nIGlmIC50aGVuIGlzIGNhbGxlZCBpbW1lZGlhdGVseS5cbiAgICAgICAgICAgICAgICBsZXQgdW5yZXNvbHZlZENvdW50ID0gMjtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzb2x2ZWRWYWx1ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1clZhbHVlSW5kZXggPSB2YWx1ZUluZGV4O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFZhbHVlc1tjdXJWYWx1ZUluZGV4XSA9IGNhbGxiYWNrID8gY2FsbGJhY2sudGhlbkNhbGxiYWNrKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRDb3VudC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bnJlc29sdmVkQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNvbHZlZFZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFZhbHVlc1tjdXJWYWx1ZUluZGV4XSA9IGNhbGxiYWNrLmVycm9yQ2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5yZXNvbHZlZENvdW50LS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bnJlc29sdmVkQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzb2x2ZWRWYWx1ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKHRoZW5FcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh0aGVuRXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB1bnJlc29sdmVkQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVJbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBNYWtlIHRoZSB1bnJlc29sdmVkQ291bnQgemVyby1iYXNlZCBhZ2Fpbi5cbiAgICAgICAgICAgICAgICB1bnJlc29sdmVkQ291bnQgLT0gMjtcbiAgICAgICAgICAgICAgICBpZiAodW5yZXNvbHZlZENvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzb2x2ZWRWYWx1ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGV4ZWN1dG9yKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKCEocHJvbWlzZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBiZSBhbiBpbnN0YW5jZW9mIFByb21pc2UuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sU3RhdGVdID0gVU5SRVNPTFZFRDtcbiAgICAgICAgICAgICAgICBwcm9taXNlW3N5bWJvbFZhbHVlXSA9IFtdOyAvLyBxdWV1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbmNlV3JhcHBlciA9IG9uY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWN1dG9yKG9uY2VXcmFwcGVyKG1ha2VSZXNvbHZlcihwcm9taXNlLCBSRVNPTFZFRCkpLCBvbmNlV3JhcHBlcihtYWtlUmVzb2x2ZXIocHJvbWlzZSwgUkVKRUNURUQpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBmYWxzZSwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1Byb21pc2UnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2V0IFtTeW1ib2wuc3BlY2llc10oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpvbmVBd2FyZVByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgbXVzdCByZWFkIGBTeW1ib2wuc3BlY2llc2Agc2FmZWx5IGJlY2F1c2UgYHRoaXNgIG1heSBiZSBhbnl0aGluZy4gRm9yIGluc3RhbmNlLCBgdGhpc2BcbiAgICAgICAgICAgICAgICAvLyBtYXkgYmUgYW4gb2JqZWN0IHdpdGhvdXQgYSBwcm90b3R5cGUgKGNyZWF0ZWQgdGhyb3VnaCBgT2JqZWN0LmNyZWF0ZShudWxsKWApOyB0aHVzXG4gICAgICAgICAgICAgICAgLy8gYHRoaXMuY29uc3RydWN0b3JgIHdpbGwgYmUgdW5kZWZpbmVkLiBPbmUgb2YgdGhlIHVzZSBjYXNlcyBpcyBTeXN0ZW1KUyBjcmVhdGluZ1xuICAgICAgICAgICAgICAgIC8vIHByb3RvdHlwZS1sZXNzIG9iamVjdHMgKG1vZHVsZXMpIHZpYSBgT2JqZWN0LmNyZWF0ZShudWxsKWAuIFRoZSBTeXN0ZW1KUyBjcmVhdGVzIGFuIGVtcHR5XG4gICAgICAgICAgICAgICAgLy8gb2JqZWN0IGFuZCBjb3BpZXMgcHJvbWlzZSBwcm9wZXJ0aWVzIGludG8gdGhhdCBvYmplY3QgKHdpdGhpbiB0aGUgYGdldE9yQ3JlYXRlTG9hZGBcbiAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbikuIFRoZSB6b25lLmpzIHRoZW4gY2hlY2tzIGlmIHRoZSByZXNvbHZlZCB2YWx1ZSBoYXMgdGhlIGB0aGVuYCBtZXRob2QgYW5kXG4gICAgICAgICAgICAgICAgLy8gaW52b2tlcyBpdCB3aXRoIHRoZSBgdmFsdWVgIGNvbnRleHQuIE90aGVyd2lzZSwgdGhpcyB3aWxsIHRocm93IGFuIGVycm9yOiBgVHlwZUVycm9yOlxuICAgICAgICAgICAgICAgIC8vIENhbm5vdCByZWFkIHByb3BlcnRpZXMgb2YgdW5kZWZpbmVkIChyZWFkaW5nICdTeW1ib2woU3ltYm9sLnNwZWNpZXMpJylgLlxuICAgICAgICAgICAgICAgIGxldCBDID0gdGhpcy5jb25zdHJ1Y3Rvcj8uW1N5bWJvbC5zcGVjaWVzXTtcbiAgICAgICAgICAgICAgICBpZiAoIUMgfHwgdHlwZW9mIEMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgQyA9IHRoaXMuY29uc3RydWN0b3IgfHwgWm9uZUF3YXJlUHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY2hhaW5Qcm9taXNlID0gbmV3IEMobm9vcCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tzeW1ib2xTdGF0ZV0gPT0gVU5SRVNPTFZFRCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW3N5bWJvbFZhbHVlXS5wdXNoKHpvbmUsIGNoYWluUHJvbWlzZSwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVSZXNvbHZlT3JSZWplY3QodGhpcywgem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjaGFpblByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaChvblJlamVjdGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkob25GaW5hbGx5KSB7XG4gICAgICAgICAgICAgICAgLy8gU2VlIGNvbW1lbnQgb24gdGhlIGNhbGwgdG8gYHRoZW5gIGFib3V0IHdoeSB0aGVlIGBTeW1ib2wuc3BlY2llc2AgaXMgc2FmZWx5IGFjY2Vzc2VkLlxuICAgICAgICAgICAgICAgIGxldCBDID0gdGhpcy5jb25zdHJ1Y3Rvcj8uW1N5bWJvbC5zcGVjaWVzXTtcbiAgICAgICAgICAgICAgICBpZiAoIUMgfHwgdHlwZW9mIEMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgQyA9IFpvbmVBd2FyZVByb21pc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYWluUHJvbWlzZSA9IG5ldyBDKG5vb3ApO1xuICAgICAgICAgICAgICAgIGNoYWluUHJvbWlzZVtzeW1ib2xGaW5hbGx5XSA9IHN5bWJvbEZpbmFsbHk7XG4gICAgICAgICAgICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tzeW1ib2xTdGF0ZV0gPT0gVU5SRVNPTFZFRCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW3N5bWJvbFZhbHVlXS5wdXNoKHpvbmUsIGNoYWluUHJvbWlzZSwgb25GaW5hbGx5LCBvbkZpbmFsbHkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVSZXNvbHZlT3JSZWplY3QodGhpcywgem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZpbmFsbHksIG9uRmluYWxseSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjaGFpblByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJvdGVjdCBhZ2FpbnN0IGFnZ3Jlc3NpdmUgb3B0aW1pemVycyBkcm9wcGluZyBzZWVtaW5nbHkgdW51c2VkIHByb3BlcnRpZXMuXG4gICAgICAgIC8vIEUuZy4gQ2xvc3VyZSBDb21waWxlciBpbiBhZHZhbmNlZCBtb2RlLlxuICAgICAgICBab25lQXdhcmVQcm9taXNlWydyZXNvbHZlJ10gPSBab25lQXdhcmVQcm9taXNlLnJlc29sdmU7XG4gICAgICAgIFpvbmVBd2FyZVByb21pc2VbJ3JlamVjdCddID0gWm9uZUF3YXJlUHJvbWlzZS5yZWplY3Q7XG4gICAgICAgIFpvbmVBd2FyZVByb21pc2VbJ3JhY2UnXSA9IFpvbmVBd2FyZVByb21pc2UucmFjZTtcbiAgICAgICAgWm9uZUF3YXJlUHJvbWlzZVsnYWxsJ10gPSBab25lQXdhcmVQcm9taXNlLmFsbDtcbiAgICAgICAgY29uc3QgTmF0aXZlUHJvbWlzZSA9IChnbG9iYWxbc3ltYm9sUHJvbWlzZV0gPSBnbG9iYWxbJ1Byb21pc2UnXSk7XG4gICAgICAgIGdsb2JhbFsnUHJvbWlzZSddID0gWm9uZUF3YXJlUHJvbWlzZTtcbiAgICAgICAgY29uc3Qgc3ltYm9sVGhlblBhdGNoZWQgPSBfX3N5bWJvbF9fKCd0aGVuUGF0Y2hlZCcpO1xuICAgICAgICBmdW5jdGlvbiBwYXRjaFRoZW4oQ3Rvcikge1xuICAgICAgICAgICAgY29uc3QgcHJvdG8gPSBDdG9yLnByb3RvdHlwZTtcbiAgICAgICAgICAgIGNvbnN0IHByb3AgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sICd0aGVuJyk7XG4gICAgICAgICAgICBpZiAocHJvcCAmJiAocHJvcC53cml0YWJsZSA9PT0gZmFsc2UgfHwgIXByb3AuY29uZmlndXJhYmxlKSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIEN0b3IucHJvdG90eXBlLnRoZW4gcHJvcGVydHlEZXNjcmlwdG9yIGlzIHdyaXRhYmxlIG9yIG5vdFxuICAgICAgICAgICAgICAgIC8vIGluIG1ldGVvciBlbnYsIHdyaXRhYmxlIGlzIGZhbHNlLCB3ZSBzaG91bGQgaWdub3JlIHN1Y2ggY2FzZVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsVGhlbiA9IHByb3RvLnRoZW47XG4gICAgICAgICAgICAvLyBLZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gICAgICAgICAgICBwcm90b1tzeW1ib2xUaGVuXSA9IG9yaWdpbmFsVGhlbjtcbiAgICAgICAgICAgIEN0b3IucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAob25SZXNvbHZlLCBvblJlamVjdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSBuZXcgWm9uZUF3YXJlUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVGhlbi5jYWxsKHRoaXMsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBwZWQudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBDdG9yW3N5bWJvbFRoZW5QYXRjaGVkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYXBpLnBhdGNoVGhlbiA9IHBhdGNoVGhlbjtcbiAgICAgICAgZnVuY3Rpb24gem9uZWlmeShmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdFByb21pc2UgPSBmbi5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0UHJvbWlzZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFByb21pc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBjdG9yID0gcmVzdWx0UHJvbWlzZS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICBpZiAoIWN0b3Jbc3ltYm9sVGhlblBhdGNoZWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoVGhlbihjdG9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFByb21pc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChOYXRpdmVQcm9taXNlKSB7XG4gICAgICAgICAgICBwYXRjaFRoZW4oTmF0aXZlUHJvbWlzZSk7XG4gICAgICAgICAgICBwYXRjaE1ldGhvZChnbG9iYWwsICdmZXRjaCcsIChkZWxlZ2F0ZSkgPT4gem9uZWlmeShkZWxlZ2F0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoaXMgaXMgbm90IHBhcnQgb2YgcHVibGljIEFQSSwgYnV0IGl0IGlzIHVzZWZ1bCBmb3IgdGVzdHMsIHNvIHdlIGV4cG9zZSBpdC5cbiAgICAgICAgUHJvbWlzZVtab25lLl9fc3ltYm9sX18oJ3VuY2F1Z2h0UHJvbWlzZUVycm9ycycpXSA9IF91bmNhdWdodFByb21pc2VFcnJvcnM7XG4gICAgICAgIHJldHVybiBab25lQXdhcmVQcm9taXNlO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBwYXRjaFRvU3RyaW5nKFpvbmUpIHtcbiAgICAvLyBvdmVycmlkZSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgdG8gbWFrZSB6b25lLmpzIHBhdGNoZWQgZnVuY3Rpb25cbiAgICAvLyBsb29rIGxpa2UgbmF0aXZlIGZ1bmN0aW9uXG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ3RvU3RyaW5nJywgKGdsb2JhbCkgPT4ge1xuICAgICAgICAvLyBwYXRjaCBGdW5jLnByb3RvdHlwZS50b1N0cmluZyB0byBsZXQgdGhlbSBsb29rIGxpa2UgbmF0aXZlXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcbiAgICAgICAgY29uc3QgT1JJR0lOQUxfREVMRUdBVEVfU1lNQk9MID0gem9uZVN5bWJvbCgnT3JpZ2luYWxEZWxlZ2F0ZScpO1xuICAgICAgICBjb25zdCBQUk9NSVNFX1NZTUJPTCA9IHpvbmVTeW1ib2woJ1Byb21pc2UnKTtcbiAgICAgICAgY29uc3QgRVJST1JfU1lNQk9MID0gem9uZVN5bWJvbCgnRXJyb3InKTtcbiAgICAgICAgY29uc3QgbmV3RnVuY3Rpb25Ub1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxEZWxlZ2F0ZSA9IHRoaXNbT1JJR0lOQUxfREVMRUdBVEVfU1lNQk9MXTtcbiAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxEZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9yaWdpbmFsRGVsZWdhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuY2FsbChvcmlnaW5hbERlbGVnYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob3JpZ2luYWxEZWxlZ2F0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFX1NZTUJPTF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYXRpdmVQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nLmNhbGwobmF0aXZlUHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdGl2ZUVycm9yID0gZ2xvYmFsW0VSUk9SX1NZTUJPTF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYXRpdmVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZy5jYWxsKG5hdGl2ZUVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgICAgICAgfTtcbiAgICAgICAgbmV3RnVuY3Rpb25Ub1N0cmluZ1tPUklHSU5BTF9ERUxFR0FURV9TWU1CT0xdID0gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nO1xuICAgICAgICBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPSBuZXdGdW5jdGlvblRvU3RyaW5nO1xuICAgICAgICAvLyBwYXRjaCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nIHRvIGxldCB0aGVtIGxvb2sgbGlrZSBuYXRpdmVcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxPYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gICAgICAgIGNvbnN0IFBST01JU0VfT0JKRUNUX1RPX1NUUklORyA9ICdbb2JqZWN0IFByb21pc2VdJztcbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgUHJvbWlzZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQUk9NSVNFX09CSkVDVF9UT19TVFJJTkc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxPYmplY3RUb1N0cmluZy5jYWxsKHRoaXMpO1xuICAgICAgICB9O1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBwYXRjaENhbGxiYWNrcyhhcGksIHRhcmdldCwgdGFyZ2V0TmFtZSwgbWV0aG9kLCBjYWxsYmFja3MpIHtcbiAgICBjb25zdCBzeW1ib2wgPSBab25lLl9fc3ltYm9sX18obWV0aG9kKTtcbiAgICBpZiAodGFyZ2V0W3N5bWJvbF0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuYXRpdmVEZWxlZ2F0ZSA9ICh0YXJnZXRbc3ltYm9sXSA9IHRhcmdldFttZXRob2RdKTtcbiAgICB0YXJnZXRbbWV0aG9kXSA9IGZ1bmN0aW9uIChuYW1lLCBvcHRzLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRzICYmIG9wdHMucHJvdG90eXBlKSB7XG4gICAgICAgICAgICBjYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2UgPSBgJHt0YXJnZXROYW1lfS4ke21ldGhvZH06OmAgKyBjYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjb25zdCBwcm90b3R5cGUgPSBvcHRzLnByb3RvdHlwZTtcbiAgICAgICAgICAgICAgICAvLyBOb3RlOiB0aGUgYHBhdGNoQ2FsbGJhY2tzYCBpcyB1c2VkIGZvciBwYXRjaGluZyB0aGUgYGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudGAgYW5kXG4gICAgICAgICAgICAgICAgLy8gYGN1c3RvbUVsZW1lbnRzLmRlZmluZWAuIFdlIGV4cGxpY2l0bHkgd3JhcCB0aGUgcGF0Y2hpbmcgY29kZSBpbnRvIHRyeS1jYXRjaCBzaW5jZVxuICAgICAgICAgICAgICAgIC8vIGNhbGxiYWNrcyBtYXkgYmUgYWxyZWFkeSBwYXRjaGVkIGJ5IG90aGVyIHdlYiBjb21wb25lbnRzIGZyYW1ld29ya3MgKGUuZy4gTFdDKSwgYW5kIHRoZXlcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRob3NlIHByb3BlcnRpZXMgbm9uLXdyaXRhYmxlLiBUaGlzIG1lYW5zIHRoYXQgcGF0Y2hpbmcgY2FsbGJhY2sgd2lsbCB0aHJvdyBhbiBlcnJvclxuICAgICAgICAgICAgICAgIC8vIGBjYW5ub3QgYXNzaWduIHRvIHJlYWQtb25seSBwcm9wZXJ0eWAuIFNlZSB0aGlzIGNvZGUgYXMgYW4gZXhhbXBsZTpcbiAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc2FsZXNmb3JjZS9sd2MvYmxvYi9tYXN0ZXIvcGFja2FnZXMvQGx3Yy9lbmdpbmUtY29yZS9zcmMvZnJhbWV3b3JrL2Jhc2UtYnJpZGdlLWVsZW1lbnQudHMjTDE4MC1MMTg2XG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzdG9wIHRoZSBhcHBsaWNhdGlvbiByZW5kZXJpbmcgaWYgd2UgY291bGRuJ3QgcGF0Y2ggc29tZVxuICAgICAgICAgICAgICAgIC8vIGNhbGxiYWNrLCBlLmcuIGBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tgLlxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm90b3R5cGUuaGFzT3duUHJvcGVydHkoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0gYXBpLk9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gYXBpLndyYXBXaXRoQ3VycmVudFpvbmUoZGVzY3JpcHRvci52YWx1ZSwgc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuX3JlZGVmaW5lUHJvcGVydHkob3B0cy5wcm90b3R5cGUsIGNhbGxiYWNrLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3RvdHlwZVtjYWxsYmFja10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm90b3R5cGVbY2FsbGJhY2tdID0gYXBpLndyYXBXaXRoQ3VycmVudFpvbmUocHJvdG90eXBlW2NhbGxiYWNrXSwgc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwcm90b3R5cGVbY2FsbGJhY2tdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm90b3R5cGVbY2FsbGJhY2tdID0gYXBpLndyYXBXaXRoQ3VycmVudFpvbmUocHJvdG90eXBlW2NhbGxiYWNrXSwgc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdGU6IHdlIGxlYXZlIHRoZSBjYXRjaCBibG9jayBlbXB0eSBzaW5jZSB0aGVyZSdzIG5vIHdheSB0byBoYW5kbGUgdGhlIGVycm9yIHJlbGF0ZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gbm9uLXdyaXRhYmxlIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYXRpdmVEZWxlZ2F0ZS5jYWxsKHRhcmdldCwgbmFtZSwgb3B0cywgb3B0aW9ucyk7XG4gICAgfTtcbiAgICBhcGkuYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHRhcmdldFttZXRob2RdLCBuYXRpdmVEZWxlZ2F0ZSk7XG59XG5cbmZ1bmN0aW9uIHBhdGNoVXRpbChab25lKSB7XG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ3V0aWwnLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICAgICAgLy8gQ29sbGVjdCBuYXRpdmUgZXZlbnQgbmFtZXMgYnkgbG9va2luZyBhdCBwcm9wZXJ0aWVzXG4gICAgICAgIC8vIG9uIHRoZSBnbG9iYWwgbmFtZXNwYWNlLCBlLmcuICdvbmNsaWNrJy5cbiAgICAgICAgY29uc3QgZXZlbnROYW1lcyA9IGdldE9uRXZlbnROYW1lcyhnbG9iYWwpO1xuICAgICAgICBhcGkucGF0Y2hPblByb3BlcnRpZXMgPSBwYXRjaE9uUHJvcGVydGllcztcbiAgICAgICAgYXBpLnBhdGNoTWV0aG9kID0gcGF0Y2hNZXRob2Q7XG4gICAgICAgIGFwaS5iaW5kQXJndW1lbnRzID0gYmluZEFyZ3VtZW50cztcbiAgICAgICAgYXBpLnBhdGNoTWFjcm9UYXNrID0gcGF0Y2hNYWNyb1Rhc2s7XG4gICAgICAgIC8vIEluIGVhcmxpZXIgdmVyc2lvbiBvZiB6b25lLmpzICg8MC45LjApLCB3ZSB1c2UgZW52IG5hbWUgYF9fem9uZV9zeW1ib2xfX0JMQUNLX0xJU1RFRF9FVkVOVFNgXG4gICAgICAgIC8vIHRvIGRlZmluZSB3aGljaCBldmVudHMgd2lsbCBub3QgYmUgcGF0Y2hlZCBieSBgWm9uZS5qc2AuIEluIG5ld2VyIHZlcnNpb24gKD49MC45LjApLCB3ZVxuICAgICAgICAvLyBjaGFuZ2UgdGhlIGVudiBuYW1lIHRvIGBfX3pvbmVfc3ltYm9sX19VTlBBVENIRURfRVZFTlRTYCB0byBrZWVwIHRoZSBuYW1lIGNvbnNpc3RlbnQgd2l0aFxuICAgICAgICAvLyBhbmd1bGFyIHJlcG8uIFRoZSAgYF9fem9uZV9zeW1ib2xfX0JMQUNLX0xJU1RFRF9FVkVOVFNgIGlzIGRlcHJlY2F0ZWQsIGJ1dCBpdCBpcyBzdGlsbCBiZVxuICAgICAgICAvLyBzdXBwb3J0ZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBjb25zdCBTWU1CT0xfQkxBQ0tfTElTVEVEX0VWRU5UUyA9IFpvbmUuX19zeW1ib2xfXygnQkxBQ0tfTElTVEVEX0VWRU5UUycpO1xuICAgICAgICBjb25zdCBTWU1CT0xfVU5QQVRDSEVEX0VWRU5UUyA9IFpvbmUuX19zeW1ib2xfXygnVU5QQVRDSEVEX0VWRU5UUycpO1xuICAgICAgICBpZiAoZ2xvYmFsW1NZTUJPTF9VTlBBVENIRURfRVZFTlRTXSkge1xuICAgICAgICAgICAgZ2xvYmFsW1NZTUJPTF9CTEFDS19MSVNURURfRVZFTlRTXSA9IGdsb2JhbFtTWU1CT0xfVU5QQVRDSEVEX0VWRU5UU107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdsb2JhbFtTWU1CT0xfQkxBQ0tfTElTVEVEX0VWRU5UU10pIHtcbiAgICAgICAgICAgIFpvbmVbU1lNQk9MX0JMQUNLX0xJU1RFRF9FVkVOVFNdID0gWm9uZVtTWU1CT0xfVU5QQVRDSEVEX0VWRU5UU10gPVxuICAgICAgICAgICAgICAgIGdsb2JhbFtTWU1CT0xfQkxBQ0tfTElTVEVEX0VWRU5UU107XG4gICAgICAgIH1cbiAgICAgICAgYXBpLnBhdGNoRXZlbnRQcm90b3R5cGUgPSBwYXRjaEV2ZW50UHJvdG90eXBlO1xuICAgICAgICBhcGkucGF0Y2hFdmVudFRhcmdldCA9IHBhdGNoRXZlbnRUYXJnZXQ7XG4gICAgICAgIGFwaS5pc0lFT3JFZGdlID0gaXNJRU9yRWRnZTtcbiAgICAgICAgYXBpLk9iamVjdERlZmluZVByb3BlcnR5ID0gT2JqZWN0RGVmaW5lUHJvcGVydHk7XG4gICAgICAgIGFwaS5PYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICAgICAgIGFwaS5PYmplY3RDcmVhdGUgPSBPYmplY3RDcmVhdGU7XG4gICAgICAgIGFwaS5BcnJheVNsaWNlID0gQXJyYXlTbGljZTtcbiAgICAgICAgYXBpLnBhdGNoQ2xhc3MgPSBwYXRjaENsYXNzO1xuICAgICAgICBhcGkud3JhcFdpdGhDdXJyZW50Wm9uZSA9IHdyYXBXaXRoQ3VycmVudFpvbmU7XG4gICAgICAgIGFwaS5maWx0ZXJQcm9wZXJ0aWVzID0gZmlsdGVyUHJvcGVydGllcztcbiAgICAgICAgYXBpLmF0dGFjaE9yaWdpblRvUGF0Y2hlZCA9IGF0dGFjaE9yaWdpblRvUGF0Y2hlZDtcbiAgICAgICAgYXBpLl9yZWRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuICAgICAgICBhcGkucGF0Y2hDYWxsYmFja3MgPSBwYXRjaENhbGxiYWNrcztcbiAgICAgICAgYXBpLmdldEdsb2JhbE9iamVjdHMgPSAoKSA9PiAoe1xuICAgICAgICAgICAgZ2xvYmFsU291cmNlcyxcbiAgICAgICAgICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzLFxuICAgICAgICAgICAgZXZlbnROYW1lcyxcbiAgICAgICAgICAgIGlzQnJvd3NlcixcbiAgICAgICAgICAgIGlzTWl4LFxuICAgICAgICAgICAgaXNOb2RlLFxuICAgICAgICAgICAgVFJVRV9TVFIsXG4gICAgICAgICAgICBGQUxTRV9TVFIsXG4gICAgICAgICAgICBaT05FX1NZTUJPTF9QUkVGSVgsXG4gICAgICAgICAgICBBRERfRVZFTlRfTElTVEVORVJfU1RSLFxuICAgICAgICAgICAgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUixcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhdGNoQ29tbW9uKFpvbmUpIHtcbiAgICBwYXRjaFByb21pc2UoWm9uZSk7XG4gICAgcGF0Y2hUb1N0cmluZyhab25lKTtcbiAgICBwYXRjaFV0aWwoWm9uZSk7XG59XG5cbmNvbnN0IFpvbmUkMSA9IGxvYWRab25lKCk7XG5wYXRjaENvbW1vbihab25lJDEpO1xucGF0Y2hCcm93c2VyKFpvbmUkMSk7XG4iXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFNLFNBQVM7QUFHZixTQUFTLFdBQVcsTUFBTTtBQUN0QixRQUFNLGVBQWUsT0FBTyxzQkFBc0IsS0FBSztBQUN2RCxTQUFPLGVBQWU7QUFDMUI7QUFDQSxTQUFTLFdBQVc7QUFDaEIsUUFBTSxjQUFjLE9BQU8sYUFBYTtBQUN4QyxXQUFTLEtBQUssTUFBTTtBQUNoQixtQkFBZSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sRUFBRSxJQUFJO0FBQUEsRUFDbEU7QUFDQSxXQUFTLG1CQUFtQixNQUFNLE9BQU87QUFDckMsbUJBQWUsWUFBWSxTQUFTLEtBQUssWUFBWSxTQUFTLEVBQUUsTUFBTSxLQUFLO0FBQUEsRUFDL0U7QUFDQSxPQUFLLE1BQU07QUFDWCxRQUFNLFlBQU4sTUFBTSxVQUFTO0FBQUEsSUFHWCxPQUFPLG9CQUFvQjtBQUN2QixVQUFJLE9BQU8sU0FBUyxNQUFN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TUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0o7QUFBQSxFQUNKLENBQUM7QUFDTDtBQUVBLFNBQVMsWUFBWW1CLE9BQU07QUFDdkIsZUFBYUEsS0FBSTtBQUNqQixnQkFBY0EsS0FBSTtBQUNsQixZQUFVQSxLQUFJO0FBQ2xCO0FBRUEsSUFBTSxTQUFTLFNBQVM7QUFDeEIsWUFBWSxNQUFNO0FBQ2xCLGFBQWEsTUFBTTsiLCJuYW1lcyI6WyJzZWxmIiwiZ2xvYmFsIiwiZGVsZWdhdGUiLCJwcm9wIiwiX2dsb2JhbCIsImV2ZW50IiwicGF0Y2hPcHRpb25zIiwicmV0dXJuVGFyZ2V0Iiwid2luZG93IiwiaGFuZGxlIiwiaGFuZGxlSWQiLCJpc1BlcmlvZGljIiwiaXNSZWZyZXNoYWJsZSIsImlzQnJvd3NlciIsImlzTWl4Iiwiem9uZVN5bWJvbEV2ZW50TmFtZXMiLCJUUlVFX1NUUiIsIkZBTFNFX1NUUiIsIlpPTkVfU1lNQk9MX1BSRUZJWCIsImludGVybmFsV2luZG93IiwiWm9uZSIsIm5hbWUiLCJsb2FkVGFza3MiLCJPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3REZWZpbmVQcm9wZXJ0eSIsIl9fc3ltYm9sX18iLCJ2YWx1ZSJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMF19