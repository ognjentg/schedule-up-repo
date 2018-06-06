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
            },{}, {
                id: "addGearBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte opremu",
                icon: "plus-circle",
                autowidth: true
            }]
        },{
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
            },  {
                id: "description",
                fillspace: true,
                editor: "text",
                sort: "text",
                editable:false,
                adjust: "data",
                header: [
                    "Opis", {
                        content: "textFilter"
                    }
                ]
            } ,{
                id: "available",
                fillspace: true,
                editor: "text",
                sort: "text",
                editable:false,
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
                },
                onAfterLoad: function () {
                    this.eachRow(
                        function (row) {
                            var item = this.getItem(row);
                            if(item.available == 1){
                                item.available = "Da";
                            }else item.available = "Ne";
                            this.refresh();
                        }
                    );
                    //this.adjustRowHeight();
                },
                onAfterAdd: function () {
                    this.eachRow(
                        function (row) {
                            var item = this.getItem(row);
                            if(item.available == 1){
                                item.available = "Da";
                            }else item.available = "Ne";
                            this.refresh();
                        }
                    )
                }
            }
        }]
    },

    selectPanel: function(){
        $$("main").removeView(rightPanel);
        rightPanel = "gearPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));

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
                            var delBox = (webix.copy(commonViews.deleteConfirm("gear")));
                            delBox.callback = function (result) {
                                if (result == 1) {
                                    connection.sendAjax("DELETE")
                                    $$("gearDT").remove(context.id.row);
                                    util.messages.showMessage("Oprema je uspješno obrisana.");
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
                    required: true,
                    suggest: {
                        id: "gearSuggest",
                        url: "gear/getAllNames"
                    }
                }, {
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis:",
                    required: false
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
                        if (!value || value.length>100)
                            return false;
                        return true;
                    },
                    "description": function (value) {
                        if (value.length > 500) {
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

            var oldItem = $$("gearDT").getSelectedItem();

            var newItem = {
                id: $$("changeGearForm").getValues().id,
                available: oldItem.available,
                description: $$("changeGearForm").getValues().description,
                gearId: oldItem.gearId,
                companyId: oldItem.companyId,
                name: $$("changeGearForm").getValues().name
            };

            if(newItem.available == "Da") newItem.available = 1;
            else newItem.available = 0;

            //provjeriti da li je gear nov, ako jeste staviti gearId na null
            var gearExists = false;
            var allGearNames = $$("gearSuggest").getList().data;
            allGearNames.each(
                function (obj) {
                    if(obj.value == newItem.name) gearExists = true;
                }
            );

            if(!gearExists) newItem.gearId = null;

            console.log("gear id:"+oldItem.id);
            console.log(oldItem.available);
            connection.sendAjax("PUT", "gear-unit/custom/",
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Podaci su uspješno izmijenjeni.");

                        if(newItem.available == 1) newItem.available = "Da";
                        else newItem.available = "Ne";
                        $$("gearDT").updateItem(newItem.id, newItem);
                    } else
                        util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, function () {
                    util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, newItem);

            util.dismissDialog('changeGearDialog');
        }
    }
};