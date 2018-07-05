var tableData=[];
var tableCentar=[];

var roomView = {

    panel: {
        id: "roomPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-cube'></span> Sale"
            }, {}, {
                id: "addRoomBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte salu",
                icon: "plus-circle",
                click: 'roomView.showAddDialog',
                autowidth: true
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "roomDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,

            }, {
                id: "name",
                fillspace: true,
                editor: "text",
                sort: "string",
                header: [
                    "Naziv sale", {
                        content: "textFilter"
                    }
                ]
            }, {
                id: "floor",
                fillspace: true,
                editor: "text",
                sort: "int",
                header: ["Sprat",
                    {
                        content: "numberFilter"
                    }]
            },
                {
                    id: "capacity",
                    fillspace: true,
                    editor: "text",
                    sort: "int",
                    header: ["Kapacitet", {
                        content: "numberFilter"
                    }],
                },
                {
                    id: "buildingName",
                    fillspace: true,
                    sort: "string",
                    header: [
                        "Naziv zgrade", {
                            content: "textFilter"
                        }
                    ]
                },
                {
                    id: "description",
                    editable: false,
                    fillspace: true,
                    editor: "text",
                    sort: "string",
                    header: [
                        "Opis", {
                            content: "textFilter"
                        }
                    ]

                },
                {
                    id: "location",
                    editable: false,
                    fillspace: true,
                    header: {
                        text: "Lokacija",
                        css: {"text-align": "justify"},
                    },
                    template: "<span class='fa fa-map-marker info'></span>",

                }
            ],
            select: "row",
            navigation: true,
            editable: true,
            editaction: "dblclick",
            url: "room/",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                }
            },

            onMouseMove:{
                info:function(e, id){
                    roomView.showMapDetailsDialog(this.getItem(id).latitude,this.getItem(id).longitude);
                    return false;
                }
            }
        }]
    },

    showMapDetailsDialog: function(latitude,longitude){
        tableCentar[0]=latitude;
        tableCentar[1]=longitude;
        var mapaObjekat={
            id:1,lat:tableCentar[0],  lng:tableCentar[1]
        };
        tableData[0]=mapaObjekat;
        webix.ui(webix.copy(roomView.showMapDialog));
        $$("mapLabel").data.label="<span class='webix_icon fa fa-map-marker '></span> Lokacija sale";
        $$("showMapDialog").show();
    },


    showMapDialog:{
        view: "popup",
        id: "showMapDialog",
        modal: true,
        position: "center",
        body: {
            id: "showMapDialogInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    id:"mapLabel",
                    view: "label",
                    label: "<span class='webix_icon fa fa-map-marker '></span> Lokacija sale",
                    width: 600,
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('showMapDialog');"
                }]
            }, {
                key:"AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg",
                view:"google-map",
                id:"map",
                zoom:15,
                width: 600,
                height:500,
                center:tableCentar,
                data:tableData

            },]
        }
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "roomPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("roomDT", "room", false, false, editValidationRules);
        $$("roomDT").detachEvent("onBeforeDelete");


        webix.ui({
            view: "contextmenu",
            id: "roomContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Izmjenite",
                icon: "pencil-square-o"
            }, {
                $template: "Separator"
            }, {
                id: "2",
                value: "Obrišite",
                icon: "trash"
            }, {
                $template: "Separator"
            },
                {
                    id: "3",
                    value: "Prikaz rezervacija",
                    icon: "calendar"
                },
                {
                    $template:"Separator"
                },
                {
                    id: "4",
                    value: "Oprema u sali",
                    icon: "hdd-o"
                }
            ],
            master: $$("roomDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            roomView.showChangeRoomDialog($$("roomDT").getItem(context.id.row));
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("sale", "salu")));
                            var newItem = $$("roomDT").getItem(context.id.row);
                            delBox.callback = function (result) {
                                if (result == 1) {

                                    connection.sendAjax("DELETE", "room/" + newItem.id,
                                        function (text, data, xhr) {
                                            if (text) {
                                                util.messages.showMessage("Sala uspješno obrisana.");
                                                $$("roomDT").remove(context.id.row);
                                            } else
                                                util.messages.showErrorMessage("Neuspješno brisanje.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješno brisanje.");
                                        }, null);

                                }
                            };
                            webix.confirm(delBox);
                            break;
                        case "3":
                            meetingView.selectPanel($$("roomDT").getItem(context.id.row));
                            break;
                        case "4":
                            roomView.showGearDialog($$("roomDT").getItem(context.id.row).id);
                            break;

                    }
                }
            }
        });
    },

    addDialog: {
        view: "popup",
        id: "addRoomDialog",
        modal: true,
        position: "center",
        body: {
            id: "addRoomInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-cube'></span> Dodavanje sale",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addRoomDialog');"
                }]
            }, {
                view: "form",
                id: "addRoomForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv sale",
                    invalidMessage: "Unesite naziv sale!",
                    required: true
                }, {
                    view: "combo",
                    id: "buildingName",
                    name: "buildingName",
                    label: "Naziv zgrade",
                    invalidMessage: "Unesite naziv zgrade!",
                    required: true,
                    options: {
                        filter: function (item, value) {
                            if (item.name.toString().toLowerCase().indexOf(value.toLowerCase()) === 0)
                                return true;
                            return false;
                        },
                        body: {
                            template: "#name#",
                            yCount: 5,
                            url: "building"
                        }
                    }
                }, {
                    view: "counter",
                    id: "floor",
                    name: "floor",
                    label: "Broj sprata",
                    min: -1000,
                    value: 0
                }, {
                    view: "counter",
                    id: "capacity",
                    name: "capacity",
                    label: "Kapacitet sale",
                    min: 1,
                    value: 1
                }, {
                    view: "text",
                    id: "pin",
                    name: "pin",
                    label: "PIN",
                    invalidMessage: "Unesite PIN!",
                    required: true
                }, {
                    view: "textarea",
                    id: "description",
                    name: "description",
                    label: "Opis",
                    height: 90

                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveRoom",
                        view: "button",
                        value: "Sačuvajte",
                        type: "form",
                        click: "roomView.save",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addRoomForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "buildingName": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addRoomForm').elements.buildingName.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "floor": function (value) {
                        if (isNaN(value) || value != parseInt(value, 10)) {
                            $$('addRoomForm').elements.floor.config.invalidMessage = 'Broj spratova mora biti cijeli broj!';
                            return false;
                        }
                        return true;
                    },
                    "capacity": function (value) {
                        if (isNaN(value) || value != parseInt(value, 10)) {
                            $$('addRoomForm').elements.capacity.config.invalidMessage = 'Kapacitet sale mora biti cijeli broj!';
                            $$('addRoomForm').elements.capacity.setValue(1);
                            return false;
                        }
                        if (value < 1) {
                            $$('addRoomForm').elements.capacity.config.invalidMessage = 'Kapacitet sale mora biti veći od 0!';
                            return false;
                        }
                        return true;
                    },
                    "pin": function (value) {
                        if (!value)
                            return false;
                        if (isNaN(value) || value != parseInt(value, 10)) {
                            $$('addRoomForm').elements.pin.config.invalidMessage = 'PIN može da sadrži samo cifre!';
                            return false;
                        }
                        if (value.length != 4) {
                            $$('addRoomForm').elements.pin.config.invalidMessage = 'PIN se sastoji iz 4 cifre!';
                            return false;
                        }
                        return true;
                    },
                    "description": function (value) {
                        if (value && value.length > 500) {
                            $$('addRoomForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showAddDialog: function () {
        webix.ui(webix.copy(roomView.addDialog)).show();
        webix.UIManager.setFocus("name");
    },

    save: function () {
        var form = $$("addRoomForm");
        var buildingName = form.elements.buildingName.getList().getItem(form.getValues().buildingName).name;

        if (form.validate()) {
            var newRoom = {
                name: form.getValues().name,
                floor: form.getValues().floor,
                capacity: form.getValues().capacity,
                pin: form.getValues().pin,
                description: form.getValues().description,
                buildingId: form.getValues().buildingName,
                companyId: companyData.id,
                buildingName: buildingName
            };
            $$("roomDT").add(newRoom);
            util.dismissDialog('addRoomDialog');
        }
    },

    changeRoomDialog: {
        view: "popup",
        id: "changeRoomDialog",
        modal: true,
        position: "center",
        body: {
            id: "changeRoomInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-cube'></span> Izmjena podataka o sali",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changeRoomDialog');"
                }]
            }, {
                view: "form",
                id: "changeRoomForm",
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
                    label: "Naziv sale",
                    invalidMessage: "Unesite naziv sale!",
                    required: true
                }, {
                    view: "combo",
                    id: "buildingName",
                    name: "buildingName",
                    label: "Naziv zgrade",
                    invalidMessage: "Unesite naziv zgrade!",
                    required: true,
                    options: {
                        filter: function (item, value) {
                            if (item.name.toString().toLowerCase().indexOf(value.toLowerCase()) === 0)
                                return true;
                            return false;
                        },
                        body: {
                            template: "#name#",
                            yCount: 5,
                            url: "building"

                        }
                    }
                }, {
                    view: "counter",
                    id: "floor",
                    name: "floor",
                    label: "Broj sprata",
                    min: -1000,
                    value: 0
                }, {
                    view: "counter",
                    id: "capacity",
                    name: "capacity",
                    label: "Kapacitet sale",
                    min: 1,
                    value: 1
                }, {
                    view: "text",
                    id: "pin",
                    name: "pin",
                    label: "PIN",
                    invalidMessage: "Unesite PIN!",
                    required: true
                }, {
                    view: "textarea",
                    id: "description",
                    name: "description",
                    label: "Opis",
                    height: 90
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveRoom",
                        view: "button",
                        value: "Sačuvajte",
                        type: "form",
                        click: "roomView.saveChangedRoom",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('changeRoomForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "buildingName": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('changeRoomForm').elements.buildingName.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "floor": function (value) {
                        if (isNaN(value) || value != parseInt(value, 10)) {
                            $$('changeRoomForm').elements.floor.config.invalidMessage = 'Broj spratova mora biti cijeli broj!';
                            return false;
                        }
                        return true;
                    },
                    "capacity": function (value) {
                        if (isNaN(value) || value != parseInt(value, 10)) {
                            $$('changeRoomForm').elements.capacity.config.invalidMessage = 'Kapacitet sale mora biti cijeli broj!';
                            $$('changeRoomForm').elements.capacity.setValue(1);
                            return false;
                        }
                        if (value < 1) {
                            $$('changeRoomForm').elements.capacity.config.invalidMessage = 'Kapacitet sale mora biti veći od 0!';
                            return false;
                        }
                        return true;
                    },
                    "pin": function (value) {
                        if (!value)
                            return false;
                        if (isNaN(value) || value != parseInt(value, 10)) {
                            $$('changeRoomForm').elements.pin.config.invalidMessage = 'PIN može da sadrži samo cifre!';
                            return false;
                        }
                        if (value.length != 4) {
                            $$('changeRoomForm').elements.pin.config.invalidMessage = 'PIN se sastoji iz 4 cifre!';
                            return false;
                        }
                        return true;
                    },
                    "description": function (value) {
                        if (value && value.length > 500) {
                            $$('changeRoomForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showChangeRoomDialog: function (room) {
        webix.ui(webix.copy(roomView.changeRoomDialog));
        var form = $$("changeRoomForm");
        form.elements.id.setValue(room.id);
        form.elements.name.setValue(room.name);
        form.elements.buildingName.setValue(room.buildingId);
        form.elements.floor.setValue(room.floor);
        form.elements.capacity.setValue(room.capacity);
        form.elements.description.setValue(room.description);

        setTimeout(function () {
            $$("changeRoomDialog").show();
            webix.UIManager.setFocus("name");
        }, 0);
    },

    saveChangedRoom: function () {
        var form = $$("changeRoomForm");
        var buildingName = form.elements.buildingName.getList().getItem(form.getValues().buildingName).name;
        if (form.validate()) {
            var newRoom = {
                id: form.getValues().id,
                name: form.getValues().name,
                floor: form.getValues().floor,
                capacity: form.getValues().capacity,
                pin: form.getValues().pin,
                description: form.getValues().description,
                buildingId: form.getValues().buildingName,
                companyId: companyData.id,
                deleted: 0,
                buildingName: buildingName
            };

            connection.sendAjax("PUT", "room/" + newRoom.id,
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Podaci su uspješno izmijenjeni.");
                        $$("roomDT").updateItem(newRoom.id, newRoom);
                    } else
                        util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, function () {
                    util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, newRoom);

            util.dismissDialog('changeRoomDialog');
        }
    },
    gearDialog: {
        view: "popup",
        id: "gearDialog",
        modal: true,
        position: "center",
        roomId:null,
        body: {
            rows: [
                {
                    view: "toolbar",
                    cols: [{
                        view: "label",
                        label: "<span class='webix_icon fa-hdd-o'></span> Oprema u sali",
                        width: 200
                    }, {}, {
                        view: "icon",
                        icon: "close",
                        align: "right",
                        click: "util.dismissDialog('gearDialog');"
                    }]
                },
                {
                    paddingY:10,
                    cols:[
                        {},
                        {
                            view:"button",
                            icon:"plus-circle",
                            type:"iconButton",
                            label:"Dodajte opremu",

                            autowidth:true
                        }
                    ]
                },
                {
                    id:"gearList",
                    view:"list",
                    onContext: {},
                    width:300,
                    height:300,
                    select:true,
                    type:{
                        height:"auto",
                        template:"<div class='gear-name'>#name#</div><div class='gear-description'>#description#</div>"
                    },
                    on: {

                        onAfterContextMenu: function (item) {
                            this.select(item.row);
                        }
                    }

                    
                }

            ]
        }
    },

    showGearDialog:function (roomId) {
        var dialog=webix.ui(webix.copy(this.gearDialog));
        this.gearDialog.roomId=roomId;
        webix.ui({
            view: "contextmenu",
            id: "gearContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Obrišite",
                icon: "trash"
            }
            ],
            master: $$("gearList"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("opreme", "opremu")));
                            console.log(context.id.row);
                            var newItem = $$("gearList").getItem(context.id);
                            delBox.callback = function (result) {
                                if (result == 1) {

                                    connection.sendAjax("DELETE", "gear-unit/" + newItem.id,
                                        function (text, data, xhr) {
                                            if (text) {
                                                util.messages.showMessage("Oprema uspješno obrisana.");
                                                $$("gearList").remove(context.id);
                                            } else
                                                util.messages.showErrorMessage("Neuspješno brisanje.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješno brisanje.");
                                        }, null);

                                }
                            };
                            webix.confirm(delBox);
                            break;

                    }
                }
            }
        });

        $$("gearList").load("gear-unit/custom/byRoom/"+roomId).then(function (response){
            if (response)
                dialog.show();
            else
                util.messages.showErrorMessage("Nemoguće učitati opremu iz sale!");
        }).fail(function (error) {
            util.messages.showErrorMessage("Nemoguće učitati opremu iz sale!");
        });
    }

};

var editValidationRules = [
    {column: "name", rule: "isEmpty"},
    {column: "name", rule: "checkLength"},
    {column: "floor", rule: "isEmpty"},
    {column: "floor", rule: "isInteger"},
    {column: "capacity", rule: "isEmpty"},
    {column: "capacity", rule: "isPositiveInteger"},
    {column: "description", rule: "checkLength"}
];