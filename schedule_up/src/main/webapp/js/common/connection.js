/**
 *
 */
// common connection methods
var connection = {
    showSEM: true,

    reload: function () {
        setTimeout(function () {
            window.location.reload();
        }, 1500);

        throw "Session expired exception";
    },

    sendProxyAjax: function (callbackOk, callbackErr, params) {
        var promise = webix.promise.defer();

        var p = JSON.stringify(params);

        var c = {
            error: function (text, data, xhr) {
                if (xhr.status == 401) {
                    if (connection.showSEM) {
                        util.messages.showSessionExpiredError();
                        connection.showSEM = false;
                    }
                    connection.reload();
                }
                try {
                    callbackErr(text, data, xhr);
                } catch (ex) {
                }
                util.preloader.dec();
                promise.reject(false);
            },
            success: function (text, data, xhr) {
                try {
                    callbackOk(text, data, xhr);
                } catch (ex) {
                }
                util.preloader.dec();
                promise.resolve(true);
            }
        };

        var url = "/hub/proxy";
        util.preloader.inc();
        webix.ajax().headers({
            "Content-type": "application/json"
        }).post(url, p, c);

        return promise;
    },

    sendAjax: function (method, url, callbackOk, callbackErr, item) {
        var promise = webix.promise.defer();

        var p = JSON.stringify(item);

        var c = {
            error: function (text, data, xhr) {
                if (xhr.status == 401) {
                    if (connection.showSEM) {
                        util.messages.showSessionExpiredError();
                        connection.showSEM = false;
                    }
                    connection.reload();
                }
                try {
                    callbackErr(text, data, xhr);
                } catch (ex) {
                }
                util.preloader.dec();
                promise.reject(false);
            },
            success: function (text, data, xhr) {
                try {
                    callbackOk(text, data, xhr);
                } catch (ex) {
                }
                util.preloader.dec();
                promise.resolve(true);
            }

        };

        util.preloader.inc();
        switch (method) {
            case "GET":
                webix.ajax().headers({
                    "Content-type": "application/json"
                }).get(url, c);
                break;
            case "DELETE":
                webix.ajax().headers({
                    "Content-type": "application/json"
                }).del(url, c);
                break;
            case "POST":
                webix.ajax().headers({
                    "Content-type": "application/json"
                }).post(url, p, c);
                break;
            case "PUT":
                webix.ajax().headers({
                    "Content-type": "application/json"
                }).put(url, p, c);
                break;
        }
        return promise;
    },

    //attach triggers to datatables
    attachAjaxEvents: function (dtId, link, customInsert, preserveId, editValidationRules) {
        $$(dtId).attachEvent("onBeforeAdd", function (index, obj) {
            if (obj.isNew) {
                return true;
            }
            if (typeof preserveId === 'undefined' || preserveId !== true) {
                delete obj["id"];
            }
            var addLink = link;
            if (typeof customInsert !== 'undefined' && customInsert === true) {
                addLink = addLink + "/custom/";
            }
            util.preloader.inc();

            webix.ajax().headers({
                "Content-type": "application/json"
            }).post(addLink, JSON.stringify(obj), {
                error: function (text, data, xhr) {
                    if (xhr.status == 401) {
                        if (connection.showSEM) {
                            util.messages.showSessionExpiredError();
                            connection.showSEM = false;
                        }
                        connection.reload();
                    } else {
                        util.messages.showErrorMessage(text);
                    }
                    util.preloader.dec();
                },
                success: function (text, data, xhr) {
                    var retVal = data.json();
                    if (!retVal) {
                        util.messages.showErrorMessage("Greška prilikom dodavanja podataka!");
                        return false;
                    }

                    retVal.isNew = true;
                    if(dtId == "roomDT")
                        retVal.buildingName = obj.buildingName;// za azuriranje tabele
                    try {
                        $$(dtId).add(retVal);
                    } catch (ex) {
                    }
                    util.preloader.dec();
                }
            });

            return false;
        });

        $$(dtId).attachEvent("onBeforeEditStop", function (state, editor, ignore) {
                if (ignore) {
                    this.editCancel();
                    return;
                }

                var column = editor.column;
                var id = editor.row;

                var newValue = state.value;
                var oldValue = state.old;

                if (newValue == oldValue) return;
                var editLink = "";
                if (typeof customInsert !== 'undefined' && customInsert === true) {
                    editLink = link + "/custom/" + id;
                } else {
                    editLink = link + "/" + id;
                }
                var data = $$(dtId).getItem(id);
                data[column] = newValue;
                if(data.deleted==null) data.deleted=0;

                var commitEdit = function () {
                    util.preloader.inc();
                    webix.ajax().headers({
                        "Content-type": "application/json"
                    }).put(editLink, JSON.stringify(data), {
                        error: function (text, data, xhr) {
                            if (xhr.status == 401) {
                                if (connection.showSEM) {
                                    util.messages.showSessionExpiredError();
                                    connection.showSEM = false;
                                }
                                connection.reload();
                            } else {
                                util.messages.showErrorMessage(text);
                                data[column] = oldValue;
                                try {
                                    $$(dtId).updateItem(id, data);
                                } catch (ex) {
                                }
                            }
                            util.preloader.dec();
                        }, success: function (text, data) {
                            //if (!data.json()) {
                            if(text!="Success")
                            {  util.messages.showErrorMessage("Greška pri izmjeni podataka!");
                                data[column] = oldValue;
                                try {
                                    $$(dtId).updateItem(id, data);
                                } catch (ex) {
                                }
                            }

                            util.preloader.dec();
                        }
                    });
                };

                if (typeof editValidationRules !== 'undefined') {
                    for (var i = 0; i < editValidationRules.length; i++) {

                        if (editValidationRules[i].column == editor.column) {

                            if (editValidationRules[i].rule == "canChange") {

                                var url = editValidationRules[i].validateUrl.replace("{id}", id).replace("{value}", newValue);

                                var editError = function () {
                                    util.messages.showErrorMessage("Unesena vrednost već postoji!");
                                    data[column] = oldValue;
                                    $$(dtId).updateItem(id, data);
                                };


                                connection.sendAjax("GET", url,
                                    function (text, data, xhr) {
                                        if (text != "true") editError();
                                        else {
                                            commitEdit();
                                        }
                                    }, function () {
                                        editError();
                                    });

                                return true;

                            } else if (editValidationRules[i].rule == "isEmpty") {
                                if (/^\s*$/.test(state.value)) {
                                    state.value = state.old;
                                    data[column] = state.old;
                                    util.messages.showErrorMessage("Polje je obavezno za unos.")
                                }
                            }
                            else if (editValidationRules[i].rule == "isValidMac") {
                                if (!util.validation.checkMacAddress(state.value)) {
                                    state.value = state.old;
                                    data[column] = state.old;
                                    util.messages.showErrorMessage("Unesite validnu MAC adresu za uređaj.")
                                }
                            }
                            else if (editValidationRules[i].rule == "isValidNumber") {
                                if (!util.validation.checkPhoneNumber(state.value)) {
                                    state.value = state.old;
                                    data[column] = state.old;
                                    util.messages.showErrorMessage("Unesite validan broj telefona.")
                                }
                            }
                            else if(editValidationRules[i].rule == "checkLength") {
                                var length;
                                if(editor.column == "name")
                                    length = 100;
                                else if(editor.column == "description")
                                    length = 500;
                                if(!util.validation.checkLength(state.value, length)) {
                                    state.value = state.old;
                                    data[column] = state.old;
                                    util.messages.showErrorMessage("Maksimalan broj karaktera je " + length + "!");
                                }
                            }
                            else if(editValidationRules[i].rule == "isInteger") {
                                if(!util.validation.isInteger(state.value)) {
                                    state.value = state.old;
                                    data[column] = state.old;
                                    util.messages.showErrorMessage("Broj spratova mora biti cijeli broj!")
                                }
                            }
                            else if(editValidationRules[i].rule == "isPositiveInteger") {
                                if(!util.validation.isInteger(state.value) || state.value < 1) {
                                    state.value = state.old;
                                    data[column] = state.old;
                                    util.messages.showErrorMessage("Kapacitet sale mora biti pozitivan cijeli broj!");
                                }
                            }

                            else if (util.validation.validateUponEdit(editor, editValidationRules[i].rule)) break;
                            else {
                                setTimeout(function () {
                                    data[column] = oldValue;
                                    $$(dtId).updateItem(id, data);
                                }, 0);
                                return true;
                            }
                        }
                    }
                }

                commitEdit();
                return true;
            }
        );

        $$(dtId).attachEvent("onBeforeDelete", function (id) {

            var forDelete = webix.storage.local.get("for_delete");

            if (forDelete.indexOf(id) > -1) {

                var index = forDelete.indexOf(id);
                if (index > -1) {
                    forDelete.splice(index, 1);
                }
                webix.storage.local.put("for_delete", forDelete);

                return true;
            }

            forDelete.push(id);
            webix.storage.local.put("for_delete", forDelete);

            var deleteLink = link + "/" + id;

            util.preloader.inc();
            webix.ajax().headers({
                "Content-type": "application/json"
            }).del(deleteLink, {
                error: function (text, data, xhr) {
                    if (xhr.status == 401) {
                        if (connection.showSEM) {
                            util.messages.showSessionExpiredError();
                            connection.showSEM = false;
                        }
                        connection.reload();
                    } else {
                        util.messages.showErrorMessage("Greška pri brisanju podataka");
                        var forDelete = webix.storage.local.get("for_delete");
                        var index = forDelete.indexOf(id);
                        if (index > -1) {
                            forDelete.splice(index, 1);
                        }
                        webix.storage.local.put("for_delete", forDelete);
                    }
                    util.preloader.dec();
                },
                success: function (text, data, xhr) {
                    try {
                        $$(dtId).remove(id);
                    } catch (ex) {
                    }
                    util.preloader.dec();
                }
            });

            return false;

        });
    },

    fetchPaginationSettings: function (viewId, name) {
        util.preloader.inc();

        webix.ajax().get("hub/admin/settings/byViewId/" + name, {
            error: function (text, data, xhr) {
                if (xhr.status == 401) {
                    if (connection.showSEM) {
                        util.messages.showSessionExpiredError();
                        connection.showSEM = false;
                    }
                    connection.reload();
                } else {
                    util.messages.showErrorMessage("Nije moguće prikupiti podešavanja.");
                }
                util.preloader.dec();
            },
            success: function (text, data, xhr) {
                var data = data.json();
                if (data.length > 0) {
                    try {
                        if (!viewId.settings)
                            viewId.settings = {};
                        for (i = 0; i < data.length; i++) {
                            viewId.settings[data[i].key] = data[i].value;
                        }
                    } catch (ex) {
                    }
                } else {
                    util.messages.showErrorMessage("Nije moguće parsirati podešavanja.");
                }
                applySettings(viewId, true);
                util.preloader.dec();
            }
        });
    },

    fetchOneSetting: function (viewId, name) {
        util.preloader.inc();
        var promise = webix.promise.defer();

        webix.ajax().get("hub/settings/" + name, {
            error: function (text, data, xhr) {
                if (xhr.status == 401) {
                    if (connection.showSEM) {
                        util.messages.showSessionExpiredError();
                        connection.showSEM = false;
                    }
                    connection.reload();
                } else {
                    util.messages.showErrorMessage("Nije moguće prikupiti podešavanje: " + name);
                }
                util.preloader.dec();
                promise.reject(false);
            },
            success: function (text, data, xhr) {
                var data = data.json();
                if (util.isset(data.key)) {
                    try {
                        var settings = viewId.settings;
                        settings[data.key] = data.value;
                    } catch (ex) {
                    }
                    promise.resolve(true);
                } else {
                    util.messages.showErrorMessage("Nije moguće parsirati podešavanje: " + name);
                    promise.resolve(false);
                }
                util.preloader.dec();
            }
        });

        return promise;
    }
};

//webix connection methods
webix.proxy.hub = {
    $proxy: true,
    load: function (view, callback, url) {
        util.preloader.inc();
        webix.ajax(this.source, callback, view).then(function () {
            util.preloader.dec();
        }).fail(function (err) {
            if (err.status == 401) {
                if (connection.showSEM) {
                    util.messages.showSessionExpiredError();
                    connection.showSEM = false;
                }
                connection.reload();
            }
            util.messages.showErrorMessage("Nije moguće prikupiti podatke sa servera.");
            util.preloader.dec();
        });

    }
};