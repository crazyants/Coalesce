﻿/// <reference path="../../typings/tsd.d.ts" />
// Intellitect.Utilities

// Turn off AJAX Caching
$.ajaxSetup({ cache: false });

// Add to the Intellitect namespace or create it.
module intellitect {
    // Create a sub namespace.
    export module utilities {
        var busyOverlayTimeout = 0;
        var busyDepth = 0;
        var _isBusyEnabled = true;

        // Turn on or off the busy indicator as a whole
        export function isBusyEnabled(value: boolean) {
            if (!value) {
                clearTimeout(busyOverlayTimeout);
                busyOverlayTimeout = 0;
                $('#busy-overlay').fadeOut(100);
            }
            _isBusyEnabled = value;
        };

        export function hideBusy() {
            if (_isBusyEnabled) {
                busyDepth--;
                if (busyDepth === 0) {
                    clearTimeout(busyOverlayTimeout);
                    busyOverlayTimeout = 0;
                    $('#busy-overlay').fadeOut(100);
                }
            }
        };

        export function showBusy() {
            // Wait for 200 MS before showing the busy indicator.
            if (_isBusyEnabled) {
                busyDepth++;
                if (busyOverlayTimeout === 0) {
                    busyOverlayTimeout = setTimeout(showBusyNow, 200);
                }
            }
        };

        function showBusyNow() {
            $('#busy-overlay').fadeIn(100);
            //clearTimeout(busyOverlayFailureTimeout);
            //busyOverlayFailureTimeout = setTimeout(busyFailed, busyOverlayFailureTimeoutInSeconds * 1000);
        }





        // Load a Web API JSON object as a script. This returns the object that the URL returns.
        // It runs synchronously.
        export function loadAsScript(url: string): string {
            var result;
            $.ajax(url, {
                type: "GET",
                async: false
            }).done(function (data) {
                result = data;
            });
            return result;
        };

        // Get a URL parameter by name.
        export function GetUrlParameter(sParam: string): string {
            var sPageUrl = window.location.search.substring(1);
            var sUrlVariables = sPageUrl.split('&');
            for (var i = 0; i < sUrlVariables.length; i++) {
                var sParameterName = sUrlVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
            if (sParam === "id" || sParam === "Id" || sParam === "ID") {
                // The id was used as the last part of the actual URL.
                var paths = window.location.pathname.split('/');
                var lastPath = paths[paths.length - 1];
                if ($.isNumeric(lastPath)) {
                    return lastPath;
                }
            }
            return null;
        }

        export function SetUrlParameter(url: string, paramName: string, paramValue: string) {
            var hash = location.hash;
            url = url.replace(hash, '');
            if (url.indexOf(paramName + "=") >= 0) {
                var prefix = url.substring(0, url.indexOf(paramName));
                var suffix = url.substring(url.indexOf(paramName));
                suffix = suffix.substring(suffix.indexOf("=") + 1);
                suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
                url = prefix + paramName + "=" + paramValue + suffix;
            }
            else {
                if (url.indexOf("?") < 0)
                    url += "?" + paramName + "=" + paramValue;
                else
                    url += "&" + paramName + "=" + paramValue;
            }
            return url + hash;
        }

        export function capitalizeFirstLetter(string) {
            if (string) return string.charAt(0).toUpperCase() + string.slice(1);
            else return string;
        }

        export function lowerFirstLetter(string) {
            if (string) return string.charAt(0).toLowerCase() + string.slice(1);
            else return string;
        }

        export function warning(question: string, callback: (() => void), myThis: any): (() => void) {
            return function () {
                if (confirm(question)) {
                    callback.bind(myThis || this)();
                }
            }
        }



        export module pin {
            var pinTimeoutInSeconds: number = 0;
            var pinUrlIndex: string;
            var pinTimeout: number;

            export function setPinTimer(): void {
                if (pinTimeout !== 0) {
                    clearTimeout(pinTimeout);
                }
                if (this.pinTimeoutInSectons) {
                    pinTimeout = setTimeout(goToPinPage, this.pinTimeoutInSeconds * 1000);
                }
            }

            function goToPinPage() {
                pinTimeout = 0;
                document.location.href = this.pinUrlIndex + "?returnUrl=" + document.location.href;
            }
        }

        // Saves the values of inputs into the DOM element.
        // This is used to serialize the DOM for storage with the values.
        export function saveValuesInDom() {
            $('input:text').each(function (i, item) {
                $(item).attr('value', $(item).val());
            });

            $('textarea').each(function (i, item) {
                $(item).html($(item).val());
            });

            $('input:checkbox').each(function (i, item) {
                if ((<HTMLInputElement>item).checked) {
                    $(item).attr('checked', 'checked');
                } else {
                    $(item).removeAttr('checked');
                }
            });

        }

    }


    export module webApi {
        export function setupPlainModal(content: string): void {
            content = '\
                <div id="modal-dialog" class="modal fade">\
                  <div class="modal-dialog">\
                    <div class="modal-content">' +
            content + '\
                    </div><!-- /.modal-content -->\
                  </div><!-- /.modal-dialog -->\
                </div><!-- /.modal -->\
            ';

            // Remove the old one.
            $('#modal-dialog').remove();
            // Add this to the DOM
            $('body').append(content);
        }

        export function setupModal(title: string, content: string, hideSave: boolean, hideClose: boolean): void {
            content = '\
                <div class="modal-header">\
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                  <h3 class="modal-title">' +
            title + '\
                  </h3>\
                </div>\
                <div class="modal-body">' +
            content + '\
                </div>\
                <div class="modal-footer">' +
            (hideClose ? '' : '\
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                    ') +
            (hideSave ? '' : '\
                  <button type="button" class="btn btn-primary">Save</button>\
                    ') + '\
                </div>\
            ';

            setupPlainModal(content);

        }


    }
}
