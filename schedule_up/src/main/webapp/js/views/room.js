var tableData=[];
var tableCentar=[];

var roomView = {
    roomId:null,
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
        var url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"+&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg&language=hr";
        fetch(url).then(function(result) {
            if(result.ok) {
                return result.json();
            }
            throw new Error('Neuspješno dobavljanje tačne lokacije.');
        }).then(function(json) {
            tableCentar[0]=latitude;
            tableCentar[1]=longitude;
            var mapaObjekat={
                id:1,lat:tableCentar[0],  lng:tableCentar[1]
            };
            tableData[0]=mapaObjekat;
            webix.ui(webix.copy(roomView.showMapDialog));
            $$("mapLabel").data.label="<span class='webix_icon fa fa-map-marker '></span> Lokacija sale";
            $$("map").add({ id:2, lat: latitude, lng: longitude})

            $$("showMapDialog").show();

            var place=json['results'][0];

            var filtered_array3 = place.address_components.filter(function(address_component){
                return address_component.types.includes("route");
            });
            var adresa = filtered_array3.length ? filtered_array3[0].long_name: "";
            var filtered_array4 = place.address_components.filter(function(address_component){
                return address_component.types.includes("street_number");
            });

            var broj = filtered_array4.length ? filtered_array4[0].long_name: "";
            var broj2 = filtered_array4.length ? filtered_array4[0].short_name: "";

            var infowindow;
            var item = $$("map").getItem(2);
            var marker = item.$marker;
            if(broj!=null){
                marker.infowindow = new google.maps.InfoWindow({
                    content: adresa+" "+broj
                });
            }else if(broj2!=null){
                marker.infowindow = new google.maps.InfoWindow({
                    content: adresa+" "+broj2
                });
            }else{
                marker.infowindow = new google.maps.InfoWindow({
                    content: adresa
                });
            }
            marker.infowindow.open($$("map").getMap(), marker);
            // setTimeout(function () { infowindow.close(); }, 5000);
        });

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

            }]
        }
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "roomPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("roomDT", "room", false, false, editValidationRules);
        $$("roomDT").detachEvent("onBeforeDelete");

        var roomContextMenu;
        if (userData.roleId==2){
            roomContextMenu=[{
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
            ];
        }else{
            roomContextMenu=[{
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
                }];
            $$("addRoomBtn").hide();
            $$("roomDT").define("editaction","none");
            $$("roomDT").refresh();
        }

        webix.ui({
            view: "contextmenu",
            id: "roomContextMenu",
            width: 200,
            data: roomContextMenu,
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
                            meetingView.selectPanel($$("roomDT").getItem(context.id.row),$$("roomDT").getItem(context.id.row).name);
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
                            id:"addGearBtn",
                            view:"button",
                            icon:"plus-circle",
                            type:"iconButton",
                            label:"Dodajte opremu",
                            click: "roomView.showAddGearDialog",
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
                    select: "row",
                    type:{
                        height:"auto",
                        template:"<div class='gear-name'>#name#</div><div class='gear-description'>#description#</div>"
                    },

                    on:{
                        onAfterContextMenu: function(id, e, node){

                            $$("gearList").select(id);
                        }
                    }




                }

            ]
        }
    },

    showAddGearDialog: function () {
        webix.ui(webix.copy(roomView.addGearDialog));
        connection.sendAjax("GET", "/gear-unit" ,
            function (text, data, xhr) {
                if (text ) {
                    $$("addGearList").clearAll();
                    var listAll=data.json();
                    var listAvailable=[];
                    for(var i=0;i<listAll.length;i++){
                        if(listAll[i].available===1){
                            listAvailable.push(listAll[i]);
                        }
                    }
                    $$("addGearList").parse(listAvailable);

                    $$("listNewGear_input").attachEvent("onTimedKeyPress",function(){
                        var value = this.getValue().toLowerCase();
                        $$("addGearList").filter(function(obj){
                            var text=obj.name+" "+obj.description;
                            return text.toLowerCase().indexOf(value)>-1;
                        })
                    });
                    $$("addGearDialog").show();
                } else {
                    util.messages.showErrorMessage("Greška pri učitavanju opreme.");
                }
            }, function (text, data, xhr) {
                util.messages.showErrorMessage("Greška pri učitavanju opreme.");

            }
            , null);
        webix.UIManager.setFocus("name");

    },

    addGearDialog: {
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
                id: "addGearDialog",
                width: 600,
                height:500,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 5
                },
                elements: [
                    {
                        rows: [
                            {
                                height: 38,
                                cols: [{
                                    view:"search",
                                    id:"listNewGear_input",
                                    name: "listNewGear_input",
                                }, {}, {
                                    id: "addNewGear",
                                    view: "button",
                                    type: "iconButton",
                                    click: "roomView.showAddNewGearDialog",
                                    icon: "plus-circle",
                                    label: "Dodajte novu opremu",
                                    width: 200,
                                }]
                            },
                            {
                                view: "list",
                                id: "addGearList",
                                width: 200,
                                type: {
                                    markCheckbox: function (obj) {
                                        return "<span class='check webix_icon fa-" + (obj.markCheckbox ? "check-" : "") + "square-o'></span>";
                                    }
                                },
                                onClick: {
                                    "check": function (e, id) {
                                        var item = this.getItem(id);
                                        item.markCheckbox = item.markCheckbox ? 0 : 1;
                                        this.updateItem(id, item);
                                    }
                                },
                                template: "#name# #description#  {common.markCheckbox()}",

                            }]
                    },
                    {
                        margin: 5,
                        cols: [{}, {
                            id: "saveGearButton",
                            view: "button",
                            value: "Dodajte opremu",
                            type: "form",
                            click: "roomView.saveGear",
                            hotkey: "enter",
                            width: 150
                        }]
                    }],
            }]
        }
    },

    saveGear: function () {
        //var form = $$("addGearForm");
        var gearIds = [];
        var names=[];
        var descriptions=[];

        $$("addGearList").data.each(function (obj) {
                if (obj.markCheckbox == 1) {
                    gearIds.push(obj.id);
                    names.push(obj.name);
                    descriptions.push(obj.description);
                }
            }
        );

        if(gearIds.length===0){
            util.messages.showErrorMessage("Niste označili opremu koju želite da dodate!");
        }else{

            connection.sendAjax("POST", "/room/addGearUnits/"+roomView.roomId,
                function (text, data, xhr) {
                    if (text==="Success" ) {
                        for(var i=0;i<gearIds.length;i++)
                        {
                            $$("gearList").add({
                                name: names[i],
                                description: descriptions[i]
                            });
                        }
                        util.messages.showMessage("Uspješno dodavanje opreme u salu.");
                    } else {
                        util.messages.showErrorMessage("Greška pri dodavanju opreme u salu.");
                    }
                }, function (text, data, xhr) {
                    util.messages.showErrorMessage("Greška pri dodavanju opreme u salu.");

                }
                , gearIds);
            util.dismissDialog('addGearDialog');
        }
    },

    showAddNewGearDialog: function () {
        webix.ui(webix.copy(roomView.addNewGearDialog)).show();
        webix.UIManager.setFocus("name");
    },

    addNewGearDialog: {
        view: "popup",
        id: "addNewGearDialog",
        modal: true,
        position: "center",
        body: {
            id: "addNewGearInside",
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
                    click: "util.dismissDialog('addNewGearDialog');"
                }]
            }, {
                view: "form",
                id: "addNewGearForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv opreme",
                    invalidMessage: "Unesite validan naziv opreme!",
                    required: true,
                    suggest: {
                        id: "gearSuggest",
                        url: "gear/getAllNames"
                    }

                },
                    {
                        id: "description",
                        name: "description",
                        view: "text",
                        label: "Opis",
                        required: false
                    }, {
                        margin: 5,
                        cols: [{}, {
                            id: "saveNewGearButton",
                            view: "button",
                            value: "Dodajte opremu",
                            type: "form",
                            click: "roomView.saveNewGear",
                            hotkey: "enter",
                            width: 150
                        }]
                    }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addNewGearForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "description": function (value) {
                        if (value.length > 500) {
                            $$('addNewGearForm').elements.email.config.invalidMessage = 'Maksimalan broj karaktera je 500';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    saveNewGear: function () {
        var form = $$("addNewGearForm");
        if (form.validate()) {
            var newItem = {
                name: $$("addNewGearForm").getValues().name,
                description: $$("addNewGearForm").getValues().description,
                available: 1,
                companyId: userData.companyId,
                gearId: null
            };

            connection.sendAjax("POST", "gear-unit/custom/",
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Oprema je uspješno kreirana.");
                        $$("addGearList").add(JSON.parse(text));
                        util.dismissDialog('addNewGearDialog');
                    } else
                        util.messages.showErrorMessage("Oprema nije kreirana.");
                }, function () {
                    util.messages.showErrorMessage("Oprema nije kreirana.");
                }, newItem);
        }
    },

    showGearDialog:function (roomId) {
        if (util.popupIsntAlreadyOpened("gearDialog")) {
            var dialog = webix.ui(webix.copy(this.gearDialog));
            roomView.roomId = roomId;
            this.gearDialog.roomId = roomId;
            var gearContext = webix.ui({
                view: "contextmenu",
                id: "gearContextMenu",
                width: 200,
                data: [{
                    id: "1",
                    value: "Obrišite",
                    icon: "trash"
                }
                ],

                on: {
                    onItemClick: function (id) {
                        var context = this.getContext();
                        switch (id) {
                            case "1":
                                var delBox = (webix.copy(commonViews.brisanjePotvrda("opreme", "opremu")));
                                console.log(context.id);
                                var newItem = $$("gearList").getItem(context.id);
                                delBox.callback = function (result) {
                                    if (result == 1) {
                                        console.log(roomId);
                                        console.log(newItem.id);
                                        connection.sendAjax("DELETE", "room-has-gear-unit/" + roomId + "/" + newItem.id,
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
            if (userData.roleId === 2) {
                $$("gearContextMenu").attachTo($$("gearList"));
            } else {
                $$("addGearBtn").hide();
            }
            $$("gearList").load("gear-unit/custom/byRoom/" + roomId).then(function (response) {
                if (response)
                    dialog.show();
                else
                    util.messages.showErrorMessage("Nemoguće učitati opremu iz sale!");
            }).fail(function (error) {
                util.messages.showErrorMessage("Nemoguće učitati opremu iz sale!");
            });
        }
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