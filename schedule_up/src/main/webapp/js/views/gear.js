var gearView = {
    selectPanel: function() {

    },

    addDialog: {
        view: "popup",
        id: "addGearDialog",
        modal: true,
        position: "center",
        body: {
            id: "addGearInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-archive'></span> Dodavanje opreme",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addGearDialog');"
                }]
            }, {
                view: "form",
                id: "addGearForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv:",
                    invalidMessage: "Unesite naziv opreme!",
                    required: true,
                    //suggest: "gear/getAllNames/"
                }, {
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis:"
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveGear",
                        view: "button",
                        value: "Dodajte opremu",
                        type: "form",
                        click: "gearView.save",
                        hotkey: "enter",
                        width: 150
                    }]
                }
                ],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addGearForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "description": function (value) {
                        if (!value && value.length > 500) {
                            $$('addGearForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showAddDialog: function () {
        webix.ui(webix.copy(gearView.addDialog)).show();
        webix.UIManager.setFocus("name");
    },

    save: function () {
        var form = $$("addGearForm");
        if (form.validate()) {

            var newGearUnitGear = {
                name: form.getValues().name,
                description: form.getValues().description,
                companyId: 1,
                gearId: 1,//privremeno dok se ne kreira odgovarajuca metoda
                available: 1
            };
            //  $$("gearDT").add(newGearUnitGear);//jos nije kreiran gearDT

        }
    },

    changeGearDialog: {
        view: "popup",
        id: "changeGearDialog",
        modal: true,
        position: "center",
        body: {
            id: "changeGearInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-archive'></span> Izmjena podataka o opremi",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changeGearDialog');"
                }]
            }, {
                view: "form",
                id: "changeGearForm",
                width: 500,
                elementsConfig: {
                    labelWidth: 140,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    name: "id",
                    hidden: true
                }, {
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Name:",
                    invalidMessage: "Enter gear name!",
                    required: true
                }, {
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis:"
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveChangedGear",
                        view: "button",
                        value: "Save",
                        type: "form",
                        click: "gearView.saveChangedGear",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addGearForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "description": function (value) {
                        if (!value && value.length > 500) {
                            $$('addGearForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showChangeGearDialog: function (gear) {
        webix.ui(webix.copy(gearView.changeGearDialog));
        var form = $$("changeGearForm");
        form.elements.id.setValue(gear.id);
        form.elements.name.setValue(gear.name);
        form.elements.description.setValue(gear.description);

        setTimeout(function () {
            $$("changeGearDialog").show();
            webix.UIManager.setFocus("name");
        }, 0);
    },

    saveChangedGear: function () {
        if ($$("changeGearForm").validate()) {
            //ovo ispod je workaround za potrebe testiranja dok se ne razjasne neke stvari
            var newGearUnitGear = {
                name: $$("changeGearForm").getValues().name,
                description: $$("changeGearForm").getValues().description,
                //gearID: id se dobija na osnovu name, ali jos nema metode za to
                companyId: 1,
                available: 1,
                deleted: 0,
                gearId: 1,
                id: 50
            };

            connection.sendAjax("PUT", "gear-unit/custom/",
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Data successfully changed.");
                        //$$("gearDT").updateItem(newGearUnitGear.id, newGearUnitGear);
                    } else
                        util.messages.showErrorMessage("Data not successfully changed.");
                }, function () {
                    util.messages.showErrorMessage("Data not successfully changed.");
                }, newGearUnitGear);

            util.dismissDialog('changeGearDialog');
        }
    }
};

