
define(['knockout', 'text!Components/ToDo/toDo.html'], function(ko, template) {

    function keyhandlerBinding(keyCode) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                var wrappedHandler = function (d, e) {
                    if (e.keyCode === keyCode) {
                        valueAccessor().call(this, d, e);
                    }
                };

                var newValueAccessor = function () {
                    return {
                        keyup: wrappedHandler
                    };
                };

                ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
            }
        };
    }

    ko.bindingHandlers.enterKey = keyhandlerBinding(13);

    var ToDoItem = function () {
        return {
            description: ko.observable(),
            completed: ko.observable(false)
        }
    }

    var loadFromStorage = function () {
        var savedList = JSON.parse(localStorage.getItem('toDoList')) || [];

        return savedList.map(function (x) {
            var item = new ToDoItem();

            item.description(x.description);
            item.completed(x.completed);

            return item;
        });
    };

    var saveToStorage = function (toDoList) {
        localStorage.setItem('toDoList', ko.toJSON(toDoList));
    };

    var ToDoList = function () {
        var self = this;

        self.itemToAdd = ko.observable(new ToDoItem());
        self.toDoList = ko.observableArray(loadFromStorage());

        self.addItem = function () {
            if (!self.validateBeforeAdd()) return;

            self.toDoList.push(self.itemToAdd());

            self.itemToAdd(new ToDoItem());
        };

        self.removeItem = function (item) {
            self.toDoList.remove(item);
        }

        self.validateBeforeAdd = ko.computed(function () {
            var newDescription = self.itemToAdd().description();

            if (!newDescription) return false;

            var alreadyExists = self.toDoList().find(function (x) { return x.description() === newDescription });

            if (alreadyExists) return false;

            return true;
        });

        self.reset = function() {
            self.toDoList.removeAll();
        }

        ko.computed(function () {
            return ko.toJSON(self);
        }).subscribe(function () {
            saveToStorage(self.toDoList());
        });

        return self;
    }

    return {
        viewModel: function () { return new ToDoList(); },
        template: template
    }
});