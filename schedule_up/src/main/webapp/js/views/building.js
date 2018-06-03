var buildingView = {

    panel: {
        id: "buildingPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-building'></span> Zgrade"
            },{}, {
                id: "addBuildingBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte zgradu",
                icon: "plus-circle",
                autowidth: true
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "buildingDT",
            resizeColumn: true,
            resizeRow: true,
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
            },  {
                    id: "description",
                    fillspace: true,
                    editor: "text",
                    sort: "text",
                    editable:false,
                    header: [
                        "Opis", {
                            content: "textFilter"
                        }
                    ]
                }
            ],
            select: "row",
            navigation: true,
            editable: false,
            url: "building/",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                }
            }
        }]
    }

    ,
    changeBuildingDialog: {
        view: "popup",
        id: "changeBuildingDialog",
        modal: true,
        position: "center",
        body: {
            id: "changeBuildingInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-book'></span> Izmijenite podatke o zgradi",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changeBuildingDialog');"
                }]
            }, {
                view: "form",
                id: "changeBuildingForm",
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
                    invalidMessage: "Unesite ime zgrade!",
                    required: true
                }, {
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis:",
                    required: true
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveBuilding",
                        view: "button",
                        value: "Sačuvajte",
                        type: "form",
                        click: "buildingView.saveChangedBuilding",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        return true;
                    },
                    "description": function (value) {
                        if (!value) {
                            $$('addBuildingForm').elements.ects.config.invalidMessage = 'Unesite opis!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },
    selectPanel: function(){
        $$("main").removeView(rightPanel);
        rightPanel = "buildingPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));

        webix.ui({
            view: "contextmenu",
            id: "buildingContextMenu",
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
            master: $$("buildingDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            buildingView.showChangeBuildingDialog($$("buildingDT").getItem(context.id.row));
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.deleteConfirm("building")));
                            delBox.callback = function (result) {
                                if (result == 1) {
                                    connection.sendAjax("DELETE")
                                    $$("buildingDT").remove(context.id.row);
                                    util.messages.showMessage("Zgrada je uspješno obrisana.");
                                }
                            };
                            webix.confirm(delBox);
                            break;
                    }
                }
            }
        });

    },
    showChangeBuildingDialog: function (building) {
        webix.ui(webix.copy(buildingView.changeBuildingDialog));
        var form = $$("changeBuildingForm");
        form.elements.id.setValue(building.id);
        form.elements.name.setValue(building.name);
        form.elements.description.setValue(building.description);

        setTimeout(function () {
            $$("changeBuildingDialog").show();
            webix.UIManager.setFocus("name");
        }, 0);
    },

    saveChangedBuilding: function () {
        if ($$("changeBuildingForm").validate()) {

            var newItem = {
                id: $$("changeBuildingForm").getValues().id,
                name: $$("changeBuildingForm").getValues().name,
                description: $$("changeBuildingForm").getValues().description,
                companyId: 1,
                deleted:0,
                latitude:0,
                longitude:0
            };
            console.log("aj");
                console.log("building id:"+newItem.id);
            connection.sendAjax("PUT", "building/"+newItem.id,
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Podaci su uspješno izmijenjeni.");
                        $$("buildingDT").updateItem(newItem.id, newItem);
                    } else
                        util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, function () {
                    util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, newItem);

            util.dismissDialog('changeBuildingDialog');
        }
    }
};