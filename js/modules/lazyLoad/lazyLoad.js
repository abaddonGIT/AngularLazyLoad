/**
 * Created by netBeans.
 * User: abaddon
 * Date: 29.02.14
 * Time: 13:10
 * Description: Подгрузка модулей по требованию, через директиву
 */
(function () {
    var lazyLoad = angular.module("lazyLoad", []),
    req = null,
            regModules = []; //Уже зарегистрированные модули
    if (typeof require !== 'undefined') {
        req = require;
    }

    //Кэш для подгружаемых шаблонов
    lazyLoad.factory("cacheMod", function ($cacheFactory) {
        return $cacheFactory('cacheMod', {
            capacity: "15"
        });
    });

    lazyLoad.provider("$lazyLoad", ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        var modules = {}, mainApp = this.mainApp = null, loadFlag = false, myInjector = null,
            providers = {
                $controllerProvider: $controllerProvider,
                $compileProvider: $compileProvider,
                $filterProvider: $filterProvider,
                $provide: $provide
            };
        /*
        * Регистрация подгруженых модулей в angular
        * @param {type} $injector
        * @param {type} modName
        * @returns {undefined}
        */
        var registerModules = function (modules, afterRegister) {
            var modLn = modules.length;
            console.log(modules);
            for (var j = 0; j < modLn; j++) {
                var loc = modules[j], runBlocks = [], moduleFn, invokeQueue, ln = 0;
                moduleFn = angular.module(loc);
                runBlocks = runBlocks.concat(moduleFn._runBlocks);
                invokeQueue = moduleFn._invokeQueue;
                ln = invokeQueue.length;

                try {
                    regModules.push(loc);
                    for (var i = 0; i < ln; i++) {
                        var invokeArgs = invokeQueue[i], provider = null;

                        if (providers.hasOwnProperty(invokeArgs[0])) {
                            provider = providers[invokeArgs[0]];
                        } else {
                            throw ("Не могу найти провайдер для регистрации");
                        }
                        //проводим регистрацию компонентов нашего модуля в каждом из провайдеров
                        provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
                    }
                    angular.forEach(runBlocks, function (fn) {
                        myInjector.invoke(fn);
                    });
                } catch (e) {
                    if (e.message) {
                        e.message += ' from ' + moduleName;
                    }
                    throw e;
                }
            }
            afterRegister();
        };
        /*
        * Проверка присутствия элемента в массиве
        */
        var inArray = function (array, val) {
            var ln = array.length;
            while (ln--) {
                var loc = array[ln];

                if (loc === val) {
                    return true;
                }
            }
        };
        /*
        * Возвращает именя модулей, которые еще не были подгружены
        * @param {Object} module
        * @returns Array
        */
        var getRequires = function (module) {
            var reqs = module.requires, ln = reqs.length, result = [];
            for (var i = 0; i < ln; i++) {
                var loc = reqs[i];
                if (!inArray(regModules, loc)) {
                    result.push(modules[loc]);
                }
            }
            return result;
        };

        var LoadInstance = function () {
            if (!(this instanceof LoadInstance)) {
                return new LoadInstance();
            }
            //массив загруженных модулей
            this.loadModules = [];
        };
        /*
        * Подгрузка модуля
        * @returns {undefined}
        */
        LoadInstance.prototype.loadModule = function (module, afterModuleLoad) {
            var url = module.file, moduleName = module.name, inst = this;
            //Подгружаем сам модуль, пока без зависимостей
            if (!inArray(regModules, moduleName)) {
                req([url], function () {
                    //Регистрирует подгруженный модуль
                    inst.loadModules.push(moduleName);
                    //Подгружаем зависимости если они есть
                    inst.loadDeps(moduleName, function () {
                        //регистрируем подгруженные модули
                        registerModules(inst.loadModules, function () {
                            afterModuleLoad();
                        });
                    });
                });
            } else {
                afterModuleLoad();
            }
        };
        /*
        * Подгрузка зависимостей для модуля
        * @param {type} module
        * @param {type} afterDepsLoad
        * @returns {undefined}
        */
        LoadInstance.prototype.loadDeps = function (moduleName, afterDepsLoad) {
            var moduleFn = angular.module(moduleName),
                        requires = getRequires(moduleFn),
                        ln = requires.length, urls = [],
                        inst = this;

            var _load = function (dep, i) {
                if (i === undefined) {
                    i = 0;
                }

                if (i < ln) {
                    var mod = requires[i];
                    if (mod) {
                        req([mod.file], function () {
                            //ставим что модуль загружен
                            inst.loadModules.push(mod.name);
                            i++;
                            _load(mod.name, i);
                        });
                    }
                } else {
                    afterDepsLoad();
                }
            };

            if (ln) {
                _load(requires);
            } else {
                afterDepsLoad();
            }
        };

        this.$get = ['$document', '$injector', '$interval', 'cacheMod', function ($document, $injector, $interval, cacheMod) {
            return {
                loadScript: function (module, afterLoad) {
                    if (req) {
                        //Подгружаем модуль
                        var loadProcess = $interval(function () {
                            if (!loadFlag) {
                                myInjector = $injector;
                                var inst = LoadInstance();
                                inst.loadModule(module, function () {
                                    $interval.cancel(loadProcess);
                                    loadFlag = false;
                                    afterLoad();
                                });
                                loadFlag = true;
                            }
                        }, 100);
                    } else {
                        throw ("Для работы необходимо подключить RequireJS!");
                    }
                },
                getModuleConfig: function (moduleName) {
                    var mod = modules[moduleName];
                    if (mod) {
                        return mod;
                    } else {
                        return null;
                    }
                },
                locRequire: function (url, afterLoad) {
                    console.log("без req");
                    var cache = cacheMod.get(url[0]);
                    if (!cache) {
                        var script = $document[0].createElement('script');
                        script.src = url[0];
                        if (script.readyState) {
                            script.onreadystatechange = function () {
                                if (script.readyState === 'complete' || script.readyState === 'loaded') {
                                    script.onreadystatechange = null;
                                    afterLoad();
                                }
                            };
                        } else {
                            script.onload = function () { afterLoad(); };
                        }
                        script.onerror = function () {
                            throw ('Не могу загрузить скрипт ' + url[0]);
                        }
                        $document[0].documentElement.appendChild(script);
                        cacheMod.put(url[0], url[0]);
                    } else {
                        afterLoad();
                    }
                }
            };
        } ];
        //Настройка модулей, которые необходимо подключить
        this.config = function (config, mainApp) {
            var mainModule = angular.module(mainApp);
            //Модули которые уже подгружены в системе
            angular.forEach(mainModule.requires, function (loadMod) {
                regModules.push(loadMod);
            });
            if (angular.isArray(config)) {
                angular.forEach(config, function (modConfig) {
                    modules[modConfig.name] = modConfig;
                });
            } else {
                modules[modConfig.name] = modConfig;
            }
        };
    } ]);

    lazyLoad.directive("lazyLoad", function ($lazyLoad, $http, $compile, cacheMod) {
        return {
            link: function (scope, elm, attr) {
                //console.log("дир");
                //Получаем имя модуля, который необходимо подгрузить
                var moduleName = attr.lazyLoad;
                if (!req) {
                    req = $lazyLoad.locRequire;
                }
                if (moduleName) {
                    //Подгружаем скрип с модулем
                    var modConfig = $lazyLoad.getModuleConfig(moduleName);
                    if (modConfig) {
                        $lazyLoad.loadScript(modConfig, function () {
                            //проверяем указан ли шаблон для модуля
                            if (modConfig.template) {
                                var temp = cacheMod.get(modConfig.template);
                                if (temp) {
                                    childScope = scope.$new();
                                    elm.html(temp);
                                    var content = elm.contents();
                                    $compile(content)(childScope);
                                } else {
                                    $http.get(modConfig.template).success(function (data) {
                                        //Создаем отдельное пространство для модуля
                                        childScope = scope.$new();
                                        elm.html(data);
                                        var content = elm.contents();
                                        $compile(content)(childScope);
                                        cacheMod.put(modConfig.template, data);
                                    });
                                }
                            }
                        });
                    } else {
                        throw ("Вы пытаетесь загрузить модуль, который не описан в конфигурации загрузчика!");
                    }
                }
            }
        };
    });
})();