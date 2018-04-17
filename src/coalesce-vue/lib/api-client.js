var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { mapToDto, mapValueToDto, convertValueToModel } from './model';
import axios from 'axios';
import * as qs from 'qs';
import Vue from 'vue';
/** Axios instance to be used by all Coalesce API requests. Can be configured as needed. */
export var AxiosClient = axios.create();
var ApiClient = /** @class */ (function () {
    function ApiClient($metadata) {
        this.$metadata = $metadata;
        /** Cancellation token to inject into the next request. */
        this._nextCancelToken = null;
    }
    ApiClient.prototype.$makeCaller = function (resultType, // TODO: Eventually this should be replaced with a metadata object I think
    invokerFactory) {
        var instance;
        switch (resultType) {
            case "item":
                instance = new ItemApiState(this, invokerFactory(this));
                break;
            // Typescript is unhappy with giving TCall to ListApiState. No idea why, since the item one is fine.
            case "list":
                instance = new ListApiState(this, invokerFactory(this));
                break;
            default: throw "Unknown result type " + resultType;
        }
        return instance;
    };
    /**
     * Maps the given method parameters to values suitable for transport.
     * @param method The method whose parameters need mapping
     * @param params The values of the parameter to map
     */
    ApiClient.prototype.$mapParams = function (method, params) {
        var formatted = {};
        for (var paramName in params) {
            var paramMeta = method.params[paramName];
            var paramValue = params[paramName];
            formatted[paramName] = mapValueToDto(params[paramName], paramMeta);
        }
        return formatted;
    };
    /**
     * Combines the input into a single `AxiosRequestConfig` object.
     * @param parameters The Coalesce parameters for the standard API endpoints.
     * @param config A full `AxiosRequestConfig` to merge in.
     * @param queryParams An object with an additional querystring parameters.
     */
    ApiClient.prototype.$options = function (parameters, config, queryParams) {
        // Merge standard Coalesce params with general configured params if there are any.
        var mergedParams = Object.assign({}, queryParams, config && config.params ? config.params : null, this.$serializeParams(parameters));
        // Params come last to overwrite config.params with our merged params object.
        return Object.assign({}, { cancelToken: this._nextCancelToken && this._nextCancelToken.token }, config, { params: mergedParams });
    };
    ApiClient.prototype.$serializeParams = function (parameters) {
        if (!parameters)
            return null;
        // Assume the widest type, which is ListParameters.
        var wideParams = parameters;
        // The list of 'simple' params where we just pass along the exact value.
        var simpleParams = [
            'includes', 'search', 'page', 'pageSize', 'orderBy', 'orderByDescending'
        ];
        // Map all the simple params to `paramsObject`
        var paramsObject = simpleParams.reduce(function (obj, key) {
            if (key in wideParams)
                obj[key] = wideParams[key];
            return obj;
        }, {});
        // Map the 'filter' object, ensuring all values are strings.
        var filter = wideParams.filter;
        if (typeof filter == 'object') {
            paramsObject.filter = Object.keys(filter).reduce(function (obj, key) {
                if (filter[key] !== undefined) {
                    obj[key] = new String(filter[key]);
                }
                return obj;
            }, {});
        }
        if (Array.isArray(wideParams.fields)) {
            paramsObject.fields = wideParams.fields.join(',');
        }
        // Map the data source and its params
        var dataSource = wideParams.dataSource;
        if (dataSource) {
            // Add the data source name
            paramsObject["dataSource"] = dataSource.$metadata.name;
            var paramsMeta = dataSource.$metadata.params;
            // Add the data source parameters.
            // Note that we use "dataSource.{paramName}", not a nested object. 
            // This is what the model binder expects.
            for (var paramName in paramsMeta) {
                var paramMeta = paramsMeta[paramName];
                if (paramName in dataSource) {
                    var paramValue = dataSource[paramName];
                    paramsObject["dataSource." + paramMeta.name] = mapValueToDto(paramValue, paramMeta);
                }
            }
        }
        return paramsObject;
    };
    ApiClient.prototype.$hydrateItemResult = function (value, metadata) {
        // Do nothing for void returns - there will be no object.
        if (metadata.type !== "void") {
            // This function is NOT PURE - we mutate the result object on the response.
            value.data.object = convertValueToModel(value.data.object, metadata);
        }
        return value;
    };
    ApiClient.prototype.$hydrateListResult = function (value, metadata) {
        // This function is NOT PURE - we mutate the result object on the response.
        value.data.list = convertValueToModel(value.data.list, metadata);
        return value;
    };
    return ApiClient;
}());
export { ApiClient };
var ModelApiClient = /** @class */ (function (_super) {
    __extends(ModelApiClient, _super);
    function ModelApiClient() {
        // TODO: should the standard set of endpoints be prefixed with '$'?
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Value metadata for handling ItemResult returns from the standard API endpoints. */
        _this.$itemValueMeta = Object.freeze({
            name: "object", displayName: "",
            type: "model",
            role: "value",
            typeDef: _this.$metadata,
        });
        /** Value metadata for handling ListResult returns from the standard API endpoints. */
        _this.$collectionValueMeta = Object.freeze({
            name: "list", displayName: "",
            type: "collection",
            role: "value",
            itemType: _this.$itemValueMeta,
        });
        return _this;
    }
    ModelApiClient.prototype.get = function (id, parameters, config) {
        var _this = this;
        return AxiosClient
            .get("/" + this.$metadata.controllerRoute + "/get/" + id, this.$options(parameters, config))
            .then(function (r) { return _this.$hydrateItemResult(r, _this.$itemValueMeta); });
    };
    ModelApiClient.prototype.list = function (parameters, config) {
        var _this = this;
        return AxiosClient
            .get("/" + this.$metadata.controllerRoute + "/list", this.$options(parameters, config))
            .then(function (r) { return _this.$hydrateListResult(r, _this.$collectionValueMeta); });
    };
    ModelApiClient.prototype.count = function (parameters, config) {
        return AxiosClient
            .get("/" + this.$metadata.controllerRoute + "/count", this.$options(parameters, config));
    };
    ModelApiClient.prototype.save = function (item, parameters, config) {
        var _this = this;
        return AxiosClient
            .post("/" + this.$metadata.controllerRoute + "/save", qs.stringify(mapToDto(item)), this.$options(parameters, config))
            .then(function (r) { return _this.$hydrateItemResult(r, _this.$itemValueMeta); });
    };
    ModelApiClient.prototype.delete = function (id, parameters, config) {
        var _this = this;
        return AxiosClient
            .post("/" + this.$metadata.controllerRoute + "/delete/" + id, null, this.$options(parameters, config))
            .then(function (r) { return _this.$hydrateItemResult(r, _this.$itemValueMeta); });
    };
    return ModelApiClient;
}(ApiClient));
export { ModelApiClient };
var ServiceApiClient = /** @class */ (function (_super) {
    __extends(ServiceApiClient, _super);
    function ServiceApiClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServiceApiClient;
}(ApiClient));
export { ServiceApiClient };
var ApiState = /** @class */ (function (_super) {
    __extends(ApiState, _super);
    function ApiState(apiClient, invoker) {
        var _newTarget = this.constructor;
        var _this = _super.call(this) || this;
        _this.apiClient = apiClient;
        _this.invoker = invoker;
        /** True if a request is currently pending. */
        _this.isLoading = false;
        /** True if the previous request was successful. */
        _this.wasSuccessful = null;
        /** Error message returned by the previous request. */
        _this.message = null;
        // Frozen to prevent unneeded reactivity.
        _this._callbacks = Object.freeze({ onFulfilled: [], onRejected: [] });
        // Create our invoker function that will ultimately be our instance object.
        var invokeFunc = function invokeFunc() {
            return invoke._invokeInternal(this, arguments);
        };
        // Copy all properties from the class to the function.
        var invoke = Object.assign(invokeFunc, _this);
        invoke.invoke = invoke;
        // Make properties reactive. Works around https://github.com/vuejs/vue/issues/6648 
        for (var stateProp in _this) {
            var value = _this[stateProp];
            // Don't define sealed object properties (e.g. this._callbacks)
            if (value == null || typeof value !== "object" || !Object.isSealed(value)) {
                Vue.util.defineReactive(invoke, stateProp, _this[stateProp], null, true);
            }
        }
        Object.setPrototypeOf(invoke, _newTarget.prototype);
        return invoke;
    }
    /**
     * Function that can be called to cancel a pending request.
    */
    ApiState.prototype.cancel = function () {
        if (this._cancelToken) {
            this._cancelToken.cancel();
            this.isLoading = false;
        }
    };
    /**
     * Attach a callback to be invoked when the request to this endpoint succeeds.
     * @param onFulfilled A callback to be called when a request to this endpoint succeeds.
     */
    ApiState.prototype.onFulfilled = function (callback) {
        this._callbacks.onFulfilled.push(callback);
        return this;
    };
    /**
     * Attach a callback to be invoked when the request to this endpoint fails.
     * @param onFulfilled A callback to be called when a request to this endpoint fails.
     */
    ApiState.prototype.onRejected = function (callback) {
        this._callbacks.onFulfilled.push(callback);
        return this;
    };
    ApiState.prototype._invokeInternal = function (thisArg, args) {
        var _this = this;
        if (this.isLoading) {
            throw "Request is already pending for invoker " + this.invoker.toString();
        }
        this.wasSuccessful = null;
        this.message = null;
        this.isLoading = true;
        // Inject a cancellation token into the request.
        var promise;
        try {
            var token = this.apiClient._nextCancelToken = axios.CancelToken.source();
            this._cancelToken = token;
            promise = this.invoker.apply(thisArg, args);
        }
        finally {
            this.apiClient._nextCancelToken = null;
        }
        return promise
            .then(function (resp) {
            var data = resp.data;
            delete _this._cancelToken;
            _this.setResponseProps(data);
            _this._callbacks.onFulfilled.forEach(function (cb) { return cb.apply(thisArg, [_this]); });
            _this.isLoading = false;
            // We have to maintain the shape of the promise of the stateless invoke method.
            // This means we can't re-shape ourselves into a Promise<ApiState<T>> with `return fn` here.
            // The reason for this is that we can't change the return type of TCall while maintaining 
            // the param signature (unless we required a full, explicit type annotation as a type parameter,
            // but this would make the usability of apiCallers very unpleasant.)
            // We could do this easily with https://github.com/Microsoft/TypeScript/issues/5453,
            // but changing the implementation would be a significant breaking change by then.
            return resp;
        }, function (thrown) {
            if (axios.isCancel(thrown)) {
                // No handling of anything for cancellations.
                // A cancellation is deliberate and shouldn't be treated as an error state. Callbacks should not be called either - pretend the request never happened.
                // If a compelling case for invoking callbacks on cancel is found,
                // it should probably be implemented as a separate set of callbacks.
                // We don't set isLoading to false here - we set it in the cancel() method to ensure that we don't set isLoading=false for a subsequent call,
                // since the promise won't reject immediately after requesting cancelation. There could already be another request pending when this code is being executed.
                return;
            }
            else {
                var error = thrown;
            }
            delete _this._cancelToken;
            _this.wasSuccessful = false;
            var result = error.response;
            if (result) {
                var data = result.data;
                _this.setResponseProps(data);
            }
            else {
                // TODO: i18n
                _this.message = error.message || "A network error occurred";
            }
            _this._callbacks.onRejected.forEach(function (cb) { return cb.apply(thisArg, [_this]); });
            _this.isLoading = false;
            return error;
        });
    };
    return ApiState;
}(Function));
export { ApiState };
var ItemApiState = /** @class */ (function (_super) {
    __extends(ItemApiState, _super);
    function ItemApiState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Validation issues returned by the previous request. */
        _this.validationIssues = null;
        /** Principal data returned by the previous request. */
        _this.result = null;
        return _this;
    }
    ItemApiState.prototype.setResponseProps = function (data) {
        this.wasSuccessful = data.wasSuccessful;
        this.message = data.message || null;
        if ("validationIssues" in data) {
            this.validationIssues = data.validationIssues || null;
        }
        else {
            this.validationIssues = null;
        }
        if ("object" in data) {
            this.result = data.object || null;
        }
        else {
            this.result = null;
        }
    };
    return ItemApiState;
}(ApiState));
export { ItemApiState };
var ListApiState = /** @class */ (function (_super) {
    __extends(ListApiState, _super);
    function ListApiState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Page number returned by the previous request. */
        _this.page = null;
        /** Page size returned by the previous request. */
        _this.pageSize = null;
        /** Page count returned by the previous request. */
        _this.pageCount = null;
        /** Total Count returned by the previous request. */
        _this.totalCount = null;
        /** Principal data returned by the previous request. */
        _this.result = null;
        return _this;
    }
    ListApiState.prototype.setResponseProps = function (data) {
        this.wasSuccessful = data.wasSuccessful;
        this.message = data.message || null;
        this.page = data.page;
        this.pageSize = data.pageSize;
        this.pageCount = data.pageCount;
        this.totalCount = data.totalCount;
        if ("list" in data) {
            this.result = data.list || [];
        }
        else {
            this.result = null;
        }
    };
    return ListApiState;
}(ApiState));
export { ListApiState };
