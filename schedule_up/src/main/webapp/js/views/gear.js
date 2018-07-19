var gearView = {
    panel: {
        id: "gearPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-wrench'></span> Oprema"
            }, {}, {
                id: "addGearBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte opremu",
                icon: "plus-circle",
                click: 'gearView.showAddDialog',
                autowidth: true
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "gearDT",
            resizeColumn: true,
            resizeRow: true,
            //fixedRowHeight: false,
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,
            }, {
                id: "name",
                editable: false,
                fillspace: true,
                editor: "text",
                sort: "string",
                header: [
                    "Naziv", {
                        content: "textFilter"
                    }
                ]
            }, {
                id: "description",
                fillspace: true,
                editor: "text",
                sort: "text",
                editable: false,
                adjust: "data",
                header: [
                    "Opis", {
                        content: "textFilter"
                    }
                ]
            },{
                id: "inventoryNumber",
                fillspace: true,
                editor: "text",
                sort: "text",
                editable: false,
                adjust: "data",
                header: [
                    "Inventarski broj", {
                        content: "textFilter"
                    }
                ]
            }, {
                id: "available",
                fillspace: true,
                editor: "text",
                sort: "text",
                editable: false,
                format: function (value) {
                    if (value == 1) return "Da";
                    else return "Ne";
                },
                header: [
                    "Slobodno", {
                        content: "textFilter"
                    }
                ]
            }
            ],
            select: "row",
            navigation: true,
            editable: false,
            url: "gear-unit/",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                }
            }
        }]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "gearPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("gearDT", "gear-unit", true);
        $$("gearDT").detachEvent("onBeforeDelete");

        webix.ui({
            view: "contextmenu",
            id: "gearContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Izmijenite",
                icon: "pencil-square-o"
            }, {
                $template: "Separator"
            }, {
                id: "2",
                value: "Obrišite",
                icon: "trash"
            }],
            master: $$("gearDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            gearView.showChangeGearDialog($$("gearDT").getItem(context.id.row));
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("opreme", "opremu")));
                            var newItem = $$("gearDT").getItem(context.id.row);
                            delBox.callback = function (result) {
                                if (result == 1) {
                                    connection.sendAjax("DELETE", "gear-unit/" + newItem.id,
                                        function (text, data, xhr) {
                                            if (text) {
                                                util.messages.showMessage("Oprema uspješno uklonjena.");
                                                $$("gearDT").remove(context.id.row);
                                            } else
                                                util.messages.showErrorMessage("Neuspješno uklanjanje.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješno uklanjanje.");
                                        }, null);
                                }
                            };
                            webix.confirm(delBox);
                            break;
                    }
                }
            }
        });

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
                    label: "<span class='webix_icon fa-wrench'></span> Izmijenite podatke o opremi",
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
                    label: "Naziv:",
                    invalidMessage: "Unesite validan naziv opreme!",
                    required: true
                }, {
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis:",
                    required: false
                },{
                    view: "text",
                    id: "inventoryNumber",
                    name: "inventoryNumber",
                    label: "Inventarski broj:",
                    invalidMessage: "Unesite validan inventarski broj!",
                    required: true
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveGear",
                        view: "button",
                        value: "Sačuvajte",
                        type: "form",
                        click: "gearView.saveChangedGear",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value || value.length > 100)
                            return false;
                        return true;
                    },
                    "description": function (value) {
                        if (value.length > 500) {
                            return false;
                        }
                        return true;
                    },
                    "inventoryNumber": function (value) {
                        if (!value || value.length>100) {
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
        form.elements.inventoryNumber.setValue(gear.inventoryNumber);

        setTimeout(function () {
            $$("changeGearDialog").show();
            webix.UIManager.setFocus("name");
        }, 0);
    },

    saveChangedGear: function () {
        if ($$("changeGearForm").validate()) {

            var oldItem = $$("gearDT").getSelectedItem();

            var newItem = {
                id: $$("changeGearForm").getValues().id,
                available: oldItem.available,
                description: $$("changeGearForm").getValues().description,
                companyId: oldItem.companyId,
                name: $$("changeGearForm").getValues().name,
                inventoryNumber: $$("changeGearForm").getValues().inventoryNumber
            };

            connection.sendAjax("PUT", "gear-unit/custom/",
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Podaci su uspješno izmijenjeni.");

                        $$("gearDT").updateItem(newItem.id, newItem);
                    } else
                        util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, function () {
                    util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, newItem);

            util.dismissDialog('changeGearDialog');
        }
    },

    /////////////////

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
                    label: "<span class='fa fa-wrench'></span> Dodavanje opreme",
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
                    label: "Naziv opreme:",
                    invalidMessage: "Unesite validan naziv opreme!",
                    required: true,
                },{
                    view: "text",
                    id: " inventoryNumber",
                    name: "inventoryNumber",
                    label: "Inventarski broj:",
                    invalidMessage: "Unesite validan inventarski broj!",
                    required: true,
                },
                    {
                        id: "description",
                        name: "description",
                        view: "text",
                        label: "Opis:",
                        required: false
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
                        if (value.length > 500) {
                            $$('addGearForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500';
                            return false;
                        }
                        return true;
                    },
                    "inventoryNumber":function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addGearForm').elements.inventoryNumber.config.invalidMessage = 'Maksimalan broj karaktera je 100';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showAddDialog: function () {
        if(util.popupIsntAlreadyOpened("addGearDialog")){
            webix.ui(webix.copy(gearView.addDialog)).show();
            webix.UIManager.setFocus("name");
        }
    },

    save: function () {
        var form = $$("addGearForm");
        if (form.validate()) {
            var newItem = {
                name: $$("addGearForm").getValues().name,
                description: $$("addGearForm").getValues().description,
                inventoryNumber: $$("addGearForm").getValues().inventoryNumber,
                available: 1,
                companyId: userData.companyId,
                gearId: null
            };

            $$("gearDT").add(newItem);
            util.messages.showMessage("Oprema je uspješno kreirana.");
            util.dismissDialog('addGearDialog');

        }
    }
};