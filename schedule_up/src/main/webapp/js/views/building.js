var countries = [];
var tabledata = [];
var tablecentar = [];
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
            }, {}, {
                id: "addBuildingBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte zgradu",
                click: "buildingView.showAddDialog",
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
                fillspace: true,
                editor: "text",
                sort: "string",
                editable:true,
                tooltip:false,
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
                editable: true,


                header: [
                    "Opis", {
                        content: "textFilter"
                    }
                ]
            },
                {
                    tooltip:false,
                    id: "address",
                    fillspace: true,

                    editable:false,
                    sort: "text",
                    header: [
                        "Adresa", {
                            content: "textFilter"
                        }
                    ]
                }, {
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
                }
            ],
            select: "row",
            navigation: true,
            editable: true,
            tooltip:true,
            editaction: "dblclick",
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
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    name: "id",
                    view: "text",
                    hidden: true

                }, {
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv:",
                    invalidMessage: "Unesite naziv zgrade!",
                    required: true
                }, {
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis:",
                    required: false
                },
                    {
                        view: "label",
                        label: "Unesite lokaciju zgrade: ",
                        inputWidth: 100,
                    },
                    {
                        view: "select", options: countries, label: "Drzava:", value: countries[0], id: "combo"

                    },
                    {
                        view: "text",
                        id: "grad",
                        name: "grad",
                        label: "Grad:",
                        invalidMessage: "Unesite naziv grada!",
                        required: true
                    },
                    {
                        view: "text",
                        id: "adresa",
                        name: "adresa",
                        label: "Adresa:",
                        invalidMessage: "Unesite adresu zgrade!",
                        required: true
                    },
                    {
                        margin: 5,
                        cols: [{
                            id: "showMap",
                            view: "button",
                            value: "Detaljna lokacija",
                            click: "buildingView.showMap",
                            width: 150
                        }, {}, {
                            id: "saveBuilding",
                            view: "button",
                            value: "Dodajte zgradu",
                            type: "form",
                            click: "buildingView.saveChanges",
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
                    "description": function (value) {
                        if (value.length > 500) {
                            $$('addBuildingForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }

                        return true;
                    }

                }
            }]
        }
    },
    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "buildingPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        this.preloadDependencies();
        connection.attachAjaxEvents("buildingDT", "building");
        $$("buildingDT").detachEvent("onBeforeDelete");
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
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("zgrade", "zgradu")));
                            var newItem = $$("buildingDT").getItem(context.id.row);
                            delBox.callback = function (result) {
                                if (result == 1) {
                                    connection.sendAjax("DELETE", "building/" + newItem.id,
                                        function (text, data, xhr) {
                                            if (text) {
                                                util.messages.showMessage("Zgrada uspješno uklonjena.");
                                                $$("buildingDT").remove(context.id.row);
                                            } else
                                                util.messages.showErrorMessage("Neuspješno uklanjanje zgrade.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješno uklanjanje zgrade.");
                                        }, null);
                                }
                            };
                            webix.confirm(delBox);
                            break;
                        case "3":
                            buildingView.showMapDetailsDialog($$("buildingDT").getItem(context.id.row));
                            break;
                    }
                }
            }
        });

    },
    showMapDetailsDialog: function (building) {
        tablecentar[0] = building.latitude;
        tablecentar[1] = building.longitude;
        var mapaObjekat = {
            id: 1, lat: tablecentar[0], lng: tablecentar[1]
        };
        tabledata[0] = mapaObjekat;
        webix.ui(webix.copy(buildingView.showMapDialog));
        $$("mapLabel").data.label = "<span class='webix_icon fa fa-map-marker '></span> Lokacija zgrade";
        $$("saveMap").data.hidden = true;
        $$("showMapDialog").show();
    },
    showChangeBuildingDialog: function (building) {
        var url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+building.latitude+","+building.longitude+"+&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg&language=hr";
        fetch(url).then(function(result) {
            if(result.ok) {
                return result.json();
            }
            throw new Error('Neuspješno dobavljanje tačne lokacije.');
        }).then(function(json) {
            var place=json['results'][0];
            if(place!=null) {
                var filtered_array2 = place.address_components.filter(function (address_component) {
                    return address_component.types.includes("locality");
                });

                var city = filtered_array2.length ? filtered_array2[0].long_name : "";
            }else city="";
            form.elements.grad.setValue(city);

        }).catch(function(error) {
            util.messages.showErrorMessage("Neuspješno dobavljanje grada.")
        });

        webix.ui(webix.copy(buildingView.changeBuildingDialog));
        var form = $$("changeBuildingForm");
        console.log("Buidling id:" + building.id);
        console.log(form.elements.id);
        form.elements.id.setValue(building.id);
        form.elements.name.setValue(building.name);
        form.elements.description.setValue(building.description);

        form.elements.adresa.setValue(building.address);
        var url = "https://restcountries.eu/rest/v2/all";
        fetch(url).then(function (result) {
            return result.json();
        }).then(function (json) {
            for (var i = 0; i < json.length; i++) {
                var countryName = json[i].name;
                var countryCode = json[i].alpha2Code;
                countries[i] = (countryName + " : " + countryCode);
            }
            setTimeout(function () {
                $$("changeBuildingDialog").show();
                webix.UIManager.setFocus("name");
            }, 0);
        });

    },

    saveChangedBuilding: function () {
        if ($$("changeBuildingForm").validate()) {

            if (form.validate()) {
                if (lat == null && lng == null) {
                    var adresa = $$("adresa").getValue();
                    var res = adresa.replace(/ /g, "+");
                    var drzava = $$("combo").getValue().split(" : ")[0];
                    drzava = drzava.replace(/ /g, "+");
                    var grad = $$("grad").getValue();
                    grad = grad.replace(/ /g, "+");
                    var query = res + "+" + grad + "+" + drzava;
                    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg";
                    fetch(url).then(function (result) {
                        return result.json();
                    }).then(function (json) {
                        lat = json['results'][0]['geometry']['location']['lat'];
                        lng = json['results'][0]['geometry']['location']['lng'];
                        var newItem = {
                            name: $$("addBuildingForm").getValues().name,
                            description: $$("addBuildingForm").getValues().description,
                            address: $$("addBuildingForm").getValues().adresa,
                            latitude: lat,
                            longitude: lng,
                            companyId: companyData.id

                        };
                        $$("buildingDT").add(newItem);
                        util.dismissDialog('addBuildingDialog');
                    });

                } else {
                    var newItem = {
                        name: $$("addBuildingForm").getValues().name,
                        description: $$("addBuildingForm").getValues().description,
                        address: $$("addBuildingForm").getValues().adresa,
                        latitude: lat,
                        longitude: lng,
                        companyId: companyData.id

                    };

                    connection.sendAjax("PUT", "building/" + newItem.id,
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
                }, {
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis:",
                    required: false
                },
                    { view:"fieldset", label:"Odaberite lokaciju", body:{
                            rows:[
                                {
                                    view: "select", options: countries, label: "Država:", id: "combo"

                                },
                                {
                                    view: "text",
                                    id: "grad",
                                    name: "grad",
                                    label: "Grad:",
                                    invalidMessage: "Unesite naziv grada!",
                                    required: true
                                },
                                {
                                    view: "text",
                                    id: "adresa",
                                    name: "adresa",
                                    label: "Adresa:",
                                    invalidMessage: "Unesite adresu zgrade!",
                                    required: true
                                }]}},
                    {
                        margin: 5,
                        cols: [{
                            id: "showMap",
                            view: "button",
                            value: "Detaljna lokacija",
                            click: "buildingView.showMap",
                            width: 150
                        }, {}, {
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
                    "description": function (value) {
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
    showMapDialog: {
        view: "popup",
        id: "showMapDialog",
        modal: true,
        position: "center",
        body: {
            id: "showMapDialogInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    id: "mapLabel",
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
                key: "AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg",
                view: "google-map",
                id: "map",
                zoom: 15,
                width: 600,
                height: 500,
                center: tablecentar,
                data: tabledata

            }, {
                margin: 5,
                cols: [{}, {
                    id: "saveMap",
                    view: "button",
                    value: "Sačuvajte lokaciju",
                    click: "buildingView.saveLocation",
                    hotkey: "enter",
                    width: 150
                }]
            }]
        }
    },
    saveLocation:function(){
        var url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"+&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg&language=hr";
        fetch(url).then(function(result) {
            if(result.ok) {
                return result.json();
            }
            throw new Error('Neuspješno dobavljanje tačne lokacije.');
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
            var broj2 = filtered_array4.length ? filtered_array4[0].short_name: "";
            if(broj!=null){
                $$("adresa").setValue(adresa+" "+broj);

            }else if(broj2!=null){
                $$("adresa").setValue(adresa+" "+broj2);

            }else{
                $$("adresa").setValue(adresa);

            }
            $$("combo").setValue(country_long + " : " + country_short);
            $$("grad").setValue(city);
            

            util.dismissDialog('showMapDialog');

        }).catch(function(error) {
            util.messages.showErrorMessage("Neuspješno dobavljanje detaljne lokacije.")
        });
    },
    showAddDialog: function () {


        webix.ui(webix.copy(buildingView.addDialog)).show();
        webix.UIManager.setFocus("name");
        $$("combo").setValue("Bosna i Hercegovina : BA");

    },

    showMap:function(){
        var adresa=$$("adresa").getValue();
        var res = adresa.replace(/ /g, "+");
        var drzava=$$("combo").getValue().split(" : ")[0];
        drzava=drzava.replace(/ /g, "+");
        var grad=$$("grad").getValue();
        grad=grad.replace(/ /g, "+");
        var query=res+"+"+grad+"+"+drzava;
        var url="https://maps.googleapis.com/maps/api/geocode/json?address="+query+"&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg&language=hr";
        fetch(url).then(function(result) {
            if(result.ok) {
                return result.json();
            }
            throw new Error('Neuspješno dobavljanje tačne lokacije.');
        }).then(function(json) {
            tablecentar[0]=json['results'][0]['geometry']['location']['lat'];
            tablecentar[1]=json['results'][0]['geometry']['location']['lng'];
            var mapaObjekat={
                id:1, draggable:true,lat:json['results'][0]['geometry']['location']['lat'],  lng:json['results'][0]['geometry']['location']['lng'],   label:"A", draggable:true
            };
            lat=json['results'][0]['geometry']['location']['lat'];
            lng=json['results'][0]['geometry']['location']['lng'];
            entered=true;
            tabledata[0]=mapaObjekat;
            webix.ui(webix.copy(buildingView.showMapDialog)).show();
            $$("map").attachEvent("onAfterDrop", function(id, item){
                lat=item.lat;
                lng=item.lng;
                var url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"+&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg&language=hr";
                fetch(url).then(function(result) {
                    if(result.ok) {
                        return result.json();
                    }
                    throw new Error('Neuspješno dobavljanje tačne lokacije.');
                }).then(function(json) {
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
                    var marker= $$("map").getItem(id).$marker;
                    if(marker.infowindow!=null) marker.infowindow.close();
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


            });
        }).catch(function(error) {
            util.messages.showErrorMessage("Nije moguće prikazati mapu.")
        });

    },
    saveChanges: function () {
        var form = $$("changeBuildingForm");
        if (form.validate()) {

            // form.elements.validBuildingName.setValue(1);

            if (form.validate()) {
                if (lat == null && lng == null) {
                    var adresa = $$("adresa").getValue();
                    var res = adresa.replace(/ /g, "+");
                    var drzava = $$("combo").getValue().split(" : ")[0];
                    drzava = drzava.replace(/ /g, "+");
                    var grad = $$("grad").getValue();
                    grad = grad.replace(/ /g, "+");
                    var query = res + "+" + grad + "+" + drzava;
                    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg";
                    fetch(url).then(function (result) {
                        return result.json();
                    }).then(function (json) {
                        lat = json['results'][0]['geometry']['location']['lat'];
                        lng = json['results'][0]['geometry']['location']['lng'];
                        var newItem = {
                            id: $$("changeBuildingForm").getValues().id,
                            name: $$("changeBuildingForm").getValues().name,
                            description: $$("changeBuildingForm").getValues().description,
                            address: $$("changeBuildingForm").getValues().adresa,
                            latitude: lat,
                            longitude: lng,
                            companyId: companyData.id,
                            deleted: 0

                        };


                    });

                } else {
                    var newItem = {
                        id: $$("changeBuildingForm").getValues().id,
                        name: $$("changeBuildingForm").getValues().name,
                        description: $$("changeBuildingForm").getValues().description,
                        address: $$("changeBuildingForm").getValues().adresa,
                        latitude: lat,
                        longitude: lng,
                        companyId: companyData.id,
                        deleted: 0

                    };
                    console.log(newItem);
                    connection.sendAjax("PUT", "building/" + newItem.id,
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
        }
    },
    save: function () {
        var form = $$("addBuildingForm");
        if (form.validate()) {

            // form.elements.validBuildingName.setValue(1);

            if (form.validate()) {
                if((lat==null && lng==null) || entered){
                    entered=true;
                    var adresa=$$("adresa").getValue();
                    var res = adresa.replace(/ /g, "+");
                    var drzava=$$("combo").getValue().split(" : ")[0];
                    drzava=drzava.replace(/ /g, "+");
                    var grad=$$("grad").getValue();
                    grad=grad.replace(/ /g, "+");
                    var query=res+"+"+grad+"+"+drzava;
                    var url="https://maps.googleapis.com/maps/api/geocode/json?address="+query+"&key=AIzaSyBExEHqJmRKJoRhWOT6Ok3fLR5QMGIZ_eg&language=hr";
                    fetch(url).then(function(result) {
                        if(result.ok) {
                            return result.json();
                        }
                        throw new Error('Neuspješno dobavljanje tačne lokacije.');
                    }).then(function(json) {
                        lat=json['results'][0]['geometry']['location']['lat'];
                        lng=json['results'][0]['geometry']['location']['lng'];
                        var newItem = {
                            name: $$("addBuildingForm").getValues().name,
                            description: $$("addBuildingForm").getValues().description,
                            address: $$("addBuildingForm").getValues().adresa,
                            latitude:lat,
                            longitude:lng,
                            companyId: companyData.id

                        };
                        $$("buildingDT").add(newItem);
                        util.messages.showMessage("Uspješno dodavanje nove zgrade.");
                        util.dismissDialog('addBuildingDialog');
                    }).catch(function(error) {
                        util.messages.showErrorMessage("Neuspješno dobavljanje tačne lokacije.")

                    });

                }else{
                    var newItem = {
                        name: $$("addBuildingForm").getValues().name,
                        description: $$("addBuildingForm").getValues().description,
                        address: $$("addBuildingForm").getValues().adresa,
                        latitude:lat,
                        longitude:lng,
                        companyId: companyData.id

                    };
                    $$("buildingDT").add(newItem);
                    util.messages.showMessage("Uspješno dodavanje nove zgrade.");
                    util.dismissDialog('addBuildingDialog');}
            }
        }
    },
    preloadDependencies: function () {

        var url="https://restcountries.eu/rest/v2/all";
        fetch(url).then(function(result) {
            if(result.ok) {
                return result.json();
            }
            throw new Error('Neuspješno učitavanje podataka o državama.');
        }).then(function(json) {

            for(var i=0;i<json.length;i++){
                var countryName=json[i]['translations']['hr'];
                var countryCode=json[i].alpha2Code;
                countries[i]=countryName+" : "+countryCode;
            }
        }).catch(function(error) {
            util.messages.showErrorMessage("Nije moguće prikupiti podatke o državama.")
        });
    }


};
