
define(['knockout'],
    function(ko) {

        ko.components.register('money', {
            require: 'Components/Money/money'
        });

        ko.components.register('toDo', {
            require: 'Components/ToDo/todo'
        });

        ko.applyBindings({
            currentScreen: ko.observable("money")
        });

    });