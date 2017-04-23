
define(['knockout', 'text!Components/Money/money.html'],
    function(ko, template) {

        var toNumeric = function (stringValue) {
            var numericValue = (stringValue || 0).toString().replace(/[^\d.-]/g, '');
            return parseFloat(0 + numericValue);
        }

        var toMoney = function(value) {
            return "\u00A3 " + toNumeric(value).toFixed(2);
        }

        ko.bindingHandlers.money = {
            init: function(element, valueAccessor, allBindingsAccessor, data, context) {
                var observable = valueAccessor();

                var maxValue = allBindingsAccessor().max;
                var minValue = allBindingsAccessor().min;

                var isValid = function(value) {
                    var maxValid = maxValue != undefined && value <= maxValue;
                    var minValid = minValue != undefined && value >= minValue;

                    return maxValid && minValid;
                }

                var setter = function() {
                    var previousValue = observable();

                    var newValue = isValid(toNumeric(element.value)) ? toMoney(element.value) : previousValue;

                    observable(newValue);
                    element.value = observable();
                };

                setter();

                ko.utils.registerEventHandler(element, 'change', setter);
            }
        };

        return {
            viewModel: function () {
                return { moneyValue: ko.observable() };
            },
            template: template
        };
    });