var countries=[];
var tabledata=[];
var tablecentar=[];
var lat;
var lng;
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
                click:"buildingView.showAddDialog",
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
            },
                {
                    id: "address",
                    fillspace: true,
                    editor: "text",
                    sort: "text",
                    header: [
                        "Adresa", {
                            content: "textFilter"
                        }
                    ]
                },{
                    id: "latitude",
                    hidden: true,
                    fillspace: true,
                    editor: "text",
                    sort: "string",
                    header: [
                        "latitude", {
                            content: "textFilter"
                        }
                    ]
                }, {
                    id: "longitude",
                    hidden: true,
                    fillspace: true,
                    editor: "text",
                    sort: "string",
                    header: [
                        "longitude", {
                            content: "textFilter"
                        }
                    ]
                },
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
        connection.attachAjaxEvents("buildingDT", "building");

        webix.ui({
            view: "contextmenu",
            id: "buildingContextMenu",
            width: 200,
            data: [{
                id: "3",
                value: "Prikažite na mapi",
                icon: "map-marker"
            },

                {
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
                        case "3":
                           webix.ui(webix.copy(buildingView.showMapDialog));
                            $$("mapLabel").data.label="<span class='webix_icon fa fa-map-marker '></span> Lokacija zgrade";
                            $$("saveMap").data.hidden=true;
                            $$("showMapDialog").show();
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
    ,
    addDialog: {
        view: "popup",
        id: "addBuildingDialog",
        modal: true,
        position: "center",
        body: {
            id: "addBuildingInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa fa-building'></span> Dodavanje zgrade",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addBuildingDialog');"
                }]
            }, {
                view: "form",
                id: "addBuildingForm",
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
                    invalidMessage: "Unesite naziv zgrade!",
                    required: true
                },{
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis:",
                    required: false
                },
                    {view:"label",
                        label: "Unesite lokaciju zgrade: ",
                        inputWidth:100,
                    },
                    { view:"select", options:countries, label:"Drzava:",value:countries[0],id:"combo"

                    },
                    {view: "text",
                        id: "grad",
                        name: "grad",
                        label: "Grad:",
                        invalidMessage: "Unesite naziv grada!",
                        required: true
                    },
                    {view: "text",
                        id: "adresa",
                        name: "adresa",
                        label: "Adresa:",
                        invalidMessage: "Unesite adresu zgrade!",
                        required: true
                    },
                    {
                        margin: 5,
                        cols: [{ id: "showMap",
                            view: "button",
                            value: "Detaljna lokacija",
                            click: "buildingView.showMap",
                            width: 150
                        },{}, {
                            id: "saveBuilding",
                            view: "button",
                            value: "Dodajte zgradu",
                            type: "form",
                            click: "buildingView.save",
                            hotkey: "enter",
                            width: 150
                        }]
                    }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addBuildingForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "description":function (value) {
                        if (value.length > 500) {
                            $$('addBuildingForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }

                        return true;
                    }

                }
            }]
        }
    }
    ,
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
                    label: "<span class='webix_icon fa fa-map-marker '></span> Odaberite lokaciju",
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
                center:tablecentar,
                data:tabledata

            },{
                margin: 5,
                cols: [{}, {
                    id: "saveMap",
                    view: "button",
                    value: "Sacuvajte lokaciju",
                    click: "buildingView.saveLocation",
                    hotkey: "enter",
                    width: 150
                }]
            }]
        }
    },
    saveLocation:function(){
        var url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"+&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg";
        fetch(url).then(function(result) {
            return result.json();
        }).then(function(json) {
            var place=json['results'][0];
            var filtered_array = place.address_components.filter(function(address_component){
                return address_component.types.includes("country");
            });
            var country_long = filtered_array.length ? filtered_array[0].long_name: "";
            var country_short = filtered_array.length ? filtered_array[0].short_name: "";

            var filtered_array2 = place.address_components.filter(function(address_component){
                return address_component.types.includes("locality");
            });
            var city = filtered_array2.length ? filtered_array2[0].long_name: "";
            var filtered_array3 = place.address_components.filter(function(address_component){
                return address_component.types.includes("route");
            });
            var adresa = filtered_array3.length ? filtered_array3[0].long_name: "";
            var filtered_array4 = place.address_components.filter(function(address_component){
                return address_component.types.includes("street_number");
            });

            var broj = filtered_array4.length ? filtered_array4[0].long_name: "";
            $$("adresa").setValue(adresa+" "+broj);
            $$("combo").setValue(country_long+" : "+country_short);
            $$("grad").setValue(city);
            util.dismissDialog('showMapDialog');

        });
    },
    showAddDialog: function () {
        var url="https://restcountries.eu/rest/v2/all";
        fetch(url).then(function(result) {
            return result.json();
        }).then(function(json) {
            for(var i=0;i<json.length;i++){
                var countryName=json[i].name;
                var countryCode=json[i].alpha2Code;
                countries[i]=(countryName+" : "+countryCode);
            }

            webix.ui(webix.copy(buildingView.addDialog)).show();
            webix.UIManager.setFocus("name");
        });


    },
    showMap:function(){
        var adresa=$$("adresa").getValue();
        var res = adresa.replace(/ /g, "+");
        var drzava=$$("combo").getValue().split(" : ")[0];
        drzava=drzava.replace(/ /g, "+");
        var grad=$$("grad").getValue();
        grad=grad.replace(/ /g, "+");
        var query=res+"+"+grad+"+"+drzava;
        var url="https://maps.googleapis.com/maps/api/geocode/json?address="+query+"&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg";
        fetch(url).then(function(result) {
            return result.json();
        }).then(function(json) {
            tablecentar[0]=json['results'][0]['geometry']['location']['lat'];
            tablecentar[1]=json['results'][0]['geometry']['location']['lng'];
            var mapaObjekat={
                id:1, draggable:true,lat:json['results'][0]['geometry']['location']['lat'],  lng:json['results'][0]['geometry']['location']['lng'],   label:"A", draggable:true
            }
            tabledata[0]=mapaObjekat;
            webix.ui(webix.copy(buildingView.showMapDialog)).show();
            $$("map").attachEvent("onAfterDrop", function(id, item){
                lat=item.lat;
                lng=item.lng;
            });

        });

    },
    save: function () {
        var form = $$("addBuildingForm");
        if (form.validate()) {

            // form.elements.validBuildingName.setValue(1);

            if (form.validate()) {
                if(lat==null && lng==null){
                    var adresa=$$("adresa").getValue();
                    var res = adresa.replace(/ /g, "+");
                    var drzava=$$("combo").getValue().split(" : ")[0];
                    drzava=drzava.replace(/ /g, "+");
                    var grad=$$("grad").getValue();
                    grad=grad.replace(/ /g, "+");
                    var query=res+"+"+grad+"+"+drzava;
                    var url="https://maps.googleapis.com/maps/api/geocode/json?address="+query+"&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg";
                    fetch(url).then(function(result) {
                        return result.json();
                    }).then(function(json) {
                        lat=json['results'][0]['geometry']['location']['lat'];
                        lng=json['results'][0]['geometry']['location']['lng'];
                        var newItem = {
                            name: $$("addBuildingForm").getValues().name,
                            description: $$("addBuildingForm").getValues().description,
                            address: $$("addBuildingForm").getValues().adresa,
                            latitude:lat,
                            longitude:lng,
                            companyId: 1

                        };
                        $$("buildingDT").add(newItem);
                        util.dismissDialog('addBuildingDialog');
                    });

                }else{
                    var newItem = {
                        name: $$("addBuildingForm").getValues().name,
                        description: $$("addBuildingForm").getValues().description,
                        address: $$("addBuildingForm").getValues().adresa,
                        latitude:lat,
                        longitude:lng,
                        companyId: 1

                    };
                    $$("buildingDT").add(newItem);
                    util.dismissDialog('addBuildingDialog');}
            }
        }
    }

};
