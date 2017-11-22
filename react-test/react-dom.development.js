/** @license React v16.1.1
 * react-dom.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(require('react'))
        : typeof define === 'function' && define.amd
            ? define(['react'], factory)
            : (global.ReactDOM = factory(global.React));
}(this, (function (React) {
    'use strict';

    /**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

    /**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

    var validateFormat = function validateFormat(format) {};

    {
        validateFormat = function validateFormat(format) {
            if (format === undefined) {
                throw new Error('invariant requires an error message argument');
            }
        };
    }

    function invariant(condition, format, a, b, c, d, e, f) {
        validateFormat(format);

        if (!condition) {
            var error;
            if (format === undefined) {
                error = new Error('Minified exception occurred; use the non-minified dev environment for the full e' +
                        'rror message and additional helpful warnings.');
            } else {
                var args = [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f
                ];
                var argIndex = 0;
                error = new Error(format.replace(/%s/g, function () {
                    return args[argIndex++];
                }));
                error.name = 'Invariant Violation';
            }

            error.framesToPop = 1; // we don't care about invariant's own frame
            throw error;
        }
    }

    var invariant_1$1 = invariant;

    !React
        ? invariant_1$1(false, 'ReactDOM was loaded before React. Make sure you load the React package before lo' +
                'ading ReactDOM.')
        : void 0;

    // These attributes should be all lowercase to allow for case insensitive checks
    var RESERVED_PROPS = {
        children: true,
        dangerouslySetInnerHTML: true,
        defaultValue: true,
        defaultChecked: true,
        innerHTML: true,
        suppressContentEditableWarning: true,
        suppressHydrationWarning: true,
        style: true
    };

    function checkMask(value, bitmask) {
        return (value & bitmask) === bitmask;
    }

    var DOMPropertyInjection = {
        /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
        MUST_USE_PROPERTY: 0x1,
        HAS_BOOLEAN_VALUE: 0x4,
        HAS_NUMERIC_VALUE: 0x8,
        HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
        HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,
        HAS_STRING_BOOLEAN_VALUE: 0x40,

        /**
   * Inject some specialized knowledge about the DOM. This takes a config object
   * with the following properties:
   *
   * Properties: object mapping DOM property name to one of the
   * DOMPropertyInjection constants or null. If your attribute isn't in here,
   * it won't get written to the DOM.
   *
   * DOMAttributeNames: object mapping React attribute name to the DOM
   * attribute name. Attribute names not specified use the **lowercase**
   * normalized name.
   *
   * DOMAttributeNamespaces: object mapping React attribute name to the DOM
   * attribute namespace URL. (Attribute names not specified use no namespace.)
   *
   * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
   * Property names not specified use the normalized name.
   *
   * DOMMutationMethods: Properties that require special mutation methods. If
   * `value` is undefined, the mutation method should unset the property.
   *
   * @param {object} domPropertyConfig the config as described above.
   */
        injectDOMPropertyConfig: function (domPropertyConfig) {
            var Injection = DOMPropertyInjection;
            var Properties = domPropertyConfig.Properties || {};
            var DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
            var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
            var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

            for (var propName in Properties) {
                !!properties.hasOwnProperty(propName)
                    ? invariant_1$1(false, "injectDOMPropertyConfig(...): You're trying to inject DOM property '%s' which ha" +
                            "s already been injected. You may be accidentally injecting the same DOM property" +
                            " config twice, or you may be injecting two configs that have conflicting propert" +
                            "y names.",
                    propName)
                    : void 0;

                var lowerCased = propName.toLowerCase();
                var propConfig = Properties[propName];

                var propertyInfo = {
                    attributeName: lowerCased,
                    attributeNamespace: null,
                    propertyName: propName,
                    mutationMethod: null,

                    mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
                    hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
                    hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
                    hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
                    hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE),
                    hasStringBooleanValue: checkMask(propConfig, Injection.HAS_STRING_BOOLEAN_VALUE)
                };
                !(propertyInfo.hasBooleanValue + propertyInfo.hasNumericValue + propertyInfo.hasOverloadedBooleanValue <= 1)
                    ? invariant_1$1(false, "DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, " +
                            "but not a combination: %s",
                    propName)
                    : void 0;

                if (DOMAttributeNames.hasOwnProperty(propName)) {
                    var attributeName = DOMAttributeNames[propName];

                    propertyInfo.attributeName = attributeName;
                }

                if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
                    propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName];
                }

                if (DOMMutationMethods.hasOwnProperty(propName)) {
                    propertyInfo.mutationMethod = DOMMutationMethods[propName];
                }

                // Downcase references to whitelist properties to check for membership without
                // case-sensitivity. This allows the whitelist to pick up `allowfullscreen`,
                // which should be written using the property configuration for
                // `allowFullscreen`
                properties[propName] = propertyInfo;
            }
        }
    };

    /* eslint-disable max-len */
    var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-" +
            "\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-" +
            "\\uFDCF\\uFDF0-\\uFFFD";
    /* eslint-enable max-len */
    var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";

    var ROOT_ATTRIBUTE_NAME = 'data-reactroot';

    /**
 * Map from property "standard name" to an object with info about how to set
 * the property in the DOM. Each object contains:
 *
 * attributeName:
 *   Used when rendering markup or with `*Attribute()`.
 * attributeNamespace
 * propertyName:
 *   Used on DOM node instances. (This includes properties that mutate due to
 *   external factors.)
 * mutationMethod:
 *   If non-null, used instead of the property or `setAttribute()` after
 *   initial render.
 * mustUseProperty:
 *   Whether the property must be accessed and mutated as an object property.
 * hasBooleanValue:
 *   Whether the property should be removed when set to a falsey value.
 * hasNumericValue:
 *   Whether the property must be numeric or parse as a numeric and should be
 *   removed when set to a falsey value.
 * hasPositiveNumericValue:
 *   Whether the property must be positive numeric or parse as a positive
 *   numeric and should be removed when set to a falsey value.
 * hasOverloadedBooleanValue:
 *   Whether the property can be used as a flag as well as with a value.
 *   Removed when strictly equal to false; present without a value when
 *   strictly equal to true; present with a value otherwise.
 */
    var properties = {};

    /**
 * Checks whether a property name is a writeable attribute.
 * @method
 */
    function shouldSetAttribute(name, value) {
        if (isReservedProp(name)) {
            return false;
        }
        if (name.length > 2 && (name[0] === 'o' || name[0] === 'O') && (name[1] === 'n' || name[1] === 'N')) {
            return false;
        }
        if (value === null) {
            return true;
        }
        switch (typeof value) {
            case 'boolean':
                return shouldAttributeAcceptBooleanValue(name);
            case 'undefined':
            case 'number':
            case 'string':
            case 'object':
                return true;
            default:
                // function, symbol
                return false;
        }
    }

    function getPropertyInfo(name) {
        return properties.hasOwnProperty(name)
            ? properties[name]
            : null;
    }

    function shouldAttributeAcceptBooleanValue(name) {
        if (isReservedProp(name)) {
            return true;
        }
        var propertyInfo = getPropertyInfo(name);
        if (propertyInfo) {
            return propertyInfo.hasBooleanValue || propertyInfo.hasStringBooleanValue || propertyInfo.hasOverloadedBooleanValue;
        }
        var prefix = name
            .toLowerCase()
            .slice(0, 5);
        return prefix === 'data-' || prefix === 'aria-';
    }

    /**
 * Checks to see if a property name is within the list of properties
 * reserved for internal React operations. These properties should
 * not be set on an HTML element.
 *
 * @private
 * @param {string} name
 * @return {boolean} If the name is within reserved props
 */
    function isReservedProp(name) {
        return RESERVED_PROPS.hasOwnProperty(name);
    }

    var injection = DOMPropertyInjection;

    var MUST_USE_PROPERTY = injection.MUST_USE_PROPERTY;
    var HAS_BOOLEAN_VALUE = injection.HAS_BOOLEAN_VALUE;
    var HAS_NUMERIC_VALUE = injection.HAS_NUMERIC_VALUE;
    var HAS_POSITIVE_NUMERIC_VALUE = injection.HAS_POSITIVE_NUMERIC_VALUE;
    var HAS_OVERLOADED_BOOLEAN_VALUE = injection.HAS_OVERLOADED_BOOLEAN_VALUE;
    var HAS_STRING_BOOLEAN_VALUE = injection.HAS_STRING_BOOLEAN_VALUE;

    var HTMLDOMPropertyConfig = {
        // When adding attributes to this list, be sure to also add them to the
        // `possibleStandardNames` module to ensure casing and incorrect name warnings.
        Properties: {
            allowFullScreen: HAS_BOOLEAN_VALUE,
            // specifies target context for links with `preload` type
            async: HAS_BOOLEAN_VALUE,
            // Note: there is a special case that prevents it from being written to the DOM
            // on the client side because the browsers are inconsistent. Instead we call
            // focus().
            autoFocus: HAS_BOOLEAN_VALUE,
            autoPlay: HAS_BOOLEAN_VALUE,
            capture: HAS_OVERLOADED_BOOLEAN_VALUE,
            checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
            cols: HAS_POSITIVE_NUMERIC_VALUE,
            contentEditable: HAS_STRING_BOOLEAN_VALUE,
            controls: HAS_BOOLEAN_VALUE,
            'default': HAS_BOOLEAN_VALUE,
            defer: HAS_BOOLEAN_VALUE,
            disabled: HAS_BOOLEAN_VALUE,
            download: HAS_OVERLOADED_BOOLEAN_VALUE,
            draggable: HAS_STRING_BOOLEAN_VALUE,
            formNoValidate: HAS_BOOLEAN_VALUE,
            hidden: HAS_BOOLEAN_VALUE,
            loop: HAS_BOOLEAN_VALUE,
            // Caution; `option.selected` is not updated if `select.multiple` is disabled
            // with `removeAttribute`.
            multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
            muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
            noValidate: HAS_BOOLEAN_VALUE,
            open: HAS_BOOLEAN_VALUE,
            playsInline: HAS_BOOLEAN_VALUE,
            readOnly: HAS_BOOLEAN_VALUE,
            required: HAS_BOOLEAN_VALUE,
            reversed: HAS_BOOLEAN_VALUE,
            rows: HAS_POSITIVE_NUMERIC_VALUE,
            rowSpan: HAS_NUMERIC_VALUE,
            scoped: HAS_BOOLEAN_VALUE,
            seamless: HAS_BOOLEAN_VALUE,
            selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
            size: HAS_POSITIVE_NUMERIC_VALUE,
            start: HAS_NUMERIC_VALUE,
            // support for projecting regular DOM Elements via V1 named slots ( shadow dom )
            span: HAS_POSITIVE_NUMERIC_VALUE,
            spellCheck: HAS_STRING_BOOLEAN_VALUE,
            // Style must be explicitly set in the attribute list. React components expect a
            // style object
            style: 0,
            // Keep it in the whitelist because it is case-sensitive for SVG.
            tabIndex: 0,
            // itemScope is for for Microdata support. See http://schema.org/docs/gs.html
            itemScope: HAS_BOOLEAN_VALUE,
            // These attributes must stay in the white-list because they have different
            // attribute names (see DOMAttributeNames below)
            acceptCharset: 0,
            className: 0,
            htmlFor: 0,
            httpEquiv: 0,
            // Attributes with mutation methods must be specified in the whitelist Set the
            // string boolean flag to allow the behavior
            value: HAS_STRING_BOOLEAN_VALUE
        },
        DOMAttributeNames: {
            acceptCharset: 'accept-charset',
            className: 'class',
            htmlFor: 'for',
            httpEquiv: 'http-equiv'
        },
        DOMMutationMethods: {
            value: function (node, value) {
                if (value == null) {
                    return node.removeAttribute('value');
                }

                // Number inputs get special treatment due to some edge cases in Chrome. Let
                // everything else assign the value attribute as normal.
                // https://github.com/facebook/react/issues/7253#issuecomment-236074326
                if (node.type !== 'number' || node.hasAttribute('value') === false) {
                    node.setAttribute('value', '' + value);
                } else if (node.validity && !node.validity.badInput && node.ownerDocument.activeElement !== node) {
                    // Don't assign an attribute if validation reports bad input. Chrome will clear
                    // the value. Additionally, don't operate on inputs that have focus, otherwise
                    // Chrome might strip off trailing decimal places and cause the user's cursor
                    // position to jump to the beginning of the input.
                    //
                    // In ReactDOMInput, we have an onBlur event that will trigger this function
                    // again when focus is lost.
                    node.setAttribute('value', '' + value);
                }
            }
        }
    };

    var HAS_STRING_BOOLEAN_VALUE$1 = injection.HAS_STRING_BOOLEAN_VALUE;

    var NS = {
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace'
    };

    /**
 * This is a list of all SVG attributes that need special casing,
 * namespacing, or boolean value assignment.
 *
 * When adding attributes to this list, be sure to also add them to
 * the `possibleStandardNames` module to ensure casing and incorrect
 * name warnings.
 *
 * SVG Attributes List:
 * https://www.w3.org/TR/SVG/attindex.html
 * SMIL Spec:
 * https://www.w3.org/TR/smil
 */
    var ATTRS = [
        'accent-height',
        'alignment-baseline',
        'arabic-form',
        'baseline-shift',
        'cap-height',
        'clip-path',
        'clip-rule',
        'color-interpolation',
        'color-interpolation-filters',
        'color-profile',
        'color-rendering',
        'dominant-baseline',
        'enable-background',
        'fill-opacity',
        'fill-rule',
        'flood-color',
        'flood-opacity',
        'font-family',
        'font-size',
        'font-size-adjust',
        'font-stretch',
        'font-style',
        'font-variant',
        'font-weight',
        'glyph-name',
        'glyph-orientation-horizontal',
        'glyph-orientation-vertical',
        'horiz-adv-x',
        'horiz-origin-x',
        'image-rendering',
        'letter-spacing',
        'lighting-color',
        'marker-end',
        'marker-mid',
        'marker-start',
        'overline-position',
        'overline-thickness',
        'paint-order',
        'panose-1',
        'pointer-events',
        'rendering-intent',
        'shape-rendering',
        'stop-color',
        'stop-opacity',
        'strikethrough-position',
        'strikethrough-thickness',
        'stroke-dasharray',
        'stroke-dashoffset',
        'stroke-linecap',
        'stroke-linejoin',
        'stroke-miterlimit',
        'stroke-opacity',
        'stroke-width',
        'text-anchor',
        'text-decoration',
        'text-rendering',
        'underline-position',
        'underline-thickness',
        'unicode-bidi',
        'unicode-range',
        'units-per-em',
        'v-alphabetic',
        'v-hanging',
        'v-ideographic',
        'v-mathematical',
        'vector-effect',
        'vert-adv-y',
        'vert-origin-x',
        'vert-origin-y',
        'word-spacing',
        'writing-mode',
        'x-height',
        'xlink:actuate',
        'xlink:arcrole',
        'xlink:href',
        'xlink:role',
        'xlink:show',
        'xlink:title',
        'xlink:type',
        'xml:base',
        'xmlns:xlink',
        'xml:lang',
        'xml:space'
    ];

    var SVGDOMPropertyConfig = {
        Properties: {
            autoReverse: HAS_STRING_BOOLEAN_VALUE$1,
            externalResourcesRequired: HAS_STRING_BOOLEAN_VALUE$1,
            preserveAlpha: HAS_STRING_BOOLEAN_VALUE$1
        },
        DOMAttributeNames: {
            autoReverse: 'autoReverse',
            externalResourcesRequired: 'externalResourcesRequired',
            preserveAlpha: 'preserveAlpha'
        },
        DOMAttributeNamespaces: {
            xlinkActuate: NS.xlink,
            xlinkArcrole: NS.xlink,
            xlinkHref: NS.xlink,
            xlinkRole: NS.xlink,
            xlinkShow: NS.xlink,
            xlinkTitle: NS.xlink,
            xlinkType: NS.xlink,
            xmlBase: NS.xml,
            xmlLang: NS.xml,
            xmlSpace: NS.xml
        }
    };

    var CAMELIZE = /[\-\:]([a-z])/g;
    var capitalize = function (token) {
        return token[1].toUpperCase();
    };

    ATTRS.forEach(function (original) {
        var reactName = original.replace(CAMELIZE, capitalize);

        SVGDOMPropertyConfig.Properties[reactName] = 0;
        SVGDOMPropertyConfig.DOMAttributeNames[reactName] = original;
    });

    injection.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
    injection.injectDOMPropertyConfig(SVGDOMPropertyConfig);

    var ReactErrorUtils = {
        // Used by Fiber to simulate a try-catch.
        _caughtError: null,
        _hasCaughtError: false,

        // Used by event system to capture/rethrow the first error.
        _rethrowError: null,
        _hasRethrowError: false,

        injection: {
            injectErrorUtils: function (injectedErrorUtils) {
                !(typeof injectedErrorUtils.invokeGuardedCallback === 'function')
                    ? invariant_1$1(false, 'Injected invokeGuardedCallback() must be a function.')
                    : void 0;
                invokeGuardedCallback = injectedErrorUtils.invokeGuardedCallback;
            }
        },

        /**
   * Call a function while guarding against errors that happens within it.
   * Returns an error if it throws, otherwise null.
   *
   * In production, this is implemented using a try-catch. The reason we don't
   * use a try-catch directly is so that we can swap out a different
   * implementation in DEV mode.
   *
   * @param {String} name of the guard to use for logging or debugging
   * @param {Function} func The function to invoke
   * @param {*} context The context to use when calling the function
   * @param {...*} args Arguments for function
   */
        invokeGuardedCallback: function (name, func, context, a, b, c, d, e, f) {
            invokeGuardedCallback.apply(ReactErrorUtils, arguments);
        },

        /**
   * Same as invokeGuardedCallback, but instead of returning an error, it stores
   * it in a global so it can be rethrown by `rethrowCaughtError` later.
   * TODO: See if _caughtError and _rethrowError can be unified.
   *
   * @param {String} name of the guard to use for logging or debugging
   * @param {Function} func The function to invoke
   * @param {*} context The context to use when calling the function
   * @param {...*} args Arguments for function
   */
        invokeGuardedCallbackAndCatchFirstError: function (name, func, context, a, b, c, d, e, f) {
            ReactErrorUtils
                .invokeGuardedCallback
                .apply(this, arguments);
            if (ReactErrorUtils.hasCaughtError()) {
                var error = ReactErrorUtils.clearCaughtError();
                if (!ReactErrorUtils._hasRethrowError) {
                    ReactErrorUtils._hasRethrowError = true;
                    ReactErrorUtils._rethrowError = error;
                }
            }
        },

        /**
   * During execution of guarded functions we will capture the first error which
   * we will rethrow to be handled by the top level error handler.
   */
        rethrowCaughtError: function () {
            return rethrowCaughtError.apply(ReactErrorUtils, arguments);
        },

        hasCaughtError: function () {
            return ReactErrorUtils._hasCaughtError;
        },

        clearCaughtError: function () {
            if (ReactErrorUtils._hasCaughtError) {
                var error = ReactErrorUtils._caughtError;
                ReactErrorUtils._caughtError = null;
                ReactErrorUtils._hasCaughtError = false;
                return error;
            } else {
                invariant_1$1(false, 'clearCaughtError was called but no error was captured. This error is likely caus' +
                        'ed by a bug in React. Please file an issue.');
            }
        }
    };

    var invokeGuardedCallback = function (name, func, context, a, b, c, d, e, f) {
        ReactErrorUtils._hasCaughtError = false;
        ReactErrorUtils._caughtError = null;
        var funcArgs = Array
            .prototype
            .slice
            .call(arguments, 3);
        try {
            func.apply(context, funcArgs);
        } catch (error) {
            ReactErrorUtils._caughtError = error;
            ReactErrorUtils._hasCaughtError = true;
        }
    };

    {
        // In DEV mode, we swap out invokeGuardedCallback for a special version that
        // plays more nicely with the browser's DevTools. The idea is to preserve "Pause
        // on exceptions" behavior. Because React wraps all user-provided functions in
        // invokeGuardedCallback, and the production version of invokeGuardedCallback
        // uses a try-catch, all user exceptions are treated like caught exceptions, and
        // the DevTools won't pause unless the developer takes the extra step of
        // enabling pause on caught exceptions. This is untintuitive, though, because
        // even though React has caught the error, from the developer's perspective, the
        // error is uncaught.
        //
        // To preserve the expected "Pause on exceptions" behavior, we don't use a
        // try-catch in DEV. Instead, we synchronously dispatch a fake event to a fake
        // DOM node, and call the user-provided callback from inside an event handler
        // for that fake event. If the callback throws, the error is "captured" using a
        // global event handler. But because the error happens in a different event loop
        // context, it does not interrupt the normal program flow. Effectively, this
        // gives us try-catch behavior without actually using try-catch. Neat! Check
        // that the browser supports the APIs we need to implement our special DEV
        // version of invokeGuardedCallback
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof document !== 'undefined' && typeof document.createEvent === 'function') {
            var fakeNode = document.createElement('react');

            var invokeGuardedCallbackDev = function (name, func, context, a, b, c, d, e, f) {
                // Keeps track of whether the user-provided callback threw an error. We set this
                // to true at the beginning, then set it to false right after calling the
                // function. If the function errors, `didError` will never be set to false. This
                // strategy works even if the browser is flaky and fails to call our global
                // error handler, because it doesn't rely on the error event at all.
                var didError = true;

                // Create an event handler for our fake event. We will synchronously dispatch
                // our fake event using `dispatchEvent`. Inside the handler, we call the
                // user-provided callback.
                var funcArgs = Array
                    .prototype
                    .slice
                    .call(arguments, 3);
                function callCallback() {
                    // We immediately remove the callback from event listeners so that nested
                    // `invokeGuardedCallback` calls do not clash. Otherwise, a nested call would
                    // trigger the fake event handlers of any call higher in the stack.
                    fakeNode.removeEventListener(evtType, callCallback, false);
                    func.apply(context, funcArgs);
                    didError = false;
                }

                // Create a global error event handler. We use this to capture the value that
                // was thrown. It's possible that this error handler will fire more than once;
                // for example, if non-React code also calls `dispatchEvent` and a handler for
                // that event throws. We should be resilient to most of those cases. Even if our
                // error event handler fires more than once, the last error event is always
                // used. If the callback actually does error, we know that the last error event
                // is the correct one, because it's not possible for anything else to have
                // happened in between our callback erroring and the code that follows the
                // `dispatchEvent` call below. If the callback doesn't error, but the error
                // event was fired, we know to ignore it because `didError` will be false, as
                // described above.
                var error = void 0;
                // Use this to track whether the error event is ever called.
                var didSetError = false;
                var isCrossOriginError = false;

                function onError(event) {
                    error = event.error;
                    didSetError = true;
                    if (error === null && event.colno === 0 && event.lineno === 0) {
                        isCrossOriginError = true;
                    }
                }

                // Create a fake event type.
                var evtType = 'react-' + (name
                    ? name
                    : 'invokeguardedcallback');

                // Attach our event handlers
                window.addEventListener('error', onError);
                fakeNode.addEventListener(evtType, callCallback, false);

                // Synchronously dispatch our fake event. If the user-provided function errors,
                // it will trigger our global error handler.
                var evt = document.createEvent('Event');
                evt.initEvent(evtType, false, false);
                fakeNode.dispatchEvent(evt);

                if (didError) {
                    if (!didSetError) {
                        // The callback errored, but the error event never fired.
                        error = new Error('An error was thrown inside one of your components, but React doesn't know what i' +
                                't was. This is likely due to browser flakiness. React does its best to preserve ' +
                                'the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode' +
                                ' only tricks. It's possible that these don't work in your browser. Try triggerin' +
                                'g the error in production mode, or switching to a modern browser. If you suspect' +
                                ' that this is actually an issue with React, please file an issue.');
                    } else if (isCrossOriginError) {
                        error = new Error("A cross-origin error was thrown. React doesn't have access to the actual error o" +
                                "bject in development. See https://fb.me/react-crossorigin-error for more informa" +
                                "tion.");
                    }
                    ReactErrorUtils._hasCaughtError = true;
                    ReactErrorUtils._caughtError = error;
                } else {
                    ReactErrorUtils._hasCaughtError = false;
                    ReactErrorUtils._caughtError = null;
                }

                // Remove our event listeners
                window.removeEventListener('error', onError);
            };

            invokeGuardedCallback = invokeGuardedCallbackDev;
        }
    }

    var rethrowCaughtError = function () {
        if (ReactErrorUtils._hasRethrowError) {
            var error = ReactErrorUtils._rethrowError;
            ReactErrorUtils._rethrowError = null;
            ReactErrorUtils._hasRethrowError = false;
            throw error;
        }
    };

    /**
 * Injectable ordering of event plugins.
 */
    var eventPluginOrder = null;

    /**
 * Injectable mapping from names to event plugin modules.
 */
    var namesToPlugins = {};

    /**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */
    function recomputePluginOrdering() {
        if (!eventPluginOrder) {
            // Wait until an `eventPluginOrder` is injected.
            return;
        }
        for (var pluginName in namesToPlugins) {
            var pluginModule = namesToPlugins[pluginName];
            var pluginIndex = eventPluginOrder.indexOf(pluginName);
            !(pluginIndex > -1)
                ? invariant_1$1(false, 'EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin' +
                        ' ordering, `%s`.',
                pluginName)
                : void 0;
            if (plugins[pluginIndex]) {
                continue;
            }
            !pluginModule.extractEvents
                ? invariant_1$1(false, 'EventPluginRegistry: Event plugins must implement an `extractEvents` method, but' +
                        ' `%s` does not.',
                pluginName)
                : void 0;
            plugins[pluginIndex] = pluginModule;
            var publishedEvents = pluginModule.eventTypes;
            for (var eventName in publishedEvents) {
                !publishEventForPlugin(publishedEvents[eventName], pluginModule, eventName)
                    ? invariant_1$1(false, 'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.', eventName, pluginName)
                    : void 0;
            }
        }
    }

    /**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */
    function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
        !!eventNameDispatchConfigs.hasOwnProperty(eventName)
            ? invariant_1$1(false, 'EventPluginHub: More than one plugin attempted to publish the same event name, `' +
                    '%s`.',
            eventName)
            : void 0;
        eventNameDispatchConfigs[eventName] = dispatchConfig;

        var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
        if (phasedRegistrationNames) {
            for (var phaseName in phasedRegistrationNames) {
                if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
                    var phasedRegistrationName = phasedRegistrationNames[phaseName];
                    publishRegistrationName(phasedRegistrationName, pluginModule, eventName);
                }
            }
            return true;
        } else if (dispatchConfig.registrationName) {
            publishRegistrationName(dispatchConfig.registrationName, pluginModule, eventName);
            return true;
        }
        return false;
    }

    /**
 * Publishes a registration name that is used to identify dispatched events.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */
    function publishRegistrationName(registrationName, pluginModule, eventName) {
        !!registrationNameModules[registrationName]
            ? invariant_1$1(false, 'EventPluginHub: More than one plugin attempted to publish the same registration ' +
                    'name, `%s`.',
            registrationName)
            : void 0;
        registrationNameModules[registrationName] = pluginModule;
        registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;

        {
            var lowerCasedName = registrationName.toLowerCase();
            possibleRegistrationNames[lowerCasedName] = registrationName;

            if (registrationName === 'onDoubleClick') {
                possibleRegistrationNames.ondblclick = registrationName;
            }
        }
    }

    /**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */

    /**
 * Ordered list of injected plugins.
 */
    var plugins = [];

    /**
 * Mapping from event name to dispatch config
 */
    var eventNameDispatchConfigs = {};

    /**
 * Mapping from registration name to plugin module
 */
    var registrationNameModules = {};

    /**
 * Mapping from registration name to event name
 */
    var registrationNameDependencies = {};

    /**
 * Mapping from lowercase registration names to the properly cased version,
 * used to warn in the case of missing event handlers. Available
 * only in true.
 * @type {Object}
 */
    var possibleRegistrationNames = {};
    // Trust the developer to only use possibleRegistrationNames in true

    /**
 * Injects an ordering of plugins (by plugin name). This allows the ordering
 * to be decoupled from injection of the actual plugins so that ordering is
 * always deterministic regardless of packaging, on-the-fly injection, etc.
 *
 * @param {array} InjectedEventPluginOrder
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginOrder}
 */
    function injectEventPluginOrder(injectedEventPluginOrder) {
        !!eventPluginOrder
            ? invariant_1$1(false, 'EventPluginRegistry: Cannot inject event plugin ordering more than once. You are' +
                    ' likely trying to load more than one copy of React.')
            : void 0;
        // Clone the ordering so it cannot be dynamically mutated.
        eventPluginOrder = Array
            .prototype
            .slice
            .call(injectedEventPluginOrder);
        recomputePluginOrdering();
    }

    /**
 * Injects plugins to be used by `EventPluginHub`. The plugin names must be
 * in the ordering injected by `injectEventPluginOrder`.
 *
 * Plugins can be injected as part of page initialization or on-the-fly.
 *
 * @param {object} injectedNamesToPlugins Map from names to plugin modules.
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginsByName}
 */
    function injectEventPluginsByName(injectedNamesToPlugins) {
        var isOrderingDirty = false;
        for (var pluginName in injectedNamesToPlugins) {
            if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
                continue;
            }
            var pluginModule = injectedNamesToPlugins[pluginName];
            if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== pluginModule) {
                !!namesToPlugins[pluginName]
                    ? invariant_1$1(false, 'EventPluginRegistry: Cannot inject two different event plugins using the same na' +
                            'me, `%s`.',
                    pluginName)
                    : void 0;
                namesToPlugins[pluginName] = pluginModule;
                isOrderingDirty = true;
            }
        }
        if (isOrderingDirty) {
            recomputePluginOrdering();
        }
    }

    var EventPluginRegistry = Object.freeze({
        plugins: plugins,
        eventNameDispatchConfigs: eventNameDispatchConfigs,
        registrationNameModules: registrationNameModules,
        registrationNameDependencies: registrationNameDependencies,
        possibleRegistrationNames: possibleRegistrationNames,
        injectEventPluginOrder: injectEventPluginOrder,
        injectEventPluginsByName: injectEventPluginsByName
    });

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

    function makeEmptyFunction(arg) {
        return function () {
            return arg;
        };
    }

    /**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
    var emptyFunction$1 = function emptyFunction() {};

    emptyFunction$1.thatReturns = makeEmptyFunction;
    emptyFunction$1.thatReturnsFalse = makeEmptyFunction(false);
    emptyFunction$1.thatReturnsTrue = makeEmptyFunction(true);
    emptyFunction$1.thatReturnsNull = makeEmptyFunction(null);
    emptyFunction$1.thatReturnsThis = function () {
        return this;
    };
    emptyFunction$1.thatReturnsArgument = function (arg) {
        return arg;
    };

    var emptyFunction_1 = emptyFunction$1;

    /**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

    /**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

    var warning = emptyFunction_1;

    {
        var printWarning = function printWarning(format) {
            for (var _len = arguments.length, args = Array(_len > 1
                ? _len - 1
                : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            var argIndex = 0;
            var message = 'Warning: ' + format.replace(/%s/g, function () {
                return args[argIndex++];
            });
            if (typeof console !== 'undefined') {
                console.error(message);
            }
            try {
                // --- Welcome to debugging React --- This error was thrown as a convenience so
                // that you can use this stack to find the callsite that caused this warning to
                // fire.
                throw new Error(message);
            } catch (x) {}
        };

        warning = function warning(condition, format) {
            if (format === undefined) {
                throw new Error('`warning(condition, format, ...args)` requires a warning message argument');
            }

            if (format.indexOf('Failed Composite propType: ') === 0) {
                return; // Ignore CompositeComponent proptype check.
            }

            if (!condition) {
                for (var _len2 = arguments.length, args = Array(_len2 > 2
                    ? _len2 - 2
                    : 0), _key2 = 2; _key2 < _len2; _key2++) {
                    args[_key2 - 2] = arguments[_key2];
                }

                printWarning.apply(undefined, [format].concat(args));
            }
        };
    }

    var warning_1$1 = warning;

    var getFiberCurrentPropsFromNode = null;
    var getInstanceFromNode = null;
    var getNodeFromInstance = null;

    var injection$2 = {
        injectComponentTree: function (Injected) {
            getFiberCurrentPropsFromNode = Injected.getFiberCurrentPropsFromNode;
            getInstanceFromNode = Injected.getInstanceFromNode;
            getNodeFromInstance = Injected.getNodeFromInstance;

            {
                warning_1$1(getNodeFromInstance && getInstanceFromNode, 'EventPluginUtils.injection.injectComponentTree(...): Injected module is missing ' +
                        'getNodeFromInstance or getInstanceFromNode.');
            }
        }
    };

    var validateEventDispatches;
    {
        validateEventDispatches = function (event) {
            var dispatchListeners = event._dispatchListeners;
            var dispatchInstances = event._dispatchInstances;

            var listenersIsArr = Array.isArray(dispatchListeners);
            var listenersLen = listenersIsArr
                ? dispatchListeners.length
                : dispatchListeners
                    ? 1
                    : 0;

            var instancesIsArr = Array.isArray(dispatchInstances);
            var instancesLen = instancesIsArr
                ? dispatchInstances.length
                : dispatchInstances
                    ? 1
                    : 0;

            warning_1$1(instancesIsArr === listenersIsArr && instancesLen === listenersLen, 'EventPluginUtils: Invalid `event`.');
        };
    }

    /**
 * Dispatch the event to the listener.
 * @param {SyntheticEvent} event SyntheticEvent to handle
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @param {function} listener Application-level callback
 * @param {*} inst Internal component instance
 */
    function executeDispatch(event, simulated, listener, inst) {
        var type = event.type || 'unknown-event';
        event.currentTarget = getNodeFromInstance(inst);
        ReactErrorUtils.invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event);
        event.currentTarget = null;
    }

    /**
 * Standard/simple iteration through an event's collected dispatches.
 */
    function executeDispatchesInOrder(event, simulated) {
        var dispatchListeners = event._dispatchListeners;
        var dispatchInstances = event._dispatchInstances;
        {
            validateEventDispatches(event);
        }
        if (Array.isArray(dispatchListeners)) {
            for (var i = 0; i < dispatchListeners.length; i++) {
                if (event.isPropagationStopped()) {
                    break;
                }
                // Listeners and Instances are two parallel arrays that are always in sync.
                executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
            }
        } else if (dispatchListeners) {
            executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
        }
        event._dispatchListeners = null;
        event._dispatchInstances = null;
    }

    /**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */

    /**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return {*} The return value of executing the single dispatch.
 */

    /**
 * @param {SyntheticEvent} event
 * @return {boolean} True iff number of dispatches accumulated is greater than 0.
 */

    /**
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

    function accumulateInto(current, next) {
        !(next != null)
            ? invariant_1$1(false, 'accumulateInto(...): Accumulated items must not be null or undefined.')
            : void 0;

        if (current == null) {
            return next;
        }

        // Both are not empty. Warning: Never call x.concat(y) when you are not certain
        // that x is an Array (x could be a string with concat method).
        if (Array.isArray(current)) {
            if (Array.isArray(next)) {
                current
                    .push
                    .apply(current, next);
                return current;
            }
            current.push(next);
            return current;
        }

        if (Array.isArray(next)) {
            // A bit too dangerous to mutate `next`.
            return [current].concat(next);
        }

        return [current, next];
    }

    /**
 * @param {array} arr an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 * @param {function} cb Callback invoked with each element or a collection.
 * @param {?} [scope] Scope used as `this` in a callback.
 */
    function forEachAccumulated(arr, cb, scope) {
        if (Array.isArray(arr)) {
            arr.forEach(cb, scope);
        } else if (arr) {
            cb.call(scope, arr);
        }
    }

    /**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */
    var eventQueue = null;

    /**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @private
 */
    var executeDispatchesAndRelease = function (event, simulated) {
        if (event) {
            executeDispatchesInOrder(event, simulated);

            if (!event.isPersistent()) {
                event
                    .constructor
                    .release(event);
            }
        }
    };
    var executeDispatchesAndReleaseSimulated = function (e) {
        return executeDispatchesAndRelease(e, true);
    };
    var executeDispatchesAndReleaseTopLevel = function (e) {
        return executeDispatchesAndRelease(e, false);
    };

    function isInteractive(tag) {
        return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
    }

    function shouldPreventMouseEvent(name, type, props) {
        switch (name) {
            case 'onClick':
            case 'onClickCapture':
            case 'onDoubleClick':
            case 'onDoubleClickCapture':
            case 'onMouseDown':
            case 'onMouseDownCapture':
            case 'onMouseMove':
            case 'onMouseMoveCapture':
            case 'onMouseUp':
            case 'onMouseUpCapture':
                return !!(props.disabled && isInteractive(type));
            default:
                return false;
        }
    }

    /**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */

    /**
 * Methods for injecting dependencies.
 */
    var injection$1 = {
        /**
   * @param {array} InjectedEventPluginOrder
   * @public
   */
        injectEventPluginOrder: injectEventPluginOrder,

        /**
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   */
        injectEventPluginsByName: injectEventPluginsByName
    };

    /**
 * @param {object} inst The instance, which is the source of events.
 * @param {string} registrationName Name of listener (e.g. `onClick`).
 * @return {?function} The stored callback.
 */
    function getListener(inst, registrationName) {
        var listener;

        // TODO: shouldPreventMouseEvent is DOM-specific and definitely should not live
        // here; needs to be moved to a better place soon
        var stateNode = inst.stateNode;
        if (!stateNode) {
            // Work in progress (ex: onload events in incremental mode).
            return null;
        }
        var props = getFiberCurrentPropsFromNode(stateNode);
        if (!props) {
            // Work in progress.
            return null;
        }
        listener = props[registrationName];
        if (shouldPreventMouseEvent(registrationName, inst.type, props)) {
            return null;
        }
        !(!listener || typeof listener === 'function')
            ? invariant_1$1(false, 'Expected `%s` listener to be a function, instead got a value of `%s` type.', registrationName, typeof listener)
            : void 0;
        return listener;
    }

    /**
 * Allows registered plugins an opportunity to extract events from top-level
 * native browser events.
 *
 * @return {*} An accumulation of synthetic events.
 * @internal
 */
    function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var events;
        for (var i = 0; i < plugins.length; i++) {
            // Not every plugin in the ordering may be loaded at runtime.
            var possiblePlugin = plugins[i];
            if (possiblePlugin) {
                var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
                if (extractedEvents) {
                    events = accumulateInto(events, extractedEvents);
                }
            }
        }
        return events;
    }

    /**
 * Enqueues a synthetic event that should be dispatched when
 * `processEventQueue` is invoked.
 *
 * @param {*} events An accumulation of synthetic events.
 * @internal
 */
    function enqueueEvents(events) {
        if (events) {
            eventQueue = accumulateInto(eventQueue, events);
        }
    }

    /**
 * Dispatches all synthetic events on the event queue.
 *
 * @internal
 */
    function processEventQueue(simulated) {
        // Set `eventQueue` to null before processing it so that we can tell if more
        // events get enqueued while processing.
        var processingEventQueue = eventQueue;
        eventQueue = null;
        if (simulated) {
            forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
        } else {
            forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
        }
        !!eventQueue
            ? invariant_1$1(false, 'processEventQueue(): Additional events were enqueued while processing an event q' +
                    'ueue. Support for this has not yet been implemented.')
            : void 0;
        // This would be a good time to rethrow if any of the event handlers threw.
        ReactErrorUtils.rethrowCaughtError();
    }

    var EventPluginHub = Object.freeze({injection: injection$1, getListener: getListener, extractEvents: extractEvents, enqueueEvents: enqueueEvents, processEventQueue: processEventQueue});

    var IndeterminateComponent = 0; // Before we know whether it is functional or class
    var FunctionalComponent = 1;
    var ClassComponent = 2;
    var HostRoot = 3; // Root of a host tree. Could be nested inside another node.
    var HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
    var HostComponent = 5;
    var HostText = 6;
    var CallComponent = 7;
    var CallHandlerPhase = 8;
    var ReturnComponent = 9;
    var Fragment = 10;

    var randomKey = Math
        .random()
        .toString(36)
        .slice(2);
    var internalInstanceKey = '__reactInternalInstance$' + randomKey;
    var internalEventHandlersKey = '__reactEventHandlers$' + randomKey;

    function precacheFiberNode$1(hostInst, node) {
        node[internalInstanceKey] = hostInst;
    }

    /**
 * Given a DOM node, return the closest ReactDOMComponent or
 * ReactDOMTextComponent instance ancestor.
 */
    function getClosestInstanceFromNode(node) {
        if (node[internalInstanceKey]) {
            return node[internalInstanceKey];
        }

        // Walk up the tree until we find an ancestor whose instance we have cached.
        var parents = [];
        while (!node[internalInstanceKey]) {
            parents.push(node);
            if (node.parentNode) {
                node = node.parentNode;
            } else {
                // Top of the tree. This node must not be part of a React tree (or is unmounted,
                // potentially).
                return null;
            }
        }

        var closest = void 0;
        var inst = node[internalInstanceKey];
        if (inst.tag === HostComponent || inst.tag === HostText) {
            // In Fiber, this will always be the deepest root.
            return inst;
        }
        for (; node && (inst = node[internalInstanceKey]); node = parents.pop()) {
            closest = inst;
        }

        return closest;
    }

    /**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */
    function getInstanceFromNode$1(node) {
        var inst = node[internalInstanceKey];
        if (inst) {
            if (inst.tag === HostComponent || inst.tag === HostText) {
                return inst;
            } else {
                return null;
            }
        }
        return null;
    }

    /**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
    function getNodeFromInstance$1(inst) {
        if (inst.tag === HostComponent || inst.tag === HostText) {
            // In Fiber this, is just the state node right now. We assume it will be a host
            // component or host text.
            return inst.stateNode;
        }

        // Without this first invariant, passing a non-DOM-component triggers the next
        // invariant for a missing parent, which is super confusing.
        invariant_1$1(false, 'getNodeFromInstance: Invalid argument.');
    }

    function getFiberCurrentPropsFromNode$1(node) {
        return node[internalEventHandlersKey] || null;
    }

    function updateFiberProps$1(node, props) {
        node[internalEventHandlersKey] = props;
    }

    var ReactDOMComponentTree = Object.freeze({
        precacheFiberNode: precacheFiberNode$1,
        getClosestInstanceFromNode: getClosestInstanceFromNode,
        getInstanceFromNode: getInstanceFromNode$1,
        getNodeFromInstance: getNodeFromInstance$1,
        getFiberCurrentPropsFromNode: getFiberCurrentPropsFromNode$1,
        updateFiberProps: updateFiberProps$1
    });

    function getParent(inst) {
        do {
            inst = inst['return'];
            // TODO: If this is a HostRoot we might want to bail out. That is depending on
            // if we want nested subtrees (layers) to bubble events to their parent. We
            // could also go through parentNode on the host node but that wouldn't work for
            // React Native and doesn't let us do the portal feature.
        } while (inst && inst.tag !== HostComponent);
        if (inst) {
            return inst;
        }
        return null;
    }

    /**
 * Return the lowest common ancestor of A and B, or null if they are in
 * different trees.
 */
    function getLowestCommonAncestor(instA, instB) {
        var depthA = 0;
        for (var tempA = instA; tempA; tempA = getParent(tempA)) {
            depthA++;
        }
        var depthB = 0;
        for (var tempB = instB; tempB; tempB = getParent(tempB)) {
            depthB++;
        }

        // If A is deeper, crawl up.
        while (depthA - depthB > 0) {
            instA = getParent(instA);
            depthA--;
        }

        // If B is deeper, crawl up.
        while (depthB - depthA > 0) {
            instB = getParent(instB);
            depthB--;
        }

        // Walk in lockstep until we find a match.
        var depth = depthA;
        while (depth--) {
            if (instA === instB || instA === instB.alternate) {
                return instA;
            }
            instA = getParent(instA);
            instB = getParent(instB);
        }
        return null;
    }

    /**
 * Return if A is an ancestor of B.
 */

    /**
 * Return the parent instance of the passed-in instance.
 */
    function getParentInstance(inst) {
        return getParent(inst);
    }

    /**
 * Simulates the traversal of a two-phase, capture/bubble event dispatch.
 */
    function traverseTwoPhase(inst, fn, arg) {
        var path = [];
        while (inst) {
            path.push(inst);
            inst = getParent(inst);
        }
        var i;
        for (i = path.length; i-- > 0;) {
            fn(path[i], 'captured', arg);
        }
        for (i = 0; i < path.length; i++) {
            fn(path[i], 'bubbled', arg);
        }
    }

    /**
 * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
 * should would receive a `mouseEnter` or `mouseLeave` event.
 *
 * Does not invoke the callback on the nearest common ancestor because nothing
 * "entered" or "left" that element.
 */
    function traverseEnterLeave(from, to, fn, argFrom, argTo) {
        var common = from && to
            ? getLowestCommonAncestor(from, to)
            : null;
        var pathFrom = [];
        while (true) {
            if (!from) {
                break;
            }
            if (from === common) {
                break;
            }
            var alternate = from.alternate;
            if (alternate !== null && alternate === common) {
                break;
            }
            pathFrom.push(from);
            from = getParent(from);
        }
        var pathTo = [];
        while (true) {
            if (!to) {
                break;
            }
            if (to === common) {
                break;
            }
            var _alternate = to.alternate;
            if (_alternate !== null && _alternate === common) {
                break;
            }
            pathTo.push(to);
            to = getParent(to);
        }
        for (var i = 0; i < pathFrom.length; i++) {
            fn(pathFrom[i], 'bubbled', argFrom);
        }
        for (var _i = pathTo.length; _i-- > 0;) {
            fn(pathTo[_i], 'captured', argTo);
        }
    }

    /**
 * Some event types have a notion of different registration names for different
 * "phases" of propagation. This finds listeners by a given phase.
 */
    function listenerAtPhase(inst, event, propagationPhase) {
        var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
        return getListener(inst, registrationName);
    }

    /**
 * A small set of propagation patterns, each of which will accept a small amount
 * of information, and generate a set of "dispatch ready event objects" - which
 * are sets of events that have already been annotated with a set of dispatched
 * listener functions/ids. The API is designed this way to discourage these
 * propagation strategies from actually executing the dispatches, since we
 * always want to collect the entire set of dispatches before executing even a
 * single one.
 */

    /**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */
    function accumulateDirectionalDispatches(inst, phase, event) {
        {
            warning_1$1(inst, 'Dispatching inst must not be null');
        }
        var listener = listenerAtPhase(inst, event, phase);
        if (listener) {
            event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
            event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
        }
    }

    /**
 * Collect dispatches (must be entirely collected before dispatching - see unit
 * tests). Lazily allocate the array to conserve memory.  We must loop through
 * each event and perform the traversal for each one. We cannot perform a
 * single traversal for the entire collection of events because each event may
 * have a different target.
 */
    function accumulateTwoPhaseDispatchesSingle(event) {
        if (event && event.dispatchConfig.phasedRegistrationNames) {
            traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
        }
    }

    /**
 * Same as `accumulateTwoPhaseDispatchesSingle`, but skips over the targetID.
 */
    function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
        if (event && event.dispatchConfig.phasedRegistrationNames) {
            var targetInst = event._targetInst;
            var parentInst = targetInst
                ? getParentInstance(targetInst)
                : null;
            traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
        }
    }

    /**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */
    function accumulateDispatches(inst, ignoredDirection, event) {
        if (inst && event && event.dispatchConfig.registrationName) {
            var registrationName = event.dispatchConfig.registrationName;
            var listener = getListener(inst, registrationName);
            if (listener) {
                event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
                event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
            }
        }
    }

    /**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */
    function accumulateDirectDispatchesSingle(event) {
        if (event && event.dispatchConfig.registrationName) {
            accumulateDispatches(event._targetInst, null, event);
        }
    }

    function accumulateTwoPhaseDispatches(events) {
        forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
    }

    function accumulateTwoPhaseDispatchesSkipTarget(events) {
        forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
    }

    function accumulateEnterLeaveDispatches(leave, enter, from, to) {
        traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
    }

    function accumulateDirectDispatches(events) {
        forEachAccumulated(events, accumulateDirectDispatchesSingle);
    }

    var EventPropagators = Object.freeze({accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches, accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget, accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches, accumulateDirectDispatches: accumulateDirectDispatches});

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

    var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

    /**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
    var ExecutionEnvironment = {

        canUseDOM: canUseDOM,

        canUseWorkers: typeof Worker !== 'undefined',

        canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

        canUseViewport: canUseDOM && !!window.screen,

        isInWorker: !canUseDOM // For now, this is true - might change in the future.

    };

    var ExecutionEnvironment_1 = ExecutionEnvironment;

    var contentKey = null;

    /**
 * Gets the key used to access text content on a DOM node.
 *
 * @return {?string} Key used to access text content.
 * @internal
 */
    function getTextContentAccessor() {
        if (!contentKey && ExecutionEnvironment_1.canUseDOM) {
            // Prefer textContent to innerText because many browsers support both but SVG
            // <text> elements don't support innerText even when <div> does.
            contentKey = 'textContent' in document.documentElement
                ? 'textContent'
                : 'innerText';
        }
        return contentKey;
    }

    /**
 * This helper object stores information about text content of a target node,
 * allowing comparison of content before and after a given event.
 *
 * Identify the node where selection currently begins, then observe
 * both its text content and its current position in the DOM. Since the
 * browser may natively replace the target node during composition, we can
 * use its position to find its replacement.
 *
 *
 */
    var compositionState = {
        _root: null,
        _startText: null,
        _fallbackText: null
    };

    function initialize(nativeEventTarget) {
        compositionState._root = nativeEventTarget;
        compositionState._startText = getText();
        return true;
    }

    function reset() {
        compositionState._root = null;
        compositionState._startText = null;
        compositionState._fallbackText = null;
    }

    function getData() {
        if (compositionState._fallbackText) {
            return compositionState._fallbackText;
        }

        var start;
        var startValue = compositionState._startText;
        var startLength = startValue.length;
        var end;
        var endValue = getText();
        var endLength = endValue.length;

        for (start = 0; start < startLength; start++) {
            if (startValue[start] !== endValue[start]) {
                break;
            }
        }

        var minEnd = startLength - start;
        for (end = 1; end <= minEnd; end++) {
            if (startValue[startLength - end] !== endValue[endLength - end]) {
                break;
            }
        }

        var sliceTail = end > 1
            ? 1 - end
            : undefined;
        compositionState._fallbackText = endValue.slice(start, sliceTail);
        return compositionState._fallbackText;
    }

    function getText() {
        if ('value' in compositionState._root) {
            return compositionState._root.value;
        }
        return compositionState._root[getTextContentAccessor()];
    }

    var ReactInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

    var _assign = ReactInternals.assign;

    /* eslint valid-typeof: 0 */

    var didWarnForAddedNewProperty = false;
    var isProxySupported = typeof Proxy === 'function';
    var EVENT_POOL_SIZE = 10;

    var shouldBeReleasedProperties = [
        'dispatchConfig',
        '_targetInst',
        'nativeEvent',
        'isDefaultPrevented',
        'isPropagationStopped',
        '_dispatchListeners',
        '_dispatchInstances'
    ];

    /**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
    var EventInterface = {
        type: null,
        target: null,
        // currentTarget is set when dispatching; no use in copying it here
        currentTarget: emptyFunction_1.thatReturnsNull,
        eventPhase: null,
        bubbles: null,
        cancelable: null,
        timeStamp: function (event) {
            return event.timeStamp || Date.now();
        },
        defaultPrevented: null,
        isTrusted: null
    };

    /**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {*} targetInst Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @param {DOMEventTarget} nativeEventTarget Target node.
 */
    function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
        {
            // these have a getter/setter for warnings
            delete this.nativeEvent;
            delete this.preventDefault;
            delete this.stopPropagation;
        }

        this.dispatchConfig = dispatchConfig;
        this._targetInst = targetInst;
        this.nativeEvent = nativeEvent;

        var Interface = this.constructor.Interface;
        for (var propName in Interface) {
            if (!Interface.hasOwnProperty(propName)) {
                continue;
            }
            {
                delete this[propName]; // this has a getter/setter for warnings
            }
            var normalize = Interface[propName];
            if (normalize) {
                this[propName] = normalize(nativeEvent);
            } else {
                if (propName === 'target') {
                    this.target = nativeEventTarget;
                } else {
                    this[propName] = nativeEvent[propName];
                }
            }
        }

        var defaultPrevented = nativeEvent.defaultPrevented != null
            ? nativeEvent.defaultPrevented
            : nativeEvent.returnValue === false;
        if (defaultPrevented) {
            this.isDefaultPrevented = emptyFunction_1.thatReturnsTrue;
        } else {
            this.isDefaultPrevented = emptyFunction_1.thatReturnsFalse;
        }
        this.isPropagationStopped = emptyFunction_1.thatReturnsFalse;
        return this;
    }

    _assign(SyntheticEvent.prototype, {
        preventDefault: function () {
            this.defaultPrevented = true;
            var event = this.nativeEvent;
            if (!event) {
                return;
            }

            if (event.preventDefault) {
                event.preventDefault();
            } else if (typeof event.returnValue !== 'unknown') {
                event.returnValue = false;
            }
            this.isDefaultPrevented = emptyFunction_1.thatReturnsTrue;
        },

        stopPropagation: function () {
            var event = this.nativeEvent;
            if (!event) {
                return;
            }

            if (event.stopPropagation) {
                event.stopPropagation();
            } else if (typeof event.cancelBubble !== 'unknown') {
                // The ChangeEventPlugin registers a "propertychange" event for IE. This event
                // does not support bubbling or cancelling, and any references to cancelBubble
                // throw "Member not found".  A typeof check of "unknown" circumvents this issue
                // (and is also IE specific).
                event.cancelBubble = true;
            }

            this.isPropagationStopped = emptyFunction_1.thatReturnsTrue;
        },

        /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
        persist: function () {
            this.isPersistent = emptyFunction_1.thatReturnsTrue;
        },

        /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
        isPersistent: emptyFunction_1.thatReturnsFalse,

        /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
        destructor: function () {
            var Interface = this.constructor.Interface;
            for (var propName in Interface) {
                {
                    Object.defineProperty(this, propName, getPooledWarningPropertyDefinition(propName, Interface[propName]));
                }
            }
            for (var i = 0; i < shouldBeReleasedProperties.length; i++) {
                this[shouldBeReleasedProperties[i]] = null;
            }
            {
                Object.defineProperty(this, 'nativeEvent', getPooledWarningPropertyDefinition('nativeEvent', null));
                Object.defineProperty(this, 'preventDefault', getPooledWarningPropertyDefinition('preventDefault', emptyFunction_1));
                Object.defineProperty(this, 'stopPropagation', getPooledWarningPropertyDefinition('stopPropagation', emptyFunction_1));
            }
        }
    });

    SyntheticEvent.Interface = EventInterface;

    /**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */
    SyntheticEvent.augmentClass = function (Class, Interface) {
        var Super = this;

        var E = function () {};
        E.prototype = Super.prototype;
        var prototype = new E();

        _assign(prototype, Class.prototype);
        Class.prototype = prototype;
        Class.prototype.constructor = Class;

        Class.Interface = _assign({}, Super.Interface, Interface);
        Class.augmentClass = Super.augmentClass;
        addEventPoolingTo(Class);
    };

    /** Proxying after everything set on SyntheticEvent
 * to resolve Proxy issue on some WebKit browsers
 * in which some Event properties are set to undefined (GH#10010)
 */
    {
        if (isProxySupported) {
            /*eslint-disable no-func-assign */
            SyntheticEvent = new Proxy(SyntheticEvent, {
                construct: function (target, args) {
                    return this.apply(target, Object.create(target.prototype), args);
                },
                apply: function (constructor, that, args) {
                    return new Proxy(constructor.apply(that, args), {
                        set: function (target, prop, value) {
                            if (prop !== 'isPersistent' && !target.constructor.Interface.hasOwnProperty(prop) && shouldBeReleasedProperties.indexOf(prop) === -1) {
                                warning_1$1(didWarnForAddedNewProperty || target.isPersistent(), "This synthetic event is reused for performance reasons. If you're seeing this, y" +
                                        "ou're adding a new property in the synthetic event object. The property is never" +
                                        " released. See https://fb.me/react-event-pooling for more information.");
                                didWarnForAddedNewProperty = true;
                            }
                            target[prop] = value;
                            return true;
                        }
                    });
                }
            });
            /*eslint-enable no-func-assign */
        }
    }

    addEventPoolingTo(SyntheticEvent);

    /**
 * Helper to nullify syntheticEvent instance properties when destructing
 *
 * @param {String} propName
 * @param {?object} getVal
 * @return {object} defineProperty object
 */
    function getPooledWarningPropertyDefinition(propName, getVal) {
        var isFunction = typeof getVal === 'function';
        return {configurable: true, set: set, get: get};

        function set(val) {
            var action = isFunction
                ? 'setting the method'
                : 'setting the property';
            warn(action, 'This is effectively a no-op');
            return val;
        }

        function get() {
            var action = isFunction
                ? 'accessing the method'
                : 'accessing the property';
            var result = isFunction
                ? 'This is a no-op function'
                : 'This is set to null';
            warn(action, result);
            return getVal;
        }

        function warn(action, result) {
            var warningCondition = false;
            warning_1$1(warningCondition, "This synthetic event is reused for performance reasons. If you're seeing this, y" +
                    "ou're %s `%s` on a released/nullified synthetic event. %s. If you must keep the " +
                    "original synthetic event around, use event.persist(). See https://fb.me/react-ev" +
                    "ent-pooling for more information.",
            action, propName, result);
        }
    }

    function getPooledEvent(dispatchConfig, targetInst, nativeEvent, nativeInst) {
        var EventConstructor = this;
        if (EventConstructor.eventPool.length) {
            var instance = EventConstructor
                .eventPool
                .pop();
            EventConstructor.call(instance, dispatchConfig, targetInst, nativeEvent, nativeInst);
            return instance;
        }
        return new EventConstructor(dispatchConfig, targetInst, nativeEvent, nativeInst);
    }

    function releasePooledEvent(event) {
        var EventConstructor = this;
        !(event instanceof EventConstructor)
            ? invariant_1$1(false, 'Trying to release an event instance  into a pool of a different type.')
            : void 0;
        event.destructor();
        if (EventConstructor.eventPool.length < EVENT_POOL_SIZE) {
            EventConstructor
                .eventPool
                .push(event);
        }
    }

    function addEventPoolingTo(EventConstructor) {
        EventConstructor.eventPool = [];
        EventConstructor.getPooled = getPooledEvent;
        EventConstructor.release = releasePooledEvent;
    }

    var SyntheticEvent$1 = SyntheticEvent;

    /**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */
    var CompositionEventInterface = {
        data: null
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
    function SyntheticCompositionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$1.augmentClass(SyntheticCompositionEvent, CompositionEventInterface);

    /**
 * @interface Event
 * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
 *      /#events-inputevents
 */
    var InputEventInterface = {
        data: null
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
    function SyntheticInputEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$1.augmentClass(SyntheticInputEvent, InputEventInterface);

    var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
    var START_KEYCODE = 229;

    var canUseCompositionEvent = ExecutionEnvironment_1.canUseDOM && 'CompositionEvent' in window;

    var documentMode = null;
    if (ExecutionEnvironment_1.canUseDOM && 'documentMode' in document) {
        documentMode = document.documentMode;
    }

    // Webkit offers a very useful `textInput` event that can be used to directly
    // represent `beforeInput`. The IE `textinput` event is not as useful, so we
    // don't use it.
    var canUseTextInputEvent = ExecutionEnvironment_1.canUseDOM && 'TextEvent' in window && !documentMode && !isPresto();

    // In IE9+, we have access to composition events, but the data supplied by the
    // native compositionend event may be incorrect. Japanese ideographic spaces,
    // for instance (\u3000) are not recorded correctly.
    var useFallbackCompositionData = ExecutionEnvironment_1.canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);

    /**
 * Opera <= 12 includes TextEvent in window, but does not fire
 * text input events. Rely on keypress instead.
 */
    function isPresto() {
        var opera = window.opera;
        return typeof opera === 'object' && typeof opera.version === 'function' && parseInt(opera.version(), 10) <= 12;
    }

    var SPACEBAR_CODE = 32;
    var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

    // Events and their corresponding property names.
    var eventTypes = {
        beforeInput: {
            phasedRegistrationNames: {
                bubbled: 'onBeforeInput',
                captured: 'onBeforeInputCapture'
            },
            dependencies: ['topCompositionEnd', 'topKeyPress', 'topTextInput', 'topPaste']
        },
        compositionEnd: {
            phasedRegistrationNames: {
                bubbled: 'onCompositionEnd',
                captured: 'onCompositionEndCapture'
            },
            dependencies: [
                'topBlur',
                'topCompositionEnd',
                'topKeyDown',
                'topKeyPress',
                'topKeyUp',
                'topMouseDown'
            ]
        },
        compositionStart: {
            phasedRegistrationNames: {
                bubbled: 'onCompositionStart',
                captured: 'onCompositionStartCapture'
            },
            dependencies: [
                'topBlur',
                'topCompositionStart',
                'topKeyDown',
                'topKeyPress',
                'topKeyUp',
                'topMouseDown'
            ]
        },
        compositionUpdate: {
            phasedRegistrationNames: {
                bubbled: 'onCompositionUpdate',
                captured: 'onCompositionUpdateCapture'
            },
            dependencies: [
                'topBlur',
                'topCompositionUpdate',
                'topKeyDown',
                'topKeyPress',
                'topKeyUp',
                'topMouseDown'
            ]
        }
    };

    // Track whether we've ever handled a keypress on the space key.
    var hasSpaceKeypress = false;

    /**
 * Return whether a native keypress event is assumed to be a command.
 * This is required because Firefox fires `keypress` events for key commands
 * (cut, copy, select-all, etc.) even though no character is inserted.
 */
    function isKeypressCommand(nativeEvent) {
        return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) &&
        // ctrlKey && altKey is equivalent to AltGr, and is not a command.
        !(nativeEvent.ctrlKey && nativeEvent.altKey);
    }

    /**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */
    function getCompositionEventType(topLevelType) {
        switch (topLevelType) {
            case 'topCompositionStart':
                return eventTypes.compositionStart;
            case 'topCompositionEnd':
                return eventTypes.compositionEnd;
            case 'topCompositionUpdate':
                return eventTypes.compositionUpdate;
        }
    }

    /**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
    function isFallbackCompositionStart(topLevelType, nativeEvent) {
        return topLevelType === 'topKeyDown' && nativeEvent.keyCode === START_KEYCODE;
    }

    /**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
    function isFallbackCompositionEnd(topLevelType, nativeEvent) {
        switch (topLevelType) {
            case 'topKeyUp':
                // Command keys insert or clear IME input.
                return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
            case 'topKeyDown':
                // Expect IME keyCode on each keydown. If we get any other code we must have
                // exited earlier.
                return nativeEvent.keyCode !== START_KEYCODE;
            case 'topKeyPress':
            case 'topMouseDown':
            case 'topBlur':
                // Events are not possible without cancelling IME.
                return true;
            default:
                return false;
        }
    }

    /**
 * Google Input Tools provides composition data via a CustomEvent,
 * with the `data` property populated in the `detail` object. If this
 * is available on the event object, use it. If not, this is a plain
 * composition event and we have nothing special to extract.
 *
 * @param {object} nativeEvent
 * @return {?string}
 */
    function getDataFromCustomEvent(nativeEvent) {
        var detail = nativeEvent.detail;
        if (typeof detail === 'object' && 'data' in detail) {
            return detail.data;
        }
        return null;
    }

    // Track the current IME composition status, if any.
    var isComposing = false;

    /**
 * @return {?object} A SyntheticCompositionEvent.
 */
    function extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var eventType;
        var fallbackData;

        if (canUseCompositionEvent) {
            eventType = getCompositionEventType(topLevelType);
        } else if (!isComposing) {
            if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
                eventType = eventTypes.compositionStart;
            }
        } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
            eventType = eventTypes.compositionEnd;
        }

        if (!eventType) {
            return null;
        }

        if (useFallbackCompositionData) {
            // The current composition is stored statically and must not be overwritten
            // while composition continues.
            if (!isComposing && eventType === eventTypes.compositionStart) {
                isComposing = initialize(nativeEventTarget);
            } else if (eventType === eventTypes.compositionEnd) {
                if (isComposing) {
                    fallbackData = getData();
                }
            }
        }

        var event = SyntheticCompositionEvent.getPooled(eventType, targetInst, nativeEvent, nativeEventTarget);

        if (fallbackData) {
            // Inject data generated from fallback path into the synthetic event. This
            // matches the property of native CompositionEventInterface.
            event.data = fallbackData;
        } else {
            var customData = getDataFromCustomEvent(nativeEvent);
            if (customData !== null) {
                event.data = customData;
            }
        }

        accumulateTwoPhaseDispatches(event);
        return event;
    }

    /**
 * @param {TopLevelTypes} topLevelType Record from `BrowserEventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The string corresponding to this `beforeInput` event.
 */
    function getNativeBeforeInputChars(topLevelType, nativeEvent) {
        switch (topLevelType) {
            case 'topCompositionEnd':
                return getDataFromCustomEvent(nativeEvent);
            case 'topKeyPress':
                /**
       * If native `textInput` events are available, our goal is to make
       * use of them. However, there is a special case: the spacebar key.
       * In Webkit, preventing default on a spacebar `textInput` event
       * cancels character insertion, but it *also* causes the browser
       * to fall back to its default spacebar behavior of scrolling the
       * page.
       *
       * Tracking at:
       * https://code.google.com/p/chromium/issues/detail?id=355103
       *
       * To avoid this issue, use the keypress event as if no `textInput`
       * event is available.
       */
                var which = nativeEvent.which;
                if (which !== SPACEBAR_CODE) {
                    return null;
                }

                hasSpaceKeypress = true;
                return SPACEBAR_CHAR;

            case 'topTextInput':
                // Record the characters to be added to the DOM.
                var chars = nativeEvent.data;

                // If it's a spacebar character, assume that we have already handled it at the
                // keypress level and bail immediately. Android Chrome doesn't give us keycodes,
                // so we need to blacklist it.
                if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
                    return null;
                }

                return chars;

            default:
                // For other native event types, do nothing.
                return null;
        }
    }

    /**
 * For browsers that do not provide the `textInput` event, extract the
 * appropriate string to use for SyntheticInputEvent.
 *
 * @param {string} topLevelType Record from `BrowserEventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The fallback string for this `beforeInput` event.
 */
    function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
        // If we are currently composing (IME) and using a fallback to do so, try to
        // extract the composed characters from the fallback object. If composition
        // event is available, we extract a string only at compositionevent, otherwise
        // extract it at fallback events.
        if (isComposing) {
            if (topLevelType === 'topCompositionEnd' || !canUseCompositionEvent && isFallbackCompositionEnd(topLevelType, nativeEvent)) {
                var chars = getData();
                reset();
                isComposing = false;
                return chars;
            }
            return null;
        }

        switch (topLevelType) {
            case 'topPaste':
                // If a paste event occurs after a keypress, throw out the input chars. Paste
                // events should not lead to BeforeInput events.
                return null;
            case 'topKeyPress':
                /**
       * As of v27, Firefox may fire keypress events even when no character
       * will be inserted. A few possibilities:
       *
       * - `which` is `0`. Arrow keys, Esc key, etc.
       *
       * - `which` is the pressed key code, but no char is available.
       *   Ex: 'AltGr + d` in Polish. There is no modified character for
       *   this key combination and no character is inserted into the
       *   document, but FF fires the keypress for char code `100` anyway.
       *   No `input` event will occur.
       *
       * - `which` is the pressed key code, but a command combination is
       *   being used. Ex: `Cmd+C`. No character is inserted, and no
       *   `input` event will occur.
       */
                if (!isKeypressCommand(nativeEvent)) {
                    // IE fires the `keypress` event when a user types an emoji via Touch keyboard
                    // of Windows.  In such a case, the `char` property holds an emoji character
                    // like `\uD83D\uDE0A`.  Because its length is 2, the property `which` does not
                    // represent an emoji correctly. In such a case, we directly return the `char`
                    // property instead of using `which`.
                    if (nativeEvent.char && nativeEvent.char.length > 1) {
                        return nativeEvent.char;
                    } else if (nativeEvent.which) {
                        return String.fromCharCode(nativeEvent.which);
                    }
                }
                return null;
            case 'topCompositionEnd':
                return useFallbackCompositionData
                    ? null
                    : nativeEvent.data;
            default:
                return null;
        }
    }

    /**
 * Extract a SyntheticInputEvent for `beforeInput`, based on either native
 * `textInput` or fallback behavior.
 *
 * @return {?object} A SyntheticInputEvent.
 */
    function extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var chars;

        if (canUseTextInputEvent) {
            chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
        } else {
            chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
        }

        // If no characters are being inserted, no BeforeInput event should be fired.
        if (!chars) {
            return null;
        }

        var event = SyntheticInputEvent.getPooled(eventTypes.beforeInput, targetInst, nativeEvent, nativeEventTarget);

        event.data = chars;
        accumulateTwoPhaseDispatches(event);
        return event;
    }

    /**
 * Create an `onBeforeInput` event to match
 * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
 *
 * This event plugin is based on the native `textInput` event
 * available in Chrome, Safari, Opera, and IE. This event fires after
 * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
 *
 * `beforeInput` is spec'd but not implemented in any browsers, and
 * the `input` event does not provide any useful information about what has
 * actually been added, contrary to the spec. Thus, `textInput` is the best
 * available event to identify the characters that have actually been inserted
 * into the target node.
 *
 * This plugin is also responsible for emitting `composition` events, thus
 * allowing us to share composition fallback code for both `beforeInput` and
 * `composition` event types.
 */
    var BeforeInputEventPlugin = {
        eventTypes: eventTypes,

        extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            return [
                extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget),
                extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget)
            ];
        }
    };

    // Use to restore controlled state after a change event has fired.

    var fiberHostComponent = null;

    var ReactControlledComponentInjection = {
        injectFiberControlledHostComponent: function (hostComponentImpl) {
            // The fiber implementation doesn't use dynamic dispatch so we need to inject
            // the implementation.
            fiberHostComponent = hostComponentImpl;
        }
    };

    var restoreTarget = null;
    var restoreQueue = null;

    function restoreStateOfTarget(target) {
        // We perform this translation at the end of the event loop so that we always
        // receive the correct fiber here
        var internalInstance = getInstanceFromNode(target);
        if (!internalInstance) {
            // Unmounted
            return;
        }
        !(fiberHostComponent && typeof fiberHostComponent.restoreControlledState === 'function')
            ? invariant_1$1(false, 'Fiber needs to be injected to handle a fiber target for controlled events. This ' +
                    'error is likely caused by a bug in React. Please file an issue.')
            : void 0;
        var props = getFiberCurrentPropsFromNode(internalInstance.stateNode);
        fiberHostComponent.restoreControlledState(internalInstance.stateNode, internalInstance.type, props);
    }

    var injection$3 = ReactControlledComponentInjection;

    function enqueueStateRestore(target) {
        if (restoreTarget) {
            if (restoreQueue) {
                restoreQueue.push(target);
            } else {
                restoreQueue = [target];
            }
        } else {
            restoreTarget = target;
        }
    }

    function restoreStateIfNeeded() {
        if (!restoreTarget) {
            return;
        }
        var target = restoreTarget;
        var queuedTargets = restoreQueue;
        restoreTarget = null;
        restoreQueue = null;

        restoreStateOfTarget(target);
        if (queuedTargets) {
            for (var i = 0; i < queuedTargets.length; i++) {
                restoreStateOfTarget(queuedTargets[i]);
            }
        }
    }

    var ReactControlledComponent = Object.freeze({injection: injection$3, enqueueStateRestore: enqueueStateRestore, restoreStateIfNeeded: restoreStateIfNeeded});

    // Used as a way to call batchedUpdates when we don't have a reference to the
    // renderer. Such as when we're dispatching events or if third party libraries
    // need to call batchedUpdates. Eventually, this API will go away when
    // everything is batched by default. We'll then have a similar API to opt-out of
    // scheduled work and instead do synchronous work. Defaults
    var fiberBatchedUpdates = function (fn, bookkeeping) {
        return fn(bookkeeping);
    };

    var isNestingBatched = false;
    function batchedUpdates(fn, bookkeeping) {
        if (isNestingBatched) {
            // If we are currently inside another batch, we need to wait until it fully
            // completes before restoring state. Therefore, we add the target to a queue of
            // work.
            return fiberBatchedUpdates(fn, bookkeeping);
        }
        isNestingBatched = true;
        try {
            return fiberBatchedUpdates(fn, bookkeeping);
        } finally {
            // Here we wait until all updates have propagated, which is important when using
            // controlled components within layers:
            // https://github.com/facebook/react/issues/1698 Then we restore state of any
            // controlled component.
            isNestingBatched = false;
            restoreStateIfNeeded();
        }
    }

    var ReactGenericBatchingInjection = {
        injectFiberBatchedUpdates: function (_batchedUpdates) {
            fiberBatchedUpdates = _batchedUpdates;
        }
    };

    var injection$4 = ReactGenericBatchingInjection;

    /**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */
    var supportedInputTypes = {
        color: true,
        date: true,
        datetime: true,
        'datetime-local': true,
        email: true,
        month: true,
        number: true,
        password: true,
        range: true,
        search: true,
        tel: true,
        text: true,
        time: true,
        url: true,
        week: true
    };

    function isTextInputElement(elem) {
        var nodeName = elem && elem.nodeName && elem
            .nodeName
            .toLowerCase();

        if (nodeName === 'input') {
            return !!supportedInputTypes[elem.type];
        }

        if (nodeName === 'textarea') {
            return true;
        }

        return false;
    }

    /**
 * HTML nodeType values that represent the type of the node
 */

    var ELEMENT_NODE = 1;
    var TEXT_NODE = 3;
    var COMMENT_NODE = 8;
    var DOCUMENT_NODE = 9;
    var DOCUMENT_FRAGMENT_NODE = 11;

    /**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */
    function getEventTarget(nativeEvent) {
        var target = nativeEvent.target || nativeEvent.srcElement || window;

        // Normalize SVG <use> element events #4963
        if (target.correspondingUseElement) {
            target = target.correspondingUseElement;
        }

        // Safari may fire events on text nodes (Node.TEXT_NODE is 3). @see
        // http://www.quirksmode.org/js/events_properties.html
        return target.nodeType === TEXT_NODE
            ? target.parentNode
            : target;
    }

    var useHasFeature;
    if (ExecutionEnvironment_1.canUseDOM) {
        useHasFeature = document.implementation && document.implementation.hasFeature &&
        // always returns true in newer browsers as per the standard. @see
        // http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
        document
            .implementation
            .hasFeature('', '') !== true;
    }

    /**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
    function isEventSupported(eventNameSuffix, capture) {
        if (!ExecutionEnvironment_1.canUseDOM || capture && !('addEventListener' in document)) {
            return false;
        }

        var eventName = 'on' + eventNameSuffix;
        var isSupported = eventName in document;

        if (!isSupported) {
            var element = document.createElement('div');
            element.setAttribute(eventName, 'return;');
            isSupported = typeof element[eventName] === 'function';
        }

        if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
            // This is the only way to test support for the `wheel` event in IE9+.
            isSupported = document
                .implementation
                .hasFeature('Events.wheel', '3.0');
        }

        return isSupported;
    }

    function isCheckable(elem) {
        var type = elem.type;
        var nodeName = elem.nodeName;
        return nodeName && nodeName.toLowerCase() === 'input' && (type === 'checkbox' || type === 'radio');
    }

    function getTracker(node) {
        return node._valueTracker;
    }

    function detachTracker(node) {
        node._valueTracker = null;
    }

    function getValueFromNode(node) {
        var value = '';
        if (!node) {
            return value;
        }

        if (isCheckable(node)) {
            value = node.checked
                ? 'true'
                : 'false';
        } else {
            value = node.value;
        }

        return value;
    }

    function trackValueOnNode(node) {
        var valueField = isCheckable(node)
            ? 'checked'
            : 'value';
        var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);

        var currentValue = '' + node[valueField];

        // if someone has already defined a value or Safari, then bail and don't track
        // value will cause over reporting of changes, but it's better then a hard
        // failure (needed for certain tests that spyOn input values and Safari)
        if (node.hasOwnProperty(valueField) || typeof descriptor.get !== 'function' || typeof descriptor.set !== 'function') {
            return;
        }

        Object.defineProperty(node, valueField, {
            enumerable: descriptor.enumerable,
            configurable: true,
            get: function () {
                return descriptor
                    .get
                    .call(this);
            },
            set: function (value) {
                currentValue = '' + value;
                descriptor
                    .set
                    .call(this, value);
            }
        });

        var tracker = {
            getValue: function () {
                return currentValue;
            },
            setValue: function (value) {
                currentValue = '' + value;
            },
            stopTracking: function () {
                detachTracker(node);
                delete node[valueField];
            }
        };
        return tracker;
    }

    function track(node) {
        if (getTracker(node)) {
            return;
        }

        // TODO: Once it's just Fiber we can move this to node._wrapperState
        node._valueTracker = trackValueOnNode(node);
    }

    function updateValueIfChanged(node) {
        if (!node) {
            return false;
        }

        var tracker = getTracker(node);
        // if there is no tracker at this point it's unlikely that trying again will
        // succeed
        if (!tracker) {
            return true;
        }

        var lastValue = tracker.getValue();
        var nextValue = getValueFromNode(node);
        if (nextValue !== lastValue) {
            tracker.setValue(nextValue);
            return true;
        }
        return false;
    }

    var eventTypes$1 = {
        change: {
            phasedRegistrationNames: {
                bubbled: 'onChange',
                captured: 'onChangeCapture'
            },
            dependencies: [
                'topBlur',
                'topChange',
                'topClick',
                'topFocus',
                'topInput',
                'topKeyDown',
                'topKeyUp',
                'topSelectionChange'
            ]
        }
    };

    function createAndAccumulateChangeEvent(inst, nativeEvent, target) {
        var event = SyntheticEvent$1.getPooled(eventTypes$1.change, inst, nativeEvent, target);
        event.type = 'change';
        // Flag this event loop as needing state restore.
        enqueueStateRestore(target);
        accumulateTwoPhaseDispatches(event);
        return event;
    }
    /**
 * For IE shims
 */
    var activeElement = null;
    var activeElementInst = null;

    /**
 * SECTION: handle `change` event
 */
    function shouldUseChangeEvent(elem) {
        var nodeName = elem.nodeName && elem
            .nodeName
            .toLowerCase();
        return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
    }

    function manualDispatchChangeEvent(nativeEvent) {
        var event = createAndAccumulateChangeEvent(activeElementInst, nativeEvent, getEventTarget(nativeEvent));

        // If change and propertychange bubbled, we'd just bind to it like all the other
        // events and have it go through ReactBrowserEventEmitter. Since it doesn't, we
        // manually listen for the events and so we have to enqueue and process the
        // abstract event manually.
        //
        // Batching is necessary here in order to ensure that all event handlers run
        // before the next rerender (including event handlers attached to ancestor
        // elements instead of directly on the input). Without this, controlled
        // components don't work properly in conjunction with event bubbling because the
        // component is rerendered and the value reverted before all the event handlers
        // can run. See https://github.com/facebook/react/issues/708.
        batchedUpdates(runEventInBatch, event);
    }

    function runEventInBatch(event) {
        enqueueEvents(event);
        processEventQueue(false);
    }

    function getInstIfValueChanged(targetInst) {
        var targetNode = getNodeFromInstance$1(targetInst);
        if (updateValueIfChanged(targetNode)) {
            return targetInst;
        }
    }

    function getTargetInstForChangeEvent(topLevelType, targetInst) {
        if (topLevelType === 'topChange') {
            return targetInst;
        }
    }

    /**
 * SECTION: handle `input` event
 */
    var isInputEventSupported = false;
    if (ExecutionEnvironment_1.canUseDOM) {
        // IE9 claims to support the input event but fails to trigger it when deleting
        // text, so we ignore its input events.
        isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 9);
    }

    /**
 * (For IE <=9) Starts tracking propertychange events on the passed-in element
 * and override the value property so that we can distinguish user events from
 * value changes in JS.
 */
    function startWatchingForValueChange(target, targetInst) {
        activeElement = target;
        activeElementInst = targetInst;
        activeElement.attachEvent('onpropertychange', handlePropertyChange);
    }

    /**
 * (For IE <=9) Removes the event listeners from the currently-tracked element,
 * if any exists.
 */
    function stopWatchingForValueChange() {
        if (!activeElement) {
            return;
        }
        activeElement.detachEvent('onpropertychange', handlePropertyChange);
        activeElement = null;
        activeElementInst = null;
    }

    /**
 * (For IE <=9) Handles a propertychange event, sending a `change` event if
 * the value of the active element has changed.
 */
    function handlePropertyChange(nativeEvent) {
        if (nativeEvent.propertyName !== 'value') {
            return;
        }
        if (getInstIfValueChanged(activeElementInst)) {
            manualDispatchChangeEvent(nativeEvent);
        }
    }

    function handleEventsForInputEventPolyfill(topLevelType, target, targetInst) {
        if (topLevelType === 'topFocus') {
            // In IE9, propertychange fires for most input events but is buggy and doesn't
            // fire when text is deleted, but conveniently, selectionchange appears to fire
            // in all of the remaining cases so we catch those and forward the event if the
            // value has changed In either case, we don't want to call the event handler if
            // the value is changed from JS so we redefine a setter for `.value` that
            // updates our activeElementValue variable, allowing us to ignore those changes
            //
            // stopWatching() should be a noop here but we call it just in case we missed a
            // blur event somehow.
            stopWatchingForValueChange();
            startWatchingForValueChange(target, targetInst);
        } else if (topLevelType === 'topBlur') {
            stopWatchingForValueChange();
        }
    }

    // For IE8 and IE9.
    function getTargetInstForInputEventPolyfill(topLevelType, targetInst) {
        if (topLevelType === 'topSelectionChange' || topLevelType === 'topKeyUp' || topLevelType === 'topKeyDown') {
            // On the selectionchange event, the target is just document which isn't helpful
            // for us so just check activeElement instead.
            //
            // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
            // propertychange on the first input event after setting `value` from a script
            // and fires only keydown, keypress, keyup. Catching keyup usually gets it and
            // catching keydown lets us fire an event for the first keystroke if user does a
            // key repeat (it'll be a little delayed: right before the second keystroke).
            // Other input methods (e.g., paste) seem to fire selectionchange normally.
            return getInstIfValueChanged(activeElementInst);
        }
    }

    /**
 * SECTION: handle `click` event
 */
    function shouldUseClickEvent(elem) {
        // Use the `click` event to detect changes to checkbox and radio inputs. This
        // approach works across all browsers, whereas `change` does not fire until
        // `blur` in IE8.
        var nodeName = elem.nodeName;
        return nodeName && nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
    }

    function getTargetInstForClickEvent(topLevelType, targetInst) {
        if (topLevelType === 'topClick') {
            return getInstIfValueChanged(targetInst);
        }
    }

    function getTargetInstForInputOrChangeEvent(topLevelType, targetInst) {
        if (topLevelType === 'topInput' || topLevelType === 'topChange') {
            return getInstIfValueChanged(targetInst);
        }
    }

    function handleControlledInputBlur(inst, node) {
        // TODO: In IE, inst is occasionally null. Why?
        if (inst == null) {
            return;
        }

        // Fiber and ReactDOM keep wrapper state in separate places
        var state = inst._wrapperState || node._wrapperState;

        if (!state || !state.controlled || node.type !== 'number') {
            return;
        }

        // If controlled, assign the value attribute to the current value on blur
        var value = '' + node.value;
        if (node.getAttribute('value') !== value) {
            node.setAttribute('value', value);
        }
    }

    /**
 * This plugin creates an `onChange` event that normalizes change events
 * across form elements. This event fires at a time when it's possible to
 * change the element's value without seeing a flicker.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - select
 */
    var ChangeEventPlugin = {
        eventTypes: eventTypes$1,

        _isInputEventSupported: isInputEventSupported,

        extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            var targetNode = targetInst
                ? getNodeFromInstance$1(targetInst)
                : window;

            var getTargetInstFunc,
                handleEventFunc;
            if (shouldUseChangeEvent(targetNode)) {
                getTargetInstFunc = getTargetInstForChangeEvent;
            } else if (isTextInputElement(targetNode)) {
                if (isInputEventSupported) {
                    getTargetInstFunc = getTargetInstForInputOrChangeEvent;
                } else {
                    getTargetInstFunc = getTargetInstForInputEventPolyfill;
                    handleEventFunc = handleEventsForInputEventPolyfill;
                }
            } else if (shouldUseClickEvent(targetNode)) {
                getTargetInstFunc = getTargetInstForClickEvent;
            }

            if (getTargetInstFunc) {
                var inst = getTargetInstFunc(topLevelType, targetInst);
                if (inst) {
                    var event = createAndAccumulateChangeEvent(inst, nativeEvent, nativeEventTarget);
                    return event;
                }
            }

            if (handleEventFunc) {
                handleEventFunc(topLevelType, targetNode, targetInst);
            }

            // When blurring, set the value attribute for number inputs
            if (topLevelType === 'topBlur') {
                handleControlledInputBlur(targetInst, targetNode);
            }
        }
    };

    /**
 * Module that is injectable into `EventPluginHub`, that specifies a
 * deterministic ordering of `EventPlugin`s. A convenient way to reason about
 * plugins, without having to package every one of them. This is better than
 * having plugins be ordered in the same order that they are injected because
 * that ordering would be influenced by the packaging order.
 * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
 * preventing default on events is convenient in `SimpleEventPlugin` handlers.
 */
    var DOMEventPluginOrder = [
        'ResponderEventPlugin',
        'SimpleEventPlugin',
        'TapEventPlugin',
        'EnterLeaveEventPlugin',
        'ChangeEventPlugin',
        'SelectEventPlugin',
        'BeforeInputEventPlugin'
    ];

    /**
 * @interface UIEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
    var UIEventInterface = {
        view: null,
        detail: null
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
    function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$1.augmentClass(SyntheticUIEvent, UIEventInterface);

    /**
 * Translation from modifier key to the associated property in the event.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
 */

    var modifierKeyToProp = {
        Alt: 'altKey',
        Control: 'ctrlKey',
        Meta: 'metaKey',
        Shift: 'shiftKey'
    };

    // IE8 does not implement getModifierState so we simply map it to the only
    // modifier keys exposed by the event itself, does not support Lock-keys.
    // Currently, all major browsers except Chrome seems to support Lock-keys.
    function modifierStateGetter(keyArg) {
        var syntheticEvent = this;
        var nativeEvent = syntheticEvent.nativeEvent;
        if (nativeEvent.getModifierState) {
            return nativeEvent.getModifierState(keyArg);
        }
        var keyProp = modifierKeyToProp[keyArg];
        return keyProp
            ? !!nativeEvent[keyProp]
            : false;
    }

    function getEventModifierState(nativeEvent) {
        return modifierStateGetter;
    }

    /**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
    var MouseEventInterface = {
        screenX: null,
        screenY: null,
        clientX: null,
        clientY: null,
        pageX: null,
        pageY: null,
        ctrlKey: null,
        shiftKey: null,
        altKey: null,
        metaKey: null,
        getModifierState: getEventModifierState,
        button: null,
        buttons: null,
        relatedTarget: function (event) {
            return event.relatedTarget || (event.fromElement === event.srcElement
                ? event.toElement
                : event.fromElement);
        }
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
    function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);

    var eventTypes$2 = {
        mouseEnter: {
            registrationName: 'onMouseEnter',
            dependencies: ['topMouseOut', 'topMouseOver']
        },
        mouseLeave: {
            registrationName: 'onMouseLeave',
            dependencies: ['topMouseOut', 'topMouseOver']
        }
    };

    var EnterLeaveEventPlugin = {
        eventTypes: eventTypes$2,

        /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   */
        extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            if (topLevelType === 'topMouseOver' && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
                return null;
            }
            if (topLevelType !== 'topMouseOut' && topLevelType !== 'topMouseOver') {
                // Must not be a mouse in or mouse out - ignoring.
                return null;
            }

            var win;
            if (nativeEventTarget.window === nativeEventTarget) {
                // `nativeEventTarget` is probably a window object.
                win = nativeEventTarget;
            } else {
                // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
                var doc = nativeEventTarget.ownerDocument;
                if (doc) {
                    win = doc.defaultView || doc.parentWindow;
                } else {
                    win = window;
                }
            }

            var from;
            var to;
            if (topLevelType === 'topMouseOut') {
                from = targetInst;
                var related = nativeEvent.relatedTarget || nativeEvent.toElement;
                to = related
                    ? getClosestInstanceFromNode(related)
                    : null;
            } else {
                // Moving to a node from outside the window.
                from = null;
                to = targetInst;
            }

            if (from === to) {
                // Nothing pertains to our managed components.
                return null;
            }

            var fromNode = from == null
                ? win
                : getNodeFromInstance$1(from);
            var toNode = to == null
                ? win
                : getNodeFromInstance$1(to);

            var leave = SyntheticMouseEvent.getPooled(eventTypes$2.mouseLeave, from, nativeEvent, nativeEventTarget);
            leave.type = 'mouseleave';
            leave.target = fromNode;
            leave.relatedTarget = toNode;

            var enter = SyntheticMouseEvent.getPooled(eventTypes$2.mouseEnter, to, nativeEvent, nativeEventTarget);
            enter.type = 'mouseenter';
            enter.target = toNode;
            enter.relatedTarget = fromNode;

            accumulateEnterLeaveDispatches(leave, enter, from, to);

            return [leave, enter];
        }
    };

    /**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 *
 * Note that this module is currently shared and assumed to be stateless.
 * If this becomes an actual Map, that will break.
 */

    /**
 * This API should be called `delete` but we'd have to make sure to always
 * transform these to strings for IE support. When this transform is fully
 * supported we can rename it.
 */

    function get(key) {
        return key._reactInternalFiber;
    }

    function has(key) {
        return key._reactInternalFiber !== undefined;
    }

    function set(key, value) {
        key._reactInternalFiber = value;
    }

    var ReactInternals$1 = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

    var ReactCurrentOwner = ReactInternals$1.ReactCurrentOwner;
    var ReactDebugCurrentFrame = ReactInternals$1.ReactDebugCurrentFrame;

    function getComponentName(fiber) {
        var type = fiber.type;

        if (typeof type === 'string') {
            return type;
        }
        if (typeof type === 'function') {
            return type.displayName || type.name;
        }
        return null;
    }

    // Don't change these two values:
    var NoEffect = 0; //           0b00000000
    var PerformedWork = 1; //      0b00000001

    // You can change the rest (and add more).
    var Placement = 2; //          0b00000010
    var Update = 4; //             0b00000100
    var PlacementAndUpdate = 6; // 0b00000110
    var Deletion = 8; //           0b00001000
    var ContentReset = 16; //      0b00010000
    var Callback = 32; //          0b00100000
    var Err = 64; //               0b01000000
    var Ref = 128; //              0b10000000

    var MOUNTING = 1;
    var MOUNTED = 2;
    var UNMOUNTED = 3;

    function isFiberMountedImpl(fiber) {
        var node = fiber;
        if (!fiber.alternate) {
            // If there is no alternate, this might be a new tree that isn't inserted yet.
            // If it is, then it will have a pending insertion effect on it.
            if ((node.effectTag & Placement) !== NoEffect) {
                return MOUNTING;
            }
            while (node['return']) {
                node = node['return'];
                if ((node.effectTag & Placement) !== NoEffect) {
                    return MOUNTING;
                }
            }
        } else {
            while (node['return']) {
                node = node['return'];
            }
        }
        if (node.tag === HostRoot) {
            // TODO: Check if this was a nested HostRoot when used with
            // renderContainerIntoSubtree.
            return MOUNTED;
        }
        // If we didn't hit the root, that means that we're in an disconnected tree that
        // has been unmounted.
        return UNMOUNTED;
    }

    function isFiberMounted(fiber) {
        return isFiberMountedImpl(fiber) === MOUNTED;
    }

    function isMounted(component) {
        {
            var owner = ReactCurrentOwner.current;
            if (owner !== null && owner.tag === ClassComponent) {
                var ownerFiber = owner;
                var instance = ownerFiber.stateNode;
                warning_1$1(instance._warnedAboutRefsInRender, '%s is accessing isMounted inside its render() function. render() should be a pur' +
                        'e function of props and state. It should never access something that requires st' +
                        'ale data from the previous render, such as refs. Move this logic to componentDid' +
                        'Mount and componentDidUpdate instead.',
                getComponentName(ownerFiber) || 'A component');
                instance._warnedAboutRefsInRender = true;
            }
        }

        var fiber = get(component);
        if (!fiber) {
            return false;
        }
        return isFiberMountedImpl(fiber) === MOUNTED;
    }

    function assertIsMounted(fiber) {
        !(isFiberMountedImpl(fiber) === MOUNTED)
            ? invariant_1$1(false, 'Unable to find node on an unmounted component.')
            : void 0;
    }

    function findCurrentFiberUsingSlowPath(fiber) {
        var alternate = fiber.alternate;
        if (!alternate) {
            // If there is no alternate, then we only need to check if it is mounted.
            var state = isFiberMountedImpl(fiber);
            !(state !== UNMOUNTED)
                ? invariant_1$1(false, 'Unable to find node on an unmounted component.')
                : void 0;
            if (state === MOUNTING) {
                return null;
            }
            return fiber;
        }
        // If we have two possible branches, we'll walk backwards up to the root to see
        // what path the root points to. On the way we may hit one of the special cases
        // and we'll deal with them.
        var a = fiber;
        var b = alternate;
        while (true) {
            var parentA = a['return'];
            var parentB = parentA
                ? parentA.alternate
                : null;
            if (!parentA || !parentB) {
                // We're at the root.
                break;
            }

            // If both copies of the parent fiber point to the same child, we can assume
            // that the child is current. This happens when we bailout on low priority: the
            // bailed out fiber's child reuses the current child.
            if (parentA.child === parentB.child) {
                var child = parentA.child;
                while (child) {
                    if (child === a) {
                        // We've determined that A is the current branch.
                        assertIsMounted(parentA);
                        return fiber;
                    }
                    if (child === b) {
                        // We've determined that B is the current branch.
                        assertIsMounted(parentA);
                        return alternate;
                    }
                    child = child.sibling;
                }
                // We should never have an alternate for any mounting node. So the only way this
                // could possibly happen is if this was unmounted, if at all.
                invariant_1$1(false, 'Unable to find node on an unmounted component.');
            }

            if (a['return'] !== b['return']) {
                // The return pointer of A and the return pointer of B point to different
                // fibers. We assume that return pointers never criss-cross, so A must belong to
                // the child set of A.return, and B must belong to the child set of B.return.
                a = parentA;
                b = parentB;
            } else {
                // The return pointers point to the same fiber. We'll have to use the default,
                // slow path: scan the child sets of each parent alternate to see which child
                // belongs to which set.
                //
                // Search parent A's child set
                var didFindChild = false;
                var _child = parentA.child;
                while (_child) {
                    if (_child === a) {
                        didFindChild = true;
                        a = parentA;
                        b = parentB;
                        break;
                    }
                    if (_child === b) {
                        didFindChild = true;
                        b = parentA;
                        a = parentB;
                        break;
                    }
                    _child = _child.sibling;
                }
                if (!didFindChild) {
                    // Search parent B's child set
                    _child = parentB.child;
                    while (_child) {
                        if (_child === a) {
                            didFindChild = true;
                            a = parentB;
                            b = parentA;
                            break;
                        }
                        if (_child === b) {
                            didFindChild = true;
                            b = parentB;
                            a = parentA;
                            break;
                        }
                        _child = _child.sibling;
                    }
                    !didFindChild
                        ? invariant_1$1(false, 'Child was not found in either parent set. This indicates a bug in React related ' +
                                'to the return pointer. Please file an issue.')
                        : void 0;
                }
            }

            !(a.alternate === b)
                ? invariant_1$1(false, 'Return fibers should always be each others\' alternates. This error is likely ca' +
                        'used by a bug in React. Please file an issue.')
                : void 0;
        }
        // If the root is not a host container, we're in a disconnected tree. I.e.
        // unmounted.
        !(a.tag === HostRoot)
            ? invariant_1$1(false, 'Unable to find node on an unmounted component.')
            : void 0;
        if (a.stateNode.current === a) {
            // We've determined that A is the current branch.
            return fiber;
        }
        // Otherwise B has to be current branch.
        return alternate;
    }

    function findCurrentHostFiber(parent) {
        var currentParent = findCurrentFiberUsingSlowPath(parent);
        if (!currentParent) {
            return null;
        }

        // Next we'll drill down this component to find the first HostComponent/Text.
        var node = currentParent;
        while (true) {
            if (node.tag === HostComponent || node.tag === HostText) {
                return node;
            } else if (node.child) {
                node.child['return'] = node;
                node = node.child;
                continue;
            }
            if (node === currentParent) {
                return null;
            }
            while (!node.sibling) {
                if (!node['return'] || node['return'] === currentParent) {
                    return null;
                }
                node = node['return'];
            }
            node.sibling['return'] = node['return'];
            node = node.sibling;
        }
        // Flow needs the return null here, but ESLint complains about it.
        // eslint-disable-next-line no-unreachable
        return null;
    }

    function findCurrentHostFiberWithNoPortals(parent) {
        var currentParent = findCurrentFiberUsingSlowPath(parent);
        if (!currentParent) {
            return null;
        }

        // Next we'll drill down this component to find the first HostComponent/Text.
        var node = currentParent;
        while (true) {
            if (node.tag === HostComponent || node.tag === HostText) {
                return node;
            } else if (node.child && node.tag !== HostPortal) {
                node.child['return'] = node;
                node = node.child;
                continue;
            }
            if (node === currentParent) {
                return null;
            }
            while (!node.sibling) {
                if (!node['return'] || node['return'] === currentParent) {
                    return null;
                }
                node = node['return'];
            }
            node.sibling['return'] = node['return'];
            node = node.sibling;
        }
        // Flow needs the return null here, but ESLint complains about it.
        // eslint-disable-next-line no-unreachable
        return null;
    }

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

    /**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
    var EventListener = {
        /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
        listen: function listen(target, eventType, callback) {
            if (target.addEventListener) {
                target.addEventListener(eventType, callback, false);
                return {
                    remove: function remove() {
                        target.removeEventListener(eventType, callback, false);
                    }
                };
            } else if (target.attachEvent) {
                target.attachEvent('on' + eventType, callback);
                return {
                    remove: function remove() {
                        target.detachEvent('on' + eventType, callback);
                    }
                };
            }
        },

        /**
   * Listen to DOM events during the capture phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
        capture: function capture(target, eventType, callback) {
            if (target.addEventListener) {
                target.addEventListener(eventType, callback, true);
                return {
                    remove: function remove() {
                        target.removeEventListener(eventType, callback, true);
                    }
                };
            } else {
                {
                    console.error('Attempted to listen to events during the capture phase on a browser that does no' +
                            't support the capture phase. Your application will not receive some events.');
                }
                return {remove: emptyFunction_1};
            }
        },

        registerDefault: function registerDefault() {}
    };

    var EventListener_1 = EventListener;

    var CALLBACK_BOOKKEEPING_POOL_SIZE = 10;
    var callbackBookkeepingPool = [];

    /**
 * Find the deepest React component completely containing the root of the
 * passed-in instance (for use when entire React trees are nested within each
 * other). If React trees are not nested, returns null.
 */
    function findRootContainerNode(inst) {
        // TODO: It may be a good idea to cache this to prevent unnecessary DOM
        // traversal, but caching is difficult to do correctly without using a mutation
        // observer to listen for all DOM changes.
        while (inst['return']) {
            inst = inst['return'];
        }
        if (inst.tag !== HostRoot) {
            // This can happen if we're in a detached tree.
            return null;
        }
        return inst.stateNode.containerInfo;
    }

    // Used to store ancestor hierarchy in top level callback
    function getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst) {
        if (callbackBookkeepingPool.length) {
            var instance = callbackBookkeepingPool.pop();
            instance.topLevelType = topLevelType;
            instance.nativeEvent = nativeEvent;
            instance.targetInst = targetInst;
            return instance;
        }
        return {topLevelType: topLevelType, nativeEvent: nativeEvent, targetInst: targetInst, ancestors: []};
    }

    function releaseTopLevelCallbackBookKeeping(instance) {
        instance.topLevelType = null;
        instance.nativeEvent = null;
        instance.targetInst = null;
        instance.ancestors.length = 0;
        if (callbackBookkeepingPool.length < CALLBACK_BOOKKEEPING_POOL_SIZE) {
            callbackBookkeepingPool.push(instance);
        }
    }

    function handleTopLevelImpl(bookKeeping) {
        var targetInst = bookKeeping.targetInst;

        // Loop through the hierarchy, in case there's any nested components. It's
        // important that we build the array of ancestors before calling any event
        // handlers, because event handlers can modify the DOM, leading to
        // inconsistencies with ReactMount's node cache. See #1105.
        var ancestor = targetInst;
        do {
            if (!ancestor) {
                bookKeeping
                    .ancestors
                    .push(ancestor);
                break;
            }
            var root = findRootContainerNode(ancestor);
            if (!root) {
                break;
            }
            bookKeeping
                .ancestors
                .push(ancestor);
            ancestor = getClosestInstanceFromNode(root);
        } while (ancestor);

        for (var i = 0; i < bookKeeping.ancestors.length; i++) {
            targetInst = bookKeeping.ancestors[i];
            _handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
        }
    }

    // TODO: can we stop exporting these?
    var _enabled = true;
    var _handleTopLevel = void 0;

    function setHandleTopLevel(handleTopLevel) {
        _handleTopLevel = handleTopLevel;
    }

    function setEnabled(enabled) {
        _enabled = !!enabled;
    }

    function isEnabled() {
        return _enabled;
    }

    /**
 * Traps top-level events by using event bubbling.
 *
 * @param {string} topLevelType Record from `BrowserEventConstants`.
 * @param {string} handlerBaseName Event name (e.g. "click").
 * @param {object} element Element on which to attach listener.
 * @return {?object} An object with a remove function which will forcefully
 *                  remove the listener.
 * @internal
 */
    function trapBubbledEvent(topLevelType, handlerBaseName, element) {
        if (!element) {
            return null;
        }
        return EventListener_1.listen(element, handlerBaseName, dispatchEvent.bind(null, topLevelType));
    }

    /**
 * Traps a top-level event by using event capturing.
 *
 * @param {string} topLevelType Record from `BrowserEventConstants`.
 * @param {string} handlerBaseName Event name (e.g. "click").
 * @param {object} element Element on which to attach listener.
 * @return {?object} An object with a remove function which will forcefully
 *                  remove the listener.
 * @internal
 */
    function trapCapturedEvent(topLevelType, handlerBaseName, element) {
        if (!element) {
            return null;
        }
        return EventListener_1.capture(element, handlerBaseName, dispatchEvent.bind(null, topLevelType));
    }

    function dispatchEvent(topLevelType, nativeEvent) {
        if (!_enabled) {
            return;
        }

        var nativeEventTarget = getEventTarget(nativeEvent);
        var targetInst = getClosestInstanceFromNode(nativeEventTarget);
        if (targetInst !== null && typeof targetInst.tag === 'number' && !isFiberMounted(targetInst)) {
            // If we get an event (ex: img onload) before committing that component's mount,
            // ignore it for now (that is, treat it as if it was an event on a non-React
            // tree). We might also consider queueing events and dispatching them after the
            // mount.
            targetInst = null;
        }

        var bookKeeping = getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst);

        try {
            // Event queue being processed in the same cycle allows `preventDefault`.
            batchedUpdates(handleTopLevelImpl, bookKeeping);
        } finally {
            releaseTopLevelCallbackBookKeeping(bookKeeping);
        }
    }

    var ReactDOMEventListener = Object.freeze({
        get _enabled() {
            return _enabled;
        },
        get _handleTopLevel() {
            return _handleTopLevel;
        },
        setHandleTopLevel: setHandleTopLevel,
        setEnabled: setEnabled,
        isEnabled: isEnabled,
        trapBubbledEvent: trapBubbledEvent,
        trapCapturedEvent: trapCapturedEvent,
        dispatchEvent: dispatchEvent
    });

    /**
 * Generate a mapping of standard vendor prefixes using the defined style property and event name.
 *
 * @param {string} styleProp
 * @param {string} eventName
 * @returns {object}
 */
    function makePrefixMap(styleProp, eventName) {
        var prefixes = {};

        prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
        prefixes['Webkit' + styleProp] = 'webkit' + eventName;
        prefixes['Moz' + styleProp] = 'moz' + eventName;
        prefixes['ms' + styleProp] = 'MS' + eventName;
        prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();

        return prefixes;
    }

    /**
 * A list of event names to a configurable list of vendor prefixes.
 */
    var vendorPrefixes = {
        animationend: makePrefixMap('Animation', 'AnimationEnd'),
        animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
        animationstart: makePrefixMap('Animation', 'AnimationStart'),
        transitionend: makePrefixMap('Transition', 'TransitionEnd')
    };

    /**
 * Event names that have already been detected and prefixed (if applicable).
 */
    var prefixedEventNames = {};

    /**
 * Element to check for prefixes on.
 */
    var style = {};

    /**
 * Bootstrap if a DOM exists.
 */
    if (ExecutionEnvironment_1.canUseDOM) {
        style = document
            .createElement('div')
            .style;

        // On some platforms, in particular some releases of Android 4.x, the
        // un-prefixed "animation" and "transition" properties are defined on the style
        // object but the events that fire will still be prefixed, so we need to check
        // if the un-prefixed events are usable, and if not remove them from the map.
        if (!('AnimationEvent' in window)) {
            delete vendorPrefixes.animationend.animation;
            delete vendorPrefixes.animationiteration.animation;
            delete vendorPrefixes.animationstart.animation;
        }

        // Same as above
        if (!('TransitionEvent' in window)) {
            delete vendorPrefixes.transitionend.transition;
        }
    }

    /**
 * Attempts to determine the correct vendor prefixed event name.
 *
 * @param {string} eventName
 * @returns {string}
 */
    function getVendorPrefixedEventName(eventName) {
        if (prefixedEventNames[eventName]) {
            return prefixedEventNames[eventName];
        } else if (!vendorPrefixes[eventName]) {
            return eventName;
        }

        var prefixMap = vendorPrefixes[eventName];

        for (var styleProp in prefixMap) {
            if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
                return prefixedEventNames[eventName] = prefixMap[styleProp];
            }
        }

        return '';
    }

    /**
 * Types of raw signals from the browser caught at the top level.
 *
 * For events like 'submit' which don't consistently bubble (which we
 * trap at a lower node than `document`), binding at `document` would
 * cause duplicate events so we don't include them here.
 */
    var topLevelTypes$1 = {
        topAbort: 'abort',
        topAnimationEnd: getVendorPrefixedEventName('animationend') || 'animationend',
        topAnimationIteration: getVendorPrefixedEventName('animationiteration') || 'animationiteration',
        topAnimationStart: getVendorPrefixedEventName('animationstart') || 'animationstart',
        topBlur: 'blur',
        topCancel: 'cancel',
        topCanPlay: 'canplay',
        topCanPlayThrough: 'canplaythrough',
        topChange: 'change',
        topClick: 'click',
        topClose: 'close',
        topCompositionEnd: 'compositionend',
        topCompositionStart: 'compositionstart',
        topCompositionUpdate: 'compositionupdate',
        topContextMenu: 'contextmenu',
        topCopy: 'copy',
        topCut: 'cut',
        topDoubleClick: 'dblclick',
        topDrag: 'drag',
        topDragEnd: 'dragend',
        topDragEnter: 'dragenter',
        topDragExit: 'dragexit',
        topDragLeave: 'dragleave',
        topDragOver: 'dragover',
        topDragStart: 'dragstart',
        topDrop: 'drop',
        topDurationChange: 'durationchange',
        topEmptied: 'emptied',
        topEncrypted: 'encrypted',
        topEnded: 'ended',
        topError: 'error',
        topFocus: 'focus',
        topInput: 'input',
        topKeyDown: 'keydown',
        topKeyPress: 'keypress',
        topKeyUp: 'keyup',
        topLoadedData: 'loadeddata',
        topLoad: 'load',
        topLoadedMetadata: 'loadedmetadata',
        topLoadStart: 'loadstart',
        topMouseDown: 'mousedown',
        topMouseMove: 'mousemove',
        topMouseOut: 'mouseout',
        topMouseOver: 'mouseover',
        topMouseUp: 'mouseup',
        topPaste: 'paste',
        topPause: 'pause',
        topPlay: 'play',
        topPlaying: 'playing',
        topProgress: 'progress',
        topRateChange: 'ratechange',
        topScroll: 'scroll',
        topSeeked: 'seeked',
        topSeeking: 'seeking',
        topSelectionChange: 'selectionchange',
        topStalled: 'stalled',
        topSuspend: 'suspend',
        topTextInput: 'textInput',
        topTimeUpdate: 'timeupdate',
        topToggle: 'toggle',
        topTouchCancel: 'touchcancel',
        topTouchEnd: 'touchend',
        topTouchMove: 'touchmove',
        topTouchStart: 'touchstart',
        topTransitionEnd: getVendorPrefixedEventName('transitionend') || 'transitionend',
        topVolumeChange: 'volumechange',
        topWaiting: 'waiting',
        topWheel: 'wheel'
    };

    var BrowserEventConstants = {
        topLevelTypes: topLevelTypes$1
    };

    function runEventQueueInBatch(events) {
        enqueueEvents(events);
        processEventQueue(false);
    }

    /**
 * Streams a fired top-level event to `EventPluginHub` where plugins have the
 * opportunity to create `ReactEvent`s to be dispatched.
 */
    function handleTopLevel(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var events = extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
        runEventQueueInBatch(events);
    }

    var topLevelTypes = BrowserEventConstants.topLevelTypes;

    /**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactDOMEventListener, which is injected and can therefore support
 *    pluggable event sources. This is the only work that occurs in the main
 *    thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */

    var alreadyListeningTo = {};
    var reactTopListenersCounter = 0;

    /**
 * To ensure no conflicts with other potential React instances on the page
 */
    var topListenersIDKey = '_reactListenersID' + ('' + Math.random()).slice(2);

    function getListeningForDocument(mountAt) {
        // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
        // directly.
        if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
            mountAt[topListenersIDKey] = reactTopListenersCounter++;
            alreadyListeningTo[mountAt[topListenersIDKey]] = {};
        }
        return alreadyListeningTo[mountAt[topListenersIDKey]];
    }

    /**
 * We listen for bubbled touch events on the document object.
 *
 * Firefox v8.01 (and possibly others) exhibited strange behavior when
 * mounting `onmousemove` events at some node that was not the document
 * element. The symptoms were that if your mouse is not moving over something
 * contained within that mount point (for example on the background) the
 * top-level listeners for `onmousemove` won't be called. However, if you
 * register the `mousemove` on the document object, then it will of course
 * catch all `mousemove`s. This along with iOS quirks, justifies restricting
 * top-level listeners to the document object only, at least for these
 * movement types of events and possibly all events.
 *
 * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
 *
 * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
 * they bubble to document.
 *
 * @param {string} registrationName Name of listener (e.g. `onClick`).
 * @param {object} contentDocumentHandle Document which owns the container
 */
    function listenTo(registrationName, contentDocumentHandle) {
        var mountAt = contentDocumentHandle;
        var isListening = getListeningForDocument(mountAt);
        var dependencies = registrationNameDependencies[registrationName];

        for (var i = 0; i < dependencies.length; i++) {
            var dependency = dependencies[i];
            if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
                if (dependency === 'topWheel') {
                    if (isEventSupported('wheel')) {
                        trapBubbledEvent('topWheel', 'wheel', mountAt);
                    } else if (isEventSupported('mousewheel')) {
                        trapBubbledEvent('topWheel', 'mousewheel', mountAt);
                    } else {
                        // Firefox needs to capture a different mouse scroll event. @see
                        // http://www.quirksmode.org/dom/events/tests/scroll.html
                        trapBubbledEvent('topWheel', 'DOMMouseScroll', mountAt);
                    }
                } else if (dependency === 'topScroll') {
                    trapCapturedEvent('topScroll', 'scroll', mountAt);
                } else if (dependency === 'topFocus' || dependency === 'topBlur') {
                    trapCapturedEvent('topFocus', 'focus', mountAt);
                    trapCapturedEvent('topBlur', 'blur', mountAt);

                    // to make sure blur and focus event listeners are only attached once
                    isListening.topBlur = true;
                    isListening.topFocus = true;
                } else if (dependency === 'topCancel') {
                    if (isEventSupported('cancel', true)) {
                        trapCapturedEvent('topCancel', 'cancel', mountAt);
                    }
                    isListening.topCancel = true;
                } else if (dependency === 'topClose') {
                    if (isEventSupported('close', true)) {
                        trapCapturedEvent('topClose', 'close', mountAt);
                    }
                    isListening.topClose = true;
                } else if (topLevelTypes.hasOwnProperty(dependency)) {
                    trapBubbledEvent(dependency, topLevelTypes[dependency], mountAt);
                }

                isListening[dependency] = true;
            }
        }
    }

    function isListeningToAllDependencies(registrationName, mountAt) {
        var isListening = getListeningForDocument(mountAt);
        var dependencies = registrationNameDependencies[registrationName];
        for (var i = 0; i < dependencies.length; i++) {
            var dependency = dependencies[i];
            if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
                return false;
            }
        }
        return true;
    }

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

    /* eslint-disable fb-www/typeof-undefined */

    /**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 *
 * @param {?DOMDocument} doc Defaults to current document.
 * @return {?DOMElement}
 */
    function getActiveElement(doc)/*?DOMElement*/
    {
        doc = doc || (typeof document !== 'undefined'
            ? document
            : undefined);
        if (typeof doc === 'undefined') {
            return null;
        }
        try {
            return doc.activeElement || doc.body;
        } catch (e) {
            return doc.body;
        }
    }

    var getActiveElement_1$1 = getActiveElement;

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 *
 */

    /*eslint-disable no-self-compare */

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
    function is(x, y) {
        // SameValue algorithm
        if (x === y) {
            // Steps 1-5, 7-10 Steps 6.b-6.e: +0 != -0 Added the nonzero y check to make
            // Flow happy, but it is redundant
            return x !== 0 || y !== 0 || 1 / x === 1 / y;
        } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
        }
    }

    /**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
    function shallowEqual(objA, objB) {
        if (is(objA, objB)) {
            return true;
        }

        if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
            return false;
        }

        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        // Test for A's keys different from B.
        for (var i = 0; i < keysA.length; i++) {
            if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
                return false;
            }
        }

        return true;
    }

    var shallowEqual_1$1 = shallowEqual;

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

    /**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
    function isNode(object) {
        var doc = object
            ? object.ownerDocument || object
            : document;
        var defaultView = doc.defaultView || window;
        return !!(object && (typeof defaultView.Node === 'function'
            ? object instanceof defaultView.Node
            : typeof object === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
    }

    var isNode_1 = isNode;

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

    /**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
    function isTextNode(object) {
        return isNode_1(object) && object.nodeType == 3;
    }

    var isTextNode_1 = isTextNode;

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

    /*eslint-disable no-bitwise */

    /**
 * Checks if a given DOM node contains or is another DOM node.
 */
    function containsNode(outerNode, innerNode) {
        if (!outerNode || !innerNode) {
            return false;
        } else if (outerNode === innerNode) {
            return true;
        } else if (isTextNode_1(outerNode)) {
            return false;
        } else if (isTextNode_1(innerNode)) {
            return containsNode(outerNode, innerNode.parentNode);
        } else if ('contains' in outerNode) {
            return outerNode.contains(innerNode);
        } else if (outerNode.compareDocumentPosition) {
            return !!(outerNode.compareDocumentPosition(innerNode) & 16);
        } else {
            return false;
        }
    }

    var containsNode_1$1 = containsNode;

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

    /**
 * @param {DOMElement} node input/textarea to focus
 */

    function focusNode(node) {
        // IE8 can throw "Can't move focus to the control because it is invisible, not
        // enabled, or of a type that does not accept the focus." for all kinds of
        // reasons that are too expensive and fragile to test.
        try {
            node.focus();
        } catch (e) {}
    }

    var focusNode_1$1 = focusNode;

    /**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */
    function getLeafNode(node) {
        while (node && node.firstChild) {
            node = node.firstChild;
        }
        return node;
    }

    /**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */
    function getSiblingNode(node) {
        while (node) {
            if (node.nextSibling) {
                return node.nextSibling;
            }
            node = node.parentNode;
        }
    }

    /**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */
    function getNodeForCharacterOffset(root, offset) {
        var node = getLeafNode(root);
        var nodeStart = 0;
        var nodeEnd = 0;

        while (node) {
            if (node.nodeType === TEXT_NODE) {
                nodeEnd = nodeStart + node.textContent.length;

                if (nodeStart <= offset && nodeEnd >= offset) {
                    return {
                        node: node,
                        offset: offset - nodeStart
                    };
                }

                nodeStart = nodeEnd;
            }

            node = getLeafNode(getSiblingNode(node));
        }
    }

    /**
 * @param {DOMElement} outerNode
 * @return {?object}
 */
    function getOffsets(outerNode) {
        var selection = window.getSelection && window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return null;
        }

        var anchorNode = selection.anchorNode;
        var anchorOffset = selection.anchorOffset;
        var focusNode = selection.focusNode;
        var focusOffset = selection.focusOffset;

        // In Firefox, anchorNode and focusNode can be "anonymous divs", e.g. the
        // up/down buttons on an <input type="number">. Anonymous divs do not seem to
        // expose properties, triggering a "Permission denied error" if any of its
        // properties are accessed. The only seemingly possible way to avoid erroring is
        // to access a property that typically works for non-anonymous divs and catch
        // any error that may otherwise arise. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=208427
        try {
            /* eslint-disable no-unused-expressions */
            anchorNode.nodeType;
            focusNode.nodeType;
            /* eslint-enable no-unused-expressions */
        } catch (e) {
            return null;
        }

        return getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset);
    }

    /**
 * Returns {start, end} where `start` is the character/codepoint index of
 * (anchorNode, anchorOffset) within the textContent of `outerNode`, and
 * `end` is the index of (focusNode, focusOffset).
 *
 * Returns null if you pass in garbage input but we should probably just crash.
 *
 * Exported only for testing.
 */
    function getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset) {
        var length = 0;
        var start = -1;
        var end = -1;
        var indexWithinAnchor = 0;
        var indexWithinFocus = 0;
        var node = outerNode;
        var parentNode = null;

        outer : while (true) {
            var next = null;

            while (true) {
                if (node === anchorNode && (anchorOffset === 0 || node.nodeType === TEXT_NODE)) {
                    start = length + anchorOffset;
                }
                if (node === focusNode && (focusOffset === 0 || node.nodeType === TEXT_NODE)) {
                    end = length + focusOffset;
                }

                if (node.nodeType === TEXT_NODE) {
                    length += node.nodeValue.length;
                }

                if ((next = node.firstChild) === null) {
                    break;
                }
                // Moving from `node` to its first child `next`.
                parentNode = node;
                node = next;
            }

            while (true) {
                if (node === outerNode) {
                    // If `outerNode` has children, this is always the second time visiting it. If
                    // it has no children, this is still the first loop, and the only valid
                    // selection is anchorNode and focusNode both equal to this node and both
                    // offsets 0, in which case we will have handled above.
                    break outer;
                }
                if (parentNode === anchorNode && ++indexWithinAnchor === anchorOffset) {
                    start = length;
                }
                if (parentNode === focusNode && ++indexWithinFocus === focusOffset) {
                    end = length;
                }
                if ((next = node.nextSibling) !== null) {
                    break;
                }
                node = parentNode;
                parentNode = node.parentNode;
            }

            // Moving from `node` to its next sibling `next`.
            node = next;
        }

        if (start === -1 || end === -1) {
            // This should never happen. (Would happen if the anchor/focus nodes aren't
            // actually inside the passed-in node.)
            return null;
        }

        return {start: start, end: end};
    }

    /**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programmatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 *
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
    function setOffsets(node, offsets) {
        if (!window.getSelection) {
            return;
        }

        var selection = window.getSelection();
        var length = node[getTextContentAccessor()].length;
        var start = Math.min(offsets.start, length);
        var end = offsets.end === undefined
            ? start
            : Math.min(offsets.end, length);

        // IE 11 uses modern selection, but doesn't support the extend method. Flip
        // backward selections, so we can set with a single range.
        if (!selection.extend && start > end) {
            var temp = end;
            end = start;
            start = temp;
        }

        var startMarker = getNodeForCharacterOffset(node, start);
        var endMarker = getNodeForCharacterOffset(node, end);

        if (startMarker && endMarker) {
            if (selection.rangeCount === 1 && selection.anchorNode === startMarker.node && selection.anchorOffset === startMarker.offset && selection.focusNode === endMarker.node && selection.focusOffset === endMarker.offset) {
                return;
            }
            var range = document.createRange();
            range.setStart(startMarker.node, startMarker.offset);
            selection.removeAllRanges();

            if (start > end) {
                selection.addRange(range);
                selection.extend(endMarker.node, endMarker.offset);
            } else {
                range.setEnd(endMarker.node, endMarker.offset);
                selection.addRange(range);
            }
        }
    }

    function isInDocument(node) {
        return containsNode_1$1(document.documentElement, node);
    }

    /**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */

    function hasSelectionCapabilities(elem) {
        var nodeName = elem && elem.nodeName && elem
            .nodeName
            .toLowerCase();
        return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
    }

    function getSelectionInformation() {
        var focusedElem = getActiveElement_1$1();
        return {
            focusedElem: focusedElem,
            selectionRange: hasSelectionCapabilities(focusedElem)
                ? getSelection$1(focusedElem)
                : null
        };
    }

    /**
 * @restoreSelection: If any selection information was potentially lost,
 * restore it. This is useful when performing operations that could remove dom
 * nodes and place them back in, resulting in focus being lost.
 */
    function restoreSelection(priorSelectionInformation) {
        var curFocusedElem = getActiveElement_1$1();
        var priorFocusedElem = priorSelectionInformation.focusedElem;
        var priorSelectionRange = priorSelectionInformation.selectionRange;
        if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
            if (hasSelectionCapabilities(priorFocusedElem)) {
                setSelection(priorFocusedElem, priorSelectionRange);
            }

            // Focusing a node can change the scroll position, which is undesirable
            var ancestors = [];
            var ancestor = priorFocusedElem;
            while (ancestor = ancestor.parentNode) {
                if (ancestor.nodeType === ELEMENT_NODE) {
                    ancestors.push({element: ancestor, left: ancestor.scrollLeft, top: ancestor.scrollTop});
                }
            }

            focusNode_1$1(priorFocusedElem);

            for (var i = 0; i < ancestors.length; i++) {
                var info = ancestors[i];
                info.element.scrollLeft = info.left;
                info.element.scrollTop = info.top;
            }
        }
    }

    /**
 * @getSelection: Gets the selection bounds of a focused textarea, input or
 * contentEditable node.
 * -@input: Look up selection bounds of this input
 * -@return {start: selectionStart, end: selectionEnd}
 */
    function getSelection$1(input) {
        var selection = void 0;

        if ('selectionStart' in input) {
            // Modern browser with input or textarea.
            selection = {
                start: input.selectionStart,
                end: input.selectionEnd
            };
        } else {
            // Content editable or old IE textarea.
            selection = getOffsets(input);
        }

        return selection || {
            start: 0,
            end: 0
        };
    }

    /**
 * @setSelection: Sets the selection bounds of a textarea or input and focuses
 * the input.
 * -@input     Set selection bounds of this input or textarea
 * -@offsets   Object of same form that is returned from get*
 */
    function setSelection(input, offsets) {
        var start = offsets.start,
            end = offsets.end;

        if (end === undefined) {
            end = start;
        }

        if ('selectionStart' in input) {
            input.selectionStart = start;
            input.selectionEnd = Math.min(end, input.value.length);
        } else {
            setOffsets(input, offsets);
        }
    }

    var skipSelectionChangeEvent = ExecutionEnvironment_1.canUseDOM && 'documentMode' in document && document.documentMode <= 11;

    var eventTypes$3 = {
        select: {
            phasedRegistrationNames: {
                bubbled: 'onSelect',
                captured: 'onSelectCapture'
            },
            dependencies: [
                'topBlur',
                'topContextMenu',
                'topFocus',
                'topKeyDown',
                'topKeyUp',
                'topMouseDown',
                'topMouseUp',
                'topSelectionChange'
            ]
        }
    };

    var activeElement$1 = null;
    var activeElementInst$1 = null;
    var lastSelection = null;
    var mouseDown = false;

    /**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @return {object}
 */
    function getSelection(node) {
        if ('selectionStart' in node && hasSelectionCapabilities(node)) {
            return {start: node.selectionStart, end: node.selectionEnd};
        } else if (window.getSelection) {
            var selection = window.getSelection();
            return {anchorNode: selection.anchorNode, anchorOffset: selection.anchorOffset, focusNode: selection.focusNode, focusOffset: selection.focusOffset};
        }
    }

    /**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @return {?SyntheticEvent}
 */
    function constructSelectEvent(nativeEvent, nativeEventTarget) {
        // Ensure we have the right element, and that the user is not dragging a
        // selection (this matches native `select` event behavior). In HTML5, select
        // fires only on input and textarea thus if there's no focused element we won't
        // dispatch.
        if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement_1$1()) {
            return null;
        }

        // Only fire when selection has actually changed.
        var currentSelection = getSelection(activeElement$1);
        if (!lastSelection || !shallowEqual_1$1(lastSelection, currentSelection)) {
            lastSelection = currentSelection;

            var syntheticEvent = SyntheticEvent$1.getPooled(eventTypes$3.select, activeElementInst$1, nativeEvent, nativeEventTarget);

            syntheticEvent.type = 'select';
            syntheticEvent.target = activeElement$1;

            accumulateTwoPhaseDispatches(syntheticEvent);

            return syntheticEvent;
        }

        return null;
    }

    /**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */
    var SelectEventPlugin = {
        eventTypes: eventTypes$3,

        extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            var doc = nativeEventTarget.window === nativeEventTarget
                ? nativeEventTarget.document
                : nativeEventTarget.nodeType === DOCUMENT_NODE
                    ? nativeEventTarget
                    : nativeEventTarget.ownerDocument;
            // Track whether all listeners exists for this plugin. If none exist, we do not
            // extract events. See #3639.
            if (!doc || !isListeningToAllDependencies('onSelect', doc)) {
                return null;
            }

            var targetNode = targetInst
                ? getNodeFromInstance$1(targetInst)
                : window;

            switch (topLevelType) {
                    // Track the input node that has focus.
                case 'topFocus':
                    if (isTextInputElement(targetNode) || targetNode.contentEditable === 'true') {
                        activeElement$1 = targetNode;
                        activeElementInst$1 = targetInst;
                        lastSelection = null;
                    }
                    break;
                case 'topBlur':
                    activeElement$1 = null;
                    activeElementInst$1 = null;
                    lastSelection = null;
                    break;
                    // Don't fire the event while the user is dragging. This matches the semantics
                    // of the native select event.
                case 'topMouseDown':
                    mouseDown = true;
                    break;
                case 'topContextMenu':
                case 'topMouseUp':
                    mouseDown = false;
                    return constructSelectEvent(nativeEvent, nativeEventTarget);
                    // Chrome and IE fire non-standard event when selection is changed (and
                    // sometimes when it hasn't). IE's event fires out of order with respect to key
                    // and input events on deletion, so we discard it.
                    //
                    // Firefox doesn't support selectionchange, so check selection status after each
                    // key entry. The selection changes after keydown and before keyup, but we check
                    // on keydown as well in the case of holding down a key, when multiple keydown
                    // events are fired but only one keyup is. This is also our approach for IE
                    // handling, for the reason above.
                case 'topSelectionChange':
                    if (skipSelectionChangeEvent) {
                        break;
                    }
                    // falls through
                case 'topKeyDown':
                case 'topKeyUp':
                    return constructSelectEvent(nativeEvent, nativeEventTarget);
            }

            return null;
        }
    };

    /**
 * @interface Event
 * @see http://www.w3.org/TR/css3-animations/#AnimationEvent-interface
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
 */
    var AnimationEventInterface = {
        animationName: null,
        elapsedTime: null,
        pseudoElement: null
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
    function SyntheticAnimationEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$1.augmentClass(SyntheticAnimationEvent, AnimationEventInterface);

    /**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */
    var ClipboardEventInterface = {
        clipboardData: function (event) {
            return 'clipboardData' in event
                ? event.clipboardData
                : window.clipboardData;
        }
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
    function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$1.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);

    /**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
    var FocusEventInterface = {
        relatedTarget: null
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
    function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent.augmentClass(SyntheticFocusEvent, FocusEventInterface);

    /**
 * `charCode` represents the actual "character code" and is safe to use with
 * `String.fromCharCode`. As such, only keys that correspond to printable
 * characters produce a valid `charCode`, the only exception to this is Enter.
 * The Tab-key is considered non-printable and does not have a `charCode`,
 * presumably because it does not produce a tab-character in browsers.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {number} Normalized `charCode` property.
 */
    function getEventCharCode(nativeEvent) {
        var charCode;
        var keyCode = nativeEvent.keyCode;

        if ('charCode' in nativeEvent) {
            charCode = nativeEvent.charCode;

            // FF does not set `charCode` for the Enter-key, check against `keyCode`.
            if (charCode === 0 && keyCode === 13) {
                charCode = 13;
            }
        } else {
            // IE8 does not implement `charCode`, but `keyCode` has the correct value.
            charCode = keyCode;
        }

        // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
        // Must not discard the (non-)printable Enter-key.
        if (charCode >= 32 || charCode === 13) {
            return charCode;
        }

        return 0;
    }

    /**
 * Normalization of deprecated HTML5 `key` values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
    var normalizeKey = {
        Esc: 'Escape',
        Spacebar: ' ',
        Left: 'ArrowLeft',
        Up: 'ArrowUp',
        Right: 'ArrowRight',
        Down: 'ArrowDown',
        Del: 'Delete',
        Win: 'OS',
        Menu: 'ContextMenu',
        Apps: 'ContextMenu',
        Scroll: 'ScrollLock',
        MozPrintableKey: 'Unidentified'
    };

    /**
 * Translation from legacy `keyCode` to HTML5 `key`
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
    var translateToKey = {
        '8': 'Backspace',
        '9': 'Tab',
        '12': 'Clear',
        '13': 'Enter',
        '16': 'Shift',
        '17': 'Control',
        '18': 'Alt',
        '19': 'Pause',
        '20': 'CapsLock',
        '27': 'Escape',
        '32': ' ',
        '33': 'PageUp',
        '34': 'PageDown',
        '35': 'End',
        '36': 'Home',
        '37': 'ArrowLeft',
        '38': 'ArrowUp',
        '39': 'ArrowRight',
        '40': 'ArrowDown',
        '45': 'Insert',
        '46': 'Delete',
        '112': 'F1',
        '113': 'F2',
        '114': 'F3',
        '115': 'F4',
        '116': 'F5',
        '117': 'F6',
        '118': 'F7',
        '119': 'F8',
        '120': 'F9',
        '121': 'F10',
        '122': 'F11',
        '123': 'F12',
        '144': 'NumLock',
        '145': 'ScrollLock',
        '224': 'Meta'
    };

    /**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */
    function getEventKey(nativeEvent) {
        if (nativeEvent.key) {
            // Normalize inconsistent values reported by browsers due to implementations of
            // a working draft specification. FireFox implements `key` but returns
            // `MozPrintableKey` for all printable characters (normalized to
            // `Unidentified`), ignore it.
            var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
            if (key !== 'Unidentified') {
                return key;
            }
        }

        // Browser does not implement `key`, polyfill as much of it as we can.
        if (nativeEvent.type === 'keypress') {
            var charCode = getEventCharCode(nativeEvent);

            // The enter-key is technically both printable and non-printable and can thus be
            // captured by `keypress`, no other non-printable key should.
            return charCode === 13
                ? 'Enter'
                : String.fromCharCode(charCode);
        }
        if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
            // While user keyboard layout determines the actual meaning of each `keyCode`
            // value, almost all function keys have a universal value.
            return translateToKey[nativeEvent.keyCode] || 'Unidentified';
        }
        return '';
    }

    /**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
    var KeyboardEventInterface = {
        key: getEventKey,
        location: null,
        ctrlKey: null,
        shiftKey: null,
        altKey: null,
        metaKey: null,
        repeat: null,
        locale: null,
        getModifierState: getEventModifierState,
        // Legacy Interface
        charCode: function (event) {
            // `charCode` is the result of a KeyPress event and represents the value of the
            // actual printable character. KeyPress is deprecated, but its replacement is
            // not yet final and not implemented in any major browser. Only KeyPress has
            // charCode.
            if (event.type === 'keypress') {
                return getEventCharCode(event);
            }
            return 0;
        },
        keyCode: function (event) {
            // `keyCode` is the result of a KeyDown/Up event and represents the value of
            // physical keyboard key. The actual meaning of the value depends on the users'
            // keyboard layout which cannot be detected. Assuming that it is a US keyboard
            // layout provides a surprisingly accurate mapping for US and European users.
            // Due to this, it is left to the user to implement at this time.
            if (event.type === 'keydown' || event.type === 'keyup') {
                return event.keyCode;
            }
            return 0;
        },
        which: function (event) {
            // `which` is an alias for either `keyCode` or `charCode` depending on the type
            // of the event.
            if (event.type === 'keypress') {
                return getEventCharCode(event);
            }
            if (event.type === 'keydown' || event.type === 'keyup') {
                return event.keyCode;
            }
            return 0;
        }
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
    function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);

    /**
 * @interface DragEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
    var DragEventInterface = {
        dataTransfer: null
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
    function SyntheticDragEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticMouseEvent.augmentClass(SyntheticDragEvent, DragEventInterface);

    /**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */
    var TouchEventInterface = {
        touches: null,
        targetTouches: null,
        changedTouches: null,
        altKey: null,
        metaKey: null,
        ctrlKey: null,
        shiftKey: null,
        getModifierState: getEventModifierState
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
    function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);

    /**
 * @interface Event
 * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
 */
    var TransitionEventInterface = {
        propertyName: null,
        elapsedTime: null,
        pseudoElement: null
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
    function SyntheticTransitionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$1.augmentClass(SyntheticTransitionEvent, TransitionEventInterface);

    /**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
    var WheelEventInterface = {
        deltaX: function (event) {
            return 'deltaX' in event
                ? event.deltaX
                : // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
                'wheelDeltaX' in event
                    ? -event.wheelDeltaX
                    : 0;
        },
        deltaY: function (event) {
            return 'deltaY' in event
                ? event.deltaY
                : // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
                'wheelDeltaY' in event
                    ? -event.wheelDeltaY
                    : // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
                    'wheelDelta' in event
                        ? -event.wheelDelta
                        : 0;
        },
        deltaZ: null,

        // Browsers without "deltaMode" is reporting in raw wheel delta where one notch
        // on the scroll is always +/- 120, roughly equivalent to pixels. A good
        // approximation of DOM_DELTA_LINE (1) is 5% of viewport size or ~40 pixels, for
        // DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
        deltaMode: null
    };

    /**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
    function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);

    /**
 * Turns
 * ['abort', ...]
 * into
 * eventTypes = {
 *   'abort': {
 *     phasedRegistrationNames: {
 *       bubbled: 'onAbort',
 *       captured: 'onAbortCapture',
 *     },
 *     dependencies: ['topAbort'],
 *   },
 *   ...
 * };
 * topLevelEventsToDispatchConfig = {
 *   'topAbort': { sameConfig }
 * };
 */
    var eventTypes$4 = {};
    var topLevelEventsToDispatchConfig = {};
    [
        'abort',
            'animationEnd',
            'animationIteration',
            'animationStart',
            'blur',
            'cancel',
            'canPlay',
            'canPlayThrough',
            'click',
            'close',
            'contextMenu',
            'copy',
            'cut',
            'doubleClick',
            'drag',
            'dragEnd',
            'dragEnter',
            'dragExit',
            'dragLeave',
            'dragOver',
            'dragStart',
            'drop',
            'durationChange',
            'emptied',
            'encrypted',
            'ended',
            'error',
            'focus',
            'input',
            'invalid',
            'keyDown',
            'keyPress',
            'keyUp',
            'load',
            'loadedData',
            'loadedMetadata',
            'loadStart',
            'mouseDown',
            'mouseMove',
            'mouseOut',
            'mouseOver',
            'mouseUp',
            'paste',
            'pause',
            'play',
            'playing',
            'progress',
            'rateChange',
            'reset',
            'scroll',
            'seeked',
            'seeking',
            'stalled',
            'submit',
            'suspend',
            'timeUpdate',
            'toggle',
            'touchCancel',
            'touchEnd',
            'touchMove',
            'touchStart',
            'transitionEnd',
            'volumeChange',
            'waiting',
            'wheel'
        ].forEach(function (event) {
        var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
        var onEvent = 'on' + capitalizedEvent;
        var topEvent = 'top' + capitalizedEvent;

        var type = {
            phasedRegistrationNames: {
                bubbled: onEvent,
                captured: onEvent + 'Capture'
            },
            dependencies: [topEvent]
        };
        eventTypes$4[event] = type;
        topLevelEventsToDispatchConfig[topEvent] = type;
    });

    // Only used in DEV for exhaustiveness validation.
    var knownHTMLTopLevelTypes = [
        'topAbort',
        'topCancel',
        'topCanPlay',
        'topCanPlayThrough',
        'topClose',
        'topDurationChange',
        'topEmptied',
        'topEncrypted',
        'topEnded',
        'topError',
        'topInput',
        'topInvalid',
        'topLoad',
        'topLoadedData',
        'topLoadedMetadata',
        'topLoadStart',
        'topPause',
        'topPlay',
        'topPlaying',
        'topProgress',
        'topRateChange',
        'topReset',
        'topSeeked',
        'topSeeking',
        'topStalled',
        'topSubmit',
        'topSuspend',
        'topTimeUpdate',
        'topToggle',
        'topVolumeChange',
        'topWaiting'
    ];

    var SimpleEventPlugin = {
        eventTypes: eventTypes$4,

        extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
            if (!dispatchConfig) {
                return null;
            }
            var EventConstructor;
            switch (topLevelType) {
                case 'topKeyPress':
                    // Firefox creates a keypress event for function keys too. This removes the
                    // unwanted keypress events. Enter is however both printable and non-printable.
                    // One would expect Tab to be as well (but it isn't).
                    if (getEventCharCode(nativeEvent) === 0) {
                        return null;
                    }
                    /* falls through */
                case 'topKeyDown':
                case 'topKeyUp':
                    EventConstructor = SyntheticKeyboardEvent;
                    break;
                case 'topBlur':
                case 'topFocus':
                    EventConstructor = SyntheticFocusEvent;
                    break;
                case 'topClick':
                    // Firefox creates a click event on right mouse clicks. This removes the
                    // unwanted click events.
                    if (nativeEvent.button === 2) {
                        return null;
                    }
                    /* falls through */
                case 'topDoubleClick':
                case 'topMouseDown':
                case 'topMouseMove':
                case 'topMouseUp':
                    // TODO: Disabled elements should not respond to mouse events
                    /* falls through */
                case 'topMouseOut':
                case 'topMouseOver':
                case 'topContextMenu':
                    EventConstructor = SyntheticMouseEvent;
                    break;
                case 'topDrag':
                case 'topDragEnd':
                case 'topDragEnter':
                case 'topDragExit':
                case 'topDragLeave':
                case 'topDragOver':
                case 'topDragStart':
                case 'topDrop':
                    EventConstructor = SyntheticDragEvent;
                    break;
                case 'topTouchCancel':
                case 'topTouchEnd':
                case 'topTouchMove':
                case 'topTouchStart':
                    EventConstructor = SyntheticTouchEvent;
                    break;
                case 'topAnimationEnd':
                case 'topAnimationIteration':
                case 'topAnimationStart':
                    EventConstructor = SyntheticAnimationEvent;
                    break;
                case 'topTransitionEnd':
                    EventConstructor = SyntheticTransitionEvent;
                    break;
                case 'topScroll':
                    EventConstructor = SyntheticUIEvent;
                    break;
                case 'topWheel':
                    EventConstructor = SyntheticWheelEvent;
                    break;
                case 'topCopy':
                case 'topCut':
                case 'topPaste':
                    EventConstructor = SyntheticClipboardEvent;
                    break;
                default:
                    {
                        if (knownHTMLTopLevelTypes.indexOf(topLevelType) === -1) {
                            warning_1$1(false, 'SimpleEventPlugin: Unhandled event type, `%s`. This warning is likely caused by ' +
                                    'a bug in React. Please file an issue.',
                            topLevelType);
                        }
                    }
                    // HTML Events @see http://www.w3.org/TR/html5/index.html#events-0
                    EventConstructor = SyntheticEvent$1;
                    break;
            }
            var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
            accumulateTwoPhaseDispatches(event);
            return event;
        }
    };

    setHandleTopLevel(handleTopLevel);

    /**
 * Inject modules for resolving DOM hierarchy and plugin ordering.
 */
    injection$1.injectEventPluginOrder(DOMEventPluginOrder);
    injection$2.injectComponentTree(ReactDOMComponentTree);

    /**
 * Some important event plugins included by default (without having to require
 * them).
 */
    injection$1.injectEventPluginsByName({SimpleEventPlugin: SimpleEventPlugin, EnterLeaveEventPlugin: EnterLeaveEventPlugin, ChangeEventPlugin: ChangeEventPlugin, SelectEventPlugin: SelectEventPlugin, BeforeInputEventPlugin: BeforeInputEventPlugin});

    var enableAsyncSubtreeAPI = true;
    var enableAsyncSchedulingByDefaultInReactDOM = false;
    // Exports React.Fragment
    var enableReactFragment = false;
    // Exports ReactDOM.createRoot
    var enableCreateRoot = false;
    var enableUserTimingAPI = true;

    // Mutating mode (React DOM, React ART, React Native):
    var enableMutatingReconciler = true;
    // Experimental noop mode (currently unused):
    var enableNoopReconciler = false;
    // Experimental persistent mode (CS):
    var enablePersistentReconciler = false;

    // Only used in www builds.

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

    var emptyObject = {};

    {
        Object.freeze(emptyObject);
    }

    var emptyObject_1 = emptyObject;

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

    var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

    var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

    /**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

    {
        var invariant$2 = invariant_1$1;
        var warning$2 = warning_1$1;
        var ReactPropTypesSecret = ReactPropTypesSecret_1;
        var loggedTypeFailures = {};
    }

    /**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
    function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
        {
            for(var typeSpecName in typeSpecs) {
                if (typeSpecs.hasOwnProperty(typeSpecName)) {
                    var error;
                    // Prop type validation may throw. In case they do, we don't want to fail the
                    // render phase where it didn't fail before. So we log it. After these have been
                    // cleaned up, we'll let them throw.
                    try {
                        // This is intentionally an invariant that gets caught. It's the same behavior
                        // as without this statement except with a better message.
                        invariant$2(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from the `prop-types' +
                                '` package, but received `%s`.',
                        componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
                        error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
                    } catch (ex) {
                        error = ex;
                    }
                    warning$2(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker function must ret' +
                            'urn `null` or an `Error` but returned a %s. You may have forgotten to pass an ar' +
                            'gument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfT' +
                            'ype, and shape all require an argument).',
                    componentName || 'React class', location, typeSpecName, typeof error);
                    if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                        // Only monitor this failure once because there tends to be a lot of the same
                        // error.
                        loggedTypeFailures[error.message] = true;

                        var stack = getStack
                            ? getStack()
                            : '';

                        warning$2(false, 'Failed %s type: %s%s', location, error.message, stack != null
                            ? stack
                            : '');
                    }
                }
            }
        }
    }

    var checkPropTypes_1$1 = checkPropTypes;

    var valueStack = [];

    {
        var fiberStack = [];
    }

    var index = -1;

    function createCursor(defaultValue) {
        return {current: defaultValue};
    }

    function pop(cursor, fiber) {
        if (index < 0) {
            {
                warning_1$1(false, 'Unexpected pop.');
            }
            return;
        }

        {
            if(fiber !== fiberStack[index]) {
                warning_1$1(false, 'Unexpected Fiber popped.');
            }
        }

        cursor.current = valueStack[index];

        valueStack[index] = null;

        {
            fiberStack[index] = null;
        }

        index--;
    }

    function push(cursor, value, fiber) {
        index++;

        valueStack[index] = cursor.current;

        {
            fiberStack[index] = fiber;
        }

        cursor.current = value;
    }

    function reset$1() {
        while (index > -1) {
            valueStack[index] = null;

            {
                fiberStack[index] = null;
            }

            index--;
        }
    }

    var describeComponentFrame = function (name, source, ownerName) {
        return '\n    in ' + (name || 'Unknown') + (source
            ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')'
            : ownerName
                ? ' (created by ' + ownerName + ')'
                : '');
    };

    function describeFiber(fiber) {
        switch (fiber.tag) {
            case IndeterminateComponent:
            case FunctionalComponent:
            case ClassComponent:
            case HostComponent:
                var owner = fiber._debugOwner;
                var source = fiber._debugSource;
                var name = getComponentName(fiber);
                var ownerName = null;
                if (owner) {
                    ownerName = getComponentName(owner);
                }
                return describeComponentFrame(name, source, ownerName);
            default:
                return '';
        }
    }

    // This function can only be called with a work-in-progress fiber and only
    // during begin or complete phase. Do not call it under any other circumstances.
    function getStackAddendumByWorkInProgressFiber(workInProgress) {
        var info = '';
        var node = workInProgress;
        do {
            info += describeFiber(node);
            // Otherwise this return pointer might point to the wrong tree:
            node = node['return'];
        } while (node);
        return info;
    }

    function getCurrentFiberOwnerName() {
        {
            var fiber = ReactDebugCurrentFiber.current;
            if (fiber === null) {
                return null;
            }
            var owner = fiber._debugOwner;
            if (owner !== null && typeof owner !== 'undefined') {
                return getComponentName(owner);
            }
        }
        return null;
    }

    function getCurrentFiberStackAddendum() {
        {
            var fiber = ReactDebugCurrentFiber.current;
            if (fiber === null) {
                return null;
            }
            // Safe because if current fiber exists, we are reconciling, and it is
            // guaranteed to be the work-in-progress version.
            return getStackAddendumByWorkInProgressFiber(fiber);
        }
        return null;
    }

    function resetCurrentFiber() {
        ReactDebugCurrentFrame.getCurrentStack = null;
        ReactDebugCurrentFiber.current = null;
        ReactDebugCurrentFiber.phase = null;
    }

    function setCurrentFiber(fiber) {
        ReactDebugCurrentFrame.getCurrentStack = getCurrentFiberStackAddendum;
        ReactDebugCurrentFiber.current = fiber;
        ReactDebugCurrentFiber.phase = null;
    }

    function setCurrentPhase(phase) {
        ReactDebugCurrentFiber.phase = phase;
    }

    var ReactDebugCurrentFiber = {
        current: null,
        phase: null,
        resetCurrentFiber: resetCurrentFiber,
        setCurrentFiber: setCurrentFiber,
        setCurrentPhase: setCurrentPhase,
        getCurrentFiberOwnerName: getCurrentFiberOwnerName,
        getCurrentFiberStackAddendum: getCurrentFiberStackAddendum
    };

    // Prefix measurements so that it's possible to filter them. Longer prefixes are
    // hard to read in DevTools.
    var reactEmoji = '\u269B';
    var warningEmoji = '\u26D4';
    var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

    // Keep track of current fiber so that we know the path to unwind on pause.
    // TODO: this looks the same as nextUnitOfWork in scheduler. Can we unify them?
    var currentFiber = null;
    // If we're in the middle of user code, which fiber and method is it? Reusing
    // `currentFiber` would be confusing for this because user code fiber can change
    // during commit phase too, but we don't need to unwind it (since lifecycles in
    // the commit phase don't resemble a tree).
    var currentPhase = null;
    var currentPhaseFiber = null;
    // Did lifecycle hook schedule an update? This is often a performance problem,
    // so we will keep track of it, and include it in the report. Track commits
    // caused by cascading updates.
    var isCommitting = false;
    var hasScheduledUpdateInCurrentCommit = false;
    var hasScheduledUpdateInCurrentPhase = false;
    var commitCountInCurrentWorkLoop = 0;
    var effectCountInCurrentCommit = 0;
    var isWaitingForCallback = false;
    // During commits, we only show a measurement once per method name to avoid
    // stretch the commit phase with measurement overhead.
    var labelsInCurrentCommit = new Set();

    var formatMarkName = function (markName) {
        return reactEmoji + ' ' + markName;
    };

    var formatLabel = function (label, warning) {
        var prefix = warning
            ? warningEmoji + ' '
            : reactEmoji + ' ';
        var suffix = warning
            ? ' Warning: ' + warning
            : '';
        return '' + prefix + label + suffix;
    };

    var beginMark = function (markName) {
        performance.mark(formatMarkName(markName));
    };

    var clearMark = function (markName) {
        performance.clearMarks(formatMarkName(markName));
    };

    var endMark = function (label, markName, warning) {
        var formattedMarkName = formatMarkName(markName);
        var formattedLabel = formatLabel(label, warning);
        try {
            performance.measure(formattedLabel, formattedMarkName);
        } catch (err) {}
        // If previous mark was missing for some reason, this will throw. This could
        // only happen if React crashed in an unexpected place earlier. Don't pile on
        // with more errors. Clear marks immediately to avoid growing buffer.
        performance.clearMarks(formattedMarkName);
        performance.clearMeasures(formattedLabel);
    };

    var getFiberMarkName = function (label, debugID) {
        return label + ' (#' + debugID + ')';
    };

    var getFiberLabel = function (componentName, isMounted, phase) {
        if (phase === null) {
            // These are composite component total time measurements.
            return componentName + ' [' + (isMounted
                ? 'update'
                : 'mount') + ']';
        } else {
            // Composite component methods.
            return componentName + '.' + phase;
        }
    };

    var beginFiberMark = function (fiber, phase) {
        var componentName = getComponentName(fiber) || 'Unknown';
        var debugID = fiber._debugID;
        var isMounted = fiber.alternate !== null;
        var label = getFiberLabel(componentName, isMounted, phase);

        if (isCommitting && labelsInCurrentCommit.has(label)) {
            // During the commit phase, we don't show duplicate labels because there is a
            // fixed overhead for every measurement, and we don't want to stretch the commit
            // phase beyond necessary.
            return false;
        }
        labelsInCurrentCommit.add(label);

        var markName = getFiberMarkName(label, debugID);
        beginMark(markName);
        return true;
    };

    var clearFiberMark = function (fiber, phase) {
        var componentName = getComponentName(fiber) || 'Unknown';
        var debugID = fiber._debugID;
        var isMounted = fiber.alternate !== null;
        var label = getFiberLabel(componentName, isMounted, phase);
        var markName = getFiberMarkName(label, debugID);
        clearMark(markName);
    };

    var endFiberMark = function (fiber, phase, warning) {
        var componentName = getComponentName(fiber) || 'Unknown';
        var debugID = fiber._debugID;
        var isMounted = fiber.alternate !== null;
        var label = getFiberLabel(componentName, isMounted, phase);
        var markName = getFiberMarkName(label, debugID);
        endMark(label, markName, warning);
    };

    var shouldIgnoreFiber = function (fiber) {
        // Host components should be skipped in the timeline. We could check typeof
        // fiber.type, but does this work with RN?
        switch (fiber.tag) {
            case HostRoot:
            case HostComponent:
            case HostText:
            case HostPortal:
            case ReturnComponent:
            case Fragment:
                return true;
            default:
                return false;
        }
    };

    var clearPendingPhaseMeasurement = function () {
        if (currentPhase !== null && currentPhaseFiber !== null) {
            clearFiberMark(currentPhaseFiber, currentPhase);
        }
        currentPhaseFiber = null;
        currentPhase = null;
        hasScheduledUpdateInCurrentPhase = false;
    };

    var pauseTimers = function () {
        // Stops all currently active measurements so that they can be resumed if we
        // continue in a later deferred loop from the same unit of work.
        var fiber = currentFiber;
        while (fiber) {
            if (fiber._debugIsCurrentlyTiming) {
                endFiberMark(fiber, null, null);
            }
            fiber = fiber['return'];
        }
    };

    var resumeTimersRecursively = function (fiber) {
        if (fiber['return'] !== null) {
            resumeTimersRecursively(fiber['return']);
        }
        if (fiber._debugIsCurrentlyTiming) {
            beginFiberMark(fiber, null);
        }
    };

    var resumeTimers = function () {
        // Resumes all measurements that were active during the last deferred loop.
        if (currentFiber !== null) {
            resumeTimersRecursively(currentFiber);
        }
    };

    function recordEffect() {
        if (enableUserTimingAPI) {
            effectCountInCurrentCommit++;
        }
    }

    function recordScheduleUpdate() {
        if (enableUserTimingAPI) {
            if (isCommitting) {
                hasScheduledUpdateInCurrentCommit = true;
            }
            if (currentPhase !== null && currentPhase !== 'componentWillMount' && currentPhase !== 'componentWillReceiveProps') {
                hasScheduledUpdateInCurrentPhase = true;
            }
        }
    }

    function startRequestCallbackTimer() {
        if (enableUserTimingAPI) {
            if (supportsUserTiming && !isWaitingForCallback) {
                isWaitingForCallback = true;
                beginMark('(Waiting for async callback...)');
            }
        }
    }

    function stopRequestCallbackTimer(didExpire) {
        if (enableUserTimingAPI) {
            if (supportsUserTiming) {
                isWaitingForCallback = false;
                var warning = didExpire
                    ? 'React was blocked by main thread'
                    : null;
                endMark('(Waiting for async callback...)', '(Waiting for async callback...)', warning);
            }
        }
    }

    function startWorkTimer(fiber) {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
                return;
            }
            // If we pause, this is the fiber to unwind from.
            currentFiber = fiber;
            if (!beginFiberMark(fiber, null)) {
                return;
            }
            fiber._debugIsCurrentlyTiming = true;
        }
    }

    function cancelWorkTimer(fiber) {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
                return;
            }
            // Remember we shouldn't complete measurement for this fiber. Otherwise
            // flamechart will be deep even for small updates.
            fiber._debugIsCurrentlyTiming = false;
            clearFiberMark(fiber, null);
        }
    }

    function stopWorkTimer(fiber) {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
                return;
            }
            // If we pause, its parent is the fiber to unwind from.
            currentFiber = fiber['return'];
            if (!fiber._debugIsCurrentlyTiming) {
                return;
            }
            fiber._debugIsCurrentlyTiming = false;
            endFiberMark(fiber, null, null);
        }
    }

    function stopFailedWorkTimer(fiber) {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
                return;
            }
            // If we pause, its parent is the fiber to unwind from.
            currentFiber = fiber['return'];
            if (!fiber._debugIsCurrentlyTiming) {
                return;
            }
            fiber._debugIsCurrentlyTiming = false;
            var warning = 'An error was thrown inside this error boundary';
            endFiberMark(fiber, null, warning);
        }
    }

    function startPhaseTimer(fiber, phase) {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming) {
                return;
            }
            clearPendingPhaseMeasurement();
            if (!beginFiberMark(fiber, phase)) {
                return;
            }
            currentPhaseFiber = fiber;
            currentPhase = phase;
        }
    }

    function stopPhaseTimer() {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming) {
                return;
            }
            if (currentPhase !== null && currentPhaseFiber !== null) {
                var warning = hasScheduledUpdateInCurrentPhase
                    ? 'Scheduled a cascading update'
                    : null;
                endFiberMark(currentPhaseFiber, currentPhase, warning);
            }
            currentPhase = null;
            currentPhaseFiber = null;
        }
    }

    function startWorkLoopTimer(nextUnitOfWork) {
        if (enableUserTimingAPI) {
            currentFiber = nextUnitOfWork;
            if (!supportsUserTiming) {
                return;
            }
            commitCountInCurrentWorkLoop = 0;
            // This is top level call. Any other measurements are performed within.
            beginMark('(React Tree Reconciliation)');
            // Resume any measurements that were in progress during the last loop.
            resumeTimers();
        }
    }

    function stopWorkLoopTimer(interruptedBy) {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming) {
                return;
            }
            var warning = null;
            if (interruptedBy !== null) {
                if (interruptedBy.tag === HostRoot) {
                    warning = 'A top-level update interrupted the previous render';
                } else {
                    var componentName = getComponentName(interruptedBy) || 'Unknown';
                    warning = 'An update to ' + componentName + ' interrupted the previous render';
                }
            } else if (commitCountInCurrentWorkLoop > 1) {
                warning = 'There were cascading updates';
            }
            commitCountInCurrentWorkLoop = 0;
            // Pause any measurements until the next loop.
            pauseTimers();
            endMark('(React Tree Reconciliation)', '(React Tree Reconciliation)', warning);
        }
    }

    function startCommitTimer() {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming) {
                return;
            }
            isCommitting = true;
            hasScheduledUpdateInCurrentCommit = false;
            labelsInCurrentCommit.clear();
            beginMark('(Committing Changes)');
        }
    }

    function stopCommitTimer() {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming) {
                return;
            }

            var warning = null;
            if (hasScheduledUpdateInCurrentCommit) {
                warning = 'Lifecycle hook scheduled a cascading update';
            } else if (commitCountInCurrentWorkLoop > 0) {
                warning = 'Caused by a cascading update in earlier commit';
            }
            hasScheduledUpdateInCurrentCommit = false;
            commitCountInCurrentWorkLoop++;
            isCommitting = false;
            labelsInCurrentCommit.clear();

            endMark('(Committing Changes)', '(Committing Changes)', warning);
        }
    }

    function startCommitHostEffectsTimer() {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming) {
                return;
            }
            effectCountInCurrentCommit = 0;
            beginMark('(Committing Host Effects)');
        }
    }

    function stopCommitHostEffectsTimer() {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming) {
                return;
            }
            var count = effectCountInCurrentCommit;
            effectCountInCurrentCommit = 0;
            endMark('(Committing Host Effects: ' + count + ' Total)', '(Committing Host Effects)', null);
        }
    }

    function startCommitLifeCyclesTimer() {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming) {
                return;
            }
            effectCountInCurrentCommit = 0;
            beginMark('(Calling Lifecycle Methods)');
        }
    }

    function stopCommitLifeCyclesTimer() {
        if (enableUserTimingAPI) {
            if (!supportsUserTiming) {
                return;
            }
            var count = effectCountInCurrentCommit;
            effectCountInCurrentCommit = 0;
            endMark('(Calling Lifecycle Methods: ' + count + ' Total)', '(Calling Lifecycle Methods)', null);
        }
    }

    {
        var warnedAboutMissingGetChildContext = {};
    }

    // A cursor to the current merged context object on the stack.
    var contextStackCursor = createCursor(emptyObject_1);
    // A cursor to a boolean indicating whether the context has changed.
    var didPerformWorkStackCursor = createCursor(false);
    // Keep track of the previous context object that was on the stack. We use this
    // to get access to the parent context after we have already pushed the next
    // context provider, and now need to merge their contexts.
    var previousContext = emptyObject_1;

    function getUnmaskedContext(workInProgress) {
        var hasOwnContext = isContextProvider(workInProgress);
        if (hasOwnContext) {
            // If the fiber is a context provider itself, when we read its context we have
            // already pushed its own child context on the stack. A context provider should
            // not "see" its own child context. Therefore we read the previous (parent)
            // context instead for a context provider.
            return previousContext;
        }
        return contextStackCursor.current;
    }

    function cacheContext(workInProgress, unmaskedContext, maskedContext) {
        var instance = workInProgress.stateNode;
        instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
        instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
    }

    function getMaskedContext(workInProgress, unmaskedContext) {
        var type = workInProgress.type;
        var contextTypes = type.contextTypes;
        if (!contextTypes) {
            return emptyObject_1;
        }

        // Avoid recreating masked context unless unmasked context has changed. Failing
        // to do this will result in unnecessary calls to componentWillReceiveProps.
        // This may trigger infinite loops if componentWillReceiveProps calls setState.
        var instance = workInProgress.stateNode;
        if (instance && instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext) {
            return instance.__reactInternalMemoizedMaskedChildContext;
        }

        var context = {};
        for (var key in contextTypes) {
            context[key] = unmaskedContext[key];
        }

        {
            var name = getComponentName(workInProgress) || 'Unknown';
            checkPropTypes_1$1(contextTypes, context, 'context', name, ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
        }

        // Cache unmasked context so we can avoid recreating masked context unless
        // necessary. Context is created before the class component is instantiated so
        // check for instance.
        if (instance) {
            cacheContext(workInProgress, unmaskedContext, context);
        }

        return context;
    }

    function hasContextChanged() {
        return didPerformWorkStackCursor.current;
    }

    function isContextConsumer(fiber) {
        return fiber.tag === ClassComponent && fiber.type.contextTypes != null;
    }

    function isContextProvider(fiber) {
        return fiber.tag === ClassComponent && fiber.type.childContextTypes != null;
    }

    function popContextProvider(fiber) {
        if (!isContextProvider(fiber)) {
            return;
        }

        pop(didPerformWorkStackCursor, fiber);
        pop(contextStackCursor, fiber);
    }

    function popTopLevelContextObject(fiber) {
        pop(didPerformWorkStackCursor, fiber);
        pop(contextStackCursor, fiber);
    }

    function pushTopLevelContextObject(fiber, context, didChange) {
        !(contextStackCursor.cursor == null)
            ? invariant_1$1(false, 'Unexpected context found on stack. This error is likely caused by a bug in React' +
                    '. Please file an issue.')
            : void 0;

        push(contextStackCursor, context, fiber);
        push(didPerformWorkStackCursor, didChange, fiber);
    }

    function processChildContext(fiber, parentContext) {
        var instance = fiber.stateNode;
        var childContextTypes = fiber.type.childContextTypes;

        // TODO (bvaughn) Replace this behavior with an invariant() in the future. It
        // has only been added in Fiber to match the (unintentional) behavior in Stack.
        if (typeof instance.getChildContext !== 'function') {
            {
                var componentName = getComponentName(fiber) || 'Unknown';

                if (!warnedAboutMissingGetChildContext[componentName]) {
                    warnedAboutMissingGetChildContext[componentName] = true;
                    warning_1$1(false, '%s.childContextTypes is specified but there is no getChildContext() method on th' +
                            'e instance. You can either define getChildContext() on %s or remove childContext' +
                            'Types from it.',
                    componentName, componentName);
                }
            }
            return parentContext;
        }

        var childContext = void 0;
        {
            ReactDebugCurrentFiber.setCurrentPhase('getChildContext');
        }
        startPhaseTimer(fiber, 'getChildContext');
        childContext = instance.getChildContext();
        stopPhaseTimer();
        {
            ReactDebugCurrentFiber.setCurrentPhase(null);
        }
        for (var contextKey in childContext) {
            !(contextKey in childContextTypes)
                ? invariant_1$1(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', getComponentName(fiber) || 'Unknown', contextKey)
                : void 0;
        }
        {
            var name = getComponentName(fiber) || 'Unknown';
            checkPropTypes_1$1(childContextTypes, childContext, 'child context', name,
            // In practice, there is one case in which we won't get a stack. It's when
            // somebody calls unstable_renderSubtreeIntoContainer() and we process context
            // from the parent component instance. The stack will be missing because it's
            // outside of the reconciliation, and so the pointer has not been set. This is
            // rare and doesn't matter. We'll also remove that API.
            ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
        }

        return _assign({}, parentContext, childContext);
    }

    function pushContextProvider(workInProgress) {
        if (!isContextProvider(workInProgress)) {
            return false;
        }

        var instance = workInProgress.stateNode;
        // We push the context as early as possible to ensure stack integrity. If the
        // instance does not exist yet, we will push null at first, and replace it on
        // the stack later when invalidating the context.
        var memoizedMergedChildContext = instance && instance.__reactInternalMemoizedMergedChildContext || emptyObject_1;

        // Remember the parent context so we can merge with it later. Inherit the
        // parent's did-perform-work value to avoid inadvertently blocking updates.
        previousContext = contextStackCursor.current;
        push(contextStackCursor, memoizedMergedChildContext, workInProgress);
        push(didPerformWorkStackCursor, didPerformWorkStackCursor.current, workInProgress);

        return true;
    }

    function invalidateContextProvider(workInProgress, didChange) {
        var instance = workInProgress.stateNode;
        !instance
            ? invariant_1$1(false, 'Expected to have an instance by this point. This error is likely caused by a bug' +
                    ' in React. Please file an issue.')
            : void 0;

        if (didChange) {
            // Merge parent and own context. Skip this if we're not updating due to sCU.
            // This avoids unnecessarily recomputing memoized values.
            var mergedContext = processChildContext(workInProgress, previousContext);
            instance.__reactInternalMemoizedMergedChildContext = mergedContext;

            // Replace the old (or empty) context with the new one. It is important to
            // unwind the context in the reverse order.
            pop(didPerformWorkStackCursor, workInProgress);
            pop(contextStackCursor, workInProgress);
            // Now push the new context and mark that it has changed.
            push(contextStackCursor, mergedContext, workInProgress);
            push(didPerformWorkStackCursor, didChange, workInProgress);
        } else {
            pop(didPerformWorkStackCursor, workInProgress);
            push(didPerformWorkStackCursor, didChange, workInProgress);
        }
    }

    function resetContext() {
        previousContext = emptyObject_1;
        contextStackCursor.current = emptyObject_1;
        didPerformWorkStackCursor.current = false;
    }

    function findCurrentUnmaskedContext(fiber) {
        // Currently this is only used with renderSubtreeIntoContainer; not sure if it
        // makes sense elsewhere
        !(isFiberMounted(fiber) && fiber.tag === ClassComponent)
            ? invariant_1$1(false, 'Expected subtree parent to be a mounted class component. This error is likely ca' +
                    'used by a bug in React. Please file an issue.')
            : void 0;

        var node = fiber;
        while (node.tag !== HostRoot) {
            if (isContextProvider(node)) {
                return node.stateNode.__reactInternalMemoizedMergedChildContext;
            }
            var parent = node['return'];
            !parent
                ? invariant_1$1(false, 'Found unexpected detached subtree parent. This error is likely caused by a bug i' +
                        'n React. Please file an issue.')
                : void 0;
            node = parent;
        }
        return node.stateNode.context;
    }

    var NoWork = 0; // TODO: Use an opaque type once ESLint et al support the syntax

    var Sync = 1;
    var Never = 2147483647; // Max int32: Math.pow(2, 31) - 1

    var UNIT_SIZE = 10;
    var MAGIC_NUMBER_OFFSET = 2;

    // 1 unit of expiration time represents 10ms.
    function msToExpirationTime(ms) {
        // Always add an offset so that we don't clash with the magic number for NoWork.
        return (ms / UNIT_SIZE | 0) + MAGIC_NUMBER_OFFSET;
    }

    function ceiling(num, precision) {
        return ((num / precision | 0) + 1) * precision;
    }

    function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
        return ceiling(currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE);
    }

    var NoContext = 0;
    var AsyncUpdates = 1;

    {
        var hasBadMapPolyfill = false;
        try {
            var nonExtensibleObject = Object.preventExtensions({});
            /* eslint-disable no-new */
            new Map([
                [nonExtensibleObject, null]
            ]);
            new Set([nonExtensibleObject]);
            /* eslint-enable no-new */
        } catch (e) {
            // TODO: Consider warning about bad polyfills
            hasBadMapPolyfill = true;
        }
    }

    // A Fiber is work on a Component that needs to be done or was done. There can
    // be more than one per component.

    {
        var debugCounter = 1;
    }

    function FiberNode(tag, key, internalContextTag) {
        // Instance
        this.tag = tag;
        this.key = key;
        this.type = null;
        this.stateNode = null;

        // Fiber
        this['return'] = null;
        this.child = null;
        this.sibling = null;
        this.index = 0;

        this.ref = null;

        this.pendingProps = null;
        this.memoizedProps = null;
        this.updateQueue = null;
        this.memoizedState = null;

        this.internalContextTag = internalContextTag;

        // Effects
        this.effectTag = NoEffect;
        this.nextEffect = null;

        this.firstEffect = null;
        this.lastEffect = null;

        this.expirationTime = NoWork;

        this.alternate = null;

        {
            this._debugID = debugCounter++;
            this._debugSource = null;
            this._debugOwner = null;
            this._debugIsCurrentlyTiming = false;
            if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
                Object.preventExtensions(this);
            }
        }
    }

    // This is a constructor function, rather than a POJO constructor, still please
    // ensure we do the following: 1) Nobody should add any instance methods on
    // this. Instance methods can be    more difficult to predict when they get
    // optimized and they are almost    never inlined properly in static compilers.
    // 2) Nobody should rely on `instanceof Fiber` for type testing. We should
    // always know when it is a fiber. 3) We might want to experiment with using
    // numeric keys since they are easier    to optimize in a non-JIT environment.
    // 4) We can easily go from a constructor to a createFiber object literal if
    // that    is faster. 5) It should be easy to port this to a C struct and keep a
    // C implementation    compatible.
    var createFiber = function (tag, key, internalContextTag) {
        // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
        return new FiberNode(tag, key, internalContextTag);
    };

    function shouldConstruct(Component) {
        return !!(Component.prototype && Component.prototype.isReactComponent);
    }

    // This is used to create an alternate fiber to do work on.
    function createWorkInProgress(current, pendingProps, expirationTime) {
        var workInProgress = current.alternate;
        if (workInProgress === null) {
            // We use a double buffering pooling technique because we know that we'll only
            // ever need at most two versions of a tree. We pool the "other" unused node
            // that we're free to reuse. This is lazily created to avoid allocating extra
            // objects for things that are never updated. It also allow us to reclaim the
            // extra memory if needed.
            workInProgress = createFiber(current.tag, current.key, current.internalContextTag);
            workInProgress.type = current.type;
            workInProgress.stateNode = current.stateNode;

            {
                // DEV-only fields
                workInProgress._debugID = current._debugID;
                workInProgress._debugSource = current._debugSource;
                workInProgress._debugOwner = current._debugOwner;
            }

            workInProgress.alternate = current;
            current.alternate = workInProgress;
        } else {
            // We already have an alternate. Reset the effect tag.
            workInProgress.effectTag = NoEffect;

            // The effect list is no longer valid.
            workInProgress.nextEffect = null;
            workInProgress.firstEffect = null;
            workInProgress.lastEffect = null;
        }

        workInProgress.expirationTime = expirationTime;
        workInProgress.pendingProps = pendingProps;

        workInProgress.child = current.child;
        workInProgress.memoizedProps = current.memoizedProps;
        workInProgress.memoizedState = current.memoizedState;
        workInProgress.updateQueue = current.updateQueue;

        // These will be overridden during the parent's reconciliation
        workInProgress.sibling = current.sibling;
        workInProgress.index = current.index;
        workInProgress.ref = current.ref;

        return workInProgress;
    }

    function createHostRootFiber() {
        var fiber = createFiber(HostRoot, null, NoContext);
        return fiber;
    }

    function createFiberFromElement(element, internalContextTag, expirationTime) {
        var owner = null;
        {
            owner = element._owner;
        }

        var fiber = void 0;
        var type = element.type,
            key = element.key;

        if (typeof type === 'function') {
            fiber = shouldConstruct(type)
                ? createFiber(ClassComponent, key, internalContextTag)
                : createFiber(IndeterminateComponent, key, internalContextTag);
            fiber.type = type;
            fiber.pendingProps = element.props;
        } else if (typeof type === 'string') {
            fiber = createFiber(HostComponent, key, internalContextTag);
            fiber.type = type;
            fiber.pendingProps = element.props;
        } else if (typeof type === 'object' && type !== null && typeof type.tag === 'number') {
            // Currently assumed to be a continuation and therefore is a fiber already.
            // TODO: The yield system is currently broken for updates in some cases. The
            // reified yield stores a fiber, but we don't know which fiber that is; the
            // current or a workInProgress? When the continuation gets rendered here we
            // don't know if we can reuse that fiber or if we need to clone it. There is
            // probably a clever way to restructure this.
            fiber = type;
            fiber.pendingProps = element.props;
        } else {
            var info = '';
            {
                if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
                    info += ' You likely forgot to export your component from the file it's defined in, or yo' +
                            'u might have mixed up default and named imports.';
                }
                var ownerName = owner
                    ? getComponentName(owner)
                    : null;
                if (ownerName) {
                    info += '\n\nCheck the render method of `' + ownerName + '`.';
                }
            }
            invariant_1$1(false, 'Element type is invalid: expected a string (for built-in components) or a class/' +
                    'function (for composite components) but got: %s.%s',
            type == null
                ? type
                : typeof type, info);
        }

        {
            fiber._debugSource = element._source;
            fiber._debugOwner = element._owner;
        }

        fiber.expirationTime = expirationTime;

        return fiber;
    }

    function createFiberFromFragment(elements, internalContextTag, expirationTime, key) {
        var fiber = createFiber(Fragment, key, internalContextTag);
        fiber.pendingProps = elements;
        fiber.expirationTime = expirationTime;
        return fiber;
    }

    function createFiberFromText(content, internalContextTag, expirationTime) {
        var fiber = createFiber(HostText, null, internalContextTag);
        fiber.pendingProps = content;
        fiber.expirationTime = expirationTime;
        return fiber;
    }

    function createFiberFromHostInstanceForDeletion() {
        var fiber = createFiber(HostComponent, null, NoContext);
        fiber.type = 'DELETED';
        return fiber;
    }

    function createFiberFromCall(call, internalContextTag, expirationTime) {
        var fiber = createFiber(CallComponent, call.key, internalContextTag);
        fiber.type = call.handler;
        fiber.pendingProps = call;
        fiber.expirationTime = expirationTime;
        return fiber;
    }

    function createFiberFromReturn(returnNode, internalContextTag, expirationTime) {
        var fiber = createFiber(ReturnComponent, null, internalContextTag);
        fiber.expirationTime = expirationTime;
        return fiber;
    }

    function createFiberFromPortal(portal, internalContextTag, expirationTime) {
        var fiber = createFiber(HostPortal, portal.key, internalContextTag);
        fiber.pendingProps = portal.children || [];
        fiber.expirationTime = expirationTime;
        fiber.stateNode = {
            containerInfo: portal.containerInfo,
            pendingChildren: null, // Used by persistent updates
            implementation: portal.implementation
        };
        return fiber;
    }

    function createFiberRoot(containerInfo, hydrate) {
        // Cyclic construction. This cheats the type system right now because stateNode
        // is any.
        var uninitializedFiber = createHostRootFiber();
        var root = {
            current: uninitializedFiber,
            containerInfo: containerInfo,
            pendingChildren: null,
            remainingExpirationTime: NoWork,
            isReadyForCommit: false,
            finishedWork: null,
            context: null,
            pendingContext: null,
            hydrate: hydrate,
            nextScheduledRoot: null
        };
        uninitializedFiber.stateNode = root;
        return root;
    }

    var onCommitFiberRoot = null;
    var onCommitFiberUnmount = null;
    var hasLoggedError = false;

    function catchErrors(fn) {
        return function (arg) {
            try {
                return fn(arg);
            } catch (err) {
                if (true && !hasLoggedError) {
                    hasLoggedError = true;
                    warning_1$1(false, 'React DevTools encountered an error: %s', err);
                }
            }
        };
    }

    function injectInternals(internals) {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
            // No DevTools
            return false;
        }
        var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook.isDisabled) {
            // This isn't a real property on the hook, but it can be set to opt out of
            // DevTools integration and associated warnings and logs.
            // https://github.com/facebook/react/issues/3877
            return true;
        }
        if (!hook.supportsFiber) {
            {
                warning_1$1(false, 'The installed version of React DevTools is too old and will not work with the cu' +
                        'rrent version of React. Please update React DevTools. https://fb.me/react-devtoo' +
                        'ls');
            }
            // DevTools exists, even though it doesn't support Fiber.
            return true;
        }
        try {
            var rendererID = hook.inject(internals);
            // We have successfully injected, so now it is safe to set up hooks.
            onCommitFiberRoot = catchErrors(function (root) {
                return hook.onCommitFiberRoot(rendererID, root);
            });
            onCommitFiberUnmount = catchErrors(function (fiber) {
                return hook.onCommitFiberUnmount(rendererID, fiber);
            });
        } catch (err) {
            // Catch all errors because it is unsafe to throw during initialization.
            {
                warning_1$1(false, 'React DevTools encountered an error: %s.', err);
            }
        }
        // DevTools exists
        return true;
    }

    function onCommitRoot(root) {
        if (typeof onCommitFiberRoot === 'function') {
            onCommitFiberRoot(root);
        }
    }

    function onCommitUnmount(fiber) {
        if (typeof onCommitFiberUnmount === 'function') {
            onCommitFiberUnmount(fiber);
        }
    }

    {
        var didWarnUpdateInsideUpdate = false;
    }

    // Callbacks are not validated until invocation Singly linked-list of updates.
    // When an update is scheduled, it is added to the queue of the current fiber
    // and the work-in-progress fiber. The two queues are separate but they share a
    // persistent structure.
    //
    // During reconciliation, updates are removed from the work-in-progress fiber,
    // but they remain on the current fiber. That ensures that if a work-in-progress
    // is aborted, the aborted updates are recovered by cloning from current.
    //
    // The work-in-progress queue is always a subset of the current queue.
    //
    // When the tree is committed, the work-in-progress becomes the current.

    function createUpdateQueue(baseState) {
        var queue = {
            baseState: baseState,
            expirationTime: NoWork,
            first: null,
            last: null,
            callbackList: null,
            hasForceUpdate: false,
            isInitialized: false
        };
        {
            queue.isProcessing = false;
        }
        return queue;
    }

    function insertUpdateIntoQueue(queue, update) {
        // Append the update to the end of the list.
        if (queue.last === null) {
            // Queue is empty
            queue.first = queue.last = update;
        } else {
            queue.last.next = update;
            queue.last = update;
        }
        if (queue.expirationTime === NoWork || queue.expirationTime > update.expirationTime) {
            queue.expirationTime = update.expirationTime;
        }
    }

    function insertUpdateIntoFiber(fiber, update) {
        // We'll have at least one and at most two distinct update queues.
        var alternateFiber = fiber.alternate;
        var queue1 = fiber.updateQueue;
        if (queue1 === null) {
            // TODO: We don't know what the base state will be until we begin work. It
            // depends on which fiber is the next current. Initialize with an empty base
            // state, then set to the memoizedState when rendering. Not super happy with
            // this approach.
            queue1 = fiber.updateQueue = createUpdateQueue(null);
        }

        var queue2 = void 0;
        if (alternateFiber !== null) {
            queue2 = alternateFiber.updateQueue;
            if (queue2 === null) {
                queue2 = alternateFiber.updateQueue = createUpdateQueue(null);
            }
        } else {
            queue2 = null;
        }
        queue2 = queue2 !== queue1
            ? queue2
            : null;

        // Warn if an update is scheduled from inside an updater function.
        {
            if ((queue1.isProcessing || queue2 !== null && queue2.isProcessing) && !didWarnUpdateInsideUpdate) {
                warning_1$1(false, 'An update (setState, replaceState, or forceUpdate) was scheduled from inside an ' +
                        'update function. Update functions should be pure, with zero side-effects. Consid' +
                        'er using componentDidUpdate or a callback.');
                didWarnUpdateInsideUpdate = true;
            }
        }

        // If there's only one queue, add the update to that queue and exit.
        if (queue2 === null) {
            insertUpdateIntoQueue(queue1, update);
            return;
        }

        // If either queue is empty, we need to add to both queues.
        if (queue1.last === null || queue2.last === null) {
            insertUpdateIntoQueue(queue1, update);
            insertUpdateIntoQueue(queue2, update);
            return;
        }

        // If both lists are not empty, the last update is the same for both lists
        // because of structural sharing. So, we should only append to one of the lists.
        insertUpdateIntoQueue(queue1, update);
        // But we still need to update the `last` pointer of queue2.
        queue2.last = update;
    }

    function getUpdateExpirationTime(fiber) {
        if (fiber.tag !== ClassComponent && fiber.tag !== HostRoot) {
            return NoWork;
        }
        var updateQueue = fiber.updateQueue;
        if (updateQueue === null) {
            return NoWork;
        }
        return updateQueue.expirationTime;
    }

    function getStateFromUpdate(update, instance, prevState, props) {
        var partialState = update.partialState;
        if (typeof partialState === 'function') {
            var updateFn = partialState;
            return updateFn.call(instance, prevState, props);
        } else {
            return partialState;
        }
    }

    function processUpdateQueue(current, workInProgress, queue, instance, props, renderExpirationTime) {
        if (current !== null && current.updateQueue === queue) {
            // We need to create a work-in-progress queue, by cloning the current queue.
            var currentQueue = queue;
            queue = workInProgress.updateQueue = {
                baseState: currentQueue.baseState,
                expirationTime: currentQueue.expirationTime,
                first: currentQueue.first,
                last: currentQueue.last,
                isInitialized: currentQueue.isInitialized,
                // These fields are no longer valid because they were already committed. Reset
                // them.
                callbackList: null,
                hasForceUpdate: false
            };
        }

        {
            // Set this flag so we can warn if setState is called inside the update function
            // of another setState.
            queue.isProcessing = true;
        }

        // Reset the remaining expiration time. If we skip over any updates, we'll
        // increase this accordingly.
        queue.expirationTime = NoWork;

        // TODO: We don't know what the base state will be until we begin work. It
        // depends on which fiber is the next current. Initialize with an empty base
        // state, then set to the memoizedState when rendering. Not super happy with
        // this approach.
        var state = void 0;
        if (queue.isInitialized) {
            state = queue.baseState;
        } else {
            state = queue.baseState = workInProgress.memoizedState;
            queue.isInitialized = true;
        }
        var dontMutatePrevState = true;
        var update = queue.first;
        var didSkip = false;
        while (update !== null) {
            var updateExpirationTime = update.expirationTime;
            if (updateExpirationTime > renderExpirationTime) {
                // This update does not have sufficient priority. Skip it.
                var remainingExpirationTime = queue.expirationTime;
                if (remainingExpirationTime === NoWork || remainingExpirationTime > updateExpirationTime) {
                    // Update the remaining expiration time.
                    queue.expirationTime = updateExpirationTime;
                }
                if (!didSkip) {
                    didSkip = true;
                    queue.baseState = state;
                }
                // Continue to the next update.
                update = update.next;
                continue;
            }

            // This update does have sufficient priority. If no previous updates were
            // skipped, drop this update from the queue by advancing the head of the list.
            if (!didSkip) {
                queue.first = update.next;
                if (queue.first === null) {
                    queue.last = null;
                }
            }

            // Process the update
            var _partialState = void 0;
            if (update.isReplace) {
                state = getStateFromUpdate(update, instance, state, props);
                dontMutatePrevState = true;
            } else {
                _partialState = getStateFromUpdate(update, instance, state, props);
                if (_partialState) {
                    if (dontMutatePrevState) {
                        // $FlowFixMe: Idk how to type this properly.
                        state = _assign({}, state, _partialState);
                    } else {
                        state = _assign(state, _partialState);
                    }
                    dontMutatePrevState = false;
                }
            }
            if (update.isForced) {
                queue.hasForceUpdate = true;
            }
            if (update.callback !== null) {
                // Append to list of callbacks.
                var _callbackList = queue.callbackList;
                if (_callbackList === null) {
                    _callbackList = queue.callbackList = [];
                }
                _callbackList.push(update);
            }
            update = update.next;
        }

        if (queue.callbackList !== null) {
            workInProgress.effectTag |= Callback;
        } else if (queue.first === null && !queue.hasForceUpdate) {
            // The queue is empty. We can reset it.
            workInProgress.updateQueue = null;
        }

        if (!didSkip) {
            didSkip = true;
            queue.baseState = state;
        }

        {
            // No longer processing.
            queue.isProcessing = false;
        }

        return state;
    }

    function commitCallbacks(queue, context) {
        var callbackList = queue.callbackList;
        if (callbackList === null) {
            return;
        }
        // Set the list to null to make sure they don't get called more than once.
        queue.callbackList = null;
        for (var i = 0; i < callbackList.length; i++) {
            var update = callbackList[i];
            var _callback = update.callback;
            // This update might be processed again. Clear the callback so it's only called
            // once.
            update.callback = null;
            !(typeof _callback === 'function')
                ? invariant_1$1(false, 'Invalid argument passed as callback. Expected a function. Instead received: %s', _callback)
                : void 0;
            _callback.call(context);
        }
    }

    var fakeInternalInstance = {};
    var isArray = Array.isArray;

    {
        var didWarnAboutStateAssignmentForComponent = {};

        var warnOnInvalidCallback = function (callback, callerName) {
            warning_1$1(callback === null || typeof callback === 'function', '%s(...): Expected the last optional `callback` argument to be a function. Instea' +
                    'd received: %s.',
            callerName, callback);
        };

        // This is so gross but it's at least non-critical and can be removed if it
        // causes problems. This is meant to give a nicer error message for
        // ReactDOM15.unstable_renderSubtreeIntoContainer(reactDOM16Component, ...))
        // which otherwise throws a "_processChildContext is not a function" exception.
        Object.defineProperty(fakeInternalInstance, '_processChildContext', {
            enumerable: false,
            value: function () {
                invariant_1$1(false, '_processChildContext is not available in React 16+. This likely means you have m' +
                        'ultiple copies of React and are attempting to nest a React 15 tree inside a Reac' +
                        't 16 tree using unstable_renderSubtreeIntoContainer, which isn\'t supported. Try' +
                        ' to make sure you have only one copy of React (and ideally, switch to ReactDOM.c' +
                        'reatePortal).');
            }
        });
        Object.freeze(fakeInternalInstance);
    }

    var ReactFiberClassComponent = function (scheduleWork, computeExpirationForFiber, memoizeProps, memoizeState) {
        // Class component state updater
        var updater = {
            isMounted: isMounted,
            enqueueSetState: function (instance, partialState, callback) {
                var fiber = get(instance);
                callback = callback === undefined
                    ? null
                    : callback;
                {
                    warnOnInvalidCallback(callback, 'setState');
                }
                var expirationTime = computeExpirationForFiber(fiber);
                var update = {
                    expirationTime: expirationTime,
                    partialState: partialState,
                    callback: callback,
                    isReplace: false,
                    isForced: false,
                    nextCallback: null,
                    next: null
                };
                insertUpdateIntoFiber(fiber, update);
                scheduleWork(fiber, expirationTime);
            },
            enqueueReplaceState: function (instance, state, callback) {
                var fiber = get(instance);
                callback = callback === undefined
                    ? null
                    : callback;
                {
                    warnOnInvalidCallback(callback, 'replaceState');
                }
                var expirationTime = computeExpirationForFiber(fiber);
                var update = {
                    expirationTime: expirationTime,
                    partialState: state,
                    callback: callback,
                    isReplace: true,
                    isForced: false,
                    nextCallback: null,
                    next: null
                };
                insertUpdateIntoFiber(fiber, update);
                scheduleWork(fiber, expirationTime);
            },
            enqueueForceUpdate: function (instance, callback) {
                var fiber = get(instance);
                callback = callback === undefined
                    ? null
                    : callback;
                {
                    warnOnInvalidCallback(callback, 'forceUpdate');
                }
                var expirationTime = computeExpirationForFiber(fiber);
                var update = {
                    expirationTime: expirationTime,
                    partialState: null,
                    callback: callback,
                    isReplace: false,
                    isForced: true,
                    nextCallback: null,
                    next: null
                };
                insertUpdateIntoFiber(fiber, update);
                scheduleWork(fiber, expirationTime);
            }
        };

        function checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState, newContext) {
            if (oldProps === null || workInProgress.updateQueue !== null && workInProgress.updateQueue.hasForceUpdate) {
                // If the workInProgress already has an Update effect, return true
                return true;
            }

            var instance = workInProgress.stateNode;
            var type = workInProgress.type;
            if (typeof instance.shouldComponentUpdate === 'function') {
                startPhaseTimer(workInProgress, 'shouldComponentUpdate');
                var shouldUpdate = instance.shouldComponentUpdate(newProps, newState, newContext);
                stopPhaseTimer();

                {
                    warning_1$1(shouldUpdate !== undefined, '%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make ' +
                            'sure to return true or false.',
                    getComponentName(workInProgress) || 'Unknown');
                }

                return shouldUpdate;
            }

            if (type.prototype && type.prototype.isPureReactComponent) {
                return !shallowEqual_1$1(oldProps, newProps) || !shallowEqual_1$1(oldState, newState);
            }

            return true;
        }

        function checkClassInstance(workInProgress) {
            var instance = workInProgress.stateNode;
            var type = workInProgress.type;
            {
                var name = getComponentName(workInProgress);
                var renderPresent = instance.render;

                if (!renderPresent) {
                    if (type.prototype && typeof type.prototype.render === 'function') {
                        warning_1$1(false, '%s(...): No `render` method found on the returned component instance: did you ac' +
                                'cidentally return an object from the constructor?',
                        name);
                    } else {
                        warning_1$1(false, '%s(...): No `render` method found on the returned component instance: you may ha' +
                                've forgotten to define `render`.',
                        name);
                    }
                }

                var noGetInitialStateOnES6 = !instance.getInitialState || instance.getInitialState.isReactClassApproved || instance.state;
                warning_1$1(noGetInitialStateOnES6, 'getInitialState was defined on %s, a plain JavaScript class. This is only suppor' +
                        'ted for classes created using React.createClass. Did you mean to define a state ' +
                        'property instead?',
                name);
                var noGetDefaultPropsOnES6 = !instance.getDefaultProps || instance.getDefaultProps.isReactClassApproved;
                warning_1$1(noGetDefaultPropsOnES6, 'getDefaultProps was defined on %s, a plain JavaScript class. This is only suppor' +
                        'ted for classes created using React.createClass. Use a static property to define' +
                        ' defaultProps instead.',
                name);
                var noInstancePropTypes = !instance.propTypes;
                warning_1$1(noInstancePropTypes, 'propTypes was defined as an instance property on %s. Use a static property to de' +
                        'fine propTypes instead.',
                name);
                var noInstanceContextTypes = !instance.contextTypes;
                warning_1$1(noInstanceContextTypes, 'contextTypes was defined as an instance property on %s. Use a static property to' +
                        ' define contextTypes instead.',
                name);
                var noComponentShouldUpdate = typeof instance.componentShouldUpdate !== 'function';
                warning_1$1(noComponentShouldUpdate, '%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpda' +
                        'te()? The name is phrased as a question because the function is expected to retu' +
                        'rn a value.',
                name);
                if (type.prototype && type.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== 'undefined') {
                    warning_1$1(false, '%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not' +
                            ' be used when extending React.PureComponent. Please extend React.Component if sh' +
                            'ouldComponentUpdate is used.',
                    getComponentName(workInProgress) || 'A pure component');
                }
                var noComponentDidUnmount = typeof instance.componentDidUnmount !== 'function';
                warning_1$1(noComponentDidUnmount, '%s has a method called componentDidUnmount(). But there is no such lifecycle met' +
                        'hod. Did you mean componentWillUnmount()?',
                name);
                var noComponentDidReceiveProps = typeof instance.componentDidReceiveProps !== 'function';
                warning_1$1(noComponentDidReceiveProps, '%s has a method called componentDidReceiveProps(). But there is no such lifecycl' +
                        'e method. If you meant to update the state in response to changing props, use co' +
                        'mponentWillReceiveProps(). If you meant to fetch data or run side-effects or mut' +
                        'ations after React has updated the UI, use componentDidUpdate().',
                name);
                var noComponentWillRecieveProps = typeof instance.componentWillRecieveProps !== 'function';
                warning_1$1(noComponentWillRecieveProps, '%s has a method called componentWillRecieveProps(). Did you mean componentWillRe' +
                        'ceiveProps()?',
                name);
                var hasMutatedProps = instance.props !== workInProgress.pendingProps;
                warning_1$1(instance.props === undefined || !hasMutatedProps, '%s(...): When calling super() in `%s`, make sure to pass up the same props that ' +
                        'your component's constructor was passed.',
                name, name);
                var noInstanceDefaultProps = !instance.defaultProps;
                warning_1$1(noInstanceDefaultProps, 'Setting defaultProps as an instance property on %s is not supported and will be ' +
                        'ignored. Instead, define defaultProps as a static property on %s.',
                name, name);
            }

            var state = instance.state;
            if (state && (typeof state !== 'object' || isArray(state))) {
                invariant_1$1(false, '%s.state: must be set to an object or null', getComponentName(workInProgress));
            }
            if (typeof instance.getChildContext === 'function') {
                !(typeof workInProgress.type.childContextTypes === 'object')
                    ? invariant_1$1(false, '%s.getChildContext(): childContextTypes must be defined in order to use getChild' +
                            'Context().',
                    getComponentName(workInProgress))
                    : void 0;
            }
        }

        function resetInputPointers(workInProgress, instance) {
            instance.props = workInProgress.memoizedProps;
            instance.state = workInProgress.memoizedState;
        }

        function adoptClassInstance(workInProgress, instance) {
            instance.updater = updater;
            workInProgress.stateNode = instance;
            // The instance needs access to the fiber so that it can schedule updates
            set(instance, workInProgress);
            {
                instance._reactInternalInstance = fakeInternalInstance;
            }
        }

        function constructClassInstance(workInProgress, props) {
            var ctor = workInProgress.type;
            var unmaskedContext = getUnmaskedContext(workInProgress);
            var needsContext = isContextConsumer(workInProgress);
            var context = needsContext
                ? getMaskedContext(workInProgress, unmaskedContext)
                : emptyObject_1;
            var instance = new ctor(props, context);
            adoptClassInstance(workInProgress, instance);

            // Cache unmasked context so we can avoid recreating masked context unless
            // necessary. ReactFiberContext usually updates this cache but can't for
            // newly-created instances.
            if (needsContext) {
                cacheContext(workInProgress, unmaskedContext, context);
            }

            return instance;
        }

        function callComponentWillMount(workInProgress, instance) {
            startPhaseTimer(workInProgress, 'componentWillMount');
            var oldState = instance.state;
            instance.componentWillMount();

            stopPhaseTimer();

            if (oldState !== instance.state) {
                {
                    warning_1$1(false, '%s.componentWillMount(): Assigning directly to this.state is deprecated (except ' +
                            'inside a component's constructor). Use setState instead.',
                    getComponentName(workInProgress));
                }
                updater.enqueueReplaceState(instance, instance.state, null);
            }
        }

        function callComponentWillReceiveProps(workInProgress, instance, newProps, newContext) {
            startPhaseTimer(workInProgress, 'componentWillReceiveProps');
            var oldState = instance.state;
            instance.componentWillReceiveProps(newProps, newContext);
            stopPhaseTimer();

            if (instance.state !== oldState) {
                {
                    var componentName = getComponentName(workInProgress) || 'Component';
                    if (!didWarnAboutStateAssignmentForComponent[componentName]) {
                        warning_1$1(false, '%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (' +
                                'except inside a component's constructor). Use setState instead.',
                        componentName);
                        didWarnAboutStateAssignmentForComponent[componentName] = true;
                    }
                }
                updater.enqueueReplaceState(instance, instance.state, null);
            }
        }

        // Invokes the mount life-cycles on a previously never rendered instance.
        function mountClassInstance(workInProgress, renderExpirationTime) {
            var current = workInProgress.alternate;

            {
                checkClassInstance(workInProgress);
            }

            var instance = workInProgress.stateNode;
            var state = instance.state || null;

            var props = workInProgress.pendingProps;
            !props
                ? invariant_1$1(false, 'There must be pending props for an initial mount. This error is likely caused by' +
                        ' a bug in React. Please file an issue.')
                : void 0;

            var unmaskedContext = getUnmaskedContext(workInProgress);

            instance.props = props;
            instance.state = workInProgress.memoizedState = state;
            instance.refs = emptyObject_1;
            instance.context = getMaskedContext(workInProgress, unmaskedContext);

            if (enableAsyncSubtreeAPI && workInProgress.type != null && workInProgress.type.prototype != null && workInProgress.type.prototype.unstable_isAsyncReactComponent === true) {
                workInProgress.internalContextTag |= AsyncUpdates;
            }

            if (typeof instance.componentWillMount === 'function') {
                callComponentWillMount(workInProgress, instance);
                // If we had additional state updates during this life-cycle, let's process them
                // now.
                var updateQueue = workInProgress.updateQueue;
                if (updateQueue !== null) {
                    instance.state = processUpdateQueue(current, workInProgress, updateQueue, instance, props, renderExpirationTime);
                }
            }
            if (typeof instance.componentDidMount === 'function') {
                workInProgress.effectTag |= Update;
            }
        }

        // Called on a preexisting class instance. Returns false if a resumed render
        // could be reused. function resumeMountClassInstance(   workInProgress: Fiber,
        //  priorityLevel: PriorityLevel, ): boolean {   const instance =
        // workInProgress.stateNode;   resetInputPointers(workInProgress, instance);
        // let newState = workInProgress.memoizedState;   let newProps =
        // workInProgress.pendingProps;   if (!newProps) {     // If there isn't any new
        // props, then we'll reuse the memoized props.     // This could be from already
        // completed work.     newProps = workInProgress.memoizedProps;     invariant(
        //     newProps != null,       'There should always be pending or memoized
        // props. This error is ' +         'likely caused by a bug in React. Please
        // file an issue.',     );   }   const newUnmaskedContext =
        // getUnmaskedContext(workInProgress);   const newContext =
        // getMaskedContext(workInProgress, newUnmaskedContext);   const oldContext =
        // instance.context;   const oldProps = workInProgress.memoizedProps;   if (
        // typeof instance.componentWillReceiveProps === 'function' &&     (oldProps !==
        // newProps || oldContext !== newContext)   ) {
        // callComponentWillReceiveProps(       workInProgress,       instance,
        // newProps,       newContext,     );   }   // Process the update queue before
        // calling shouldComponentUpdate   const updateQueue =
        // workInProgress.updateQueue;   if (updateQueue !== null) {     newState =
        // processUpdateQueue(       workInProgress,       updateQueue,       instance,
        //      newState,       newProps,       priorityLevel,     );   }   // TODO:
        // Should we deal with a setState that happened after the last   //
        // componentWillMount and before this componentWillMount? Probably   //
        // unsupported anyway.   if (     !checkShouldComponentUpdate(
        // workInProgress,       workInProgress.memoizedProps,       newProps,
        // workInProgress.memoizedState,       newState,       newContext,     )   ) {
        //   // Update the existing instance's state, props, and context pointers even
        //   // though we're bailing out.     instance.props = newProps;
        // instance.state = newState;     instance.context = newContext;     return
        // false;   }   // Update the input pointers now so that they are correct when
        // we call   // componentWillMount   instance.props = newProps;   instance.state
        // = newState;   instance.context = newContext;   if (typeof
        // instance.componentWillMount === 'function') {
        // callComponentWillMount(workInProgress, instance);     // componentWillMount
        // may have called setState. Process the update queue.     const newUpdateQueue
        // = workInProgress.updateQueue;     if (newUpdateQueue !== null) {
        // newState = processUpdateQueue(         workInProgress,
        // newUpdateQueue,         instance,         newState,         newProps,
        // priorityLevel,       );     }   }   if (typeof instance.componentDidMount ===
        // 'function') {     workInProgress.effectTag |= Update;   }   instance.state =
        // newState;   return true; } Invokes the update life-cycles and returns false
        // if it shouldn't rerender.
        function updateClassInstance(current, workInProgress, renderExpirationTime) {
            var instance = workInProgress.stateNode;
            resetInputPointers(workInProgress, instance);

            var oldProps = workInProgress.memoizedProps;
            var newProps = workInProgress.pendingProps;
            if (!newProps) {
                // If there aren't any new props, then we'll reuse the memoized props. This
                // could be from already completed work.
                newProps = oldProps;
                !(newProps != null)
                    ? invariant_1$1(false, 'There should always be pending or memoized props. This error is likely caused by' +
                            ' a bug in React. Please file an issue.')
                    : void 0;
            }
            var oldContext = instance.context;
            var newUnmaskedContext = getUnmaskedContext(workInProgress);
            var newContext = getMaskedContext(workInProgress, newUnmaskedContext);

            // Note: During these life-cycles, instance.props/instance.state are what ever
            // the previously attempted to render - not the "current". However, during
            // componentDidUpdate we pass the "current" props.

            if (typeof instance.componentWillReceiveProps === 'function' && (oldProps !== newProps || oldContext !== newContext)) {
                callComponentWillReceiveProps(workInProgress, instance, newProps, newContext);
            }

            // Compute the next state using the memoized state and the update queue.
            var oldState = workInProgress.memoizedState;
            // TODO: Previous state can be null.
            var newState = void 0;
            if (workInProgress.updateQueue !== null) {
                newState = processUpdateQueue(current, workInProgress, workInProgress.updateQueue, instance, newProps, renderExpirationTime);
            } else {
                newState = oldState;
            }

            if (oldProps === newProps && oldState === newState && !hasContextChanged() && !(workInProgress.updateQueue !== null && workInProgress.updateQueue.hasForceUpdate)) {
                // If an update was already in progress, we should schedule an Update effect
                // even though we're bailing out, so that cWU/cDU are called.
                if (typeof instance.componentDidUpdate === 'function') {
                    if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                        workInProgress.effectTag |= Update;
                    }
                }
                return false;
            }

            var shouldUpdate = checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState, newContext);

            if (shouldUpdate) {
                if (typeof instance.componentWillUpdate === 'function') {
                    startPhaseTimer(workInProgress, 'componentWillUpdate');
                    instance.componentWillUpdate(newProps, newState, newContext);
                    stopPhaseTimer();
                }
                if (typeof instance.componentDidUpdate === 'function') {
                    workInProgress.effectTag |= Update;
                }
            } else {
                // If an update was already in progress, we should schedule an Update effect
                // even though we're bailing out, so that cWU/cDU are called.
                if (typeof instance.componentDidUpdate === 'function') {
                    if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                        workInProgress.effectTag |= Update;
                    }
                }

                // If shouldComponentUpdate returned false, we should still update the memoized
                // props/state to indicate that this work can be reused.
                memoizeProps(workInProgress, newProps);
                memoizeState(workInProgress, newState);
            }

            // Update the existing instance's state, props, and context pointers even if
            // shouldComponentUpdate returns false.
            instance.props = newProps;
            instance.state = newState;
            instance.context = newContext;

            return shouldUpdate;
        }

        return {
            adoptClassInstance: adoptClassInstance, constructClassInstance: constructClassInstance, mountClassInstance: mountClassInstance,
            // resumeMountClassInstance,
            updateClassInstance: updateClassInstance
        };
    };

    // The Symbol used to tag the special React types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var REACT_PORTAL_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.portal') || 0xeaca;

    function createPortal$1(children, containerInfo,
    // TODO: figure out the API for cross-renderer implementation.
    implementation) {
        var key = arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : null;

        return {
            // This tag allow us to uniquely identify this as a React Portal
            $$typeof: REACT_PORTAL_TYPE,
            key: key == null
                ? null
                : '' + key,
            children: children,
            containerInfo: containerInfo,
            implementation: implementation
        };
    }

    var getCurrentFiberStackAddendum$1 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;

    {
        var didWarnAboutMaps = false;
        /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */
        var ownerHasKeyUseWarning = {};
        var ownerHasFunctionTypeWarning = {};

        var warnForMissingKey = function (child) {
            if (child === null || typeof child !== 'object') {
                return;
            }
            if (!child._store || child._store.validated || child.key != null) {
                return;
            }
            !(typeof child._store === 'object')
                ? invariant_1$1(false, 'React Component in warnForMissingKey should have a _store. This error is likely ' +
                        'caused by a bug in React. Please file an issue.')
                : void 0;
            child._store.validated = true;

            var currentComponentErrorInfo = 'Each child in an array or iterator should have a unique "key" prop. See https://' +
                    'fb.me/react-warning-keys for more information.' + (getCurrentFiberStackAddendum$1() || '');
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
                return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

            warning_1$1(false, 'Each child in an array or iterator should have a unique "key" prop. See https://' +
                    'fb.me/react-warning-keys for more information.%s',
            getCurrentFiberStackAddendum$1());
        };
    }

    var isArray$1 = Array.isArray;

    var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

    // The Symbol used to tag the ReactElement-like types. If there is no native
    // Symbol nor polyfill, then a plain number is used for performance.
    var REACT_ELEMENT_TYPE;
    var REACT_CALL_TYPE;
    var REACT_RETURN_TYPE;
    var REACT_FRAGMENT_TYPE;
    if (typeof Symbol === 'function' && Symbol['for']) {
        REACT_ELEMENT_TYPE = Symbol['for']('react.element');
        REACT_CALL_TYPE = Symbol['for']('react.call');
        REACT_RETURN_TYPE = Symbol['for']('react.return');
        REACT_FRAGMENT_TYPE = Symbol['for']('react.fragment');
    } else {
        REACT_ELEMENT_TYPE = 0xeac7;
        REACT_CALL_TYPE = 0xeac8;
        REACT_RETURN_TYPE = 0xeac9;
        REACT_FRAGMENT_TYPE = 0xeacb;
    }

    function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable === 'undefined') {
            return null;
        }
        var iteratorFn = ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof iteratorFn === 'function') {
            return iteratorFn;
        }
        return null;
    }

    function coerceRef(current, element) {
        var mixedRef = element.ref;
        if (mixedRef !== null && typeof mixedRef !== 'function') {
            if (element._owner) {
                var owner = element._owner;
                var inst = void 0;
                if (owner) {
                    var ownerFiber = owner;
                    !(ownerFiber.tag === ClassComponent)
                        ? invariant_1$1(false, 'Stateless function components cannot have refs.')
                        : void 0;
                    inst = ownerFiber.stateNode;
                }
                !inst
                    ? invariant_1$1(false, 'Missing owner for string ref %s. This error is likely caused by a bug in React. ' +
                            'Please file an issue.',
                    mixedRef)
                    : void 0;
                var stringRef = '' + mixedRef;
                // Check if previous string ref matches new string ref
                if (current !== null && current.ref !== null && current.ref._stringRef === stringRef) {
                    return current.ref;
                }
                var ref = function (value) {
                    var refs = inst.refs === emptyObject_1
                        ? inst.refs = {}
                        : inst.refs;
                    if (value === null) {
                        delete refs[stringRef];
                    } else {
                        refs[stringRef] = value;
                    }
                };
                ref._stringRef = stringRef;
                return ref;
            } else {
                !(typeof mixedRef === 'string')
                    ? invariant_1$1(false, 'Expected ref to be a function or a string.')
                    : void 0;
                !element._owner
                    ? invariant_1$1(false, 'Element ref was specified as a string (%s) but no owner was set. You may have mu' +
                            'ltiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owne' +
                            'r).',
                    mixedRef)
                    : void 0;
            }
        }
        return mixedRef;
    }

    function throwOnInvalidObjectType(returnFiber, newChild) {
        if (returnFiber.type !== 'textarea') {
            var addendum = '';
            {
                addendum = ' If you meant to render a collection of children, use an array instead.' + (getCurrentFiberStackAddendum$1() || '');
            }
            invariant_1$1(false, 'Objects are not valid as a React child (found: %s).%s', Object.prototype.toString.call(newChild) === '[object Object]'
                ? 'object with keys {' + Object.keys(newChild).join(', ') + '}'
                : newChild, addendum);
        }
    }

    function warnOnFunctionType() {
        var currentComponentErrorInfo = 'Functions are not valid as a React child. This may happen if you return a Compon' +
                'ent instead of <Component /> from render. Or maybe you meant to call this functi' +
                'on rather than return it.' + (getCurrentFiberStackAddendum$1() || '');

        if (ownerHasFunctionTypeWarning[currentComponentErrorInfo]) {
            return;
        }
        ownerHasFunctionTypeWarning[currentComponentErrorInfo] = true;

        warning_1$1(false, 'Functions are not valid as a React child. This may happen if you return a Compon' +
                'ent instead of <Component /> from render. Or maybe you meant to call this functi' +
                'on rather than return it.%s',
        getCurrentFiberStackAddendum$1() || '');
    }

    // This wrapper function exists because I expect to clone the code in each path
    // to be able to optimize each path individually by branching early. This needs
    // a compiler or we can do it manually. Helpers that don't need this branching
    // live outside of this function.
    function ChildReconciler(shouldClone, shouldTrackSideEffects) {
        function deleteChild(returnFiber, childToDelete) {
            if (!shouldTrackSideEffects) {
                // Noop.
                return;
            }
            if (!shouldClone) {
                // When we're reconciling in place we have a work in progress copy. We actually
                // want the current copy. If there is no current copy, then we don't need to
                // track deletion side-effects.
                if (childToDelete.alternate === null) {
                    return;
                }
                childToDelete = childToDelete.alternate;
            }
            // Deletions are added in reversed order so we add it to the front. At this
            // point, the return fiber's effect list is empty except for deletions, so we
            // can just append the deletion to the list. The remaining effects aren't added
            // until the complete phase. Once we implement resuming, this may not be true.
            var last = returnFiber.lastEffect;
            if (last !== null) {
                last.nextEffect = childToDelete;
                returnFiber.lastEffect = childToDelete;
            } else {
                returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
            }
            childToDelete.nextEffect = null;
            childToDelete.effectTag = Deletion;
        }

        function deleteRemainingChildren(returnFiber, currentFirstChild) {
            if (!shouldTrackSideEffects) {
                // Noop.
                return null;
            }

            // TODO: For the shouldClone case, this could be micro-optimized a bit by
            // assuming that after the first child we've already added everything.
            var childToDelete = currentFirstChild;
            while (childToDelete !== null) {
                deleteChild(returnFiber, childToDelete);
                childToDelete = childToDelete.sibling;
            }
            return null;
        }

        function mapRemainingChildren(returnFiber, currentFirstChild) {
            // Add the remaining children to a temporary map so that we can find them by
            // keys quickly. Implicit (null) keys get added to this set with their index
            var existingChildren = new Map();

            var existingChild = currentFirstChild;
            while (existingChild !== null) {
                if (existingChild.key !== null) {
                    existingChildren.set(existingChild.key, existingChild);
                } else {
                    existingChildren.set(existingChild.index, existingChild);
                }
                existingChild = existingChild.sibling;
            }
            return existingChildren;
        }

        function useFiber(fiber, pendingProps, expirationTime) {
            // We currently set sibling to null and index to 0 here because it is easy to
            // forget to do before returning it. E.g. for the single child case.
            if (shouldClone) {
                var clone = createWorkInProgress(fiber, pendingProps, expirationTime);
                clone.index = 0;
                clone.sibling = null;
                return clone;
            } else {
                // We override the expiration time even if it is earlier, because if we're
                // reconciling at a later time that means that this was down-prioritized.
                fiber.expirationTime = expirationTime;
                fiber.effectTag = NoEffect;
                fiber.index = 0;
                fiber.sibling = null;
                fiber.pendingProps = pendingProps;
                return fiber;
            }
        }

        function placeChild(newFiber, lastPlacedIndex, newIndex) {
            newFiber.index = newIndex;
            if (!shouldTrackSideEffects) {
                // Noop.
                return lastPlacedIndex;
            }
            var current = newFiber.alternate;
            if (current !== null) {
                var oldIndex = current.index;
                if (oldIndex < lastPlacedIndex) {
                    // This is a move.
                    newFiber.effectTag = Placement;
                    return lastPlacedIndex;
                } else {
                    // This item can stay in place.
                    return oldIndex;
                }
            } else {
                // This is an insertion.
                newFiber.effectTag = Placement;
                return lastPlacedIndex;
            }
        }

        function placeSingleChild(newFiber) {
            // This is simpler for the single child case. We only need to do a placement for
            // inserting new children.
            if (shouldTrackSideEffects && newFiber.alternate === null) {
                newFiber.effectTag = Placement;
            }
            return newFiber;
        }

        function updateTextNode(returnFiber, current, textContent, expirationTime) {
            if (current === null || current.tag !== HostText) {
                // Insert
                var created = createFiberFromText(textContent, returnFiber.internalContextTag, expirationTime);
                created['return'] = returnFiber;
                return created;
            } else {
                // Update
                var existing = useFiber(current, textContent, expirationTime);
                existing['return'] = returnFiber;
                return existing;
            }
        }

        function updateElement(returnFiber, current, element, expirationTime) {
            if (current !== null && current.type === element.type) {
                // Move based on index
                var existing = useFiber(current, element.props, expirationTime);
                existing.ref = coerceRef(current, element);
                existing['return'] = returnFiber;
                {
                    existing._debugSource = element._source;
                    existing._debugOwner = element._owner;
                }
                return existing;
            } else {
                // Insert
                var created = createFiberFromElement(element, returnFiber.internalContextTag, expirationTime);
                created.ref = coerceRef(current, element);
                created['return'] = returnFiber;
                return created;
            }
        }

        function updateCall(returnFiber, current, call, expirationTime) {
            // TODO: Should this also compare handler to determine whether to reuse?
            if (current === null || current.tag !== CallComponent) {
                // Insert
                var created = createFiberFromCall(call, returnFiber.internalContextTag, expirationTime);
                created['return'] = returnFiber;
                return created;
            } else {
                // Move based on index
                var existing = useFiber(current, call, expirationTime);
                existing['return'] = returnFiber;
                return existing;
            }
        }

        function updateReturn(returnFiber, current, returnNode, expirationTime) {
            if (current === null || current.tag !== ReturnComponent) {
                // Insert
                var created = createFiberFromReturn(returnNode, returnFiber.internalContextTag, expirationTime);
                created.type = returnNode.value;
                created['return'] = returnFiber;
                return created;
            } else {
                // Move based on index
                var existing = useFiber(current, null, expirationTime);
                existing.type = returnNode.value;
                existing['return'] = returnFiber;
                return existing;
            }
        }

        function updatePortal(returnFiber, current, portal, expirationTime) {
            if (current === null || current.tag !== HostPortal || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) {
                // Insert
                var created = createFiberFromPortal(portal, returnFiber.internalContextTag, expirationTime);
                created['return'] = returnFiber;
                return created;
            } else {
                // Update
                var existing = useFiber(current, portal.children || [], expirationTime);
                existing['return'] = returnFiber;
                return existing;
            }
        }

        function updateFragment(returnFiber, current, fragment, expirationTime, key) {
            if (current === null || current.tag !== Fragment) {
                // Insert
                var created = createFiberFromFragment(fragment, returnFiber.internalContextTag, expirationTime, key);
                created['return'] = returnFiber;
                return created;
            } else {
                // Update
                var existing = useFiber(current, fragment, expirationTime);
                existing['return'] = returnFiber;
                return existing;
            }
        }

        function createChild(returnFiber, newChild, expirationTime) {
            if (typeof newChild === 'string' || typeof newChild === 'number') {
                // Text nodes don't have keys. If the previous node is implicitly keyed we can
                // continue to replace it without aborting even if it is not a text node.
                var created = createFiberFromText('' + newChild, returnFiber.internalContextTag, expirationTime);
                created['return'] = returnFiber;
                return created;
            }

            if (typeof newChild === 'object' && newChild !== null) {
                switch (newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        {
                            if (newChild.type === REACT_FRAGMENT_TYPE) {
                                var _created = createFiberFromFragment(newChild.props.children, returnFiber.internalContextTag, expirationTime, newChild.key);
                                _created['return'] = returnFiber;
                                return _created;
                            } else {
                                var _created2 = createFiberFromElement(newChild, returnFiber.internalContextTag, expirationTime);
                                _created2.ref = coerceRef(null, newChild);
                                _created2['return'] = returnFiber;
                                return _created2;
                            }
                        }

                    case REACT_CALL_TYPE:
                        {
                            var _created3 = createFiberFromCall(newChild, returnFiber.internalContextTag, expirationTime);
                            _created3['return'] = returnFiber;
                            return _created3;
                        }

                    case REACT_RETURN_TYPE:
                        {
                            var _created4 = createFiberFromReturn(newChild, returnFiber.internalContextTag, expirationTime);
                            _created4.type = newChild.value;
                            _created4['return'] = returnFiber;
                            return _created4;
                        }

                    case REACT_PORTAL_TYPE:
                        {
                            var _created5 = createFiberFromPortal(newChild, returnFiber.internalContextTag, expirationTime);
                            _created5['return'] = returnFiber;
                            return _created5;
                        }
                }

                if (isArray$1(newChild) || getIteratorFn(newChild)) {
                    var _created6 = createFiberFromFragment(newChild, returnFiber.internalContextTag, expirationTime, null);
                    _created6['return'] = returnFiber;
                    return _created6;
                }

                throwOnInvalidObjectType(returnFiber, newChild);
            }

            {
                if(typeof newChild === 'function') {
                    warnOnFunctionType();
                }
            }

            return null;
        }

        function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
            // Update the fiber if the keys match, otherwise return null.

            var key = oldFiber !== null
                ? oldFiber.key
                : null;

            if (typeof newChild === 'string' || typeof newChild === 'number') {
                // Text nodes don't have keys. If the previous node is implicitly keyed we can
                // continue to replace it without aborting even if it is not a text node.
                if (key !== null) {
                    return null;
                }
                return updateTextNode(returnFiber, oldFiber, '' + newChild, expirationTime);
            }

            if (typeof newChild === 'object' && newChild !== null) {
                switch (newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        {
                            if (newChild.key === key) {
                                if (newChild.type === REACT_FRAGMENT_TYPE) {
                                    return updateFragment(returnFiber, oldFiber, newChild.props.children, expirationTime, key);
                                }
                                return updateElement(returnFiber, oldFiber, newChild, expirationTime);
                            } else {
                                return null;
                            }
                        }

                    case REACT_CALL_TYPE:
                        {
                            if (newChild.key === key) {
                                return updateCall(returnFiber, oldFiber, newChild, expirationTime);
                            } else {
                                return null;
                            }
                        }

                    case REACT_RETURN_TYPE:
                        {
                            // Returns don't have keys. If the previous node is implicitly keyed we can
                            // continue to replace it without aborting even if it is not a yield.
                            if (key === null) {
                                return updateReturn(returnFiber, oldFiber, newChild, expirationTime);
                            } else {
                                return null;
                            }
                        }

                    case REACT_PORTAL_TYPE:
                        {
                            if (newChild.key === key) {
                                return updatePortal(returnFiber, oldFiber, newChild, expirationTime);
                            } else {
                                return null;
                            }
                        }
                }

                if (isArray$1(newChild) || getIteratorFn(newChild)) {
                    if (key !== null) {
                        return null;
                    }

                    return updateFragment(returnFiber, oldFiber, newChild, expirationTime, null);
                }

                throwOnInvalidObjectType(returnFiber, newChild);
            }

            {
                if(typeof newChild === 'function') {
                    warnOnFunctionType();
                }
            }

            return null;
        }

        function updateFromMap(existingChildren, returnFiber, newIdx, newChild, expirationTime) {
            if (typeof newChild === 'string' || typeof newChild === 'number') {
                // Text nodes don't have keys, so we neither have to check the old nor new node
                // for the key. If both are text nodes, they match.
                var matchedFiber = existingChildren.get(newIdx) || null;
                return updateTextNode(returnFiber, matchedFiber, '' + newChild, expirationTime);
            }

            if (typeof newChild === 'object' && newChild !== null) {
                switch (newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        {
                            var _matchedFiber = existingChildren.get(newChild.key === null
                                ? newIdx
                                : newChild.key) || null;
                            if (newChild.type === REACT_FRAGMENT_TYPE) {
                                return updateFragment(returnFiber, _matchedFiber, newChild.props.children, expirationTime, newChild.key);
                            }
                            return updateElement(returnFiber, _matchedFiber, newChild, expirationTime);
                        }

                    case REACT_CALL_TYPE:
                        {
                            var _matchedFiber2 = existingChildren.get(newChild.key === null
                                ? newIdx
                                : newChild.key) || null;
                            return updateCall(returnFiber, _matchedFiber2, newChild, expirationTime);
                        }

                    case REACT_RETURN_TYPE:
                        {
                            // Returns don't have keys, so we neither have to check the old nor new node for
                            // the key. If both are returns, they match.
                            var _matchedFiber3 = existingChildren.get(newIdx) || null;
                            return updateReturn(returnFiber, _matchedFiber3, newChild, expirationTime);
                        }

                    case REACT_PORTAL_TYPE:
                        {
                            var _matchedFiber4 = existingChildren.get(newChild.key === null
                                ? newIdx
                                : newChild.key) || null;
                            return updatePortal(returnFiber, _matchedFiber4, newChild, expirationTime);
                        }
                }

                if (isArray$1(newChild) || getIteratorFn(newChild)) {
                    var _matchedFiber5 = existingChildren.get(newIdx) || null;
                    return updateFragment(returnFiber, _matchedFiber5, newChild, expirationTime, null);
                }

                throwOnInvalidObjectType(returnFiber, newChild);
            }

            {
                if(typeof newChild === 'function') {
                    warnOnFunctionType();
                }
            }

            return null;
        }

        /**
   * Warns if there is a duplicate or missing key
   */
        function warnOnInvalidKey(child, knownKeys) {
            {
                if(typeof child !== 'object' || child === null) {
                    return knownKeys;
                }
                switch (child.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                    case REACT_CALL_TYPE:
                    case REACT_PORTAL_TYPE:
                        warnForMissingKey(child);
                        var key = child.key;
                        if (typeof key !== 'string') {
                            break;
                        }
                        if (knownKeys === null) {
                            knownKeys = new Set();
                            knownKeys.add(key);
                            break;
                        }
                        if (!knownKeys.has(key)) {
                            knownKeys.add(key);
                            break;
                        }
                        warning_1$1(false, 'Encountered two children with the same key, `%s`. Keys should be unique so that ' +
                                'components maintain their identity across updates. Non-unique keys may cause chi' +
                                'ldren to be duplicated and/or omitted â€” the behavior is unsupported and could ' +
                                'change in a future version.%s',
                        key, getCurrentFiberStackAddendum$1());
                        break;
                    default:
                        break;
                }
            }
            return knownKeys;
        }

        function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
            // This algorithm can't optimize by searching from boths ends since we don't
            // have backpointers on fibers. I'm trying to see how far we can get with that
            // model. If it ends up not being worth the tradeoffs, we can add it later. Even
            // with a two ended optimization, we'd want to optimize for the case where there
            // are few changes and brute force the comparison instead of going for the Map.
            // It'd like to explore hitting that path first in forward-only mode and only go
            // for the Map once we notice that we need lots of look ahead. This doesn't
            // handle reversal as well as two ended search but that's unusual. Besides, for
            // the two ended optimization to work on Iterables, we'd need to copy the whole
            // set. In this first iteration, we'll just live with hitting the bad case
            // (adding everything to a Map) in for every insert/move. If you change this
            // code, also update reconcileChildrenIterator() which uses the same algorithm.

            {
                // First, validate keys.
                var knownKeys = null;
                for (var i = 0; i < newChildren.length; i++) {
                    var child = newChildren[i];
                    knownKeys = warnOnInvalidKey(child, knownKeys);
                }
            }

            var resultingFirstChild = null;
            var previousNewFiber = null;

            var oldFiber = currentFirstChild;
            var lastPlacedIndex = 0;
            var newIdx = 0;
            var nextOldFiber = null;
            for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
                if (oldFiber.index > newIdx) {
                    nextOldFiber = oldFiber;
                    oldFiber = null;
                } else {
                    nextOldFiber = oldFiber.sibling;
                }
                var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], expirationTime);
                if (newFiber === null) {
                    // TODO: This breaks on empty slots like null children. That's unfortunate
                    // because it triggers the slow path all the time. We need a better way to
                    // communicate whether this was a miss or null, boolean, undefined, etc.
                    if (oldFiber === null) {
                        oldFiber = nextOldFiber;
                    }
                    break;
                }
                if (shouldTrackSideEffects) {
                    if (oldFiber && newFiber.alternate === null) {
                        // We matched the slot, but we didn't reuse the existing fiber, so we need to
                        // delete the existing child.
                        deleteChild(returnFiber, oldFiber);
                    }
                }
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (previousNewFiber === null) {
                    // TODO: Move out of the loop. This only happens for the first run.
                    resultingFirstChild = newFiber;
                } else {
                    // TODO: Defer siblings if we're not at the right index for this slot. I.e. if
                    // we had null values before, then we want to defer this for each null value.
                    // However, we also don't want to call updateSlot with the previous one.
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
                oldFiber = nextOldFiber;
            }

            if (newIdx === newChildren.length) {
                // We've reached the end of the new children. We can delete the rest.
                deleteRemainingChildren(returnFiber, oldFiber);
                return resultingFirstChild;
            }

            if (oldFiber === null) {
                // If we don't have any more existing children we can choose a fast path since
                // the rest will all be insertions.
                for (; newIdx < newChildren.length; newIdx++) {
                    var _newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime);
                    if (!_newFiber) {
                        continue;
                    }
                    lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);
                    if (previousNewFiber === null) {
                        // TODO: Move out of the loop. This only happens for the first run.
                        resultingFirstChild = _newFiber;
                    } else {
                        previousNewFiber.sibling = _newFiber;
                    }
                    previousNewFiber = _newFiber;
                }
                return resultingFirstChild;
            }

            // Add all children to a key map for quick lookups.
            var existingChildren = mapRemainingChildren(returnFiber, oldFiber);

            // Keep scanning and use the map to restore deleted items as moves.
            for (; newIdx < newChildren.length; newIdx++) {
                var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], expirationTime);
                if (_newFiber2) {
                    if (shouldTrackSideEffects) {
                        if (_newFiber2.alternate !== null) {
                            // The new fiber is a work in progress, but if there exists a current, that
                            // means that we reused the fiber. We need to delete it from the child list so
                            // that we don't add it to the deletion list.
                            existingChildren['delete'](_newFiber2.key === null
                                ? newIdx
                                : _newFiber2.key);
                        }
                    }
                    lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);
                    if (previousNewFiber === null) {
                        resultingFirstChild = _newFiber2;
                    } else {
                        previousNewFiber.sibling = _newFiber2;
                    }
                    previousNewFiber = _newFiber2;
                }
            }

            if (shouldTrackSideEffects) {
                // Any existing children that weren't consumed above were deleted. We need to
                // add them to the deletion list.
                existingChildren
                    .forEach(function (child) {
                        return deleteChild(returnFiber, child);
                    });
            }

            return resultingFirstChild;
        }

        function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildrenIterable, expirationTime) {
            // This is the same implementation as reconcileChildrenArray(), but using the
            // iterator instead.

            var iteratorFn = getIteratorFn(newChildrenIterable);
            !(typeof iteratorFn === 'function')
                ? invariant_1$1(false, 'An object is not an iterable. This error is likely caused by a bug in React. Ple' +
                        'ase file an issue.')
                : void 0;

            {
                // Warn about using Maps as children
                if (typeof newChildrenIterable.entries === 'function') {
                    var possibleMap = newChildrenIterable;
                    if (possibleMap.entries === iteratorFn) {
                        warning_1$1(didWarnAboutMaps, 'Using Maps as children is unsupported and will likely yield unexpected results. ' +
                                'Convert it to a sequence/iterable of keyed ReactElements instead.%s',
                        getCurrentFiberStackAddendum$1());
                        didWarnAboutMaps = true;
                    }
                }

                // First, validate keys. We'll get a different iterator later for the main pass.
                var _newChildren = iteratorFn.call(newChildrenIterable);
                if (_newChildren) {
                    var knownKeys = null;
                    var _step = _newChildren.next();
                    for (; !_step.done; _step = _newChildren.next()) {
                        var child = _step.value;
                        knownKeys = warnOnInvalidKey(child, knownKeys);
                    }
                }
            }

            var newChildren = iteratorFn.call(newChildrenIterable);
            !(newChildren != null)
                ? invariant_1$1(false, 'An iterable object provided no iterator.')
                : void 0;

            var resultingFirstChild = null;
            var previousNewFiber = null;

            var oldFiber = currentFirstChild;
            var lastPlacedIndex = 0;
            var newIdx = 0;
            var nextOldFiber = null;

            var step = newChildren.next();
            for (; oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
                if (oldFiber.index > newIdx) {
                    nextOldFiber = oldFiber;
                    oldFiber = null;
                } else {
                    nextOldFiber = oldFiber.sibling;
                }
                var newFiber = updateSlot(returnFiber, oldFiber, step.value, expirationTime);
                if (newFiber === null) {
                    // TODO: This breaks on empty slots like null children. That's unfortunate
                    // because it triggers the slow path all the time. We need a better way to
                    // communicate whether this was a miss or null, boolean, undefined, etc.
                    if (!oldFiber) {
                        oldFiber = nextOldFiber;
                    }
                    break;
                }
                if (shouldTrackSideEffects) {
                    if (oldFiber && newFiber.alternate === null) {
                        // We matched the slot, but we didn't reuse the existing fiber, so we need to
                        // delete the existing child.
                        deleteChild(returnFiber, oldFiber);
                    }
                }
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (previousNewFiber === null) {
                    // TODO: Move out of the loop. This only happens for the first run.
                    resultingFirstChild = newFiber;
                } else {
                    // TODO: Defer siblings if we're not at the right index for this slot. I.e. if
                    // we had null values before, then we want to defer this for each null value.
                    // However, we also don't want to call updateSlot with the previous one.
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
                oldFiber = nextOldFiber;
            }

            if (step.done) {
                // We've reached the end of the new children. We can delete the rest.
                deleteRemainingChildren(returnFiber, oldFiber);
                return resultingFirstChild;
            }

            if (oldFiber === null) {
                // If we don't have any more existing children we can choose a fast path since
                // the rest will all be insertions.
                for (; !step.done; newIdx++, step = newChildren.next()) {
                    var _newFiber3 = createChild(returnFiber, step.value, expirationTime);
                    if (_newFiber3 === null) {
                        continue;
                    }
                    lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);
                    if (previousNewFiber === null) {
                        // TODO: Move out of the loop. This only happens for the first run.
                        resultingFirstChild = _newFiber3;
                    } else {
                        previousNewFiber.sibling = _newFiber3;
                    }
                    previousNewFiber = _newFiber3;
                }
                return resultingFirstChild;
            }

            // Add all children to a key map for quick lookups.
            var existingChildren = mapRemainingChildren(returnFiber, oldFiber);

            // Keep scanning and use the map to restore deleted items as moves.
            for (; !step.done; newIdx++, step = newChildren.next()) {
                var _newFiber4 = updateFromMap(existingChildren, returnFiber, newIdx, step.value, expirationTime);
                if (_newFiber4 !== null) {
                    if (shouldTrackSideEffects) {
                        if (_newFiber4.alternate !== null) {
                            // The new fiber is a work in progress, but if there exists a current, that
                            // means that we reused the fiber. We need to delete it from the child list so
                            // that we don't add it to the deletion list.
                            existingChildren['delete'](_newFiber4.key === null
                                ? newIdx
                                : _newFiber4.key);
                        }
                    }
                    lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);
                    if (previousNewFiber === null) {
                        resultingFirstChild = _newFiber4;
                    } else {
                        previousNewFiber.sibling = _newFiber4;
                    }
                    previousNewFiber = _newFiber4;
                }
            }

            if (shouldTrackSideEffects) {
                // Any existing children that weren't consumed above were deleted. We need to
                // add them to the deletion list.
                existingChildren
                    .forEach(function (child) {
                        return deleteChild(returnFiber, child);
                    });
            }

            return resultingFirstChild;
        }

        function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, expirationTime) {
            // There's no need to check for keys on text nodes since we don't have a way to
            // define them.
            if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
                // We already have an existing node so let's just update it and delete the rest.
                deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
                var existing = useFiber(currentFirstChild, textContent, expirationTime);
                existing['return'] = returnFiber;
                return existing;
            }
            // The existing first child is not a text node so we need to create one and
            // delete the existing ones.
            deleteRemainingChildren(returnFiber, currentFirstChild);
            var created = createFiberFromText(textContent, returnFiber.internalContextTag, expirationTime);
            created['return'] = returnFiber;
            return created;
        }

        function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
            var key = element.key;
            var child = currentFirstChild;
            while (child !== null) {
                // TODO: If key === null and child.key === null, then this only applies to the
                // first item in the list.
                if (child.key === key) {
                    if (child.tag === Fragment
                        ? element.type === REACT_FRAGMENT_TYPE
                        : child.type === element.type) {
                        deleteRemainingChildren(returnFiber, child.sibling);
                        var existing = useFiber(child, element.type === REACT_FRAGMENT_TYPE
                            ? element.props.children
                            : element.props, expirationTime);
                        existing.ref = coerceRef(child, element);
                        existing['return'] = returnFiber;
                        {
                            existing._debugSource = element._source;
                            existing._debugOwner = element._owner;
                        }
                        return existing;
                    } else {
                        deleteRemainingChildren(returnFiber, child);
                        break;
                    }
                } else {
                    deleteChild(returnFiber, child);
                }
                child = child.sibling;
            }

            if (element.type === REACT_FRAGMENT_TYPE) {
                var created = createFiberFromFragment(element.props.children, returnFiber.internalContextTag, expirationTime, element.key);
                created['return'] = returnFiber;
                return created;
            } else {
                var _created7 = createFiberFromElement(element, returnFiber.internalContextTag, expirationTime);
                _created7.ref = coerceRef(currentFirstChild, element);
                _created7['return'] = returnFiber;
                return _created7;
            }
        }

        function reconcileSingleCall(returnFiber, currentFirstChild, call, expirationTime) {
            var key = call.key;
            var child = currentFirstChild;
            while (child !== null) {
                // TODO: If key === null and child.key === null, then this only applies to the
                // first item in the list.
                if (child.key === key) {
                    if (child.tag === CallComponent) {
                        deleteRemainingChildren(returnFiber, child.sibling);
                        var existing = useFiber(child, call, expirationTime);
                        existing['return'] = returnFiber;
                        return existing;
                    } else {
                        deleteRemainingChildren(returnFiber, child);
                        break;
                    }
                } else {
                    deleteChild(returnFiber, child);
                }
                child = child.sibling;
            }

            var created = createFiberFromCall(call, returnFiber.internalContextTag, expirationTime);
            created['return'] = returnFiber;
            return created;
        }

        function reconcileSingleReturn(returnFiber, currentFirstChild, returnNode, expirationTime) {
            // There's no need to check for keys on yields since they're stateless.
            var child = currentFirstChild;
            if (child !== null) {
                if (child.tag === ReturnComponent) {
                    deleteRemainingChildren(returnFiber, child.sibling);
                    var existing = useFiber(child, null, expirationTime);
                    existing.type = returnNode.value;
                    existing['return'] = returnFiber;
                    return existing;
                } else {
                    deleteRemainingChildren(returnFiber, child);
                }
            }

            var created = createFiberFromReturn(returnNode, returnFiber.internalContextTag, expirationTime);
            created.type = returnNode.value;
            created['return'] = returnFiber;
            return created;
        }

        function reconcileSinglePortal(returnFiber, currentFirstChild, portal, expirationTime) {
            var key = portal.key;
            var child = currentFirstChild;
            while (child !== null) {
                // TODO: If key === null and child.key === null, then this only applies to the
                // first item in the list.
                if (child.key === key) {
                    if (child.tag === HostPortal && child.stateNode.containerInfo === portal.containerInfo && child.stateNode.implementation === portal.implementation) {
                        deleteRemainingChildren(returnFiber, child.sibling);
                        var existing = useFiber(child, portal.children || [], expirationTime);
                        existing['return'] = returnFiber;
                        return existing;
                    } else {
                        deleteRemainingChildren(returnFiber, child);
                        break;
                    }
                } else {
                    deleteChild(returnFiber, child);
                }
                child = child.sibling;
            }

            var created = createFiberFromPortal(portal, returnFiber.internalContextTag, expirationTime);
            created['return'] = returnFiber;
            return created;
        }

        // This API will tag the children with the side-effect of the reconciliation
        // itself. They will be added to the side-effect list as we pass through the
        // children and the parent.
        function reconcileChildFibers(returnFiber, currentFirstChild, newChild, expirationTime) {
            // This function is not recursive. If the top level item is an array, we treat
            // it as a set of children, not as a fragment. Nested arrays on the other hand
            // will be treated as fragment nodes. Recursion happens at the normal flow.
            // Handle top level unkeyed fragments as if they were arrays. This leads to an
            // ambiguity between <>{[...]}</> and <>...</>. We treat the ambiguous cases
            // above the same.
            if (enableReactFragment && typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null) {
                newChild = newChild.props.children;
            }

            // Handle object types
            var isObject = typeof newChild === 'object' && newChild !== null;

            if (isObject) {
                switch (newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, expirationTime));

                    case REACT_CALL_TYPE:
                        return placeSingleChild(reconcileSingleCall(returnFiber, currentFirstChild, newChild, expirationTime));
                    case REACT_RETURN_TYPE:
                        return placeSingleChild(reconcileSingleReturn(returnFiber, currentFirstChild, newChild, expirationTime));
                    case REACT_PORTAL_TYPE:
                        return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, expirationTime));
                }
            }

            if (typeof newChild === 'string' || typeof newChild === 'number') {
                return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, expirationTime));
            }

            if (isArray$1(newChild)) {
                return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, expirationTime);
            }

            if (getIteratorFn(newChild)) {
                return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, expirationTime);
            }

            if (isObject) {
                throwOnInvalidObjectType(returnFiber, newChild);
            }

            {
                if(typeof newChild === 'function') {
                    warnOnFunctionType();
                }
            }
            if (typeof newChild === 'undefined') {
                // If the new child is undefined, and the return fiber is a composite component,
                // throw an error. If Fiber return types are disabled, we already threw above.
                switch (returnFiber.tag) {
                    case ClassComponent:
                        {
                            {
                                var instance = returnFiber.stateNode;
                                if (instance.render._isMockFunction) {
                                    // We allow auto-mocks to proceed as if they're returning null.
                                    break;
                                }
                            }
                        }
                        // Intentionally fall through to the next case, which handles both functions and
                        // classes eslint-disable-next-lined no-fallthrough
                    case FunctionalComponent:
                        {
                            var Component = returnFiber.type;
                            invariant_1$1(false, '%s(...): Nothing was returned from render. This usually means a return statement' +
                                    ' is missing. Or, to render nothing, return null.',
                            Component.displayName || Component.name || 'Component');
                        }
                }
            }

            // Remaining cases are all treated as empty.
            return deleteRemainingChildren(returnFiber, currentFirstChild);
        }

        return reconcileChildFibers;
    }

    var reconcileChildFibers = ChildReconciler(true, true);

    var reconcileChildFibersInPlace = ChildReconciler(false, true);

    var mountChildFibersInPlace = ChildReconciler(false, false);

    function cloneChildFibers(current, workInProgress) {
        !(current === null || workInProgress.child === current.child)
            ? invariant_1$1(false, 'Resuming work not yet implemented.')
            : void 0;

        if (workInProgress.child === null) {
            return;
        }

        var currentChild = workInProgress.child;
        var newChild = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
        workInProgress.child = newChild;

        newChild['return'] = workInProgress;
        while (currentChild.sibling !== null) {
            currentChild = currentChild.sibling;
            newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
            newChild['return'] = workInProgress;
        }
        newChild.sibling = null;
    }

    {
        var warnedAboutStatelessRefs = {};
    }

    var ReactFiberBeginWork = function (config, hostContext, hydrationContext, scheduleWork, computeExpirationForFiber) {
        var shouldSetTextContent = config.shouldSetTextContent,
            useSyncScheduling = config.useSyncScheduling,
            shouldDeprioritizeSubtree = config.shouldDeprioritizeSubtree;
        var pushHostContext = hostContext.pushHostContext,
            pushHostContainer = hostContext.pushHostContainer;
        var enterHydrationState = hydrationContext.enterHydrationState,
            resetHydrationState = hydrationContext.resetHydrationState,
            tryToClaimNextHydratableInstance = hydrationContext.tryToClaimNextHydratableInstance;

        var _ReactFiberClassCompo = ReactFiberClassComponent(scheduleWork, computeExpirationForFiber, memoizeProps, memoizeState),
            adoptClassInstance = _ReactFiberClassCompo.adoptClassInstance,
            constructClassInstance = _ReactFiberClassCompo.constructClassInstance,
            mountClassInstance = _ReactFiberClassCompo.mountClassInstance,
            updateClassInstance = _ReactFiberClassCompo.updateClassInstance;

        // TODO: Remove this and use reconcileChildrenAtExpirationTime directly.

        function reconcileChildren(current, workInProgress, nextChildren) {
            reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, workInProgress.expirationTime);
        }

        function reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, renderExpirationTime) {
            if (current === null) {
                // If this is a fresh new component that hasn't been rendered yet, we won't
                // update its child set by applying minimal side-effects. Instead, we will add
                // them all to the child before it gets rendered. That means we can optimize
                // this reconciliation pass by not tracking side-effects.
                workInProgress.child = mountChildFibersInPlace(workInProgress, workInProgress.child, nextChildren, renderExpirationTime);
            } else if (current.child === workInProgress.child) {
                // If the current child is the same as the work in progress, it means that we
                // haven't yet started any work on these children. Therefore, we use the clone
                // algorithm to create a copy of all the current children. If we had any
                // progressed work already, that is invalid at this point so let's throw it out.
                workInProgress.child = reconcileChildFibers(workInProgress, workInProgress.child, nextChildren, renderExpirationTime);
            } else {
                // If, on the other hand, it is already using a clone, that means we've already
                // begun some work on this tree and we can continue where we left off by
                // reconciling against the existing children.
                workInProgress.child = reconcileChildFibersInPlace(workInProgress, workInProgress.child, nextChildren, renderExpirationTime);
            }
        }

        function updateFragment(current, workInProgress) {
            var nextChildren = workInProgress.pendingProps;
            if (hasContextChanged()) {
                // Normally we can bail out on props equality but if context has changed we
                // don't do the bailout and we have to reuse existing props instead.
                if (nextChildren === null) {
                    nextChildren = workInProgress.memoizedProps;
                }
            } else if (nextChildren === null || workInProgress.memoizedProps === nextChildren) {
                return bailoutOnAlreadyFinishedWork(current, workInProgress);
            }
            reconcileChildren(current, workInProgress, nextChildren);
            memoizeProps(workInProgress, nextChildren);
            return workInProgress.child;
        }

        function markRef(current, workInProgress) {
            var ref = workInProgress.ref;
            if (ref !== null && (!current || current.ref !== ref)) {
                // Schedule a Ref effect
                workInProgress.effectTag |= Ref;
            }
        }

        function updateFunctionalComponent(current, workInProgress) {
            var fn = workInProgress.type;
            var nextProps = workInProgress.pendingProps;

            var memoizedProps = workInProgress.memoizedProps;
            if (hasContextChanged()) {
                // Normally we can bail out on props equality but if context has changed we
                // don't do the bailout and we have to reuse existing props instead.
                if (nextProps === null) {
                    nextProps = memoizedProps;
                }
            } else {
                if (nextProps === null || memoizedProps === nextProps) {
                    return bailoutOnAlreadyFinishedWork(current, workInProgress);
                }
                // TODO: consider bringing fn.shouldComponentUpdate() back. It used to be here.
            }

            var unmaskedContext = getUnmaskedContext(workInProgress);
            var context = getMaskedContext(workInProgress, unmaskedContext);

            var nextChildren;

            {
                ReactCurrentOwner.current = workInProgress;
                ReactDebugCurrentFiber.setCurrentPhase('render');
                nextChildren = fn(nextProps, context);
                ReactDebugCurrentFiber.setCurrentPhase(null);
            }
            // React DevTools reads this flag.
            workInProgress.effectTag |= PerformedWork;
            reconcileChildren(current, workInProgress, nextChildren);
            memoizeProps(workInProgress, nextProps);
            return workInProgress.child;
        }

        function updateClassComponent(current, workInProgress, renderExpirationTime) {
            // Push context providers early to prevent context stack mismatches. During
            // mounting we don't know the child context yet as the instance doesn't exist.
            // We will invalidate the child context in finishClassComponent() right after
            // rendering.
            var hasContext = pushContextProvider(workInProgress);

            var shouldUpdate = void 0;
            if (current === null) {
                if (!workInProgress.stateNode) {
                    // In the initial pass we might need to construct the instance.
                    constructClassInstance(workInProgress, workInProgress.pendingProps);
                    mountClassInstance(workInProgress, renderExpirationTime);
                    shouldUpdate = true;
                } else {
                    invariant_1$1(false, 'Resuming work not yet implemented.');
                    // In a resume, we'll already have an instance we can reuse. shouldUpdate =
                    // resumeMountClassInstance(workInProgress, renderExpirationTime);
                }
            } else {
                shouldUpdate = updateClassInstance(current, workInProgress, renderExpirationTime);
            }
            return finishClassComponent(current, workInProgress, shouldUpdate, hasContext);
        }

        function finishClassComponent(current, workInProgress, shouldUpdate, hasContext) {
            // Refs should update even if shouldComponentUpdate returns false
            markRef(current, workInProgress);

            if (!shouldUpdate) {
                // Context providers should defer to sCU for rendering
                if (hasContext) {
                    invalidateContextProvider(workInProgress, false);
                }

                return bailoutOnAlreadyFinishedWork(current, workInProgress);
            }

            var instance = workInProgress.stateNode;

            // Rerender
            ReactCurrentOwner.current = workInProgress;
            var nextChildren = void 0;
            {
                ReactDebugCurrentFiber.setCurrentPhase('render');
                nextChildren = instance.render();
                ReactDebugCurrentFiber.setCurrentPhase(null);
            }
            // React DevTools reads this flag.
            workInProgress.effectTag |= PerformedWork;
            reconcileChildren(current, workInProgress, nextChildren);
            // Memoize props and state using the values we just used to render.
            // TODO: Restructure so we never read values from the instance.
            memoizeState(workInProgress, instance.state);
            memoizeProps(workInProgress, instance.props);

            // The context might have changed so we need to recalculate it.
            if (hasContext) {
                invalidateContextProvider(workInProgress, true);
            }

            return workInProgress.child;
        }

        function pushHostRootContext(workInProgress) {
            var root = workInProgress.stateNode;
            if (root.pendingContext) {
                pushTopLevelContextObject(workInProgress, root.pendingContext, root.pendingContext !== root.context);
            } else if (root.context) {
                // Should always be set
                pushTopLevelContextObject(workInProgress, root.context, false);
            }
            pushHostContainer(workInProgress, root.containerInfo);
        }

        function updateHostRoot(current, workInProgress, renderExpirationTime) {
            pushHostRootContext(workInProgress);
            var updateQueue = workInProgress.updateQueue;
            if (updateQueue !== null) {
                var prevState = workInProgress.memoizedState;
                var state = processUpdateQueue(current, workInProgress, updateQueue, null, null, renderExpirationTime);
                if (prevState === state) {
                    // If the state is the same as before, that's a bailout because we had no work
                    // that expires at this time.
                    resetHydrationState();
                    return bailoutOnAlreadyFinishedWork(current, workInProgress);
                }
                var element = state.element;
                var root = workInProgress.stateNode;
                if ((current === null || current.child === null) && root.hydrate && enterHydrationState(workInProgress)) {
                    // If we don't have any current children this might be the first pass. We always
                    // try to hydrate. If this isn't a hydration pass there won't be any children to
                    // hydrate which is effectively the same thing as not hydrating. This is a bit
                    // of a hack. We track the host root as a placement to know that we're currently
                    // in a mounting state. That way isMounted works as expected. We must reset this
                    // before committing.
                    // TODO: Delete this when we delete isMounted and findDOMNode.
                    workInProgress.effectTag |= Placement;

                    // Ensure that children mount into this root without tracking side-effects. This
                    // ensures that we don't store Placement effects on nodes that will be hydrated.
                    workInProgress.child = mountChildFibersInPlace(workInProgress, workInProgress.child, element, renderExpirationTime);
                } else {
                    // Otherwise reset hydration state in case we aborted and resumed another root.
                    resetHydrationState();
                    reconcileChildren(current, workInProgress, element);
                }
                memoizeState(workInProgress, state);
                return workInProgress.child;
            }
            resetHydrationState();
            // If there is no update queue, that's a bailout because the root has no props.
            return bailoutOnAlreadyFinishedWork(current, workInProgress);
        }

        function updateHostComponent(current, workInProgress, renderExpirationTime) {
            pushHostContext(workInProgress);

            if (current === null) {
                tryToClaimNextHydratableInstance(workInProgress);
            }

            var type = workInProgress.type;
            var memoizedProps = workInProgress.memoizedProps;
            var nextProps = workInProgress.pendingProps;
            if (nextProps === null) {
                nextProps = memoizedProps;
                !(nextProps !== null)
                    ? invariant_1$1(false, 'We should always have pending or current props. This error is likely caused by a' +
                            ' bug in React. Please file an issue.')
                    : void 0;
            }
            var prevProps = current !== null
                ? current.memoizedProps
                : null;

            if (hasContextChanged()) {
                // Normally we can bail out on props equality but if context has changed we
                // don't do the bailout and we have to reuse existing props instead.
            } else if (nextProps === null || memoizedProps === nextProps) {
                return bailoutOnAlreadyFinishedWork(current, workInProgress);
            }

            var nextChildren = nextProps.children;
            var isDirectTextChild = shouldSetTextContent(type, nextProps);

            if (isDirectTextChild) {
                // We special case a direct text child of a host node. This is a common case. We
                // won't handle it as a reified child. We will instead handle this in the host
                // environment that also have access to this prop. That avoids allocating
                // another HostText fiber and traversing it.
                nextChildren = null;
            } else if (prevProps && shouldSetTextContent(type, prevProps)) {
                // If we're switching from a direct text child to a normal child, or to empty,
                // we need to schedule the text content to be reset.
                workInProgress.effectTag |= ContentReset;
            }

            markRef(current, workInProgress);

            // Check the host config to see if the children are offscreen/hidden.
            if (renderExpirationTime !== Never && !useSyncScheduling && shouldDeprioritizeSubtree(type, nextProps)) {
                // Down-prioritize the children.
                workInProgress.expirationTime = Never;
                // Bailout and come back to this fiber later.
                return null;
            }

            reconcileChildren(current, workInProgress, nextChildren);
            memoizeProps(workInProgress, nextProps);
            return workInProgress.child;
        }

        function updateHostText(current, workInProgress) {
            if (current === null) {
                tryToClaimNextHydratableInstance(workInProgress);
            }
            var nextProps = workInProgress.pendingProps;
            if (nextProps === null) {
                nextProps = workInProgress.memoizedProps;
            }
            memoizeProps(workInProgress, nextProps);
            // Nothing to do here. This is terminal. We'll do the completion step
            // immediately after.
            return null;
        }

        function mountIndeterminateComponent(current, workInProgress, renderExpirationTime) {
            !(current === null)
                ? invariant_1$1(false, 'An indeterminate component should never have mounted. This error is likely cause' +
                        'd by a bug in React. Please file an issue.')
                : void 0;
            var fn = workInProgress.type;
            var props = workInProgress.pendingProps;
            var unmaskedContext = getUnmaskedContext(workInProgress);
            var context = getMaskedContext(workInProgress, unmaskedContext);

            var value;

            {
                if (fn.prototype && typeof fn.prototype.render === 'function') {
                    var componentName = getComponentName(workInProgress);
                    warning_1$1(false, "The <%s /> component appears to have a render method, but doesn't extend React.C" +
                            "omponent. " + 'This is likely to cause errors. Change %s to extend React.Compone" +
                            "nt instead.', componentName, componentName);
      }
      ReactCurrentOwner.cur" +
                            "rent = workInProgress;
      value = fn(props, context);
    }
    // React DevT" +
                            "ools reads this flag.
    workInProgress.effectTag |= PerformedWork;

    if (ty" +
                            "peof value === 'object' && value !== null && typeof value.render === 'function')" +
                            " {
      // Proceed under the assumption that this is a class instance
      wor" +
                            "kInProgress.tag = ClassComponent;

      // Push context providers early to prev" +
                            "ent context stack mismatches.
      // During mounting we don't know the child c" +
                            "ontext yet as the instance doesn't exist.
      // We will invalidate the child " +
                            "context in finishClassComponent() right after rendering.
      var hasContext = " +
                            "pushContextProvider(workInProgress);
      adoptClassInstance(workInProgress, va" +
                            "lue);
      mountClassInstance(workInProgress, renderExpirationTime);
      retu" +
                            "rn finishClassComponent(current, workInProgress, true, hasContext);
    } else {" +
                            "
      // Proceed under the assumption that this is a functional component
     " +
                            " workInProgress.tag = FunctionalComponent;
      {
        var Component = workI" +
                            "nProgress.type;

        if (Component) {
          warning_1$1(!Component.child" +
                            "ContextTypes, '%s(...): childContextTypes cannot be defined on a functional comp" +
                            "onent.', Component.displayName || Component.name || 'Component');
        }
    " +
                            "    if (workInProgress.ref !== null) {
          var info = '';
          var ow" +
                            "nerName = ReactDebugCurrentFiber.getCurrentFiberOwnerName();
          if (owner" +
                            "Name) {
            info += '\n\nCheck the render method of `' + ownerName + '`." +
                            "';
          }

          var warningKey = ownerName || workInProgress._debugID " +
                            "|| '';
          var debugSource = workInProgress._debugSource;
          if (de" +
                            "bugSource) {
            warningKey = debugSource.fileName + ':' + debugSource.l" +
                            "ineNumber;
          }
          if (!warnedAboutStatelessRefs[warningKey]) {
  " +
                            "          warnedAboutStatelessRefs[warningKey] = true;
            warning_1$1(f" +
                            "alse, 'Stateless function components cannot be given refs. ' + 'Attempts to acce" +
                            "ss this ref will fail.%s%s', info, ReactDebugCurrentFiber.getCurrentFiberStackAd" +
                            "dendum());
          }
        }
      }
      reconcileChildren(current, workIn" +
                            "Progress, value);
      memoizeProps(workInProgress, props);
      return workIn" +
                            "Progress.child;
    }
  }

  function updateCallComponent(current, workInProgres" +
                            "s, renderExpirationTime) {
    var nextCall = workInProgress.pendingProps;
    i" +
                            "f (hasContextChanged()) {
      // Normally we can bail out on props equality bu" +
                            "t if context has changed
      // we don't do the bailout and we have to reuse e" +
                            "xisting props instead.
      if (nextCall === null) {
        nextCall = current" +
                            " && current.memoizedProps;
        !(nextCall !== null) ? invariant_1$1(false, '" +
                            "We should always have pending or current props. This error is likely caused by a" +
                            " bug in React. Please file an issue.') : void 0;
      }
    } else if (nextCall" +
                            " === null || workInProgress.memoizedProps === nextCall) {
      nextCall = workI" +
                            "nProgress.memoizedProps;
      // TODO: When bailing out, we might need to retur" +
                            "n the stateNode instead
      // of the child. To check it for work.
      // re" +
                            "turn bailoutOnAlreadyFinishedWork(current, workInProgress);
    }

    var nextC" +
                            "hildren = nextCall.children;

    // The following is a fork of reconcileChildre" +
                            "nAtExpirationTime but using
    // stateNode to store the child.
    if (current" +
                            " === null) {
      workInProgress.stateNode = mountChildFibersInPlace(workInProg" +
                            "ress, workInProgress.stateNode, nextChildren, renderExpirationTime);
    } else " +
                            "if (current.child === workInProgress.child) {
      workInProgress.stateNode = r" +
                            "econcileChildFibers(workInProgress, workInProgress.stateNode, nextChildren, rend" +
                            "erExpirationTime);
    } else {
      workInProgress.stateNode = reconcileChildF" +
                            "ibersInPlace(workInProgress, workInProgress.stateNode, nextChildren, renderExpir" +
                            "ationTime);
    }

    memoizeProps(workInProgress, nextCall);
    // This doesn" +
                            "'t take arbitrary time so we could synchronously just begin
    // eagerly do th" +
                            "e work of workInProgress.child as an optimization.
    return workInProgress.sta" +
                            "teNode;
  }

  function updatePortalComponent(current, workInProgress, renderExp" +
                            "irationTime) {
    pushHostContainer(workInProgress, workInProgress.stateNode.co" +
                            "ntainerInfo);
    var nextChildren = workInProgress.pendingProps;
    if (hasCon" +
                            "textChanged()) {
      // Normally we can bail out on props equality but if cont" +
                            "ext has changed
      // we don't do the bailout and we have to reuse existing p" +
                            "rops instead.
      if (nextChildren === null) {
        nextChildren = current " +
                            "&& current.memoizedProps;
        !(nextChildren != null) ? invariant_1$1(false," +
                            " 'We should always have pending or current props. This error is likely caused by" +
                            " a bug in React. Please file an issue.') : void 0;
      }
    } else if (nextCh" +
                            "ildren === null || workInProgress.memoizedProps === nextChildren) {
      return" +
                            " bailoutOnAlreadyFinishedWork(current, workInProgress);
    }

    if (current =" +
                            "== null) {
      // Portals are special because we don't append the children dur" +
                            "ing mount
      // but at commit. Therefore we need to track insertions which th" +
                            "e normal
      // flow doesn't do during mount. This doesn't happen at the root " +
                            "because
      // the root always starts with a "current" with a null child.
    " +
                            "  // TODO: Consider unifying this with how the root works.
      workInProgress." +
                            "child = reconcileChildFibersInPlace(workInProgress, workInProgress.child, nextCh" +
                            "ildren, renderExpirationTime);
      memoizeProps(workInProgress, nextChildren);" +
                            "
    } else {
      reconcileChildren(current, workInProgress, nextChildren);
  " +
                            "    memoizeProps(workInProgress, nextChildren);
    }
    return workInProgress." +
                            "child;
  }

  /*
  function reuseChildrenEffects(returnFiber : Fiber, firstChild" +
                            " : Fiber) {
    let child = firstChild;
    do {
      // Ensure that the first " +
                            "and last effect of the parent corresponds
      // to the children's first and l" +
                            "ast effect.
      if (!returnFiber.firstEffect) {
        returnFiber.firstEffec" +
                            "t = child.firstEffect;
      }
      if (child.lastEffect) {
        if (returnF" +
                            "iber.lastEffect) {
          returnFiber.lastEffect.nextEffect = child.firstEffe" +
                            "ct;
        }
        returnFiber.lastEffect = child.lastEffect;
      }
    } w" +
                            "hile (child = child.sibling);
  }
  */

  function bailoutOnAlreadyFinishedWork(" +
                            "current, workInProgress) {
    cancelWorkTimer(workInProgress);

    // TODO: We" +
                            " should ideally be able to bail out early if the children have no
    // more wo" +
                            "rk to do. However, since we don't have a separation of this
    // Fiber's prior" +
                            "ity and its children yet - we don't know without doing lots
    // of the same w" +
                            "ork we do anyway. Once we have that separation we can just
    // bail out here " +
                            "if the children has no more work at this priority level.
    // if (workInProgre" +
                            "ss.priorityOfChildren <= priorityLevel) {
    //   // If there are side-effects " +
                            "in these children that have not yet been
    //   // committed we need to ensure" +
                            " that they get properly transferred up.
    //   if (current && current.child !=" +
                            "= workInProgress.child) {
    //     reuseChildrenEffects(workInProgress, child)" +
                            ";
    //   }
    //   return null;
    // }

    cloneChildFibers(current, workI" +
                            "nProgress);
    return workInProgress.child;
  }

  function bailoutOnLowPriorit" +
                            "y(current, workInProgress) {
    cancelWorkTimer(workInProgress);

    // TODO: " +
                            "Handle HostComponent tags here as well and call pushHostContext()?
    // See PR" +
                            " 8590 discussion for context
    switch (workInProgress.tag) {
      case HostRo" +
                            "ot:
        pushHostRootContext(workInProgress);
        break;
      case Class" +
                            "Component:
        pushContextProvider(workInProgress);
        break;
      cas" +
                            "e HostPortal:
        pushHostContainer(workInProgress, workInProgress.stateNode" +
                            ".containerInfo);
        break;
    }
    // TODO: What if this is currently in " +
                            "progress?
    // How can that happen? How is this not being cloned?
    return n" +
                            "ull;
  }

  // TODO: Delete memoizeProps/State and move to reconcile/bailout ins" +
                            "tead
  function memoizeProps(workInProgress, nextProps) {
    workInProgress.mem" +
                            "oizedProps = nextProps;
  }

  function memoizeState(workInProgress, nextState) " +
                            "{
    workInProgress.memoizedState = nextState;
    // Don't reset the updateQue" +
                            "ue, in case there are pending updates. Resetting
    // is handled by processUpd" +
                            "ateQueue.
  }

  function beginWork(current, workInProgress, renderExpirationTim" +
                            "e) {
    if (workInProgress.expirationTime === NoWork || workInProgress.expirati" +
                            "onTime > renderExpirationTime) {
      return bailoutOnLowPriority(current, work" +
                            "InProgress);
    }

    switch (workInProgress.tag) {
      case IndeterminateCo" +
                            "mponent:
        return mountIndeterminateComponent(current, workInProgress, ren" +
                            "derExpirationTime);
      case FunctionalComponent:
        return updateFunctio" +
                            "nalComponent(current, workInProgress);
      case ClassComponent:
        return" +
                            " updateClassComponent(current, workInProgress, renderExpirationTime);
      case" +
                            " HostRoot:
        return updateHostRoot(current, workInProgress, renderExpirati" +
                            "onTime);
      case HostComponent:
        return updateHostComponent(current, w" +
                            "orkInProgress, renderExpirationTime);
      case HostText:
        return update" +
                            "HostText(current, workInProgress);
      case CallHandlerPhase:
        // This " +
                            "is a restart. Reset the tag to the initial phase.
        workInProgress.tag = C" +
                            "allComponent;
      // Intentionally fall through since this is now the same.
  " +
                            "    case CallComponent:
        return updateCallComponent(current, workInProgre" +
                            "ss, renderExpirationTime);
      case ReturnComponent:
        // A return compo" +
                            "nent is just a placeholder, we can just run through the
        // next one imme" +
                            "diately.
        return null;
      case HostPortal:
        return updatePortal" +
                            "Component(current, workInProgress, renderExpirationTime);
      case Fragment:
 " +
                            "       return updateFragment(current, workInProgress);
      default:
        in" +
                            "variant_1$1(false, 'Unknown unit of work tag. This error is likely caused by a b" +
                            "ug in React. Please file an issue.');
    }
  }

  function beginFailedWork(curr" +
                            "ent, workInProgress, renderExpirationTime) {
    // Push context providers here " +
                            "to avoid a push/pop context mismatch.
    switch (workInProgress.tag) {
      ca" +
                            "se ClassComponent:
        pushContextProvider(workInProgress);
        break;
 " +
                            "     case HostRoot:
        pushHostRootContext(workInProgress);
        break;
" +
                            "      default:
        invariant_1$1(false, 'Invalid type of work. This error is" +
                            " likely caused by a bug in React. Please file an issue.');
    }

    // Add an " +
                            "error effect so we can handle the error during the commit phase
    workInProgre" +
                            "ss.effectTag |= Err;

    // This is a weird case where we do "resume" work â€” " +
                            "work that failed on
    // our first attempt. Because we no longer have a notion" +
                            " of "progressed
    // deletions," reset the child to the current child to make " +
                            "sure we delete
    // it again. TODO: Find a better way to handle this, perhaps " +
                            "during a more
    // general overhaul of error handling.
    if (current === nul" +
                            "l) {
      workInProgress.child = null;
    } else if (workInProgress.child !== " +
                            "current.child) {
      workInProgress.child = current.child;
    }

    if (work" +
                            "InProgress.expirationTime === NoWork || workInProgress.expirationTime > renderEx" +
                            "pirationTime) {
      return bailoutOnLowPriority(current, workInProgress);
    " +
                            "}

    // If we don't bail out, we're going be recomputing our children so we ne" +
                            "ed
    // to drop our effect list.
    workInProgress.firstEffect = null;
    wo" +
                            "rkInProgress.lastEffect = null;

    // Unmount the current children as if the c" +
                            "omponent rendered null
    var nextChildren = null;
    reconcileChildrenAtExpir" +
                            "ationTime(current, workInProgress, nextChildren, renderExpirationTime);

    if " +
                            "(workInProgress.tag === ClassComponent) {
      var instance = workInProgress.st" +
                            "ateNode;
      workInProgress.memoizedProps = instance.props;
      workInProgre" +
                            "ss.memoizedState = instance.state;
    }

    return workInProgress.child;
  }

" +
                            "  return {
    beginWork: beginWork,
    beginFailedWork: beginFailedWork
  };
}" +
                            ";

var ReactFiberCompleteWork = function (config, hostContext, hydrationContext)" +
                            " {
  var createInstance = config.createInstance,
      createTextInstance = conf" +
                            "ig.createTextInstance,
      appendInitialChild = config.appendInitialChild,
   " +
                            "   finalizeInitialChildren = config.finalizeInitialChildren,
      prepareUpdate" +
                            " = config.prepareUpdate,
      mutation = config.mutation,
      persistence = c" +
                            "onfig.persistence;
  var getRootHostContainer = hostContext.getRootHostContainer" +
                            ",
      popHostContext = hostContext.popHostContext,
      getHostContext = host" +
                            "Context.getHostContext,
      popHostContainer = hostContext.popHostContainer;
 " +
                            " var prepareToHydrateHostInstance = hydrationContext.prepareToHydrateHostInstanc" +
                            "e,
      prepareToHydrateHostTextInstance = hydrationContext.prepareToHydrateHos" +
                            "tTextInstance,
      popHydrationState = hydrationContext.popHydrationState;


 " +
                            " function markUpdate(workInProgress) {
    // Tag the fiber with an update effec" +
                            "t. This turns a Placement into
    // an UpdateAndPlacement.
    workInProgress." +
                            "effectTag |= Update;
  }

  function markRef(workInProgress) {
    workInProgres" +
                            "s.effectTag |= Ref;
  }

  function appendAllReturns(returns, workInProgress) {
" +
                            "    var node = workInProgress.stateNode;
    if (node) {
      node['return'] = " +
                            "workInProgress;
    }
    while (node !== null) {
      if (node.tag === HostCom" +
                            "ponent || node.tag === HostText || node.tag === HostPortal) {
        invariant_" +
                            "1$1(false, 'A call cannot have host component children.');
      } else if (node" +
                            ".tag === ReturnComponent) {
        returns.push(node.type);
      } else if (no" +
                            "de.child !== null) {
        node.child['return'] = node;
        node = node.ch" +
                            "ild;
        continue;
      }
      while (node.sibling === null) {
        if " +
                            "(node['return'] === null || node['return'] === workInProgress) {
          retur" +
                            "n;
        }
        node = node['return'];
      }
      node.sibling['return']" +
                            " = node['return'];
      node = node.sibling;
    }
  }

  function moveCallToHa" +
                            "ndlerPhase(current, workInProgress, renderExpirationTime) {
    var call = workI" +
                            "nProgress.memoizedProps;
    !call ? invariant_1$1(false, 'Should be resolved by" +
                            " now. This error is likely caused by a bug in React. Please file an issue.') : v" +
                            "oid 0;

    // First step of the call has completed. Now we need to do the secon" +
                            "d.
    // TODO: It would be nice to have a multi stage call represented by a
   " +
                            " // single component, or at least tail call optimize nested ones. Currently
    " +
                            "// that requires additional fields that we don't want to add to the fiber.
    /" +
                            "/ So this requires nested handlers.
    // Note: This doesn't mutate the alterna" +
                            "te node. I don't think it needs to
    // since this stage is reset for every pa" +
                            "ss.
    workInProgress.tag = CallHandlerPhase;

    // Build up the returns.
   " +
                            " // TODO: Compare this to a generator or opaque helpers like Children.
    var r" +
                            "eturns = [];
    appendAllReturns(returns, workInProgress);
    var fn = call.ha" +
                            "ndler;
    var props = call.props;
    var nextChildren = fn(props, returns);

 " +
                            "   var currentFirstChild = current !== null ? current.child : null;
    workInPr" +
                            "ogress.child = reconcileChildFibers(workInProgress, currentFirstChild, nextChild" +
                            "ren, renderExpirationTime);
    return workInProgress.child;
  }

  function app" +
                            "endAllChildren(parent, workInProgress) {
    // We only have the top Fiber that " +
                            "was created but we need recurse down its
    // children to find all the termina" +
                            "l nodes.
    var node = workInProgress.child;
    while (node !== null) {
      " +
                            "if (node.tag === HostComponent || node.tag === HostText) {
        appendInitial" +
                            "Child(parent, node.stateNode);
      } else if (node.tag === HostPortal) {
     " +
                            "   // If we have a portal child, then we don't want to traverse
        // down " +
                            "its children. Instead, we'll get insertions from each child in
        // the po" +
                            "rtal directly.
      } else if (node.child !== null) {
        node.child['retur" +
                            "n'] = node;
        node = node.child;
        continue;
      }
      if (node " +
                            "=== workInProgress) {
        return;
      }
      while (node.sibling === null" +
                            ") {
        if (node['return'] === null || node['return'] === workInProgress) {
" +
                            "          return;
        }
        node = node['return'];
      }
      node.si" +
                            "bling['return'] = node['return'];
      node = node.sibling;
    }
  }

  var up" +
                            "dateHostContainer = void 0;
  var updateHostComponent = void 0;
  var updateHost" +
                            "Text = void 0;
  if (mutation) {
    if (enableMutatingReconciler) {
      // Mu" +
                            "tation mode
      updateHostContainer = function (workInProgress) {
        // N" +
                            "oop
      };
      updateHostComponent = function (current, workInProgress, upda" +
                            "tePayload, type, oldProps, newProps, rootContainerInstance) {
        // TODO: T" +
                            "ype this specific to this type of component.
        workInProgress.updateQueue " +
                            "= updatePayload;
        // If the update payload indicates that there is a chan" +
                            "ge or if there
        // is a new ref we mark this as an update. All the work i" +
                            "s done in commitWork.
        if (updatePayload) {
          markUpdate(workInPr" +
                            "ogress);
        }
      };
      updateHostText = function (current, workInProg" +
                            "ress, oldText, newText) {
        // If the text differs, mark it as an update. " +
                            "All the work in done in commitWork.
        if (oldText !== newText) {
         " +
                            " markUpdate(workInProgress);
        }
      };
    } else {
      invariant_1$1" +
                            "(false, 'Mutating reconciler is disabled.');
    }
  } else if (persistence) {
 " +
                            "   if (enablePersistentReconciler) {
      // Persistent host tree mode
      va" +
                            "r cloneInstance = persistence.cloneInstance,
          createContainerChildSet =" +
                            " persistence.createContainerChildSet,
          appendChildToContainerChildSet =" +
                            " persistence.appendChildToContainerChildSet,
          finalizeContainerChildren" +
                            " = persistence.finalizeContainerChildren;

      // An unfortunate fork of appen" +
                            "dAllChildren because we have two different parent types.

      var appendAllChi" +
                            "ldrenToContainer = function (containerChildSet, workInProgress) {
        // We " +
                            "only have the top Fiber that was created but we need recurse down its
        //" +
                            " children to find all the terminal nodes.
        var node = workInProgress.chil" +
                            "d;
        while (node !== null) {
          if (node.tag === HostComponent || n" +
                            "ode.tag === HostText) {
            appendChildToContainerChildSet(containerChil" +
                            "dSet, node.stateNode);
          } else if (node.tag === HostPortal) {
         " +
                            "   // If we have a portal child, then we don't want to traverse
            // d" +
                            "own its children. Instead, we'll get insertions from each child in
            /" +
                            "/ the portal directly.
          } else if (node.child !== null) {
            n" +
                            "ode.child['return'] = node;
            node = node.child;
            continue;" +
                            "
          }
          if (node === workInProgress) {
            return;
      " +
                            "    }
          while (node.sibling === null) {
            if (node['return'] =" +
                            "== null || node['return'] === workInProgress) {
              return;
          " +
                            "  }
            node = node['return'];
          }
          node.sibling['retur" +
                            "n'] = node['return'];
          node = node.sibling;
        }
      };
      up" +
                            "dateHostContainer = function (workInProgress) {
        var portalOrRoot = workI" +
                            "nProgress.stateNode;
        var childrenUnchanged = workInProgress.firstEffect " +
                            "=== null;
        if (childrenUnchanged) {
          // No changes, just reuse t" +
                            "he existing instance.
        } else {
          var container = portalOrRoot.co" +
                            "ntainerInfo;
          var newChildSet = createContainerChildSet(container);
   " +
                            "       if (finalizeContainerChildren(container, newChildSet)) {
            mark" +
                            "Update(workInProgress);
          }
          portalOrRoot.pendingChildren = new" +
                            "ChildSet;
          // If children might have changed, we have to add them all t" +
                            "o the set.
          appendAllChildrenToContainer(newChildSet, workInProgress);
" +
                            "          // Schedule an update on the container to swap out the container.
    " +
                            "      markUpdate(workInProgress);
        }
      };
      updateHostComponent =" +
                            " function (current, workInProgress, updatePayload, type, oldProps, newProps, roo" +
                            "tContainerInstance) {
        // If there are no effects associated with this no" +
                            "de, then none of our children had any updates.
        // This guarantees that w" +
                            "e can reuse all of them.
        var childrenUnchanged = workInProgress.firstEff" +
                            "ect === null;
        var currentInstance = current.stateNode;
        if (child" +
                            "renUnchanged && updatePayload === null) {
          // No changes, just reuse th" +
                            "e existing instance.
          // Note that this might release a previous clone." +
                            "
          workInProgress.stateNode = currentInstance;
        } else {
        " +
                            "  var recyclableInstance = workInProgress.stateNode;
          var newInstance =" +
                            " cloneInstance(currentInstance, updatePayload, type, oldProps, newProps, workInP" +
                            "rogress, childrenUnchanged, recyclableInstance);
          if (finalizeInitialCh" +
                            "ildren(newInstance, type, newProps, rootContainerInstance)) {
            markUp" +
                            "date(workInProgress);
          }
          workInProgress.stateNode = newInstan" +
                            "ce;
          if (childrenUnchanged) {
            // If there are no other effe" +
                            "cts in this tree, we need to flag this node as having one.
            // Even t" +
                            "hough we're not going to use it for anything.
            // Otherwise parents w" +
                            "on't know that there are new children to propagate upwards.
            markUpda" +
                            "te(workInProgress);
          } else {
            // If children might have cha" +
                            "nged, we have to add them all to the set.
            appendAllChildren(newInsta" +
                            "nce, workInProgress);
          }
        }
      };
      updateHostText = func" +
                            "tion (current, workInProgress, oldText, newText) {
        if (oldText !== newTe" +
                            "xt) {
          // If the text content differs, we'll create a new text instance" +
                            " for it.
          var rootContainerInstance = getRootHostContainer();
         " +
                            " var currentHostContext = getHostContext();
          workInProgress.stateNode =" +
                            " createTextInstance(newText, rootContainerInstance, currentHostContext, workInPr" +
                            "ogress);
          // We'll have to mark it as having an effect, even though we " +
                            "won't use the effect for anything.
          // This lets the parents know that " +
                            "at least one of their children has changed.
          markUpdate(workInProgress)" +
                            ";
        }
      };
    } else {
      invariant_1$1(false, 'Persistent reconci" +
                            "ler is disabled.');
    }
  } else {
    if (enableNoopReconciler) {
      // No" +
                            " host operations
      updateHostContainer = function (workInProgress) {
       " +
                            " // Noop
      };
      updateHostComponent = function (current, workInProgress," +
                            " updatePayload, type, oldProps, newProps, rootContainerInstance) {
        // No" +
                            "op
      };
      updateHostText = function (current, workInProgress, oldText, n" +
                            "ewText) {
        // Noop
      };
    } else {
      invariant_1$1(false, 'Noop" +
                            " reconciler is disabled.');
    }
  }

  function completeWork(current, workInPr" +
                            "ogress, renderExpirationTime) {
    // Get the latest props.
    var newProps = " +
                            "workInProgress.pendingProps;
    if (newProps === null) {
      newProps = workI" +
                            "nProgress.memoizedProps;
    } else if (workInProgress.expirationTime !== Never " +
                            "|| renderExpirationTime === Never) {
      // Reset the pending props, unless th" +
                            "is was a down-prioritization.
      workInProgress.pendingProps = null;
    }

 " +
                            "   switch (workInProgress.tag) {
      case FunctionalComponent:
        return " +
                            "null;
      case ClassComponent:
        {
          // We are leaving this subt" +
                            "ree, so pop context if any.
          popContextProvider(workInProgress);
      " +
                            "    return null;
        }
      case HostRoot:
        {
          popHostConta" +
                            "iner(workInProgress);
          popTopLevelContextObject(workInProgress);
      " +
                            "    var fiberRoot = workInProgress.stateNode;
          if (fiberRoot.pendingCon" +
                            "text) {
            fiberRoot.context = fiberRoot.pendingContext;
            fi" +
                            "berRoot.pendingContext = null;
          }

          if (current === null || cu" +
                            "rrent.child === null) {
            // If we hydrated, pop so that we can delete" +
                            " any remaining children
            // that weren't hydrated.
            popHyd" +
                            "rationState(workInProgress);
            // This resets the hacky state to fix i" +
                            "sMounted before committing.
            // TODO: Delete this when we delete isMo" +
                            "unted and findDOMNode.
            workInProgress.effectTag &= ~Placement;
     " +
                            "     }
          updateHostContainer(workInProgress);
          return null;
   " +
                            "     }
      case HostComponent:
        {
          popHostContext(workInProgre" +
                            "ss);
          var rootContainerInstance = getRootHostContainer();
          var" +
                            " type = workInProgress.type;
          if (current !== null && workInProgress.st" +
                            "ateNode != null) {
            // If we have an alternate, that means this is an" +
                            " update and we need to
            // schedule a side-effect to do the updates.
" +
                            "            var oldProps = current.memoizedProps;
            // If we get updat" +
                            "ed because one of our children updated, we don't
            // have newProps so" +
                            " we'll have to reuse them.
            // TODO: Split the update API as separate" +
                            " for the props vs. children.
            // Even better would be if children wer" +
                            "en't special cased at all tho.
            var instance = workInProgress.stateNo" +
                            "de;
            var currentHostContext = getHostContext();
            var updat" +
                            "ePayload = prepareUpdate(instance, type, oldProps, newProps, rootContainerInstan" +
                            "ce, currentHostContext);

            updateHostComponent(current, workInProgres" +
                            "s, updatePayload, type, oldProps, newProps, rootContainerInstance);

           " +
                            " if (current.ref !== workInProgress.ref) {
              markRef(workInProgress)" +
                            ";
            }
          } else {
            if (!newProps) {
              !(" +
                            "workInProgress.stateNode !== null) ? invariant_1$1(false, 'We must have new prop" +
                            "s for new mounts. This error is likely caused by a bug in React. Please file an " +
                            "issue.') : void 0;
              // This can happen when we abort work.
        " +
                            "      return null;
            }

            var _currentHostContext = getHostC" +
                            "ontext();
            // TODO: Move createInstance to beginWork and keep it on a" +
                            " context
            // "stack" as the parent. Then append children as we go in " +
                            "beginWork
            // or completeWork depending on we want to add then top->d" +
                            "own or
            // bottom->up. Top->down is faster in IE11.
            var w" +
                            "asHydrated = popHydrationState(workInProgress);
            if (wasHydrated) {
 " +
                            "             // TODO: Move this and createInstance step into the beginPhase
    " +
                            "          // to consolidate.
              if (prepareToHydrateHostInstance(work" +
                            "InProgress, rootContainerInstance, _currentHostContext)) {
                // If" +
                            " changes to the hydrated node needs to be applied at the
                // comm" +
                            "it-phase we mark this as such.
                markUpdate(workInProgress);
     " +
                            "         }
            } else {
              var _instance = createInstance(typ" +
                            "e, newProps, rootContainerInstance, _currentHostContext, workInProgress);

     " +
                            "         appendAllChildren(_instance, workInProgress);

              // Certain" +
                            " renderers require commit-time effects for initial mount.
              // (eg D" +
                            "OM renderer supports auto-focus for certain elements).
              // Make sur" +
                            "e such renderers get scheduled for later work.
              if (finalizeInitial" +
                            "Children(_instance, type, newProps, rootContainerInstance)) {
                ma" +
                            "rkUpdate(workInProgress);
              }
              workInProgress.stateNode" +
                            " = _instance;
            }

            if (workInProgress.ref !== null) {
    " +
                            "          // If there is a ref on a host node we need to schedule a callback
   " +
                            "           markRef(workInProgress);
            }
          }
          return n" +
                            "ull;
        }
      case HostText:
        {
          var newText = newProps;
" +
                            "          if (current && workInProgress.stateNode != null) {
            var old" +
                            "Text = current.memoizedProps;
            // If we have an alternate, that means" +
                            " this is an update and we need
            // to schedule a side-effect to do th" +
                            "e updates.
            updateHostText(current, workInProgress, oldText, newText)" +
                            ";
          } else {
            if (typeof newText !== 'string') {
            " +
                            "  !(workInProgress.stateNode !== null) ? invariant_1$1(false, 'We must have new " +
                            "props for new mounts. This error is likely caused by a bug in React. Please file" +
                            " an issue.') : void 0;
              // This can happen when we abort work.
    " +
                            "          return null;
            }
            var _rootContainerInstance = ge" +
                            "tRootHostContainer();
            var _currentHostContext2 = getHostContext();
 " +
                            "           var _wasHydrated = popHydrationState(workInProgress);
            if " +
                            "(_wasHydrated) {
              if (prepareToHydrateHostTextInstance(workInProgre" +
                            "ss)) {
                markUpdate(workInProgress);
              }
            }" +
                            " else {
              workInProgress.stateNode = createTextInstance(newText, _ro" +
                            "otContainerInstance, _currentHostContext2, workInProgress);
            }
      " +
                            "    }
          return null;
        }
      case CallComponent:
        return " +
                            "moveCallToHandlerPhase(current, workInProgress, renderExpirationTime);
      cas" +
                            "e CallHandlerPhase:
        // Reset the tag to now be a first phase call.
     " +
                            "   workInProgress.tag = CallComponent;
        return null;
      case ReturnCom" +
                            "ponent:
        // Does nothing.
        return null;
      case Fragment:
     " +
                            "   return null;
      case HostPortal:
        popHostContainer(workInProgress);" +
                            "
        updateHostContainer(workInProgress);
        return null;
      // Erro" +
                            "r cases
      case IndeterminateComponent:
        invariant_1$1(false, 'An inde" +
                            "terminate component should have become determinate before completing. This error" +
                            " is likely caused by a bug in React. Please file an issue.');
      // eslint-di" +
                            "sable-next-line no-fallthrough
      default:
        invariant_1$1(false, 'Unkn" +
                            "own unit of work tag. This error is likely caused by a bug in React. Please file" +
                            " an issue.');
    }
  }

  return {
    completeWork: completeWork
  };
};

var " +
                            "invokeGuardedCallback$2 = ReactErrorUtils.invokeGuardedCallback;
var hasCaughtEr" +
                            "ror$1 = ReactErrorUtils.hasCaughtError;
var clearCaughtError$1 = ReactErrorUtils" +
                            ".clearCaughtError;


var ReactFiberCommitWork = function (config, captureError) " +
                            "{
  var getPublicInstance = config.getPublicInstance,
      mutation = config.mu" +
                            "tation,
      persistence = config.persistence;


  var callComponentWillUnmount" +
                            "WithTimer = function (current, instance) {
    startPhaseTimer(current, 'compone" +
                            "ntWillUnmount');
    instance.props = current.memoizedProps;
    instance.state " +
                            "= current.memoizedState;
    instance.componentWillUnmount();
    stopPhaseTimer" +
                            "();
  };

  // Capture errors so they don't interrupt unmounting.
  function saf" +
                            "elyCallComponentWillUnmount(current, instance) {
    {
      invokeGuardedCallba" +
                            "ck$2(null, callComponentWillUnmountWithTimer, null, current, instance);
      if" +
                            " (hasCaughtError$1()) {
        var unmountError = clearCaughtError$1();
       " +
                            " captureError(current, unmountError);
      }
    }
  }

  function safelyDetach" +
                            "Ref(current) {
    var ref = current.ref;
    if (ref !== null) {
      {
      " +
                            "  invokeGuardedCallback$2(null, ref, null, null);
        if (hasCaughtError$1()" +
                            ") {
          var refError = clearCaughtError$1();
          captureError(curren" +
                            "t, refError);
        }
      }
    }
  }

  function commitLifeCycles(current, " +
                            "finishedWork) {
    switch (finishedWork.tag) {
      case ClassComponent:
     " +
                            "   {
          var instance = finishedWork.stateNode;
          if (finishedWork" +
                            ".effectTag & Update) {
            if (current === null) {
              startPh" +
                            "aseTimer(finishedWork, 'componentDidMount');
              instance.props = fini" +
                            "shedWork.memoizedProps;
              instance.state = finishedWork.memoizedStat" +
                            "e;
              instance.componentDidMount();
              stopPhaseTimer();
 " +
                            "           } else {
              var prevProps = current.memoizedProps;
       " +
                            "       var prevState = current.memoizedState;
              startPhaseTimer(fini" +
                            "shedWork, 'componentDidUpdate');
              instance.props = finishedWork.mem" +
                            "oizedProps;
              instance.state = finishedWork.memoizedState;
         " +
                            "     instance.componentDidUpdate(prevProps, prevState);
              stopPhaseT" +
                            "imer();
            }
          }
          var updateQueue = finishedWork.updat" +
                            "eQueue;
          if (updateQueue !== null) {
            commitCallbacks(update" +
                            "Queue, instance);
          }
          return;
        }
      case HostRoot:
 " +
                            "       {
          var _updateQueue = finishedWork.updateQueue;
          if (_u" +
                            "pdateQueue !== null) {
            var _instance = finishedWork.child !== null ?" +
                            " finishedWork.child.stateNode : null;
            commitCallbacks(_updateQueue, " +
                            "_instance);
          }
          return;
        }
      case HostComponent:
  " +
                            "      {
          var _instance2 = finishedWork.stateNode;

          // Rendere" +
                            "rs may schedule work to be done after host components are mounted
          // (" +
                            "eg DOM renderer may schedule auto-focus for inputs and form controls).
         " +
                            " // These effects should only be committed when components are first mounted,
  " +
                            "        // aka when there is no current/alternate.
          if (current === nul" +
                            "l && finishedWork.effectTag & Update) {
            var type = finishedWork.type" +
                            ";
            var props = finishedWork.memoizedProps;
            commitMount(_i" +
                            "nstance2, type, props, finishedWork);
          }

          return;
        }
 " +
                            "     case HostText:
        {
          // We have no life-cycles associated wit" +
                            "h text.
          return;
        }
      case HostPortal:
        {
          /" +
                            "/ We have no life-cycles associated with portals.
          return;
        }
  " +
                            "    default:
        {
          invariant_1$1(false, 'This unit of work tag sho" +
                            "uld not have side-effects. This error is likely caused by a bug in React. Please" +
                            " file an issue.');
        }
    }
  }

  function commitAttachRef(finishedWork)" +
                            " {
    var ref = finishedWork.ref;
    if (ref !== null) {
      var instance = " +
                            "finishedWork.stateNode;
      switch (finishedWork.tag) {
        case HostCompo" +
                            "nent:
          ref(getPublicInstance(instance));
          break;
        defau" +
                            "lt:
          ref(instance);
      }
    }
  }

  function commitDetachRef(curre" +
                            "nt) {
    var currentRef = current.ref;
    if (currentRef !== null) {
      cur" +
                            "rentRef(null);
    }
  }

  // User-originating errors (lifecycles and refs) sho" +
                            "uld not interrupt
  // deletion, so don't let them throw. Host-originating error" +
                            "s should
  // interrupt deletion, so it's okay
  function commitUnmount(current)" +
                            " {
    if (typeof onCommitUnmount === 'function') {
      onCommitUnmount(curren" +
                            "t);
    }

    switch (current.tag) {
      case ClassComponent:
        {
     " +
                            "     safelyDetachRef(current);
          var instance = current.stateNode;
     " +
                            "     if (typeof instance.componentWillUnmount === 'function') {
            safe" +
                            "lyCallComponentWillUnmount(current, instance);
          }
          return;
   " +
                            "     }
      case HostComponent:
        {
          safelyDetachRef(current);
 " +
                            "         return;
        }
      case CallComponent:
        {
          commitN" +
                            "estedUnmounts(current.stateNode);
          return;
        }
      case HostPor" +
                            "tal:
        {
          // TODO: this is recursive.
          // We are also no" +
                            "t using this parent because
          // the portal will get pushed immediately." +
                            "
          if (enableMutatingReconciler && mutation) {
            unmountHostCo" +
                            "mponents(current);
          } else if (enablePersistentReconciler && persistenc" +
                            "e) {
            emptyPortalContainer(current);
          }
          return;
  " +
                            "      }
    }
  }

  function commitNestedUnmounts(root) {
    // While we're in" +
                            "side a removed host node we don't want to call
    // removeChild on the inner n" +
                            "odes because they're removed by the top
    // call anyway. We also want to call" +
                            " componentWillUnmount on all
    // composites before this host node is removed " +
                            "from the tree. Therefore
    var node = root;
    while (true) {
      commitUnm" +
                            "ount(node);
      // Visit children because they may contain more composite or h" +
                            "ost nodes.
      // Skip portals because commitUnmount() currently visits them r" +
                            "ecursively.
      if (node.child !== null && (
      // If we use mutation we dr" +
                            "ill down into portals using commitUnmount above.
      // If we don't use mutati" +
                            "on we drill down into portals here instead.
      !mutation || node.tag !== Host" +
                            "Portal)) {
        node.child['return'] = node;
        node = node.child;
     " +
                            "   continue;
      }
      if (node === root) {
        return;
      }
      wh" +
                            "ile (node.sibling === null) {
        if (node['return'] === null || node['retur" +
                            "n'] === root) {
          return;
        }
        node = node['return'];
     " +
                            " }
      node.sibling['return'] = node['return'];
      node = node.sibling;
   " +
                            " }
  }

  function detachFiber(current) {
    // Cut off the return pointers to " +
                            "disconnect it from the tree. Ideally, we
    // should clear the child pointer o" +
                            "f the parent alternate to let this
    // get GC:ed but we don't know which for " +
                            "sure which parent is the current
    // one so we'll settle for GC:ing the subtr" +
                            "ee of this child. This child
    // itself will be GC:ed when the parent updates" +
                            " the next time.
    current['return'] = null;
    current.child = null;
    if (" +
                            "current.alternate) {
      current.alternate.child = null;
      current.alterna" +
                            "te['return'] = null;
    }
  }

  if (!mutation) {
    var commitContainer = voi" +
                            "d 0;
    if (persistence) {
      var replaceContainerChildren = persistence.rep" +
                            "laceContainerChildren,
          createContainerChildSet = persistence.createCon" +
                            "tainerChildSet;

      var emptyPortalContainer = function (current) {
        v" +
                            "ar portal = current.stateNode;
        var containerInfo = portal.containerInfo;" +
                            "

        var emptyChildSet = createContainerChildSet(containerInfo);
        re" +
                            "placeContainerChildren(containerInfo, emptyChildSet);
      };
      commitConta" +
                            "iner = function (finishedWork) {
        switch (finishedWork.tag) {
          c" +
                            "ase ClassComponent:
            {
              return;
            }
          " +
                            "case HostComponent:
            {
              return;
            }
          " +
                            "case HostText:
            {
              return;
            }
          case " +
                            "HostRoot:
          case HostPortal:
            {
              var portalOrRoo" +
                            "t = finishedWork.stateNode;
              var containerInfo = portalOrRoot.conta" +
                            "inerInfo,
                  _pendingChildren = portalOrRoot.pendingChildren;

  " +
                            "            replaceContainerChildren(containerInfo, _pendingChildren);
         " +
                            "     return;
            }
          default:
            {
              invari" +
                            "ant_1$1(false, 'This unit of work tag should not have side-effects. This error i" +
                            "s likely caused by a bug in React. Please file an issue.');
            }
      " +
                            "  }
      };
    } else {
      commitContainer = function (finishedWork) {
    " +
                            "    // Noop
      };
    }
    if (enablePersistentReconciler || enableNoopRecon" +
                            "ciler) {
      return {
        commitResetTextContent: function (finishedWork) " +
                            "{},
        commitPlacement: function (finishedWork) {},
        commitDeletion:" +
                            " function (current) {
          // Detach refs and call componentWillUnmount() o" +
                            "n the whole subtree.
          commitNestedUnmounts(current);
          detachFi" +
                            "ber(current);
        },
        commitWork: function (current, finishedWork) {
" +
                            "          commitContainer(finishedWork);
        },

        commitLifeCycles: c" +
                            "ommitLifeCycles,
        commitAttachRef: commitAttachRef,
        commitDetachR" +
                            "ef: commitDetachRef
      };
    } else if (persistence) {
      invariant_1$1(f" +
                            "alse, 'Persistent reconciler is disabled.');
    } else {
      invariant_1$1(fa" +
                            "lse, 'Noop reconciler is disabled.');
    }
  }
  var commitMount = mutation.com" +
                            "mitMount,
      commitUpdate = mutation.commitUpdate,
      resetTextContent = m" +
                            "utation.resetTextContent,
      commitTextUpdate = mutation.commitTextUpdate,
  " +
                            "    appendChild = mutation.appendChild,
      appendChildToContainer = mutation." +
                            "appendChildToContainer,
      insertBefore = mutation.insertBefore,
      insert" +
                            "InContainerBefore = mutation.insertInContainerBefore,
      removeChild = mutati" +
                            "on.removeChild,
      removeChildFromContainer = mutation.removeChildFromContain" +
                            "er;


  function getHostParentFiber(fiber) {
    var parent = fiber['return'];
 " +
                            "   while (parent !== null) {
      if (isHostParent(parent)) {
        return pa" +
                            "rent;
      }
      parent = parent['return'];
    }
    invariant_1$1(false, 'E" +
                            "xpected to find a host parent. This error is likely caused by a bug in React. Pl" +
                            "ease file an issue.');
  }

  function isHostParent(fiber) {
    return fiber.ta" +
                            "g === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal;
  }

" +
                            "  function getHostSibling(fiber) {
    // We're going to search forward into the" +
                            " tree until we find a sibling host
    // node. Unfortunately, if multiple inser" +
                            "tions are done in a row we have to
    // search past them. This leads to expone" +
                            "ntial search for the next sibling.
    var node = fiber;
    siblings: while (tr" +
                            "ue) {
      // If we didn't find anything, let's try the next sibling.
      whi" +
                            "le (node.sibling === null) {
        if (node['return'] === null || isHostParent" +
                            "(node['return'])) {
          // If we pop out of the root or hit the parent the" +
                            " fiber we are the
          // last sibling.
          return null;
        }
  " +
                            "      node = node['return'];
      }
      node.sibling['return'] = node['return" +
                            "'];
      node = node.sibling;
      while (node.tag !== HostComponent && node.t" +
                            "ag !== HostText) {
        // If it is not host node and, we might have a host n" +
                            "ode inside it.
        // Try to search down until we find one.
        if (node" +
                            ".effectTag & Placement) {
          // If we don't have a child, try the sibling" +
                            "s instead.
          continue siblings;
        }
        // If we don't have a " +
                            "child, try the siblings instead.
        // We also skip portals because they ar" +
                            "e not part of this host tree.
        if (node.child === null || node.tag === Ho" +
                            "stPortal) {
          continue siblings;
        } else {
          node.child['" +
                            "return'] = node;
          node = node.child;
        }
      }
      // Check i" +
                            "f this host node is stable or about to be placed.
      if (!(node.effectTag & P" +
                            "lacement)) {
        // Found it!
        return node.stateNode;
      }
    }
 " +
                            " }

  function commitPlacement(finishedWork) {
    // Recursively insert all hos" +
                            "t nodes into the parent.
    var parentFiber = getHostParentFiber(finishedWork);" +
                            "
    var parent = void 0;
    var isContainer = void 0;
    switch (parentFiber." +
                            "tag) {
      case HostComponent:
        parent = parentFiber.stateNode;
       " +
                            " isContainer = false;
        break;
      case HostRoot:
        parent = paren" +
                            "tFiber.stateNode.containerInfo;
        isContainer = true;
        break;
     " +
                            " case HostPortal:
        parent = parentFiber.stateNode.containerInfo;
        " +
                            "isContainer = true;
        break;
      default:
        invariant_1$1(false, '" +
                            "Invalid host parent fiber. This error is likely caused by a bug in React. Please" +
                            " file an issue.');
    }
    if (parentFiber.effectTag & ContentReset) {
      /" +
                            "/ Reset the text content of the parent before doing any insertions
      resetTe" +
                            "xtContent(parent);
      // Clear ContentReset from the effect tag
      parentF" +
                            "iber.effectTag &= ~ContentReset;
    }

    var before = getHostSibling(finished" +
                            "Work);
    // We only have the top Fiber that was inserted but we need recurse d" +
                            "own its
    // children to find all the terminal nodes.
    var node = finishedW" +
                            "ork;
    while (true) {
      if (node.tag === HostComponent || node.tag === Hos" +
                            "tText) {
        if (before) {
          if (isContainer) {
            insertIn" +
                            "ContainerBefore(parent, node.stateNode, before);
          } else {
            " +
                            "insertBefore(parent, node.stateNode, before);
          }
        } else {
     " +
                            "     if (isContainer) {
            appendChildToContainer(parent, node.stateNod" +
                            "e);
          } else {
            appendChild(parent, node.stateNode);
        " +
                            "  }
        }
      } else if (node.tag === HostPortal) {
        // If the inse" +
                            "rtion itself is a portal, then we don't want to traverse
        // down its chi" +
                            "ldren. Instead, we'll get insertions from each child in
        // the portal di" +
                            "rectly.
      } else if (node.child !== null) {
        node.child['return'] = n" +
                            "ode;
        node = node.child;
        continue;
      }
      if (node === fin" +
                            "ishedWork) {
        return;
      }
      while (node.sibling === null) {
     " +
                            "   if (node['return'] === null || node['return'] === finishedWork) {
          r" +
                            "eturn;
        }
        node = node['return'];
      }
      node.sibling['retu" +
                            "rn'] = node['return'];
      node = node.sibling;
    }
  }

  function unmountH" +
                            "ostComponents(current) {
    // We only have the top Fiber that was inserted but" +
                            " we need recurse down its
    var node = current;

    // Each iteration, curren" +
                            "tParent is populated with node's host parent if not
    // currentParentIsValid." +
                            "
    var currentParentIsValid = false;
    var currentParent = void 0;
    var c" +
                            "urrentParentIsContainer = void 0;

    while (true) {
      if (!currentParentIs" +
                            "Valid) {
        var parent = node['return'];
        findParent: while (true) {" +
                            "
          !(parent !== null) ? invariant_1$1(false, 'Expected to find a host pa" +
                            "rent. This error is likely caused by a bug in React. Please file an issue.') : v" +
                            "oid 0;
          switch (parent.tag) {
            case HostComponent:
         " +
                            "     currentParent = parent.stateNode;
              currentParentIsContainer = " +
                            "false;
              break findParent;
            case HostRoot:
              " +
                            "currentParent = parent.stateNode.containerInfo;
              currentParentIsCon" +
                            "tainer = true;
              break findParent;
            case HostPortal:
    " +
                            "          currentParent = parent.stateNode.containerInfo;
              currentP" +
                            "arentIsContainer = true;
              break findParent;
          }
          p" +
                            "arent = parent['return'];
        }
        currentParentIsValid = true;
      }" +
                            "

      if (node.tag === HostComponent || node.tag === HostText) {
        commi" +
                            "tNestedUnmounts(node);
        // After all the children have unmounted, it is n" +
                            "ow safe to remove the
        // node from the tree.
        if (currentParentIs" +
                            "Container) {
          removeChildFromContainer(currentParent, node.stateNode);
" +
                            "        } else {
          removeChild(currentParent, node.stateNode);
        }" +
                            "
        // Don't visit children because we already visited them.
      } else i" +
                            "f (node.tag === HostPortal) {
        // When we go into a portal, it becomes th" +
                            "e parent to remove from.
        // We will reassign it back when we pop the por" +
                            "tal on the way up.
        currentParent = node.stateNode.containerInfo;
       " +
                            " // Visit children because portals might contain host components.
        if (no" +
                            "de.child !== null) {
          node.child['return'] = node;
          node = nod" +
                            "e.child;
          continue;
        }
      } else {
        commitUnmount(node" +
                            ");
        // Visit children because we may find more host components below.
   " +
                            "     if (node.child !== null) {
          node.child['return'] = node;
         " +
                            " node = node.child;
          continue;
        }
      }
      if (node === cur" +
                            "rent) {
        return;
      }
      while (node.sibling === null) {
        if" +
                            " (node['return'] === null || node['return'] === current) {
          return;
   " +
                            "     }
        node = node['return'];
        if (node.tag === HostPortal) {
   " +
                            "       // When we go out of the portal, we need to restore the parent.
         " +
                            " // Since we don't keep a stack of them, we will search for it.
          curren" +
                            "tParentIsValid = false;
        }
      }
      node.sibling['return'] = node['r" +
                            "eturn'];
      node = node.sibling;
    }
  }

  function commitDeletion(current" +
                            ") {
    // Recursively delete all host nodes from the parent.
    // Detach refs" +
                            " and call componentWillUnmount() on the whole subtree.
    unmountHostComponents" +
                            "(current);
    detachFiber(current);
  }

  function commitWork(current, finishe" +
                            "dWork) {
    switch (finishedWork.tag) {
      case ClassComponent:
        {
  " +
                            "        return;
        }
      case HostComponent:
        {
          var inst" +
                            "ance = finishedWork.stateNode;
          if (instance != null) {
            // " +
                            "Commit the work prepared earlier.
            var newProps = finishedWork.memoiz" +
                            "edProps;
            // For hydration we reuse the update path but we treat the " +
                            "oldProps
            // as the newProps. The updatePayload will contain the real" +
                            " change in
            // this case.
            var oldProps = current !== null" +
                            " ? current.memoizedProps : newProps;
            var type = finishedWork.type;
 " +
                            "           // TODO: Type the updateQueue to be specific to host components.
    " +
                            "        var updatePayload = finishedWork.updateQueue;
            finishedWork.u" +
                            "pdateQueue = null;
            if (updatePayload !== null) {
              commi" +
                            "tUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
      " +
                            "      }
          }
          return;
        }
      case HostText:
        {
 " +
                            "         !(finishedWork.stateNode !== null) ? invariant_1$1(false, 'This should " +
                            "have a text node initialized. This error is likely caused by a bug in React. Ple" +
                            "ase file an issue.') : void 0;
          var textInstance = finishedWork.stateNo" +
                            "de;
          var newText = finishedWork.memoizedProps;
          // For hydrati" +
                            "on we reuse the update path but we treat the oldProps
          // as the newPro" +
                            "ps. The updatePayload will contain the real change in
          // this case.
  " +
                            "        var oldText = current !== null ? current.memoizedProps : newText;
      " +
                            "    commitTextUpdate(textInstance, oldText, newText);
          return;
        " +
                            "}
      case HostRoot:
        {
          return;
        }
      default:
    " +
                            "    {
          invariant_1$1(false, 'This unit of work tag should not have side" +
                            "-effects. This error is likely caused by a bug in React. Please file an issue.')" +
                            ";
        }
    }
  }

  function commitResetTextContent(current) {
    resetTex" +
                            "tContent(current.stateNode);
  }

  if (enableMutatingReconciler) {
    return {" +
                            "
      commitResetTextContent: commitResetTextContent,
      commitPlacement: co" +
                            "mmitPlacement,
      commitDeletion: commitDeletion,
      commitWork: commitWor" +
                            "k,
      commitLifeCycles: commitLifeCycles,
      commitAttachRef: commitAttach" +
                            "Ref,
      commitDetachRef: commitDetachRef
    };
  } else {
    invariant_1$1(" +
                            "false, 'Mutating reconciler is disabled.');
  }
};

var NO_CONTEXT = {};

var Re" +
                            "actFiberHostContext = function (config) {
  var getChildHostContext = config.get" +
                            "ChildHostContext,
      getRootHostContext = config.getRootHostContext;


  var " +
                            "contextStackCursor = createCursor(NO_CONTEXT);
  var contextFiberStackCursor = c" +
                            "reateCursor(NO_CONTEXT);
  var rootInstanceStackCursor = createCursor(NO_CONTEXT" +
                            ");

  function requiredContext(c) {
    !(c !== NO_CONTEXT) ? invariant_1$1(fals" +
                            "e, 'Expected host context to exist. This error is likely caused by a bug in Reac" +
                            "t. Please file an issue.') : void 0;
    return c;
  }

  function getRootHostCo" +
                            "ntainer() {
    var rootInstance = requiredContext(rootInstanceStackCursor.curre" +
                            "nt);
    return rootInstance;
  }

  function pushHostContainer(fiber, nextRootI" +
                            "nstance) {
    // Push current root instance onto the stack;
    // This allows " +
                            "us to reset root when portals are popped.
    push(rootInstanceStackCursor, next" +
                            "RootInstance, fiber);

    var nextRootContext = getRootHostContext(nextRootInst" +
                            "ance);

    // Track the context and the Fiber that provided it.
    // This ena" +
                            "bles us to pop only Fibers that provide unique contexts.
    push(contextFiberSt" +
                            "ackCursor, fiber, fiber);
    push(contextStackCursor, nextRootContext, fiber);
" +
                            "  }

  function popHostContainer(fiber) {
    pop(contextStackCursor, fiber);
  " +
                            "  pop(contextFiberStackCursor, fiber);
    pop(rootInstanceStackCursor, fiber);
" +
                            "  }

  function getHostContext() {
    var context = requiredContext(contextStac" +
                            "kCursor.current);
    return context;
  }

  function pushHostContext(fiber) {
 " +
                            "   var rootInstance = requiredContext(rootInstanceStackCursor.current);
    var " +
                            "context = requiredContext(contextStackCursor.current);
    var nextContext = get" +
                            "ChildHostContext(context, fiber.type, rootInstance);

    // Don't push this Fib" +
                            "er's context unless it's unique.
    if (context === nextContext) {
      return" +
                            ";
    }

    // Track the context and the Fiber that provided it.
    // This en" +
                            "ables us to pop only Fibers that provide unique contexts.
    push(contextFiberS" +
                            "tackCursor, fiber, fiber);
    push(contextStackCursor, nextContext, fiber);
  }" +
                            "

  function popHostContext(fiber) {
    // Do not pop unless this Fiber provide" +
                            "d the current context.
    // pushHostContext() only pushes Fibers that provide " +
                            "unique contexts.
    if (contextFiberStackCursor.current !== fiber) {
      retu" +
                            "rn;
    }

    pop(contextStackCursor, fiber);
    pop(contextFiberStackCursor, " +
                            "fiber);
  }

  function resetHostContainer() {
    contextStackCursor.current = " +
                            "NO_CONTEXT;
    rootInstanceStackCursor.current = NO_CONTEXT;
  }

  return {
  " +
                            "  getHostContext: getHostContext,
    getRootHostContainer: getRootHostContainer" +
                            ",
    popHostContainer: popHostContainer,
    popHostContext: popHostContext,
  " +
                            "  pushHostContainer: pushHostContainer,
    pushHostContext: pushHostContext,
  " +
                            "  resetHostContainer: resetHostContainer
  };
};

var ReactFiberHydrationContext" +
                            " = function (config) {
  var shouldSetTextContent = config.shouldSetTextContent," +
                            "
      hydration = config.hydration;

  // If this doesn't have hydration mode.
" +
                            "
  if (!hydration) {
    return {
      enterHydrationState: function () {
     " +
                            "   return false;
      },
      resetHydrationState: function () {},
      tryTo" +
                            "ClaimNextHydratableInstance: function () {},
      prepareToHydrateHostInstance:" +
                            " function () {
        invariant_1$1(false, 'Expected prepareToHydrateHostInstan" +
                            "ce() to never be called. This error is likely caused by a bug in React. Please f" +
                            "ile an issue.');
      },
      prepareToHydrateHostTextInstance: function () {
" +
                            "        invariant_1$1(false, 'Expected prepareToHydrateHostTextInstance() to nev" +
                            "er be called. This error is likely caused by a bug in React. Please file an issu" +
                            "e.');
      },
      popHydrationState: function (fiber) {
        return false;" +
                            "
      }
    };
  }

  var canHydrateInstance = hydration.canHydrateInstance,
  " +
                            "    canHydrateTextInstance = hydration.canHydrateTextInstance,
      getNextHydr" +
                            "atableSibling = hydration.getNextHydratableSibling,
      getFirstHydratableChil" +
                            "d = hydration.getFirstHydratableChild,
      hydrateInstance = hydration.hydrate" +
                            "Instance,
      hydrateTextInstance = hydration.hydrateTextInstance,
      didNo" +
                            "tMatchHydratedContainerTextInstance = hydration.didNotMatchHydratedContainerText" +
                            "Instance,
      didNotMatchHydratedTextInstance = hydration.didNotMatchHydratedT" +
                            "extInstance,
      didNotHydrateContainerInstance = hydration.didNotHydrateConta" +
                            "inerInstance,
      didNotHydrateInstance = hydration.didNotHydrateInstance,
   " +
                            "   didNotFindHydratableContainerInstance = hydration.didNotFindHydratableContain" +
                            "erInstance,
      didNotFindHydratableContainerTextInstance = hydration.didNotFi" +
                            "ndHydratableContainerTextInstance,
      didNotFindHydratableInstance = hydratio" +
                            "n.didNotFindHydratableInstance,
      didNotFindHydratableTextInstance = hydrati" +
                            "on.didNotFindHydratableTextInstance;

  // The deepest Fiber on the stack involv" +
                            "ed in a hydration context.
  // This may have been an insertion or a hydration.
" +
                            "
  var hydrationParentFiber = null;
  var nextHydratableInstance = null;
  var i" +
                            "sHydrating = false;

  function enterHydrationState(fiber) {
    var parentInsta" +
                            "nce = fiber.stateNode.containerInfo;
    nextHydratableInstance = getFirstHydrat" +
                            "ableChild(parentInstance);
    hydrationParentFiber = fiber;
    isHydrating = t" +
                            "rue;
    return true;
  }

  function deleteHydratableInstance(returnFiber, inst" +
                            "ance) {
    {
      switch (returnFiber.tag) {
        case HostRoot:
          " +
                            "didNotHydrateContainerInstance(returnFiber.stateNode.containerInfo, instance);
 " +
                            "         break;
        case HostComponent:
          didNotHydrateInstance(retu" +
                            "rnFiber.type, returnFiber.memoizedProps, returnFiber.stateNode, instance);
     " +
                            "     break;
      }
    }

    var childToDelete = createFiberFromHostInstanceFo" +
                            "rDeletion();
    childToDelete.stateNode = instance;
    childToDelete['return']" +
                            " = returnFiber;
    childToDelete.effectTag = Deletion;

    // This might seem " +
                            "like it belongs on progressedFirstDeletion. However,
    // these children are n" +
                            "ot part of the reconciliation list of children.
    // Even if we abort and rere" +
                            "concile the children, that will try to hydrate
    // again and the nodes are st" +
                            "ill in the host tree so these will be
    // recreated.
    if (returnFiber.last" +
                            "Effect !== null) {
      returnFiber.lastEffect.nextEffect = childToDelete;
    " +
                            "  returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEf" +
                            "fect = returnFiber.lastEffect = childToDelete;
    }
  }

  function insertNonHy" +
                            "dratedInstance(returnFiber, fiber) {
    fiber.effectTag |= Placement;
    {
   " +
                            "   switch (returnFiber.tag) {
        case HostRoot:
          {
            var" +
                            " parentContainer = returnFiber.stateNode.containerInfo;
            switch (fibe" +
                            "r.tag) {
              case HostComponent:
                var type = fiber.type" +
                            ";
                var props = fiber.pendingProps;
                didNotFindHydr" +
                            "atableContainerInstance(parentContainer, type, props);
                break;
  " +
                            "            case HostText:
                var text = fiber.pendingProps;
      " +
                            "          didNotFindHydratableContainerTextInstance(parentContainer, text);
    " +
                            "            break;
            }
            break;
          }
        case Hos" +
                            "tComponent:
          {
            var parentType = returnFiber.type;
         " +
                            "   var parentProps = returnFiber.memoizedProps;
            var parentInstance =" +
                            " returnFiber.stateNode;
            switch (fiber.tag) {
              case Host" +
                            "Component:
                var _type = fiber.type;
                var _props = " +
                            "fiber.pendingProps;
                didNotFindHydratableInstance(parentType, par" +
                            "entProps, parentInstance, _type, _props);
                break;
              c" +
                            "ase HostText:
                var _text = fiber.pendingProps;
                di" +
                            "dNotFindHydratableTextInstance(parentType, parentProps, parentInstance, _text);
" +
                            "                break;
            }
            break;
          }
        defa" +
                            "ult:
          return;
      }
    }
  }

  function tryHydrate(fiber, nextInsta" +
                            "nce) {
    switch (fiber.tag) {
      case HostComponent:
        {
          va" +
                            "r type = fiber.type;
          var props = fiber.pendingProps;
          var ins" +
                            "tance = canHydrateInstance(nextInstance, type, props);
          if (instance !=" +
                            "= null) {
            fiber.stateNode = instance;
            return true;
     " +
                            "     }
          return false;
        }
      case HostText:
        {
        " +
                            "  var text = fiber.pendingProps;
          var textInstance = canHydrateTextInst" +
                            "ance(nextInstance, text);
          if (textInstance !== null) {
            fib" +
                            "er.stateNode = textInstance;
            return true;
          }
          retu" +
                            "rn false;
        }
      default:
        return false;
    }
  }

  function t" +
                            "ryToClaimNextHydratableInstance(fiber) {
    if (!isHydrating) {
      return;
 " +
                            "   }
    var nextInstance = nextHydratableInstance;
    if (!nextInstance) {
   " +
                            "   // Nothing to hydrate. Make it an insertion.
      insertNonHydratedInstance(" +
                            "hydrationParentFiber, fiber);
      isHydrating = false;
      hydrationParentFi" +
                            "ber = fiber;
      return;
    }
    if (!tryHydrate(fiber, nextInstance)) {
   " +
                            "   // If we can't hydrate this instance let's try the next one.
      // We use " +
                            "this as a heuristic. It's based on intuition and not data so it
      // might b" +
                            "e flawed or unnecessary.
      nextInstance = getNextHydratableSibling(nextInsta" +
                            "nce);
      if (!nextInstance || !tryHydrate(fiber, nextInstance)) {
        // " +
                            "Nothing to hydrate. Make it an insertion.
        insertNonHydratedInstance(hydr" +
                            "ationParentFiber, fiber);
        isHydrating = false;
        hydrationParentFi" +
                            "ber = fiber;
        return;
      }
      // We matched the next one, we'll now" +
                            " assume that the first one was
      // superfluous and we'll delete it. Since w" +
                            "e can't eagerly delete it
      // we'll have to schedule a deletion. To do that" +
                            ", this node needs a dummy
      // fiber associated with it.
      deleteHydrata" +
                            "bleInstance(hydrationParentFiber, nextHydratableInstance);
    }
    hydrationPa" +
                            "rentFiber = fiber;
    nextHydratableInstance = getFirstHydratableChild(nextInst" +
                            "ance);
  }

  function prepareToHydrateHostInstance(fiber, rootContainerInstance" +
                            ", hostContext) {
    var instance = fiber.stateNode;
    var updatePayload = hyd" +
                            "rateInstance(instance, fiber.type, fiber.memoizedProps, rootContainerInstance, h" +
                            "ostContext, fiber);
    // TODO: Type this specific to this type of component.
 " +
                            "   fiber.updateQueue = updatePayload;
    // If the update payload indicates tha" +
                            "t there is a change or if there
    // is a new ref we mark this as an update.
 " +
                            "   if (updatePayload !== null) {
      return true;
    }
    return false;
  }
" +
                            "
  function prepareToHydrateHostTextInstance(fiber) {
    var textInstance = fib" +
                            "er.stateNode;
    var textContent = fiber.memoizedProps;
    var shouldUpdate = " +
                            "hydrateTextInstance(textInstance, textContent, fiber);
    {
      if (shouldUpd" +
                            "ate) {
        // We assume that prepareToHydrateHostTextInstance is called in a" +
                            " context where the
        // hydration parent is the parent host component of t" +
                            "his host text.
        var returnFiber = hydrationParentFiber;
        if (retur" +
                            "nFiber !== null) {
          switch (returnFiber.tag) {
            case HostRoo" +
                            "t:
              {
                var parentContainer = returnFiber.stateNode.c" +
                            "ontainerInfo;
                didNotMatchHydratedContainerTextInstance(parentCon" +
                            "tainer, textInstance, textContent);
                break;
              }
     " +
                            "       case HostComponent:
              {
                var parentType = retu" +
                            "rnFiber.type;
                var parentProps = returnFiber.memoizedProps;
     " +
                            "           var parentInstance = returnFiber.stateNode;
                didNotMat" +
                            "chHydratedTextInstance(parentType, parentProps, parentInstance, textInstance, te" +
                            "xtContent);
                break;
              }
          }
        }
      }" +
                            "
    }
    return shouldUpdate;
  }

  function popToNextHostParent(fiber) {
   " +
                            " var parent = fiber['return'];
    while (parent !== null && parent.tag !== Host" +
                            "Component && parent.tag !== HostRoot) {
      parent = parent['return'];
    }
 " +
                            "   hydrationParentFiber = parent;
  }

  function popHydrationState(fiber) {
   " +
                            " if (fiber !== hydrationParentFiber) {
      // We're deeper than the current hy" +
                            "dration context, inside an inserted
      // tree.
      return false;
    }
   " +
                            " if (!isHydrating) {
      // If we're not currently hydrating but we're in a hy" +
                            "dration context, then
      // we were an insertion and now need to pop up reent" +
                            "er hydration of our
      // siblings.
      popToNextHostParent(fiber);
      i" +
                            "sHydrating = true;
      return false;
    }

    var type = fiber.type;

    //" +
                            " If we have any remaining hydratable nodes, we need to delete them now.
    // W" +
                            "e only do this deeper than head and body since they tend to have random
    // o" +
                            "ther nodes in them. We also ignore components with pure text content in
    // s" +
                            "ide of them.
    // TODO: Better heuristic.
    if (fiber.tag !== HostComponent " +
                            "|| type !== 'head' && type !== 'body' && !shouldSetTextContent(type, fiber.memoi" +
                            "zedProps)) {
      var nextInstance = nextHydratableInstance;
      while (nextI" +
                            "nstance) {
        deleteHydratableInstance(fiber, nextInstance);
        nextIn" +
                            "stance = getNextHydratableSibling(nextInstance);
      }
    }

    popToNextHos" +
                            "tParent(fiber);
    nextHydratableInstance = hydrationParentFiber ? getNextHydra" +
                            "tableSibling(fiber.stateNode) : null;
    return true;
  }

  function resetHydr" +
                            "ationState() {
    hydrationParentFiber = null;
    nextHydratableInstance = nul" +
                            "l;
    isHydrating = false;
  }

  return {
    enterHydrationState: enterHydrat" +
                            "ionState,
    resetHydrationState: resetHydrationState,
    tryToClaimNextHydrat" +
                            "ableInstance: tryToClaimNextHydratableInstance,
    prepareToHydrateHostInstance" +
                            ": prepareToHydrateHostInstance,
    prepareToHydrateHostTextInstance: prepareToH" +
                            "ydrateHostTextInstance,
    popHydrationState: popHydrationState
  };
};

// Thi" +
                            "s lets us hook into Fiber to debug what it's doing.
// See https://github.com/fa" +
                            "cebook/react/pull/8033.
// This is not part of the public API, not even for Reac" +
                            "t DevTools.
// You may only inject a debugTool if you work on React Fiber itself" +
                            ".
var ReactFiberInstrumentation = {
  debugTool: null
};

var ReactFiberInstrume" +
                            "ntation_1 = ReactFiberInstrumentation;

var defaultShowDialog = function (captur" +
                            "edError) {
  return true;
};

var showDialog = defaultShowDialog;

function logC" +
                            "apturedError(capturedError) {
  var logError = showDialog(capturedError);

  // " +
                            "Allow injected showDialog() to prevent default console.error logging.
  // This " +
                            "enables renderers like ReactNative to better manage redbox behavior.
  if (logEr" +
                            "ror === false) {
    return;
  }

  {
    var componentName = capturedError.comp" +
                            "onentName,
        componentStack = capturedError.componentStack,
        errorB" +
                            "oundaryName = capturedError.errorBoundaryName,
        errorBoundaryFound = capt" +
                            "uredError.errorBoundaryFound,
        willRetry = capturedError.willRetry;


   " +
                            " var componentNameMessage = componentName ? 'The above error occurred in the <' " +
                            "+ componentName + '> component:' : 'The above error occurred in one of your Reac" +
                            "t components:';

    var errorBoundaryMessage = void 0;
    // errorBoundaryFoun" +
                            "d check is sufficient; errorBoundaryName check is to satisfy Flow.
    if (error" +
                            "BoundaryFound && errorBoundaryName) {
      if (willRetry) {
        errorBounda" +
                            "ryMessage = 'React will try to recreate this component tree from scratch ' + ('u" +
                            "sing the error boundary you provided, ' + errorBoundaryName + '.');
      } else" +
                            " {
        errorBoundaryMessage = 'This error was initially handled by the error" +
                            " boundary ' + errorBoundaryName + '.\n' + 'Recreating the tree from scratch fail" +
                            "ed so React will unmount the tree.';
      }
    } else {
      errorBoundaryMes" +
                            "sage = 'Consider adding an error boundary to your tree to customize error handli" +
                            "ng behavior.\n' + 'Visit https://fb.me/react-error-boundaries to learn more abou" +
                            "t error boundaries.';
    }
    var combinedMessage = '' + componentNameMessage " +
                            "+ componentStack + '\n\n' + ('' + errorBoundaryMessage);

    // In development," +
                            " we provide our own message with just the component stack.
    // We don't inclu" +
                            "de the original error message and JS stack because the browser
    // has alread" +
                            "y printed it. Even if the application swallows the error, it is still
    // dis" +
                            "played by the browser thanks to the DEV-only fake event trick in ReactErrorUtils" +
                            ".
    console.error(combinedMessage);
  }
}

var invokeGuardedCallback$1 = React" +
                            "ErrorUtils.invokeGuardedCallback;
var hasCaughtError = ReactErrorUtils.hasCaught" +
                            "Error;
var clearCaughtError = ReactErrorUtils.clearCaughtError;


{
  var didWar" +
                            "nAboutStateTransition = false;
  var didWarnSetStateChildContext = false;
  var " +
                            "didWarnStateUpdateForUnmountedComponent = {};

  var warnAboutUpdateOnUnmounted " +
                            "= function (fiber) {
    var componentName = getComponentName(fiber) || 'ReactCl" +
                            "ass';
    if (didWarnStateUpdateForUnmountedComponent[componentName]) {
      re" +
                            "turn;
    }
    warning_1$1(false, 'Can only update a mounted or mounting ' + 'c" +
                            "omponent. This usually means you called setState, replaceState, ' + 'or forceUpd" +
                            "ate on an unmounted component. This is a no-op.\n\nPlease ' + 'check the code fo" +
                            "r the %s component.', componentName);
    didWarnStateUpdateForUnmountedComponen" +
                            "t[componentName] = true;
  };

  var warnAboutInvalidUpdates = function (instanc" +
                            "e) {
    switch (ReactDebugCurrentFiber.phase) {
      case 'getChildContext':
 " +
                            "       if (didWarnSetStateChildContext) {
          return;
        }
        wa" +
                            "rning_1$1(false, 'setState(...): Cannot call setState() inside getChildContext()" +
                            "');
        didWarnSetStateChildContext = true;
        break;
      case 'rende" +
                            "r':
        if (didWarnAboutStateTransition) {
          return;
        }
     " +
                            "   warning_1$1(false, 'Cannot update during an existing state transition (such a" +
                            "s within ' + "`render` or another component's constructor). Render methods shoul" +
                            "d " + 'be a pure function of props and state; constructor side-effects are ' + '" +
                            "an anti-pattern, but can be moved to `componentWillMount`.');
        didWarnAbo" +
                            "utStateTransition = true;
        break;
    }
  };
}

var ReactFiberScheduler =" +
                            " function (config) {
  var hostContext = ReactFiberHostContext(config);
  var hy" +
                            "drationContext = ReactFiberHydrationContext(config);
  var popHostContainer = ho" +
                            "stContext.popHostContainer,
      popHostContext = hostContext.popHostContext,
 " +
                            "     resetHostContainer = hostContext.resetHostContainer;

  var _ReactFiberBegi" +
                            "nWork = ReactFiberBeginWork(config, hostContext, hydrationContext, scheduleWork," +
                            " computeExpirationForFiber),
      beginWork = _ReactFiberBeginWork.beginWork,
 " +
                            "     beginFailedWork = _ReactFiberBeginWork.beginFailedWork;

  var _ReactFiberC" +
                            "ompleteWo = ReactFiberCompleteWork(config, hostContext, hydrationContext),
     " +
                            " completeWork = _ReactFiberCompleteWo.completeWork;

  var _ReactFiberCommitWork" +
                            " = ReactFiberCommitWork(config, captureError),
      commitResetTextContent = _R" +
                            "eactFiberCommitWork.commitResetTextContent,
      commitPlacement = _ReactFiberC" +
                            "ommitWork.commitPlacement,
      commitDeletion = _ReactFiberCommitWork.commitDe" +
                            "letion,
      commitWork = _ReactFiberCommitWork.commitWork,
      commitLifeCyc" +
                            "les = _ReactFiberCommitWork.commitLifeCycles,
      commitAttachRef = _ReactFibe" +
                            "rCommitWork.commitAttachRef,
      commitDetachRef = _ReactFiberCommitWork.commi" +
                            "tDetachRef;

  var now = config.now,
      scheduleDeferredCallback = config.sch" +
                            "eduleDeferredCallback,
      useSyncScheduling = config.useSyncScheduling,
     " +
                            " prepareForCommit = config.prepareForCommit,
      resetAfterCommit = config.res" +
                            "etAfterCommit;

  // Represents the current time in ms.

  var startTime = now()" +
                            ";
  var mostRecentCurrentTime = msToExpirationTime(0);

  // Represents the expi" +
                            "ration time that incoming updates should use. (If this
  // is NoWork, use the d" +
                            "efault strategy: async updates in async mode, sync
  // updates in sync mode.)
 " +
                            " var expirationContext = NoWork;

  var isWorking = false;

  // The next work i" +
                            "n progress fiber that we're currently working on.
  var nextUnitOfWork = null;
 " +
                            " var nextRoot = null;
  // The time at which we're currently rendering work.
  v" +
                            "ar nextRenderExpirationTime = NoWork;

  // The next fiber with an effect that w" +
                            "e're currently committing.
  var nextEffect = null;

  // Keep track of which fi" +
                            "bers have captured an error that need to be handled.
  // Work is removed from t" +
                            "his collection after componentDidCatch is called.
  var capturedErrors = null;
 " +
                            " // Keep track of which fibers have failed during the current batch of work.
  /" +
                            "/ This is a different set than capturedErrors, because it is not reset until
  /" +
                            "/ the end of the batch. This is needed to propagate errors correctly if a
  // s" +
                            "ubtree fails more than once.
  var failedBoundaries = null;
  // Error boundarie" +
                            "s that captured an error during the current commit.
  var commitPhaseBoundaries " +
                            "= null;
  var firstUncaughtError = null;
  var didFatal = false;

  var isCommit" +
                            "ting = false;
  var isUnmounting = false;

  // Used for performance tracking.
 " +
                            " var interruptedBy = null;

  function resetContextStack() {
    // Reset the st" +
                            "ack
    reset$1();
    // Reset the cursors
    resetContext();
    resetHostCon" +
                            "tainer();
  }

  function commitAllHostEffects() {
    while (nextEffect !== nul" +
                            "l) {
      {
        ReactDebugCurrentFiber.setCurrentFiber(nextEffect);
      }" +
                            "
      recordEffect();

      var effectTag = nextEffect.effectTag;
      if (ef" +
                            "fectTag & ContentReset) {
        commitResetTextContent(nextEffect);
      }

 " +
                            "     if (effectTag & Ref) {
        var current = nextEffect.alternate;
        " +
                            "if (current !== null) {
          commitDetachRef(current);
        }
      }

 " +
                            "     // The following switch statement is only concerned about placement,
      " +
                            "// updates, and deletions. To avoid needing to add a case for every
      // pos" +
                            "sible bitmap value, we remove the secondary effects from the
      // effect tag" +
                            " and switch on that value.
      var primaryEffectTag = effectTag & ~(Callback |" +
                            " Err | ContentReset | Ref | PerformedWork);
      switch (primaryEffectTag) {
  " +
                            "      case Placement:
          {
            commitPlacement(nextEffect);
     " +
                            "       // Clear the "placement" from effect tag so that we know that this is ins" +
                            "erted, before
            // any life-cycles like componentDidMount gets called." +
                            "
            // TODO: findDOMNode doesn't rely on this any more but isMounted
  " +
                            "          // does and isMounted is deprecated anyway so we should be able
      " +
                            "      // to kill this.
            nextEffect.effectTag &= ~Placement;
         " +
                            "   break;
          }
        case PlacementAndUpdate:
          {
            /" +
                            "/ Placement
            commitPlacement(nextEffect);
            // Clear the "p" +
                            "lacement" from effect tag so that we know that this is inserted, before
        " +
                            "    // any life-cycles like componentDidMount gets called.
            nextEffec" +
                            "t.effectTag &= ~Placement;

            // Update
            var _current = nex" +
                            "tEffect.alternate;
            commitWork(_current, nextEffect);
            bre" +
                            "ak;
          }
        case Update:
          {
            var _current2 = nex" +
                            "tEffect.alternate;
            commitWork(_current2, nextEffect);
            br" +
                            "eak;
          }
        case Deletion:
          {
            isUnmounting = t" +
                            "rue;
            commitDeletion(nextEffect);
            isUnmounting = false;
 " +
                            "           break;
          }
      }
      nextEffect = nextEffect.nextEffect;
" +
                            "    }

    {
      ReactDebugCurrentFiber.resetCurrentFiber();
    }
  }

  func" +
                            "tion commitAllLifeCycles() {
    while (nextEffect !== null) {
      var effectT" +
                            "ag = nextEffect.effectTag;

      if (effectTag & (Update | Callback)) {
       " +
                            " recordEffect();
        var current = nextEffect.alternate;
        commitLifeC" +
                            "ycles(current, nextEffect);
      }

      if (effectTag & Ref) {
        record" +
                            "Effect();
        commitAttachRef(nextEffect);
      }

      if (effectTag & Er" +
                            "r) {
        recordEffect();
        commitErrorHandling(nextEffect);
      }

 " +
                            "     var next = nextEffect.nextEffect;
      // Ensure that we clean these up so" +
                            " that we don't accidentally keep them.
      // I'm not actually sure this matte" +
                            "rs because we can't reset firstEffect
      // and lastEffect since they're on e" +
                            "very node, not just the effectful
      // ones. So we have to clean everything " +
                            "as we reuse nodes anyway.
      nextEffect.nextEffect = null;
      // Ensure th" +
                            "at we reset the effectTag here so that we can rely on effect
      // tags to re" +
                            "ason about the current life-cycle.
      nextEffect = next;
    }
  }

  functio" +
                            "n commitRoot(finishedWork) {
    // We keep track of this so that captureError c" +
                            "an collect any boundaries
    // that capture an error during the commit phase. " +
                            "The reason these aren't
    // local to this function is because errors that occ" +
                            "ur during cWU are
    // captured elsewhere, to prevent the unmount from being i" +
                            "nterrupted.
    isWorking = true;
    isCommitting = true;
    startCommitTimer(" +
                            ");

    var root = finishedWork.stateNode;
    !(root.current !== finishedWork) " +
                            "? invariant_1$1(false, 'Cannot commit the same tree as before. This is probably " +
                            "a bug related to the return field. This error is likely caused by a bug in React" +
                            ". Please file an issue.') : void 0;
    root.isReadyForCommit = false;

    // R" +
                            "eset this to null before calling lifecycles
    ReactCurrentOwner.current = null" +
                            ";

    var firstEffect = void 0;
    if (finishedWork.effectTag > PerformedWork)" +
                            " {
      // A fiber's effect list consists only of its children, not itself. So " +
                            "if
      // the root has an effect, we need to add it to the end of the list. Th" +
                            "e
      // resulting list is the set that would belong to the root's parent, if
" +
                            "      // it had one; that is, all the effects in the tree including the root.
  " +
                            "    if (finishedWork.lastEffect !== null) {
        finishedWork.lastEffect.next" +
                            "Effect = finishedWork;
        firstEffect = finishedWork.firstEffect;
      } e" +
                            "lse {
        firstEffect = finishedWork;
      }
    } else {
      // There is" +
                            " no effect on the root.
      firstEffect = finishedWork.firstEffect;
    }

   " +
                            " prepareForCommit();

    // Commit all the side-effects within a tree. We'll do" +
                            " this in two passes.
    // The first pass performs all the host insertions, upd" +
                            "ates, deletions and
    // ref unmounts.
    nextEffect = firstEffect;
    start" +
                            "CommitHostEffectsTimer();
    while (nextEffect !== null) {
      var didError =" +
                            " false;
      var _error = void 0;
      {
        invokeGuardedCallback$1(null," +
                            " commitAllHostEffects, null);
        if (hasCaughtError()) {
          didError" +
                            " = true;
          _error = clearCaughtError();
        }
      }
      if (didE" +
                            "rror) {
        !(nextEffect !== null) ? invariant_1$1(false, 'Should have next " +
                            "effect. This error is likely caused by a bug in React. Please file an issue.') :" +
                            " void 0;
        captureError(nextEffect, _error);
        // Clean-up
        i" +
                            "f (nextEffect !== null) {
          nextEffect = nextEffect.nextEffect;
        " +
                            "}
      }
    }
    stopCommitHostEffectsTimer();

    resetAfterCommit();

    " +
                            "// The work-in-progress tree is now the current tree. This must come after
    /" +
                            "/ the first pass of the commit phase, so that the previous tree is still
    // " +
                            "current during componentWillUnmount, but before the second pass, so that
    // " +
                            "the finished work is current during componentDidMount/Update.
    root.current =" +
                            " finishedWork;

    // In the second pass we'll perform all life-cycles and ref " +
                            "callbacks.
    // Life-cycles happen as a separate pass so that all placements, " +
                            "updates,
    // and deletions in the entire tree have already been invoked.
    " +
                            "// This pass also triggers any renderer-specific initial effects.
    nextEffect" +
                            " = firstEffect;
    startCommitLifeCyclesTimer();
    while (nextEffect !== null" +
                            ") {
      var _didError = false;
      var _error2 = void 0;
      {
        inv" +
                            "okeGuardedCallback$1(null, commitAllLifeCycles, null);
        if (hasCaughtErro" +
                            "r()) {
          _didError = true;
          _error2 = clearCaughtError();
     " +
                            "   }
      }
      if (_didError) {
        !(nextEffect !== null) ? invariant_1" +
                            "$1(false, 'Should have next effect. This error is likely caused by a bug in Reac" +
                            "t. Please file an issue.') : void 0;
        captureError(nextEffect, _error2);
" +
                            "        if (nextEffect !== null) {
          nextEffect = nextEffect.nextEffect;" +
                            "
        }
      }
    }

    isCommitting = false;
    isWorking = false;
    s" +
                            "topCommitLifeCyclesTimer();
    stopCommitTimer();
    if (typeof onCommitRoot =" +
                            "== 'function') {
      onCommitRoot(finishedWork.stateNode);
    }
    if (true " +
                            "&& ReactFiberInstrumentation_1.debugTool) {
      ReactFiberInstrumentation_1.de" +
                            "bugTool.onCommitWork(finishedWork);
    }

    // If we caught any errors during" +
                            " this commit, schedule their boundaries
    // to update.
    if (commitPhaseBou" +
                            "ndaries) {
      commitPhaseBoundaries.forEach(scheduleErrorRecovery);
      com" +
                            "mitPhaseBoundaries = null;
    }

    if (firstUncaughtError !== null) {
      v" +
                            "ar _error3 = firstUncaughtError;
      firstUncaughtError = null;
      onUncaug" +
                            "htError(_error3);
    }

    var remainingTime = root.current.expirationTime;

 " +
                            "   if (remainingTime === NoWork) {
      capturedErrors = null;
      failedBoun" +
                            "daries = null;
    }

    return remainingTime;
  }

  function resetExpirationT" +
                            "ime(workInProgress, renderTime) {
    if (renderTime !== Never && workInProgress" +
                            ".expirationTime === Never) {
      // The children of this component are hidden." +
                            " Don't bubble their
      // expiration times.
      return;
    }

    // Check" +
                            " for pending updates.
    var newExpirationTime = getUpdateExpirationTime(workIn" +
                            "Progress);

    // TODO: Calls need to visit stateNode

    // Bubble up the ear" +
                            "liest expiration time.
    var child = workInProgress.child;
    while (child !=" +
                            "= null) {
      if (child.expirationTime !== NoWork && (newExpirationTime === No" +
                            "Work || newExpirationTime > child.expirationTime)) {
        newExpirationTime =" +
                            " child.expirationTime;
      }
      child = child.sibling;
    }
    workInProg" +
                            "ress.expirationTime = newExpirationTime;
  }

  function completeUnitOfWork(work" +
                            "InProgress) {
    while (true) {
      // The current, flushed, state of this fi" +
                            "ber is the alternate.
      // Ideally nothing should rely on this, but relying " +
                            "on it here
      // means that we don't need an additional field on the work in
" +
                            "      // progress.
      var current = workInProgress.alternate;
      {
       " +
                            " ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
      }
      var next " +
                            "= completeWork(current, workInProgress, nextRenderExpirationTime);
      {
     " +
                            "   ReactDebugCurrentFiber.resetCurrentFiber();
      }

      var returnFiber = " +
                            "workInProgress['return'];
      var siblingFiber = workInProgress.sibling;

    " +
                            "  resetExpirationTime(workInProgress, nextRenderExpirationTime);

      if (next" +
                            " !== null) {
        stopWorkTimer(workInProgress);
        if (true && ReactFib" +
                            "erInstrumentation_1.debugTool) {
          ReactFiberInstrumentation_1.debugTool" +
                            ".onCompleteWork(workInProgress);
        }
        // If completing this work sp" +
                            "awned new work, do that next. We'll come
        // back here again.
        ret" +
                            "urn next;
      }

      if (returnFiber !== null) {
        // Append all the e" +
                            "ffects of the subtree and this fiber onto the effect
        // list of the pare" +
                            "nt. The completion order of the children affects the
        // side-effect orde" +
                            "r.
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEf" +
                            "fect = workInProgress.firstEffect;
        }
        if (workInProgress.lastEffe" +
                            "ct !== null) {
          if (returnFiber.lastEffect !== null) {
            retu" +
                            "rnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
        " +
                            "  returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // If t" +
                            "his fiber had side-effects, we append it AFTER the children's
        // side-ef" +
                            "fects. We can perform certain side-effects earlier if
        // needed, by doin" +
                            "g multiple passes over the effect list. We don't want
        // to schedule our" +
                            " own side-effect on our own list because if end up
        // reusing children w" +
                            "e'll schedule this effect onto itself since we're
        // at the end.
       " +
                            " var effectTag = workInProgress.effectTag;
        // Skip both NoWork and Perfo" +
                            "rmedWork tags when creating the effect list.
        // PerformedWork effect is " +
                            "read by React DevTools but shouldn't be committed.
        if (effectTag > Perfo" +
                            "rmedWork) {
          if (returnFiber.lastEffect !== null) {
            returnF" +
                            "iber.lastEffect.nextEffect = workInProgress;
          } else {
            retu" +
                            "rnFiber.firstEffect = workInProgress;
          }
          returnFiber.lastEffe" +
                            "ct = workInProgress;
        }
      }

      stopWorkTimer(workInProgress);
   " +
                            "   if (true && ReactFiberInstrumentation_1.debugTool) {
        ReactFiberInstru" +
                            "mentation_1.debugTool.onCompleteWork(workInProgress);
      }

      if (sibling" +
                            "Fiber !== null) {
        // If there is more work to do in this returnFiber, do" +
                            " that next.
        return siblingFiber;
      } else if (returnFiber !== null) " +
                            "{
        // If there's no more work in this returnFiber. Complete the returnFib" +
                            "er.
        workInProgress = returnFiber;
        continue;
      } else {
     " +
                            "   // We've reached the root.
        var root = workInProgress.stateNode;
     " +
                            "   root.isReadyForCommit = true;
        return null;
      }
    }

    // With" +
                            "out this explicit null return Flow complains of invalid return type
    // TODO " +
                            "Remove the above while(true) loop
    // eslint-disable-next-line no-unreachable" +
                            "
    return null;
  }

  function performUnitOfWork(workInProgress) {
    // The" +
                            " current, flushed, state of this fiber is the alternate.
    // Ideally nothing " +
                            "should rely on this, but relying on it here
    // means that we don't need an a" +
                            "dditional field on the work in
    // progress.
    var current = workInProgress" +
                            ".alternate;

    // See if beginning this work spawns more work.
    startWorkTi" +
                            "mer(workInProgress);
    {
      ReactDebugCurrentFiber.setCurrentFiber(workInPr" +
                            "ogress);
    }
    var next = beginWork(current, workInProgress, nextRenderExpir" +
                            "ationTime);
    {
      ReactDebugCurrentFiber.resetCurrentFiber();
    }
    if" +
                            " (true && ReactFiberInstrumentation_1.debugTool) {
      ReactFiberInstrumentati" +
                            "on_1.debugTool.onBeginWork(workInProgress);
    }

    if (next === null) {
    " +
                            "  // If this doesn't spawn new work, complete the current work.
      next = com" +
                            "pleteUnitOfWork(workInProgress);
    }

    ReactCurrentOwner.current = null;

 " +
                            "   return next;
  }

  function performFailedUnitOfWork(workInProgress) {
    //" +
                            " The current, flushed, state of this fiber is the alternate.
    // Ideally noth" +
                            "ing should rely on this, but relying on it here
    // means that we don't need " +
                            "an additional field on the work in
    // progress.
    var current = workInProg" +
                            "ress.alternate;

    // See if beginning this work spawns more work.
    startWo" +
                            "rkTimer(workInProgress);
    {
      ReactDebugCurrentFiber.setCurrentFiber(work" +
                            "InProgress);
    }
    var next = beginFailedWork(current, workInProgress, nextR" +
                            "enderExpirationTime);
    {
      ReactDebugCurrentFiber.resetCurrentFiber();
  " +
                            "  }
    if (true && ReactFiberInstrumentation_1.debugTool) {
      ReactFiberIns" +
                            "trumentation_1.debugTool.onBeginWork(workInProgress);
    }

    if (next === nu" +
                            "ll) {
      // If this doesn't spawn new work, complete the current work.
      " +
                            "next = completeUnitOfWork(workInProgress);
    }

    ReactCurrentOwner.current " +
                            "= null;

    return next;
  }

  function workLoop(expirationTime) {
    if (cap" +
                            "turedErrors !== null) {
      // If there are unhandled errors, switch to the sl" +
                            "ow work loop.
      // TODO: How to avoid this check in the fast path? Maybe the" +
                            " renderer
      // could keep track of which roots have unhandled errors and cal" +
                            "l a
      // forked version of renderRoot.
      slowWorkLoopThatChecksForFailed" +
                            "Work(expirationTime);
      return;
    }
    if (nextRenderExpirationTime === N" +
                            "oWork || nextRenderExpirationTime > expirationTime) {
      return;
    }

    i" +
                            "f (nextRenderExpirationTime <= mostRecentCurrentTime) {
      // Flush all expir" +
                            "ed work.
      while (nextUnitOfWork !== null) {
        nextUnitOfWork = perfor" +
                            "mUnitOfWork(nextUnitOfWork);
      }
    } else {
      // Flush asynchronous wo" +
                            "rk until the deadline runs out of time.
      while (nextUnitOfWork !== null && " +
                            "!shouldYield()) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  " +
                            "    }
    }
  }

  function slowWorkLoopThatChecksForFailedWork(expirationTime) " +
                            "{
    if (nextRenderExpirationTime === NoWork || nextRenderExpirationTime > expi" +
                            "rationTime) {
      return;
    }

    if (nextRenderExpirationTime <= mostRecen" +
                            "tCurrentTime) {
      // Flush all expired work.
      while (nextUnitOfWork !==" +
                            " null) {
        if (hasCapturedError(nextUnitOfWork)) {
          // Use a fork" +
                            "ed version of performUnitOfWork
          nextUnitOfWork = performFailedUnitOfWo" +
                            "rk(nextUnitOfWork);
        } else {
          nextUnitOfWork = performUnitOfWor" +
                            "k(nextUnitOfWork);
        }
      }
    } else {
      // Flush asynchronous wo" +
                            "rk until the deadline runs out of time.
      while (nextUnitOfWork !== null && " +
                            "!shouldYield()) {
        if (hasCapturedError(nextUnitOfWork)) {
          // U" +
                            "se a forked version of performUnitOfWork
          nextUnitOfWork = performFaile" +
                            "dUnitOfWork(nextUnitOfWork);
        } else {
          nextUnitOfWork = perform" +
                            "UnitOfWork(nextUnitOfWork);
        }
      }
    }
  }

  function renderRootCa" +
                            "tchBlock(root, failedWork, boundary, expirationTime) {
    // We're going to res" +
                            "tart the error boundary that captured the error.
    // Conceptually, we're unwi" +
                            "nding the stack. We need to unwind the
    // context stack, too.
    unwindCont" +
                            "exts(failedWork, boundary);

    // Restart the error boundary using a forked ve" +
                            "rsion of
    // performUnitOfWork that deletes the boundary's children. The enti" +
                            "re
    // failed subree will be unmounted. During the commit phase, a special
  " +
                            "  // lifecycle method is called on the error boundary, which triggers
    // a r" +
                            "e-render.
    nextUnitOfWork = performFailedUnitOfWork(boundary);

    // Contin" +
                            "ue working.
    workLoop(expirationTime);
  }

  function renderRoot(root, expir" +
                            "ationTime) {
    !!isWorking ? invariant_1$1(false, 'renderRoot was called recur" +
                            "sively. This error is likely caused by a bug in React. Please file an issue.') :" +
                            " void 0;
    isWorking = true;

    // We're about to mutate the work-in-progres" +
                            "s tree. If the root was pending
    // commit, it no longer is: we'll need to co" +
                            "mplete it again.
    root.isReadyForCommit = false;

    // Check if we're start" +
                            "ing from a fresh stack, or if we're resuming from
    // previously yielded work" +
                            ".
    if (root !== nextRoot || expirationTime !== nextRenderExpirationTime || ne" +
                            "xtUnitOfWork === null) {
      // Reset the stack and start working from the roo" +
                            "t.
      resetContextStack();
      nextRoot = root;
      nextRenderExpirationT" +
                            "ime = expirationTime;
      nextUnitOfWork = createWorkInProgress(nextRoot.curre" +
                            "nt, null, expirationTime);
    }

    startWorkLoopTimer(nextUnitOfWork);

    v" +
                            "ar didError = false;
    var error = null;
    {
      invokeGuardedCallback$1(n" +
                            "ull, workLoop, null, expirationTime);
      if (hasCaughtError()) {
        didE" +
                            "rror = true;
        error = clearCaughtError();
      }
    }

    // An error " +
                            "was thrown during the render phase.
    while (didError) {
      if (didFatal) {" +
                            "
        // This was a fatal error. Don't attempt to recover from it.
        fi" +
                            "rstUncaughtError = error;
        break;
      }

      var failedWork = nextUni" +
                            "tOfWork;
      if (failedWork === null) {
        // An error was thrown but the" +
                            "re's no current unit of work. This can
        // happen during the commit phase" +
                            " if there's a bug in the renderer.
        didFatal = true;
        continue;
  " +
                            "    }

      // "Capture" the error by finding the nearest boundary. If there is" +
                            " no
      // error boundary, we use the root.
      var boundary = captureError(" +
                            "failedWork, error);
      !(boundary !== null) ? invariant_1$1(false, 'Should ha" +
                            "ve found an error boundary. This error is likely caused by a bug in React. Pleas" +
                            "e file an issue.') : void 0;

      if (didFatal) {
        // The error we just" +
                            " captured was a fatal error. This happens
        // when the error propagates t" +
                            "o the root more than once.
        continue;
      }

      didError = false;
  " +
                            "    error = null;
      {
        invokeGuardedCallback$1(null, renderRootCatchB" +
                            "lock, null, root, failedWork, boundary, expirationTime);
        if (hasCaughtEr" +
                            "ror()) {
          didError = true;
          error = clearCaughtError();
      " +
                            "    continue;
        }
      }
      // We're finished working. Exit the error " +
                            "loop.
      break;
    }

    var uncaughtError = firstUncaughtError;

    // We" +
                            "'re done performing work. Time to clean up.
    stopWorkLoopTimer(interruptedBy)" +
                            ";
    interruptedBy = null;
    isWorking = false;
    didFatal = false;
    fir" +
                            "stUncaughtError = null;

    if (uncaughtError !== null) {
      onUncaughtError" +
                            "(uncaughtError);
    }

    return root.isReadyForCommit ? root.current.alternat" +
                            "e : null;
  }

  // Returns the boundary that captured the error, or null if the" +
                            " error is ignored
  function captureError(failedWork, error) {
    // It is no l" +
                            "onger valid because we exited the user code.
    ReactCurrentOwner.current = nul" +
                            "l;
    {
      ReactDebugCurrentFiber.resetCurrentFiber();
    }

    // Search " +
                            "for the nearest error boundary.
    var boundary = null;

    // Passed to logCa" +
                            "pturedError()
    var errorBoundaryFound = false;
    var willRetry = false;
   " +
                            " var errorBoundaryName = null;

    // Host containers are a special case. If th" +
                            "e failed work itself is a host
    // container, then it acts as its own boundar" +
                            "y. In all other cases, we
    // ignore the work itself and only search through " +
                            "the parents.
    if (failedWork.tag === HostRoot) {
      boundary = failedWork;" +
                            "

      if (isFailedBoundary(failedWork)) {
        // If this root already fail" +
                            "ed, there must have been an error when
        // attempting to unmount it. This" +
                            " is a worst-case scenario and
        // should only be possible if there's a bu" +
                            "g in the renderer.
        didFatal = true;
      }
    } else {
      var node " +
                            "= failedWork['return'];
      while (node !== null && boundary === null) {
     " +
                            "   if (node.tag === ClassComponent) {
          var instance = node.stateNode;
 " +
                            "         if (typeof instance.componentDidCatch === 'function') {
            err" +
                            "orBoundaryFound = true;
            errorBoundaryName = getComponentName(node);
" +
                            "
            // Found an error boundary!
            boundary = node;
          " +
                            "  willRetry = true;
          }
        } else if (node.tag === HostRoot) {
    " +
                            "      // Treat the root like a no-op error boundary
          boundary = node;
 " +
                            "       }

        if (isFailedBoundary(node)) {
          // This boundary is al" +
                            "ready in a failed state.

          // If we're currently unmounting, that means" +
                            " this error was
          // thrown while unmounting a failed subtree. We should" +
                            " ignore
          // the error.
          if (isUnmounting) {
            return" +
                            " null;
          }

          // If we're in the commit phase, we should check t" +
                            "o see if
          // this boundary already captured an error during this commit" +
                            ".
          // This case exists because multiple errors can be thrown during
   " +
                            "       // a single commit without interruption.
          if (commitPhaseBoundar" +
                            "ies !== null && (commitPhaseBoundaries.has(node) || node.alternate !== null && c" +
                            "ommitPhaseBoundaries.has(node.alternate))) {
            // If so, we should ign" +
                            "ore this error.
            return null;
          }

          // The error sho" +
                            "uld propagate to the next boundary -â€” we keep looking.
          boundary = nu" +
                            "ll;
          willRetry = false;
        }

        node = node['return'];
     " +
                            " }
    }

    if (boundary !== null) {
      // Add to the collection of failed " +
                            "boundaries. This lets us know that
      // subsequent errors in this subtree sh" +
                            "ould propagate to the next boundary.
      if (failedBoundaries === null) {
    " +
                            "    failedBoundaries = new Set();
      }
      failedBoundaries.add(boundary);
" +
                            "
      // This method is unsafe outside of the begin and complete phases.
      " +
                            "// We might be in the commit phase when an error is captured.
      // The risk " +
                            "is that the return path from this Fiber may not be accurate.
      // That risk " +
                            "is acceptable given the benefit of providing users more context.
      var _comp" +
                            "onentStack = getStackAddendumByWorkInProgressFiber(failedWork);
      var _compo" +
                            "nentName = getComponentName(failedWork);

      // Add to the collection of capt" +
                            "ured errors. This is stored as a global
      // map of errors and their compone" +
                            "nt stack location keyed by the boundaries
      // that capture them. We mostly " +
                            "use this Map as a Set; it's a Map only to
      // avoid adding a field to Fiber" +
                            " to store the error.
      if (capturedErrors === null) {
        capturedErrors" +
                            " = new Map();
      }

      var capturedError = {
        componentName: _compo" +
                            "nentName,
        componentStack: _componentStack,
        error: error,
       " +
                            " errorBoundary: errorBoundaryFound ? boundary.stateNode : null,
        errorBou" +
                            "ndaryFound: errorBoundaryFound,
        errorBoundaryName: errorBoundaryName,
  " +
                            "      willRetry: willRetry
      };

      capturedErrors.set(boundary, captured" +
                            "Error);

      try {
        logCapturedError(capturedError);
      } catch (e) " +
                            "{
        // Prevent cycle if logCapturedError() throws.
        // A cycle may " +
                            "still occur if logCapturedError renders a component that throws.
        console" +
                            ".error(e);
      }

      // If we're in the commit phase, defer scheduling an u" +
                            "pdate on the
      // boundary until after the commit is complete
      if (isCo" +
                            "mmitting) {
        if (commitPhaseBoundaries === null) {
          commitPhaseB" +
                            "oundaries = new Set();
        }
        commitPhaseBoundaries.add(boundary);
  " +
                            "    } else {
        // Otherwise, schedule an update now.
        // TODO: Is t" +
                            "his actually necessary during the render phase? Is it
        // possible to unw" +
                            "ind and continue rendering at the same priority,
        // without corrupting i" +
                            "nternal state?
        scheduleErrorRecovery(boundary);
      }
      return bou" +
                            "ndary;
    } else if (firstUncaughtError === null) {
      // If no boundary is " +
                            "found, we'll need to throw the error
      firstUncaughtError = error;
    }
   " +
                            " return null;
  }

  function hasCapturedError(fiber) {
    // TODO: capturedErr" +
                            "ors should store the boundary instance, to avoid needing
    // to check the alt" +
                            "ernate.
    return capturedErrors !== null && (capturedErrors.has(fiber) || fibe" +
                            "r.alternate !== null && capturedErrors.has(fiber.alternate));
  }

  function is" +
                            "FailedBoundary(fiber) {
    // TODO: failedBoundaries should store the boundary " +
                            "instance, to avoid
    // needing to check the alternate.
    return failedBound" +
                            "aries !== null && (failedBoundaries.has(fiber) || fiber.alternate !== null && fa" +
                            "iledBoundaries.has(fiber.alternate));
  }

  function commitErrorHandling(effect" +
                            "fulFiber) {
    var capturedError = void 0;
    if (capturedErrors !== null) {
 " +
                            "     capturedError = capturedErrors.get(effectfulFiber);
      capturedErrors['d" +
                            "elete'](effectfulFiber);
      if (capturedError == null) {
        if (effectfu" +
                            "lFiber.alternate !== null) {
          effectfulFiber = effectfulFiber.alternate" +
                            ";
          capturedError = capturedErrors.get(effectfulFiber);
          captur" +
                            "edErrors['delete'](effectfulFiber);
        }
      }
    }

    !(capturedError" +
                            " != null) ? invariant_1$1(false, 'No error for given unit of work. This error is" +
                            " likely caused by a bug in React. Please file an issue.') : void 0;

    switch " +
                            "(effectfulFiber.tag) {
      case ClassComponent:
        var instance = effectf" +
                            "ulFiber.stateNode;

        var info = {
          componentStack: capturedError" +
                            ".componentStack
        };

        // Allow the boundary to handle the error, u" +
                            "sually by scheduling
        // an update to itself
        instance.componentDi" +
                            "dCatch(capturedError.error, info);
        return;
      case HostRoot:
        " +
                            "if (firstUncaughtError === null) {
          firstUncaughtError = capturedError." +
                            "error;
        }
        return;
      default:
        invariant_1$1(false, 'In" +
                            "valid type of work. This error is likely caused by a bug in React. Please file a" +
                            "n issue.');
    }
  }

  function unwindContexts(from, to) {
    var node = from" +
                            ";
    while (node !== null) {
      switch (node.tag) {
        case ClassCompon" +
                            "ent:
          popContextProvider(node);
          break;
        case HostCompo" +
                            "nent:
          popHostContext(node);
          break;
        case HostRoot:
  " +
                            "        popHostContainer(node);
          break;
        case HostPortal:
      " +
                            "    popHostContainer(node);
          break;
      }
      if (node === to || no" +
                            "de.alternate === to) {
        stopFailedWorkTimer(node);
        break;
      }" +
                            " else {
        stopWorkTimer(node);
      }
      node = node['return'];
    }
" +
                            "  }

  function computeAsyncExpiration() {
    // Given the current clock time, " +
                            "returns an expiration time. We use rounding
    // to batch like updates togethe" +
                            "r.
    // Should complete within ~1000ms. 1200ms max.
    var currentTime = reca" +
                            "lculateCurrentTime();
    var expirationMs = 1000;
    var bucketSizeMs = 200;
 " +
                            "   return computeExpirationBucket(currentTime, expirationMs, bucketSizeMs);
  }
" +
                            "
  function computeExpirationForFiber(fiber) {
    var expirationTime = void 0;
" +
                            "    if (expirationContext !== NoWork) {
      // An explicit expiration context " +
                            "was set;
      expirationTime = expirationContext;
    } else if (isWorking) {
 " +
                            "     if (isCommitting) {
        // Updates that occur during the commit phase s" +
                            "hould have sync priority
        // by default.
        expirationTime = Sync;
 " +
                            "     } else {
        // Updates during the render phase should expire at the sa" +
                            "me time as
        // the work that is being rendered.
        expirationTime = " +
                            "nextRenderExpirationTime;
      }
    } else {
      // No explicit expiration c" +
                            "ontext was set, and we're not currently
      // performing work. Calculate a ne" +
                            "w expiration time.
      if (useSyncScheduling && !(fiber.internalContextTag & A" +
                            "syncUpdates)) {
        // This is a sync update
        expirationTime = Sync;
" +
                            "      } else {
        // This is an async update
        expirationTime = compu" +
                            "teAsyncExpiration();
      }
    }
    return expirationTime;
  }

  function sc" +
                            "heduleWork(fiber, expirationTime) {
    return scheduleWorkImpl(fiber, expiratio" +
                            "nTime, false);
  }

  function scheduleWorkImpl(fiber, expirationTime, isErrorRe" +
                            "covery) {
    recordScheduleUpdate();

    {
      if (!isErrorRecovery && fiber" +
                            ".tag === ClassComponent) {
        var instance = fiber.stateNode;
        warnA" +
                            "boutInvalidUpdates(instance);
      }
    }

    var node = fiber;
    while (no" +
                            "de !== null) {
      // Walk the parent path to the root and update each node's
" +
                            "      // expiration time.
      if (node.expirationTime === NoWork || node.expir" +
                            "ationTime > expirationTime) {
        node.expirationTime = expirationTime;
    " +
                            "  }
      if (node.alternate !== null) {
        if (node.alternate.expirationTi" +
                            "me === NoWork || node.alternate.expirationTime > expirationTime) {
          nod" +
                            "e.alternate.expirationTime = expirationTime;
        }
      }
      if (node['r" +
                            "eturn'] === null) {
        if (node.tag === HostRoot) {
          var root = no" +
                            "de.stateNode;
          if (!isWorking && root === nextRoot && expirationTime <=" +
                            " nextRenderExpirationTime) {
            // Restart the root from the top.
     " +
                            "       if (nextUnitOfWork !== null) {
              // This is an interruption. " +
                            "(Used for performance tracking.)
              interruptedBy = fiber;
          " +
                            "  }
            nextRoot = null;
            nextUnitOfWork = null;
            " +
                            "nextRenderExpirationTime = NoWork;
          }
          requestWork(root, expir" +
                            "ationTime);
        } else {
          {
            if (!isErrorRecovery && fib" +
                            "er.tag === ClassComponent) {
              warnAboutUpdateOnUnmounted(fiber);
  " +
                            "          }
          }
          return;
        }
      }
      node = node['r" +
                            "eturn'];
    }
  }

  function scheduleErrorRecovery(fiber) {
    scheduleWorkIm" +
                            "pl(fiber, Sync, true);
  }

  function recalculateCurrentTime() {
    // Subtrac" +
                            "t initial time so it fits inside 32bits
    var ms = now() - startTime;
    most" +
                            "RecentCurrentTime = msToExpirationTime(ms);
    return mostRecentCurrentTime;
  " +
                            "}

  function deferredUpdates(fn) {
    var previousExpirationContext = expirati" +
                            "onContext;
    expirationContext = computeAsyncExpiration();
    try {
      ret" +
                            "urn fn();
    } finally {
      expirationContext = previousExpirationContext;
 " +
                            "   }
  }

  function syncUpdates(fn) {
    var previousExpirationContext = expir" +
                            "ationContext;
    expirationContext = Sync;
    try {
      return fn();
    } f" +
                            "inally {
      expirationContext = previousExpirationContext;
    }
  }

  // TO" +
                            "DO: Everything below this is written as if it has been lifted to the
  // render" +
                            "ers. I'll do this in a follow-up.

  // Linked-list of roots
  var firstSchedule" +
                            "dRoot = null;
  var lastScheduledRoot = null;

  var isCallbackScheduled = false" +
                            ";
  var isRendering = false;
  var nextFlushedRoot = null;
  var nextFlushedExpi" +
                            "rationTime = NoWork;
  var deadlineDidExpire = false;
  var hasUnhandledError = " +
                            "false;
  var unhandledError = null;
  var deadline = null;

  var isBatchingUpda" +
                            "tes = false;
  var isUnbatchingUpdates = false;

  // Use these to prevent an in" +
                            "finite loop of nested updates
  var NESTED_UPDATE_LIMIT = 1000;
  var nestedUpda" +
                            "teCount = 0;

  var timeHeuristicForUnitOfWork = 1;

  // requestWork is called " +
                            "by the scheduler whenever a root receives an update.
  // It's up to the rendere" +
                            "r to call renderRoot at some point in the future.
  function requestWork(root, e" +
                            "xpirationTime) {
    if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
      invari" +
                            "ant_1$1(false, 'Maximum update depth exceeded. This can happen when a component " +
                            "repeatedly calls setState inside componentWillUpdate or componentDidUpdate. Reac" +
                            "t limits the number of nested updates to prevent infinite loops.');
    }

    /" +
                            "/ Add the root to the schedule.
    // Check if this root is already part of the" +
                            " schedule.
    if (root.nextScheduledRoot === null) {
      // This root is not " +
                            "already scheduled. Add it.
      root.remainingExpirationTime = expirationTime;
" +
                            "      if (lastScheduledRoot === null) {
        firstScheduledRoot = lastSchedul" +
                            "edRoot = root;
        root.nextScheduledRoot = root;
      } else {
        las" +
                            "tScheduledRoot.nextScheduledRoot = root;
        lastScheduledRoot = root;
     " +
                            "   lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
      }
    } else " +
                            "{
      // This root is already scheduled, but its priority may have increased.
" +
                            "      var remainingExpirationTime = root.remainingExpirationTime;
      if (rema" +
                            "iningExpirationTime === NoWork || expirationTime < remainingExpirationTime) {
  " +
                            "      // Update the priority.
        root.remainingExpirationTime = expirationT" +
                            "ime;
      }
    }

    if (isRendering) {
      // Prevent reentrancy. Remainin" +
                            "g work will be scheduled at the end of
      // the currently rendering batch.
 " +
                            "     return;
    }

    if (isBatchingUpdates) {
      // Flush work at the end " +
                            "of the batch.
      if (isUnbatchingUpdates) {
        // ...unless we're inside" +
                            " unbatchedUpdates, in which case we should
        // flush it now.
        perf" +
                            "ormWorkOnRoot(root, Sync);
      }
      return;
    }

    // TODO: Get rid of " +
                            "Sync and use current time?
    if (expirationTime === Sync) {
      performWork(" +
                            "Sync, null);
    } else if (!isCallbackScheduled) {
      isCallbackScheduled = " +
                            "true;
      startRequestCallbackTimer();
      scheduleDeferredCallback(performA" +
                            "syncWork);
    }
  }

  function findHighestPriorityRoot() {
    var highestPrio" +
                            "rityWork = NoWork;
    var highestPriorityRoot = null;

    if (lastScheduledRoo" +
                            "t !== null) {
      var previousScheduledRoot = lastScheduledRoot;
      var roo" +
                            "t = firstScheduledRoot;
      while (root !== null) {
        var remainingExpir" +
                            "ationTime = root.remainingExpirationTime;
        if (remainingExpirationTime ==" +
                            "= NoWork) {
          // This root no longer has work. Remove it from the schedu" +
                            "ler.

          // TODO: This check is redudant, but Flow is confused by the bra" +
                            "nch
          // below where we set lastScheduledRoot to null, even though we br" +
                            "eak
          // from the loop right after.
          !(previousScheduledRoot !=" +
                            "= null && lastScheduledRoot !== null) ? invariant_1$1(false, 'Should have a prev" +
                            "ious and last root. This error is likely caused by a bug in React. Please file a" +
                            "n issue.') : void 0;
          if (root === root.nextScheduledRoot) {
          " +
                            "  // This is the only root in the list.
            root.nextScheduledRoot = nul" +
                            "l;
            firstScheduledRoot = lastScheduledRoot = null;
            break;" +
                            "
          } else if (root === firstScheduledRoot) {
            // This is the " +
                            "first root in the list.
            var next = root.nextScheduledRoot;
         " +
                            "   firstScheduledRoot = next;
            lastScheduledRoot.nextScheduledRoot = " +
                            "next;
            root.nextScheduledRoot = null;
          } else if (root === l" +
                            "astScheduledRoot) {
            // This is the last root in the list.
          " +
                            "  lastScheduledRoot = previousScheduledRoot;
            lastScheduledRoot.nextS" +
                            "cheduledRoot = firstScheduledRoot;
            root.nextScheduledRoot = null;
  " +
                            "          break;
          } else {
            previousScheduledRoot.nextSchedu" +
                            "ledRoot = root.nextScheduledRoot;
            root.nextScheduledRoot = null;
   " +
                            "       }
          root = previousScheduledRoot.nextScheduledRoot;
        } els" +
                            "e {
          if (highestPriorityWork === NoWork || remainingExpirationTime < hi" +
                            "ghestPriorityWork) {
            // Update the priority, if it's higher
        " +
                            "    highestPriorityWork = remainingExpirationTime;
            highestPriorityRo" +
                            "ot = root;
          }
          if (root === lastScheduledRoot) {
            b" +
                            "reak;
          }
          previousScheduledRoot = root;
          root = root." +
                            "nextScheduledRoot;
        }
      }
    }

    // If the next root is the same " +
                            "as the previous root, this is a nested
    // update. To prevent an infinite loo" +
                            "p, increment the nested update count.
    var previousFlushedRoot = nextFlushedR" +
                            "oot;
    if (previousFlushedRoot !== null && previousFlushedRoot === highestPrio" +
                            "rityRoot) {
      nestedUpdateCount++;
    } else {
      // Reset whenever we s" +
                            "witch roots.
      nestedUpdateCount = 0;
    }
    nextFlushedRoot = highestPri" +
                            "orityRoot;
    nextFlushedExpirationTime = highestPriorityWork;
  }

  function " +
                            "performAsyncWork(dl) {
    performWork(NoWork, dl);
  }

  function performWork(" +
                            "minExpirationTime, dl) {
    deadline = dl;

    // Keep working on roots until " +
                            "there's no more work, or until the we reach
    // the deadline.
    findHighest" +
                            "PriorityRoot();

    if (enableUserTimingAPI && deadline !== null) {
      var d" +
                            "idExpire = nextFlushedExpirationTime < recalculateCurrentTime();
      stopReque" +
                            "stCallbackTimer(didExpire);
    }

    while (nextFlushedRoot !== null && nextFl" +
                            "ushedExpirationTime !== NoWork && (minExpirationTime === NoWork || nextFlushedEx" +
                            "pirationTime <= minExpirationTime) && !deadlineDidExpire) {
      performWorkOnR" +
                            "oot(nextFlushedRoot, nextFlushedExpirationTime);
      // Find the next highest " +
                            "priority work.
      findHighestPriorityRoot();
    }

    // We're done flushin" +
                            "g work. Either we ran out of time in this callback,
    // or there's no more wo" +
                            "rk left with sufficient priority.

    // If we're inside a callback, set this t" +
                            "o false since we just completed it.
    if (deadline !== null) {
      isCallbac" +
                            "kScheduled = false;
    }
    // If there's work left over, schedule a new callb" +
                            "ack.
    if (nextFlushedRoot !== null && !isCallbackScheduled) {
      isCallbac" +
                            "kScheduled = true;
      startRequestCallbackTimer();
      scheduleDeferredCall" +
                            "back(performAsyncWork);
    }

    // Clean-up.
    deadline = null;
    deadlin" +
                            "eDidExpire = false;
    nestedUpdateCount = 0;

    if (hasUnhandledError) {
   " +
                            "   var _error4 = unhandledError;
      unhandledError = null;
      hasUnhandled" +
                            "Error = false;
      throw _error4;
    }
  }

  function performWorkOnRoot(root" +
                            ", expirationTime) {
    !!isRendering ? invariant_1$1(false, 'performWorkOnRoot " +
                            "was called recursively. This error is likely caused by a bug in React. Please fi" +
                            "le an issue.') : void 0;

    isRendering = true;

    // Check if this is async" +
                            " work or sync/expired work.
    // TODO: Pass current time as argument to render" +
                            "Root, commitRoot
    if (expirationTime <= recalculateCurrentTime()) {
      // " +
                            "Flush sync work.
      var finishedWork = root.finishedWork;
      if (finishedW" +
                            "ork !== null) {
        // This root is already complete. We can commit it.
    " +
                            "    root.finishedWork = null;
        root.remainingExpirationTime = commitRoot(" +
                            "finishedWork);
      } else {
        root.finishedWork = null;
        finished" +
                            "Work = renderRoot(root, expirationTime);
        if (finishedWork !== null) {
  " +
                            "        // We've completed the root. Commit it.
          root.remainingExpirati" +
                            "onTime = commitRoot(finishedWork);
        }
      }
    } else {
      // Flush" +
                            " async work.
      var _finishedWork = root.finishedWork;
      if (_finishedWor" +
                            "k !== null) {
        // This root is already complete. We can commit it.
      " +
                            "  root.finishedWork = null;
        root.remainingExpirationTime = commitRoot(_f" +
                            "inishedWork);
      } else {
        root.finishedWork = null;
        _finished" +
                            "Work = renderRoot(root, expirationTime);
        if (_finishedWork !== null) {
 " +
                            "         // We've completed the root. Check the deadline one more time
         " +
                            " // before committing.
          if (!shouldYield()) {
            // Still time" +
                            " left. Commit the root.
            root.remainingExpirationTime = commitRoot(_f" +
                            "inishedWork);
          } else {
            // There's no time left. Mark this " +
                            "root as complete. We'll come
            // back and commit it later.
          " +
                            "  root.finishedWork = _finishedWork;
          }
        }
      }
    }

    is" +
                            "Rendering = false;
  }

  // When working on async work, the reconciler asks the" +
                            " renderer if it should
  // yield execution. For DOM, we implement this with req" +
                            "uestIdleCallback.
  function shouldYield() {
    if (deadline === null) {
      " +
                            "return false;
    }
    if (deadline.timeRemaining() > timeHeuristicForUnitOfWor" +
                            "k) {
      return false;
    }
    deadlineDidExpire = true;
    return true;
  " +
                            "}

  // TODO: Not happy about this hook. Conceptually, renderRoot should return " +
                            "a
  // tuple of (isReadyForCommit, didError, error)
  function onUncaughtError(e" +
                            "rror) {
    !(nextFlushedRoot !== null) ? invariant_1$1(false, 'Should be workin" +
                            "g on a root. This error is likely caused by a bug in React. Please file an issue" +
                            ".') : void 0;
    // Unschedule this root so we don't work on it again until the" +
                            "re's
    // another update.
    nextFlushedRoot.remainingExpirationTime = NoWork" +
                            ";
    if (!hasUnhandledError) {
      hasUnhandledError = true;
      unhandledE" +
                            "rror = error;
    }
  }

  // TODO: Batching should be implemented at the render" +
                            "er level, not inside
  // the reconciler.
  function batchedUpdates(fn, a) {
   " +
                            " var previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingUpdates = true" +
                            ";
    try {
      return fn(a);
    } finally {
      isBatchingUpdates = previo" +
                            "usIsBatchingUpdates;
      if (!isBatchingUpdates && !isRendering) {
        per" +
                            "formWork(Sync, null);
      }
    }
  }

  // TODO: Batching should be implement" +
                            "ed at the renderer level, not inside
  // the reconciler.
  function unbatchedUp" +
                            "dates(fn) {
    if (isBatchingUpdates && !isUnbatchingUpdates) {
      isUnbatch" +
                            "ingUpdates = true;
      try {
        return fn();
      } finally {
        is" +
                            "UnbatchingUpdates = false;
      }
    }
    return fn();
  }

  // TODO: Batchi" +
                            "ng should be implemented at the renderer level, not within
  // the reconciler.
" +
                            "  function flushSync(fn) {
    var previousIsBatchingUpdates = isBatchingUpdates" +
                            ";
    isBatchingUpdates = true;
    try {
      return syncUpdates(fn);
    } fi" +
                            "nally {
      isBatchingUpdates = previousIsBatchingUpdates;
      !!isRendering" +
                            " ? invariant_1$1(false, 'flushSync was called from inside a lifecycle method. It" +
                            " cannot be called when React is already rendering.') : void 0;
      performWork" +
                            "(Sync, null);
    }
  }

  return {
    computeAsyncExpiration: computeAsyncExpi" +
                            "ration,
    computeExpirationForFiber: computeExpirationForFiber,
    scheduleWo" +
                            "rk: scheduleWork,
    batchedUpdates: batchedUpdates,
    unbatchedUpdates: unba" +
                            "tchedUpdates,
    flushSync: flushSync,
    deferredUpdates: deferredUpdates
  }" +
                            ";
};

{
  var didWarnAboutNestedUpdates = false;
}

// 0 is PROD, 1 is DEV.
// M" +
                            "ight add PROFILE later.


function getContextForSubtree(parentComponent) {
  if " +
                            "(!parentComponent) {
    return emptyObject_1;
  }

  var fiber = get(parentComp" +
                            "onent);
  var parentContext = findCurrentUnmaskedContext(fiber);
  return isCont" +
                            "extProvider(fiber) ? processChildContext(fiber, parentContext) : parentContext;
" +
                            "}

var ReactFiberReconciler$1 = function (config) {
  var getPublicInstance = co" +
                            "nfig.getPublicInstance;

  var _ReactFiberScheduler = ReactFiberScheduler(config" +
                            "),
      computeAsyncExpiration = _ReactFiberScheduler.computeAsyncExpiration,
 " +
                            "     computeExpirationForFiber = _ReactFiberScheduler.computeExpirationForFiber," +
                            "
      scheduleWork = _ReactFiberScheduler.scheduleWork,
      batchedUpdates = " +
                            "_ReactFiberScheduler.batchedUpdates,
      unbatchedUpdates = _ReactFiberSchedul" +
                            "er.unbatchedUpdates,
      flushSync = _ReactFiberScheduler.flushSync,
      def" +
                            "erredUpdates = _ReactFiberScheduler.deferredUpdates;

  function scheduleTopLeve" +
                            "lUpdate(current, element, callback) {
    {
      if (ReactDebugCurrentFiber.pha" +
                            "se === 'render' && ReactDebugCurrentFiber.current !== null && !didWarnAboutNeste" +
                            "dUpdates) {
        didWarnAboutNestedUpdates = true;
        warning_1$1(false," +
                            " 'Render methods should be a pure function of props and state; ' + 'triggering n" +
                            "ested component updates from render is not allowed. ' + 'If necessary, trigger n" +
                            "ested updates in componentDidUpdate.\n\n' + 'Check the render method of %s.', ge" +
                            "tComponentName(ReactDebugCurrentFiber.current) || 'Unknown');
      }
    }

   " +
                            " callback = callback === undefined ? null : callback;
    {
      warning_1$1(ca" +
                            "llback === null || typeof callback === 'function', 'render(...): Expected the la" +
                            "st optional `callback` argument to be a ' + 'function. Instead received: %s.', c" +
                            "allback);
    }

    var expirationTime = void 0;
    // Check if the top-level " +
                            "element is an async wrapper component. If so,
    // treat updates to the root a" +
                            "s async. This is a bit weird but lets us
    // avoid a separate `renderAsync` A" +
                            "PI.
    if (enableAsyncSubtreeAPI && element != null && element.type != null && " +
                            "element.type.prototype != null && element.type.prototype.unstable_isAsyncReactCo" +
                            "mponent === true) {
      expirationTime = computeAsyncExpiration();
    } else " +
                            "{
      expirationTime = computeExpirationForFiber(current);
    }

    var upda" +
                            "te = {
      expirationTime: expirationTime,
      partialState: { element: elem" +
                            "ent },
      callback: callback,
      isReplace: false,
      isForced: false,
" +
                            "      nextCallback: null,
      next: null
    };
    insertUpdateIntoFiber(curr" +
                            "ent, update);
    scheduleWork(current, expirationTime);
  }

  function findHos" +
                            "tInstance(fiber) {
    var hostFiber = findCurrentHostFiber(fiber);
    if (host" +
                            "Fiber === null) {
      return null;
    }
    return hostFiber.stateNode;
  }

" +
                            "  return {
    createContainer: function (containerInfo, hydrate) {
      return" +
                            " createFiberRoot(containerInfo, hydrate);
    },
    updateContainer: function (" +
                            "element, container, parentComponent, callback) {
      // TODO: If this is a nes" +
                            "ted container, this won't be the root.
      var current = container.current;

 " +
                            "     {
        if (ReactFiberInstrumentation_1.debugTool) {
          if (curren" +
                            "t.alternate === null) {
            ReactFiberInstrumentation_1.debugTool.onMoun" +
                            "tContainer(container);
          } else if (element === null) {
            Reac" +
                            "tFiberInstrumentation_1.debugTool.onUnmountContainer(container);
          } els" +
                            "e {
            ReactFiberInstrumentation_1.debugTool.onUpdateContainer(containe" +
                            "r);
          }
        }
      }

      var context = getContextForSubtree(pare" +
                            "ntComponent);
      if (container.context === null) {
        container.context " +
                            "= context;
      } else {
        container.pendingContext = context;
      }

 " +
                            "     scheduleTopLevelUpdate(current, element, callback);
    },


    batchedUpd" +
                            "ates: batchedUpdates,

    unbatchedUpdates: unbatchedUpdates,

    deferredUpda" +
                            "tes: deferredUpdates,

    flushSync: flushSync,

    getPublicRootInstance: fun" +
                            "ction (container) {
      var containerFiber = container.current;
      if (!con" +
                            "tainerFiber.child) {
        return null;
      }
      switch (containerFiber.c" +
                            "hild.tag) {
        case HostComponent:
          return getPublicInstance(conta" +
                            "inerFiber.child.stateNode);
        default:
          return containerFiber.chi" +
                            "ld.stateNode;
      }
    },


    findHostInstance: findHostInstance,

    find" +
                            "HostInstanceWithNoPortals: function (fiber) {
      var hostFiber = findCurrentH" +
                            "ostFiberWithNoPortals(fiber);
      if (hostFiber === null) {
        return nul" +
                            "l;
      }
      return hostFiber.stateNode;
    },
    injectIntoDevTools: func" +
                            "tion (devToolsConfig) {
      var findFiberByHostInstance = devToolsConfig.findF" +
                            "iberByHostInstance;

      return injectInternals(_assign({}, devToolsConfig, {
" +
                            "        findHostInstanceByFiber: function (fiber) {
          return findHostIns" +
                            "tance(fiber);
        },
        findFiberByHostInstance: function (instance) {
" +
                            "          if (!findFiberByHostInstance) {
            // Might not be implemente" +
                            "d by the renderer.
            return null;
          }
          return findFib" +
                            "erByHostInstance(instance);
        }
      }));
    }
  };
};

var ReactFiberRe" +
                            "conciler$2 = Object.freeze({
	default: ReactFiberReconciler$1
});

var ReactFibe" +
                            "rReconciler$3 = ( ReactFiberReconciler$2 && ReactFiberReconciler$1 ) || ReactFib" +
                            "erReconciler$2;

// TODO: bundle Flow types with the package.



// TODO: decide" +
                            " on the top-level export form.
// This is hacky but makes it work with both Roll" +
                            "up and Jest.
var reactReconciler = ReactFiberReconciler$3['default'] ? ReactFibe" +
                            "rReconciler$3['default'] : ReactFiberReconciler$3;

// TODO: this is special bec" +
                            "ause it gets imported during build.

var ReactVersion = '16.1.1';

// a requestA" +
                            "nimationFrame, storing the time for the start of the frame, then
// scheduling a" +
                            " postMessage which gets scheduled after paint. Within the
// postMessage handler" +
                            " do as much work as possible until time + frame rate.
// By separating the idle " +
                            "call into a separate event tick we ensure that
// layout, paint and other browse" +
                            "r work is counted against the available time.
// The frame rate is dynamically a" +
                            "djusted.

{
  if (ExecutionEnvironment_1.canUseDOM && typeof requestAnimationFra" +
                            "me !== 'function') {
    warning_1$1(false, 'React depends on requestAnimationFr" +
                            "ame. Make sure that you load a ' + 'polyfill in older browsers. http://fb.me/rea" +
                            "ct-polyfills');
  }
}

var hasNativePerformanceNow = typeof performance === 'obj" +
                            "ect' && typeof performance.now === 'function';

var now = void 0;
if (hasNativeP" +
                            "erformanceNow) {
  now = function () {
    return performance.now();
  };
} else" +
                            " {
  now = function () {
    return Date.now();
  };
}

// TODO: There's no way " +
                            "to cancel, because Fiber doesn't atm.
var rIC = void 0;

if (!ExecutionEnvironme" +
                            "nt_1.canUseDOM) {
  rIC = function (frameCallback) {
    setTimeout(function () " +
                            "{
      frameCallback({
        timeRemaining: function () {
          return In" +
                            "finity;
        }
      });
    });
    return 0;
  };
} else if (typeof request" +
                            "IdleCallback !== 'function') {
  // Polyfill requestIdleCallback.

  var schedul" +
                            "edRICCallback = null;

  var isIdleScheduled = false;
  var isAnimationFrameSche" +
                            "duled = false;

  var frameDeadline = 0;
  // We start out assuming that we run " +
                            "at 30fps but then the heuristic tracking
  // will adjust this value to a faster" +
                            " fps if we get more frequent animation
  // frames.
  var previousFrameTime = 33" +
                            ";
  var activeFrameTime = 33;

  var frameDeadlineObject;
  if (hasNativePerform" +
                            "anceNow) {
    frameDeadlineObject = {
      timeRemaining: function () {
      " +
                            "  // We assume that if we have a performance timer that the rAF callback
       " +
                            " // gets a performance timer value. Not sure if this is always true.
        ret" +
                            "urn frameDeadline - performance.now();
      }
    };
  } else {
    frameDeadli" +
                            "neObject = {
      timeRemaining: function () {
        // Fallback to Date.now(" +
                            ")
        return frameDeadline - Date.now();
      }
    };
  }

  // We use the" +
                            " postMessage trick to defer idle work until after the repaint.
  var messageKey " +
                            "= '__reactIdleCallback$' + Math.random().toString(36).slice(2);
  var idleTick =" +
                            " function (event) {
    if (event.source !== window || event.data !== messageKey" +
                            ") {
      return;
    }
    isIdleScheduled = false;
    var callback = schedule" +
                            "dRICCallback;
    scheduledRICCallback = null;
    if (callback !== null) {
    " +
                            "  callback(frameDeadlineObject);
    }
  };
  // Assumes that we have addEventLi" +
                            "stener in this environment. Might need
  // something better for old IE.
  windo" +
                            "w.addEventListener('message', idleTick, false);

  var animationTick = function " +
                            "(rafTime) {
    isAnimationFrameScheduled = false;
    var nextFrameTime = rafTi" +
                            "me - frameDeadline + activeFrameTime;
    if (nextFrameTime < activeFrameTime &&" +
                            " previousFrameTime < activeFrameTime) {
      if (nextFrameTime < 8) {
        /" +
                            "/ Defensive coding. We don't support higher frame rates than 120hz.
        // I" +
                            "f we get lower than that, it is probably a bug.
        nextFrameTime = 8;
     " +
                            " }
      // If one frame goes long, then the next one can be short to catch up.
" +
                            "      // If two frames are short in a row, then that's an indication that we
   " +
                            "   // actually have a higher frame rate than what we're currently optimizing.
  " +
                            "    // We adjust our heuristic dynamically accordingly. For example, if we're
  " +
                            "    // running on 120hz display or 90hz VR display.
      // Take the max of the" +
                            " two in case one of them was an anomaly due to
      // missed frame deadlines.
" +
                            "      activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : " +
                            "nextFrameTime;
    } else {
      previousFrameTime = nextFrameTime;
    }
    f" +
                            "rameDeadline = rafTime + activeFrameTime;
    if (!isIdleScheduled) {
      isId" +
                            "leScheduled = true;
      window.postMessage(messageKey, '*');
    }
  };

  rIC" +
                            " = function (callback) {
    // This assumes that we only schedule one callback " +
                            "at a time because that's
    // how Fiber uses it.
    scheduledRICCallback = ca" +
                            "llback;
    if (!isAnimationFrameScheduled) {
      // If rAF didn't already sch" +
                            "edule one, we need to schedule a frame.
      // TODO: If this rAF doesn't mater" +
                            "ialize because the browser throttles, we
      // might want to still have setTi" +
                            "meout trigger rIC as a backup to ensure
      // that we keep performing work.
 " +
                            "     isAnimationFrameScheduled = true;
      requestAnimationFrame(animationTick" +
                            ");
    }
    return 0;
  };
} else {
  rIC = requestIdleCallback;
}

/**
 * Fork" +
                            "ed from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb" +
                            "54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change" +
                            " is we use console.warn instead of console.error,
 * and do nothing when 'consol" +
                            "e' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to in" +
                            "variant but only logs a warning if the condition is not met.
 * This can be used" +
                            " to log issues in development environments in critical
 * paths. Removing the lo" +
                            "gging code for production environments will keep the
 * same logic and follow th" +
                            "e same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printW" +
                            "arning$1 = function (format) {
    for (var _len = arguments.length, args = Arra" +
                            "y(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1" +
                            "] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' " +
                            "+ format.replace(/%s/g, function () {
      return args[argIndex++];
    });
   " +
                            " if (typeof console !== 'undefined') {
      console.warn(message);
    }
    tr" +
                            "y {
      // --- Welcome to debugging React ---
      // This error was thrown a" +
                            "s a convenience so that you can use this stack
      // to find the callsite tha" +
                            "t caused this warning to fire.
      throw new Error(message);
    } catch (x) {" +
                            "}
  };

  lowPriorityWarning = function (condition, format) {
    if (format ===" +
                            " undefined) {
      throw new Error('`warning(condition, format, ...args)` requi" +
                            "res a warning ' + 'message argument');
    }
    if (!condition) {
      for (va" +
                            "r _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; " +
                            "_key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

 " +
                            "     printWarning$1.apply(undefined, [format].concat(args));
    }
  };
}

var l" +
                            "owPriorityWarning$1 = lowPriorityWarning;

// isAttributeNameSafe() is currently" +
                            " duplicated in DOMMarkupOperations.
// TODO: Find a better place for this.
var V" +
                            "ALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' +" +
                            " ATTRIBUTE_NAME_CHAR + ']*$');
var illegalAttributeNameCache = {};
var validated" +
                            "AttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
  if (val" +
                            "idatedAttributeNameCache.hasOwnProperty(attributeName)) {
    return true;
  }
 " +
                            " if (illegalAttributeNameCache.hasOwnProperty(attributeName)) {
    return false" +
                            ";
  }
  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttri" +
                            "buteNameCache[attributeName] = true;
    return true;
  }
  illegalAttributeName" +
                            "Cache[attributeName] = true;
  {
    warning_1$1(false, 'Invalid attribute name:" +
                            " `%s`', attributeName);
  }
  return false;
}

// shouldIgnoreValue() is current" +
                            "ly duplicated in DOMMarkupOperations.
// TODO: Find a better place for this.
fun" +
                            "ction shouldIgnoreValue(propertyInfo, value) {
  return value == null || propert" +
                            "yInfo.hasBooleanValue && !value || propertyInfo.hasNumericValue && isNaN(value) " +
                            "|| propertyInfo.hasPositiveNumericValue && value < 1 || propertyInfo.hasOverload" +
                            "edBooleanValue && value === false;
}

/**
 * Operations for dealing with DOM pro" +
                            "perties.
 */





/**
 * Get the value for a property on a node. Only used in DE" +
                            "V for SSR validation.
 * The "expected" argument is used as a hint of what the e" +
                            "xpected value is.
 * Some properties have multiple equivalent values.
 */
functi" +
                            "on getValueForProperty(node, name, expected) {
  {
    var propertyInfo = getPro" +
                            "pertyInfo(name);
    if (propertyInfo) {
      var mutationMethod = propertyInfo" +
                            ".mutationMethod;
      if (mutationMethod || propertyInfo.mustUseProperty) {
   " +
                            "     return node[propertyInfo.propertyName];
      } else {
        var attribut" +
                            "eName = propertyInfo.attributeName;

        var stringValue = null;

        if" +
                            " (propertyInfo.hasOverloadedBooleanValue) {
          if (node.hasAttribute(attr" +
                            "ibuteName)) {
            var value = node.getAttribute(attributeName);
        " +
                            "    if (value === '') {
              return true;
            }
            if " +
                            "(shouldIgnoreValue(propertyInfo, expected)) {
              return value;
      " +
                            "      }
            if (value === '' + expected) {
              return expected" +
                            ";
            }
            return value;
          }
        } else if (node.ha" +
                            "sAttribute(attributeName)) {
          if (shouldIgnoreValue(propertyInfo, expec" +
                            "ted)) {
            // We had an attribute but shouldn't have had one, so read i" +
                            "t
            // for the error message.
            return node.getAttribute(att" +
                            "ributeName);
          }
          if (propertyInfo.hasBooleanValue) {
         " +
                            "   // If this was a boolean, it doesn't matter what the value is
            // " +
                            "the fact that we have it is the same as the expected.
            return expecte" +
                            "d;
          }
          // Even if this property uses a namespace we use getAtt" +
                            "ribute
          // because we assume its namespaced name is the same as our con" +
                            "fig.
          // To use getAttributeNS we need the local name which we don't ha" +
                            "ve
          // in our config atm.
          stringValue = node.getAttribute(att" +
                            "ributeName);
        }

        if (shouldIgnoreValue(propertyInfo, expected)) {" +
                            "
          return stringValue === null ? expected : stringValue;
        } else " +
                            "if (stringValue === '' + expected) {
          return expected;
        } else {" +
                            "
          return stringValue;
        }
      }
    }
  }
}

/**
 * Get the val" +
                            "ue for a attribute on a node. Only used in DEV for SSR validation.
 * The third " +
                            "argument is used as a hint of what the expected value is. Some
 * attributes hav" +
                            "e multiple equivalent values.
 */
function getValueForAttribute(node, name, expe" +
                            "cted) {
  {
    if (!isAttributeNameSafe(name)) {
      return;
    }
    if (!n" +
                            "ode.hasAttribute(name)) {
      return expected === undefined ? undefined : null" +
                            ";
    }
    var value = node.getAttribute(name);
    if (value === '' + expected" +
                            ") {
      return expected;
    }
    return value;
  }
}

/**
 * Sets the value " +
                            "for a property on a node.
 *
 * @param {DOMElement} node
 * @param {string} name" +
                            "
 * @param {*} value
 */
function setValueForProperty(node, name, value) {
  var" +
                            " propertyInfo = getPropertyInfo(name);

  if (propertyInfo && shouldSetAttribute" +
                            "(name, value)) {
    var mutationMethod = propertyInfo.mutationMethod;
    if (m" +
                            "utationMethod) {
      mutationMethod(node, value);
    } else if (shouldIgnoreV" +
                            "alue(propertyInfo, value)) {
      deleteValueForProperty(node, name);
      ret" +
                            "urn;
    } else if (propertyInfo.mustUseProperty) {
      // Contrary to `setAtt" +
                            "ribute`, object properties are properly
      // `toString`ed by IE8/9.
      no" +
                            "de[propertyInfo.propertyName] = value;
    } else {
      var attributeName = pr" +
                            "opertyInfo.attributeName;
      var namespace = propertyInfo.attributeNamespace;" +
                            "
      // `setAttribute` with objects becomes only `[object]` in IE8/9,
      //" +
                            " ('' + value) makes it output the correct toString()-value.
      if (namespace)" +
                            " {
        node.setAttributeNS(namespace, attributeName, '' + value);
      } el" +
                            "se if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue &&" +
                            " value === true) {
        node.setAttribute(attributeName, '');
      } else {
" +
                            "        node.setAttribute(attributeName, '' + value);
      }
    }
  } else {
 " +
                            "   setValueForAttribute(node, name, shouldSetAttribute(name, value) ? value : nu" +
                            "ll);
    return;
  }

  {
    
  }
}

function setValueForAttribute(node, name, " +
                            "value) {
  if (!isAttributeNameSafe(name)) {
    return;
  }
  if (value == null" +
                            ") {
    node.removeAttribute(name);
  } else {
    node.setAttribute(name, '' + " +
                            "value);
  }

  {
    
  }
}

/**
 * Deletes an attributes from a node.
 *
 * @pa" +
                            "ram {DOMElement} node
 * @param {string} name
 */
function deleteValueForAttribu" +
                            "te(node, name) {
  node.removeAttribute(name);
}

/**
 * Deletes the value for a" +
                            " property on a node.
 *
 * @param {DOMElement} node
 * @param {string} name
 */
" +
                            "function deleteValueForProperty(node, name) {
  var propertyInfo = getPropertyIn" +
                            "fo(name);
  if (propertyInfo) {
    var mutationMethod = propertyInfo.mutationMe" +
                            "thod;
    if (mutationMethod) {
      mutationMethod(node, undefined);
    } els" +
                            "e if (propertyInfo.mustUseProperty) {
      var propName = propertyInfo.property" +
                            "Name;
      if (propertyInfo.hasBooleanValue) {
        node[propName] = false;
" +
                            "      } else {
        node[propName] = '';
      }
    } else {
      node.remo" +
                            "veAttribute(propertyInfo.attributeName);
    }
  } else {
    node.removeAttribu" +
                            "te(name);
  }
}

var ReactControlledValuePropTypes = {
  checkPropTypes: null
};" +
                            "

{
  var hasReadOnlyValue = {
    button: true,
    checkbox: true,
    image: " +
                            "true,
    hidden: true,
    radio: true,
    reset: true,
    submit: true
  };
" +
                            "
  var propTypes = {
    value: function (props, propName, componentName) {
    " +
                            "  if (!props[propName] || hasReadOnlyValue[props.type] || props.onChange || prop" +
                            "s.readOnly || props.disabled) {
        return null;
      }
      return new Er" +
                            "ror('You provided a `value` prop to a form field without an ' + '`onChange` hand" +
                            "ler. This will render a read-only field. If ' + 'the field should be mutable use" +
                            " `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
    },
" +
                            "    checked: function (props, propName, componentName) {
      if (!props[propNa" +
                            "me] || props.onChange || props.readOnly || props.disabled) {
        return null" +
                            ";
      }
      return new Error('You provided a `checked` prop to a form field " +
                            "without an ' + '`onChange` handler. This will render a read-only field. If ' + '" +
                            "the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `on" +
                            "Change` or `readOnly`.');
    }
  };

  /**
   * Provide a linked `value` attrib" +
                            "ute for controlled forms. You should not use
   * this outside of the ReactDOM c" +
                            "ontrolled form components.
   */
  ReactControlledValuePropTypes.checkPropTypes " +
                            "= function (tagName, props, getStack) {
    checkPropTypes_1$1(propTypes, props," +
                            " 'prop', tagName, getStack);
  };
}

// TODO: direct imports like some-package/s" +
                            "rc/* are bad. Fix me.
var getCurrentFiberOwnerName$2 = ReactDebugCurrentFiber.ge" +
                            "tCurrentFiberOwnerName;
var getCurrentFiberStackAddendum$3 = ReactDebugCurrentFi" +
                            "ber.getCurrentFiberStackAddendum;

var didWarnValueDefaultValue = false;
var did" +
                            "WarnCheckedDefaultChecked = false;
var didWarnControlledToUncontrolled = false;
" +
                            "var didWarnUncontrolledToControlled = false;

function isControlled(props) {
  v" +
                            "ar usesChecked = props.type === 'checkbox' || props.type === 'radio';
  return u" +
                            "sesChecked ? props.checked != null : props.value != null;
}

/**
 * Implements a" +
                            "n <input> host component that allows setting these optional
 * props: `checked`," +
                            " `value`, `defaultChecked`, and `defaultValue`.
 *
 * If `checked` or `value` ar" +
                            "e not supplied (or null/undefined), user actions
 * that affect the checked stat" +
                            "e or value will trigger updates to the element.
 *
 * If they are supplied (and " +
                            "not null/undefined), the rendered element will not
 * trigger updates to the ele" +
                            "ment. Instead, the props must change in order for
 * the rendered element to be " +
                            "updated.
 *
 * The rendered element will be initialized as unchecked (or `defaul" +
                            "tChecked`)
 * with an empty value (or `defaultValue`).
 *
 * See http://www.w3.o" +
                            "rg/TR/2012/WD-html5-20121025/the-input-element.html
 */

function getHostProps(e" +
                            "lement, props) {
  var node = element;
  var value = props.value;
  var checked " +
                            "= props.checked;

  var hostProps = _assign({
    // Make sure we set .type befo" +
                            "re any other properties (setting .value
    // before .type means .value is lost" +
                            " in IE11 and below)
    type: undefined,
    // Make sure we set .step before .v" +
                            "alue (setting .value before .step
    // means .value is rounded on mount, based" +
                            " upon step precision)
    step: undefined,
    // Make sure we set .min & .max b" +
                            "efore .value (to ensure proper order
    // in corner cases such as min or max d" +
                            "eriving from value, e.g. Issue #7170)
    min: undefined,
    max: undefined
  }" +
                            ", props, {
    defaultChecked: undefined,
    defaultValue: undefined,
    value" +
                            ": value != null ? value : node._wrapperState.initialValue,
    checked: checked " +
                            "!= null ? checked : node._wrapperState.initialChecked
  });

  return hostProps;" +
                            "
}

function initWrapperState(element, props) {
  {
    ReactControlledValueProp" +
                            "Types.checkPropTypes('input', props, getCurrentFiberStackAddendum$3);

    if (p" +
                            "rops.checked !== undefined && props.defaultChecked !== undefined && !didWarnChec" +
                            "kedDefaultChecked) {
      warning_1$1(false, '%s contains an input of type %s w" +
                            "ith both checked and defaultChecked props. ' + 'Input elements must be either co" +
                            "ntrolled or uncontrolled ' + '(specify either the checked prop, or the defaultCh" +
                            "ecked prop, but not ' + 'both). Decide between using a controlled or uncontrolle" +
                            "d input ' + 'element and remove one of these props. More info: ' + 'https://fb.m" +
                            "e/react-controlled-components', getCurrentFiberOwnerName$2() || 'A component', p" +
                            "rops.type);
      didWarnCheckedDefaultChecked = true;
    }
    if (props.value" +
                            " !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue)" +
                            " {
      warning_1$1(false, '%s contains an input of type %s with both value and" +
                            " defaultValue props. ' + 'Input elements must be either controlled or uncontroll" +
                            "ed ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'b" +
                            "oth). Decide between using a controlled or uncontrolled input ' + 'element and r" +
                            "emove one of these props. More info: ' + 'https://fb.me/react-controlled-compone" +
                            "nts', getCurrentFiberOwnerName$2() || 'A component', props.type);
      didWarnV" +
                            "alueDefaultValue = true;
    }
  }

  var defaultValue = props.defaultValue;
  v" +
                            "ar node = element;
  node._wrapperState = {
    initialChecked: props.checked !=" +
                            " null ? props.checked : props.defaultChecked,
    initialValue: props.value != n" +
                            "ull ? props.value : defaultValue,
    controlled: isControlled(props)
  };
}

fu" +
                            "nction updateWrapper(element, props) {
  var node = element;
  {
    var control" +
                            "led = isControlled(props);

    if (!node._wrapperState.controlled && controlled" +
                            " && !didWarnUncontrolledToControlled) {
      warning_1$1(false, 'A component is" +
                            " changing an uncontrolled input of type %s to be controlled. ' + 'Input elements" +
                            " should not switch from uncontrolled to controlled (or vice versa). ' + 'Decide " +
                            "between using a controlled or uncontrolled input ' + 'element for the lifetime o" +
                            "f the component. More info: https://fb.me/react-controlled-components%s', props." +
                            "type, getCurrentFiberStackAddendum$3());
      didWarnUncontrolledToControlled =" +
                            " true;
    }
    if (node._wrapperState.controlled && !controlled && !didWarnCon" +
                            "trolledToUncontrolled) {
      warning_1$1(false, 'A component is changing a con" +
                            "trolled input of type %s to be uncontrolled. ' + 'Input elements should not swit" +
                            "ch from controlled to uncontrolled (or vice versa). ' + 'Decide between using a " +
                            "controlled or uncontrolled input ' + 'element for the lifetime of the component." +
                            " More info: https://fb.me/react-controlled-components%s', props.type, getCurrent" +
                            "FiberStackAddendum$3());
      didWarnControlledToUncontrolled = true;
    }
  }" +
                            "

  var checked = props.checked;
  if (checked != null) {
    setValueForPropert" +
                            "y(node, 'checked', checked || false);
  }

  var value = props.value;
  if (valu" +
                            "e != null) {
    if (value === 0 && node.value === '') {
      node.value = '0';" +
                            "
      // Note: IE9 reports a number inputs as 'text', so check props instead.
 " +
                            "   } else if (props.type === 'number') {
      // Simulate `input.valueAsNumber`" +
                            ". IE9 does not support it
      var valueAsNumber = parseFloat(node.value) || 0;" +
                            "

      if (
      // eslint-disable-next-line
      value != valueAsNumber ||
 " +
                            "     // eslint-disable-next-line
      value == valueAsNumber && node.value != v" +
                            "alue) {
        // Cast `value` to a string to ensure the value is set correctly" +
                            ". While
        // browsers typically do this as necessary, jsdom doesn't.
     " +
                            "   node.value = '' + value;
      }
    } else if (node.value !== '' + value) {
" +
                            "      // Cast `value` to a string to ensure the value is set correctly. While
  " +
                            "    // browsers typically do this as necessary, jsdom doesn't.
      node.value " +
                            "= '' + value;
    }
  } else {
    if (props.value == null && props.defaultValue" +
                            " != null) {
      // In Chrome, assigning defaultValue to certain input types tr" +
                            "iggers input validation.
      // For number inputs, the display value loses tra" +
                            "iling decimal points. For email inputs,
      // Chrome raises "The specified va" +
                            "lue <x> is not a valid email address".
      //
      // Here we check to see if" +
                            " the defaultValue has actually changed, avoiding these problems
      // when th" +
                            "e user is inputting text
      //
      // https://github.com/facebook/react/iss" +
                            "ues/7253
      if (node.defaultValue !== '' + props.defaultValue) {
        node" +
                            ".defaultValue = '' + props.defaultValue;
      }
    }
    if (props.checked == " +
                            "null && props.defaultChecked != null) {
      node.defaultChecked = !!props.defa" +
                            "ultChecked;
    }
  }
}

function postMountWrapper(element, props) {
  var node " +
                            "= element;

  // Detach value from defaultValue. We won't do anything if we're w" +
                            "orking on
  // submit or reset inputs as those values & defaultValues are linked" +
                            ". They
  // are not resetable nodes so this operation doesn't matter and actuall" +
                            "y
  // removes browser-default values (eg "Submit Query") when no value is
  // " +
                            "provided.

  switch (props.type) {
    case 'submit':
    case 'reset':
      br" +
                            "eak;
    case 'color':
    case 'date':
    case 'datetime':
    case 'datetime-" +
                            "local':
    case 'month':
    case 'time':
    case 'week':
      // This fixes " +
                            "the no-show issue on iOS Safari and Android Chrome:
      // https://github.com/" +
                            "facebook/react/issues/7233
      node.value = '';
      node.value = node.defaul" +
                            "tValue;
      break;
    default:
      node.value = node.value;
      break;
  " +
                            "}

  // Normally, we'd just do `node.checked = node.checked` upon initial mount," +
                            " less this bug
  // this is needed to work around a chrome bug where setting def" +
                            "aultChecked
  // will sometimes influence the value of checked (even after detac" +
                            "hment).
  // Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=60" +
                            "8416
  // We need to temporarily unset name to avoid disrupting radio button gro" +
                            "ups.
  var name = node.name;
  if (name !== '') {
    node.name = '';
  }
  node" +
                            ".defaultChecked = !node.defaultChecked;
  node.defaultChecked = !node.defaultChe" +
                            "cked;
  if (name !== '') {
    node.name = name;
  }
}

function restoreControll" +
                            "edState$1(element, props) {
  var node = element;
  updateWrapper(node, props);
" +
                            "  updateNamedCousins(node, props);
}

function updateNamedCousins(rootNode, prop" +
                            "s) {
  var name = props.name;
  if (props.type === 'radio' && name != null) {
  " +
                            "  var queryRoot = rootNode;

    while (queryRoot.parentNode) {
      queryRoot " +
                            "= queryRoot.parentNode;
    }

    // If `rootNode.form` was non-null, then we c" +
                            "ould try `form.elements`,
    // but that sometimes behaves strangely in IE8. We" +
                            " could also try using
    // `form.getElementsByName`, but that will only return" +
                            " direct children
    // and won't include inputs that use the HTML5 `form=` attr" +
                            "ibute. Since
    // the input might not even be in a form. It might not even be " +
                            "in the
    // document. Let's just use the local `querySelectorAll` to ensure we" +
                            " don't
    // miss anything.
    var group = queryRoot.querySelectorAll('input[n" +
                            "ame=' + JSON.stringify('' + name) + '][type="radio"]');

    for (var i = 0; i <" +
                            " group.length; i++) {
      var otherNode = group[i];
      if (otherNode === ro" +
                            "otNode || otherNode.form !== rootNode.form) {
        continue;
      }
      //" +
                            " This will throw if radio buttons rendered by different copies of React
      //" +
                            " and the same name are rendered into the same form (same as #1939).
      // Tha" +
                            "t's probably okay; we don't support it just as we don't support
      // mixing " +
                            "React radio buttons with non-React ones.
      var otherProps = getFiberCurrentP" +
                            "ropsFromNode$1(otherNode);
      !otherProps ? invariant_1$1(false, 'ReactDOMInp" +
                            "ut: Mixing React and non-React radio inputs with the same `name` is not supporte" +
                            "d.') : void 0;
      // If this is a controlled radio button group, forcing the " +
                            "input that
      // was previously checked to update will cause it to be come re" +
                            "-checked
      // as appropriate.
      updateWrapper(otherNode, otherProps);
  " +
                            "  }
  }
}

function flattenChildren(children) {
  var content = '';

  // Flatte" +
                            "n children and warn if they aren't strings or numbers;
  // invalid types are ig" +
                            "nored.
  // We can silently skip them because invalid DOM nesting warning
  // c" +
                            "atches these cases in Fiber.
  React.Children.forEach(children, function (child)" +
                            " {
    if (child == null) {
      return;
    }
    if (typeof child === 'string" +
                            "' || typeof child === 'number') {
      content += child;
    }
  });

  return " +
                            "content;
}

/**
 * Implements an <option> host component that warns when `select" +
                            "ed` is set.
 */

function validateProps(element, props) {
  // TODO (yungsters):" +
                            " Remove support for `selected` in <option>.
  {
    warning_1$1(props.selected =" +
                            "= null, 'Use the `defaultValue` or `value` props on <select> instead of ' + 'set" +
                            "ting `selected` on <option>.');
  }
}

function postMountWrapper$1(element, prop" +
                            "s) {
  // value="" should make a value attribute (#6219)
  if (props.value != nu" +
                            "ll) {
    element.setAttribute('value', props.value);
  }
}

function getHostPro" +
                            "ps$1(element, props) {
  var hostProps = _assign({ children: undefined }, props)" +
                            ";

  var content = flattenChildren(props.children);

  if (content) {
    hostPr" +
                            "ops.children = content;
  }

  return hostProps;
}

// TODO: direct imports like" +
                            " some-package/src/* are bad. Fix me.
var getCurrentFiberOwnerName$3 = ReactDebug" +
                            "CurrentFiber.getCurrentFiberOwnerName;
var getCurrentFiberStackAddendum$4 = Reac" +
                            "tDebugCurrentFiber.getCurrentFiberStackAddendum;


{
  var didWarnValueDefaultVa" +
                            "lue$1 = false;
}

function getDeclarationErrorAddendum() {
  var ownerName = get" +
                            "CurrentFiberOwnerName$3();
  if (ownerName) {
    return '\n\nCheck the render m" +
                            "ethod of `' + ownerName + '`.';
  }
  return '';
}

var valuePropNames = ['value" +
                            "', 'defaultValue'];

/**
 * Validation function for `value` and `defaultValue`.
" +
                            " */
function checkSelectPropTypes(props) {
  ReactControlledValuePropTypes.check" +
                            "PropTypes('select', props, getCurrentFiberStackAddendum$4);

  for (var i = 0; i" +
                            " < valuePropNames.length; i++) {
    var propName = valuePropNames[i];
    if (p" +
                            "rops[propName] == null) {
      continue;
    }
    var isArray = Array.isArray(" +
                            "props[propName]);
    if (props.multiple && !isArray) {
      warning_1$1(false," +
                            " 'The `%s` prop supplied to <select> must be an array if ' + '`multiple` is true" +
                            ".%s', propName, getDeclarationErrorAddendum());
    } else if (!props.multiple &" +
                            "& isArray) {
      warning_1$1(false, 'The `%s` prop supplied to <select> must b" +
                            "e a scalar ' + 'value if `multiple` is false.%s', propName, getDeclarationErrorA" +
                            "ddendum());
    }
  }
}

function updateOptions(node, multiple, propValue, setDe" +
                            "faultSelected) {
  var options = node.options;

  if (multiple) {
    var select" +
                            "edValues = propValue;
    var selectedValue = {};
    for (var i = 0; i < select" +
                            "edValues.length; i++) {
      // Prefix to avoid chaos with special keys.
      " +
                            "selectedValue['$' + selectedValues[i]] = true;
    }
    for (var _i = 0; _i < o" +
                            "ptions.length; _i++) {
      var selected = selectedValue.hasOwnProperty('$' + o" +
                            "ptions[_i].value);
      if (options[_i].selected !== selected) {
        option" +
                            "s[_i].selected = selected;
      }
      if (selected && setDefaultSelected) {
 " +
                            "       options[_i].defaultSelected = true;
      }
    }
  } else {
    // Do no" +
                            "t set `select.value` as exact behavior isn't consistent across all
    // browse" +
                            "rs for all cases.
    var _selectedValue = '' + propValue;
    var defaultSelect" +
                            "ed = null;
    for (var _i2 = 0; _i2 < options.length; _i2++) {
      if (option" +
                            "s[_i2].value === _selectedValue) {
        options[_i2].selected = true;
       " +
                            " if (setDefaultSelected) {
          options[_i2].defaultSelected = true;
      " +
                            "  }
        return;
      }
      if (defaultSelected === null && !options[_i2]." +
                            "disabled) {
        defaultSelected = options[_i2];
      }
    }
    if (defaul" +
                            "tSelected !== null) {
      defaultSelected.selected = true;
    }
  }
}

/**
 *" +
                            " Implements a <select> host component that allows optionally setting the
 * prop" +
                            "s `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * stri" +
                            "ngable. If `multiple` is true, the prop must be an array of stringables.
 *
 * I" +
                            "f `value` is not supplied (or null/undefined), user actions that change the
 * s" +
                            "elected option will trigger updates to the rendered options.
 *
 * If it is supp" +
                            "lied (and not null/undefined), the rendered options will not
 * update in respon" +
                            "se to user actions. Instead, the `value` prop must change in
 * order for the re" +
                            "ndered options to update.
 *
 * If `defaultValue` is provided, any options with " +
                            "the supplied values will be
 * selected.
 */

function getHostProps$2(element, p" +
                            "rops) {
  return _assign({}, props, {
    value: undefined
  });
}

function ini" +
                            "tWrapperState$1(element, props) {
  var node = element;
  {
    checkSelectPropT" +
                            "ypes(props);
  }

  var value = props.value;
  node._wrapperState = {
    initia" +
                            "lValue: value != null ? value : props.defaultValue,
    wasMultiple: !!props.mul" +
                            "tiple
  };

  {
    if (props.value !== undefined && props.defaultValue !== unde" +
                            "fined && !didWarnValueDefaultValue$1) {
      warning_1$1(false, 'Select element" +
                            "s must be either controlled or uncontrolled ' + '(specify either the value prop," +
                            " or the defaultValue prop, but not ' + 'both). Decide between using a controlled" +
                            " or uncontrolled select ' + 'element and remove one of these props. More info: '" +
                            " + 'https://fb.me/react-controlled-components');
      didWarnValueDefaultValue$" +
                            "1 = true;
    }
  }
}

function postMountWrapper$2(element, props) {
  var node " +
                            "= element;
  node.multiple = !!props.multiple;
  var value = props.value;
  if (" +
                            "value != null) {
    updateOptions(node, !!props.multiple, value, false);
  } el" +
                            "se if (props.defaultValue != null) {
    updateOptions(node, !!props.multiple, p" +
                            "rops.defaultValue, true);
  }
}

function postUpdateWrapper(element, props) {
  " +
                            "var node = element;
  // After the initial mount, we control selected-ness manua" +
                            "lly so don't pass
  // this value down
  node._wrapperState.initialValue = undef" +
                            "ined;

  var wasMultiple = node._wrapperState.wasMultiple;
  node._wrapperState." +
                            "wasMultiple = !!props.multiple;

  var value = props.value;
  if (value != null)" +
                            " {
    updateOptions(node, !!props.multiple, value, false);
  } else if (wasMult" +
                            "iple !== !!props.multiple) {
    // For simplicity, reapply `defaultValue` if `m" +
                            "ultiple` is toggled.
    if (props.defaultValue != null) {
      updateOptions(n" +
                            "ode, !!props.multiple, props.defaultValue, true);
    } else {
      // Revert t" +
                            "he select back to its default unselected state.
      updateOptions(node, !!prop" +
                            "s.multiple, props.multiple ? [] : '', false);
    }
  }
}

function restoreContr" +
                            "olledState$2(element, props) {
  var node = element;
  var value = props.value;
" +
                            "
  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);" +
                            "
  }
}

// TODO: direct imports like some-package/src/* are bad. Fix me.
var get" +
                            "CurrentFiberStackAddendum$5 = ReactDebugCurrentFiber.getCurrentFiberStackAddendu" +
                            "m;

var didWarnValDefaultVal = false;

/**
 * Implements a <textarea> host compo" +
                            "nent that allows setting `value`, and
 * `defaultValue`. This differs from the t" +
                            "raditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If " +
                            "`value` is not supplied (or null/undefined), user actions that affect the
 * val" +
                            "ue will trigger updates to the element.
 *
 * If `value` is supplied (and not nu" +
                            "ll/undefined), the rendered element will
 * not trigger updates to the element. " +
                            "Instead, the `value` prop must change in
 * order for the rendered element to be" +
                            " updated.
 *
 * The rendered element will be initialized with an empty value, th" +
                            "e prop
 * `defaultValue` if specified, or the children content (deprecated).
 */" +
                            "

function getHostProps$3(element, props) {
  var node = element;
  !(props.dang" +
                            "erouslySetInnerHTML == null) ? invariant_1$1(false, '`dangerouslySetInnerHTML` d" +
                            "oes not make sense on <textarea>.') : void 0;

  // Always set children to the s" +
                            "ame thing. In IE9, the selection range will
  // get reset if `textContent` is m" +
                            "utated.  We could add a check in setTextContent
  // to only set the value if/wh" +
                            "en the value differs from the node value (which would
  // completely solve this" +
                            " IE9 bug), but Sebastian+Sophie seemed to like this
  // solution. The value can" +
                            " be a boolean or object so that's why it's forced
  // to be a string.
  var hos" +
                            "tProps = _assign({}, props, {
    value: undefined,
    defaultValue: undefined," +
                            "
    children: '' + node._wrapperState.initialValue
  });

  return hostProps;
}" +
                            "

function initWrapperState$2(element, props) {
  var node = element;
  {
    Re" +
                            "actControlledValuePropTypes.checkPropTypes('textarea', props, getCurrentFiberSta" +
                            "ckAddendum$5);
    if (props.value !== undefined && props.defaultValue !== undef" +
                            "ined && !didWarnValDefaultVal) {
      warning_1$1(false, 'Textarea elements mus" +
                            "t be either controlled or uncontrolled ' + '(specify either the value prop, or t" +
                            "he defaultValue prop, but not ' + 'both). Decide between using a controlled or u" +
                            "ncontrolled textarea ' + 'and remove one of these props. More info: ' + 'https:/" +
                            "/fb.me/react-controlled-components');
      didWarnValDefaultVal = true;
    }
 " +
                            " }

  var value = props.value;
  var initialValue = value;

  // Only bother fet" +
                            "ching default value if we're going to use it
  if (value == null) {
    var defa" +
                            "ultValue = props.defaultValue;
    // TODO (yungsters): Remove support for child" +
                            "ren content in <textarea>.
    var children = props.children;
    if (children !" +
                            "= null) {
      {
        warning_1$1(false, 'Use the `defaultValue` or `value` " +
                            "props instead of setting ' + 'children on <textarea>.');
      }
      !(default" +
                            "Value == null) ? invariant_1$1(false, 'If you supply `defaultValue` on a <textar" +
                            "ea>, do not pass children.') : void 0;
      if (Array.isArray(children)) {
    " +
                            "    !(children.length <= 1) ? invariant_1$1(false, '<textarea> can only have at " +
                            "most one child.') : void 0;
        children = children[0];
      }

      defau" +
                            "ltValue = '' + children;
    }
    if (defaultValue == null) {
      defaultValu" +
                            "e = '';
    }
    initialValue = defaultValue;
  }

  node._wrapperState = {
   " +
                            " initialValue: '' + initialValue
  };
}

function updateWrapper$1(element, props" +
                            ") {
  var node = element;
  var value = props.value;
  if (value != null) {
    " +
                            "// Cast `value` to a string to ensure the value is set correctly. While
    // b" +
                            "rowsers typically do this as necessary, jsdom doesn't.
    var newValue = '' + v" +
                            "alue;

    // To avoid side effects (such as losing text selection), only set va" +
                            "lue if changed
    if (newValue !== node.value) {
      node.value = newValue;
 " +
                            "   }
    if (props.defaultValue == null) {
      node.defaultValue = newValue;
 " +
                            "   }
  }
  if (props.defaultValue != null) {
    node.defaultValue = props.defau" +
                            "ltValue;
  }
}

function postMountWrapper$3(element, props) {
  var node = eleme" +
                            "nt;
  // This is in postMount because we need access to the DOM node, which is n" +
                            "ot
  // available until after the component has mounted.
  var textContent = nod" +
                            "e.textContent;

  // Only set node.value if textContent is equal to the expected" +
                            "
  // initial value. In IE10/IE11 there is a bug where the placeholder attribute" +
                            "
  // will populate textContent as well.
  // https://developer.microsoft.com/mi" +
                            "crosoft-edge/platform/issues/101525/
  if (textContent === node._wrapperState.in" +
                            "itialValue) {
    node.value = textContent;
  }
}

function restoreControlledSta" +
                            "te$3(element, props) {
  // DOM component is still mounted; update
  updateWrapp" +
                            "er$1(element, props);
}

var HTML_NAMESPACE$1 = 'http://www.w3.org/1999/xhtml';
" +
                            "var MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
var SVG_NAMESPACE = '" +
                            "http://www.w3.org/2000/svg';

var Namespaces = {
  html: HTML_NAMESPACE$1,
  mat" +
                            "hml: MATH_NAMESPACE,
  svg: SVG_NAMESPACE
};

// Assumes there is no parent name" +
                            "space.
function getIntrinsicNamespace(type) {
  switch (type) {
    case 'svg':
" +
                            "      return SVG_NAMESPACE;
    case 'math':
      return MATH_NAMESPACE;
    de" +
                            "fault:
      return HTML_NAMESPACE$1;
  }
}

function getChildNamespace(parentNa" +
                            "mespace, type) {
  if (parentNamespace == null || parentNamespace === HTML_NAMES" +
                            "PACE$1) {
    // No (or default) parent namespace: potential entry point.
    re" +
                            "turn getIntrinsicNamespace(type);
  }
  if (parentNamespace === SVG_NAMESPACE &&" +
                            " type === 'foreignObject') {
    // We're leaving SVG.
    return HTML_NAMESPACE" +
                            "$1;
  }
  // By default, pass namespace below.
  return parentNamespace;
}

/* g" +
                            "lobals MSApp */

/**
 * Create a function which has 'unsafe' privileges (require" +
                            "d by windows8 apps)
 */
var createMicrosoftUnsafeLocalFunction = function (func)" +
                            " {
  if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) {
    re" +
                            "turn function (arg0, arg1, arg2, arg3) {
      MSApp.execUnsafeLocalFunction(fun" +
                            "ction () {
        return func(arg0, arg1, arg2, arg3);
      });
    };
  } els" +
                            "e {
    return func;
  }
};

// SVG temp container for IE lacking innerHTML
var " +
                            "reusableSVGContainer = void 0;

/**
 * Set the innerHTML property of a node
 *
 " +
                            "* @param {DOMElement} node
 * @param {string} html
 * @internal
 */
var setInner" +
                            "HTML = createMicrosoftUnsafeLocalFunction(function (node, html) {
  // IE does n" +
                            "ot have innerHTML for SVG nodes, so instead we inject the
  // new markup in a t" +
                            "emp node and then move the child nodes across into
  // the target node

  if (n" +
                            "ode.namespaceURI === Namespaces.svg && !('innerHTML' in node)) {
    reusableSVG" +
                            "Container = reusableSVGContainer || document.createElement('div');
    reusableS" +
                            "VGContainer.innerHTML = '<svg>' + html + '</svg>';
    var svgNode = reusableSVG" +
                            "Container.firstChild;
    while (node.firstChild) {
      node.removeChild(node." +
                            "firstChild);
    }
    while (svgNode.firstChild) {
      node.appendChild(svgNo" +
                            "de.firstChild);
    }
  } else {
    node.innerHTML = html;
  }
});

// code cop" +
                            "ied and modified from escape-html
/**
 * Module variables.
 * @private
 */

var " +
                            "matchHtmlRegExp = /["'&<>]/;

/**
 * Escape special characters in the given stri" +
                            "ng of html.
 *
 * @param  {string} string The string to escape for inserting int" +
                            "o HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var s" +
                            "tr = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    " +
                            "return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex" +
                            " = 0;

  for (index = match.index; index < str.length; index++) {
    switch (st" +
                            "r.charCodeAt(index)) {
      case 34:
        // "
        escape = '&quot;';
  " +
                            "      break;
      case 38:
        // &
        escape = '&amp;';
        break" +
                            ";
      case 39:
        // '
        escape = '&#x27;'; // modified from escape" +
                            "-html; used to be '&#39'
        break;
      case 60:
        // <
        esca" +
                            "pe = '&lt;';
        break;
      case 62:
        // >
        escape = '&gt;';" +
                            "
        break;
      default:
        continue;
    }

    if (lastIndex !== in" +
                            "dex) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = ind" +
                            "ex + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.subst" +
                            "ring(lastIndex, index) : html;
}
// end code copied and modified from escape-htm" +
                            "l

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text " +
                            "value to escape.
 * @return {string} An escaped string.
 */
function escapeTextC" +
                            "ontentForBrowser(text) {
  if (typeof text === 'boolean' || typeof text === 'num" +
                            "ber') {
    // this shortcircuit helps perf for types that we know will never ha" +
                            "ve
    // special characters, especially given that this function is used often
" +
                            "    // for numeric dom ids.
    return '' + text;
  }
  return escapeHtml(text);" +
                            "
}

/**
 * Set the textContent property of a node, ensuring that whitespace is p" +
                            "reserved
 * even in IE8. innerText is a poor substitute for textContent and, amo" +
                            "ng many
 * issues, inserts <br> instead of the literal newline chars. innerHTML " +
                            "behaves
 * as it should.
 *
 * @param {DOMElement} node
 * @param {string} text
" +
                            " * @internal
 */
var setTextContent = function (node, text) {
  if (text) {
    " +
                            "var firstChild = node.firstChild;

    if (firstChild && firstChild === node.las" +
                            "tChild && firstChild.nodeType === TEXT_NODE) {
      firstChild.nodeValue = text" +
                            ";
      return;
    }
  }
  node.textContent = text;
};

if (ExecutionEnvironmen" +
                            "t_1.canUseDOM) {
  if (!('textContent' in document.documentElement)) {
    setTe" +
                            "xtContent = function (node, text) {
      if (node.nodeType === TEXT_NODE) {
   " +
                            "     node.nodeValue = text;
        return;
      }
      setInnerHTML(node, esc" +
                            "apeTextContentForBrowser(text));
    };
  }
}

var setTextContent$1 = setTextCon" +
                            "tent;

/**
 * CSS properties which accept numbers but are not in units of "px".
" +
                            " */
var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutse" +
                            "t: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  " +
                            "boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: tru" +
                            "e,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  f" +
                            "lexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gri" +
                            "dRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true," +
                            "
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClam" +
                            "p: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  " +
                            "tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related p" +
                            "roperties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  stro" +
                            "keDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeO" +
                            "pacity: true,
  strokeWidth: true
};

/**
 * @param {string} prefix vendor-speci" +
                            "fic prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration" +
                            "
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:" +
                            "
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return pref" +
                            "ix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style nam" +
                            "es that may come passed in prefixed by adding permutations
 * of vendor prefixes" +
                            ".
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, o" +
                            "r else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it" +
                            " iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(" +
                            "function (prop) {
  prefixes.forEach(function (prefix) {
    isUnitlessNumber[pr" +
                            "efixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

/**
 * Convert a val" +
                            "ue into the proper css writable value. The style name `name`
 * should be logica" +
                            "l (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param " +
                            "{string} name CSS property name such as `topMargin`.
 * @param {*} value CSS pro" +
                            "perty value such as `10px`.
 * @return {string} Normalized style value with dime" +
                            "nsions applied.
 */
function dangerousStyleValue(name, value, isCustomProperty) " +
                            "{
  // Note that we've removed escapeTextForBrowser() calls here since the
  // " +
                            "whole string will be escaped when the attribute is injected into
  // the markup" +
                            ". If you provide unsafe user data here they can inject
  // arbitrary CSS which " +
                            "may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php" +
                            "/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ulti" +
                            "mate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS" +
                            " injection issue
  // which has lead to a greater discussion about how we're goi" +
                            "ng to
  // trust URLs moving forward. See #2115901

  var isEmpty = value == nul" +
                            "l || typeof value === 'boolean' || value === '';
  if (isEmpty) {
    return '';" +
                            "
  }

  if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(i" +
                            "sUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
    return va" +
                            "lue + 'px'; // Presumes implicit 'px' suffix for unitless numbers
  }

  return " +
                            "('' + value).trim();
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * " +
                            "This source code is licensed under the MIT license found in the
 * LICENSE file " +
                            "in the root directory of this source tree.
 *
 * @typechecks
 */

var _uppercase" +
                            "Pattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *" +
                            "   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style " +
                            "names, use `hyphenateStyleName` instead which works properly
 * with all vendor " +
                            "prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */
f" +
                            "unction hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').to" +
                            "LowerCase();
}

var hyphenate_1 = hyphenate;

/**
 * Copyright (c) 2013-present," +
                            " Facebook, Inc.
 *
 * This source code is licensed under the MIT license found i" +
                            "n the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechec" +
                            "ks
 */





var msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property" +
                            " name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "back" +
                            "ground-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition" +
                            ""
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Mod" +
                            "ernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is conv" +
                            "erted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
function h" +
                            "yphenateStyleName(string) {
  return hyphenate_1(string).replace(msPattern, '-ms" +
                            "-');
}

var hyphenateStyleName_1$1 = hyphenateStyleName;

/**
 * Copyright (c) 2" +
                            "013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT lic" +
                            "ense found in the
 * LICENSE file in the root directory of this source tree.
 *
" +
                            " * @typechecks
 */

var _hyphenPattern = /-(.)/g;

/**
 * Camelcases a hyphenate" +
                            "d string, for example:
 *
 *   > camelize('background-color')
 *   < "background" +
                            "Color"
 *
 * @param {string} string
 * @return {string}
 */
function camelize(st" +
                            "ring) {
  return string.replace(_hyphenPattern, function (_, character) {
    re" +
                            "turn character.toUpperCase();
  });
}

var camelize_1 = camelize;

/**
 * Copyri" +
                            "ght (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under th" +
                            "e MIT license found in the
 * LICENSE file in the root directory of this source " +
                            "tree.
 *
 * @typechecks
 */





var msPattern$1 = /^-ms-/;

/**
 * Camelcases a" +
                            " hyphenated CSS property name, for example:
 *
 *   > camelizeStyleName('backgro" +
                            "und-color')
 *   < "backgroundColor"
 *   > camelizeStyleName('-moz-transition')" +
                            "
 *   < "MozTransition"
 *   > camelizeStyleName('-ms-transition')
 *   < "msTra" +
                            "nsition"
 *
 * As Andi Smith suggests
 * (http://www.andismith.com/blog/2012/02/" +
                            "modernizr-prefixed/), an `-ms` prefix
 * is converted to lowercase `ms`.
 *
 * @" +
                            "param {string} string
 * @return {string}
 */
function camelizeStyleName(string)" +
                            " {
  return camelize_1(string.replace(msPattern$1, 'ms-'));
}

var camelizeStyle" +
                            "Name_1$1 = camelizeStyleName;

var warnValidStyle = emptyFunction_1;

{
  // 'ms" +
                            "Transform' is correct, but the other prefixes should be capitalized
  var badVen" +
                            "doredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;

  // style values shouldn't c" +
                            "ontain a semicolon
  var badStyleValueWithSemicolonPattern = /;\s*$/;

  var war" +
                            "nedStyleNames = {};
  var warnedStyleValues = {};
  var warnedForNaNValue = fals" +
                            "e;
  var warnedForInfinityValue = false;

  var warnHyphenatedStyleName = functi" +
                            "on (name, getStack) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedSty" +
                            "leNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    war" +
                            "ning_1$1(false, 'Unsupported style property %s. Did you mean %s?%s', name, camel" +
                            "izeStyleName_1$1(name), getStack());
  };

  var warnBadVendoredStyleName = func" +
                            "tion (name, getStack) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedS" +
                            "tyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    w" +
                            "arning_1$1(false, 'Unsupported vendor-prefixed style property %s. Did you mean %" +
                            "s?%s', name, name.charAt(0).toUpperCase() + name.slice(1), getStack());
  };

  " +
                            "var warnStyleValueWithSemicolon = function (name, value, getStack) {
    if (war" +
                            "nedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
      return" +
                            ";
    }

    warnedStyleValues[value] = true;
    warning_1$1(false, "Style prop" +
                            "erty values shouldn't contain a semicolon. " + 'Try "%s: %s" instead.%s', name, " +
                            "value.replace(badStyleValueWithSemicolonPattern, ''), getStack());
  };

  var w" +
                            "arnStyleValueIsNaN = function (name, value, getStack) {
    if (warnedForNaNValu" +
                            "e) {
      return;
    }

    warnedForNaNValue = true;
    warning_1$1(false, '" +
                            "`NaN` is an invalid value for the `%s` css style property.%s', name, getStack())" +
                            ";
  };

  var warnStyleValueIsInfinity = function (name, value, getStack) {
    " +
                            "if (warnedForInfinityValue) {
      return;
    }

    warnedForInfinityValue = " +
                            "true;
    warning_1$1(false, '`Infinity` is an invalid value for the `%s` css st" +
                            "yle property.%s', name, getStack());
  };

  warnValidStyle = function (name, va" +
                            "lue, getStack) {
    if (name.indexOf('-') > -1) {
      warnHyphenatedStyleName" +
                            "(name, getStack);
    } else if (badVendoredStyleNamePattern.test(name)) {
     " +
                            " warnBadVendoredStyleName(name, getStack);
    } else if (badStyleValueWithSemic" +
                            "olonPattern.test(value)) {
      warnStyleValueWithSemicolon(name, value, getSta" +
                            "ck);
    }

    if (typeof value === 'number') {
      if (isNaN(value)) {
     " +
                            "   warnStyleValueIsNaN(name, value, getStack);
      } else if (!isFinite(value)" +
                            ") {
        warnStyleValueIsInfinity(name, value, getStack);
      }
    }
  };
" +
                            "}

var warnValidStyle$1 = warnValidStyle;

/**
 * Operations for dealing with CS" +
                            "S properties.
 */

/**
 * This creates a string that is expected to be equivalen" +
                            "t to the style
 * attribute generated by server-side rendering. It by-passes war" +
                            "nings and
 * security checks so it's not safe to use this value for anything oth" +
                            "er than
 * comparison. It is only used in DEV for SSR validation.
 */
function c" +
                            "reateDangerousStringForStyles(styles) {
  {
    var serialized = '';
    var del" +
                            "imiter = '';
    for (var styleName in styles) {
      if (!styles.hasOwnPropert" +
                            "y(styleName)) {
        continue;
      }
      var styleValue = styles[styleNam" +
                            "e];
      if (styleValue != null) {
        var isCustomProperty = styleName.ind" +
                            "exOf('--') === 0;
        serialized += delimiter + hyphenateStyleName_1$1(style" +
                            "Name) + ':';
        serialized += dangerousStyleValue(styleName, styleValue, is" +
                            "CustomProperty);

        delimiter = ';';
      }
    }
    return serialized |" +
                            "| null;
  }
}

/**
 * Sets the value for multiple styles on a node.  If a value " +
                            "is specified as
 * '' (empty string), the corresponding style property will be u" +
                            "nset.
 *
 * @param {DOMElement} node
 * @param {object} styles
 */
function setV" +
                            "alueForStyles(node, styles, getStack) {
  var style = node.style;
  for (var sty" +
                            "leName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;" +
                            "
    }
    var isCustomProperty = styleName.indexOf('--') === 0;
    {
      if " +
                            "(!isCustomProperty) {
        warnValidStyle$1(styleName, styles[styleName], get" +
                            "Stack);
      }
    }
    var styleValue = dangerousStyleValue(styleName, styles" +
                            "[styleName], isCustomProperty);
    if (styleName === 'float') {
      styleName" +
                            " = 'cssFloat';
    }
    if (isCustomProperty) {
      style.setProperty(styleNa" +
                            "me, styleValue);
    } else {
      style[styleName] = styleValue;
    }
  }
}

" +
                            "// For HTML, certain tags should omit their close tag. We keep a whitelist for
/" +
                            "/ those special-case tags.

var omittedCloseTags = {
  area: true,
  base: true," +
                            "
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true," +
                            "
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  tr" +
                            "ack: true,
  wbr: true
};

// For HTML, certain tags cannot have children. This " +
                            "has the same purpose as
// `omittedCloseTags` except that `menuitem` should stil" +
                            "l have its closing tag.

var voidElementTags = _assign({
  menuitem: true
}, omi" +
                            "ttedCloseTags);

var HTML$1 = '__html';

function assertValidProps(tag, props, g" +
                            "etStack) {
  if (!props) {
    return;
  }
  // Note the use of `==` which check" +
                            "s for null or undefined.
  if (voidElementTags[tag]) {
    !(props.children == n" +
                            "ull && props.dangerouslySetInnerHTML == null) ? invariant_1$1(false, '%s is a vo" +
                            "id element tag and must neither have `children` nor use `dangerouslySetInnerHTML" +
                            "`.%s', tag, getStack()) : void 0;
  }
  if (props.dangerouslySetInnerHTML != nul" +
                            "l) {
    !(props.children == null) ? invariant_1$1(false, 'Can only set one of `" +
                            "children` or `props.dangerouslySetInnerHTML`.') : void 0;
    !(typeof props.dan" +
                            "gerouslySetInnerHTML === 'object' && HTML$1 in props.dangerouslySetInnerHTML) ? " +
                            "invariant_1$1(false, '`props.dangerouslySetInnerHTML` must be in the form `{__ht" +
                            "ml: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html" +
                            " for more information.') : void 0;
  }
  {
    warning_1$1(props.suppressContent" +
                            "EditableWarning || !props.contentEditable || props.children == null, 'A componen" +
                            "t is `contentEditable` and contains `children` managed by ' + 'React. It is now " +
                            "your responsibility to guarantee that none of ' + 'those nodes are unexpectedly " +
                            "modified or duplicated. This is ' + 'probably not intentional.%s', getStack());
" +
                            "  }
  !(props.style == null || typeof props.style === 'object') ? invariant_1$1(" +
                            "false, 'The `style` prop expects a mapping from style properties to values, not " +
                            "a string. For example, style={{marginRight: spacing + \'em\'}} when using JSX.%s" +
                            "', getStack()) : void 0;
}

function isCustomComponent(tagName, props) {
  if (t" +
                            "agName.indexOf('-') === -1) {
    return typeof props.is === 'string';
  }
  swi" +
                            "tch (tagName) {
    // These are reserved SVG and MathML elements.
    // We don" +
                            "'t mind this whitelist too much because we expect it to never grow.
    // The a" +
                            "lternative is to track the namespace in a few places which is convoluted.
    //" +
                            " https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
" +
                            "    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    c" +
                            "ase 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    " +
                            "case 'font-face-name':
    case 'missing-glyph':
      return false;
    default" +
                            ":
      return true;
  }
}

var ariaProperties = {
  'aria-current': 0, // state" +
                            "
  'aria-details': 0,
  'aria-disabled': 0, // state
  'aria-hidden': 0, // stat" +
                            "e
  'aria-invalid': 0, // state
  'aria-keyshortcuts': 0,
  'aria-label': 0,
  '" +
                            "aria-roledescription': 0,
  // Widget Attributes
  'aria-autocomplete': 0,
  'ar" +
                            "ia-checked': 0,
  'aria-expanded': 0,
  'aria-haspopup': 0,
  'aria-level': 0,
 " +
                            " 'aria-modal': 0,
  'aria-multiline': 0,
  'aria-multiselectable': 0,
  'aria-or" +
                            "ientation': 0,
  'aria-placeholder': 0,
  'aria-pressed': 0,
  'aria-readonly': " +
                            "0,
  'aria-required': 0,
  'aria-selected': 0,
  'aria-sort': 0,
  'aria-valuema" +
                            "x': 0,
  'aria-valuemin': 0,
  'aria-valuenow': 0,
  'aria-valuetext': 0,
  // L" +
                            "ive Region Attributes
  'aria-atomic': 0,
  'aria-busy': 0,
  'aria-live': 0,
  " +
                            "'aria-relevant': 0,
  // Drag-and-Drop Attributes
  'aria-dropeffect': 0,
  'ari" +
                            "a-grabbed': 0,
  // Relationship Attributes
  'aria-activedescendant': 0,
  'ari" +
                            "a-colcount': 0,
  'aria-colindex': 0,
  'aria-colspan': 0,
  'aria-controls': 0," +
                            "
  'aria-describedby': 0,
  'aria-errormessage': 0,
  'aria-flowto': 0,
  'aria-" +
                            "labelledby': 0,
  'aria-owns': 0,
  'aria-posinset': 0,
  'aria-rowcount': 0,
  " +
                            "'aria-rowindex': 0,
  'aria-rowspan': 0,
  'aria-setsize': 0
};

var warnedPrope" +
                            "rties = {};
var rARIA = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
v" +
                            "ar rARIACamel = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');

var " +
                            "hasOwnProperty$1 = Object.prototype.hasOwnProperty;

function getStackAddendum()" +
                            " {
  var stack = ReactDebugCurrentFrame.getStackAddendum();
  return stack != nu" +
                            "ll ? stack : '';
}

function validateProperty(tagName, name) {
  if (hasOwnPrope" +
                            "rty$1.call(warnedProperties, name) && warnedProperties[name]) {
    return true;" +
                            "
  }

  if (rARIACamel.test(name)) {
    var ariaName = 'aria-' + name.slice(4)." +
                            "toLowerCase();
    var correctName = ariaProperties.hasOwnProperty(ariaName) ? a" +
                            "riaName : null;

    // If this is an aria-* attribute, but is not listed in the" +
                            " known DOM
    // DOM properties, then it is an invalid aria-* attribute.
    if" +
                            " (correctName == null) {
      warning_1$1(false, 'Invalid ARIA attribute `%s`. " +
                            "ARIA attributes follow the pattern aria-* and must be lowercase.%s', name, getSt" +
                            "ackAddendum());
      warnedProperties[name] = true;
      return true;
    }
  " +
                            "  // aria-* attributes should be lowercase; suggest the lowercase version.
    i" +
                            "f (name !== correctName) {
      warning_1$1(false, 'Invalid ARIA attribute `%s`" +
                            ". Did you mean `%s`?%s', name, correctName, getStackAddendum());
      warnedPro" +
                            "perties[name] = true;
      return true;
    }
  }

  if (rARIA.test(name)) {
  " +
                            "  var lowerCasedName = name.toLowerCase();
    var standardName = ariaProperties" +
                            ".hasOwnProperty(lowerCasedName) ? lowerCasedName : null;

    // If this is an a" +
                            "ria-* attribute, but is not listed in the known DOM
    // DOM properties, then " +
                            "it is an invalid aria-* attribute.
    if (standardName == null) {
      warnedP" +
                            "roperties[name] = true;
      return false;
    }
    // aria-* attributes shoul" +
                            "d be lowercase; suggest the lowercase version.
    if (name !== standardName) {
" +
                            "      warning_1$1(false, 'Unknown ARIA attribute `%s`. Did you mean `%s`?%s', na" +
                            "me, standardName, getStackAddendum());
      warnedProperties[name] = true;
    " +
                            "  return true;
    }
  }

  return true;
}

function warnInvalidARIAProps(type, " +
                            "props) {
  var invalidProps = [];

  for (var key in props) {
    var isValid = " +
                            "validateProperty(type, key);
    if (!isValid) {
      invalidProps.push(key);
 " +
                            "   }
  }

  var unknownPropString = invalidProps.map(function (prop) {
    retur" +
                            "n '`' + prop + '`';
  }).join(', ');

  if (invalidProps.length === 1) {
    war" +
                            "ning_1$1(false, 'Invalid aria prop %s on <%s> tag. ' + 'For details, see https:/" +
                            "/fb.me/invalid-aria-prop%s', unknownPropString, type, getStackAddendum());
  } e" +
                            "lse if (invalidProps.length > 1) {
    warning_1$1(false, 'Invalid aria props %s" +
                            " on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownP" +
                            "ropString, type, getStackAddendum());
  }
}

function validateProperties(type, p" +
                            "rops) {
  if (isCustomComponent(type, props)) {
    return;
  }
  warnInvalidARI" +
                            "AProps(type, props);
}

var didWarnValueNull = false;

function getStackAddendum" +
                            "$1() {
  var stack = ReactDebugCurrentFrame.getStackAddendum();
  return stack !" +
                            "= null ? stack : '';
}

function validateProperties$1(type, props) {
  if (type " +
                            "!== 'input' && type !== 'textarea' && type !== 'select') {
    return;
  }

  if" +
                            " (props != null && props.value === null && !didWarnValueNull) {
    didWarnValue" +
                            "Null = true;
    if (type === 'select' && props.multiple) {
      warning_1$1(fa" +
                            "lse, '`value` prop on `%s` should not be null. ' + 'Consider using an empty arra" +
                            "y when `multiple` is set to `true` ' + 'to clear the component or `undefined` fo" +
                            "r uncontrolled components.%s', type, getStackAddendum$1());
    } else {
      w" +
                            "arning_1$1(false, '`value` prop on `%s` should not be null. ' + 'Consider using " +
                            "an empty string to clear the component or `undefined` ' + 'for uncontrolled comp" +
                            "onents.%s', type, getStackAddendum$1());
    }
  }
}

// When adding attributes " +
                            "to the HTML or SVG whitelist, be sure to
// also add them to this module to ensu" +
                            "re casing and incorrect name
// warnings.
var possibleStandardNames = {
  // HTM" +
                            "L
  accept: 'accept',
  acceptcharset: 'acceptCharset',
  'accept-charset': 'acc" +
                            "eptCharset',
  accesskey: 'accessKey',
  action: 'action',
  allowfullscreen: 'a" +
                            "llowFullScreen',
  alt: 'alt',
  as: 'as',
  async: 'async',
  autocapitalize: '" +
                            "autoCapitalize',
  autocomplete: 'autoComplete',
  autocorrect: 'autoCorrect',
 " +
                            " autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  autosave: 'autoSave',
  captu" +
                            "re: 'capture',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  cha" +
                            "llenge: 'challenge',
  charset: 'charSet',
  checked: 'checked',
  children: 'ch" +
                            "ildren',
  cite: 'cite',
  'class': 'className',
  classid: 'classID',
  classna" +
                            "me: 'className',
  cols: 'cols',
  colspan: 'colSpan',
  content: 'content',
  c" +
                            "ontenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  controls: 'co" +
                            "ntrols',
  controlslist: 'controlsList',
  coords: 'coords',
  crossorigin: 'cro" +
                            "ssOrigin',
  dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
  data: 'data'," +
                            "
  datetime: 'dateTime',
  'default': 'default',
  defaultchecked: 'defaultCheck" +
                            "ed',
  defaultvalue: 'defaultValue',
  defer: 'defer',
  dir: 'dir',
  disabled:" +
                            " 'disabled',
  download: 'download',
  draggable: 'draggable',
  enctype: 'encTy" +
                            "pe',
  'for': 'htmlFor',
  form: 'form',
  formmethod: 'formMethod',
  formactio" +
                            "n: 'formAction',
  formenctype: 'formEncType',
  formnovalidate: 'formNoValidate" +
                            "',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  headers: 'headers" +
                            "',
  height: 'height',
  hidden: 'hidden',
  high: 'high',
  href: 'href',
  hre" +
                            "flang: 'hrefLang',
  htmlfor: 'htmlFor',
  httpequiv: 'httpEquiv',
  'http-equiv" +
                            "': 'httpEquiv',
  icon: 'icon',
  id: 'id',
  innerhtml: 'innerHTML',
  inputmod" +
                            "e: 'inputMode',
  integrity: 'integrity',
  is: 'is',
  itemid: 'itemID',
  item" +
                            "prop: 'itemProp',
  itemref: 'itemRef',
  itemscope: 'itemScope',
  itemtype: 'i" +
                            "temType',
  keyparams: 'keyParams',
  keytype: 'keyType',
  kind: 'kind',
  labe" +
                            "l: 'label',
  lang: 'lang',
  list: 'list',
  loop: 'loop',
  low: 'low',
  mani" +
                            "fest: 'manifest',
  marginwidth: 'marginWidth',
  marginheight: 'marginHeight',
" +
                            "  max: 'max',
  maxlength: 'maxLength',
  media: 'media',
  mediagroup: 'mediaGr" +
                            "oup',
  method: 'method',
  min: 'min',
  minlength: 'minLength',
  multiple: 'm" +
                            "ultiple',
  muted: 'muted',
  name: 'name',
  nonce: 'nonce',
  novalidate: 'noV" +
                            "alidate',
  open: 'open',
  optimum: 'optimum',
  pattern: 'pattern',
  placehol" +
                            "der: 'placeholder',
  playsinline: 'playsInline',
  poster: 'poster',
  preload:" +
                            " 'preload',
  profile: 'profile',
  radiogroup: 'radioGroup',
  readonly: 'readO" +
                            "nly',
  referrerpolicy: 'referrerPolicy',
  rel: 'rel',
  required: 'required',
" +
                            "  reversed: 'reversed',
  role: 'role',
  rows: 'rows',
  rowspan: 'rowSpan',
  " +
                            "sandbox: 'sandbox',
  scope: 'scope',
  scoped: 'scoped',
  scrolling: 'scrollin" +
                            "g',
  seamless: 'seamless',
  selected: 'selected',
  shape: 'shape',
  size: 's" +
                            "ize',
  sizes: 'sizes',
  span: 'span',
  spellcheck: 'spellCheck',
  src: 'src'" +
                            ",
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  start: 'start'" +
                            ",
  step: 'step',
  style: 'style',
  summary: 'summary',
  tabindex: 'tabIndex'" +
                            ",
  target: 'target',
  title: 'title',
  type: 'type',
  usemap: 'useMap',
  va" +
                            "lue: 'value',
  width: 'width',
  wmode: 'wmode',
  wrap: 'wrap',

  // SVG
  ab" +
                            "out: 'about',
  accentheight: 'accentHeight',
  'accent-height': 'accentHeight'," +
                            "
  accumulate: 'accumulate',
  additive: 'additive',
  alignmentbaseline: 'align" +
                            "mentBaseline',
  'alignment-baseline': 'alignmentBaseline',
  allowreorder: 'all" +
                            "owReorder',
  alphabetic: 'alphabetic',
  amplitude: 'amplitude',
  arabicform: " +
                            "'arabicForm',
  'arabic-form': 'arabicForm',
  ascent: 'ascent',
  attributename" +
                            ": 'attributeName',
  attributetype: 'attributeType',
  autoreverse: 'autoReverse" +
                            "',
  azimuth: 'azimuth',
  basefrequency: 'baseFrequency',
  baselineshift: 'bas" +
                            "elineShift',
  'baseline-shift': 'baselineShift',
  baseprofile: 'baseProfile',
" +
                            "  bbox: 'bbox',
  begin: 'begin',
  bias: 'bias',
  by: 'by',
  calcmode: 'calcM" +
                            "ode',
  capheight: 'capHeight',
  'cap-height': 'capHeight',
  clip: 'clip',
  c" +
                            "lippath: 'clipPath',
  'clip-path': 'clipPath',
  clippathunits: 'clipPathUnits'" +
                            ",
  cliprule: 'clipRule',
  'clip-rule': 'clipRule',
  color: 'color',
  colorin" +
                            "terpolation: 'colorInterpolation',
  'color-interpolation': 'colorInterpolation'" +
                            ",
  colorinterpolationfilters: 'colorInterpolationFilters',
  'color-interpolati" +
                            "on-filters': 'colorInterpolationFilters',
  colorprofile: 'colorProfile',
  'col" +
                            "or-profile': 'colorProfile',
  colorrendering: 'colorRendering',
  'color-render" +
                            "ing': 'colorRendering',
  contentscripttype: 'contentScriptType',
  contentstyle" +
                            "type: 'contentStyleType',
  cursor: 'cursor',
  cx: 'cx',
  cy: 'cy',
  d: 'd',
" +
                            "  datatype: 'datatype',
  decelerate: 'decelerate',
  descent: 'descent',
  diff" +
                            "useconstant: 'diffuseConstant',
  direction: 'direction',
  display: 'display',
" +
                            "  divisor: 'divisor',
  dominantbaseline: 'dominantBaseline',
  'dominant-baseli" +
                            "ne': 'dominantBaseline',
  dur: 'dur',
  dx: 'dx',
  dy: 'dy',
  edgemode: 'edge" +
                            "Mode',
  elevation: 'elevation',
  enablebackground: 'enableBackground',
  'enab" +
                            "le-background': 'enableBackground',
  end: 'end',
  exponent: 'exponent',
  exte" +
                            "rnalresourcesrequired: 'externalResourcesRequired',
  fill: 'fill',
  fillopacit" +
                            "y: 'fillOpacity',
  'fill-opacity': 'fillOpacity',
  fillrule: 'fillRule',
  'fi" +
                            "ll-rule': 'fillRule',
  filter: 'filter',
  filterres: 'filterRes',
  filterunit" +
                            "s: 'filterUnits',
  floodopacity: 'floodOpacity',
  'flood-opacity': 'floodOpaci" +
                            "ty',
  floodcolor: 'floodColor',
  'flood-color': 'floodColor',
  focusable: 'fo" +
                            "cusable',
  fontfamily: 'fontFamily',
  'font-family': 'fontFamily',
  fontsize:" +
                            " 'fontSize',
  'font-size': 'fontSize',
  fontsizeadjust: 'fontSizeAdjust',
  'f" +
                            "ont-size-adjust': 'fontSizeAdjust',
  fontstretch: 'fontStretch',
  'font-stretc" +
                            "h': 'fontStretch',
  fontstyle: 'fontStyle',
  'font-style': 'fontStyle',
  font" +
                            "variant: 'fontVariant',
  'font-variant': 'fontVariant',
  fontweight: 'fontWeig" +
                            "ht',
  'font-weight': 'fontWeight',
  format: 'format',
  from: 'from',
  fx: 'f" +
                            "x',
  fy: 'fy',
  g1: 'g1',
  g2: 'g2',
  glyphname: 'glyphName',
  'glyph-name'" +
                            ": 'glyphName',
  glyphorientationhorizontal: 'glyphOrientationHorizontal',
  'gl" +
                            "yph-orientation-horizontal': 'glyphOrientationHorizontal',
  glyphorientationver" +
                            "tical: 'glyphOrientationVertical',
  'glyph-orientation-vertical': 'glyphOrienta" +
                            "tionVertical',
  glyphref: 'glyphRef',
  gradienttransform: 'gradientTransform'," +
                            "
  gradientunits: 'gradientUnits',
  hanging: 'hanging',
  horizadvx: 'horizAdvX" +
                            "',
  'horiz-adv-x': 'horizAdvX',
  horizoriginx: 'horizOriginX',
  'horiz-origin" +
                            "-x': 'horizOriginX',
  ideographic: 'ideographic',
  imagerendering: 'imageRende" +
                            "ring',
  'image-rendering': 'imageRendering',
  in2: 'in2',
  'in': 'in',
  inli" +
                            "st: 'inlist',
  intercept: 'intercept',
  k1: 'k1',
  k2: 'k2',
  k3: 'k3',
  k4" +
                            ": 'k4',
  k: 'k',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUni" +
                            "tLength',
  kerning: 'kerning',
  keypoints: 'keyPoints',
  keysplines: 'keySpli" +
                            "nes',
  keytimes: 'keyTimes',
  lengthadjust: 'lengthAdjust',
  letterspacing: '" +
                            "letterSpacing',
  'letter-spacing': 'letterSpacing',
  lightingcolor: 'lightingC" +
                            "olor',
  'lighting-color': 'lightingColor',
  limitingconeangle: 'limitingConeAn" +
                            "gle',
  local: 'local',
  markerend: 'markerEnd',
  'marker-end': 'markerEnd',
 " +
                            " markerheight: 'markerHeight',
  markermid: 'markerMid',
  'marker-mid': 'marker" +
                            "Mid',
  markerstart: 'markerStart',
  'marker-start': 'markerStart',
  markeruni" +
                            "ts: 'markerUnits',
  markerwidth: 'markerWidth',
  mask: 'mask',
  maskcontentun" +
                            "its: 'maskContentUnits',
  maskunits: 'maskUnits',
  mathematical: 'mathematical" +
                            "',
  mode: 'mode',
  numoctaves: 'numOctaves',
  offset: 'offset',
  opacity: 'o" +
                            "pacity',
  operator: 'operator',
  order: 'order',
  orient: 'orient',
  orienta" +
                            "tion: 'orientation',
  origin: 'origin',
  overflow: 'overflow',
  overlineposit" +
                            "ion: 'overlinePosition',
  'overline-position': 'overlinePosition',
  overlineth" +
                            "ickness: 'overlineThickness',
  'overline-thickness': 'overlineThickness',
  pai" +
                            "ntorder: 'paintOrder',
  'paint-order': 'paintOrder',
  panose1: 'panose1',
  'p" +
                            "anose-1': 'panose1',
  pathlength: 'pathLength',
  patterncontentunits: 'pattern" +
                            "ContentUnits',
  patterntransform: 'patternTransform',
  patternunits: 'patternU" +
                            "nits',
  pointerevents: 'pointerEvents',
  'pointer-events': 'pointerEvents',
  " +
                            "points: 'points',
  pointsatx: 'pointsAtX',
  pointsaty: 'pointsAtY',
  pointsat" +
                            "z: 'pointsAtZ',
  prefix: 'prefix',
  preservealpha: 'preserveAlpha',
  preserve" +
                            "aspectratio: 'preserveAspectRatio',
  primitiveunits: 'primitiveUnits',
  proper" +
                            "ty: 'property',
  r: 'r',
  radius: 'radius',
  refx: 'refX',
  refy: 'refY',
  " +
                            "renderingintent: 'renderingIntent',
  'rendering-intent': 'renderingIntent',
  r" +
                            "epeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  requiredextensions: 'requ" +
                            "iredExtensions',
  requiredfeatures: 'requiredFeatures',
  resource: 'resource'," +
                            "
  restart: 'restart',
  result: 'result',
  results: 'results',
  rotate: 'rota" +
                            "te',
  rx: 'rx',
  ry: 'ry',
  scale: 'scale',
  security: 'security',
  seed: '" +
                            "seed',
  shaperendering: 'shapeRendering',
  'shape-rendering': 'shapeRendering'" +
                            ",
  slope: 'slope',
  spacing: 'spacing',
  specularconstant: 'specularConstant'" +
                            ",
  specularexponent: 'specularExponent',
  speed: 'speed',
  spreadmethod: 'spr" +
                            "eadMethod',
  startoffset: 'startOffset',
  stddeviation: 'stdDeviation',
  stem" +
                            "h: 'stemh',
  stemv: 'stemv',
  stitchtiles: 'stitchTiles',
  stopcolor: 'stopCo" +
                            "lor',
  'stop-color': 'stopColor',
  stopopacity: 'stopOpacity',
  'stop-opacity" +
                            "': 'stopOpacity',
  strikethroughposition: 'strikethroughPosition',
  'strikethr" +
                            "ough-position': 'strikethroughPosition',
  strikethroughthickness: 'strikethroug" +
                            "hThickness',
  'strikethrough-thickness': 'strikethroughThickness',
  string: 's" +
                            "tring',
  stroke: 'stroke',
  strokedasharray: 'strokeDasharray',
  'stroke-dash" +
                            "array': 'strokeDasharray',
  strokedashoffset: 'strokeDashoffset',
  'stroke-das" +
                            "hoffset': 'strokeDashoffset',
  strokelinecap: 'strokeLinecap',
  'stroke-lineca" +
                            "p': 'strokeLinecap',
  strokelinejoin: 'strokeLinejoin',
  'stroke-linejoin': 's" +
                            "trokeLinejoin',
  strokemiterlimit: 'strokeMiterlimit',
  'stroke-miterlimit': '" +
                            "strokeMiterlimit',
  strokewidth: 'strokeWidth',
  'stroke-width': 'strokeWidth'" +
                            ",
  strokeopacity: 'strokeOpacity',
  'stroke-opacity': 'strokeOpacity',
  suppr" +
                            "esscontenteditablewarning: 'suppressContentEditableWarning',
  suppresshydration" +
                            "warning: 'suppressHydrationWarning',
  surfacescale: 'surfaceScale',
  systemlan" +
                            "guage: 'systemLanguage',
  tablevalues: 'tableValues',
  targetx: 'targetX',
  t" +
                            "argety: 'targetY',
  textanchor: 'textAnchor',
  'text-anchor': 'textAnchor',
  " +
                            "textdecoration: 'textDecoration',
  'text-decoration': 'textDecoration',
  textl" +
                            "ength: 'textLength',
  textrendering: 'textRendering',
  'text-rendering': 'text" +
                            "Rendering',
  to: 'to',
  transform: 'transform',
  'typeof': 'typeof',
  u1: 'u" +
                            "1',
  u2: 'u2',
  underlineposition: 'underlinePosition',
  'underline-position'" +
                            ": 'underlinePosition',
  underlinethickness: 'underlineThickness',
  'underline-" +
                            "thickness': 'underlineThickness',
  unicode: 'unicode',
  unicodebidi: 'unicodeB" +
                            "idi',
  'unicode-bidi': 'unicodeBidi',
  unicoderange: 'unicodeRange',
  'unicod" +
                            "e-range': 'unicodeRange',
  unitsperem: 'unitsPerEm',
  'units-per-em': 'unitsPe" +
                            "rEm',
  unselectable: 'unselectable',
  valphabetic: 'vAlphabetic',
  'v-alphabe" +
                            "tic': 'vAlphabetic',
  values: 'values',
  vectoreffect: 'vectorEffect',
  'vect" +
                            "or-effect': 'vectorEffect',
  version: 'version',
  vertadvy: 'vertAdvY',
  'ver" +
                            "t-adv-y': 'vertAdvY',
  vertoriginx: 'vertOriginX',
  'vert-origin-x': 'vertOrig" +
                            "inX',
  vertoriginy: 'vertOriginY',
  'vert-origin-y': 'vertOriginY',
  vhanging" +
                            ": 'vHanging',
  'v-hanging': 'vHanging',
  videographic: 'vIdeographic',
  'v-id" +
                            "eographic': 'vIdeographic',
  viewbox: 'viewBox',
  viewtarget: 'viewTarget',
  " +
                            "visibility: 'visibility',
  vmathematical: 'vMathematical',
  'v-mathematical': " +
                            "'vMathematical',
  vocab: 'vocab',
  widths: 'widths',
  wordspacing: 'wordSpaci" +
                            "ng',
  'word-spacing': 'wordSpacing',
  writingmode: 'writingMode',
  'writing-m" +
                            "ode': 'writingMode',
  x1: 'x1',
  x2: 'x2',
  x: 'x',
  xchannelselector: 'xCha" +
                            "nnelSelector',
  xheight: 'xHeight',
  'x-height': 'xHeight',
  xlinkactuate: 'x" +
                            "linkActuate',
  'xlink:actuate': 'xlinkActuate',
  xlinkarcrole: 'xlinkArcrole'," +
                            "
  'xlink:arcrole': 'xlinkArcrole',
  xlinkhref: 'xlinkHref',
  'xlink:href': 'x" +
                            "linkHref',
  xlinkrole: 'xlinkRole',
  'xlink:role': 'xlinkRole',
  xlinkshow: '" +
                            "xlinkShow',
  'xlink:show': 'xlinkShow',
  xlinktitle: 'xlinkTitle',
  'xlink:ti" +
                            "tle': 'xlinkTitle',
  xlinktype: 'xlinkType',
  'xlink:type': 'xlinkType',
  xml" +
                            "base: 'xmlBase',
  'xml:base': 'xmlBase',
  xmllang: 'xmlLang',
  'xml:lang': 'x" +
                            "mlLang',
  xmlns: 'xmlns',
  'xml:space': 'xmlSpace',
  xmlnsxlink: 'xmlnsXlink'" +
                            ",
  'xmlns:xlink': 'xmlnsXlink',
  xmlspace: 'xmlSpace',
  y1: 'y1',
  y2: 'y2'," +
                            "
  y: 'y',
  ychannelselector: 'yChannelSelector',
  z: 'z',
  zoomandpan: 'zoom" +
                            "AndPan'
};

function getStackAddendum$2() {
  var stack = ReactDebugCurrentFrame" +
                            ".getStackAddendum();
  return stack != null ? stack : '';
}

{
  var warnedPrope" +
                            "rties$1 = {};
  var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  var EV" +
                            "ENT_NAME_REGEX = /^on[A-Z]/;
  var rARIA$1 = new RegExp('^(aria)-[' + ATTRIBUTE_" +
                            "NAME_CHAR + ']*$');
  var rARIACamel$1 = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_" +
                            "NAME_CHAR + ']*$');

  var validateProperty$1 = function (tagName, name, value) " +
                            "{
    if (hasOwnProperty$2.call(warnedProperties$1, name) && warnedProperties$1[" +
                            "name]) {
      return true;
    }

    if (registrationNameModules.hasOwnPropert" +
                            "y(name)) {
      return true;
    }

    if (plugins.length === 0 && EVENT_NAME_" +
                            "REGEX.test(name)) {
      // If no event plugins have been injected, we might be" +
                            " in a server environment.
      // Don't check events in this case.
      return" +
                            " true;
    }

    var lowerCasedName = name.toLowerCase();
    var registrationN" +
                            "ame = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistr" +
                            "ationNames[lowerCasedName] : null;

    if (registrationName != null) {
      wa" +
                            "rning_1$1(false, 'Invalid event handler property `%s`. Did you mean `%s`?%s', na" +
                            "me, registrationName, getStackAddendum$2());
      warnedProperties$1[name] = tr" +
                            "ue;
      return true;
    }

    if (lowerCasedName.indexOf('on') === 0 && lowe" +
                            "rCasedName.length > 2) {
      warning_1$1(false, 'Unknown event handler propert" +
                            "y `%s`. It will be ignored.%s', name, getStackAddendum$2());
      warnedPropert" +
                            "ies$1[name] = true;
      return true;
    }

    // Let the ARIA attribute hook" +
                            " validate ARIA attributes
    if (rARIA$1.test(name) || rARIACamel$1.test(name))" +
                            " {
      return true;
    }

    if (lowerCasedName === 'onfocusin' || lowerCase" +
                            "dName === 'onfocusout') {
      warning_1$1(false, 'React uses onFocus and onBlu" +
                            "r instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to b" +
                            "ubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.');
  " +
                            "    warnedProperties$1[name] = true;
      return true;
    }

    if (lowerCase" +
                            "dName === 'innerhtml') {
      warning_1$1(false, 'Directly setting property `in" +
                            "nerHTML` is not permitted. ' + 'For more information, lookup documentation on `d" +
                            "angerouslySetInnerHTML`.');
      warnedProperties$1[name] = true;
      return " +
                            "true;
    }

    if (lowerCasedName === 'aria') {
      warning_1$1(false, 'The " +
                            "`aria` attribute is reserved for future use in React. ' + 'Pass individual `aria" +
                            "-` attributes instead.');
      warnedProperties$1[name] = true;
      return tr" +
                            "ue;
    }

    if (lowerCasedName === 'is' && value !== null && value !== undefi" +
                            "ned && typeof value !== 'string') {
      warning_1$1(false, 'Received a `%s` fo" +
                            "r a string attribute `is`. If this is expected, cast ' + 'the value to a string." +
                            "%s', typeof value, getStackAddendum$2());
      warnedProperties$1[name] = true;" +
                            "
      return true;
    }

    if (typeof value === 'number' && isNaN(value)) {
" +
                            "      warning_1$1(false, 'Received NaN for the `%s` attribute. If this is expect" +
                            "ed, cast ' + 'the value to a string.%s', name, getStackAddendum$2());
      warn" +
                            "edProperties$1[name] = true;
      return true;
    }

    var isReserved = isRe" +
                            "servedProp(name);

    // Known attributes should match the casing specified in " +
                            "the property config.
    if (possibleStandardNames.hasOwnProperty(lowerCasedName" +
                            ")) {
      var standardName = possibleStandardNames[lowerCasedName];
      if (s" +
                            "tandardName !== name) {
        warning_1$1(false, 'Invalid DOM property `%s`. D" +
                            "id you mean `%s`?%s', name, standardName, getStackAddendum$2());
        warnedP" +
                            "roperties$1[name] = true;
        return true;
      }
    } else if (!isReserve" +
                            "d && name !== lowerCasedName) {
      // Unknown attributes should have lowercas" +
                            "e casing since that's how they
      // will be cased anyway with server renderi" +
                            "ng.
      warning_1$1(false, 'React does not recognize the `%s` prop on a DOM el" +
                            "ement. If you ' + 'intentionally want it to appear in the DOM as a custom ' + 'a" +
                            "ttribute, spell it as lowercase `%s` instead. ' + 'If you accidentally passed it" +
                            " from a parent component, remove ' + 'it from the DOM element.%s', name, lowerCa" +
                            "sedName, getStackAddendum$2());
      warnedProperties$1[name] = true;
      ret" +
                            "urn true;
    }

    if (typeof value === 'boolean' && !shouldAttributeAcceptBoo" +
                            "leanValue(name)) {
      if (value) {
        warning_1$1(false, 'Received `%s` " +
                            "for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pa" +
                            "ss a string instead: ' + '%s="%s" or %s={value.toString()}.%s', value, name, nam" +
                            "e, value, name, getStackAddendum$2());
      } else {
        warning_1$1(false," +
                            " 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write i" +
                            "t to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.\n\n'" +
                            " + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass" +
                            " %s={condition ? value : undefined} instead.%s', value, name, name, value, name," +
                            " name, name, getStackAddendum$2());
      }
      warnedProperties$1[name] = tru" +
                            "e;
      return true;
    }

    // Now that we've validated casing, do not vali" +
                            "date
    // data types for reserved props
    if (isReserved) {
      return tru" +
                            "e;
    }

    // Warn when a known attribute is a bad type
    if (!shouldSetAtt" +
                            "ribute(name, value)) {
      warnedProperties$1[name] = true;
      return false" +
                            ";
    }

    return true;
  };
}

var warnUnknownProperties = function (type, pr" +
                            "ops) {
  var unknownProps = [];
  for (var key in props) {
    var isValid = val" +
                            "idateProperty$1(type, key, props[key]);
    if (!isValid) {
      unknownProps.p" +
                            "ush(key);
    }
  }

  var unknownPropString = unknownProps.map(function (prop) " +
                            "{
    return '`' + prop + '`';
  }).join(', ');
  if (unknownProps.length === 1)" +
                            " {
    warning_1$1(false, 'Invalid value for prop %s on <%s> tag. Either remove " +
                            "it from the element, ' + 'or pass a string or number value to keep it in the DOM" +
                            ". ' + 'For details, see https://fb.me/react-attribute-behavior%s', unknownPropSt" +
                            "ring, type, getStackAddendum$2());
  } else if (unknownProps.length > 1) {
    w" +
                            "arning_1$1(false, 'Invalid values for props %s on <%s> tag. Either remove them f" +
                            "rom the element, ' + 'or pass a string or number value to keep them in the DOM. " +
                            "' + 'For details, see https://fb.me/react-attribute-behavior%s', unknownPropStri" +
                            "ng, type, getStackAddendum$2());
  }
};

function validateProperties$2(type, pro" +
                            "ps) {
  if (isCustomComponent(type, props)) {
    return;
  }
  warnUnknownPrope" +
                            "rties(type, props);
}

// TODO: direct imports like some-package/src/* are bad. " +
                            "Fix me.
var getCurrentFiberOwnerName$1 = ReactDebugCurrentFiber.getCurrentFiberO" +
                            "wnerName;
var getCurrentFiberStackAddendum$2 = ReactDebugCurrentFiber.getCurrent" +
                            "FiberStackAddendum;

var didWarnInvalidHydration = false;
var didWarnShadyDOM = " +
                            "false;

var DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
var SUPPRESS" +
                            "_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning';
var SUPPRESS_HYDRA" +
                            "TION_WARNING$1 = 'suppressHydrationWarning';
var AUTOFOCUS = 'autoFocus';
var CH" +
                            "ILDREN = 'children';
var STYLE = 'style';
var HTML = '__html';

var HTML_NAMESPA" +
                            "CE = Namespaces.html;


var getStack = emptyFunction_1.thatReturns('');

{
  get" +
                            "Stack = getCurrentFiberStackAddendum$2;

  var warnedUnknownTags = {
    // Chro" +
                            "me is the only major browser not shipping <time>. But as of July
    // 2017 it " +
                            "intends to ship it due to widespread usage. We intentionally
    // *don't* warn" +
                            " for <time> even if it's unrecognized by Chrome because
    // it soon will be, " +
                            "and many apps have been using it anyway.
    time: true,
    // There are workin" +
                            "g polyfills for <dialog>. Let people use it.
    dialog: true
  };

  var valida" +
                            "tePropertiesInDevelopment = function (type, props) {
    validateProperties(type" +
                            ", props);
    validateProperties$1(type, props);
    validateProperties$2(type, " +
                            "props);
  };

  // HTML parsing normalizes CR and CRLF to LF.
  // It also can t" +
                            "urn \u0000 into \uFFFD inside attributes.
  // https://www.w3.org/TR/html5/singl" +
                            "e-page.html#preprocessing-the-input-stream
  // If we have a mismatch, it might " +
                            "be caused by that.
  // We will still patch up in this case but not fire the war" +
                            "ning.
  var NORMALIZE_NEWLINES_REGEX = /\r\n?/g;
  var NORMALIZE_NULL_AND_REPLAC" +
                            "EMENT_REGEX = /\u0000|\uFFFD/g;

  var normalizeMarkupForTextOrAttribute = funct" +
                            "ion (markup) {
    var markupString = typeof markup === 'string' ? markup : '' +" +
                            " markup;
    return markupString.replace(NORMALIZE_NEWLINES_REGEX, '\n').replace" +
                            "(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, '');
  };

  var warnForTextDifference = " +
                            "function (serverText, clientText) {
    if (didWarnInvalidHydration) {
      ret" +
                            "urn;
    }
    var normalizedClientText = normalizeMarkupForTextOrAttribute(clie" +
                            "ntText);
    var normalizedServerText = normalizeMarkupForTextOrAttribute(server" +
                            "Text);
    if (normalizedServerText === normalizedClientText) {
      return;
  " +
                            "  }
    didWarnInvalidHydration = true;
    warning_1$1(false, 'Text content did" +
                            " not match. Server: "%s" Client: "%s"', normalizedServerText, normalizedClientTe" +
                            "xt);
  };

  var warnForPropDifference = function (propName, serverValue, client" +
                            "Value) {
    if (didWarnInvalidHydration) {
      return;
    }
    var normaliz" +
                            "edClientValue = normalizeMarkupForTextOrAttribute(clientValue);
    var normaliz" +
                            "edServerValue = normalizeMarkupForTextOrAttribute(serverValue);
    if (normaliz" +
                            "edServerValue === normalizedClientValue) {
      return;
    }
    didWarnInvali" +
                            "dHydration = true;
    warning_1$1(false, 'Prop `%s` did not match. Server: %s C" +
                            "lient: %s', propName, JSON.stringify(normalizedServerValue), JSON.stringify(norm" +
                            "alizedClientValue));
  };

  var warnForExtraAttributes = function (attributeNam" +
                            "es) {
    if (didWarnInvalidHydration) {
      return;
    }
    didWarnInvalidH" +
                            "ydration = true;
    var names = [];
    attributeNames.forEach(function (name) " +
                            "{
      names.push(name);
    });
    warning_1$1(false, 'Extra attributes from " +
                            "the server: %s', names);
  };

  var warnForInvalidEventListener = function (reg" +
                            "istrationName, listener) {
    if (listener === false) {
      warning_1$1(false" +
                            ", 'Expected `%s` listener to be a function, instead got `false`.\n\n' + 'If you " +
                            "used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condit" +
                            "ion ? value : undefined} instead.%s', registrationName, registrationName, regist" +
                            "rationName, getCurrentFiberStackAddendum$2());
    } else {
      warning_1$1(fa" +
                            "lse, 'Expected `%s` listener to be a function, instead got a value of `%s` type." +
                            "%s', registrationName, typeof listener, getCurrentFiberStackAddendum$2());
    }" +
                            "
  };

  // Parse the HTML and read it back to normalize the HTML string so that" +
                            " it
  // can be used for comparison.
  var normalizeHTML = function (parent, htm" +
                            "l) {
    // We could have created a separate document here to avoid
    // re-in" +
                            "itializing custom elements if they exist. But this breaks
    // how <noscript> " +
                            "is being handled. So we use the same document.
    // See the discussion in http" +
                            "s://github.com/facebook/react/pull/11157.
    var testElement = parent.namespace" +
                            "URI === HTML_NAMESPACE ? parent.ownerDocument.createElement(parent.tagName) : pa" +
                            "rent.ownerDocument.createElementNS(parent.namespaceURI, parent.tagName);
    tes" +
                            "tElement.innerHTML = html;
    return testElement.innerHTML;
  };
}

function en" +
                            "sureListeningTo(rootContainerElement, registrationName) {
  var isDocumentOrFrag" +
                            "ment = rootContainerElement.nodeType === DOCUMENT_NODE || rootContainerElement.n" +
                            "odeType === DOCUMENT_FRAGMENT_NODE;
  var doc = isDocumentOrFragment ? rootConta" +
                            "inerElement : rootContainerElement.ownerDocument;
  listenTo(registrationName, d" +
                            "oc);
}

function getOwnerDocumentFromRootContainer(rootContainerElement) {
  ret" +
                            "urn rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : roo" +
                            "tContainerElement.ownerDocument;
}

// There are so many media events, it makes " +
                            "sense to just
// maintain a list rather than create a `trapBubbledEvent` for eac" +
                            "h
var mediaEvents = {
  topAbort: 'abort',
  topCanPlay: 'canplay',
  topCanPlay" +
                            "Through: 'canplaythrough',
  topDurationChange: 'durationchange',
  topEmptied: " +
                            "'emptied',
  topEncrypted: 'encrypted',
  topEnded: 'ended',
  topError: 'error'" +
                            ",
  topLoadedData: 'loadeddata',
  topLoadedMetadata: 'loadedmetadata',
  topLoa" +
                            "dStart: 'loadstart',
  topPause: 'pause',
  topPlay: 'play',
  topPlaying: 'play" +
                            "ing',
  topProgress: 'progress',
  topRateChange: 'ratechange',
  topSeeked: 'se" +
                            "eked',
  topSeeking: 'seeking',
  topStalled: 'stalled',
  topSuspend: 'suspend'" +
                            ",
  topTimeUpdate: 'timeupdate',
  topVolumeChange: 'volumechange',
  topWaiting" +
                            ": 'waiting'
};

function trapClickOnNonInteractiveElement(node) {
  // Mobile Sa" +
                            "fari does not fire properly bubble click events on
  // non-interactive elements" +
                            ", which means delegated click listeners do not
  // fire. The workaround for thi" +
                            "s bug involves attaching an empty click
  // listener on the target node.
  // h" +
                            "ttp://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
  // Just se" +
                            "t it using the onclick property so that we don't have to manage any
  // bookkee" +
                            "ping for it. Not sure if we need to clear it when the listener is
  // removed.
" +
                            "  // TODO: Only do this for the relevant Safaris maybe?
  node.onclick = emptyFu" +
                            "nction_1;
}

function setInitialDOMProperties(tag, domElement, rootContainerElem" +
                            "ent, nextProps, isCustomComponentTag) {
  for (var propKey in nextProps) {
    i" +
                            "f (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }
    var nextProp " +
                            "= nextProps[propKey];
    if (propKey === STYLE) {
      {
        if (nextProp)" +
                            " {
          // Freeze the next style object so that we can assume it won't be
 " +
                            "         // mutated. We have already warned for this in the past.
          Obje" +
                            "ct.freeze(nextProp);
        }
      }
      // Relies on `updateStylesByID` not" +
                            " mutating `styleUpdates`.
      setValueForStyles(domElement, nextProp, getStack" +
                            ");
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      var nextHtml =" +
                            " nextProp ? nextProp[HTML] : undefined;
      if (nextHtml != null) {
        se" +
                            "tInnerHTML(domElement, nextHtml);
      }
    } else if (propKey === CHILDREN) {" +
                            "
      if (typeof nextProp === 'string') {
        // Avoid setting initial text" +
                            "Content when the text is empty. In IE11 setting
        // textContent on a <tex" +
                            "tarea> will cause the placeholder to not
        // show within the <textarea> u" +
                            "ntil it has been focused and blurred again.
        // https://github.com/facebo" +
                            "ok/react/issues/6731#issuecomment-254874553
        var canSetTextContent = tag " +
                            "!== 'textarea' || nextProp !== '';
        if (canSetTextContent) {
          se" +
                            "tTextContent$1(domElement, nextProp);
        }
      } else if (typeof nextProp" +
                            " === 'number') {
        setTextContent$1(domElement, '' + nextProp);
      }
  " +
                            "  } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRE" +
                            "SS_HYDRATION_WARNING$1) {
      // Noop
    } else if (propKey === AUTOFOCUS) {
" +
                            "      // We polyfill it separately on the client during commit.
      // We blac" +
                            "klist it here rather than in the property list because we emit it in SSR.
    } " +
                            "else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp !" +
                            "= null) {
        if (true && typeof nextProp !== 'function') {
          warnFo" +
                            "rInvalidEventListener(propKey, nextProp);
        }
        ensureListeningTo(ro" +
                            "otContainerElement, propKey);
      }
    } else if (isCustomComponentTag) {
   " +
                            "   setValueForAttribute(domElement, propKey, nextProp);
    } else if (nextProp " +
                            "!= null) {
      // If we're updating to null or undefined, we should remove the" +
                            " property
      // from the DOM node instead of inadvertently setting to a strin" +
                            "g. This
      // brings us in line with the same behavior we have on initial ren" +
                            "der.
      setValueForProperty(domElement, propKey, nextProp);
    }
  }
}

func" +
                            "tion updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCus" +
                            "tomComponentTag) {
  // TODO: Handle wasCustomComponentTag
  for (var i = 0; i <" +
                            " updatePayload.length; i += 2) {
    var propKey = updatePayload[i];
    var pro" +
                            "pValue = updatePayload[i + 1];
    if (propKey === STYLE) {
      setValueForSty" +
                            "les(domElement, propValue, getStack);
    } else if (propKey === DANGEROUSLY_SET" +
                            "_INNER_HTML) {
      setInnerHTML(domElement, propValue);
    } else if (propKey" +
                            " === CHILDREN) {
      setTextContent$1(domElement, propValue);
    } else if (i" +
                            "sCustomComponentTag) {
      if (propValue != null) {
        setValueForAttribu" +
                            "te(domElement, propKey, propValue);
      } else {
        deleteValueForAttribu" +
                            "te(domElement, propKey);
      }
    } else if (propValue != null) {
      setVa" +
                            "lueForProperty(domElement, propKey, propValue);
    } else {
      // If we're u" +
                            "pdating to null or undefined, we should remove the property
      // from the DO" +
                            "M node instead of inadvertently setting to a string. This
      // brings us in " +
                            "line with the same behavior we have on initial render.
      deleteValueForPrope" +
                            "rty(domElement, propKey);
    }
  }
}

function createElement$1(type, props, roo" +
                            "tContainerElement, parentNamespace) {
  // We create tags in the namespace of th" +
                            "eir parent container, except HTML
  var ownerDocument = getOwnerDocumentFromRoot" +
                            "Container(rootContainerElement);
  var domElement;
  var namespaceURI = parentNa" +
                            "mespace;
  if (namespaceURI === HTML_NAMESPACE) {
    namespaceURI = getIntrinsi" +
                            "cNamespace(type);
  }
  if (namespaceURI === HTML_NAMESPACE) {
    {
      var i" +
                            "sCustomComponentTag = isCustomComponent(type, props);
      // Should this check" +
                            " be gated by parent namespace? Not sure we want to
      // allow <SVG> or <mATH" +
                            ">.
      warning_1$1(isCustomComponentTag || type === type.toLowerCase(), '<%s /" +
                            "> is using uppercase HTML. Always use lowercase HTML tags ' + 'in React.', type)" +
                            ";
    }

    if (type === 'script') {
      // Create the script via .innerHTML " +
                            "so its "parser-inserted" flag is
      // set to true and it does not execute
  " +
                            "    var div = ownerDocument.createElement('div');
      div.innerHTML = '<script" +
                            "><' + '/script>'; // eslint-disable-line
      // This is guaranteed to yield a " +
                            "script element.
      var firstChild = div.firstChild;
      domElement = div.re" +
                            "moveChild(firstChild);
    } else if (typeof props.is === 'string') {
      // $" +
                            "FlowIssue `createElement` should be updated for Web Components
      domElement " +
                            "= ownerDocument.createElement(type, { is: props.is });
    } else {
      // Sep" +
                            "arate else branch instead of using `props.is || undefined` above because of a Fi" +
                            "refox bug.
      // See discussion in https://github.com/facebook/react/pull/689" +
                            "6
      // and discussion in https://bugzilla.mozilla.org/show_bug.cgi?id=127624" +
                            "0
      domElement = ownerDocument.createElement(type);
    }
  } else {
    dom" +
                            "Element = ownerDocument.createElementNS(namespaceURI, type);
  }

  {
    if (na" +
                            "mespaceURI === HTML_NAMESPACE) {
      if (!isCustomComponentTag && Object.proto" +
                            "type.toString.call(domElement) === '[object HTMLUnknownElement]' && !Object.prot" +
                            "otype.hasOwnProperty.call(warnedUnknownTags, type)) {
        warnedUnknownTags[" +
                            "type] = true;
        warning_1$1(false, 'The tag <%s> is unrecognized in this b" +
                            "rowser. ' + 'If you meant to render a React component, start its name with ' + '" +
                            "an uppercase letter.', type);
      }
    }
  }

  return domElement;
}

functio" +
                            "n createTextNode$1(text, rootContainerElement) {
  return getOwnerDocumentFromRo" +
                            "otContainer(rootContainerElement).createTextNode(text);
}

function setInitialPr" +
                            "operties$1(domElement, tag, rawProps, rootContainerElement) {
  var isCustomComp" +
                            "onentTag = isCustomComponent(tag, rawProps);
  {
    validatePropertiesInDevelop" +
                            "ment(tag, rawProps);
    if (isCustomComponentTag && !didWarnShadyDOM && domElem" +
                            "ent.shadyRoot) {
      warning_1$1(false, '%s is using shady DOM. Using shady DO" +
                            "M with React can ' + 'cause things to break subtly.', getCurrentFiberOwnerName$1" +
                            "() || 'A component');
      didWarnShadyDOM = true;
    }
  }

  // TODO: Make s" +
                            "ure that we check isMounted before firing any of these events.
  var props;
  sw" +
                            "itch (tag) {
    case 'iframe':
    case 'object':
      trapBubbledEvent('topLo" +
                            "ad', 'load', domElement);
      props = rawProps;
      break;
    case 'video':" +
                            "
    case 'audio':
      // Create listener for each media event
      for (var " +
                            "event in mediaEvents) {
        if (mediaEvents.hasOwnProperty(event)) {
       " +
                            "   trapBubbledEvent(event, mediaEvents[event], domElement);
        }
      }
  " +
                            "    props = rawProps;
      break;
    case 'source':
      trapBubbledEvent('to" +
                            "pError', 'error', domElement);
      props = rawProps;
      break;
    case 'im" +
                            "g':
    case 'image':
      trapBubbledEvent('topError', 'error', domElement);
 " +
                            "     trapBubbledEvent('topLoad', 'load', domElement);
      props = rawProps;
  " +
                            "    break;
    case 'form':
      trapBubbledEvent('topReset', 'reset', domEleme" +
                            "nt);
      trapBubbledEvent('topSubmit', 'submit', domElement);
      props = ra" +
                            "wProps;
      break;
    case 'details':
      trapBubbledEvent('topToggle', 'to" +
                            "ggle', domElement);
      props = rawProps;
      break;
    case 'input':
     " +
                            " initWrapperState(domElement, rawProps);
      props = getHostProps(domElement, " +
                            "rawProps);
      trapBubbledEvent('topInvalid', 'invalid', domElement);
      //" +
                            " For controlled components we always need to ensure we're listening
      // to " +
                            "onChange. Even if there is no listener.
      ensureListeningTo(rootContainerEle" +
                            "ment, 'onChange');
      break;
    case 'option':
      validateProps(domElemen" +
                            "t, rawProps);
      props = getHostProps$1(domElement, rawProps);
      break;
 " +
                            "   case 'select':
      initWrapperState$1(domElement, rawProps);
      props = " +
                            "getHostProps$2(domElement, rawProps);
      trapBubbledEvent('topInvalid', 'inva" +
                            "lid', domElement);
      // For controlled components we always need to ensure w" +
                            "e're listening
      // to onChange. Even if there is no listener.
      ensureL" +
                            "isteningTo(rootContainerElement, 'onChange');
      break;
    case 'textarea':
" +
                            "      initWrapperState$2(domElement, rawProps);
      props = getHostProps$3(dom" +
                            "Element, rawProps);
      trapBubbledEvent('topInvalid', 'invalid', domElement);" +
                            "
      // For controlled components we always need to ensure we're listening
   " +
                            "   // to onChange. Even if there is no listener.
      ensureListeningTo(rootCon" +
                            "tainerElement, 'onChange');
      break;
    default:
      props = rawProps;
  " +
                            "}

  assertValidProps(tag, props, getStack);

  setInitialDOMProperties(tag, dom" +
                            "Element, rootContainerElement, props, isCustomComponentTag);

  switch (tag) {
 " +
                            "   case 'input':
      // TODO: Make sure we check if this is still unmounted or" +
                            " do any clean
      // up necessary since we never stop tracking anymore.
      " +
                            "track(domElement);
      postMountWrapper(domElement, rawProps);
      break;
  " +
                            "  case 'textarea':
      // TODO: Make sure we check if this is still unmounted " +
                            "or do any clean
      // up necessary since we never stop tracking anymore.
    " +
                            "  track(domElement);
      postMountWrapper$3(domElement, rawProps);
      break" +
                            ";
    case 'option':
      postMountWrapper$1(domElement, rawProps);
      break" +
                            ";
    case 'select':
      postMountWrapper$2(domElement, rawProps);
      break" +
                            ";
    default:
      if (typeof props.onClick === 'function') {
        // TODO:" +
                            " This cast may not be sound for SVG, MathML or custom elements.
        trapClic" +
                            "kOnNonInteractiveElement(domElement);
      }
      break;
  }
}

// Calculate t" +
                            "he diff between the two objects.
function diffProperties$1(domElement, tag, last" +
                            "RawProps, nextRawProps, rootContainerElement) {
  {
    validatePropertiesInDeve" +
                            "lopment(tag, nextRawProps);
  }

  var updatePayload = null;

  var lastProps;
 " +
                            " var nextProps;
  switch (tag) {
    case 'input':
      lastProps = getHostProp" +
                            "s(domElement, lastRawProps);
      nextProps = getHostProps(domElement, nextRawP" +
                            "rops);
      updatePayload = [];
      break;
    case 'option':
      lastProps" +
                            " = getHostProps$1(domElement, lastRawProps);
      nextProps = getHostProps$1(do" +
                            "mElement, nextRawProps);
      updatePayload = [];
      break;
    case 'select" +
                            "':
      lastProps = getHostProps$2(domElement, lastRawProps);
      nextProps =" +
                            " getHostProps$2(domElement, nextRawProps);
      updatePayload = [];
      break" +
                            ";
    case 'textarea':
      lastProps = getHostProps$3(domElement, lastRawProps" +
                            ");
      nextProps = getHostProps$3(domElement, nextRawProps);
      updatePaylo" +
                            "ad = [];
      break;
    default:
      lastProps = lastRawProps;
      nextPro" +
                            "ps = nextRawProps;
      if (typeof lastProps.onClick !== 'function' && typeof n" +
                            "extProps.onClick === 'function') {
        // TODO: This cast may not be sound f" +
                            "or SVG, MathML or custom elements.
        trapClickOnNonInteractiveElement(domE" +
                            "lement);
      }
      break;
  }

  assertValidProps(tag, nextProps, getStack);" +
                            "

  var propKey;
  var styleName;
  var styleUpdates = null;
  for (propKey in l" +
                            "astProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProper" +
                            "ty(propKey) || lastProps[propKey] == null) {
      continue;
    }
    if (propK" +
                            "ey === STYLE) {
      var lastStyle = lastProps[propKey];
      for (styleName i" +
                            "n lastStyle) {
        if (lastStyle.hasOwnProperty(styleName)) {
          if (" +
                            "!styleUpdates) {
            styleUpdates = {};
          }
          styleUpdat" +
                            "es[styleName] = '';
        }
      }
    } else if (propKey === DANGEROUSLY_SET" +
                            "_INNER_HTML || propKey === CHILDREN) {
      // Noop. This is handled by the cle" +
                            "ar text mechanism.
    } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING " +
                            "|| propKey === SUPPRESS_HYDRATION_WARNING$1) {
      // Noop
    } else if (prop" +
                            "Key === AUTOFOCUS) {
      // Noop. It doesn't work on updates anyway.
    } els" +
                            "e if (registrationNameModules.hasOwnProperty(propKey)) {
      // This is a spec" +
                            "ial case. If any listener updates we need to ensure
      // that the "current" " +
                            "fiber pointer gets updated so we need a commit
      // to update this element.
" +
                            "      if (!updatePayload) {
        updatePayload = [];
      }
    } else {
   " +
                            "   // For all other deleted properties we add it to the queue. We use
      // t" +
                            "he whitelist in the commit phase instead.
      (updatePayload = updatePayload |" +
                            "| []).push(propKey, null);
    }
  }
  for (propKey in nextProps) {
    var next" +
                            "Prop = nextProps[propKey];
    var lastProp = lastProps != null ? lastProps[prop" +
                            "Key] : undefined;
    if (!nextProps.hasOwnProperty(propKey) || nextProp === las" +
                            "tProp || nextProp == null && lastProp == null) {
      continue;
    }
    if (p" +
                            "ropKey === STYLE) {
      {
        if (nextProp) {
          // Freeze the next" +
                            " style object so that we can assume it won't be
          // mutated. We have al" +
                            "ready warned for this in the past.
          Object.freeze(nextProp);
        }
" +
                            "      }
      if (lastProp) {
        // Unset styles on `lastProp` but not on `" +
                            "nextProp`.
        for (styleName in lastProp) {
          if (lastProp.hasOwnPr" +
                            "operty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
     " +
                            "       if (!styleUpdates) {
              styleUpdates = {};
            }
     " +
                            "       styleUpdates[styleName] = '';
          }
        }
        // Update sty" +
                            "les that changed since `lastProp`.
        for (styleName in nextProp) {
       " +
                            "   if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[st" +
                            "yleName]) {
            if (!styleUpdates) {
              styleUpdates = {};
  " +
                            "          }
            styleUpdates[styleName] = nextProp[styleName];
         " +
                            " }
        }
      } else {
        // Relies on `updateStylesByID` not mutating" +
                            " `styleUpdates`.
        if (!styleUpdates) {
          if (!updatePayload) {
  " +
                            "          updatePayload = [];
          }
          updatePayload.push(propKey, " +
                            "styleUpdates);
        }
        styleUpdates = nextProp;
      }
    } else if " +
                            "(propKey === DANGEROUSLY_SET_INNER_HTML) {
      var nextHtml = nextProp ? nextP" +
                            "rop[HTML] : undefined;
      var lastHtml = lastProp ? lastProp[HTML] : undefine" +
                            "d;
      if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          " +
                            "(updatePayload = updatePayload || []).push(propKey, '' + nextHtml);
        }
  " +
                            "    } else {
        // TODO: It might be too late to clear this if we have chil" +
                            "dren
        // inserted already.
      }
    } else if (propKey === CHILDREN) {" +
                            "
      if (lastProp !== nextProp && (typeof nextProp === 'string' || typeof next" +
                            "Prop === 'number')) {
        (updatePayload = updatePayload || []).push(propKey" +
                            ", '' + nextProp);
      }
    } else if (propKey === SUPPRESS_CONTENT_EDITABLE_W" +
                            "ARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {
      // Noop
    } else i" +
                            "f (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp != null" +
                            ") {
        // We eagerly listen to this even though we haven't committed yet.
 " +
                            "       if (true && typeof nextProp !== 'function') {
          warnForInvalidEve" +
                            "ntListener(propKey, nextProp);
        }
        ensureListeningTo(rootContainer" +
                            "Element, propKey);
      }
      if (!updatePayload && lastProp !== nextProp) {
" +
                            "        // This is a special case. If any listener updates we need to ensure
   " +
                            "     // that the "current" props pointer gets updated so we need a commit
      " +
                            "  // to update this element.
        updatePayload = [];
      }
    } else {
  " +
                            "    // For any other property we always add it to the queue and then we
      //" +
                            " filter it out using the whitelist during the commit.
      (updatePayload = upd" +
                            "atePayload || []).push(propKey, nextProp);
    }
  }
  if (styleUpdates) {
    (" +
                            "updatePayload = updatePayload || []).push(STYLE, styleUpdates);
  }
  return upd" +
                            "atePayload;
}

// Apply the diff.
function updateProperties$1(domElement, update" +
                            "Payload, tag, lastRawProps, nextRawProps) {
  var wasCustomComponentTag = isCust" +
                            "omComponent(tag, lastRawProps);
  var isCustomComponentTag = isCustomComponent(t" +
                            "ag, nextRawProps);
  // Apply the diff.
  updateDOMProperties(domElement, update" +
                            "Payload, wasCustomComponentTag, isCustomComponentTag);

  // TODO: Ensure that a" +
                            "n update gets scheduled if any of the special props
  // changed.
  switch (tag)" +
                            " {
    case 'input':
      // Update the wrapper around inputs *after* updating " +
                            "props. This has to
      // happen after `updateDOMProperties`. Otherwise HTML5 " +
                            "input validations
      // raise warnings and prevent the new value from being a" +
                            "ssigned.
      updateWrapper(domElement, nextRawProps);

      // We also check " +
                            "that we haven't missed a value update, such as a
      // Radio group shifting t" +
                            "he checked value to another named radio input.
      updateValueIfChanged(domEle" +
                            "ment);
      break;
    case 'textarea':
      updateWrapper$1(domElement, nextR" +
                            "awProps);
      break;
    case 'select':
      // <select> value update needs t" +
                            "o occur after <option> children
      // reconciliation
      postUpdateWrapper(" +
                            "domElement, nextRawProps);
      break;
  }
}

function diffHydratedProperties$1" +
                            "(domElement, tag, rawProps, parentNamespace, rootContainerElement) {
  {
    var" +
                            " suppressHydrationWarning = rawProps[SUPPRESS_HYDRATION_WARNING$1] === true;
   " +
                            " var isCustomComponentTag = isCustomComponent(tag, rawProps);
    validateProper" +
                            "tiesInDevelopment(tag, rawProps);
    if (isCustomComponentTag && !didWarnShadyD" +
                            "OM && domElement.shadyRoot) {
      warning_1$1(false, '%s is using shady DOM. U" +
                            "sing shady DOM with React can ' + 'cause things to break subtly.', getCurrentFib" +
                            "erOwnerName$1() || 'A component');
      didWarnShadyDOM = true;
    }
  }

  //" +
                            " TODO: Make sure that we check isMounted before firing any of these events.
  sw" +
                            "itch (tag) {
    case 'iframe':
    case 'object':
      trapBubbledEvent('topLo" +
                            "ad', 'load', domElement);
      break;
    case 'video':
    case 'audio':
     " +
                            " // Create listener for each media event
      for (var event in mediaEvents) {
" +
                            "        if (mediaEvents.hasOwnProperty(event)) {
          trapBubbledEvent(even" +
                            "t, mediaEvents[event], domElement);
        }
      }
      break;
    case 'sou" +
                            "rce':
      trapBubbledEvent('topError', 'error', domElement);
      break;
    " +
                            "case 'img':
    case 'image':
      trapBubbledEvent('topError', 'error', domEle" +
                            "ment);
      trapBubbledEvent('topLoad', 'load', domElement);
      break;
    c" +
                            "ase 'form':
      trapBubbledEvent('topReset', 'reset', domElement);
      trapB" +
                            "ubbledEvent('topSubmit', 'submit', domElement);
      break;
    case 'details':" +
                            "
      trapBubbledEvent('topToggle', 'toggle', domElement);
      break;
    cas" +
                            "e 'input':
      initWrapperState(domElement, rawProps);
      trapBubbledEvent(" +
                            "'topInvalid', 'invalid', domElement);
      // For controlled components we alwa" +
                            "ys need to ensure we're listening
      // to onChange. Even if there is no list" +
                            "ener.
      ensureListeningTo(rootContainerElement, 'onChange');
      break;
  " +
                            "  case 'option':
      validateProps(domElement, rawProps);
      break;
    cas" +
                            "e 'select':
      initWrapperState$1(domElement, rawProps);
      trapBubbledEve" +
                            "nt('topInvalid', 'invalid', domElement);
      // For controlled components we a" +
                            "lways need to ensure we're listening
      // to onChange. Even if there is no l" +
                            "istener.
      ensureListeningTo(rootContainerElement, 'onChange');
      break;" +
                            "
    case 'textarea':
      initWrapperState$2(domElement, rawProps);
      trap" +
                            "BubbledEvent('topInvalid', 'invalid', domElement);
      // For controlled compo" +
                            "nents we always need to ensure we're listening
      // to onChange. Even if the" +
                            "re is no listener.
      ensureListeningTo(rootContainerElement, 'onChange');
  " +
                            "    break;
  }

  assertValidProps(tag, rawProps, getStack);

  {
    var extraA" +
                            "ttributeNames = new Set();
    var attributes = domElement.attributes;
    for (" +
                            "var i = 0; i < attributes.length; i++) {
      var name = attributes[i].name.toL" +
                            "owerCase();
      switch (name) {
        // Built-in SSR attribute is whitelist" +
                            "ed
        case 'data-reactroot':
          break;
        // Controlled attribu" +
                            "tes are not validated
        // TODO: Only ignore them on controlled tags.
    " +
                            "    case 'value':
          break;
        case 'checked':
          break;
    " +
                            "    case 'selected':
          break;
        default:
          // Intentionall" +
                            "y use the original name.
          // See discussion in https://github.com/faceb" +
                            "ook/react/pull/10676.
          extraAttributeNames.add(attributes[i].name);
   " +
                            "   }
    }
  }

  var updatePayload = null;
  for (var propKey in rawProps) {
  " +
                            "  if (!rawProps.hasOwnProperty(propKey)) {
      continue;
    }
    var nextPro" +
                            "p = rawProps[propKey];
    if (propKey === CHILDREN) {
      // For text content" +
                            " children we compare against textContent. This
      // might match additional H" +
                            "TML that is hidden when we read it using
      // textContent. E.g. "foo" will m" +
                            "atch "f<span>oo</span>" but that still
      // satisfies our requirement. Our r" +
                            "equirement is not to produce perfect
      // HTML and attributes. Ideally we sh" +
                            "ould preserve structure but it's
      // ok not to if the visible content is st" +
                            "ill enough to indicate what
      // even listeners these nodes might be wired u" +
                            "p to.
      // TODO: Warn if there is more than a single textNode as a child.
  " +
                            "    // TODO: Should we use domElement.firstChild.nodeValue to compare?
      if " +
                            "(typeof nextProp === 'string') {
        if (domElement.textContent !== nextProp" +
                            ") {
          if (true && !suppressHydrationWarning) {
            warnForTextDi" +
                            "fference(domElement.textContent, nextProp);
          }
          updatePayload " +
                            "= [CHILDREN, nextProp];
        }
      } else if (typeof nextProp === 'number')" +
                            " {
        if (domElement.textContent !== '' + nextProp) {
          if (true &&" +
                            " !suppressHydrationWarning) {
            warnForTextDifference(domElement.textC" +
                            "ontent, nextProp);
          }
          updatePayload = [CHILDREN, '' + nextPro" +
                            "p];
        }
      }
    } else if (registrationNameModules.hasOwnProperty(prop" +
                            "Key)) {
      if (nextProp != null) {
        if (true && typeof nextProp !== 'f" +
                            "unction') {
          warnForInvalidEventListener(propKey, nextProp);
        }
" +
                            "        ensureListeningTo(rootContainerElement, propKey);
      }
    } else {
 " +
                            "     // Validate that the properties correspond to their expected values.
      " +
                            "var serverValue;
      var propertyInfo;
      if (suppressHydrationWarning) {
 " +
                            "       // Don't bother comparing. We're ignoring all these warnings.
      } els" +
                            "e if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDR" +
                            "ATION_WARNING$1 ||
      // Controlled attributes are not validated
      // TOD" +
                            "O: Only ignore them on controlled tags.
      propKey === 'value' || propKey ===" +
                            " 'checked' || propKey === 'selected') {
        // Noop
      } else if (propKey" +
                            " === DANGEROUSLY_SET_INNER_HTML) {
        var rawHtml = nextProp ? nextProp[HTM" +
                            "L] || '' : '';
        var serverHTML = domElement.innerHTML;
        var expect" +
                            "edHTML = normalizeHTML(domElement, rawHtml);
        if (expectedHTML !== server" +
                            "HTML) {
          warnForPropDifference(propKey, serverHTML, expectedHTML);
    " +
                            "    }
      } else if (propKey === STYLE) {
        // $FlowFixMe - Should be in" +
                            "ferred as not undefined.
        extraAttributeNames['delete'](propKey);
       " +
                            " var expectedStyle = createDangerousStringForStyles(nextProp);
        serverVal" +
                            "ue = domElement.getAttribute('style');
        if (expectedStyle !== serverValue" +
                            ") {
          warnForPropDifference(propKey, serverValue, expectedStyle);
      " +
                            "  }
      } else if (isCustomComponentTag) {
        // $FlowFixMe - Should be i" +
                            "nferred as not undefined.
        extraAttributeNames['delete'](propKey.toLowerC" +
                            "ase());
        serverValue = getValueForAttribute(domElement, propKey, nextProp" +
                            ");

        if (nextProp !== serverValue) {
          warnForPropDifference(prop" +
                            "Key, serverValue, nextProp);
        }
      } else if (shouldSetAttribute(propK" +
                            "ey, nextProp)) {
        if (propertyInfo = getPropertyInfo(propKey)) {
        " +
                            "  // $FlowFixMe - Should be inferred as not undefined.
          extraAttributeN" +
                            "ames['delete'](propertyInfo.attributeName);
          serverValue = getValueForP" +
                            "roperty(domElement, propKey, nextProp);
        } else {
          var ownNamesp" +
                            "ace = parentNamespace;
          if (ownNamespace === HTML_NAMESPACE) {
        " +
                            "    ownNamespace = getIntrinsicNamespace(tag);
          }
          if (ownName" +
                            "space === HTML_NAMESPACE) {
            // $FlowFixMe - Should be inferred as no" +
                            "t undefined.
            extraAttributeNames['delete'](propKey.toLowerCase());
 " +
                            "         } else {
            // $FlowFixMe - Should be inferred as not undefine" +
                            "d.
            extraAttributeNames['delete'](propKey);
          }
          ser" +
                            "verValue = getValueForAttribute(domElement, propKey, nextProp);
        }

     " +
                            "   if (nextProp !== serverValue) {
          warnForPropDifference(propKey, serv" +
                            "erValue, nextProp);
        }
      }
    }
  }

  {
    // $FlowFixMe - Should " +
                            "be inferred as not undefined.
    if (extraAttributeNames.size > 0 && !suppressH" +
                            "ydrationWarning) {
      // $FlowFixMe - Should be inferred as not undefined.
  " +
                            "    warnForExtraAttributes(extraAttributeNames);
    }
  }

  switch (tag) {
   " +
                            " case 'input':
      // TODO: Make sure we check if this is still unmounted or d" +
                            "o any clean
      // up necessary since we never stop tracking anymore.
      tr" +
                            "ack(domElement);
      postMountWrapper(domElement, rawProps);
      break;
    " +
                            "case 'textarea':
      // TODO: Make sure we check if this is still unmounted or" +
                            " do any clean
      // up necessary since we never stop tracking anymore.
      " +
                            "track(domElement);
      postMountWrapper$3(domElement, rawProps);
      break;
" +
                            "    case 'select':
    case 'option':
      // For input and textarea we current" +
                            " always set the value property at
      // post mount to force it to diverge fro" +
                            "m attributes. However, for
      // option and select we don't quite do the same" +
                            " thing and select
      // is not resilient to the DOM state changing so we don'" +
                            "t do that here.
      // TODO: Consider not doing this for input and textarea.
 " +
                            "     break;
    default:
      if (typeof rawProps.onClick === 'function') {
   " +
                            "     // TODO: This cast may not be sound for SVG, MathML or custom elements.
   " +
                            "     trapClickOnNonInteractiveElement(domElement);
      }
      break;
  }

  r" +
                            "eturn updatePayload;
}

function diffHydratedText$1(textNode, text) {
  var isDi" +
                            "fferent = textNode.nodeValue !== text;
  return isDifferent;
}

function warnFor" +
                            "UnmatchedText$1(textNode, text) {
  {
    warnForTextDifference(textNode.nodeVal" +
                            "ue, text);
  }
}

function warnForDeletedHydratableElement$1(parentNode, child) " +
                            "{
  {
    if (didWarnInvalidHydration) {
      return;
    }
    didWarnInvalidH" +
                            "ydration = true;
    warning_1$1(false, 'Did not expect server HTML to contain a" +
                            " <%s> in <%s>.', child.nodeName.toLowerCase(), parentNode.nodeName.toLowerCase()" +
                            ");
  }
}

function warnForDeletedHydratableText$1(parentNode, child) {
  {
    i" +
                            "f (didWarnInvalidHydration) {
      return;
    }
    didWarnInvalidHydration = " +
                            "true;
    warning_1$1(false, 'Did not expect server HTML to contain the text nod" +
                            "e "%s" in <%s>.', child.nodeValue, parentNode.nodeName.toLowerCase());
  }
}

fu" +
                            "nction warnForInsertedHydratedElement$1(parentNode, tag, props) {
  {
    if (di" +
                            "dWarnInvalidHydration) {
      return;
    }
    didWarnInvalidHydration = true;" +
                            "
    warning_1$1(false, 'Expected server HTML to contain a matching <%s> in <%s>" +
                            ".', tag, parentNode.nodeName.toLowerCase());
  }
}

function warnForInsertedHydr" +
                            "atedText$1(parentNode, text) {
  {
    if (text === '') {
      // We expect to " +
                            "insert empty text nodes since they're not represented in
      // the HTML.
    " +
                            "  // TODO: Remove this special case if we can just avoid inserting empty
      /" +
                            "/ text nodes.
      return;
    }
    if (didWarnInvalidHydration) {
      retur" +
                            "n;
    }
    didWarnInvalidHydration = true;
    warning_1$1(false, 'Expected se" +
                            "rver HTML to contain a matching text node for "%s" in <%s>.', text, parentNode.n" +
                            "odeName.toLowerCase());
  }
}

function restoreControlledState(domElement, tag, " +
                            "props) {
  switch (tag) {
    case 'input':
      restoreControlledState$1(domEl" +
                            "ement, props);
      return;
    case 'textarea':
      restoreControlledState$3" +
                            "(domElement, props);
      return;
    case 'select':
      restoreControlledSta" +
                            "te$2(domElement, props);
      return;
  }
}

var ReactDOMFiberComponent = Objec" +
                            "t.freeze({
	createElement: createElement$1,
	createTextNode: createTextNode$1,
	" +
                            "setInitialProperties: setInitialProperties$1,
	diffProperties: diffProperties$1," +
                            "
	updateProperties: updateProperties$1,
	diffHydratedProperties: diffHydratedPro" +
                            "perties$1,
	diffHydratedText: diffHydratedText$1,
	warnForUnmatchedText: warnFor" +
                            "UnmatchedText$1,
	warnForDeletedHydratableElement: warnForDeletedHydratableEleme" +
                            "nt$1,
	warnForDeletedHydratableText: warnForDeletedHydratableText$1,
	warnForIns" +
                            "ertedHydratedElement: warnForInsertedHydratedElement$1,
	warnForInsertedHydrated" +
                            "Text: warnForInsertedHydratedText$1,
	restoreControlledState: restoreControlledS" +
                            "tate
});

// TODO: direct imports like some-package/src/* are bad. Fix me.
var g" +
                            "etCurrentFiberStackAddendum$6 = ReactDebugCurrentFiber.getCurrentFiberStackAdden" +
                            "dum;

var validateDOMNesting = emptyFunction_1;

{
  // This validation code was" +
                            " written based on the HTML5 parsing spec:
  // https://html.spec.whatwg.org/mult" +
                            "ipage/syntax.html#has-an-element-in-scope
  //
  // Note: this does not catch al" +
                            "l invalid nesting, nor does it try to (as it's
  // not clear what practical ben" +
                            "efit doing so provides); instead, we warn only
  // for cases where the parser w" +
                            "ill give a parse tree differing from what React
  // intended. For example, <b><" +
                            "div></div></b> is invalid but we don't warn
  // because it still parses correct" +
                            "ly; we do warn for other cases like nested
  // <p> tags where the beginning of " +
                            "the second element implicitly closes the
  // first, causing a confusing mess.

" +
                            "  // https://html.spec.whatwg.org/multipage/syntax.html#special
  var specialTag" +
                            "s = ['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsou" +
                            "nd', 'blockquote', 'body', 'br', 'button', 'caption', 'center', 'col', 'colgroup" +
                            "', 'dd', 'details', 'dir', 'div', 'dl', 'dt', 'embed', 'fieldset', 'figcaption'," +
                            " 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', " +
                            "'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'iframe', 'img', 'input', 'isind" +
                            "ex', 'li', 'link', 'listing', 'main', 'marquee', 'menu', 'menuitem', 'meta', 'na" +
                            "v', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'p', 'param', 'plaintext'" +
                            ", 'pre', 'script', 'section', 'select', 'source', 'style', 'summary', 'table', '" +
                            "tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'tr" +
                            "ack', 'ul', 'wbr', 'xmp'];

  // https://html.spec.whatwg.org/multipage/syntax.h" +
                            "tml#has-an-element-in-scope
  var inScopeTags = ['applet', 'caption', 'html', 't" +
                            "able', 'td', 'th', 'marquee', 'object', 'template',

  // https://html.spec.what" +
                            "wg.org/multipage/syntax.html#html-integration-point
  // TODO: Distinguish by na" +
                            "mespace here -- for <title>, including it here
  // errs on the side of fewer wa" +
                            "rnings
  'foreignObject', 'desc', 'title'];

  // https://html.spec.whatwg.org/m" +
                            "ultipage/syntax.html#has-an-element-in-button-scope
  var buttonScopeTags = inSc" +
                            "opeTags.concat(['button']);

  // https://html.spec.whatwg.org/multipage/syntax." +
                            "html#generate-implied-end-tags
  var impliedEndTags = ['dd', 'dt', 'li', 'option" +
                            "', 'optgroup', 'p', 'rp', 'rt'];

  var emptyAncestorInfo = {
    current: null," +
                            "

    formTag: null,
    aTagInScope: null,
    buttonTagInScope: null,
    nobr" +
                            "TagInScope: null,
    pTagInButtonScope: null,

    listItemTagAutoclosing: null" +
                            ",
    dlItemTagAutoclosing: null
  };

  var updatedAncestorInfo$1 = function (o" +
                            "ldInfo, tag, instance) {
    var ancestorInfo = _assign({}, oldInfo || emptyAnce" +
                            "storInfo);
    var info = { tag: tag, instance: instance };

    if (inScopeTags" +
                            ".indexOf(tag) !== -1) {
      ancestorInfo.aTagInScope = null;
      ancestorInf" +
                            "o.buttonTagInScope = null;
      ancestorInfo.nobrTagInScope = null;
    }
    i" +
                            "f (buttonScopeTags.indexOf(tag) !== -1) {
      ancestorInfo.pTagInButtonScope =" +
                            " null;
    }

    // See rules for 'li', 'dd', 'dt' start tags in
    // https:/" +
                            "/html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
    if (specialT" +
                            "ags.indexOf(tag) !== -1 && tag !== 'address' && tag !== 'div' && tag !== 'p') {
" +
                            "      ancestorInfo.listItemTagAutoclosing = null;
      ancestorInfo.dlItemTagAu" +
                            "toclosing = null;
    }

    ancestorInfo.current = info;

    if (tag === 'form" +
                            "') {
      ancestorInfo.formTag = info;
    }
    if (tag === 'a') {
      ances" +
                            "torInfo.aTagInScope = info;
    }
    if (tag === 'button') {
      ancestorInfo" +
                            ".buttonTagInScope = info;
    }
    if (tag === 'nobr') {
      ancestorInfo.nob" +
                            "rTagInScope = info;
    }
    if (tag === 'p') {
      ancestorInfo.pTagInButton" +
                            "Scope = info;
    }
    if (tag === 'li') {
      ancestorInfo.listItemTagAutocl" +
                            "osing = info;
    }
    if (tag === 'dd' || tag === 'dt') {
      ancestorInfo.d" +
                            "lItemTagAutoclosing = info;
    }

    return ancestorInfo;
  };

  /**
   * Ret" +
                            "urns whether
   */
  var isTagValidWithParent = function (tag, parentTag) {
    " +
                            "// First, let's check if we're in an unusual parsing mode...
    switch (parentT" +
                            "ag) {
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-i" +
                            "nselect
      case 'select':
        return tag === 'option' || tag === 'optgrou" +
                            "p' || tag === '#text';
      case 'optgroup':
        return tag === 'option' ||" +
                            " tag === '#text';
      // Strictly speaking, seeing an <option> doesn't mean we" +
                            "'re in a <select>
      // but
      case 'option':
        return tag === '#tex" +
                            "t';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-int" +
                            "d
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incap" +
                            "tion
      // No special behavior since these rules fall back to "in body" mode " +
                            "for
      // all except special table nodes which cause bad parsing behavior any" +
                            "way.

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-i" +
                            "ntr
      case 'tr':
        return tag === 'th' || tag === 'td' || tag === 'sty" +
                            "le' || tag === 'script' || tag === 'template';
      // https://html.spec.whatwg" +
                            ".org/multipage/syntax.html#parsing-main-intbody
      case 'tbody':
      case '" +
                            "thead':
      case 'tfoot':
        return tag === 'tr' || tag === 'style' || ta" +
                            "g === 'script' || tag === 'template';
      // https://html.spec.whatwg.org/mult" +
                            "ipage/syntax.html#parsing-main-incolgroup
      case 'colgroup':
        return " +
                            "tag === 'col' || tag === 'template';
      // https://html.spec.whatwg.org/multi" +
                            "page/syntax.html#parsing-main-intable
      case 'table':
        return tag ===" +
                            " 'caption' || tag === 'colgroup' || tag === 'tbody' || tag === 'tfoot' || tag ==" +
                            "= 'thead' || tag === 'style' || tag === 'script' || tag === 'template';
      //" +
                            " https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
      ca" +
                            "se 'head':
        return tag === 'base' || tag === 'basefont' || tag === 'bgsou" +
                            "nd' || tag === 'link' || tag === 'meta' || tag === 'title' || tag === 'noscript'" +
                            " || tag === 'noframes' || tag === 'style' || tag === 'script' || tag === 'templa" +
                            "te';
      // https://html.spec.whatwg.org/multipage/semantics.html#the-html-ele" +
                            "ment
      case 'html':
        return tag === 'head' || tag === 'body';
      c" +
                            "ase '#document':
        return tag === 'html';
    }

    // Probably in the "i" +
                            "n body" parsing mode, so we outlaw only tag combos
    // where the parsing rule" +
                            "s cause implicit opens or closes to be added.
    // https://html.spec.whatwg.or" +
                            "g/multipage/syntax.html#parsing-main-inbody
    switch (tag) {
      case 'h1':
" +
                            "      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case '" +
                            "h6':
        return parentTag !== 'h1' && parentTag !== 'h2' && parentTag !== 'h" +
                            "3' && parentTag !== 'h4' && parentTag !== 'h5' && parentTag !== 'h6';

      cas" +
                            "e 'rp':
      case 'rt':
        return impliedEndTags.indexOf(parentTag) === -1" +
                            ";

      case 'body':
      case 'caption':
      case 'col':
      case 'colgro" +
                            "up':
      case 'frame':
      case 'head':
      case 'html':
      case 'tbody" +
                            "':
      case 'td':
      case 'tfoot':
      case 'th':
      case 'thead':
   " +
                            "   case 'tr':
        // These tags are only valid with a few parents that have " +
                            "special child
        // parsing rules -- if we're down here, then none of those" +
                            " matched and
        // so we allow it only if we don't know what the parent is," +
                            " as all other
        // cases are invalid.
        return parentTag == null;
  " +
                            "  }

    return true;
  };

  /**
   * Returns whether
   */
  var findInvalidAn" +
                            "cestorForTag = function (tag, ancestorInfo) {
    switch (tag) {
      case 'add" +
                            "ress':
      case 'article':
      case 'aside':
      case 'blockquote':
      " +
                            "case 'center':
      case 'details':
      case 'dialog':
      case 'dir':
    " +
                            "  case 'div':
      case 'dl':
      case 'fieldset':
      case 'figcaption':
 " +
                            "     case 'figure':
      case 'footer':
      case 'header':
      case 'hgroup" +
                            "':
      case 'main':
      case 'menu':
      case 'nav':
      case 'ol':
    " +
                            "  case 'p':
      case 'section':
      case 'summary':
      case 'ul':
      c" +
                            "ase 'pre':
      case 'listing':
      case 'table':
      case 'hr':
      case" +
                            " 'xmp':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
    " +
                            "  case 'h5':
      case 'h6':
        return ancestorInfo.pTagInButtonScope;

  " +
                            "    case 'form':
        return ancestorInfo.formTag || ancestorInfo.pTagInButto" +
                            "nScope;

      case 'li':
        return ancestorInfo.listItemTagAutoclosing;

 " +
                            "     case 'dd':
      case 'dt':
        return ancestorInfo.dlItemTagAutoclosin" +
                            "g;

      case 'button':
        return ancestorInfo.buttonTagInScope;

      ca" +
                            "se 'a':
        // Spec says something about storing a list of markers, but it s" +
                            "ounds
        // equivalent to this check.
        return ancestorInfo.aTagInSco" +
                            "pe;

      case 'nobr':
        return ancestorInfo.nobrTagInScope;
    }

    r" +
                            "eturn null;
  };

  var didWarn = {};

  validateDOMNesting = function (childTag" +
                            ", childText, ancestorInfo) {
    ancestorInfo = ancestorInfo || emptyAncestorInf" +
                            "o;
    var parentInfo = ancestorInfo.current;
    var parentTag = parentInfo && " +
                            "parentInfo.tag;

    if (childText != null) {
      warning_1$1(childTag == null" +
                            ", 'validateDOMNesting: when childText is passed, childTag should be null');
    " +
                            "  childTag = '#text';
    }

    var invalidParent = isTagValidWithParent(childT" +
                            "ag, parentTag) ? null : parentInfo;
    var invalidAncestor = invalidParent ? nu" +
                            "ll : findInvalidAncestorForTag(childTag, ancestorInfo);
    var invalidParentOrA" +
                            "ncestor = invalidParent || invalidAncestor;
    if (!invalidParentOrAncestor) {
" +
                            "      return;
    }

    var ancestorTag = invalidParentOrAncestor.tag;
    var " +
                            "addendum = getCurrentFiberStackAddendum$6();

    var warnKey = !!invalidParent " +
                            "+ '|' + childTag + '|' + ancestorTag + '|' + addendum;
    if (didWarn[warnKey])" +
                            " {
      return;
    }
    didWarn[warnKey] = true;

    var tagDisplayName = ch" +
                            "ildTag;
    var whitespaceInfo = '';
    if (childTag === '#text') {
      if (/" +
                            "\S/.test(childText)) {
        tagDisplayName = 'Text nodes';
      } else {
   " +
                            "     tagDisplayName = 'Whitespace text nodes';
        whitespaceInfo = " Make s" +
                            "ure you don't have any extra whitespace between tags on " + 'each line of your s" +
                            "ource code.';
      }
    } else {
      tagDisplayName = '<' + childTag + '>';
" +
                            "    }

    if (invalidParent) {
      var info = '';
      if (ancestorTag === '" +
                            "table' && childTag === 'tr') {
        info += ' Add a <tbody> to your code to m" +
                            "atch the DOM tree generated by ' + 'the browser.';
      }
      warning_1$1(fal" +
                            "se, 'validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s%s', tagDi" +
                            "splayName, ancestorTag, whitespaceInfo, info, addendum);
    } else {
      warn" +
                            "ing_1$1(false, 'validateDOMNesting(...): %s cannot appear as a descendant of ' +" +
                            " '<%s>.%s', tagDisplayName, ancestorTag, addendum);
    }
  };

  // TODO: turn " +
                            "this into a named export
  validateDOMNesting.updatedAncestorInfo = updatedAnces" +
                            "torInfo$1;

  // For testing
  validateDOMNesting.isTagValidInContext = function" +
                            " (tag, ancestorInfo) {
    ancestorInfo = ancestorInfo || emptyAncestorInfo;
   " +
                            " var parentInfo = ancestorInfo.current;
    var parentTag = parentInfo && parent" +
                            "Info.tag;
    return isTagValidWithParent(tag, parentTag) && !findInvalidAncesto" +
                            "rForTag(tag, ancestorInfo);
  };
}

var validateDOMNesting$1 = validateDOMNestin" +
                            "g;

// TODO: direct imports like some-package/src/* are bad. Fix me.
var createE" +
                            "lement = createElement$1;
var createTextNode = createTextNode$1;
var setInitialP" +
                            "roperties = setInitialProperties$1;
var diffProperties = diffProperties$1;
var u" +
                            "pdateProperties = updateProperties$1;
var diffHydratedProperties = diffHydratedP" +
                            "roperties$1;
var diffHydratedText = diffHydratedText$1;
var warnForUnmatchedText" +
                            " = warnForUnmatchedText$1;
var warnForDeletedHydratableElement = warnForDeletedH" +
                            "ydratableElement$1;
var warnForDeletedHydratableText = warnForDeletedHydratableT" +
                            "ext$1;
var warnForInsertedHydratedElement = warnForInsertedHydratedElement$1;
va" +
                            "r warnForInsertedHydratedText = warnForInsertedHydratedText$1;
var updatedAncest" +
                            "orInfo = validateDOMNesting$1.updatedAncestorInfo;
var precacheFiberNode = preca" +
                            "cheFiberNode$1;
var updateFiberProps = updateFiberProps$1;


{
  var SUPPRESS_HY" +
                            "DRATION_WARNING = 'suppressHydrationWarning';
  if (typeof Map !== 'function' ||" +
                            " Map.prototype == null || typeof Map.prototype.forEach !== 'function' || typeof " +
                            "Set !== 'function' || Set.prototype == null || typeof Set.prototype.clear !== 'f" +
                            "unction' || typeof Set.prototype.forEach !== 'function') {
    warning_1$1(false" +
                            ", 'React depends on Map and Set built-in types. Make sure that you load a ' + 'p" +
                            "olyfill in older browsers. http://fb.me/react-polyfills');
  }
}

injection$3.in" +
                            "jectFiberControlledHostComponent(ReactDOMFiberComponent);

var eventsEnabled = n" +
                            "ull;
var selectionInformation = null;

/**
 * True if the supplied DOM node is a" +
                            " valid node element.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * " +
                            "@return {boolean} True if the DOM is a valid DOM node.
 * @internal
 */
function" +
                            " isValidContainer(node) {
  return !!(node && (node.nodeType === ELEMENT_NODE ||" +
                            " node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || " +
                            "node.nodeType === COMMENT_NODE && node.nodeValue === ' react-mount-point-unstabl" +
                            "e '));
}

function getReactRootElementInContainer(container) {
  if (!container)" +
                            " {
    return null;
  }

  if (container.nodeType === DOCUMENT_NODE) {
    retur" +
                            "n container.documentElement;
  } else {
    return container.firstChild;
  }
}

" +
                            "function shouldHydrateDueToLegacyHeuristic(container) {
  var rootElement = getR" +
                            "eactRootElementInContainer(container);
  return !!(rootElement && rootElement.no" +
                            "deType === ELEMENT_NODE && rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME));
}

fu" +
                            "nction shouldAutoFocusHostComponent(type, props) {
  switch (type) {
    case 'b" +
                            "utton':
    case 'input':
    case 'select':
    case 'textarea':
      return !" +
                            "!props.autoFocus;
  }
  return false;
}

var DOMRenderer = reactReconciler({
  g" +
                            "etRootHostContext: function (rootContainerInstance) {
    var type = void 0;
   " +
                            " var namespace = void 0;
    var nodeType = rootContainerInstance.nodeType;
    " +
                            "switch (nodeType) {
      case DOCUMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:" +
                            "
        {
          type = nodeType === DOCUMENT_NODE ? '#document' : '#fragmen" +
                            "t';
          var root = rootContainerInstance.documentElement;
          namesp" +
                            "ace = root ? root.namespaceURI : getChildNamespace(null, '');
          break;
 " +
                            "       }
      default:
        {
          var container = nodeType === COMMENT" +
                            "_NODE ? rootContainerInstance.parentNode : rootContainerInstance;
          var " +
                            "ownNamespace = container.namespaceURI || null;
          type = container.tagNam" +
                            "e;
          namespace = getChildNamespace(ownNamespace, type);
          break;" +
                            "
        }
    }
    {
      var validatedTag = type.toLowerCase();
      var _a" +
                            "ncestorInfo = updatedAncestorInfo(null, validatedTag, null);
      return { name" +
                            "space: namespace, ancestorInfo: _ancestorInfo };
    }
    return namespace;
  }" +
                            ",
  getChildHostContext: function (parentHostContext, type) {
    {
      var pa" +
                            "rentHostContextDev = parentHostContext;
      var _namespace = getChildNamespace" +
                            "(parentHostContextDev.namespace, type);
      var _ancestorInfo2 = updatedAncest" +
                            "orInfo(parentHostContextDev.ancestorInfo, type, null);
      return { namespace:" +
                            " _namespace, ancestorInfo: _ancestorInfo2 };
    }
    var parentNamespace = par" +
                            "entHostContext;
    return getChildNamespace(parentNamespace, type);
  },
  getP" +
                            "ublicInstance: function (instance) {
    return instance;
  },
  prepareForCommi" +
                            "t: function () {
    eventsEnabled = isEnabled();
    selectionInformation = get" +
                            "SelectionInformation();
    setEnabled(false);
  },
  resetAfterCommit: function" +
                            " () {
    restoreSelection(selectionInformation);
    selectionInformation = nul" +
                            "l;
    setEnabled(eventsEnabled);
    eventsEnabled = null;
  },
  createInstanc" +
                            "e: function (type, props, rootContainerInstance, hostContext, internalInstanceHa" +
                            "ndle) {
    var parentNamespace = void 0;
    {
      // TODO: take namespace in" +
                            "to account when validating.
      var hostContextDev = hostContext;
      valida" +
                            "teDOMNesting$1(type, null, hostContextDev.ancestorInfo);
      if (typeof props." +
                            "children === 'string' || typeof props.children === 'number') {
        var strin" +
                            "g = '' + props.children;
        var ownAncestorInfo = updatedAncestorInfo(hostC" +
                            "ontextDev.ancestorInfo, type, null);
        validateDOMNesting$1(null, string, " +
                            "ownAncestorInfo);
      }
      parentNamespace = hostContextDev.namespace;
    " +
                            "}
    var domElement = createElement(type, props, rootContainerInstance, parentN" +
                            "amespace);
    precacheFiberNode(internalInstanceHandle, domElement);
    update" +
                            "FiberProps(domElement, props);
    return domElement;
  },
  appendInitialChild:" +
                            " function (parentInstance, child) {
    parentInstance.appendChild(child);
  },
" +
                            "  finalizeInitialChildren: function (domElement, type, props, rootContainerInsta" +
                            "nce) {
    setInitialProperties(domElement, type, props, rootContainerInstance);" +
                            "
    return shouldAutoFocusHostComponent(type, props);
  },
  prepareUpdate: fun" +
                            "ction (domElement, type, oldProps, newProps, rootContainerInstance, hostContext)" +
                            " {
    {
      var hostContextDev = hostContext;
      if (typeof newProps.child" +
                            "ren !== typeof oldProps.children && (typeof newProps.children === 'string' || ty" +
                            "peof newProps.children === 'number')) {
        var string = '' + newProps.child" +
                            "ren;
        var ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorIn" +
                            "fo, type, null);
        validateDOMNesting$1(null, string, ownAncestorInfo);
  " +
                            "    }
    }
    return diffProperties(domElement, type, oldProps, newProps, root" +
                            "ContainerInstance);
  },
  shouldSetTextContent: function (type, props) {
    re" +
                            "turn type === 'textarea' || typeof props.children === 'string' || typeof props.c" +
                            "hildren === 'number' || typeof props.dangerouslySetInnerHTML === 'object' && pro" +
                            "ps.dangerouslySetInnerHTML !== null && typeof props.dangerouslySetInnerHTML.__ht" +
                            "ml === 'string';
  },
  shouldDeprioritizeSubtree: function (type, props) {
    " +
                            "return !!props.hidden;
  },
  createTextInstance: function (text, rootContainerI" +
                            "nstance, hostContext, internalInstanceHandle) {
    {
      var hostContextDev =" +
                            " hostContext;
      validateDOMNesting$1(null, text, hostContextDev.ancestorInfo" +
                            ");
    }
    var textNode = createTextNode(text, rootContainerInstance);
    pre" +
                            "cacheFiberNode(internalInstanceHandle, textNode);
    return textNode;
  },


  " +
                            "now: now,

  mutation: {
    commitMount: function (domElement, type, newProps, " +
                            "internalInstanceHandle) {
      domElement.focus();
    },
    commitUpdate: fun" +
                            "ction (domElement, updatePayload, type, oldProps, newProps, internalInstanceHand" +
                            "le) {
      // Update the props handle so that we know which props are the ones " +
                            "with
      // with current event handlers.
      updateFiberProps(domElement, ne" +
                            "wProps);
      // Apply the diff to the DOM node.
      updateProperties(domElem" +
                            "ent, updatePayload, type, oldProps, newProps);
    },
    resetTextContent: func" +
                            "tion (domElement) {
      domElement.textContent = '';
    },
    commitTextUpda" +
                            "te: function (textInstance, oldText, newText) {
      textInstance.nodeValue = n" +
                            "ewText;
    },
    appendChild: function (parentInstance, child) {
      parentI" +
                            "nstance.appendChild(child);
    },
    appendChildToContainer: function (contain" +
                            "er, child) {
      if (container.nodeType === COMMENT_NODE) {
        container." +
                            "parentNode.insertBefore(child, container);
      } else {
        container.appe" +
                            "ndChild(child);
      }
    },
    insertBefore: function (parentInstance, child" +
                            ", beforeChild) {
      parentInstance.insertBefore(child, beforeChild);
    },
 " +
                            "   insertInContainerBefore: function (container, child, beforeChild) {
      if " +
                            "(container.nodeType === COMMENT_NODE) {
        container.parentNode.insertBefor" +
                            "e(child, beforeChild);
      } else {
        container.insertBefore(child, befo" +
                            "reChild);
      }
    },
    removeChild: function (parentInstance, child) {
   " +
                            "   parentInstance.removeChild(child);
    },
    removeChildFromContainer: funct" +
                            "ion (container, child) {
      if (container.nodeType === COMMENT_NODE) {
      " +
                            "  container.parentNode.removeChild(child);
      } else {
        container.remo" +
                            "veChild(child);
      }
    }
  },

  hydration: {
    canHydrateInstance: funct" +
                            "ion (instance, type, props) {
      if (instance.nodeType !== ELEMENT_NODE || ty" +
                            "pe.toLowerCase() !== instance.nodeName.toLowerCase()) {
        return null;
   " +
                            "   }
      // This has now been refined to an element node.
      return instanc" +
                            "e;
    },
    canHydrateTextInstance: function (instance, text) {
      if (text" +
                            " === '' || instance.nodeType !== TEXT_NODE) {
        // Empty strings are not p" +
                            "arsed by HTML so there won't be a correct match here.
        return null;
     " +
                            " }
      // This has now been refined to a text node.
      return instance;
   " +
                            " },
    getNextHydratableSibling: function (instance) {
      var node = instanc" +
                            "e.nextSibling;
      // Skip non-hydratable nodes.
      while (node && node.nod" +
                            "eType !== ELEMENT_NODE && node.nodeType !== TEXT_NODE) {
        node = node.nex" +
                            "tSibling;
      }
      return node;
    },
    getFirstHydratableChild: functio" +
                            "n (parentInstance) {
      var next = parentInstance.firstChild;
      // Skip n" +
                            "on-hydratable nodes.
      while (next && next.nodeType !== ELEMENT_NODE && next" +
                            ".nodeType !== TEXT_NODE) {
        next = next.nextSibling;
      }
      return" +
                            " next;
    },
    hydrateInstance: function (instance, type, props, rootContaine" +
                            "rInstance, hostContext, internalInstanceHandle) {
      precacheFiberNode(intern" +
                            "alInstanceHandle, instance);
      // TODO: Possibly defer this until the commit" +
                            " phase where all the events
      // get attached.
      updateFiberProps(instan" +
                            "ce, props);
      var parentNamespace = void 0;
      {
        var hostContextD" +
                            "ev = hostContext;
        parentNamespace = hostContextDev.namespace;
      }
  " +
                            "    return diffHydratedProperties(instance, type, props, parentNamespace, rootCo" +
                            "ntainerInstance);
    },
    hydrateTextInstance: function (textInstance, text, " +
                            "internalInstanceHandle) {
      precacheFiberNode(internalInstanceHandle, textIn" +
                            "stance);
      return diffHydratedText(textInstance, text);
    },
    didNotMat" +
                            "chHydratedContainerTextInstance: function (parentContainer, textInstance, text) " +
                            "{
      {
        warnForUnmatchedText(textInstance, text);
      }
    },
    d" +
                            "idNotMatchHydratedTextInstance: function (parentType, parentProps, parentInstanc" +
                            "e, textInstance, text) {
      if (true && parentProps[SUPPRESS_HYDRATION_WARNIN" +
                            "G] !== true) {
        warnForUnmatchedText(textInstance, text);
      }
    },
" +
                            "    didNotHydrateContainerInstance: function (parentContainer, instance) {
     " +
                            " {
        if (instance.nodeType === 1) {
          warnForDeletedHydratableElem" +
                            "ent(parentContainer, instance);
        } else {
          warnForDeletedHydrata" +
                            "bleText(parentContainer, instance);
        }
      }
    },
    didNotHydrateIn" +
                            "stance: function (parentType, parentProps, parentInstance, instance) {
      if " +
                            "(true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
        if (instanc" +
                            "e.nodeType === 1) {
          warnForDeletedHydratableElement(parentInstance, in" +
                            "stance);
        } else {
          warnForDeletedHydratableText(parentInstance," +
                            " instance);
        }
      }
    },
    didNotFindHydratableContainerInstance: " +
                            "function (parentContainer, type, props) {
      {
        warnForInsertedHydrate" +
                            "dElement(parentContainer, type, props);
      }
    },
    didNotFindHydratableC" +
                            "ontainerTextInstance: function (parentContainer, text) {
      {
        warnFor" +
                            "InsertedHydratedText(parentContainer, text);
      }
    },
    didNotFindHydrat" +
                            "ableInstance: function (parentType, parentProps, parentInstance, type, props) {
" +
                            "      if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
        wa" +
                            "rnForInsertedHydratedElement(parentInstance, type, props);
      }
    },
    di" +
                            "dNotFindHydratableTextInstance: function (parentType, parentProps, parentInstanc" +
                            "e, text) {
      if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {" +
                            "
        warnForInsertedHydratedText(parentInstance, text);
      }
    }
  },

" +
                            "  scheduleDeferredCallback: rIC,

  useSyncScheduling: !enableAsyncSchedulingByD" +
                            "efaultInReactDOM
});

injection$4.injectFiberBatchedUpdates(DOMRenderer.batchedU" +
                            "pdates);

var warnedAboutHydrateAPI = false;

function renderSubtreeIntoContaine" +
                            "r(parentComponent, children, container, forceHydrate, callback) {
  !isValidCont" +
                            "ainer(container) ? invariant_1$1(false, 'Target container is not a DOM element.'" +
                            ") : void 0;

  {
    if (container._reactRootContainer && container.nodeType !==" +
                            " COMMENT_NODE) {
      var hostInstance = DOMRenderer.findHostInstanceWithNoPort" +
                            "als(container._reactRootContainer.current);
      if (hostInstance) {
        wa" +
                            "rning_1$1(hostInstance.parentNode === container, 'render(...): It looks like the" +
                            " React-rendered content of this ' + 'container was removed without using React. " +
                            "This is not ' + 'supported and will cause errors. Instead, call ' + 'ReactDOM.un" +
                            "mountComponentAtNode to empty a container.');
      }
    }

    var isRootRende" +
                            "redBySomeReact = !!container._reactRootContainer;
    var rootEl = getReactRootE" +
                            "lementInContainer(container);
    var hasNonRootReactChild = !!(rootEl && getIns" +
                            "tanceFromNode$1(rootEl));

    warning_1$1(!hasNonRootReactChild || isRootRender" +
                            "edBySomeReact, 'render(...): Replacing React-rendered children with a new root '" +
                            " + 'component. If you intended to update the children of this node, ' + 'you sho" +
                            "uld instead have the existing children update their state ' + 'and render the ne" +
                            "w components instead of calling ReactDOM.render.');

    warning_1$1(container.n" +
                            "odeType !== ELEMENT_NODE || !container.tagName || container.tagName.toUpperCase(" +
                            ") !== 'BODY', 'render(): Rendering components directly into document.body is ' +" +
                            " 'discouraged, since its children are often manipulated by third-party ' + 'scri" +
                            "pts and browser extensions. This may lead to subtle ' + 'reconciliation issues. " +
                            "Try rendering into a container element created ' + 'for your app.');
  }

  var " +
                            "root = container._reactRootContainer;
  if (!root) {
    var shouldHydrate = for" +
                            "ceHydrate || shouldHydrateDueToLegacyHeuristic(container);
    // First clear an" +
                            "y existing content.
    if (!shouldHydrate) {
      var warned = false;
      va" +
                            "r rootSibling = void 0;
      while (rootSibling = container.lastChild) {
      " +
                            "  {
          if (!warned && rootSibling.nodeType === ELEMENT_NODE && rootSiblin" +
                            "g.hasAttribute(ROOT_ATTRIBUTE_NAME)) {
            warned = true;
            wa" +
                            "rning_1$1(false, 'render(): Target node has markup rendered by React, but there " +
                            "' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-spa" +
                            "ce inserted around server-rendered markup.');
          }
        }
        cont" +
                            "ainer.removeChild(rootSibling);
      }
    }
    {
      if (shouldHydrate && !" +
                            "forceHydrate && !warnedAboutHydrateAPI) {
        warnedAboutHydrateAPI = true;
" +
                            "        lowPriorityWarning$1(false, 'render(): Calling ReactDOM.render() to hydr" +
                            "ate server-rendered markup ' + 'will stop working in React v17. Replace the Reac" +
                            "tDOM.render() call ' + 'with ReactDOM.hydrate() if you want React to attach to t" +
                            "he server HTML.');
      }
    }
    var newRoot = DOMRenderer.createContainer(c" +
                            "ontainer, shouldHydrate);
    root = container._reactRootContainer = newRoot;
  " +
                            "  // Initial mount should not be batched.
    DOMRenderer.unbatchedUpdates(funct" +
                            "ion () {
      DOMRenderer.updateContainer(children, newRoot, parentComponent, c" +
                            "allback);
    });
  } else {
    DOMRenderer.updateContainer(children, root, par" +
                            "entComponent, callback);
  }
  return DOMRenderer.getPublicRootInstance(root);
}" +
                            "

function createPortal(children, container) {
  var key = arguments.length > 2 " +
                            "&& arguments[2] !== undefined ? arguments[2] : null;

  !isValidContainer(contai" +
                            "ner) ? invariant_1$1(false, 'Target container is not a DOM element.') : void 0;
" +
                            "  // TODO: pass ReactDOM portal implementation as third argument
  return create" +
                            "Portal$1(children, container, null, key);
}

function ReactRoot(container, hydra" +
                            "te) {
  var root = DOMRenderer.createContainer(container, hydrate);
  this._reac" +
                            "tRootContainer = root;
}
ReactRoot.prototype.render = function (children, callba" +
                            "ck) {
  var root = this._reactRootContainer;
  DOMRenderer.updateContainer(child" +
                            "ren, root, null, callback);
};
ReactRoot.prototype.unmount = function (callback)" +
                            " {
  var root = this._reactRootContainer;
  DOMRenderer.updateContainer(null, ro" +
                            "ot, null, callback);
};

var ReactDOM = {
  createPortal: createPortal,

  findD" +
                            "OMNode: function (componentOrElement) {
    {
      var owner = ReactCurrentOwne" +
                            "r.current;
      if (owner !== null) {
        var warnedAboutRefsInRender = own" +
                            "er.stateNode._warnedAboutRefsInRender;
        warning_1$1(warnedAboutRefsInRend" +
                            "er, '%s is accessing findDOMNode inside its render(). ' + 'render() should be a " +
                            "pure function of props and state. It should ' + 'never access something that req" +
                            "uires stale data from the previous ' + 'render, such as refs. Move this logic to" +
                            " componentDidMount and ' + 'componentDidUpdate instead.', getComponentName(owner" +
                            ") || 'A component');
        owner.stateNode._warnedAboutRefsInRender = true;
  " +
                            "    }
    }
    if (componentOrElement == null) {
      return null;
    }
    i" +
                            "f (componentOrElement.nodeType === ELEMENT_NODE) {
      return componentOrEleme" +
                            "nt;
    }

    var inst = get(componentOrElement);
    if (inst) {
      return " +
                            "DOMRenderer.findHostInstance(inst);
    }

    if (typeof componentOrElement.ren" +
                            "der === 'function') {
      invariant_1$1(false, 'Unable to find node on an unmo" +
                            "unted component.');
    } else {
      invariant_1$1(false, 'Element appears to " +
                            "be neither ReactComponent nor DOMNode. Keys: %s', Object.keys(componentOrElement" +
                            "));
    }
  },
  hydrate: function (element, container, callback) {
    // TODO:" +
                            " throw or warn if we couldn't hydrate?
    return renderSubtreeIntoContainer(nul" +
                            "l, element, container, true, callback);
  },
  render: function (element, contai" +
                            "ner, callback) {
    return renderSubtreeIntoContainer(null, element, container," +
                            " false, callback);
  },
  unstable_renderSubtreeIntoContainer: function (parentC" +
                            "omponent, element, containerNode, callback) {
    !(parentComponent != null && h" +
                            "as(parentComponent)) ? invariant_1$1(false, 'parentComponent must be a valid Rea" +
                            "ct Component') : void 0;
    return renderSubtreeIntoContainer(parentComponent, " +
                            "element, containerNode, false, callback);
  },
  unmountComponentAtNode: functio" +
                            "n (container) {
    !isValidContainer(container) ? invariant_1$1(false, 'unmount" +
                            "ComponentAtNode(...): Target container is not a DOM element.') : void 0;

    if" +
                            " (container._reactRootContainer) {
      {
        var rootEl = getReactRootElem" +
                            "entInContainer(container);
        var renderedByDifferentReact = rootEl && !get" +
                            "InstanceFromNode$1(rootEl);
        warning_1$1(!renderedByDifferentReact, "unmo" +
                            "untComponentAtNode(): The node you're attempting to unmount " + 'was rendered by" +
                            " another copy of React.');
      }

      // Unmount should not be batched.
    " +
                            "  DOMRenderer.unbatchedUpdates(function () {
        renderSubtreeIntoContainer(" +
                            "null, null, container, false, function () {
          container._reactRootContai" +
                            "ner = null;
        });
      });
      // If you call unmountComponentAtNode tw" +
                            "ice in quick succession, you'll
      // get `true` twice. That's probably fine?" +
                            "
      return true;
    } else {
      {
        var _rootEl = getReactRootEleme" +
                            "ntInContainer(container);
        var hasNonRootReactChild = !!(_rootEl && getIn" +
                            "stanceFromNode$1(_rootEl));

        // Check if the container itself is a React" +
                            " root node.
        var isContainerReactRoot = container.nodeType === 1 && isVal" +
                            "idContainer(container.parentNode) && !!container.parentNode._reactRootContainer;" +
                            "

        warning_1$1(!hasNonRootReactChild, "unmountComponentAtNode(): The node" +
                            " you're attempting to unmount " + 'was rendered by React and is not a top-level " +
                            "container. %s', isContainerReactRoot ? 'You may have accidentally passed in a Re" +
                            "act root node instead ' + 'of its container.' : 'Instead, have the parent compon" +
                            "ent update its state and ' + 'rerender in order to remove this component.');
   " +
                            "   }

      return false;
    }
  },


  // Temporary alias since we already shi" +
                            "pped React 16 RC with it.
  // TODO: remove in React 17.
  unstable_createPortal" +
                            ": createPortal,

  unstable_batchedUpdates: batchedUpdates,

  unstable_deferred" +
                            "Updates: DOMRenderer.deferredUpdates,

  flushSync: DOMRenderer.flushSync,

  __" +
                            "SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    // For TapEventPlugin wh" +
                            "ich is popular in open source
    EventPluginHub: EventPluginHub,
    // Used by" +
                            " test-utils
    EventPluginRegistry: EventPluginRegistry,
    EventPropagators: " +
                            "EventPropagators,
    ReactControlledComponent: ReactControlledComponent,
    Re" +
                            "actDOMComponentTree: ReactDOMComponentTree,
    ReactDOMEventListener: ReactDOME" +
                            "ventListener
  }
};

if (enableCreateRoot) {
  ReactDOM.createRoot = function cr" +
                            "eateRoot(container, options) {
    var hydrate = options != null && options.hydr" +
                            "ate === true;
    return new ReactRoot(container, hydrate);
  };
}

var foundDev" +
                            "Tools = DOMRenderer.injectIntoDevTools({
  findFiberByHostInstance: getClosestIn" +
                            "stanceFromNode,
  bundleType: 1,
  version: ReactVersion,
  rendererPackageName:" +
                            " 'react-dom'
});

{
  if (!foundDevTools && ExecutionEnvironment_1.canUseDOM && " +
                            "window.top === window.self) {
    // If we're in Chrome or Firefox, provide a do" +
                            "wnload link if not installed.
    if (navigator.userAgent.indexOf('Chrome') > -1" +
                            " && navigator.userAgent.indexOf('Edge') === -1 || navigator.userAgent.indexOf('F" +
                            "irefox') > -1) {
      var protocol = window.location.protocol;
      // Don't w" +
                            "arn in exotic cases like chrome-extension://.
      if (/^(https?|file):$/.test(" +
                            "protocol)) {
        console.info('%cDownload the React DevTools ' + 'for a bett" +
                            "er development experience: ' + 'https://fb.me/react-devtools' + (protocol === 'f" +
                            "ile:' ? '\nYou might need to use a local HTTP server (instead of file://): ' + '" +
                            "https://fb.me/react-devtools-faq' : ''), 'font-weight:bold');
      }
    }
  }
" +
                            "}



var ReactDOM$2 = Object.freeze({
	default: ReactDOM
});

var ReactDOM$3 = (" +
                            " ReactDOM$2 && ReactDOM ) || ReactDOM$2;

// TODO: decide on the top-level expor" +
                            "t form.
// This is hacky but makes it work with both Rollup and Jest.
var reactD" +
                            "om = ReactDOM$3['default'] ? ReactDOM$3['default'] : ReactDOM$3;

return reactDo" +
                            "m;

})));"