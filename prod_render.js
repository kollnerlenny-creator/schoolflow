function render(_ctx, _cache) {
  with (_ctx) {
    const { createElementVNode: _createElementVNode, openBlock: _openBlock, createElementBlock: _createElementBlock, createCommentVNode: _createCommentVNode, vModelText: _vModelText, withDirectives: _withDirectives, renderList: _renderList, Fragment: _Fragment, toDisplayString: _toDisplayString, normalizeClass: _normalizeClass, vModelDynamic: _vModelDynamic, createTextVNode: _createTextVNode, withModifiers: _withModifiers, normalizeStyle: _normalizeStyle, vModelSelect: _vModelSelect } = _Vue

    return (_openBlock(), _createElementBlock("div", _hoisted_1, [
      authLoading
        ? (_openBlock(), _createElementBlock("div", _hoisted_2, [...(_cache[0] || (_cache[0] = [_createElementVNode("i", {
            "data-lucide": "loader-2",
            class: "animate-spin w-14 h-14"
          }, null, -1)]))]))
        : (user && isOnboarding)
          ? (_openBlock(), _createElementBlock("div", _hoisted_3, [_createElementVNode("div", _hoisted_4, [_cache[8] || (_cache[8] = _createElementVNode("div", { class: "text-center space-y-4" }, [_createElementVNode("div", { class: "w-24 h-24 hero-block mx-auto flex items-center justify-center shadow-2xl relative" }, [_createElementVNode("i", {
              "data-lucide": "sparkles",
              class: "w-12 h-12 text-white"
            })]), _createElementVNode("h1", { class: "text-3xl font-black text-[#1e1b16]" }, "Fast geschafft!"), _createElementVNode("p", { class: "text-accent text-sm font-bold" }, "Richten wir dein Profil kurz ein, um SchoolFlow optimal an dich anzupassen.")], -1)), _createElementVNode("div", _hoisted_5, [_createElementVNode("div", _hoisted_6, [
              _createElementVNode("div", _hoisted_7, [_cache[1] || (_cache[1] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-[#524d44] block" }, "Wie heißt du?", -1)), _withDirectives(_createElementVNode("input", {
                type: "text",
                placeholder: "z.B. Jonas",
                "onUpdate:modelValue": $event => ((onboardingName) = $event),
                class: "w-full bg-[#efe8dc] border border-[#cec5b8] rounded-xl text-[#1e1b16] font-bold text-base px-4 py-3.5 outline-none focus:border-accent transition-colors mt-2"
              }, null, 8, _hoisted_8), [[_vModelText, onboardingName]])]),
              _createElementVNode("div", _hoisted_9, [_cache[2] || (_cache[2] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-[#524d44] block" }, "In welcher Klasse bist du?", -1)), _cache[3] || (_cache[3] = _createElementVNode("p", { class: "text-[11px] text-[#524d44] leading-normal" }, "Damit passen wir die App an deine Schulstufe an.", -1)), _createElementVNode("div", _hoisted_10, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([5,6,7,8,9,10,11,12], (k) => {
                return (_openBlock(), _createElementBlock("button", {
                  key: k,
                  type: "button",
                  onClick: $event => {onboardingCurrentClass = k; onboardingGradeSystem = k >= 11 ? '15' : '6'},
                  class: _normalizeClass([onboardingCurrentClass === k ? 'toggle-accent-on text-white font-black border-accent' : 'bg-[#efe8dc] text-[#524d44] border-[#cec5b8]', "py-3 rounded-xl text-sm font-bold border cursor-pointer transition-all active:scale-95"])
                }, _toDisplayString(k), 11, _hoisted_11))
              }), 128))])]),
              _createElementVNode("div", _hoisted_12, [_cache[4] || (_cache[4] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-[#524d44] block" }, "Notensystem", -1)), _cache[5] || (_cache[5] = _createElementVNode("p", { class: "text-[11px] text-[#524d44] leading-normal" }, "Wähle dein Notensystem. In der Oberstufe (11/12) wird 0–15 Punkte verwendet.", -1)), _createElementVNode("div", _hoisted_13, [_createElementVNode("button", {
                type: "button",
                onClick: $event => (onboardingGradeSystem = '15'),
                class: _normalizeClass([onboardingGradeSystem = '15' ? 'toggle-accent-on text-white font-black' : 'text-[#524d44] font-bold', "flex-1 py-3 rounded-full text-xs uppercase tracking-wider cursor-pointer transition-all"])
              }, "0–15 Punkte", 10, _hoisted_14), _createElementVNode("button", {
                type: "button",
                onClick: $event => (onboardingGradeSystem = '6'),
                class: _normalizeClass([onboardingGradeSystem === '6' ? 'toggle-accent-on text-white font-black' : 'text-[#524d44] font-bold', "flex-1 py-3 rounded-full text-xs uppercase tracking-wider cursor-pointer transition-all"])
              }, "1–6 Noten", 10, _hoisted_15)])]),
              (onboardingCurrentClass >= 11)
                ? (_openBlock(), _createElementBlock("div", _hoisted_16, [_cache[6] || (_cache[6] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-[#524d44] block" }, "Klasse 11 Startjahr", -1)), _cache[7] || (_cache[7] = _createElementVNode("p", { class: "text-[11px] text-[#524d44] leading-normal" }, "Damit berechnen wir automatisch deine Halbjahre.", -1)), _withDirectives(_createElementVNode("input", {
                    type: "number",
                    min: "2000",
                    max: "2099",
                    "onUpdate:modelValue": $event => ((onboardingStartYear) = $event),
                    class: "w-full bg-[#efe8dc] border border-[#cec5b8] rounded-xl text-accent font-black text-xl text-center py-3.5 outline-none focus:border-accent",
                    placeholder: "z.B. 2025"
                  }, null, 8, _hoisted_17), [[
                    _vModelText,
                    onboardingStartYear,
                    void 0,
                    { number: true }
                  ]])]))
                : _createCommentVNode("", true)
            ]), onboardingError
              ? (_openBlock(), _createElementBlock("p", _hoisted_18, _toDisplayString(onboardingError), 1))
              : _createCommentVNode("", true), _createElementVNode("button", {
              onClick: submitOnboarding,
              class: "w-full hero-block hover:opacity-90 active:scale-95 text-white py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            }, " SchoolFlow starten 🚀 ", 8, _hoisted_19)])])]))
          : (!user)
            ? (_openBlock(), _createElementBlock("div", _hoisted_20, [_createElementVNode("div", _hoisted_21, [_cache[12] || (_cache[12] = _createElementVNode("div", { class: "text-center space-y-3" }, [_createElementVNode("div", { class: "w-24 h-24 hero-block mx-auto flex items-center justify-center shadow-xl relative group rounded-[28px]" }, [_createElementVNode("i", {
                "data-lucide": "graduation-cap",
                class: "w-12 h-12 text-white"
              })]), _createElementVNode("h1", { class: "text-4xl sm:text-5xl font-black tracking-tight pt-2 text-[#1e1b16]" }, "SchoolFlow"), _createElementVNode("p", { class: "text-accent text-sm sm:text-base font-bold tracking-wide" }, " Noten, Termine, Flow – Alles an einem Ort! 🚀 ")], -1)), _createElementVNode("div", _hoisted_22, [_createElementVNode("div", _hoisted_23, [_createElementVNode("button", {
                onClick: $event => (isRegistering = false),
                class: _normalizeClass([!isRegistering ? 'toggle-accent-on text-white font-black' : 'text-[#524d44] font-bold', "flex-1 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer"])
              }, "Anmelden", 10, _hoisted_24), _createElementVNode("button", {
                onClick: $event => (isRegistering = true),
                class: _normalizeClass([isRegistering ? 'toggle-accent-on text-white font-black' : 'text-[#524d44] font-bold', "flex-1 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer"])
              }, "Registrieren", 10, _hoisted_25)]), _createElementVNode("form", {
                onSubmit: _withModifiers(handleAuth, ["prevent"]),
                class: "space-y-5"
              }, [
                _createElementVNode("div", _hoisted_27, [_cache[9] || (_cache[9] = _createElementVNode("i", {
                  "data-lucide": "mail",
                  class: "text-accent mr-3.5 w-5 h-5 shrink-0"
                }, null, -1)), _withDirectives(_createElementVNode("input", {
                  required: "",
                  type: "email",
                  placeholder: "E-Mail Adresse",
                  "onUpdate:modelValue": $event => ((email) = $event),
                  class: "bg-transparent w-full outline-none text-base font-bold text-[#1e1b16] placeholder:text-[#7d766b]"
                }, null, 8, _hoisted_28), [[_vModelText, email]])]),
                _createElementVNode("div", _hoisted_29, [_cache[10] || (_cache[10] = _createElementVNode("i", {
                  "data-lucide": "lock",
                  class: "text-accent mr-3.5 w-5 h-5 shrink-0"
                }, null, -1)), _withDirectives(_createElementVNode("input", {
                  required: "",
                  type: showPassword ? 'text' : 'password',
                  placeholder: "Passwort",
                  "onUpdate:modelValue": $event => ((password) = $event),
                  class: "bg-transparent w-full outline-none text-base font-bold text-[#1e1b16] placeholder:text-[#7d766b] pr-10"
                }, null, 8, _hoisted_30), [[_vModelDynamic, password]]), _createElementVNode("button", {
                  type: "button",
                  onClick: togglePasswordVisibility,
                  class: "absolute right-4 text-[#7d766b] hover:text-[#1e1b16] cursor-pointer focus:outline-none h-9 w-9 flex items-center justify-center"
                }, [_createElementVNode("i", {
                  "data-lucide": showPassword ? 'eye-off' : 'eye',
                  class: "w-5 h-5 text-accent/80"
                }, null, 8, _hoisted_32)], 8, _hoisted_31)]),
                isRegistering
                  ? (_openBlock(), _createElementBlock("div", _hoisted_33, [_cache[11] || (_cache[11] = _createElementVNode("i", {
                      "data-lucide": "ticket",
                      class: "text-accent mr-3.5 w-5 h-5 shrink-0"
                    }, null, -1)), _withDirectives(_createElementVNode("input", {
                      type: "text",
                      placeholder: "Einladungscode",
                      "onUpdate:modelValue": $event => ((inviteCode) = $event),
                      class: "bg-transparent w-full outline-none text-base font-black text-accent placeholder:text-[#7d766b] uppercase tracking-widest",
                      autocomplete: "off"
                    }, null, 8, _hoisted_34), [[_vModelText, inviteCode]])]))
                  : _createCommentVNode("", true),
                authError
                  ? (_openBlock(), _createElementBlock("p", _hoisted_35, _toDisplayString(authError), 1))
                  : _createCommentVNode("", true),
                _createElementVNode("button", {
                  type: "submit",
                  disabled: loading,
                  class: "w-full hero-block hover:opacity-90 active:scale-95 text-white py-4.5 rounded-full font-black uppercase tracking-widest text-xs sm:text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4 shadow-md"
                }, [loading
                  ? (_openBlock(), _createElementBlock("i", _hoisted_37))
                  : _createCommentVNode("", true), _createTextVNode(" " + _toDisplayString(isRegistering ? 'Kostenlos starten' : 'Einloggen'), 1)], 8, _hoisted_36),
                (!isRegistering)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 2,
                      type: "button",
                      onClick: handleForgotPassword,
                      class: "w-full text-center text-[#524d44] hover:text-accent text-xs font-bold transition-colors cursor-pointer pt-1"
                    }, " Passwort vergessen? ", 8, _hoisted_38))
                  : _createCommentVNode("", true)
              ], 40, _hoisted_26)])])]))
            : (_openBlock(), _createElementBlock("div", _hoisted_39, [
                (!selectedSubject)
                  ? (_openBlock(), _createElementBlock("header", _hoisted_40, [_createElementVNode("div", _hoisted_41, [_createElementVNode("button", {
                      type: "button",
                      onClick: $event => (isAvatarModalOpen = true),
                      title: "Profilbild anpassen",
                      class: "group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white bg-[#f0e6df] shrink-0 flex items-center justify-center shadow-sm cursor-pointer active:scale-95 transition-all ring-1 ring-[#ede3d8]"
                    }, [(userAvatar && (userAvatar.startsWith('data:') || userAvatar.startsWith('http')))
                      ? (_openBlock(), _createElementBlock("img", {
                          key: 0,
                          src: userAvatar,
                          alt: "Profilbild",
                          class: "w-full h-full object-cover"
                        }, null, 8, _hoisted_43))
                      : userAvatar
                        ? (_openBlock(), _createElementBlock("div", _hoisted_44, _toDisplayString(userAvatar), 1))
                        : (_openBlock(), _createElementBlock("div", _hoisted_45, _toDisplayString(displayName ? displayName.slice(0,2).toUpperCase() : 'SF'), 1)), _cache[13] || (_cache[13] = _createElementVNode("div", { class: "absolute inset-0 bg-black/40 backdrop-blur-[0.5px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white" }, [_createElementVNode("i", {
                      "data-lucide": "camera",
                      class: "w-4 h-4"
                    })], -1)), _cache[14] || (_cache[14] = _createElementVNode("div", { class: "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#2d694c] text-white flex items-center justify-center border border-white shadow-2xs" }, [_createElementVNode("i", {
                      "data-lucide": "camera",
                      class: "w-2 h-2"
                    })], -1))], 8, _hoisted_42), _createElementVNode("div", {
                      class: "min-w-0 cursor-pointer",
                      onClick: $event => {currentTab = 'home'; selectedSubject = null}
                    }, [_createElementVNode("p", _hoisted_47, "Gymnasium • " + _toDisplayString(currentClass) + ". Klasse", 1), _cache[15] || (_cache[15] = _createElementVNode("h1", { class: "text-xl sm:text-2xl font-black text-[#1f1b16] font-['Epilogue'] tracking-tight leading-tight truncate" }, "SchoolFlow", -1))], 8, _hoisted_46)]), _createElementVNode("div", _hoisted_48, [
                      (!isInstalled)
                        ? (_openBlock(), _createElementBlock("button", {
                            key: 0,
                            onClick: triggerInstall,
                            title: "App installieren",
                            class: "install-btn hidden xs:flex items-center gap-1.5 px-3 py-2 bg-[#f0e6df] hover:bg-[#e6dcd3] rounded-full border border-[#ede3d8] text-[#1f1b16] font-bold text-xs transition-all cursor-pointer active:scale-95"
                          }, [...(_cache[16] || (_cache[16] = [_createElementVNode("i", {
                            "data-lucide": "download",
                            class: "w-4 h-4 shrink-0"
                          }, null, -1), _createElementVNode("span", { class: "whitespace-nowrap" }, "Installieren", -1)]))], 8, _hoisted_49))
                        : _createCommentVNode("", true),
                      _createElementVNode("button", {
                        onClick: $event => (isNotificationsOpen = true),
                        title: "Benachrichtigungen",
                        class: "relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f0e6df] border border-[#ede3d8] flex items-center justify-center text-[#1f1b16] hover:bg-[#e6dcd3] active:scale-95 transition-all cursor-pointer shadow-xs"
                      }, [_cache[17] || (_cache[17] = _createElementVNode("i", {
                        "data-lucide": "bell",
                        class: "w-4.5 h-4.5 sm:w-5 sm:h-5"
                      }, null, -1)), (unreadNotifications && unreadNotifications.length > 0)
                        ? (_openBlock(), _createElementBlock("span", _hoisted_51, _toDisplayString(unreadNotifications.length > 9 ? '9+' : unreadNotifications.length), 1))
                        : _createCommentVNode("", true)], 8, _hoisted_50),
                      _createElementVNode("button", {
                        onClick: openTaskModal,
                        title: "Termin / Aufgabe hinzufügen",
                        class: "w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2d694c] hover:bg-[#23533c] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
                      }, [...(_cache[18] || (_cache[18] = [_createElementVNode("i", {
                        "data-lucide": "plus",
                        class: "w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.5]"
                      }, null, -1)]))], 8, _hoisted_52),
                      _createElementVNode("button", {
                        onClick: $event => (isFriendsOpen = true),
                        title: "Freunde",
                        class: "w-8 h-8 rounded-full flex items-center justify-center text-[#6E665E] hover:text-[#1f1b16] active:scale-95 transition-all cursor-pointer"
                      }, [...(_cache[19] || (_cache[19] = [_createElementVNode("i", {
                        "data-lucide": "user-plus",
                        class: "w-4 h-4"
                      }, null, -1)]))], 8, _hoisted_53),
                      _createElementVNode("button", {
                        onClick: $event => {tempWeeklyRecapWeekday = weeklyRecapWeekday; isAppSettingsModalOpen = true},
                        title: "Einstellungen",
                        class: "w-8 h-8 rounded-full flex items-center justify-center text-[#6E665E] hover:text-[#1f1b16] active:scale-95 transition-all cursor-pointer"
                      }, [...(_cache[20] || (_cache[20] = [_createElementVNode("i", {
                        "data-lucide": "settings",
                        class: "w-4 h-4"
                      }, null, -1)]))], 8, _hoisted_54)
                    ])]))
                  : _createCommentVNode("", true),
                (!selectedSubject && currentTab !== 'planner')
                  ? (_openBlock(), _createElementBlock("div", _hoisted_55, [_createElementVNode("div", {
                      class: "absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-xs transition-all duration-300",
                      style: _normalizeStyle({ width: `calc((100% - 12px) / ${(halfYears?.length || 1)})`, left: `calc(6px + ${(halfYears || []).indexOf(selectedHalfYear)} * (100% - 12px) / ${(halfYears?.length || 1)})` })
                    }, null, 4), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(halfYears, (s) => {
                      return (_openBlock(), _createElementBlock("button", {
                        key: s,
                        onClick: $event => (selectedHalfYear = s),
                        class: _normalizeClass([selectedHalfYear === s ? 'text-[#1f1b16] font-extrabold' : 'text-[#6E665E] font-semibold hover:text-[#1f1b16]', "flex-1 py-2 text-xs sm:text-sm uppercase tracking-wider text-center relative z-10 transition-colors duration-300 cursor-pointer"])
                      }, _toDisplayString(s), 11, _hoisted_56))
                    }), 128))]))
                  : _createCommentVNode("", true),
                _createElementVNode("main", _hoisted_57, [
                  (currentTab === 'home' && !selectedSubject)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_58, [
                        _createElementVNode("div", {
                          class: _normalizeClass(["card-enter card-enter-1 bg-white rounded-[2rem] p-6 sm:p-8 border border-[#ede3d8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden", weeklyRecapAvailable ? 'recap-ring p-[3px] cursor-pointer' : (weeklyRecapWeekReady ? 'recap-ring-seen p-[2px] cursor-pointer' : '')]),
                          onClick: $event => (weeklyRecapWeekReady && openWeeklyRecap())
                        }, [_createElementVNode("div", _hoisted_60, [_cache[23] || (_cache[23] = _createElementVNode("div", { class: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fed8b1] text-[#825500] text-[11px] font-black uppercase tracking-[0.2em]" }, [_createElementVNode("span", { class: "w-2 h-2 rounded-full bg-[#2d694c]" }), _createTextVNode(" Gymnasium • 12. Klasse ")], -1)), _createElementVNode("h2", _hoisted_61, _toDisplayString(welcomeMessage), 1), (!weeklyRecapWeekReady)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_62, " Dein Schulalltag im perfekten Fluss – Lernphasen, Abgaben und Prüfungen im Überblick. ✨ "))
                          : weeklyRecapAvailable
                            ? (_openBlock(), _createElementBlock("div", _hoisted_63, [...(_cache[21] || (_cache[21] = [_createElementVNode("i", {
                                "data-lucide": "sparkles",
                                class: "w-4 h-4"
                              }, null, -1), _createElementVNode("span", { class: "text-xs sm:text-sm font-bold" }, "Dein Wochenrückblick ist da — antippen!", -1)]))]))
                            : (_openBlock(), _createElementBlock("div", _hoisted_64, [...(_cache[22] || (_cache[22] = [_createElementVNode("i", {
                                "data-lucide": "sparkles",
                                class: "w-3.5 h-3.5"
                              }, null, -1), _createElementVNode("span", { class: "text-[11px] font-bold uppercase tracking-wide" }, "Wochenrückblick ansehen", -1)]))]))])], 10, _hoisted_59),
                        (todayOverview && ((todayOverview.lessons && todayOverview.lessons.length > 0) || (todayOverview.tasksToday && todayOverview.tasksToday.length > 0)))
                          ? (_openBlock(), _createElementBlock("div", _hoisted_65, [_createElementVNode("div", _hoisted_66, [_cache[24] || (_cache[24] = _createElementVNode("div", { class: "flex items-center gap-2" }, [_createElementVNode("div", { class: "w-8 h-8 rounded-full bg-[#fed8b1] text-[#825500] flex items-center justify-center" }, [_createElementVNode("i", {
                              "data-lucide": "sun",
                              class: "w-4.5 h-4.5"
                            })]), _createElementVNode("h3", { class: "font-extrabold text-sm sm:text-base text-[#1f1b16] font-['Epilogue']" }, "Heute im Fokus")], -1)), _createElementVNode("span", _hoisted_67, _toDisplayString(dateFocusRangeStr), 1)]), (todayOverview && todayOverview.lessons && todayOverview.lessons.length > 0)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_68, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(todayOverview.lessons, (s) => {
                                  return (_openBlock(), _createElementBlock("span", {
                                    key: s.id,
                                    class: "text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[#ede3d8] shadow-2xs",
                                    style: _normalizeStyle({ color: s.color })
                                  }, _toDisplayString(s.name), 5))
                                }), 128))]))
                              : _createCommentVNode("", true), (todayOverview && todayOverview.tasksToday && todayOverview.tasksToday.length > 0)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_69, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(todayOverview.tasksToday.slice(0, 3), (t) => {
                                  return (_openBlock(), _createElementBlock("div", {
                                    key: t.id,
                                    class: "flex items-center gap-2.5 text-sm bg-white p-3 rounded-2xl border border-[#ede3d8]"
                                  }, [_createElementVNode("span", {
                                    class: "w-2.5 h-2.5 rounded-full shrink-0",
                                    style: _normalizeStyle({ backgroundColor: t.subject.color })
                                  }, null, 4), _createElementVNode("span", _hoisted_70, _toDisplayString(t.title), 1), _createElementVNode("span", _hoisted_71, _toDisplayString(t.type), 1)]))
                                }), 128)), (todayOverview && todayOverview.tasksToday && todayOverview.tasksToday.length > 3)
                                  ? (_openBlock(), _createElementBlock("p", _hoisted_72, "+ " + _toDisplayString(todayOverview && todayOverview.tasksToday ? todayOverview.tasksToday.length - 3 : 0) + " weitere", 1))
                                  : _createCommentVNode("", true)]))
                              : (_openBlock(), _createElementBlock("p", _hoisted_73, "Keine offenen Aufgaben für heute. 🎉"))]))
                          : _createCommentVNode("", true),
                        nextExamCountdown
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 1,
                              class: "card-enter card-enter-2 bg-white rounded-[1.75rem] p-5 border border-[#ede3d8] flex items-center gap-4 cursor-pointer shadow-xs hover:shadow-md transition-shadow",
                              onClick: $event => {currentTab = 'planner'; plannerTab = 'upcoming'}
                            }, [_cache[25] || (_cache[25] = _createElementVNode("div", { class: "w-13 h-13 rounded-2xl bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center shrink-0 shadow-xs" }, [_createElementVNode("i", {
                              "data-lucide": "alarm-clock",
                              class: "w-6 h-6"
                            })], -1)), _createElementVNode("div", _hoisted_75, [_createElementVNode("p", _hoisted_76, "Nächste " + _toDisplayString(nextExamCountdown.type) + " • " + _toDisplayString(nextExamCountdown.subject.name), 1), _createElementVNode("h3", _hoisted_77, _toDisplayString(nextExamCountdown.title), 1)]), _createElementVNode("div", _hoisted_78, [_createElementVNode("div", _hoisted_79, _toDisplayString(nextExamCountdown.daysUntil), 1), _createElementVNode("div", _hoisted_80, _toDisplayString(nextExamCountdown.daysUntil === 1 ? 'Tag' : 'Tage'), 1)])], 8, _hoisted_74))
                          : _createCommentVNode("", true),
                        _createElementVNode("div", _hoisted_81, [_createElementVNode("div", _hoisted_82, [_createElementVNode("div", _hoisted_83, [_createElementVNode("div", _hoisted_84, [_createElementVNode("div", _hoisted_85, [_cache[26] || (_cache[26] = _createElementVNode("i", {
                          "data-lucide": "sparkles",
                          class: "w-3.5 h-3.5 text-[#2d694c]"
                        }, null, -1)), _createTextVNode(" Schnitt in " + _toDisplayString(selectedHalfYear), 1)]), _createElementVNode("div", _hoisted_86, [_cache[27] || (_cache[27] = _createElementVNode("div", { class: "w-12 h-12 bg-[#2d694c] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs" }, [_createElementVNode("i", {
                          "data-lucide": "award",
                          class: "w-6 h-6"
                        })], -1)), _createElementVNode("div", _hoisted_87, _toDisplayString(formatNumber(processedData.avgPoints)), 1)]), (processedData.avgGrade)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_88, [_createElementVNode("span", null, "Ø Note: " + _toDisplayString(formatNumber(processedData.avgGrade)), 1)]))
                          : _createCommentVNode("", true)])])]), _createElementVNode("div", _hoisted_89, [(gradeSystem !== '6')
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 0,
                              onClick: $event => (lkBonusActive = !lkBonusActive),
                              class: "bg-white rounded-[1.75rem] p-4.5 border border-[#ede3d8] flex justify-between items-center cursor-pointer shadow-xs hover:shadow-md transition-shadow"
                            }, [_cache[28] || (_cache[28] = _createElementVNode("div", { class: "flex items-center gap-3.5 min-w-0" }, [_createElementVNode("div", { class: "w-11 h-11 rounded-2xl bg-[#fed8b1] text-[#825500] flex items-center justify-center shrink-0 shadow-xs" }, [_createElementVNode("i", {
                              "data-lucide": "award",
                              class: "w-5 h-5"
                            })]), _createElementVNode("div", { class: "min-w-0" }, [_createElementVNode("h4", { class: "font-bold text-sm sm:text-base text-[#1f1b16] font-['Epilogue'] truncate" }, "Leistungskurs-Faktor"), _createElementVNode("p", { class: "text-xs text-[#6E665E] truncate" }, "LKs doppelt werten")])], -1)), _createElementVNode("div", { class: _normalizeClass(["w-13 h-7.5 rounded-full relative shrink-0 transition-colors", lkBonusActive ? 'bg-[#2d694c]' : 'bg-[#ded5c7]']) }, [_createElementVNode("div", { class: _normalizeClass(["w-5.5 h-5.5 bg-white rounded-full absolute top-1 shadow-sm transition-all", lkBonusActive ? 'right-1' : 'left-1']) }, null, 2)], 2)], 8, _hoisted_90))
                          : _createCommentVNode("", true), _createElementVNode("div", _hoisted_91, [_createElementVNode("div", _hoisted_92, [_cache[29] || (_cache[29] = _createElementVNode("h3", { class: "font-bold text-[#1f1b16] text-sm sm:text-base font-['Epilogue'] flex items-center gap-2" }, [_createElementVNode("i", {
                          "data-lucide": "bell",
                          class: "w-4.5 h-4.5 text-[#2d694c]"
                        }), _createTextVNode(" Nächste Aufgaben ")], -1)), _createElementVNode("button", {
                          onClick: $event => (currentTab = 'planner'),
                          class: "text-xs font-bold text-[#2d694c] uppercase tracking-wider hover:underline cursor-pointer"
                        }, "Alle", 8, _hoisted_93)]), (!upcomingTasks || upcomingTasks.length === 0)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_94, " Aktuell keine Aufgaben! 🎉 "))
                          : (_openBlock(), _createElementBlock("div", _hoisted_95, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(upcomingTasks.slice(0,3), (t, tIdx) => {
                              return (_openBlock(), _createElementBlock("div", {
                                key: t.id,
                                class: "flex items-center gap-3 bg-[#f4ece4] p-3 rounded-2xl border border-[#ede3d8]"
                              }, [_createElementVNode("button", {
                                onClick: $event => (toggleTaskDone(t, $event)),
                                class: _normalizeClass(["shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer", t.done ? 'bg-[#2d694c] border-[#2d694c] text-white' : 'border-[#ded5c7] bg-white text-transparent'])
                              }, [...(_cache[30] || (_cache[30] = [_createElementVNode("i", {
                                "data-lucide": "check",
                                class: "w-3.5 h-3.5"
                              }, null, -1)]))], 10, _hoisted_96), _createElementVNode("div", _hoisted_97, [_createElementVNode("div", _hoisted_98, [_createElementVNode("span", {
                                class: "w-2 h-2 rounded-full shrink-0",
                                style: _normalizeStyle({backgroundColor: t.subject.color})
                              }, null, 4), _createElementVNode("h4", { class: _normalizeClass(["font-bold text-[#1f1b16] text-xs sm:text-sm truncate", {'line-through text-[#857e72]': t.done}]) }, _toDisplayString(t.title), 3)]), _createElementVNode("p", _hoisted_99, _toDisplayString(t.type) + " • " + _toDisplayString(formatDate(t.date)), 1)])]))
                            }), 128))]))])])])
                      ]))
                    : _createCommentVNode("", true),
                  (currentTab === 'subjects' && !selectedSubject)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_100, [_createElementVNode("div", _hoisted_101, [_createElementVNode("div", null, [_createElementVNode("div", _hoisted_102, [_createElementVNode("span", _hoisted_103, _toDisplayString(selectedHalfYear), 1), _createElementVNode("span", _hoisted_104, _toDisplayString((processedData?.semesterSubjects || []).length) + " Fächer angelegt ", 1)]), _cache[31] || (_cache[31] = _createElementVNode("h2", { class: "text-3xl sm:text-4xl font-black text-[#1f1b16] font-['Epilogue'] tracking-tight" }, "Fächer & Noten", -1))]), _createElementVNode("button", {
                        onClick: openAddSubjectModal,
                        title: "Neues Fach anlegen",
                        class: "h-11 sm:h-12 px-4 rounded-full bg-[#2d694c] hover:bg-[#23533c] !text-white flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                      }, [...(_cache[32] || (_cache[32] = [_createElementVNode("i", {
                        "data-lucide": "plus",
                        class: "w-5 h-5 stroke-[2.5] !text-white"
                      }, null, -1), _createElementVNode("span", { class: "text-xs sm:text-sm font-bold !text-white hidden sm:inline" }, "Neues Fach", -1)]))], 8, _hoisted_105)]), _createElementVNode("div", _hoisted_106, [_createElementVNode("nav", _hoisted_107, [
                        _createElementVNode("div", {
                          class: "liquid-glass-glider pointer-events-none",
                          style: _normalizeStyle({
                                     width: 'calc((100% - 12px) / 3)',
                                     left: `calc(6px + ${activeSubjectFilterIndex} * ((100% - 12px) / 3))`
                                 })
                        }, [...(_cache[33] || (_cache[33] = [_createElementVNode("div", { class: "glider-specular-top" }, null, -1), _createElementVNode("div", { class: "glider-dot-glow" }, null, -1)]))], 4),
                        _createElementVNode("button", {
                          onClick: $event => (subjectFilter = 'all'),
                          class: _normalizeClass(["relative z-10 flex-1 py-2 px-1 rounded-full text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95", activeSubjectFilterIndex === 0 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
                        }, [_createElementVNode("span", null, "Alle (" + _toDisplayString((processedData?.semesterSubjects || []).length) + ")", 1)], 10, _hoisted_108),
                        _createElementVNode("button", {
                          onClick: $event => (subjectFilter = 'lk'),
                          class: _normalizeClass(["relative z-10 flex-1 py-2 px-1 rounded-full text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95", activeSubjectFilterIndex === 1 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
                        }, [_createElementVNode("span", null, "LK (" + _toDisplayString((processedData?.semesterSubjects || []).filter(s => s.isLK).length) + ")", 1)], 10, _hoisted_109),
                        _createElementVNode("button", {
                          onClick: $event => (subjectFilter = 'gk'),
                          class: _normalizeClass(["relative z-10 flex-1 py-2 px-1 rounded-full text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95", activeSubjectFilterIndex === 2 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
                        }, [_createElementVNode("span", null, "GK (" + _toDisplayString((processedData?.semesterSubjects || []).filter(s => !s.isLK).length) + ")", 1)], 10, _hoisted_110)
                      ])]), (!sortedSubjectsList || sortedSubjectsList.length === 0)
                        ? (_openBlock(), _createElementBlock("div", _hoisted_111, [
                            _cache[34] || (_cache[34] = _createElementVNode("div", { class: "w-12 h-12 rounded-full bg-[#f4ece4] flex items-center justify-center mx-auto mb-3 text-[#6E665E]" }, [_createElementVNode("i", {
                              "data-lucide": "book-open",
                              class: "w-6 h-6"
                            })], -1)),
                            _cache[35] || (_cache[35] = _createElementVNode("p", { class: "font-bold text-sm text-[#1f1b16]" }, "Keine Fächer in dieser Ansicht gefunden", -1)),
                            _cache[36] || (_cache[36] = _createElementVNode("p", { class: "text-xs text-[#6E665E] mt-1" }, "Wechsle den Filter oder lege ein neues Fach an.", -1)),
                            _createElementVNode("button", {
                              onClick: $event => (subjectFilter = 'all'),
                              class: "mt-4 text-xs font-bold text-[#2d694c] uppercase tracking-wider hover:underline cursor-pointer"
                            }, " Filter zurücksetzen ", 8, _hoisted_112)
                          ]))
                        : (_openBlock(), _createElementBlock("div", _hoisted_113, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedSubjectsList, (s, idx) => {
                            return (_openBlock(), _createElementBlock("div", {
                              key: s.id,
                              onClick: $event => (selectedSubject = s),
                              class: "bg-white rounded-[2rem] p-4.5 sm:p-5 border border-[#ede3d8] flex flex-col gap-3 shadow-[0_4px_18px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#2d694c]/30 transition-all cursor-pointer active:scale-[0.99]",
                              style: _normalizeStyle({ animationDelay: (idx * 0.04) + 's' })
                            }, [_createElementVNode("div", _hoisted_115, [_createElementVNode("div", _hoisted_116, [_createElementVNode("div", {
                              class: "w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 relative shadow-xs",
                              style: _normalizeStyle({ backgroundColor: s.color + '22', color: s.color })
                            }, [_createElementVNode("i", {
                              "data-lucide": s.icon || 'book-open',
                              class: "w-6 h-6 sm:w-7 sm:h-7"
                            }, null, 8, _hoisted_117)], 4), _createElementVNode("div", _hoisted_118, [_createElementVNode("div", _hoisted_119, [(gradeSystem !== '6')
                              ? (_openBlock(), _createElementBlock("span", {
                                  key: 0,
                                  class: _normalizeClass(["text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider", s.isLK ? 'bg-[#2d694c] text-white' : 'bg-[#ede4dc] text-[#524d44]'])
                                }, _toDisplayString(s.isLK ? 'Leistungskurs' : 'Grundkurs'), 3))
                              : _createCommentVNode("", true), _createElementVNode("span", _hoisted_120, _toDisplayString(s.examWeight) + "% Klausur ", 1)]), _createElementVNode("h3", _hoisted_121, _toDisplayString(s.name), 1), _createElementVNode("p", _hoisted_122, _toDisplayString(s.semesterGrades ? s.semesterGrades.length : 0) + " eingetragene " + _toDisplayString(s.semesterGrades && s.semesterGrades.length === 1 ? 'Note' : 'Noten'), 1)])]), _createElementVNode("div", _hoisted_123, [_createElementVNode("div", _hoisted_124, [_createElementVNode("div", _hoisted_125, [(s.reportCardGrade !== null)
                              ? (_openBlock(), _createElementBlock("span", _hoisted_126, [_cache[37] || (_cache[37] = _createElementVNode("i", {
                                  "data-lucide": "award",
                                  class: "w-5 h-5 text-[#b45309]"
                                }, null, -1)), _createTextVNode(" " + _toDisplayString(s.reportCardGrade), 1)]))
                              : (_openBlock(), _createElementBlock("span", _hoisted_127, _toDisplayString(s.finalPoints !== null ? formatNumber(s.finalPoints) : '–'), 1))]), _createElementVNode("div", _hoisted_128, [(s.finalPoints !== null && s.reportCardGrade === null)
                              ? (_openBlock(), _createElementBlock("span", _hoisted_129, "Ø Note " + _toDisplayString(formatNumber(s.finalGrade)), 1))
                              : (s.reportCardGrade !== null)
                                ? (_openBlock(), _createElementBlock("span", _hoisted_130, "Zeugnis"))
                                : (_openBlock(), _createElementBlock("span", _hoisted_131, "Offen"))])]), _cache[38] || (_cache[38] = _createElementVNode("div", { class: "w-8 h-8 rounded-full bg-[#f3ebe3] flex items-center justify-center text-[#857e72]" }, [_createElementVNode("i", {
                              "data-lucide": "chevron-right",
                              class: "w-4 h-4"
                            })], -1))])]), (s.finalPoints !== null)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_132, [_createElementVNode("div", {
                                  class: "h-full rounded-full transition-all duration-300",
                                  style: _normalizeStyle({
                                         backgroundColor: s.color || '#2d694c',
                                         width: gradeSystem === '6'
                                             ? `${Math.max(5, (6 - (s.finalGrade || 6)) / 5 * 100)}%`
                                             : `${Math.min(100, Math.max(5, (s.finalPoints / 15) * 100))}%`
                                     })
                                }, null, 4)]))
                              : _createCommentVNode("", true)], 12, _hoisted_114))
                          }), 128))]))]))
                    : _createCommentVNode("", true),
                  selectedSubject
                    ? (_openBlock(), _createElementBlock("div", _hoisted_133, [_createElementVNode("button", {
                        onClick: $event => (selectedSubject = null),
                        class: "bg-[#ede4dc] hover:bg-[#e2d8ce] border border-[#ded5c7] px-4.5 py-2.5 rounded-full flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1f1b16] active:scale-95 transition-all w-fit cursor-pointer shadow-xs"
                      }, [...(_cache[39] || (_cache[39] = [_createElementVNode("i", {
                        "data-lucide": "arrow-left",
                        class: "w-4.5 h-4.5"
                      }, null, -1), _createTextVNode(" Zurück zu allen Fächern ", -1)]))], 8, _hoisted_134), _createElementVNode("div", _hoisted_135, [_createElementVNode("div", _hoisted_136, [_createElementVNode("div", {
                        class: "hero-block p-6 sm:p-8 hero-enter",
                        style: _normalizeStyle({ background: `linear-gradient(135deg, ${selectedSubject.color} 0%, ${adjustColor(selectedSubject.color, -50)} 100%)` })
                      }, [_createElementVNode("div", _hoisted_137, [_createElementVNode("div", _hoisted_138, [_createElementVNode("div", _hoisted_139, [(gradeSystem !== '6')
                        ? (_openBlock(), _createElementBlock("span", _hoisted_140, _toDisplayString(selectedSubject.isLK ? 'Leistungskurs' : 'Grundkurs'), 1))
                        : _createCommentVNode("", true), _createElementVNode("div", _hoisted_141, [_createElementVNode("i", {
                        "data-lucide": selectedSubject.icon || 'book-open',
                        class: "w-4 h-4 text-white"
                      }, null, 8, _hoisted_142)])]), _createElementVNode("h2", _hoisted_143, _toDisplayString(selectedSubject.name), 1), _createElementVNode("p", _hoisted_144, _toDisplayString(selectedSubject.examWeight) + "% Klausuranteil", 1)]), _createElementVNode("div", _hoisted_145, [_createElementVNode("button", {
                        onClick: openSettingsModal,
                        class: "w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md active:bg-white/30 transition-colors cursor-pointer"
                      }, [...(_cache[40] || (_cache[40] = [_createElementVNode("i", {
                        "data-lucide": "settings",
                        class: "w-5 h-5"
                      }, null, -1)]))], 8, _hoisted_146), _createElementVNode("button", {
                        onClick: openReportCardModal,
                        class: "w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md active:bg-white/30 transition-colors relative cursor-pointer"
                      }, [_cache[41] || (_cache[41] = _createElementVNode("i", {
                        "data-lucide": "award",
                        class: "w-5 h-5"
                      }, null, -1)), (activeSubjectData?.reportCardGrade !== null)
                        ? (_openBlock(), _createElementBlock("span", _hoisted_148))
                        : _createCommentVNode("", true)], 8, _hoisted_147)])]), _createElementVNode("div", _hoisted_149, [_createElementVNode("div", null, [_cache[42] || (_cache[42] = _createElementVNode("p", { class: "text-[11px] font-black uppercase tracking-wider text-white/80" }, "Schnitt", -1)), (_openBlock(), _createElementBlock("div", {
                        class: "text-4xl sm:text-6xl font-black text-white mt-1 grade-value-enter",
                        key: activeSubjectData?.finalPoints
                      }, _toDisplayString(activeSubjectData?.finalPoints !== null ? formatNumber(activeSubjectData.finalPoints) : '-'), 1))]), (activeSubjectData?.finalPoints !== null)
                        ? (_openBlock(), _createElementBlock("div", _hoisted_150, " Note " + _toDisplayString(formatNumber(activeSubjectData.finalGrade)), 1))
                        : _createCommentVNode("", true)])], 4), _cache[46] || (_cache[46] = _createElementVNode("div", { class: "bg-white rounded-[2rem] p-5 sm:p-6 border border-[#ede3d8] shadow-xs" }, [_createElementVNode("p", { class: "text-xs font-bold uppercase tracking-wider text-[#6E665E] mb-5 flex items-center gap-2" }, [_createElementVNode("i", {
                        "data-lucide": "trending-up",
                        class: "w-4.5 h-4.5 text-[#2d694c]"
                      }), _createElementVNode("span", null, "Notenverlauf")]), _createElementVNode("div", {
                        class: "h-52 sm:h-64 w-full relative rounded-2xl overflow-hidden",
                        style: {"background":"transparent"}
                      }, [_createElementVNode("canvas", {
                        id: "trendChart",
                        style: {"background":"transparent","min-height":"160px"}
                      })])], -1)), _createElementVNode("div", _hoisted_151, [
                        _cache[44] || (_cache[44] = _createElementVNode("p", { class: "text-xs font-bold uppercase tracking-wider text-[#6E665E] mb-1 flex items-center gap-2" }, [_createElementVNode("i", {
                          "data-lucide": "target",
                          class: "w-4.5 h-4.5 text-[#2d694c]"
                        }), _createElementVNode("span", null, "Zielnote-Rechner")], -1)),
                        _cache[45] || (_cache[45] = _createElementVNode("p", { class: "text-xs text-[#6E665E] mb-5" }, "Was deine nächste Note sein muss, um dein Wunschziel zu erreichen", -1)),
                        _createElementVNode("div", _hoisted_152, [_cache[43] || (_cache[43] = _createElementVNode("span", { class: "text-xs font-bold text-[#1f1b16] shrink-0" }, "Zielpunktzahl:", -1)), _withDirectives(_createElementVNode("input", {
                          type: "number",
                          min: gradeSystem === '6' ? 1 : 0,
                          max: gradeSystem === '6' ? 6 : 15,
                          "onUpdate:modelValue": $event => ((goalTargetPoints) = $event),
                          class: "w-20 bg-white border border-[#ded5c6] rounded-xl text-center font-black text-[#2d694c] text-lg py-1.5 outline-none focus:border-[#2d694c]"
                        }, null, 8, _hoisted_153), [[
                          _vModelText,
                          goalTargetPoints,
                          void 0,
                          { number: true }
                        ]]), _createElementVNode("span", _hoisted_154, _toDisplayString(gradeSystem === '6' ? '(1 = beste Note)' : 'von 15 Punkten'), 1)]),
                        (activeSubjectData && activeSubjectData.examWeight > 0 && activeSubjectData.examWeight < 100)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_155, [_createElementVNode("button", {
                              onClick: $event => (goalCategory = 'exam'),
                              class: _normalizeClass([goalCategory === 'exam' ? 'bg-[#2d694c] text-white shadow-xs' : 'text-[#6E665E]', "flex-1 py-2.5 rounded-full text-xs font-black uppercase cursor-pointer transition-all"])
                            }, "Nächste Klausur", 10, _hoisted_156), _createElementVNode("button", {
                              onClick: $event => (goalCategory = 'other'),
                              class: _normalizeClass([goalCategory === 'other' ? 'bg-[#2d694c] text-white shadow-xs' : 'text-[#6E665E]', "flex-1 py-2.5 rounded-full text-xs font-black uppercase cursor-pointer transition-all"])
                            }, "Nächste Sonstige", 10, _hoisted_157)]))
                          : _createCommentVNode("", true),
                        (goalCalculation.status === 'not-applicable')
                          ? (_openBlock(), _createElementBlock("div", _hoisted_158, " In diesem Fach zählt " + _toDisplayString(goalCalculation.category === 'exam' ? 'keine Klausur' : 'keine Sonstige Leistung') + " zur Note. ", 1))
                          : (goalCalculation.status === 'unreachable')
                            ? (_openBlock(), _createElementBlock("div", _hoisted_159, [_createElementVNode("p", _hoisted_160, "Ziel ist rechnerisch nicht mehr erreichbar — selbst " + _toDisplayString(gradeSystem === '6' ? 'die beste Note' : '15 Punkte') + " in der nächsten Note würden nicht reichen.", 1)]))
                            : (goalCalculation.status === 'trivial')
                              ? (_openBlock(), _createElementBlock("div", _hoisted_161, [_createElementVNode("p", _hoisted_162, "Dein Ziel steht schon fest — selbst " + _toDisplayString(gradeSystem === '6' ? 'die schlechteste Note' : '0 Punkte') + " in der nächsten Note würden reichen. 🎉", 1)]))
                              : (goalCalculation.status === 'ok')
                                ? (_openBlock(), _createElementBlock("div", _hoisted_163, [_createElementVNode("p", _hoisted_164, "Deine nächste " + _toDisplayString(goalCalculation.category === 'exam' ? 'Klausur' : 'Sonstige Leistung') + " muss mindestens", 1), _createElementVNode("div", _hoisted_165, _toDisplayString(formatNumber(goalCalculation.neededAvg)), 1), _createElementVNode("p", _hoisted_166, _toDisplayString(gradeSystem === '6' ? 'sein (oder besser)' : 'Punkte sein (oder mehr)'), 1)]))
                                : (_openBlock(), _createElementBlock("div", _hoisted_167, " Trag mindestens eine Note ein, damit die Berechnung starten kann. "))
                      ])]), _createElementVNode("div", _hoisted_168, [_createElementVNode("div", _hoisted_169, [_cache[48] || (_cache[48] = _createElementVNode("h3", { class: "text-xl sm:text-2xl font-black text-[#1f1b16] font-['Epilogue']" }, "Eingetragene Noten", -1)), _createElementVNode("button", {
                        onClick: openAddGradeModal,
                        class: "text-[#2d694c] text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-white border border-[#ede3d8] px-4 py-2.5 rounded-full hover:bg-[#ede3d8] active:scale-95 transition-all cursor-pointer shadow-2xs"
                      }, [...(_cache[47] || (_cache[47] = [_createElementVNode("i", {
                        "data-lucide": "plus",
                        class: "w-4 h-4 stroke-[2.5]"
                      }, null, -1), _createTextVNode(" Neu ", -1)]))], 8, _hoisted_170)]), _cache[54] || (_cache[54] = _createElementVNode("p", { class: "text-xs text-[#6E665E] italic px-2" }, "💡 Tippen zum Bearbeiten · Links wischen zum Löschen.", -1)), _createElementVNode("div", _hoisted_171, [(!sortedGrades || sortedGrades.length === 0)
                        ? (_openBlock(), _createElementBlock("div", _hoisted_172, " Keine Noten in diesem Halbjahr eingetragen. "))
                        : _createCommentVNode("", true), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedGrades, (g) => {
                        return (_openBlock(), _createElementBlock("div", {
                          key: g.id,
                          class: "relative group rounded-3xl",
                          style: _normalizeStyle(swipeState.id === g.id ? 'overflow:hidden' : 'overflow:visible')
                        }, [_createElementVNode("div", {
                          class: "absolute inset-0 bg-rose-600 rounded-3xl flex items-center justify-between px-6 z-0 transition-opacity duration-150",
                          style: _normalizeStyle(swipeState.id === g.id && swipeState.currentX < -20 ? 'opacity:1' : 'opacity:0; pointer-events:none')
                        }, [...(_cache[49] || (_cache[49] = [_createElementVNode("i", {
                          "data-lucide": "trash-2",
                          class: "text-white w-6 h-6"
                        }, null, -1), _createElementVNode("i", {
                          "data-lucide": "trash-2",
                          class: "text-white w-6 h-6"
                        }, null, -1)]))], 4), _createElementVNode("div", {
                          class: "p-4 sm:p-4.5 flex items-center justify-between relative z-10 swipe-item bg-white border border-[#ede3d8] rounded-3xl cursor-pointer grade-swipe-item shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-[#2d694c]/40 transition-all",
                          onClick: $event => (swipeState.currentX === 0 && (g.isFromPlanner ? openGradeFromPlannerTask(g.id) : openEditGradeModal(g))),
                          onTouchstart: $event => (!g.isFromPlanner && startSwipe($event, g.id)),
                          onTouchmove: $event => (!g.isFromPlanner && moveSwipe($event)),
                          onTouchend: $event => (!g.isFromPlanner && endSwipe($event, g)),
                          onMousedown: $event => (!g.isFromPlanner && startSwipe($event, g.id)),
                          onMousemove: $event => (!g.isFromPlanner && moveSwipe($event)),
                          onMouseup: $event => (!g.isFromPlanner && endSwipe($event, g)),
                          onMouseleave: $event => (!g.isFromPlanner && endSwipe($event, g, true)),
                          ref_for: true,
                          ref: el => { if(el && !g.isFromPlanner) swipeRefs[g.id] = el },
                          style: {"touch-action":"pan-y"}
                        }, [_createElementVNode("div", _hoisted_174, [(g.isFromPlanner)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_175, [...(_cache[50] || (_cache[50] = [_createElementVNode("i", {
                              "data-lucide": "clock",
                              class: "w-5 h-5 animate-pulse"
                            }, null, -1)]))]))
                          : (g.pending)
                            ? (_openBlock(), _createElementBlock("div", _hoisted_176, [...(_cache[51] || (_cache[51] = [_createElementVNode("i", {
                                "data-lucide": "clock",
                                class: "w-5 h-5"
                              }, null, -1)]))]))
                            : (_openBlock(), _createElementBlock("div", {
                                key: 2,
                                class: "w-12 h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black shrink-0 font-['Epilogue'] shadow-2xs",
                                style: _normalizeStyle({ backgroundColor: selectedSubject.color + '20', color: selectedSubject.color })
                              }, _toDisplayString(g.points), 5)), _createElementVNode("div", _hoisted_177, [_createElementVNode("p", _hoisted_178, _toDisplayString(g.label || g.type), 1), (g.isFromPlanner)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_179, "Antippen, um Note einzutragen"))
                          : _createCommentVNode("", true), _createElementVNode("p", _hoisted_180, _toDisplayString(formatDate(g.date)) + " • " + _toDisplayString(g.type), 1)])]), _createElementVNode("div", _hoisted_181, [(g.pending && !g.isFromPlanner)
                          ? (_openBlock(), _createElementBlock("span", _hoisted_182, "Ausstehend"))
                          : _createCommentVNode("", true), (g.isFromPlanner)
                          ? (_openBlock(), _createElementBlock("button", {
                              key: 1,
                              onClick: _withModifiers($event => (openEditTaskFromPlanner(g.id)), ["stop"]),
                              title: "Aufgabe bearbeiten",
                              class: "w-9 h-9 rounded-full bg-[#f4ece4] border border-[#ede3d8] flex items-center justify-center text-[#1f1b16] hover:bg-[#ede3d8] active:scale-95 transition-all cursor-pointer"
                            }, [...(_cache[52] || (_cache[52] = [_createElementVNode("i", {
                              "data-lucide": "calendar-cog",
                              class: "w-4 h-4"
                            }, null, -1)]))], 8, _hoisted_183))
                          : (_openBlock(), _createElementBlock("button", {
                              key: 2,
                              onClick: _withModifiers($event => (openEditGradeModal(g)), ["stop"]),
                              class: "w-9 h-9 rounded-full bg-[#f4ece4] border border-[#ede3d8] flex items-center justify-center text-[#1f1b16] hover:bg-[#ede3d8] active:scale-95 transition-all cursor-pointer"
                            }, [...(_cache[53] || (_cache[53] = [_createElementVNode("i", {
                              "data-lucide": "edit-2",
                              class: "w-4 h-4"
                            }, null, -1)]))], 8, _hoisted_184))])], 40, _hoisted_173)], 4))
                      }), 128))])])])]))
                    : _createCommentVNode("", true),
                  (currentTab === 'planner' && !selectedSubject)
                    ? (_openBlock(), _createElementBlock("div", {
                        key: 3,
                        class: _normalizeClass(["space-y-6 animate-fade-in", plannerTab === 'calendar' ? 'max-w-3xl lg:max-w-none mx-auto' : 'max-w-4xl mx-auto']),
                        onTouchstart: handlePlannerTouchStart,
                        onTouchmove: handlePlannerTouchMove,
                        onTouchend: handlePlannerTouchEnd
                      }, [
                        _createElementVNode("div", _hoisted_186, [_cache[56] || (_cache[56] = _createElementVNode("div", null, [_createElementVNode("h2", { class: "text-3xl sm:text-4xl font-black text-[#1f1b16] font-['Epilogue'] tracking-tight" }, "Planer & Kalender"), _createElementVNode("p", { class: "text-xs sm:text-sm font-medium text-[#6E665E] mt-1" }, "Lernphasen, Abgaben und Prüfungen im Überblick")], -1)), _createElementVNode("div", _hoisted_187, [_createElementVNode("button", {
                          onClick: openBulkImport,
                          title: "Klausurtermine im Block eintragen",
                          class: "w-10 h-10 rounded-full bg-[#f0e6df] border border-[#ede3d8] flex items-center justify-center text-[#1f1b16] hover:bg-[#e6dcd3] active:scale-95 transition-all cursor-pointer"
                        }, [...(_cache[55] || (_cache[55] = [_createElementVNode("i", {
                          "data-lucide": "clipboard-paste",
                          class: "w-4.5 h-4.5"
                        }, null, -1)]))], 8, _hoisted_188)])]),
                        _createElementVNode("div", _hoisted_189, [_createElementVNode("nav", {
                          class: "liquid-dock relative p-1.5 flex justify-between items-center rounded-full select-none shadow-xs",
                          onTouchstart: _withModifiers(() => {}, ["stop"]),
                          onTouchmove: _withModifiers(() => {}, ["stop"]),
                          onTouchend: _withModifiers(() => {}, ["stop"])
                        }, [
                          _createElementVNode("div", {
                            class: "liquid-glass-glider pointer-events-none",
                            style: _normalizeStyle({
                                     width: 'calc((100% - 12px) / 4)',
                                     left: `calc(6px + ${activePlannerSubNavIndex} * ((100% - 12px) / 4))`
                                 })
                          }, [...(_cache[57] || (_cache[57] = [_createElementVNode("div", { class: "glider-specular-top" }, null, -1), _createElementVNode("div", { class: "glider-dot-glow" }, null, -1)]))], 4),
                          _createElementVNode("button", {
                            onClick: $event => {plannerTab = 'calendar'; calendarViewMode = 'month'},
                            class: _normalizeClass(["relative z-10 flex-1 py-2 px-1 rounded-full text-xs sm:text-sm transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap active:scale-95", activePlannerSubNavIndex === 0 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
                          }, [...(_cache[58] || (_cache[58] = [_createElementVNode("span", null, "Monat", -1)]))], 10, _hoisted_191),
                          _createElementVNode("button", {
                            onClick: $event => {plannerTab = 'calendar'; calendarViewMode = 'week'},
                            class: _normalizeClass(["relative z-10 flex-1 py-2 px-1 rounded-full text-xs sm:text-sm transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap active:scale-95", activePlannerSubNavIndex === 1 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
                          }, [...(_cache[59] || (_cache[59] = [_createElementVNode("span", null, "Woche", -1)]))], 10, _hoisted_192),
                          _createElementVNode("button", {
                            onClick: $event => (plannerTab = 'upcoming'),
                            class: _normalizeClass(["relative z-10 flex-1 py-2 px-1 rounded-full text-xs sm:text-sm transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap active:scale-95", activePlannerSubNavIndex === 2 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
                          }, [...(_cache[60] || (_cache[60] = [_createElementVNode("span", null, "Anstehend", -1)]))], 10, _hoisted_193),
                          _createElementVNode("button", {
                            onClick: $event => (plannerTab = 'timetable'),
                            class: _normalizeClass(["relative z-10 flex-1 py-2 px-1 rounded-full text-xs sm:text-sm transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap active:scale-95", activePlannerSubNavIndex === 3 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
                          }, [...(_cache[61] || (_cache[61] = [_createElementVNode("span", null, "Plan", -1)]))], 10, _hoisted_194)
                        ], 40, _hoisted_190)]),
                        (plannerTab === 'upcoming' || plannerTab === 'past')
                          ? (_openBlock(), _createElementBlock("div", _hoisted_195, [_createElementVNode("button", {
                              onClick: $event => (plannerFilter = ['Test','Klausur']),
                              class: _normalizeClass([plannerFilter.length === 2 ? 'toggle-accent-on text-white font-black' : 'bg-white/5 text-slate-400 border border-white/5 font-bold', "px-4.5 py-2.5 rounded-full text-xs uppercase tracking-wider cursor-pointer filter-pill"])
                            }, "Alle", 10, _hoisted_196), _createElementVNode("button", {
                              onClick: $event => (toggleFilterType('Test')),
                              class: _normalizeClass([plannerFilter.length !== 2 && plannerFilter.includes('Test') ? 'toggle-accent-on text-white font-black' : 'bg-white/5 text-slate-400 border border-white/5 font-bold', "px-4.5 py-2.5 rounded-full text-xs uppercase tracking-wider cursor-pointer filter-pill"])
                            }, "Nur Tests", 10, _hoisted_197), _createElementVNode("button", {
                              onClick: $event => (toggleFilterType('Klausur')),
                              class: _normalizeClass([plannerFilter.length !== 2 && plannerFilter.includes('Klausur') ? 'toggle-accent-on text-white font-black' : 'bg-white/5 text-slate-400 border border-white/5 font-bold', "px-4.5 py-2.5 rounded-full text-xs uppercase tracking-wider cursor-pointer filter-pill"])
                            }, "Klausuren", 10, _hoisted_198)]))
                          : _createCommentVNode("", true),
                        (plannerTab === 'upcoming' || plannerTab === 'past')
                          ? (_openBlock(), _createElementBlock("div", _hoisted_199, [taskSelectionMode
                              ? (_openBlock(), _createElementBlock("div", _hoisted_200, [_createElementVNode("button", {
                                  onClick: exitTaskSelectionMode,
                                  class: "text-xs font-black uppercase text-slate-300 cursor-pointer"
                                }, "Abbrechen", 8, _hoisted_201), _createElementVNode("span", _hoisted_202, _toDisplayString(selectedTaskIds.size) + " ausgewählt", 1), _createElementVNode("button", {
                                  onClick: deleteSelectedTasks,
                                  disabled: selectedTaskIds.size === 0,
                                  class: "flex items-center gap-1.5 text-xs font-black uppercase text-rose-400 cursor-pointer disabled:opacity-40"
                                }, [...(_cache[62] || (_cache[62] = [_createElementVNode("i", {
                                  "data-lucide": "trash-2",
                                  class: "w-3.5 h-3.5"
                                }, null, -1), _createTextVNode(" Löschen ", -1)]))], 8, _hoisted_203)]))
                              : _createCommentVNode("", true), (((plannerTab === 'upcoming' ? filteredUpcomingTasks : filteredPastTasks) || []).length === 0)
                              ? (_openBlock(), _createElementBlock("p", _hoisted_204, " Keine Aufgaben in dieser Ansicht. "))
                              : _createCommentVNode("", true), _createElementVNode("div", _hoisted_205, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList((plannerTab === 'upcoming' ? filteredUpcomingTasks : filteredPastTasks), (t, tIdx) => {
                              return (_openBlock(), _createElementBlock("div", {
                                key: t.id,
                                class: _normalizeClass(["relative group rounded-3xl task-list-item", leavingTasks.has(t.id) ? 'task-item-leaving' : (taskSwipeState.id === t.id ? 'overflow-hidden' : 'overflow-visible')]),
                                "data-task-id": t.id,
                                style: _normalizeStyle({ animationDelay: (tIdx * 0.045) + 's' })
                              }, [_createElementVNode("div", {
                                class: "absolute inset-0 bg-rose-600 rounded-3xl flex items-center justify-end px-6 z-0 transition-opacity duration-150",
                                style: _normalizeStyle(taskSwipeState.id === t.id && taskSwipeState.currentX < -20 ? 'opacity:1' : 'opacity:0; pointer-events:none')
                              }, [...(_cache[63] || (_cache[63] = [_createElementVNode("i", {
                                "data-lucide": "trash-2",
                                class: "text-white w-6 h-6"
                              }, null, -1)]))], 4), _createElementVNode("div", {
                                class: "absolute inset-0 bg-accent rounded-3xl flex items-center justify-start px-6 z-0 transition-opacity duration-150",
                                style: _normalizeStyle(taskSwipeState.id === t.id && taskSwipeState.currentX > 20 ? 'opacity:1' : 'opacity:0; pointer-events:none')
                              }, [...(_cache[64] || (_cache[64] = [_createElementVNode("i", {
                                "data-lucide": "edit-2",
                                class: "text-white w-6 h-6"
                              }, null, -1)]))], 4), _createElementVNode("div", {
                                class: _normalizeClass(["p-3.5 flex items-center justify-between relative z-10 swipe-item modal-glass border rounded-3xl", [taskSelectionMode && selectedTaskIds.has(t.id) ? 'border-accent bg-accent-dim' : '', t.isGoogleEvent ? 'border-[#4285F4]/20' : '']]),
                                onTouchstart: _withModifiers($event => ((taskSelectionMode || t.isGoogleEvent) ? null : (startTaskSwipe($event, t.id), taskLongPressStart($event, t.id))), ["stop"]),
                                onTouchmove: _withModifiers($event => ((taskSelectionMode || t.isGoogleEvent) ? null : (moveTaskSwipe($event), taskLongPressMove($event))), ["stop"]),
                                onTouchend: _withModifiers($event => (taskSelectionMode ? toggleTaskSelection(t.id) : (t.isGoogleEvent ? null : (endTaskSwipe($event, t), taskLongPressEnd()))), ["stop"]),
                                onMousedown: $event => ((taskSelectionMode || t.isGoogleEvent) ? null : startTaskSwipe($event, t.id)),
                                onMousemove: $event => ((taskSelectionMode || t.isGoogleEvent) ? null : moveTaskSwipe($event)),
                                onMouseup: $event => (taskSelectionMode ? toggleTaskSelection(t.id) : (t.isGoogleEvent ? null : endTaskSwipe($event, t))),
                                onMouseleave: $event => ((taskSelectionMode || t.isGoogleEvent) ? null : endTaskSwipe($event, t, true)),
                                ref_for: true,
                                ref: el => { if(el) taskSwipeRefs[t.id] = el },
                                style: {"touch-action":"pan-y"}
                              }, [_createElementVNode("div", _hoisted_208, [taskSelectionMode
                                ? (_openBlock(), _createElementBlock("button", {
                                    key: 0,
                                    onClick: _withModifiers($event => (toggleTaskSelection(t.id)), ["stop"]),
                                    class: _normalizeClass(["shrink-0 w-8.5 h-8.5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors", selectedTaskIds.has(t.id) ? 'bg-accent border-accent' : 'border-slate-500'])
                                  }, [(selectedTaskIds.has(t.id))
                                    ? (_openBlock(), _createElementBlock("i", _hoisted_210))
                                    : _createCommentVNode("", true)], 10, _hoisted_209))
                                : (t.isGoogleEvent)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_211, [...(_cache[65] || (_cache[65] = [_createElementVNode("i", {
                                      "data-lucide": "calendar",
                                      class: "w-4 h-4 text-[#4285F4]"
                                    }, null, -1)]))]))
                                  : (_openBlock(), _createElementBlock("button", {
                                      key: 2,
                                      onClick: _withModifiers($event => (toggleTaskDone(t, $event)), ["stop"]),
                                      class: _normalizeClass(["task-done-btn shrink-0 w-8.5 h-8.5 rounded-full border-2 flex items-center justify-center cursor-pointer relative", t.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-accent'])
                                    }, [(t.done)
                                      ? (_openBlock(), _createElementBlock("i", _hoisted_213))
                                      : _createCommentVNode("", true)], 10, _hoisted_212)), _createElementVNode("div", _hoisted_214, [
                                _createElementVNode("div", _hoisted_215, [_createElementVNode("span", {
                                  class: "w-2.5 h-2.5 rounded-full shrink-0",
                                  style: _normalizeStyle({ backgroundColor: t.subject.color })
                                }, null, 4), _createElementVNode("span", _hoisted_216, _toDisplayString(t.subject.name), 1)]),
                                _createElementVNode("h4", { class: _normalizeClass(["font-bold text-white text-sm sm:text-base mt-1 leading-tight truncate pr-1", {'line-through text-slate-500': t.done}]) }, _toDisplayString(t.title), 3),
                                _createElementVNode("p", _hoisted_217, [_createTextVNode(_toDisplayString(t.type) + " • " + _toDisplayString(formatDate(t.date)) + " ", 1), (t.notes)
                                  ? (_openBlock(), _createElementBlock("i", _hoisted_218))
                                  : _createCommentVNode("", true)]),
                                (t.type !== 'Hausaufgabe' && t.studyProgress > 0)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_219, [_createElementVNode("div", _hoisted_220, [_createElementVNode("div", {
                                      class: "h-full rounded-full",
                                      style: _normalizeStyle({ width: t.studyProgress + '%', backgroundColor: progressColor(t.studyProgress) })
                                    }, null, 4)]), _createElementVNode("span", {
                                      class: "text-[9px] font-bold",
                                      style: _normalizeStyle({ color: progressColor(t.studyProgress) })
                                    }, _toDisplayString(t.studyProgress) + "%", 5)]))
                                  : _createCommentVNode("", true)
                              ])]), (t.isGoogleEvent)
                                ? (_openBlock(), _createElementBlock("a", {
                                    key: 0,
                                    href: t.htmlLink,
                                    target: "_blank",
                                    rel: "noopener",
                                    onClick: _withModifiers(() => {}, ["stop"]),
                                    class: "shrink-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 active:bg-accent-dim transition-colors cursor-pointer"
                                  }, [...(_cache[66] || (_cache[66] = [_createElementVNode("i", {
                                    "data-lucide": "external-link",
                                    class: "w-4.5 h-4.5"
                                  }, null, -1)]))], 8, _hoisted_221))
                                : _createCommentVNode("", true)], 42, _hoisted_207)], 14, _hoisted_206))
                            }), 128))])]))
                          : _createCommentVNode("", true),
                        (plannerTab === 'timetable')
                          ? (_openBlock(), _createElementBlock("div", _hoisted_222, [
                              _cache[68] || (_cache[68] = _createElementVNode("div", null, [_createElementVNode("h3", { class: "font-bold text-[#1f1b16] text-lg font-['Epilogue'] mb-1" }, "Dein Stundenplan"), _createElementVNode("p", { class: "text-xs text-[#6E665E] leading-relaxed" }, "Trag ein, welche Fächer du an welchem Tag hast. Beim Anlegen einer Klausur oder Hausaufgabe siehst du dann direkt, wann das Fach stattfindet.")], -1)),
                              _createElementVNode("div", {
                                class: "flex gap-2 overflow-x-auto no-scrollbar pb-1",
                                onTouchstart: _withModifiers(() => {}, ["stop"]),
                                onTouchmove: _withModifiers(() => {}, ["stop"]),
                                onTouchend: _withModifiers(() => {}, ["stop"])
                              }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(weekdayKeys.slice(0,5), (wd) => {
                                return (_openBlock(), _createElementBlock("button", {
                                  key: wd,
                                  onClick: $event => (timetableEditDay = wd),
                                  class: _normalizeClass([timetableEditDay === wd ? 'bg-[#2d694c] text-white font-black shadow-xs' : 'bg-[#ede4dc] text-[#6E665E] hover:text-[#1f1b16] font-bold', "px-4 py-2 rounded-full text-xs uppercase tracking-wider cursor-pointer shrink-0 transition-colors"])
                                }, _toDisplayString(weekdayLabels[wd].slice(0,2)), 11, _hoisted_224))
                              }), 128))], 40, _hoisted_223),
                              _createElementVNode("div", null, [_createElementVNode("p", _hoisted_225, _toDisplayString(weekdayLabels[timetableEditDay]) + " — Fächer antippen", 1), (!subjects || subjects.length === 0)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_226, "Lege zuerst Fächer an, um sie hier einzutragen."))
                                : _createCommentVNode("", true), _createElementVNode("div", _hoisted_227, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(subjects, (s) => {
                                return (_openBlock(), _createElementBlock("button", {
                                  key: s.id,
                                  onClick: $event => (toggleTimetableSubject(timetableEditDay, s.id)),
                                  class: _normalizeClass(["flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs", (timetable[timetableEditDay] || []).includes(s.id) ? 'text-white border-transparent' : 'bg-[#f4ece4] text-[#1f1b16] border-[#ede3d8]']),
                                  style: _normalizeStyle((timetable[timetableEditDay] || []).includes(s.id) ? { backgroundColor: s.color } : {})
                                }, [_createElementVNode("span", {
                                  class: "w-2 h-2 rounded-full shrink-0",
                                  style: _normalizeStyle({ backgroundColor: (timetable[timetableEditDay] || []).includes(s.id) ? 'rgba(255,255,255,0.7)' : s.color })
                                }, null, 4), _createTextVNode(" " + _toDisplayString(s.name), 1)], 14, _hoisted_228))
                              }), 128))])]),
                              _createElementVNode("div", _hoisted_229, [_cache[67] || (_cache[67] = _createElementVNode("p", { class: "text-xs font-bold text-[#6E665E] uppercase tracking-wider" }, "Wochenübersicht", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(weekdayKeys.slice(0,5), (wd) => {
                                return (_openBlock(), _createElementBlock("div", {
                                  key: 'ov-'+wd,
                                  class: "flex items-center gap-3"
                                }, [_createElementVNode("span", _hoisted_230, _toDisplayString(weekdayLabels[wd].slice(0,2)), 1), _createElementVNode("div", _hoisted_231, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList((timetable[wd] || []), (sid) => {
                                  return (_openBlock(), _createElementBlock("span", {
                                    key: sid,
                                    class: "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                                    style: _normalizeStyle({ backgroundColor: (subjects.find(s => s.id === sid)?.color || '#666') + '22', color: subjects.find(s => s.id === sid)?.color || '#524d44' })
                                  }, _toDisplayString(subjects.find(s => s.id === sid)?.name || '?'), 5))
                                }), 128)), ((timetable[wd] || []).length === 0)
                                  ? (_openBlock(), _createElementBlock("span", _hoisted_232, "—"))
                                  : _createCommentVNode("", true)])]))
                              }), 128))])
                            ]))
                          : _createCommentVNode("", true),
                        (plannerTab === 'calendar')
                          ? (_openBlock(), _createElementBlock("div", _hoisted_233, [_createElementVNode("div", _hoisted_234, [
                              _createElementVNode("div", _hoisted_235, [_createElementVNode("div", _hoisted_236, [_cache[69] || (_cache[69] = _createElementVNode("div", { class: "w-9 h-9 rounded-xl bg-[#2d694c]/10 flex items-center justify-center text-[#2d694c] shrink-0" }, [_createElementVNode("i", {
                                "data-lucide": "calendar",
                                class: "w-5 h-5"
                              })], -1)), _createElementVNode("h3", _hoisted_237, _toDisplayString(calendarViewMode === 'week' ? 'KW ' + currentKW + ' • ' : '') + _toDisplayString(monthNames[calMonth]) + " " + _toDisplayString(calYear), 1)]), _createElementVNode("div", _hoisted_238, [_createElementVNode("span", _hoisted_239, _toDisplayString(currentClass >= 11 ? (selectedHalfYear.startsWith('11') ? 'Q1' : 'Q2') + ' Halbjahr' : 'Klasse ' + currentClass), 1), _createElementVNode("button", {
                                onClick: $event => (navigateCalendar(-1)),
                                title: calendarViewMode === 'week' ? 'Vorherige Woche' : 'Vorheriger Monat',
                                class: "w-8.5 h-8.5 rounded-full bg-[#f3ebe3] hover:bg-[#eae0d5] flex items-center justify-center text-[#1f1b16] active:scale-95 transition-all cursor-pointer"
                              }, [...(_cache[70] || (_cache[70] = [_createElementVNode("i", {
                                "data-lucide": "chevron-left",
                                class: "w-4 h-4"
                              }, null, -1)]))], 8, _hoisted_240), _createElementVNode("button", {
                                onClick: $event => (navigateCalendar(1)),
                                title: calendarViewMode === 'week' ? 'Nächste Woche' : 'Nächster Monat',
                                class: "w-8.5 h-8.5 rounded-full bg-[#f3ebe3] hover:bg-[#eae0d5] flex items-center justify-center text-[#1f1b16] active:scale-95 transition-all cursor-pointer"
                              }, [...(_cache[71] || (_cache[71] = [_createElementVNode("i", {
                                "data-lucide": "chevron-right",
                                class: "w-4 h-4"
                              }, null, -1)]))], 8, _hoisted_241)])]),
                              _cache[73] || (_cache[73] = _createElementVNode("div", { class: "grid grid-cols-7 gap-1 text-center mb-3" }, [
                                _createElementVNode("div", { class: "text-xs font-bold text-[#6E665E] py-1" }, "MO"),
                                _createElementVNode("div", { class: "text-xs font-bold text-[#6E665E] py-1" }, "DI"),
                                _createElementVNode("div", { class: "text-xs font-bold text-[#6E665E] py-1" }, "MI"),
                                _createElementVNode("div", { class: "text-xs font-bold text-[#6E665E] py-1" }, "DO"),
                                _createElementVNode("div", { class: "text-xs font-bold text-[#6E665E] py-1" }, "FR"),
                                _createElementVNode("div", { class: "text-xs font-bold text-[#b45309] py-1" }, "SA"),
                                _createElementVNode("div", { class: "text-xs font-bold text-[#b45309] py-1" }, "SO")
                              ], -1)),
                              _createElementVNode("div", _hoisted_242, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList((calendarViewMode === 'week' ? currentWeekDays : calendarDays), (day, idx) => {
                                return (_openBlock(), _createElementBlock("div", {
                                  key: idx,
                                  onClick: $event => (selectCalendarDay(day.date)),
                                  class: _normalizeClass(["flex flex-col items-center justify-center py-1 sm:py-1.5 relative rounded-xl cursor-pointer transition-colors", [
                                         (calendarViewMode !== 'week' && !day.isCurrentMonth) ? 'text-[#c4bbb1] opacity-60' : 'text-[#1f1b16]',
                                         selectedCalendarDate === day.date ? 'font-bold' : ''
                                     ]])
                                }, [_createElementVNode("div", { class: _normalizeClass(["w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all", selectedCalendarDate === day.date ? 'bg-[#fed8b1] text-[#825500] font-black shadow-xs ring-2 ring-[#e6a86c]' : (isToday(day.date) ? 'ring-2 ring-[#2d694c] font-bold text-[#2d694c]' : 'hover:bg-[#f5efe7]')]) }, _toDisplayString(day.day), 3), (day.tasks && day.tasks.length > 0)
                                  ? (_openBlock(), _createElementBlock("div", _hoisted_244, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(day.tasks.slice(0, 3), (t, i) => {
                                      return (_openBlock(), _createElementBlock("span", {
                                        key: i,
                                        class: _normalizeClass(["w-1.5 h-1.5 rounded-full shrink-0 shadow-xs", t.type === 'Klausur' ? 'bg-[#dc2626]' : (t.type === 'Test' ? 'bg-[#3b82f6]' : (t.type === 'Hausaufgabe' ? 'bg-[#f59e0b]' : 'bg-[#10b981]'))])
                                      }, null, 2))
                                    }), 128))]))
                                  : (_openBlock(), _createElementBlock("div", _hoisted_245))], 10, _hoisted_243))
                              }), 128))]),
                              _cache[74] || (_cache[74] = _createElementVNode("div", { class: "mt-4 pt-3.5 border-t border-[#f4ede6] flex flex-wrap items-center justify-start gap-x-5 gap-y-2 text-xs font-semibold text-[#1f1b16]" }, [
                                _createElementVNode("div", { class: "flex items-center gap-1.5" }, [_createElementVNode("span", { class: "w-2.5 h-2.5 rounded-full bg-[#dc2626]" }), _createElementVNode("span", null, "Klausur")]),
                                _createElementVNode("div", { class: "flex items-center gap-1.5" }, [_createElementVNode("span", { class: "w-2.5 h-2.5 rounded-full bg-[#3b82f6]" }), _createElementVNode("span", null, "Test / Abfrage")]),
                                _createElementVNode("div", { class: "flex items-center gap-1.5" }, [_createElementVNode("span", { class: "w-2.5 h-2.5 rounded-full bg-[#f59e0b]" }), _createElementVNode("span", null, "Hausaufgabe / Projekt")]),
                                _createElementVNode("div", { class: "flex items-center gap-1.5" }, [_createElementVNode("span", { class: "w-2.5 h-2.5 rounded-full bg-[#10b981]" }), _createElementVNode("span", null, "Lernblock")])
                              ], -1)),
                              _createElementVNode("div", _hoisted_246, [_createElementVNode("div", _hoisted_247, [_cache[72] || (_cache[72] = _createElementVNode("div", { class: "flex items-center gap-2" }, [_createElementVNode("i", {
                                "data-lucide": "bar-chart-2",
                                class: "w-4.5 h-4.5 text-[#2d694c]"
                              }), _createElementVNode("h4", { class: "font-bold text-xs sm:text-sm text-[#1f1b16]" }, "Wochen-Arbeitslast & Prüfungsdruck")], -1)), _createElementVNode("span", _hoisted_248, " KW " + _toDisplayString(currentKW) + " • " + _toDisplayString(weeklyWorkloadIntensityLabel), 1)]), _createElementVNode("div", _hoisted_249, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(currentWeekWorkloadDays, (wd) => {
                                return (_openBlock(), _createElementBlock("div", {
                                  key: wd.date,
                                  onClick: $event => (selectCalendarDay(wd.date)),
                                  class: _normalizeClass(["flex flex-col items-center justify-between p-1.5 sm:p-2 rounded-2xl cursor-pointer transition-all active:scale-95", selectedCalendarDate === wd.date ? 'bg-[#fed8b1]/35 shadow-xs ring-2 ring-[#e6a86c]' : 'bg-[#f7f2ea]/70 hover:bg-[#ede4dc]'])
                                }, [_createElementVNode("div", { class: _normalizeClass(["w-full h-11 rounded-xl flex items-end p-0.5 overflow-hidden", wd.intensityBg]) }, [_createElementVNode("div", {
                                  class: _normalizeClass(["w-full rounded-lg transition-all duration-300", wd.intensityFill]),
                                  style: _normalizeStyle({ height: wd.barHeight })
                                }, null, 6)], 2), _createElementVNode("span", { class: _normalizeClass(["text-[10px] font-bold mt-1.5 leading-tight", wd.isWeekend ? 'text-[#b45309]' : 'text-[#6E665E]']) }, _toDisplayString(wd.dayLabel), 3), _createElementVNode("span", { class: _normalizeClass(["text-xs font-black leading-tight", selectedCalendarDate === wd.date ? 'text-[#825500]' : 'text-[#1f1b16]']) }, _toDisplayString(wd.day), 3)], 10, _hoisted_250))
                              }), 128))])])
                            ]), _createElementVNode("div", _hoisted_251, [
                              _createElementVNode("div", _hoisted_252, [_createElementVNode("div", _hoisted_253, [_createElementVNode("div", _hoisted_254, [_cache[76] || (_cache[76] = _createElementVNode("div", { class: "w-9 h-9 rounded-2xl bg-[#fed8b1] text-[#825500] flex items-center justify-center font-bold shrink-0 shadow-2xs" }, [_createElementVNode("i", {
                                "data-lucide": "clock",
                                class: "w-4.5 h-4.5"
                              })], -1)), _createElementVNode("div", null, [_cache[75] || (_cache[75] = _createElementVNode("span", { class: "text-[10px] font-bold uppercase tracking-wider text-[#6E665E] block leading-none" }, "Tages-Fokus", -1)), _createElementVNode("h3", _hoisted_255, _toDisplayString(selectedDayFormattedLong), 1)])]), _createElementVNode("div", _hoisted_256, [(isToday(selectedCalendarDate))
                                ? (_openBlock(), _createElementBlock("span", _hoisted_257, " Heute "))
                                : _createCommentVNode("", true), _createElementVNode("span", _hoisted_258, _toDisplayString(selectedDayFocusTasks.length) + " " + _toDisplayString(selectedDayFocusTasks.length === 1 ? 'Eintrag' : 'Einträge'), 1)])]), _createElementVNode("div", _hoisted_259, [_cache[77] || (_cache[77] = _createElementVNode("span", { class: "text-xs font-bold text-[#6E665E] shrink-0" }, "Stundenplan:", -1)), (selectedDayTimetableLessons.length > 0)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_260, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(selectedDayTimetableLessons, (subj) => {
                                    return (_openBlock(), _createElementBlock("span", {
                                      key: subj.id,
                                      class: "text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-black/5",
                                      style: _normalizeStyle({ backgroundColor: subj.color + '20', color: subj.color })
                                    }, _toDisplayString(subj.name) + " " + _toDisplayString(subj.isLK ? '(LK)' : ''), 5))
                                  }), 128))]))
                                : (_openBlock(), _createElementBlock("span", _hoisted_261, " Keine regulären Unterrichtsstunden (Wochenende / Frei) ☕ "))])]),
                              (selectedDayFocusTasks.length === 0)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_262, [
                                    _cache[79] || (_cache[79] = _createElementVNode("div", { class: "w-12 h-12 rounded-full bg-[#f4ece4] flex items-center justify-center mx-auto mb-2 text-[#6E665E]" }, [_createElementVNode("i", {
                                      "data-lucide": "calendar-check",
                                      class: "w-6 h-6 text-[#2d694c]"
                                    })], -1)),
                                    _cache[80] || (_cache[80] = _createElementVNode("p", { class: "font-bold text-sm text-[#1f1b16]" }, "Keine Aufgaben oder Prüfungen an diesem Tag", -1)),
                                    _cache[81] || (_cache[81] = _createElementVNode("p", { class: "text-xs text-[#6E665E] mt-0.5" }, "Nutze den Tag zum Wiederholen oder Entspannen.", -1)),
                                    _createElementVNode("button", {
                                      onClick: $event => (openTaskModalWithDate(selectedCalendarDate)),
                                      class: "mt-4 px-4 py-2.5 rounded-full bg-[#2d694c] hover:bg-[#23533c] !text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-xs"
                                    }, [_cache[78] || (_cache[78] = _createElementVNode("i", {
                                      "data-lucide": "plus",
                                      class: "w-4 h-4 !text-white"
                                    }, null, -1)), _createElementVNode("span", _hoisted_264, "+ Termin für " + _toDisplayString(selectedDayFormattedShort) + " anlegen", 1)], 8, _hoisted_263)
                                  ]))
                                : (_openBlock(), _createElementBlock("div", _hoisted_265, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(selectedDayFocusTasks, (t) => {
                                    return (_openBlock(), _createElementBlock("div", {
                                      key: t.id,
                                      class: "bg-white rounded-[1.75rem] p-4 sm:p-5 border border-[#f0e8df] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex gap-4 items-start relative hover:shadow-md transition-shadow"
                                    }, [_createElementVNode("div", { class: _normalizeClass(["w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 font-black shadow-xs", t.type === 'Klausur' ? 'bg-[#fed8b1] text-[#825500]' : (t.type === 'Test' ? 'bg-[#dbeafe] text-[#1d4ed8]' : 'bg-[#ede4dc] text-[#524d44]')]) }, [_createElementVNode("span", _hoisted_266, _toDisplayString(getWeekdayAbbr(t.date)), 1), _createElementVNode("span", _hoisted_267, _toDisplayString(getDayOfMonth(t.date)), 1)], 2), _createElementVNode("div", _hoisted_268, [
                                      _createElementVNode("div", _hoisted_269, [_createElementVNode("span", { class: _normalizeClass(["px-2.5 py-0.5 rounded-full text-[11px] font-bold", t.type === 'Klausur' ? 'bg-[#fee2e2] text-[#b91c1c]' : (t.type === 'Test' ? 'bg-[#dbeafe] text-[#1d4ed8]' : 'bg-[#fef3c7] text-[#92400e]')]) }, _toDisplayString(t.type) + " • " + _toDisplayString(getDaysUntilStr(t.date)), 3), (t.subject)
                                        ? (_openBlock(), _createElementBlock("span", _hoisted_270, _toDisplayString(t.subject.isLK ? 'LK' : 'GK') + " • " + _toDisplayString(t.subject.name), 1))
                                        : _createCommentVNode("", true)]),
                                      _createElementVNode("h4", { class: _normalizeClass(["font-bold text-base text-[#1f1b16] font-['Epilogue'] leading-snug truncate", {'line-through text-[#857e72]': t.done}]) }, _toDisplayString(t.title), 3),
                                      _createElementVNode("p", _hoisted_271, _toDisplayString(t.notes || (t.type === 'Klausur' ? 'Klausurblock • Vorbereitung mit Zusammenfassung' : 'Reguläre Unterrichtsstunde')), 1),
                                      _createElementVNode("div", _hoisted_272, [_createElementVNode("div", _hoisted_273, [(t.studyProgress >= 100)
                                        ? (_openBlock(), _createElementBlock("span", _hoisted_274, "✓ 100% Gelernt"))
                                        : (t.studyProgress > 0)
                                          ? (_openBlock(), _createElementBlock("span", _hoisted_275, "📖 " + _toDisplayString(t.studyProgress) + "% gelernt", 1))
                                          : (_openBlock(), _createElementBlock("span", _hoisted_276, "🕒 Zusammenfassung offen"))]), _createElementVNode("div", _hoisted_277, [(!t.isGoogleEvent)
                                        ? (_openBlock(), _createElementBlock("button", {
                                            key: 0,
                                            onClick: $event => (toggleTaskDone(t, $event)),
                                            class: _normalizeClass(["w-8.5 h-8.5 rounded-full border border-[#ded5c7] flex items-center justify-center cursor-pointer relative", t.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-[#f3ebe3] text-[#524d44] hover:bg-[#eadecf]'])
                                          }, [(t.done)
                                            ? (_openBlock(), _createElementBlock("i", _hoisted_279))
                                            : (_openBlock(), _createElementBlock("i", _hoisted_280))], 10, _hoisted_278))
                                        : _createCommentVNode("", true), (!t.isGoogleEvent)
                                        ? (_openBlock(), _createElementBlock("button", {
                                            key: 1,
                                            onClick: $event => (openEditTaskModal(t)),
                                            class: "w-8.5 h-8.5 rounded-full bg-[#f3ebe3] hover:bg-[#eae0d5] flex items-center justify-center text-[#524d44] active:scale-95 transition-all cursor-pointer"
                                          }, [...(_cache[82] || (_cache[82] = [_createElementVNode("i", {
                                            "data-lucide": "more-horizontal",
                                            class: "w-4 h-4"
                                          }, null, -1)]))], 8, _hoisted_281))
                                        : (_openBlock(), _createElementBlock("a", {
                                            key: 2,
                                            href: t.htmlLink,
                                            target: "_blank",
                                            rel: "noopener",
                                            class: "w-8.5 h-8.5 rounded-full bg-[#f3ebe3] hover:bg-[#eae0d5] flex items-center justify-center text-[#524d44] active:scale-95 transition-all cursor-pointer"
                                          }, [...(_cache[83] || (_cache[83] = [_createElementVNode("i", {
                                            "data-lucide": "external-link",
                                            class: "w-4 h-4"
                                          }, null, -1)]))], 8, _hoisted_282))])])
                                    ])]))
                                  }), 128))])),
                              (otherWeekUpcomingTasks.length > 0)
                                ? (_openBlock(), _createElementBlock("div", _hoisted_283, [_createElementVNode("div", _hoisted_284, [_createElementVNode("h4", _hoisted_285, [_cache[84] || (_cache[84] = _createElementVNode("i", {
                                    "data-lucide": "calendar-days",
                                    class: "w-4 h-4 text-[#2d694c]"
                                  }, null, -1)), _createElementVNode("span", null, "Weitere Termine in dieser Woche (KW " + _toDisplayString(currentKW) + ")", 1)]), _createElementVNode("button", {
                                    onClick: $event => (plannerTab = 'upcoming'),
                                    class: "text-xs font-bold text-[#2d694c] hover:underline cursor-pointer"
                                  }, " Alle ansehen ", 8, _hoisted_286)]), _createElementVNode("div", _hoisted_287, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(otherWeekUpcomingTasks, (t) => {
                                    return (_openBlock(), _createElementBlock("div", {
                                      key: t.id,
                                      onClick: $event => (selectCalendarDay(t.date)),
                                      class: "bg-white/90 hover:bg-white rounded-2xl p-3 sm:p-3.5 border border-[#ede3d8] flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-xs"
                                    }, [_createElementVNode("div", _hoisted_289, [_createElementVNode("div", { class: _normalizeClass(["w-9 h-9 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold text-[9.5px]", t.type === 'Klausur' ? 'bg-[#fed8b1] text-[#825500]' : 'bg-[#ede4dc] text-[#524d44]']) }, [_createElementVNode("span", null, _toDisplayString(getWeekdayAbbr(t.date)), 1), _createElementVNode("span", _hoisted_290, _toDisplayString(getDayOfMonth(t.date)), 1)], 2), _createElementVNode("div", _hoisted_291, [_createElementVNode("p", _hoisted_292, _toDisplayString(t.title), 1), _createElementVNode("p", _hoisted_293, _toDisplayString(t.type) + " • " + _toDisplayString(t.subject ? t.subject.name : ''), 1)])]), _createElementVNode("div", _hoisted_294, [_createElementVNode("span", _hoisted_295, _toDisplayString(getDaysUntilStr(t.date)), 1), _cache[85] || (_cache[85] = _createElementVNode("i", {
                                      "data-lucide": "chevron-right",
                                      class: "w-4 h-4 text-[#857e72]"
                                    }, null, -1))])], 8, _hoisted_288))
                                  }), 128))])]))
                                : _createCommentVNode("", true),
                              _createElementVNode("button", {
                                onClick: $event => (openTaskModalWithDate(selectedCalendarDate)),
                                class: "w-full bg-[#2d694c] hover:bg-[#23533c] active:scale-98 !text-white rounded-full py-4 px-6 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md cursor-pointer transition-all mt-4"
                              }, [...(_cache[86] || (_cache[86] = [_createElementVNode("i", {
                                "data-lucide": "plus-circle",
                                class: "w-5 h-5 !text-white"
                              }, null, -1), _createElementVNode("span", { class: "!text-white" }, "Neuer Termin / Aufgabe hinzufügen", -1)]))], 8, _hoisted_296)
                            ])]))
                          : _createCommentVNode("", true)
                      ], 42, _hoisted_185))
                    : _createCommentVNode("", true),
                  (currentTab === 'abitur' && !selectedSubject)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_297, [
                        _createElementVNode("div", _hoisted_298, [_createElementVNode("h2", _hoisted_299, _toDisplayString(currentClass >= 11 ? 'Abi' : 'Zeugnisübersicht'), 1), _cache[87] || (_cache[87] = _createElementVNode("p", { class: "text-xs sm:text-sm font-semibold text-[#6E665E] mt-1" }, "Halbjahresübersicht aller Fächer", -1))]),
                        (currentClass <= 10)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_300, [_cache[88] || (_cache[88] = _createElementVNode("p", { class: "text-xs font-bold uppercase tracking-wider text-[#6E665E] mb-3" }, "Klasse anzeigen", -1)), _createElementVNode("div", _hoisted_301, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(lowerSchoolClasses, (k) => {
                              return (_openBlock(), _createElementBlock("button", {
                                key: k,
                                onClick: $event => (abiturViewClass = k),
                                class: _normalizeClass([abiturViewClass === k ? 'bg-[#2d694c] text-white font-black shadow-xs' : 'bg-[#ede4dc] text-[#6E665E] hover:text-[#1f1b16]', "px-4 py-2 rounded-full text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"])
                              }, " Kl. " + _toDisplayString(k), 11, _hoisted_302))
                            }), 128))])]))
                          : _createCommentVNode("", true),
                        (currentClass >= 11)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_303, [_cache[89] || (_cache[89] = _createElementVNode("p", { class: "text-xs font-bold uppercase tracking-wider text-[#6E665E] mb-3" }, "Klasse für Verlaufsansicht", -1)), _createElementVNode("div", _hoisted_304, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([5,6,7,8,9,10], (k) => {
                              return (_openBlock(), _createElementBlock("button", {
                                key: k,
                                onClick: $event => (abiturViewClass = k),
                                class: _normalizeClass([abiturViewClass === k ? 'bg-[#2d694c] text-white font-black shadow-xs' : 'bg-[#ede4dc] text-[#6E665E] hover:text-[#1f1b16]', "px-4 py-2 rounded-full text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"])
                              }, " Kl. " + _toDisplayString(k), 11, _hoisted_305))
                            }), 128)), _createElementVNode("button", {
                              onClick: $event => (abiturViewClass = 'oberstufe'),
                              class: _normalizeClass([abiturViewClass === 'oberstufe' ? 'bg-[#2d694c] text-white font-black shadow-xs' : 'bg-[#ede4dc] text-[#6E665E] hover:text-[#1f1b16]', "px-4 py-2 rounded-full text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"])
                            }, " Oberstufe (11/12) ", 10, _hoisted_306)])]))
                          : _createCommentVNode("", true),
                        (abiturViewClass !== 'oberstufe')
                          ? (_openBlock(), _createElementBlock("div", _hoisted_307, [
                              _createElementVNode("h3", _hoisted_308, [_cache[90] || (_cache[90] = _createElementVNode("i", {
                                "data-lucide": "table",
                                class: "w-5 h-5 text-[#2d694c]"
                              }, null, -1)), _createTextVNode(" Klasse " + _toDisplayString(abiturViewClass) + " – Zeugnisnoten ", 1)]),
                              _createElementVNode("p", _hoisted_309, "Zeugnisnoten für Halbjahr 1 und 2 der Klasse " + _toDisplayString(abiturViewClass) + ".", 1),
                              _createElementVNode("div", _hoisted_310, [_createElementVNode("table", _hoisted_311, [_cache[92] || (_cache[92] = _createElementVNode("thead", null, [_createElementVNode("tr", { class: "text-xs font-bold uppercase text-[#6E665E] border-b border-[#ede3d8]" }, [_createElementVNode("th", { class: "py-3 pr-2 w-[55%]" }, "Fach"), _createElementVNode("th", { class: "py-3 text-center w-[22.5%]" }, "HJ 1"), _createElementVNode("th", { class: "py-3 text-center w-[22.5%]" }, "HJ 2")])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(subjects, (s) => {
                                return (_openBlock(), _createElementBlock("tr", {
                                  key: s.id,
                                  class: "hover:bg-[#f7f3eb] transition-colors text-xs sm:text-sm font-semibold text-[#1f1b16] border-b border-[#f2ebe2]"
                                }, [_createElementVNode("td", _hoisted_312, [_createElementVNode("div", _hoisted_313, [_createElementVNode("span", {
                                  class: "w-2.5 h-2.5 rounded-full inline-block shrink-0",
                                  style: _normalizeStyle({ backgroundColor: s.color })
                                }, null, 4), _createElementVNode("span", _hoisted_314, _toDisplayString(s.name), 1)])]), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList([1,2], (hj) => {
                                  return (_openBlock(), _createElementBlock("td", {
                                    key: hj,
                                    class: "py-3.5 text-center font-extrabold text-sm sm:text-base"
                                  }, [_createElementVNode("div", _hoisted_315, [(s.reportCardGrades?.['k' + abiturViewClass + '_hj' + hj] !== undefined && s.reportCardGrades['k' + abiturViewClass + '_hj' + hj] !== null)
                                    ? (_openBlock(), _createElementBlock("span", _hoisted_316, [_cache[91] || (_cache[91] = _createElementVNode("i", {
                                        "data-lucide": "award",
                                        class: "w-4 h-4 text-[#b45309]"
                                      }, null, -1)), _createElementVNode("span", _hoisted_317, _toDisplayString(s.reportCardGrades['k' + abiturViewClass + '_hj' + hj]), 1)]))
                                    : (_openBlock(), _createElementBlock("span", _hoisted_318, "–"))])]))
                                }), 128))]))
                              }), 128))])])]),
                              _cache[93] || (_cache[93] = _createElementVNode("p", { class: "text-[11px] text-[#6E665E] mt-4 italic" }, "Zeugnisnoten können über den Award-Button ⭐ in der Fachdetailansicht eingetragen werden.", -1))
                            ]))
                          : _createCommentVNode("", true),
                        (abiturViewClass === 'oberstufe')
                          ? (_openBlock(), _createElementBlock("div", _hoisted_319, [_cache[96] || (_cache[96] = _createElementVNode("h3", { class: "text-base font-bold text-[#1f1b16] font-['Epilogue'] mb-3 flex items-center gap-2" }, [_createElementVNode("i", {
                              "data-lucide": "table",
                              class: "w-5 h-5 text-[#2d694c]"
                            }), _createTextVNode(" Zeugnisnoten Oberstufe ")], -1)), _createElementVNode("div", _hoisted_320, [_createElementVNode("table", _hoisted_321, [_cache[95] || (_cache[95] = _createElementVNode("thead", null, [_createElementVNode("tr", { class: "text-xs font-bold uppercase text-[#6E665E] border-b border-[#ede3d8]" }, [
                              _createElementVNode("th", { class: "py-3 pr-2 w-[35%]" }, "Fach"),
                              _createElementVNode("th", { class: "py-3 text-center w-[11%]" }, "LK"),
                              _createElementVNode("th", { class: "py-3 text-center w-[13.5%]" }, "11/1"),
                              _createElementVNode("th", { class: "py-3 text-center w-[13.5%]" }, "11/2"),
                              _createElementVNode("th", { class: "py-3 text-center w-[13.5%]" }, "12/1"),
                              _createElementVNode("th", { class: "py-3 text-center w-[13.5%]" }, "12/2")
                            ])], -1)), _createElementVNode("tbody", null, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(subjects, (s) => {
                              return (_openBlock(), _createElementBlock("tr", {
                                key: s.id,
                                class: "hover:bg-[#f7f3eb] transition-colors text-xs sm:text-sm font-semibold text-[#1f1b16] border-b border-[#f2ebe2]"
                              }, [_createElementVNode("td", _hoisted_322, [_createElementVNode("span", {
                                class: "w-2.5 h-2.5 rounded-full inline-block shrink-0",
                                style: _normalizeStyle({ backgroundColor: s.color })
                              }, null, 4), _createElementVNode("span", _hoisted_323, _toDisplayString(s.name), 1)]), _createElementVNode("td", _hoisted_324, [(s.isLK)
                                ? (_openBlock(), _createElementBlock("span", _hoisted_325, "LK"))
                                : (_openBlock(), _createElementBlock("span", _hoisted_326, "GK"))]), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(halfYears, (hy) => {
                                return (_openBlock(), _createElementBlock("td", {
                                  key: hy,
                                  class: "py-3.5 text-center font-extrabold text-sm sm:text-base"
                                }, [_createElementVNode("div", _hoisted_327, [(s.reportCardGrades?.[hy] !== undefined && s.reportCardGrades[hy] !== null)
                                  ? (_openBlock(), _createElementBlock("span", _hoisted_328, [_cache[94] || (_cache[94] = _createElementVNode("i", {
                                      "data-lucide": "award",
                                      class: "w-4 h-4 text-[#b45309]"
                                    }, null, -1)), _createElementVNode("span", _hoisted_329, _toDisplayString(s.reportCardGrades[hy]), 1)]))
                                  : (_openBlock(), _createElementBlock("span", _hoisted_330, _toDisplayString(getCalculatedSemesterPoints(s, hy)), 1))])]))
                              }), 128))]))
                            }), 128))])])])]))
                          : _createCommentVNode("", true)
                      ]))
                    : _createCommentVNode("", true),
                  (currentTab === 'stats' && !selectedSubject)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_331, [
                        _createElementVNode("div", _hoisted_332, [_createElementVNode("div", _hoisted_333, [_createElementVNode("span", _hoisted_334, _toDisplayString(selectedHalfYear), 1), _cache[97] || (_cache[97] = _createElementVNode("span", { class: "text-xs font-bold text-[#6E665E]" }, "Halbjahresauswertung", -1))]), _cache[98] || (_cache[98] = _createElementVNode("h2", { class: "text-3xl sm:text-4xl font-black text-[#1f1b16] font-['Epilogue'] tracking-tight" }, "Insights & Trends", -1)), _cache[99] || (_cache[99] = _createElementVNode("p", { class: "text-xs sm:text-sm font-semibold text-[#6E665E] mt-1" }, "Detaillierte KPI-Übersicht, Punkteverteilung und Notenentwicklung", -1))]),
                        _createElementVNode("div", _hoisted_335, [
                          _createElementVNode("div", _hoisted_336, [_cache[100] || (_cache[100] = _createElementVNode("div", { class: "flex items-center gap-1.5 mb-1" }, [_createElementVNode("span", { class: "w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0" }, [_createElementVNode("i", {
                            "data-lucide": "trending-up",
                            class: "w-3.5 h-3.5 text-emerald-700"
                          })]), _createElementVNode("span", { class: "text-[10px] font-bold uppercase tracking-wider text-[#6E665E] leading-tight" }, "Beste Note")], -1)), _createElementVNode("div", _hoisted_337, _toDisplayString((() => { const sem = processedData?.semesterSubjects || []; const all = sem.flatMap(s => (s.semesterGrades||[]).filter(g=>!g.pending).map(g=>g.points)); if(!all.length) return '-'; return gradeSystem === '6' ? Math.min(...all) : Math.max(...all); })()), 1), _createElementVNode("div", _hoisted_338, _toDisplayString(gradeSystem === '6' ? 'Niedrigste Zahl' : 'Höchste Punktzahl'), 1)]),
                          _createElementVNode("div", _hoisted_339, [_cache[101] || (_cache[101] = _createElementVNode("div", { class: "flex items-center gap-1.5 mb-1" }, [_createElementVNode("span", { class: "w-6 h-6 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0" }, [_createElementVNode("i", {
                            "data-lucide": "trending-down",
                            class: "w-3.5 h-3.5 text-rose-600"
                          })]), _createElementVNode("span", { class: "text-[10px] font-bold uppercase tracking-wider text-[#6E665E] leading-tight" }, "Schwächste")], -1)), _createElementVNode("div", _hoisted_340, _toDisplayString((() => { const sem = processedData?.semesterSubjects || []; const all = sem.flatMap(s => (s.semesterGrades||[]).filter(g=>!g.pending).map(g=>g.points)); if(!all.length) return '-'; return gradeSystem === '6' ? Math.max(...all) : Math.min(...all); })()), 1), _createElementVNode("div", _hoisted_341, _toDisplayString(gradeSystem === '6' ? 'Höchste Zahl' : 'Niedrigste Punktzahl'), 1)]),
                          _createElementVNode("div", _hoisted_342, [_cache[102] || (_cache[102] = _createElementVNode("div", { class: "flex items-center gap-1.5 mb-1" }, [_createElementVNode("span", { class: "w-6 h-6 rounded-full bg-[#2d694c]/15 flex items-center justify-center shrink-0" }, [_createElementVNode("i", {
                            "data-lucide": "hash",
                            class: "w-3.5 h-3.5 text-[#2d694c]"
                          })]), _createElementVNode("span", { class: "text-[10px] font-bold uppercase tracking-wider text-[#6E665E] leading-tight" }, "Noten gesamt")], -1)), _createElementVNode("div", _hoisted_343, _toDisplayString((processedData?.semesterSubjects || []).reduce((a,s)=>a+(s.semesterGrades||[]).filter(g=>!g.pending).length, 0)), 1), _createElementVNode("div", _hoisted_344, "in " + _toDisplayString((processedData?.semesterSubjects || []).length) + " Fächern", 1)]),
                          _createElementVNode("div", _hoisted_345, [_cache[103] || (_cache[103] = _createElementVNode("div", { class: "flex items-center gap-1.5 mb-1" }, [_createElementVNode("span", { class: "w-6 h-6 rounded-full bg-[#fed8b1] flex items-center justify-center shrink-0" }, [_createElementVNode("i", {
                            "data-lucide": "bar-chart-2",
                            class: "w-3.5 h-3.5 text-[#825500]"
                          })]), _createElementVNode("span", { class: "text-[10px] font-bold uppercase tracking-wider text-[#6E665E] leading-tight" }, "Gesamtschnitt")], -1)), _createElementVNode("div", _hoisted_346, _toDisplayString(formatNumber(processedData?.avgPoints)), 1), _createElementVNode("div", _hoisted_347, _toDisplayString(gradeSystem === '6' ? 'Ø aller Fächer' : 'Ø Punkte gewichtet'), 1)])
                        ]),
                        _createElementVNode("div", _hoisted_348, [_createElementVNode("p", _hoisted_349, [_cache[104] || (_cache[104] = _createElementVNode("i", {
                          "data-lucide": "bar-chart",
                          class: "w-4 h-4 text-[#2d694c]"
                        }, null, -1)), _createTextVNode(" Notenverteilung (" + _toDisplayString(selectedHalfYear) + ") ", 1)]), _cache[105] || (_cache[105] = _createElementVNode("div", {
                          class: "h-64 sm:h-72 w-full relative z-10 rounded-2xl overflow-hidden",
                          style: {"background":"transparent"}
                        }, [_createElementVNode("canvas", {
                          id: "barChart",
                          style: {"background":"transparent","width":"100%","height":"100%"}
                        })], -1))]),
                        _createElementVNode("div", _hoisted_350, [_createElementVNode("p", _hoisted_351, [_cache[106] || (_cache[106] = _createElementVNode("i", {
                          "data-lucide": "line-chart",
                          class: "w-4 h-4 text-[#2d694c]"
                        }, null, -1)), _createTextVNode(" Durchschnittsverlauf (" + _toDisplayString(selectedHalfYear) + ") ", 1)]), _cache[108] || (_cache[108] = _createElementVNode("p", { class: "text-xs text-[#6E665E] mb-5" }, "Wie sich dein Gesamtdurchschnitt mit jeder eingetragenen Note in diesem Halbjahr entwickelt hat", -1)), (!yearTrendData || yearTrendData.length < 2)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_352, [_createElementVNode("p", _hoisted_353, "Noch nicht genug Noten für einen Verlauf — trag mindestens 2 Noten an unterschiedlichen Tagen in " + _toDisplayString(selectedHalfYear) + " ein.", 1)]))
                          : (_openBlock(), _createElementBlock("div", _hoisted_354, [...(_cache[107] || (_cache[107] = [_createElementVNode("canvas", {
                              id: "yearTrendChart",
                              style: {"background":"transparent","width":"100%","height":"100%"}
                            }, null, -1)]))]))]),
                        _createElementVNode("div", _hoisted_355, [_cache[109] || (_cache[109] = _createElementVNode("p", { class: "text-xs font-bold uppercase tracking-wider text-[#6E665E] mb-4 flex items-center gap-2" }, [_createElementVNode("i", {
                          "data-lucide": "pie-chart",
                          class: "w-4 h-4 text-[#2d694c]"
                        }), _createTextVNode(" Klausuren vs. Sonstige Leistungen ")], -1)), _createElementVNode("div", _hoisted_356, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['Klausur','Sonstige Leistung'], (typ) => {
                          return (_openBlock(), _createElementBlock("div", { key: typ }, [_createElementVNode("div", _hoisted_357, [_createElementVNode("span", _hoisted_358, _toDisplayString(typ), 1), _createElementVNode("span", _hoisted_359, _toDisplayString((processedData?.semesterSubjects || []).reduce((a,s)=>a+(s.semesterGrades||[]).filter(g=>!g.pending&&g.type===typ).length,0)) + " Noten ", 1)]), _createElementVNode("div", _hoisted_360, [_createElementVNode("div", {
                            class: "h-3 rounded-full transition-all duration-700 bg-[#2d694c]",
                            style: _normalizeStyle({
                                                width: (() => {
                                                    const sem = processedData?.semesterSubjects || [];
                                                    const total = sem.reduce((a,s)=>a+(s.semesterGrades||[]).filter(g=>!g.pending).length,0);
                                                    const count = sem.reduce((a,s)=>a+(s.semesterGrades||[]).filter(g=>!g.pending&&g.type===typ).length,0);
                                                    return total ? (count/total*100).toFixed(1)+'%' : '0%';
                                                })()
                                             })
                          }, null, 4)]), _createElementVNode("div", _hoisted_361, " Ø " + _toDisplayString((() => {
                                            const sem = processedData?.semesterSubjects || [];
                                            const grades = sem.flatMap(s=>(s.semesterGrades||[]).filter(g=>!g.pending&&g.type===typ).map(g=>g.points));
                                            return grades.length ? formatNumber(grades.reduce((a,b)=>a+b,0)/grades.length) : '-';
                                        })()) + " Punkte im Schnitt ", 1)]))
                        }), 128))])]),
                        _createElementVNode("div", _hoisted_362, [_cache[110] || (_cache[110] = _createElementVNode("p", { class: "text-xs font-bold uppercase tracking-wider text-[#6E665E] mb-4 flex items-center gap-2" }, [_createElementVNode("i", {
                          "data-lucide": "trophy",
                          class: "w-4 h-4 text-amber-500"
                        }), _createTextVNode(" Fächer-Ranking nach Schnitt ")], -1)), _createElementVNode("div", _hoisted_363, [((processedData?.semesterSubjects || []).filter(s=>s.finalPoints!==null).length === 0)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_364, " Noch keine Noten eingetragen. "))
                          : _createCommentVNode("", true), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList([...(processedData?.semesterSubjects || [])].filter(s=>s.finalPoints!==null).sort((a,b)=> gradeSystem==='6' ? a.finalPoints-b.finalPoints : b.finalPoints-a.finalPoints), (s, idx) => {
                          return (_openBlock(), _createElementBlock("div", {
                            key: s.id,
                            class: "flex items-center gap-3 p-3.5 rounded-2xl bg-[#f4ece4] border border-[#ede3d8]"
                          }, [
                            _createElementVNode("span", { class: _normalizeClass(["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0", idx===0?'bg-[#fed8b1] text-[#825500]':idx===1?'bg-[#e2dacd] text-[#524d44]':idx===2?'bg-[#fcd34d]/30 text-[#b45309]':'bg-white text-[#6E665E]']) }, _toDisplayString(idx + 1), 3),
                            _createElementVNode("div", {
                              class: "w-2 h-6 rounded-full shrink-0",
                              style: _normalizeStyle({ backgroundColor: s.color })
                            }, null, 4),
                            _createElementVNode("div", _hoisted_365, [_createElementVNode("div", _hoisted_366, _toDisplayString(s.name), 1), _createElementVNode("div", _hoisted_367, _toDisplayString(s.semesterGrades ? s.semesterGrades.filter(g=>!g.pending).length : 0) + " Noten", 1)]),
                            _createElementVNode("div", {
                              class: "text-xl font-black shrink-0 font-['Epilogue']",
                              style: _normalizeStyle({ color: s.color })
                            }, _toDisplayString(formatNumber(s.finalPoints)), 5)
                          ]))
                        }), 128))])])
                      ]))
                    : _createCommentVNode("", true)
                ]),
                _createElementVNode("div", _hoisted_368, [_createElementVNode("div", _hoisted_369, [_createElementVNode("nav", _hoisted_370, [
                  _createElementVNode("div", {
                    class: "liquid-glass-glider pointer-events-none",
                    style: _normalizeStyle({
                                 width: 'calc((100% - 12px) / 5)',
                                 left: `calc(6px + ${activeNavIndex} * ((100% - 12px) / 5))`
                             })
                  }, [...(_cache[111] || (_cache[111] = [_createElementVNode("div", { class: "glider-specular-top" }, null, -1), _createElementVNode("div", { class: "glider-dot-glow" }, null, -1)]))], 4),
                  _createElementVNode("button", {
                    onClick: $event => {currentTab = 'home'; selectedSubject = null},
                    class: _normalizeClass(["relative z-10 flex-1 py-2 px-0.5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer active:scale-95", activeNavIndex === 0 ? 'text-[#2d694c]' : 'text-[#6E665E] hover:text-[#1f1b16]'])
                  }, [_createElementVNode("i", {
                    "data-lucide": "layout-grid",
                    class: _normalizeClass(["w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-200", activeNavIndex === 0 ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'])
                  }, null, 2), _createElementVNode("span", { class: _normalizeClass(["text-[9.5px] sm:text-[10px] tracking-tight mt-0.5 transition-all duration-200", activeNavIndex === 0 ? 'font-black' : 'font-semibold']) }, "Dashboard", 2)], 10, _hoisted_371),
                  _createElementVNode("button", {
                    onClick: $event => {currentTab = 'subjects'; selectedSubject = null},
                    class: _normalizeClass(["relative z-10 flex-1 py-2 px-0.5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer active:scale-95", activeNavIndex === 1 ? 'text-[#2d694c]' : 'text-[#6E665E] hover:text-[#1f1b16]'])
                  }, [_createElementVNode("i", {
                    "data-lucide": "book-open",
                    class: _normalizeClass(["w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-200", activeNavIndex === 1 ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'])
                  }, null, 2), _createElementVNode("span", { class: _normalizeClass(["text-[9.5px] sm:text-[10px] tracking-tight mt-0.5 transition-all duration-200", activeNavIndex === 1 ? 'font-black' : 'font-semibold']) }, "Fächer", 2)], 10, _hoisted_372),
                  _createElementVNode("button", {
                    onClick: $event => {currentTab = 'planner'; selectedSubject = null},
                    class: _normalizeClass(["relative z-10 flex-1 py-2 px-0.5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer active:scale-95", activeNavIndex === 2 ? 'text-[#2d694c]' : 'text-[#6E665E] hover:text-[#1f1b16]'])
                  }, [_createElementVNode("i", {
                    "data-lucide": "calendar",
                    class: _normalizeClass(["w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-200", activeNavIndex === 2 ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'])
                  }, null, 2), _createElementVNode("span", { class: _normalizeClass(["text-[9.5px] sm:text-[10px] tracking-tight mt-0.5 transition-all duration-200", activeNavIndex === 2 ? 'font-black' : 'font-semibold']) }, "Kalender", 2)], 10, _hoisted_373),
                  _createElementVNode("button", {
                    onClick: $event => {currentTab = 'stats'; selectedSubject = null},
                    class: _normalizeClass(["relative z-10 flex-1 py-2 px-0.5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer active:scale-95", activeNavIndex === 3 ? 'text-[#2d694c]' : 'text-[#6E665E] hover:text-[#1f1b16]'])
                  }, [_createElementVNode("i", {
                    "data-lucide": "trending-up",
                    class: _normalizeClass(["w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-200", activeNavIndex === 3 ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'])
                  }, null, 2), _createElementVNode("span", { class: _normalizeClass(["text-[9.5px] sm:text-[10px] tracking-tight mt-0.5 transition-all duration-200", activeNavIndex === 3 ? 'font-black' : 'font-semibold']) }, "Insights", 2)], 10, _hoisted_374),
                  _createElementVNode("button", {
                    onClick: $event => {currentTab = 'abitur'; selectedSubject = null},
                    class: _normalizeClass(["relative z-10 flex-1 py-2 px-0.5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer active:scale-95", activeNavIndex === 4 ? 'text-[#2d694c]' : 'text-[#6E665E] hover:text-[#1f1b16]'])
                  }, [_createElementVNode("i", {
                    "data-lucide": "award",
                    class: _normalizeClass(["w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-200", activeNavIndex === 4 ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'])
                  }, null, 2), _createElementVNode("span", { class: _normalizeClass(["text-[9.5px] sm:text-[10px] tracking-tight mt-0.5 transition-all duration-200", activeNavIndex === 4 ? 'font-black' : 'font-semibold']) }, "Noten", 2)], 10, _hoisted_375)
                ])])])
              ])),
      isAvatarModalOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_376, [_createElementVNode("div", _hoisted_377, [_createElementVNode("div", {
            class: "modal-drag-handle md:hidden shrink-0 px-6 pt-6",
            onTouchstart: _withModifiers($event => (modalDragStart($event, 'isAvatarModalOpen')), ["stop"]),
            onTouchmove: _withModifiers($event => (modalDragMove($event)), ["stop"]),
            onTouchend: _withModifiers($event => (modalDragEnd($event)), ["stop"])
          }, null, 40, _hoisted_378), _createElementVNode("div", _hoisted_379, [
            _createElementVNode("div", _hoisted_380, [_cache[113] || (_cache[113] = _createElementVNode("div", { class: "flex items-center gap-2.5" }, [_createElementVNode("div", { class: "w-10 h-10 rounded-full bg-[#fed8b1] text-[#825500] flex items-center justify-center font-bold shrink-0 shadow-xs" }, [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }), _createElementVNode("circle", {
              cx: "12",
              cy: "13",
              r: "3"
            })])]), _createElementVNode("div", null, [_createElementVNode("h3", { class: "text-xl font-black text-[#1f1b16] font-['Epilogue'] leading-tight" }, "Profilbild anpassen"), _createElementVNode("p", { class: "text-xs text-[#6E665E] font-medium mt-0.5" }, "Wähle ein eigenes Foto oder ein Schüler-Emoji")])], -1)), _createElementVNode("button", {
              type: "button",
              onClick: $event => (isAvatarModalOpen = false),
              class: "w-10 h-10 bg-[#ede4dc] hover:bg-[#e2d8cd] rounded-full flex items-center justify-center text-[#1f1b16] cursor-pointer active:scale-95 transition-all shrink-0"
            }, [...(_cache[112] || (_cache[112] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), _createElementVNode("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })], -1)]))], 8, _hoisted_381)]),
            _createElementVNode("div", _hoisted_382, [_createElementVNode("div", _hoisted_383, [(userAvatar && (userAvatar.startsWith('data:') || userAvatar.startsWith('http')))
              ? (_openBlock(), _createElementBlock("img", {
                  key: 0,
                  src: userAvatar,
                  class: "w-full h-full object-cover"
                }, null, 8, _hoisted_384))
              : userAvatar
                ? (_openBlock(), _createElementBlock("div", _hoisted_385, _toDisplayString(userAvatar), 1))
                : (_openBlock(), _createElementBlock("div", _hoisted_386, _toDisplayString(displayName ? displayName.slice(0,2).toUpperCase() : 'LE'), 1))]), _createElementVNode("p", _hoisted_387, _toDisplayString(displayName || 'Dein Account'), 1), _createElementVNode("p", _hoisted_388, "Gymnasium • " + _toDisplayString(currentClass) + ". Klasse", 1)]),
            _createElementVNode("div", _hoisted_389, [_createElementVNode("input", {
              type: "file",
              ref: "avatarFileInput",
              accept: "image/*",
              onChange: handleAvatarFileUpload,
              class: "hidden"
            }, null, 40, _hoisted_390), _createElementVNode("button", {
              type: "button",
              onClick: $event => ($refs.avatarFileInput && $refs.avatarFileInput.click()),
              class: "w-full py-3.5 px-5 rounded-2xl bg-[#2d694c] hover:bg-[#23533c] !text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-sm cursor-pointer active:scale-98 transition-all"
            }, [...(_cache[114] || (_cache[114] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _createElementVNode("polyline", { points: "17 8 12 3 7 8" }), _createElementVNode("line", {
              x1: "12",
              y1: "3",
              x2: "12",
              y2: "15"
            })], -1), _createElementVNode("span", { class: "!text-white" }, "Eigenes Foto hochladen", -1)]))], 8, _hoisted_391), userAvatar
              ? (_openBlock(), _createElementBlock("button", {
                  key: 0,
                  type: "button",
                  onClick: removeAvatar,
                  class: "w-full py-2.5 px-4 rounded-2xl bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all border border-[#fca5a5]/40"
                }, [...(_cache[115] || (_cache[115] = [_createElementVNode("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }, [_createElementVNode("path", { d: "M3 6h18" }), _createElementVNode("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }), _createElementVNode("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" })], -1), _createElementVNode("span", null, "Profilbild zurücksetzen", -1)]))], 8, _hoisted_392))
              : _createCommentVNode("", true)]),
            _createElementVNode("div", _hoisted_393, [_cache[116] || (_cache[116] = _createElementVNode("p", { class: "text-[11px] font-black uppercase tracking-wider text-[#6E665E] mb-3" }, "Oder wähle ein Schüler-Avatar:", -1)), _createElementVNode("div", _hoisted_394, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(avatarPresets, (preset) => {
              return (_openBlock(), _createElementBlock("button", {
                key: preset,
                type: "button",
                onClick: $event => (setAvatarPreset(preset)),
                class: _normalizeClass(["h-13 sm:h-14 rounded-2xl flex items-center justify-center text-2xl border transition-all cursor-pointer active:scale-90", userAvatar === preset ? 'bg-[#fed8b1] border-[#e6a86c] scale-105 shadow-xs ring-2 ring-[#e6a86c]' : 'bg-white hover:bg-[#f5efe7] border-[#ede3d8]'])
              }, _toDisplayString(preset), 11, _hoisted_395))
            }), 128))])]),
            _createElementVNode("button", {
              type: "button",
              onClick: $event => (isAvatarModalOpen = false),
              class: "w-full py-3.5 rounded-full bg-[#1f1b16] hover:bg-[#35302a] !text-white font-black text-sm active:scale-98 transition-all cursor-pointer mt-2 shadow-md flex items-center justify-center"
            }, [...(_cache[117] || (_cache[117] = [_createElementVNode("span", { class: "!text-white" }, "Fertig", -1)]))], 8, _hoisted_396)
          ])])]))
        : _createCommentVNode("", true),
      isSubjectModalOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_397, [_createElementVNode("div", {
            class: "modal-enter liquid-glass-modal border-t md:border w-full max-w-lg rounded-t-[2.5rem] md:rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[88vh] md:max-h-[90vh] overflow-y-auto no-scrollbar pb-12",
            onTouchstart: $event => (modalDragStart($event, 'isSubjectModalOpen')),
            onTouchmove: $event => (modalDragMove($event)),
            onTouchend: $event => (modalDragEnd($event))
          }, [
            _cache[128] || (_cache[128] = _createElementVNode("div", { class: "modal-drag-handle md:hidden" }, null, -1)),
            _createElementVNode("button", {
              onClick: $event => (closeModal('isSubjectModalOpen')),
              class: "absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer modal-close-btn z-10"
            }, [...(_cache[118] || (_cache[118] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "22",
              height: "22",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), _createElementVNode("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })], -1)]))], 8, _hoisted_399),
            _createElementVNode("h2", _hoisted_400, _toDisplayString(isSettingsModalOpen ? 'Fach bearbeiten' : 'Neues Fach'), 1),
            _createElementVNode("form", {
              onSubmit: _withModifiers(handleSaveSubject, ["prevent"]),
              class: "space-y-6"
            }, [
              _createElementVNode("div", _hoisted_402, [_cache[119] || (_cache[119] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400 ml-2" }, "Fachname", -1)), _withDirectives(_createElementVNode("input", {
                type: "text",
                required: "",
                "onUpdate:modelValue": $event => ((subjectForm.name) = $event),
                class: "w-full bg-transparent text-lg font-bold text-white outline-none ml-2 mt-2"
              }, null, 8, _hoisted_403), [[_vModelText, subjectForm.name]])]),
              (gradeSystem !== '6')
                ? (_openBlock(), _createElementBlock("div", _hoisted_404, [_cache[120] || (_cache[120] = _createElementVNode("div", { class: "ml-2" }, [_createElementVNode("p", { class: "font-black text-white text-base" }, "Leistungskurs")], -1)), _createElementVNode("button", {
                    type: "button",
                    onClick: $event => (subjectForm.isLK = !subjectForm.isLK),
                    class: _normalizeClass([subjectForm.isLK ? 'toggle-accent-on' : 'bg-slate-700', "relative inline-flex h-9 w-16 rounded-full transition-colors duration-250 cursor-pointer"]),
                    style: {"transition":"background-color 0.25s ease"}
                  }, [_createElementVNode("span", {
                    class: _normalizeClass([subjectForm.isLK ? 'translate-x-8' : 'translate-x-1', "inline-block h-7 w-7 transform rounded-full bg-white mt-1 shadow-md"]),
                    style: {"transition":"transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)"}
                  }, null, 2)], 10, _hoisted_405)]))
                : _createCommentVNode("", true),
              _createElementVNode("div", _hoisted_406, [
                _createElementVNode("div", _hoisted_407, [_cache[122] || (_cache[122] = _createElementVNode("p", { class: "font-bold text-white text-base" }, "Klausurgewichtung", -1)), _createElementVNode("div", _hoisted_408, [_withDirectives(_createElementVNode("input", {
                  type: "number",
                  min: "0",
                  max: "100",
                  "onUpdate:modelValue": $event => ((subjectForm.examWeight) = $event),
                  onChange: $event => (subjectForm.examWeight = Math.min(100, Math.max(0, parseInt(subjectForm.examWeight) || 0))),
                  class: "bg-black/40 border border-white/10 rounded-xl text-accent font-black text-base text-center w-16 py-1.5 outline-none focus:border-accent"
                }, null, 40, _hoisted_409), [[
                  _vModelText,
                  subjectForm.examWeight,
                  void 0,
                  { number: true }
                ]]), _cache[121] || (_cache[121] = _createElementVNode("span", { class: "font-black text-accent text-sm" }, "% Klausur", -1))])]),
                isSettingsModalOpen
                  ? (_openBlock(), _createElementBlock("p", _hoisted_410, "Gilt nur für Halbjahr " + _toDisplayString(selectedHalfYear) + " — andere Halbjahre bleiben unverändert.", 1))
                  : _createCommentVNode("", true),
                _withDirectives(_createElementVNode("input", {
                  type: "range",
                  min: "0",
                  max: "100",
                  step: "10",
                  "onUpdate:modelValue": $event => ((subjectForm.examWeight) = $event),
                  class: "custom-range"
                }, null, 8, _hoisted_411), [[
                  _vModelText,
                  subjectForm.examWeight,
                  void 0,
                  { number: true }
                ]]),
                _createElementVNode("div", _hoisted_412, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([0,10,20,30,40,50,60,70,80,90,100], (n) => {
                  return (_openBlock(), _createElementBlock("span", {
                    key: n,
                    class: "text-[11px] text-slate-600 font-bold"
                  }, _toDisplayString(n === 0 || n === 50 || n === 100 ? n : '·'), 1))
                }), 128))])
              ]),
              _createElementVNode("div", _hoisted_413, [_cache[124] || (_cache[124] = _createElementVNode("p", { class: "font-black text-white text-base ml-2 mb-3" }, "Fachfarbe", -1)), _createElementVNode("div", _hoisted_414, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(colorOptions, (c) => {
                return (_openBlock(), _createElementBlock("button", {
                  type: "button",
                  key: c,
                  onClick: $event => (subjectForm.color = c),
                  style: _normalizeStyle({ backgroundColor: c }),
                  class: _normalizeClass(["w-9 h-9 rounded-full shrink-0 cursor-pointer color-swatch", subjectForm.color === c ? 'scale-115 ring-2 ring-accent' : ''])
                }, null, 14, _hoisted_415))
              }), 128))]), _createElementVNode("div", _hoisted_416, [_cache[123] || (_cache[123] = _createElementVNode("label", { class: "text-xs font-black text-slate-400 uppercase tracking-wider shrink-0" }, "Eigene Farbe", -1)), _createElementVNode("div", _hoisted_417, [_withDirectives(_createElementVNode("input", {
                type: "color",
                "onUpdate:modelValue": $event => ((subjectForm.color) = $event),
                class: "w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-1",
                style: {"appearance":"none","-webkit-appearance":"none"}
              }, null, 8, _hoisted_418), [[_vModelText, subjectForm.color]]), _createElementVNode("span", _hoisted_419, _toDisplayString(subjectForm.color), 1), _createElementVNode("div", {
                class: "w-7 h-7 rounded-full ml-auto border border-white/20",
                style: _normalizeStyle({ backgroundColor: subjectForm.color })
              }, null, 4)])])]),
              _createElementVNode("div", _hoisted_420, [_cache[125] || (_cache[125] = _createElementVNode("p", { class: "font-black text-white text-base ml-2 mb-4" }, "Fach-Symbol", -1)), _createElementVNode("div", _hoisted_421, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(subjectIcons, (ic) => {
                return (_openBlock(), _createElementBlock("button", {
                  type: "button",
                  key: ic,
                  onClick: $event => {subjectForm.icon = ic; refreshIcons()},
                  class: _normalizeClass([[subjectForm.icon === ic ? 'ring-2 ring-accent bg-accent-dim2 text-accent-light selected' : 'bg-white/5 text-slate-400'], "flex flex-col items-center justify-center py-3 rounded-3xl cursor-pointer icon-btn"])
                }, [_createElementVNode("i", {
                  "data-lucide": ic,
                  class: "w-6 h-6 mb-1.5"
                }, null, 8, _hoisted_423), _createElementVNode("span", _hoisted_424, _toDisplayString(ic.replace(/-/g,' ')), 1)], 10, _hoisted_422))
              }), 128))])]),
              _createElementVNode("div", _hoisted_425, [_cache[127] || (_cache[127] = _createElementVNode("button", {
                type: "submit",
                class: "flex-1 btn-accent py-4.5 rounded-full font-black uppercase text-sm cursor-pointer active:scale-95 transition-transform"
              }, "Speichern", -1)), isSettingsModalOpen
                ? (_openBlock(), _createElementBlock("button", {
                    key: 0,
                    type: "button",
                    onClick: handleDeleteSubject,
                    class: "w-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                  }, [...(_cache[126] || (_cache[126] = [_createElementVNode("i", {
                    "data-lucide": "trash-2",
                    class: "w-6 h-6"
                  }, null, -1)]))], 8, _hoisted_426))
                : _createCommentVNode("", true)])
            ], 40, _hoisted_401)
          ], 40, _hoisted_398)]))
        : _createCommentVNode("", true),
      isGradeModalOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_427, [_createElementVNode("div", _hoisted_428, [_createElementVNode("div", {
            class: "modal-drag-handle md:hidden shrink-0 px-6 pt-6",
            onTouchstart: _withModifiers($event => (modalDragStart($event, 'isGradeModalOpen')), ["stop"]),
            onTouchmove: _withModifiers($event => (modalDragMove($event)), ["stop"]),
            onTouchend: _withModifiers($event => (modalDragEnd($event)), ["stop"])
          }, null, 40, _hoisted_429), _createElementVNode("button", {
            onClick: $event => (closeModal('isGradeModalOpen')),
            class: "absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer modal-close-btn z-20"
          }, [...(_cache[129] || (_cache[129] = [_createElementVNode("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [_createElementVNode("line", {
            x1: "18",
            y1: "6",
            x2: "6",
            y2: "18"
          }), _createElementVNode("line", {
            x1: "6",
            y1: "6",
            x2: "18",
            y2: "18"
          })], -1)]))], 8, _hoisted_430), _createElementVNode("div", {
            class: "overflow-y-auto no-scrollbar px-6 sm:px-8 pb-12 pt-2 sm:pt-4",
            onTouchstart: $event => (modalDragStart($event, 'isGradeModalOpen')),
            onTouchmove: $event => (modalDragMove($event)),
            onTouchend: $event => (modalDragEnd($event))
          }, [_createElementVNode("h2", _hoisted_432, _toDisplayString(gradeForm.id ? 'Note bearbeiten' : 'Note eintragen'), 1), _createElementVNode("div", _hoisted_433, [
            _createElementVNode("div", _hoisted_434, [_cache[130] || (_cache[130] = _createElementVNode("p", { class: "font-black text-white text-base ml-2" }, "Ergebnis ausstehend", -1)), _createElementVNode("button", {
              type: "button",
              onClick: $event => (gradeForm.pending = !gradeForm.pending),
              class: _normalizeClass([gradeForm.pending ? 'bg-amber-500' : 'bg-slate-700', "relative inline-flex h-9 w-16 rounded-full transition-all cursor-pointer"])
            }, [_createElementVNode("span", {
              class: _normalizeClass([gradeForm.pending ? 'translate-x-8' : 'translate-x-1', "inline-block h-7 w-7 transform rounded-full bg-white mt-1 shadow-md"]),
              style: {"transition":"transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)"}
            }, null, 2)], 10, _hoisted_435)]),
            (!gradeForm.pending)
              ? (_openBlock(), _createElementBlock("div", _hoisted_436, [_createElementVNode("p", _hoisted_437, _toDisplayString(gradeSystem === '6' ? 'Note auswählen' : 'Punktzahl auswählen'), 1), _createElementVNode("div", _hoisted_438, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList((gradeSystem === '6' ? [1,2,3,4,5,6] : Array.from({length:16}, (_,i) => i)), (n) => {
                  return (_openBlock(), _createElementBlock("button", {
                    key: n,
                    type: "button",
                    onClick: $event => (gradeForm.points = n),
                    class: _normalizeClass(["aspect-square rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-all", gradeForm.points === n ? 'toggle-accent-on text-white' : 'bg-white/5 text-slate-300 border border-white/5 active:bg-white/10'])
                  }, _toDisplayString(gradeSystem === '6' ? n : String(n).padStart(2,'0')), 11, _hoisted_439))
                }), 128))])]))
              : _createCommentVNode("", true),
            _createElementVNode("div", _hoisted_440, [_createElementVNode("button", {
              onClick: $event => (gradeForm.type = 'Klausur'),
              class: _normalizeClass([gradeForm.type === 'Klausur' ? 'toggle-accent-on text-white' : 'text-slate-400', "flex-1 py-4 rounded-full text-xs font-black uppercase cursor-pointer"])
            }, "Klausur", 10, _hoisted_441), _createElementVNode("button", {
              onClick: $event => (gradeForm.type = 'Sonstige Leistung'),
              class: _normalizeClass([gradeForm.type === 'Sonstige Leistung' ? 'toggle-accent-on text-white' : 'text-slate-400', "flex-1 py-4 rounded-full text-xs font-black uppercase cursor-pointer"])
            }, "Sonstiges", 10, _hoisted_442)]),
            _withDirectives(_createElementVNode("input", {
              type: "text",
              placeholder: "Beschreibung (optional)",
              "onUpdate:modelValue": $event => ((gradeForm.label) = $event),
              class: "w-full bg-black/20 border border-white/5 p-5 rounded-3xl font-bold text-lg text-white placeholder:text-slate-600 modal-input"
            }, null, 8, _hoisted_443), [[_vModelText, gradeForm.label]]),
            _createElementVNode("div", {
              onClick: $event => (openDatePicker('grade')),
              class: "w-full bg-black/20 border border-white/5 p-5 rounded-3xl font-bold text-lg text-white flex justify-between items-center cursor-pointer active:border-white/20 transition-all"
            }, [_createElementVNode("span", null, _toDisplayString(gradeForm.date ? formatDate(gradeForm.date) : 'Datum auswählen'), 1), _cache[131] || (_cache[131] = _createElementVNode("i", {
              "data-lucide": "calendar",
              class: "w-6 h-6 text-accent"
            }, null, -1))], 8, _hoisted_444),
            _createElementVNode("div", _hoisted_445, [_createElementVNode("button", {
              onClick: handleSaveGrade,
              class: "flex-1 btn-accent py-4.5 rounded-full font-black uppercase text-sm cursor-pointer active:scale-95 transition-transform"
            }, "Speichern", 8, _hoisted_446), (gradeForm.id)
              ? (_openBlock(), _createElementBlock("button", {
                  key: 0,
                  onClick: $event => (handleDeleteGrade(gradeForm.id)),
                  class: "w-16 bg-rose-500/15 border border-rose-500/25 text-rose-500 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                }, [...(_cache[132] || (_cache[132] = [_createElementVNode("i", {
                  "data-lucide": "trash-2",
                  class: "w-6 h-6"
                }, null, -1)]))], 8, _hoisted_447))
              : _createCommentVNode("", true)])
          ])], 40, _hoisted_431)])]))
        : _createCommentVNode("", true),
      isBulkImportOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_448, [_createElementVNode("div", _hoisted_449, [_createElementVNode("div", {
            class: "modal-drag-handle md:hidden shrink-0 px-6 pt-6",
            onTouchstart: _withModifiers($event => (modalDragStart($event, 'isBulkImportOpen')), ["stop"]),
            onTouchmove: _withModifiers($event => (modalDragMove($event)), ["stop"]),
            onTouchend: _withModifiers($event => (modalDragEnd($event)), ["stop"])
          }, null, 40, _hoisted_450), _createElementVNode("button", {
            onClick: $event => (isBulkImportOpen = false),
            class: "absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer modal-close-btn z-20"
          }, [...(_cache[133] || (_cache[133] = [_createElementVNode("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [_createElementVNode("line", {
            x1: "18",
            y1: "6",
            x2: "6",
            y2: "18"
          }), _createElementVNode("line", {
            x1: "6",
            y1: "6",
            x2: "18",
            y2: "18"
          })], -1)]))], 8, _hoisted_451), _createElementVNode("div", {
            class: "overflow-y-auto no-scrollbar px-6 sm:px-8 pb-12 pt-2 sm:pt-4",
            onTouchstart: $event => (modalDragStart($event, 'isBulkImportOpen')),
            onTouchmove: $event => (modalDragMove($event)),
            onTouchend: $event => (modalDragEnd($event))
          }, [_createElementVNode("h2", {
            class: "text-2xl font-black text-white mb-2 pr-10",
            onTouchstart: _withModifiers($event => (modalDragStart($event, 'isBulkImportOpen')), ["stop"]),
            onTouchmove: _withModifiers($event => (modalDragMove($event)), ["stop"]),
            onTouchend: _withModifiers($event => (modalDragEnd($event)), ["stop"])
          }, "Klausurtermine im Block", 40, _hoisted_453), _cache[135] || (_cache[135] = _createElementVNode("p", { class: "text-xs text-slate-400 mb-5" }, [
            _createTextVNode("Füge Text ein – pro Zeile ein Termin, z.B. "),
            _createElementVNode("span", { class: "text-slate-300 font-bold" }, "\"20.9. Mathe\""),
            _createTextVNode(" oder "),
            _createElementVNode("span", { class: "text-slate-300 font-bold" }, "\"03.10.2026 – Englisch\""),
            _createTextVNode(".")
          ], -1)), (!bulkImportParsed || bulkImportParsed.length === 0)
            ? (_openBlock(), _createElementBlock("div", _hoisted_454, [_withDirectives(_createElementVNode("textarea", {
                "onUpdate:modelValue": $event => ((bulkImportText) = $event),
                rows: "8",
                placeholder: "20.9. Mathe\n22.9. Englisch LK\n5.10. Physik",
                class: "w-full bg-black/20 border border-white/5 p-5 rounded-3xl font-medium text-sm text-white placeholder:text-slate-600 modal-input resize-none no-scrollbar"
              }, null, 8, _hoisted_455), [[_vModelText, bulkImportText]]), _createElementVNode("button", {
                onClick: parseBulkImportText,
                disabled: !bulkImportText.trim(),
                class: "w-full btn-accent py-4.5 rounded-full font-black uppercase text-sm cursor-pointer active:scale-95 transition-transform disabled:opacity-40"
              }, "Termine erkennen", 8, _hoisted_456)]))
            : (_openBlock(), _createElementBlock("div", _hoisted_457, [_createElementVNode("p", _hoisted_458, _toDisplayString(bulkImportParsed.filter(r => r.date && r.subjectId).length) + " von " + _toDisplayString(bulkImportParsed.length) + " bereit", 1), _createElementVNode("div", _hoisted_459, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(bulkImportParsed, (row, idx) => {
                return (_openBlock(), _createElementBlock("div", {
                  key: idx,
                  class: _normalizeClass(["bg-black/20 border rounded-2xl p-3.5 flex items-center gap-3 relative", row.date && row.subjectId ? (row.timetableWarning ? 'border-amber-500/30' : 'border-white/5') : 'border-amber-500/30'])
                }, [_createElementVNode("div", { class: _normalizeClass(["shrink-0 w-9 h-9 rounded-full flex items-center justify-center", row.date && row.subjectId ? (row.timetableWarning ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400') : 'bg-amber-500/15 text-amber-400']) }, [_createElementVNode("i", {
                  "data-lucide": row.date && row.subjectId ? (row.timetableWarning ? 'alert-triangle' : 'check') : 'alert-triangle',
                  class: "w-4.5 h-4.5"
                }, null, 8, _hoisted_460)], 2), _createElementVNode("div", _hoisted_461, [_createElementVNode("p", _hoisted_462, _toDisplayString(row.raw), 1), _createElementVNode("div", _hoisted_463, [_createElementVNode("input", {
                  type: "date",
                  value: row.date || '',
                  onChange: $event => (bulkImportSetDate(idx, $event.target.value)),
                  class: _normalizeClass(["bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white px-2.5 py-1 outline-none", !row.date ? 'border-amber-500/40' : ''])
                }, null, 42, _hoisted_464), _createElementVNode("button", {
                  type: "button",
                  onClick: $event => (bulkImportOpenPickerIdx = bulkImportOpenPickerIdx === idx ? null : idx),
                  class: "bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white px-2.5 py-1 outline-none flex items-center gap-1.5 cursor-pointer"
                }, [(row.subjectId)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 0,
                      class: "w-2 h-2 rounded-full shrink-0",
                      style: _normalizeStyle({ backgroundColor: subjects.find(s => s.id === row.subjectId)?.color })
                    }, null, 4))
                  : _createCommentVNode("", true), _createElementVNode("span", null, _toDisplayString(row.subjectId ? (subjects.find(s => s.id === row.subjectId)?.name || 'Fach wählen') : 'Fach wählen'), 1), _createElementVNode("i", {
                  "data-lucide": "chevron-down",
                  class: "w-3 h-3 shrink-0",
                  style: _normalizeStyle(bulkImportOpenPickerIdx === idx ? 'transform: rotate(180deg)' : '')
                }, null, 4)], 8, _hoisted_465), (bulkImportOpenPickerIdx === idx)
                  ? (_openBlock(), _createElementBlock("div", _hoisted_466, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(subjects, (s) => {
                      return (_openBlock(), _createElementBlock("button", {
                        key: s.id,
                        type: "button",
                        onClick: $event => {bulkImportSetSubject(idx, s.id); bulkImportOpenPickerIdx = null},
                        class: _normalizeClass(["w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold cursor-pointer transition-colors", row.subjectId === s.id ? 'bg-white/10 text-white' : 'text-slate-300 active:bg-white/5'])
                      }, [_createElementVNode("span", {
                        class: "w-2.5 h-2.5 rounded-full shrink-0",
                        style: _normalizeStyle({ backgroundColor: s.color })
                      }, null, 4), _createTextVNode(" " + _toDisplayString(s.name), 1)], 10, _hoisted_467))
                    }), 128)), (!subjects || subjects.length === 0)
                      ? (_openBlock(), _createElementBlock("p", _hoisted_468, "Keine Fächer angelegt"))
                      : _createCommentVNode("", true)]))
                  : _createCommentVNode("", true)]), (row.timetableWarning)
                  ? (_openBlock(), _createElementBlock("p", _hoisted_469, "Laut Stundenplan hast du " + _toDisplayString(row.subjectName) + " an diesem Wochentag nicht — Datum prüfen?", 1))
                  : _createCommentVNode("", true)]), _createElementVNode("button", {
                  onClick: $event => (bulkImportRemoveRow(idx)),
                  class: "shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 cursor-pointer"
                }, [...(_cache[134] || (_cache[134] = [_createElementVNode("i", {
                  "data-lucide": "x",
                  class: "w-4 h-4"
                }, null, -1)]))], 8, _hoisted_470)], 2))
              }), 128))]), _createElementVNode("div", _hoisted_471, [_createElementVNode("button", {
                onClick: $event => (bulkImportParsed = []),
                class: "flex-1 bg-white/5 border border-white/10 text-slate-300 py-4 rounded-full font-black uppercase text-xs cursor-pointer active:scale-95 transition-transform"
              }, "Zurück", 8, _hoisted_472), _createElementVNode("button", {
                onClick: handleBulkImportSave,
                disabled: bulkImportParsed.filter(r => r.date && r.subjectId).length === 0,
                class: "flex-1 btn-accent py-4 rounded-full font-black uppercase text-xs cursor-pointer active:scale-95 transition-transform disabled:opacity-40"
              }, "Alle eintragen", 8, _hoisted_473)])]))], 40, _hoisted_452)])]))
        : _createCommentVNode("", true),
      isReportCardModalOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_474, [_createElementVNode("div", {
            class: "modal-enter liquid-glass-modal border-t md:border w-full max-w-lg rounded-t-[2.5rem] md:rounded-3xl p-6 sm:p-8 shadow-2xl relative pb-12",
            onTouchstart: $event => (modalDragStart($event, 'isReportCardModalOpen')),
            onTouchmove: $event => (modalDragMove($event)),
            onTouchend: $event => (modalDragEnd($event))
          }, [
            _cache[139] || (_cache[139] = _createElementVNode("div", { class: "modal-drag-handle md:hidden" }, null, -1)),
            _createElementVNode("button", {
              onClick: $event => (closeModal('isReportCardModalOpen')),
              class: "absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer modal-close-btn"
            }, [...(_cache[136] || (_cache[136] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "22",
              height: "22",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), _createElementVNode("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })], -1)]))], 8, _hoisted_476),
            _cache[140] || (_cache[140] = _createElementVNode("h2", { class: "text-2xl font-black text-white mb-6 pr-10" }, "Zeugnisnote festlegen", -1)),
            _createElementVNode("div", _hoisted_477, [
              (currentClass <= 10)
                ? (_openBlock(), _createElementBlock("div", _hoisted_478, [_cache[137] || (_cache[137] = _createElementVNode("p", { class: "text-xs font-bold uppercase text-slate-400" }, "Für welches Halbjahr?", -1)), _createElementVNode("div", _hoisted_479, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(reportCardClassOptions, (k) => {
                    return (_openBlock(), _createElementBlock("button", {
                      key: k.key,
                      onClick: $event => (selectedReportCardKey = k.key),
                      class: _normalizeClass([selectedReportCardKey === k.key ? 'toggle-accent-on text-white font-black border-accent' : 'bg-black/30 text-slate-400 border-white/10', "py-3 rounded-xl text-xs font-bold border cursor-pointer transition-all active:scale-95"])
                    }, _toDisplayString(k.label), 11, _hoisted_480))
                  }), 128))])]))
                : _createCommentVNode("", true),
              (currentClass >= 11)
                ? (_openBlock(), _createElementBlock("div", _hoisted_481, [_cache[138] || (_cache[138] = _createElementVNode("p", { class: "text-xs font-bold uppercase text-slate-400" }, "Halbjahr", -1)), _createElementVNode("div", _hoisted_482, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(halfYears, (hy) => {
                    return (_openBlock(), _createElementBlock("button", {
                      key: hy,
                      onClick: $event => (selectedReportCardKey = hy),
                      class: _normalizeClass([selectedReportCardKey === hy ? 'toggle-accent-on text-white font-black border-accent' : 'bg-black/30 text-slate-400 border-white/10', "py-3 rounded-xl text-xs font-bold border cursor-pointer transition-all active:scale-95"])
                    }, _toDisplayString(hy), 11, _hoisted_483))
                  }), 128))])]))
                : _createCommentVNode("", true),
              _createElementVNode("div", _hoisted_484, [_createElementVNode("p", _hoisted_485, _toDisplayString(gradeSystem === '6' ? 'Note auswählen' : 'Punktzahl auswählen'), 1), _createElementVNode("div", _hoisted_486, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList((gradeSystem === '6' ? [1,2,3,4,5,6] : Array.from({length:16}, (_,i) => i)), (n) => {
                return (_openBlock(), _createElementBlock("button", {
                  key: n,
                  type: "button",
                  onClick: $event => (tempReportCardPoints = n),
                  class: _normalizeClass(["aspect-square rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-all", tempReportCardPoints === n ? 'toggle-accent-on text-white' : 'bg-white/5 text-slate-300 border border-white/5 active:bg-white/10'])
                }, _toDisplayString(gradeSystem === '6' ? n : String(n).padStart(2,'0')), 11, _hoisted_487))
              }), 128))])]),
              _createElementVNode("div", _hoisted_488, [_createElementVNode("button", {
                onClick: $event => (handleSaveReportCardGrade(tempReportCardPoints)),
                class: "flex-1 toggle-accent-on text-white py-4.5 rounded-full font-black uppercase text-sm cursor-pointer active:scale-95 transition-transform"
              }, "Festlegen", 8, _hoisted_489), _createElementVNode("button", {
                onClick: $event => (handleSaveReportCardGrade(null)),
                class: "flex-1 bg-white/5 border border-white/10 text-slate-400 py-4.5 rounded-full font-black uppercase text-sm cursor-pointer active:scale-95 transition-transform"
              }, "Zurücksetzen", 8, _hoisted_490)])
            ])
          ], 40, _hoisted_475)]))
        : _createCommentVNode("", true),
      isTaskModalOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_491, [_createElementVNode("div", _hoisted_492, [
            _createElementVNode("div", {
              class: "modal-drag-handle md:hidden shrink-0",
              onTouchstart: _withModifiers($event => (modalDragStart($event, 'isTaskModalOpen')), ["stop"]),
              onTouchmove: _withModifiers($event => (modalDragMove($event)), ["stop"]),
              onTouchend: _withModifiers($event => (modalDragEnd($event)), ["stop"])
            }, null, 40, _hoisted_493),
            _createElementVNode("button", {
              onClick: $event => (closeModal('isTaskModalOpen')),
              class: "absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer z-10 modal-close-btn"
            }, [...(_cache[141] || (_cache[141] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "22",
              height: "22",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), _createElementVNode("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })], -1)]))], 8, _hoisted_494),
            _createElementVNode("div", {
              class: "overflow-y-auto no-scrollbar p-6 sm:p-8 pb-4",
              onTouchstart: $event => (modalDragStart($event, 'isTaskModalOpen')),
              onTouchmove: $event => (modalDragMove($event)),
              onTouchend: $event => (modalDragEnd($event))
            }, [_createElementVNode("h2", _hoisted_496, _toDisplayString(taskForm.id ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'), 1), (!subjects || subjects.length === 0)
              ? (_openBlock(), _createElementBlock("div", _hoisted_497, " Bitte erstelle zuerst ein Fach unter \"Fächer\", bevor du Aufgaben eintragen kannst. "))
              : (_openBlock(), _createElementBlock("div", _hoisted_498, [
                  _withDirectives(_createElementVNode("input", {
                    type: "text",
                    placeholder: "Titel (z.B. Vokabeln, Analysis Test)",
                    required: "",
                    "onUpdate:modelValue": $event => ((taskForm.title) = $event),
                    class: "w-full bg-black/20 border border-white/5 p-5 rounded-3xl font-bold text-lg text-white placeholder:text-slate-600 modal-input"
                  }, null, 8, _hoisted_499), [[_vModelText, taskForm.title]]),
                  _createElementVNode("div", _hoisted_500, [_createElementVNode("button", {
                    onClick: $event => (taskForm.type = 'Hausaufgabe'),
                    class: _normalizeClass([taskForm.type === 'Hausaufgabe' ? 'toggle-accent-on text-white' : 'text-slate-400', "flex-1 py-3.5 rounded-full text-xs font-black uppercase cursor-pointer"])
                  }, "Hausaufg.", 10, _hoisted_501), _createElementVNode("button", {
                    onClick: $event => (taskForm.type = 'Test'),
                    class: _normalizeClass([taskForm.type === 'Test' ? 'toggle-accent-on text-white' : 'text-slate-400', "flex-1 py-3.5 rounded-full text-xs font-black uppercase cursor-pointer"])
                  }, "Test", 10, _hoisted_502), _createElementVNode("button", {
                    onClick: $event => (taskForm.type = 'Klausur'),
                    class: _normalizeClass([taskForm.type === 'Klausur' ? 'toggle-accent-on text-white' : 'text-slate-400', "flex-1 py-3.5 rounded-full text-xs font-black uppercase cursor-pointer"])
                  }, "Klausur", 10, _hoisted_503)]),
                  _createElementVNode("div", _hoisted_504, [_cache[143] || (_cache[143] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400 ml-1 block mb-3" }, "Fach auswählen", -1)), _createElementVNode("div", {
                    class: "grid grid-cols-2 gap-3.5 max-h-48 overflow-y-auto no-scrollbar",
                    onTouchstart: _withModifiers(() => {}, ["stop"]),
                    onTouchmove: _withModifiers(() => {}, ["stop"]),
                    onTouchend: _withModifiers(() => {}, ["stop"])
                  }, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(subjects, (s) => {
                    return (_openBlock(), _createElementBlock("button", {
                      key: s.id,
                      onClick: $event => (taskForm.subjectId = s.id),
                      class: _normalizeClass(["p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer", taskForm.subjectId === s.id ? 'bg-white/10 border-accent' : 'bg-transparent border-white/5'])
                    }, [_createElementVNode("span", {
                      class: "w-3.5 h-3.5 rounded-full shrink-0",
                      style: _normalizeStyle({ backgroundColor: s.color })
                    }, null, 4), _createElementVNode("span", _hoisted_507, _toDisplayString(s.name), 1)], 10, _hoisted_506))
                  }), 128))], 40, _hoisted_505), (taskForm.subjectId && timetableDaysForSubject(taskForm.subjectId).length > 0)
                    ? (_openBlock(), _createElementBlock("p", _hoisted_508, [_cache[142] || (_cache[142] = _createElementVNode("i", {
                        "data-lucide": "calendar-days",
                        class: "w-3.5 h-3.5 text-accent shrink-0"
                      }, null, -1)), _createTextVNode(" Laut Stundenplan: " + _toDisplayString(timetableDaysForSubject(taskForm.subjectId).map(d => weekdayLabels[d]).join(', ')), 1)]))
                    : _createCommentVNode("", true)]),
                  _createElementVNode("div", {
                    onClick: $event => (openDatePicker('task')),
                    class: "w-full bg-black/20 border border-white/5 p-5 rounded-3xl font-bold text-lg text-white flex justify-between items-center cursor-pointer active:border-white/20 transition-all"
                  }, [_createElementVNode("span", null, _toDisplayString(taskForm.date ? formatDate(taskForm.date) : 'Datum auswählen'), 1), _cache[144] || (_cache[144] = _createElementVNode("i", {
                    "data-lucide": "calendar",
                    class: "w-6 h-6 text-accent"
                  }, null, -1))], 8, _hoisted_509),
                  (!taskForm.id)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_510, [_createElementVNode("div", {
                        class: "flex items-center justify-between cursor-pointer",
                        onClick: $event => (taskForm.repeat = (taskForm.repeat && taskForm.repeat !== 'none') ? 'none' : 'weekly')
                      }, [_cache[145] || (_cache[145] = _createElementVNode("span", { class: "font-bold text-sm text-white flex items-center gap-2" }, [_createElementVNode("i", {
                        "data-lucide": "repeat",
                        class: "w-4.5 h-4.5 text-accent"
                      }), _createTextVNode(" Wiederholt sich")], -1)), _createElementVNode("div", { class: _normalizeClass(["w-12 h-7 rounded-full relative transition-colors", (taskForm.repeat && taskForm.repeat !== 'none') ? 'toggle-accent-on' : 'bg-white/10']) }, [_createElementVNode("div", { class: _normalizeClass(["absolute top-1 w-5 h-5 rounded-full bg-white transition-all", (taskForm.repeat && taskForm.repeat !== 'none') ? 'left-6' : 'left-1']) }, null, 2)], 2)], 8, _hoisted_511), (taskForm.repeat && taskForm.repeat !== 'none')
                        ? (_openBlock(), _createElementBlock("div", _hoisted_512, [_createElementVNode("div", _hoisted_513, [
                            _createElementVNode("button", {
                              type: "button",
                              onClick: $event => (taskForm.repeat = 'daily'),
                              class: _normalizeClass([taskForm.repeat === 'daily' ? 'bg-white/10 text-white' : 'text-slate-500', "flex-1 py-2.5 rounded-full text-[10px] font-black uppercase cursor-pointer transition-colors"])
                            }, "Täglich", 10, _hoisted_514),
                            _createElementVNode("button", {
                              type: "button",
                              onClick: $event => (taskForm.repeat = 'weekly'),
                              class: _normalizeClass([taskForm.repeat === 'weekly' ? 'bg-white/10 text-white' : 'text-slate-500', "flex-1 py-2.5 rounded-full text-[10px] font-black uppercase cursor-pointer transition-colors"])
                            }, "Wöchentlich", 10, _hoisted_515),
                            _createElementVNode("button", {
                              type: "button",
                              onClick: $event => (taskForm.repeat = 'monthly'),
                              class: _normalizeClass([taskForm.repeat === 'monthly' ? 'bg-white/10 text-white' : 'text-slate-500', "flex-1 py-2.5 rounded-full text-[10px] font-black uppercase cursor-pointer transition-colors"])
                            }, "Monatlich", 10, _hoisted_516),
                            _createElementVNode("button", {
                              type: "button",
                              onClick: $event => (taskForm.repeat = 'yearly'),
                              class: _normalizeClass([taskForm.repeat === 'yearly' ? 'bg-white/10 text-white' : 'text-slate-500', "flex-1 py-2.5 rounded-full text-[10px] font-black uppercase cursor-pointer transition-colors"])
                            }, "Jährlich", 10, _hoisted_517)
                          ]), _createElementVNode("div", null, [_cache[146] || (_cache[146] = _createElementVNode("label", { class: "text-[10px] font-bold uppercase text-slate-500 ml-1 block mb-2" }, "Endet am (optional, sonst 10x)", -1)), _withDirectives(_createElementVNode("input", {
                            type: "date",
                            "onUpdate:modelValue": $event => ((taskForm.repeatUntil) = $event),
                            min: taskForm.date,
                            class: "w-full bg-black/20 border border-white/5 p-3.5 rounded-2xl font-bold text-sm text-white modal-input [color-scheme:dark]"
                          }, null, 8, _hoisted_518), [[_vModelText, taskForm.repeatUntil]])])]))
                        : _createCommentVNode("", true)]))
                    : _createCommentVNode("", true),
                  (taskForm.id && taskForm.repeatGroupId)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_519, [_cache[148] || (_cache[148] = _createElementVNode("div", { class: "flex items-center gap-2 text-sm font-bold text-white mb-3" }, [_createElementVNode("i", {
                        "data-lucide": "repeat",
                        class: "w-4.5 h-4.5 text-accent"
                      }), _createTextVNode(" Teil einer Wiederholungsserie ")], -1)), _createElementVNode("div", {
                        class: "flex items-center justify-between cursor-pointer",
                        onClick: $event => (taskForm.applyToSeries = !taskForm.applyToSeries)
                      }, [_cache[147] || (_cache[147] = _createElementVNode("span", { class: "text-xs font-semibold text-slate-300 pr-3" }, "Änderungen auf diese & alle zukünftigen Wiederholungen anwenden", -1)), _createElementVNode("div", { class: _normalizeClass(["w-12 h-7 rounded-full relative transition-colors shrink-0", taskForm.applyToSeries ? 'toggle-accent-on' : 'bg-white/10']) }, [_createElementVNode("div", { class: _normalizeClass(["absolute top-1 w-5 h-5 rounded-full bg-white transition-all", taskForm.applyToSeries ? 'left-6' : 'left-1']) }, null, 2)], 2)], 8, _hoisted_520), _cache[149] || (_cache[149] = _createElementVNode("p", { class: "text-[10px] text-slate-500 mt-2" }, "Ausgeschaltet: nur diese einzelne Aufgabe wird geändert.", -1))]))
                    : _createCommentVNode("", true),
                  (taskForm.type !== 'Hausaufgabe')
                    ? (_openBlock(), _createElementBlock("div", _hoisted_521, [_createElementVNode("div", _hoisted_522, [_cache[150] || (_cache[150] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400 ml-1 block" }, "Lernfortschritt", -1)), _createElementVNode("span", {
                        class: "font-black text-lg",
                        style: _normalizeStyle({ color: progressColor(taskForm.studyProgress) })
                      }, _toDisplayString(taskForm.studyProgress || 0) + "%", 5)]), _withDirectives(_createElementVNode("input", {
                        type: "range",
                        min: "0",
                        max: "100",
                        step: "5",
                        "onUpdate:modelValue": $event => ((taskForm.studyProgress) = $event),
                        class: "w-full progress-slider",
                        style: _normalizeStyle({ '--progress': (taskForm.studyProgress || 0) + '%', '--progress-color': progressColor(taskForm.studyProgress) })
                      }, null, 12, _hoisted_523), [[
                        _vModelText,
                        taskForm.studyProgress,
                        void 0,
                        { number: true }
                      ]]), _createElementVNode("div", _hoisted_524, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([0, 25, 50, 75, 100], (p) => {
                        return (_openBlock(), _createElementBlock("button", {
                          key: p,
                          type: "button",
                          onClick: $event => (taskForm.studyProgress = p),
                          class: _normalizeClass(["flex-1 py-2 rounded-full text-[10px] font-black uppercase cursor-pointer transition-colors", (taskForm.studyProgress || 0) === p ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'])
                        }, _toDisplayString(p) + "%", 11, _hoisted_525))
                      }), 128))])]))
                    : _createCommentVNode("", true),
                  _createElementVNode("div", null, [_createElementVNode("label", _hoisted_526, "Notizen " + _toDisplayString(taskForm.type !== 'Hausaufgabe' ? '(z.B. Lernstoff, Themen)' : '(optional)'), 1), _withDirectives(_createElementVNode("textarea", {
                    "onUpdate:modelValue": $event => ((taskForm.notes) = $event),
                    rows: "3",
                    placeholder: "z.B. Kapitel 4-6, Vokabeln Unit 3, Formelsammlung mitbringen...",
                    class: "w-full bg-black/20 border border-white/5 p-5 rounded-3xl font-medium text-sm text-white placeholder:text-slate-600 modal-input resize-none no-scrollbar"
                  }, null, 8, _hoisted_527), [[_vModelText, taskForm.notes]])])
                ]))], 40, _hoisted_495),
            (subjects.length > 0)
              ? (_openBlock(), _createElementBlock("div", _hoisted_528, [_createElementVNode("button", {
                  onClick: handleSaveTask,
                  class: "flex-1 btn-accent py-4.5 rounded-full font-black uppercase text-sm cursor-pointer active:scale-95 transition-transform"
                }, "Speichern", 8, _hoisted_529), (taskForm.id)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 0,
                      onClick: $event => (handleDeleteTask(taskForm.id)),
                      class: "w-16 bg-rose-500/15 border border-rose-500/25 text-rose-500 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                    }, [...(_cache[151] || (_cache[151] = [_createElementVNode("i", {
                      "data-lucide": "trash-2",
                      class: "w-6 h-6"
                    }, null, -1)]))], 8, _hoisted_530))
                  : _createCommentVNode("", true)]))
              : _createCommentVNode("", true)
          ])]))
        : _createCommentVNode("", true),
      isWeeklyRecapOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_531, [_createElementVNode("div", {
            class: _normalizeClass(["w-full h-full sm:max-w-sm sm:h-[92vh] sm:rounded-[2.5rem] sm:my-auto relative overflow-hidden select-none", {
                    'recap-slide-bg-0': weeklyRecapSlideIndex === 0,
                    'recap-slide-bg-1': weeklyRecapSlideIndex === 1,
                    'recap-slide-bg-2': weeklyRecapSlideIndex === 2,
                    'recap-slide-bg-3': weeklyRecapSlideIndex === 3
                 }]),
            onTouchstart: $event => (recapDragStart($event)),
            onTouchmove: $event => (recapDragMove($event)),
            onTouchend: $event => (recapDragEnd($event))
          }, [
            _createElementVNode("div", _hoisted_533, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(4, (n) => {
              return (_openBlock(), _createElementBlock("div", {
                key: n,
                class: "flex-1 h-1 rounded-full bg-white/25 overflow-hidden"
              }, [_createElementVNode("div", {
                class: "h-full bg-white rounded-full",
                style: _normalizeStyle({ width: (n - 1) < weeklyRecapSlideIndex ? '100%' : (n - 1 === weeklyRecapSlideIndex ? recapProgressPercent + '%' : '0%') })
              }, null, 4)]))
            }), 128))]),
            _createElementVNode("button", {
              onClick: closeWeeklyRecap,
              class: "absolute top-9 right-4 z-20 w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-white cursor-pointer"
            }, [...(_cache[152] || (_cache[152] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), _createElementVNode("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })], -1)]))], 8, _hoisted_534),
            _createElementVNode("div", _hoisted_535, [_createElementVNode("div", {
              class: "w-[35%] h-full cursor-pointer",
              onClick: prevRecapSlide
            }, null, 8, _hoisted_536), _createElementVNode("div", {
              class: "w-[65%] h-full cursor-pointer",
              onClick: nextRecapSlide
            }, null, 8, _hoisted_537)]),
            _createElementVNode("div", _hoisted_538, [(weeklyRecapSlideIndex === 0)
              ? (_openBlock(), _createElementBlock("div", _hoisted_539, [_cache[153] || (_cache[153] = _createElementVNode("i", {
                  "data-lucide": "sparkles",
                  class: "w-14 h-14 text-white mx-auto"
                }, null, -1)), _cache[154] || (_cache[154] = _createElementVNode("h2", { class: "text-3xl sm:text-4xl font-black text-white leading-tight" }, "Dein Wochen­rückblick", -1)), _createElementVNode("p", _hoisted_540, _toDisplayString(formatDate(weeklyRecapData.mondayStr)) + " – " + _toDisplayString(formatDate(weeklyRecapData.sundayStr)), 1)]))
              : (weeklyRecapSlideIndex === 1)
                ? (_openBlock(), _createElementBlock("div", _hoisted_541, [
                    _cache[155] || (_cache[155] = _createElementVNode("i", {
                      "data-lucide": "check-circle-2",
                      class: "w-14 h-14 text-white mx-auto"
                    }, null, -1)),
                    _cache[156] || (_cache[156] = _createElementVNode("p", { class: "text-white/70 font-bold uppercase tracking-widest text-xs" }, "Aufgaben erledigt", -1)),
                    _createElementVNode("h2", _hoisted_542, [_createTextVNode(_toDisplayString(weeklyRecapData.tasksDone), 1), _createElementVNode("span", _hoisted_543, " / " + _toDisplayString(weeklyRecapData.tasksTotal), 1)]),
                    _createElementVNode("p", _hoisted_544, _toDisplayString(weeklyRecapData.tasksTotal === 0 ? 'Keine Aufgaben diese Woche eingetragen.' : (weeklyRecapData.tasksDone === weeklyRecapData.tasksTotal ? 'Alles erledigt — stark! 🔥' : 'Weiter dran bleiben!')), 1)
                  ]))
                : (weeklyRecapSlideIndex === 2)
                  ? (_openBlock(), _createElementBlock("div", _hoisted_545, [
                      _cache[157] || (_cache[157] = _createElementVNode("i", {
                        "data-lucide": "trending-up",
                        class: "w-14 h-14 text-white mx-auto"
                      }, null, -1)),
                      _cache[158] || (_cache[158] = _createElementVNode("p", { class: "text-white/70 font-bold uppercase tracking-widest text-xs" }, "Ø Lernfortschritt", -1)),
                      _createElementVNode("h2", _hoisted_546, _toDisplayString(weeklyRecapData.avgProgress !== null ? weeklyRecapData.avgProgress + '%' : '–'), 1),
                      _createElementVNode("p", _hoisted_547, _toDisplayString(weeklyRecapData.avgProgress === null ? 'Keine Klausuren/Tests diese Woche.' : 'bei Klausuren & Tests dieser Woche.'), 1)
                    ]))
                  : (weeklyRecapSlideIndex === 3)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_548, [
                        _cache[159] || (_cache[159] = _createElementVNode("i", {
                          "data-lucide": "award",
                          class: "w-14 h-14 text-white mx-auto"
                        }, null, -1)),
                        _cache[160] || (_cache[160] = _createElementVNode("p", { class: "text-white/70 font-bold uppercase tracking-widest text-xs" }, "Neue Noten", -1)),
                        _createElementVNode("h2", _hoisted_549, _toDisplayString(weeklyRecapData.gradesCount), 1),
                        (weeklyRecapData.bestGrade)
                          ? (_openBlock(), _createElementBlock("p", _hoisted_550, " Beste Note: " + _toDisplayString(weeklyRecapData.bestGrade.points) + " Punkte in " + _toDisplayString(weeklyRecapData.bestGrade.subjectName) + " 🎉 ", 1))
                          : (_openBlock(), _createElementBlock("p", _hoisted_551, "Keine neuen Noten diese Woche.")),
                        _createElementVNode("button", {
                          onClick: _withModifiers(closeWeeklyRecap, ["stop"]),
                          class: "mt-4 bg-white/15 border border-white/30 backdrop-blur-sm text-white font-black uppercase text-xs px-6 py-3.5 rounded-full cursor-pointer"
                        }, "Weiter so! ✌️", 8, _hoisted_552)
                      ]))
                    : _createCommentVNode("", true)])
          ], 42, _hoisted_532)]))
        : _createCommentVNode("", true),
      isPdfExportModalOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_553, [_createElementVNode("div", _hoisted_554, [
            _createElementVNode("div", {
              class: "modal-drag-handle md:hidden shrink-0",
              onClick: $event => (isPdfExportModalOpen = false)
            }, null, 8, _hoisted_555),
            _createElementVNode("button", {
              onClick: $event => (isPdfExportModalOpen = false),
              class: "absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer z-10 modal-close-btn"
            }, [...(_cache[161] || (_cache[161] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "22",
              height: "22",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), _createElementVNode("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })], -1)]))], 8, _hoisted_556),
            _createElementVNode("div", _hoisted_557, [
              _cache[163] || (_cache[163] = _createElementVNode("h2", { class: "text-2xl font-black text-white mb-2 pr-10" }, "PDF exportieren", -1)),
              _cache[164] || (_cache[164] = _createElementVNode("p", { class: "text-xs text-slate-500 mb-6" }, "Wähle, welche Halbjahre im Notenspiegel enthalten sein sollen. Statistiken werden immer mit exportiert.", -1)),
              _createElementVNode("div", _hoisted_558, [_cache[162] || (_cache[162] = _createElementVNode("span", { class: "text-[10px] font-bold uppercase text-slate-500" }, "Halbjahre", -1)), _createElementVNode("button", {
                onClick: $event => (pdfExportSelectedHalfYears = (pdfExportSelectedHalfYears || []).length === (allAvailableHalfYears || []).length ? [] : [...(allAvailableHalfYears || [])]),
                class: "text-[11px] font-black uppercase text-accent hover:underline cursor-pointer"
              }, _toDisplayString((pdfExportSelectedHalfYears || []).length === (allAvailableHalfYears || []).length ? 'Keine' : 'Alle') + " auswählen ", 9, _hoisted_559)]),
              _createElementVNode("div", _hoisted_560, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(allAvailableHalfYears, (hy) => {
                return (_openBlock(), _createElementBlock("div", {
                  key: hy,
                  onClick: $event => (togglePdfHalfYear(hy)),
                  class: "flex items-center justify-between gap-3 bg-black/20 border border-white/5 rounded-2xl p-3.5 cursor-pointer"
                }, [_createElementVNode("span", _hoisted_562, _toDisplayString(hy), 1), _createElementVNode("div", { class: _normalizeClass(["w-11 h-6 rounded-full relative transition-colors shrink-0", (pdfExportSelectedHalfYears || []).includes(hy) ? 'toggle-accent-on' : 'bg-white/10']) }, [_createElementVNode("div", { class: _normalizeClass(["absolute top-1 w-4 h-4 rounded-full bg-white transition-all", (pdfExportSelectedHalfYears || []).includes(hy) ? 'left-6' : 'left-1']) }, null, 2)], 2)], 8, _hoisted_561))
              }), 128)), (!allAvailableHalfYears || allAvailableHalfYears.length === 0)
                ? (_openBlock(), _createElementBlock("p", _hoisted_563, "Noch keine Halbjahre mit Noten vorhanden."))
                : _createCommentVNode("", true)])
            ]),
            _createElementVNode("div", _hoisted_564, [_createElementVNode("button", {
              onClick: generatePdfExport,
              disabled: !pdfExportSelectedHalfYears || pdfExportSelectedHalfYears.length === 0 || pdfExportGenerating,
              class: "w-full btn-accent py-4.5 rounded-full font-black uppercase text-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            }, [pdfExportGenerating
              ? (_openBlock(), _createElementBlock("i", _hoisted_566))
              : (_openBlock(), _createElementBlock("i", _hoisted_567)), _createTextVNode(" " + _toDisplayString(pdfExportGenerating ? 'Wird erstellt...' : 'PDF erstellen'), 1)], 8, _hoisted_565)])
          ])]))
        : _createCommentVNode("", true),
      isAppSettingsModalOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_568, [_createElementVNode("div", {
            class: "modal-enter liquid-glass-modal border-t md:border w-full max-w-md rounded-t-[2.5rem] md:rounded-3xl p-6 sm:p-8 shadow-2xl relative pb-12 max-h-[88vh] md:max-h-[90vh] overflow-y-auto no-scrollbar",
            onTouchstart: $event => (modalDragStart($event, 'isAppSettingsModalOpen')),
            onTouchmove: $event => (modalDragMove($event)),
            onTouchend: $event => (modalDragEnd($event))
          }, [
            _cache[192] || (_cache[192] = _createElementVNode("div", { class: "modal-drag-handle md:hidden" }, null, -1)),
            _createElementVNode("button", {
              onClick: $event => (closeModal('isAppSettingsModalOpen')),
              class: "sticky top-0 float-right w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer modal-close-btn z-10 -mt-1 -mr-1"
            }, [...(_cache[165] || (_cache[165] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "22",
              height: "22",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), _createElementVNode("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })], -1)]))], 8, _hoisted_570),
            _cache[193] || (_cache[193] = _createElementVNode("h2", { class: "text-2xl font-black text-white mb-6 pr-10 flex items-center gap-3" }, [_createElementVNode("i", {
              "data-lucide": "settings",
              class: "w-7 h-7 text-accent"
            }), _createTextVNode(" Einstellungen ")], -1)),
            _createElementVNode("div", _hoisted_571, [
              _createElementVNode("div", _hoisted_572, [_cache[166] || (_cache[166] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400 block" }, "Dein Name", -1)), _cache[167] || (_cache[167] = _createElementVNode("p", { class: "text-xs text-slate-400 leading-normal" }, "Damit dich die App persönlich auf der Startseite begrüßt.", -1)), _withDirectives(_createElementVNode("input", {
                type: "text",
                placeholder: "z.B. Jonas",
                "onUpdate:modelValue": $event => ((displayName) = $event),
                class: "w-full bg-black/40 border border-white/10 rounded-xl text-white font-bold text-base px-4 py-3.5 outline-none focus:border-accent transition-colors mt-2 modal-input"
              }, null, 8, _hoisted_573), [[_vModelText, displayName]])]),
              _createElementVNode("div", _hoisted_574, [_cache[168] || (_cache[168] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400 block" }, "Aktuelle Klasse", -1)), _cache[169] || (_cache[169] = _createElementVNode("p", { class: "text-xs text-slate-400 leading-normal" }, "In welcher Klasse bist du aktuell?", -1)), _createElementVNode("div", _hoisted_575, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList([5,6,7,8,9,10,11,12], (k) => {
                return (_openBlock(), _createElementBlock("button", {
                  key: k,
                  type: "button",
                  onClick: $event => {tempCurrentClass = k; tempGradeSystem = k >= 11 ? '15' : '6'},
                  class: _normalizeClass([tempCurrentClass === k ? 'toggle-accent-on text-white font-black border-accent' : 'bg-black/40 text-slate-400 border-white/10', "py-3 rounded-xl text-sm font-bold border cursor-pointer transition-all active:scale-95"])
                }, _toDisplayString(k), 11, _hoisted_576))
              }), 128))])]),
              _createElementVNode("div", _hoisted_577, [_cache[170] || (_cache[170] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400 block" }, "Notensystem", -1)), _cache[171] || (_cache[171] = _createElementVNode("p", { class: "text-xs text-slate-400 leading-normal" }, "Noten aus dem 0–15 System bleiben erhalten, wenn du wechselst.", -1)), _createElementVNode("div", _hoisted_578, [_createElementVNode("button", {
                type: "button",
                onClick: $event => (tempGradeSystem = '15'),
                class: _normalizeClass([tempGradeSystem === '15' ? 'toggle-accent-on text-white font-black' : 'text-slate-400', "flex-1 py-3 rounded-full text-xs uppercase tracking-wider cursor-pointer transition-all"])
              }, "0–15 Punkte", 10, _hoisted_579), _createElementVNode("button", {
                type: "button",
                onClick: $event => (tempGradeSystem = '6'),
                class: _normalizeClass([tempGradeSystem === '6' ? 'toggle-accent-on text-white font-black' : 'text-slate-400', "flex-1 py-3 rounded-full text-xs uppercase tracking-wider cursor-pointer transition-all"])
              }, "1–6 Noten", 10, _hoisted_580)])]),
              (tempCurrentClass >= 11)
                ? (_openBlock(), _createElementBlock("div", _hoisted_581, [_cache[172] || (_cache[172] = _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400 block" }, "Klasse 11 Startjahr", -1)), _cache[173] || (_cache[173] = _createElementVNode("p", { class: "text-xs text-slate-400 leading-normal" }, "Bestimmt die automatische Berechnung des Halbjahres für alle Termine und Noten.", -1)), _createElementVNode("div", _hoisted_582, [_withDirectives(_createElementVNode("input", {
                    type: "number",
                    min: "2000",
                    max: "2099",
                    "onUpdate:modelValue": $event => ((tempStartYear) = $event),
                    class: "w-full bg-black/40 border border-white/10 rounded-xl text-accent font-black text-xl text-center py-4 outline-none focus:border-accent modal-input",
                    placeholder: "z.B. 2025"
                  }, null, 8, _hoisted_583), [[
                    _vModelText,
                    tempStartYear,
                    void 0,
                    { number: true }
                  ]])])]))
                : _createCommentVNode("", true),
              _createElementVNode("div", _hoisted_584, [_cache[175] || (_cache[175] = _createElementVNode("div", { class: "flex items-center gap-3" }, [_createElementVNode("i", {
                "data-lucide": "palette",
                class: "w-5 h-5 text-accent"
              }), _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400" }, "Akzentfarbe")], -1)), _createElementVNode("div", _hoisted_585, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(availableThemes, (theme) => {
                return (_openBlock(), _createElementBlock("button", {
                  key: theme.key,
                  onClick: $event => (setTheme(theme)),
                  class: "flex flex-col items-center gap-1.5 cursor-pointer group",
                  title: theme.name
                }, [_createElementVNode("div", {
                  class: _normalizeClass(["w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center", activeTheme === theme.key ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105']),
                  style: _normalizeStyle({ background: theme.accent })
                }, [(activeTheme === theme.key)
                  ? (_openBlock(), _createElementBlock("svg", _hoisted_587, [...(_cache[174] || (_cache[174] = [_createElementVNode("polyline", { points: "20 6 9 17 4 12" }, null, -1)]))]))
                  : _createCommentVNode("", true)], 6), _createElementVNode("span", _hoisted_588, _toDisplayString(theme.name), 1)], 8, _hoisted_586))
              }), 128))])]),
              _createElementVNode("div", _hoisted_589, [
                _cache[177] || (_cache[177] = _createElementVNode("div", { class: "flex items-center gap-3 mb-1" }, [_createElementVNode("i", {
                  "data-lucide": "bell-ring",
                  class: "w-5 h-5 text-accent"
                }), _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400" }, "Push-Benachrichtigungen")], -1)),
                _cache[178] || (_cache[178] = _createElementVNode("p", { class: "text-xs text-slate-500 leading-normal -mt-2" }, "Erhalte Benachrichtigungen auch wenn die App geschlossen ist.", -1)),
                _createElementVNode("div", _hoisted_590, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(pushNotificationSettings, (pn) => {
                  return (_openBlock(), _createElementBlock("div", {
                    key: pn.key,
                    class: "flex items-center justify-between bg-black/20 p-4 rounded-3xl border border-white/5"
                  }, [_createElementVNode("div", _hoisted_591, [_createElementVNode("i", {
                    "data-lucide": pn.icon,
                    class: "w-5 h-5 text-accent/70 shrink-0"
                  }, null, 8, _hoisted_592), _createElementVNode("span", _hoisted_593, _toDisplayString(pn.label), 1)]), _createElementVNode("div", {
                    onClick: $event => (pn.enabled = !pn.enabled),
                    class: _normalizeClass(["w-12 h-7 rounded-full relative cursor-pointer shrink-0", pn.enabled ? 'toggle-accent-on' : 'bg-slate-700']),
                    style: {"transition":"background-color 0.25s ease"}
                  }, [_createElementVNode("div", { class: _normalizeClass(["w-5 h-5 bg-white rounded-full absolute top-1 shadow-md toggle-thumb", pn.enabled ? 'right-1' : 'left-1']) }, null, 2)], 10, _hoisted_594)]))
                }), 128))]),
                _createElementVNode("button", {
                  onClick: requestPushPermission,
                  class: "w-full mt-1 bg-accent-dim2 border border-accent-border text-accent py-3.5 rounded-full font-black uppercase text-xs cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-accent-dim2"
                }, [...(_cache[176] || (_cache[176] = [_createElementVNode("i", {
                  "data-lucide": "bell-ring",
                  class: "w-4 h-4"
                }, null, -1), _createTextVNode(" Benachrichtigungen aktivieren ", -1)]))], 8, _hoisted_595)
              ]),
              _createElementVNode("div", _hoisted_596, [_cache[180] || (_cache[180] = _createElementVNode("div", { class: "flex items-center gap-3" }, [_createElementVNode("i", {
                "data-lucide": "file-down",
                class: "w-5 h-5 text-accent"
              }), _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400" }, "PDF-Export")], -1)), _cache[181] || (_cache[181] = _createElementVNode("p", { class: "text-xs text-slate-500 leading-normal -mt-1" }, "Notenspiegel & Statistiken als PDF exportieren — du wählst, welche Halbjahre enthalten sein sollen.", -1)), _createElementVNode("button", {
                onClick: openPdfExportModal,
                class: "w-full bg-white/10 border border-white/10 text-white font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              }, [...(_cache[179] || (_cache[179] = [_createElementVNode("i", {
                "data-lucide": "file-down",
                class: "w-4 h-4"
              }, null, -1), _createTextVNode(" PDF exportieren ", -1)]))], 8, _hoisted_597)]),
              _createElementVNode("div", _hoisted_598, [
                _cache[184] || (_cache[184] = _createElementVNode("div", { class: "flex items-center gap-3" }, [_createElementVNode("i", {
                  "data-lucide": "calendar",
                  class: "w-5 h-5 text-[#4285F4]"
                }), _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400" }, "Google Kalender")], -1)),
                _cache[185] || (_cache[185] = _createElementVNode("p", { class: "text-xs text-slate-500 leading-normal -mt-1" }, "Zeigt deine Google-Kalender-Termine zusätzlich in SchoolFlow an (nur lesend, keine Änderung an deinem Google Kalender).", -1)),
                googleCalendarConnected
                  ? (_openBlock(), _createElementBlock("div", _hoisted_599, [_createElementVNode("span", _hoisted_600, [_cache[182] || (_cache[182] = _createElementVNode("i", {
                      "data-lucide": "check-circle-2",
                      class: "w-4 h-4"
                    }, null, -1)), _createTextVNode(" Verbunden — " + _toDisplayString((googleEvents || []).length) + " Termine geladen ", 1)]), _createElementVNode("div", _hoisted_601, [_createElementVNode("button", {
                      onClick: fetchGoogleCalendarEvents,
                      disabled: googleCalendarSyncing,
                      class: "text-[11px] font-black uppercase text-accent hover:underline cursor-pointer disabled:opacity-50"
                    }, _toDisplayString(googleCalendarSyncing ? '...' : 'Aktualisieren'), 9, _hoisted_602), _createElementVNode("button", {
                      onClick: disconnectGoogleCalendar,
                      class: "text-[11px] font-black uppercase text-rose-400 hover:underline cursor-pointer"
                    }, "Trennen", 8, _hoisted_603)])]))
                  : _createCommentVNode("", true),
                (googleCalendarConnected && googleCalendarList && googleCalendarList.length > 0)
                  ? (_openBlock(), _createElementBlock("div", _hoisted_604, [_cache[183] || (_cache[183] = _createElementVNode("p", { class: "text-[10px] font-bold uppercase text-slate-500 ml-1" }, "Welche Kalender synchronisieren?", -1)), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(googleCalendarList, (cal) => {
                      return (_openBlock(), _createElementBlock("div", {
                        key: cal.id,
                        onClick: $event => (toggleGoogleCalendarSelection(cal.id)),
                        class: "flex items-center justify-between gap-3 bg-black/20 border border-white/5 rounded-2xl p-3 cursor-pointer"
                      }, [_createElementVNode("div", _hoisted_606, [_createElementVNode("span", {
                        class: "w-2.5 h-2.5 rounded-full shrink-0",
                        style: _normalizeStyle({ backgroundColor: cal.color })
                      }, null, 4), _createElementVNode("span", _hoisted_607, _toDisplayString(cal.name), 1), (cal.primary)
                        ? (_openBlock(), _createElementBlock("span", _hoisted_608, "Haupt"))
                        : _createCommentVNode("", true)]), _createElementVNode("div", { class: _normalizeClass(["w-11 h-6 rounded-full relative transition-colors shrink-0", googleSelectedCalendarIds.includes(cal.id) ? 'toggle-accent-on' : 'bg-white/10']) }, [_createElementVNode("div", { class: _normalizeClass(["absolute top-1 w-4 h-4 rounded-full bg-white transition-all", googleSelectedCalendarIds.includes(cal.id) ? 'left-6' : 'left-1']) }, null, 2)], 2)], 8, _hoisted_605))
                    }), 128))]))
                  : _createCommentVNode("", true),
                (!googleCalendarConnected)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 2,
                      onClick: connectGoogleCalendar,
                      disabled: googleCalendarSyncing,
                      class: "w-full bg-white text-slate-900 font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    }, [googleCalendarSyncing
                      ? (_openBlock(), _createElementBlock("i", _hoisted_610))
                      : _createCommentVNode("", true), _createTextVNode(" " + _toDisplayString(googleCalendarSyncing ? 'Verbinde...' : 'Mit Google Kalender verbinden'), 1)], 8, _hoisted_609))
                  : _createCommentVNode("", true),
                googleCalendarError
                  ? (_openBlock(), _createElementBlock("p", _hoisted_611, _toDisplayString(googleCalendarError), 1))
                  : _createCommentVNode("", true)
              ]),
              _createElementVNode("div", _hoisted_612, [_cache[186] || (_cache[186] = _createElementVNode("div", { class: "flex items-center gap-3" }, [_createElementVNode("i", {
                "data-lucide": "sparkles",
                class: "w-5 h-5 text-accent"
              }), _createElementVNode("label", { class: "text-xs font-bold uppercase text-slate-400" }, "Wochenrückblick")], -1)), _cache[187] || (_cache[187] = _createElementVNode("p", { class: "text-xs text-slate-500 leading-normal -mt-1" }, "An welchem Tag soll dein Wochenrückblick verfügbar sein?", -1)), _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": $event => ((tempWeeklyRecapWeekday) = $event),
                class: "w-full bg-black/20 border border-white/5 p-3.5 rounded-2xl font-bold text-sm text-white modal-input"
              }, [
                _createElementVNode("option", { value: 1 }, "Montag", 8, _hoisted_614),
                _createElementVNode("option", { value: 2 }, "Dienstag", 8, _hoisted_615),
                _createElementVNode("option", { value: 3 }, "Mittwoch", 8, _hoisted_616),
                _createElementVNode("option", { value: 4 }, "Donnerstag", 8, _hoisted_617),
                _createElementVNode("option", { value: 5 }, "Freitag", 8, _hoisted_618),
                _createElementVNode("option", { value: 6 }, "Samstag", 8, _hoisted_619),
                _createElementVNode("option", { value: 0 }, "Sonntag", 8, _hoisted_620)
              ], 8, _hoisted_613), [[
                _vModelSelect,
                tempWeeklyRecapWeekday,
                void 0,
                { number: true }
              ]])]),
              _createElementVNode("div", _hoisted_621, [_createElementVNode("button", {
                onClick: saveAppSettings,
                class: "w-full btn-accent py-4.5 rounded-full font-black uppercase text-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
              }, [...(_cache[188] || (_cache[188] = [_createElementVNode("i", {
                "data-lucide": "save",
                class: "w-5 h-5"
              }, null, -1), _createTextVNode(" Einstellungen speichern ", -1)]))], 8, _hoisted_622)]),
              _createElementVNode("div", _hoisted_623, [_cache[190] || (_cache[190] = _createElementVNode("label", { class: "text-xs font-black uppercase text-rose-400 block" }, "Gefahrenzone", -1)), _cache[191] || (_cache[191] = _createElementVNode("p", { class: "text-xs text-slate-500 leading-normal" }, "Dein Konto und alle deine Daten werden unwiderruflich gelöscht.", -1)), _createElementVNode("button", {
                onClick: handleDeleteAccount,
                class: "w-full bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-400 py-4 rounded-full font-black uppercase text-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
              }, [...(_cache[189] || (_cache[189] = [_createElementVNode("i", {
                "data-lucide": "trash-2",
                class: "w-5 h-5"
              }, null, -1), _createTextVNode(" Konto löschen ", -1)]))], 8, _hoisted_624)])
            ])
          ], 40, _hoisted_569)]))
        : _createCommentVNode("", true),
      isDatePickerOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_625, [_createElementVNode("div", _hoisted_626, [
            _createElementVNode("button", {
              onClick: $event => (isDatePickerOpen = false),
              class: "absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer modal-close-btn"
            }, [...(_cache[194] || (_cache[194] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "22",
              height: "22",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), _createElementVNode("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })], -1)]))], 8, _hoisted_627),
            _cache[197] || (_cache[197] = _createElementVNode("h3", { class: "text-xl font-black text-white mb-6 pr-10 flex items-center gap-2.5" }, [_createElementVNode("i", {
              "data-lucide": "calendar",
              class: "w-6 h-6 text-accent"
            }), _createTextVNode(" Datum wählen ")], -1)),
            _createElementVNode("div", _hoisted_628, [_createElementVNode("span", _hoisted_629, _toDisplayString(monthNames[calSelectMonth]) + " " + _toDisplayString(calSelectYear), 1), _createElementVNode("div", _hoisted_630, [_createElementVNode("button", {
              type: "button",
              onClick: prevSelectMonth,
              class: "w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-300 active:bg-white/10 transition-colors"
            }, [...(_cache[195] || (_cache[195] = [_createElementVNode("i", {
              "data-lucide": "chevron-left",
              class: "w-5 h-5"
            }, null, -1)]))], 8, _hoisted_631), _createElementVNode("button", {
              type: "button",
              onClick: nextSelectMonth,
              class: "w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-300 active:bg-white/10 transition-colors"
            }, [...(_cache[196] || (_cache[196] = [_createElementVNode("i", {
              "data-lucide": "chevron-right",
              class: "w-5 h-5"
            }, null, -1)]))], 8, _hoisted_632)])]),
            _createElementVNode("div", _hoisted_633, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(['Mo','Di','Mi','Do','Fr','Sa','So'], (d) => {
              return (_openBlock(), _createElementBlock("div", {
                key: d,
                class: "text-[11px] font-bold uppercase text-slate-500 py-1"
              }, _toDisplayString(d), 1))
            }), 128))]),
            _createElementVNode("div", _hoisted_634, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(datepickerDays, (day, idx) => {
              return (_openBlock(), _createElementBlock("div", {
                key: idx,
                class: _normalizeClass(["aspect-square rounded-xl flex flex-col items-center justify-center relative p-1 border text-sm cal-day", [
                            day.isCurrentMonth ? 'bg-black/20 text-white border-white/5 hover:border-accent cursor-pointer font-bold' : 'bg-transparent text-slate-800 border-transparent pointer-events-none',
                            isSelectedDate(day.date) ? 'ring-2 ring-accent bg-accent-dim2 text-accent-light' : ''
                         ]]),
                onClick: $event => (day.isCurrentMonth && selectDate(day.date))
              }, [_createElementVNode("span", null, _toDisplayString(day.day), 1), (day.isCurrentMonth && subjectOccursOnDate(day.date))
                ? (_openBlock(), _createElementBlock("span", {
                    key: 0,
                    class: "w-1.5 h-1.5 rounded-full mt-0.5 shrink-0",
                    style: _normalizeStyle({ backgroundColor: subjects.find(s => s.id === datePickerRelevantSubjectId)?.color || 'var(--accent)' })
                  }, null, 4))
                : _createCommentVNode("", true)], 10, _hoisted_635))
            }), 128))]),
            datePickerRelevantSubjectId
              ? (_openBlock(), _createElementBlock("p", _hoisted_636, [_createElementVNode("span", {
                  class: "w-2 h-2 rounded-full shrink-0",
                  style: _normalizeStyle({ backgroundColor: subjects.find(s => s.id === datePickerRelevantSubjectId)?.color || 'var(--accent)' })
                }, null, 4), _createTextVNode(" Markiert: Tage, an denen " + _toDisplayString(subjects.find(s => s.id === datePickerRelevantSubjectId)?.name || 'das Fach') + " laut Stundenplan stattfindet ", 1)]))
              : _createCommentVNode("", true)
          ])]))
        : _createCommentVNode("", true),
      isInstallGuideModalOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_637, [_createElementVNode("div", _hoisted_638, [
            _createElementVNode("button", {
              onClick: $event => (closeModal('isInstallGuideModalOpen')),
              class: "absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer modal-close-btn"
            }, [...(_cache[198] || (_cache[198] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "22",
              height: "22",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), _createElementVNode("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })], -1)]))], 8, _hoisted_639),
            _cache[199] || (_cache[199] = _createElementVNode("div", { class: "w-20 h-20 bg-accent-dim text-accent rounded-full flex items-center justify-center mx-auto mb-5" }, [_createElementVNode("i", {
              "data-lucide": "smartphone",
              class: "w-10 h-10"
            })], -1)),
            _cache[200] || (_cache[200] = _createElementVNode("h3", { class: "text-xl font-black text-white mb-2" }, "SchoolFlow als App", -1)),
            _cache[201] || (_cache[201] = _createElementVNode("p", { class: "text-sm text-slate-400 leading-relaxed mb-5" }, " Füge SchoolFlow zu deinem Startbildschirm hinzu, um sie wie eine echte App im Vollbild zu nutzen! ", -1)),
            _cache[202] || (_cache[202] = _createElementVNode("div", { class: "bg-black/25 border border-white/5 rounded-3xl p-5 text-left space-y-4" }, [_createElementVNode("div", { class: "flex items-start gap-3.5 text-sm text-slate-300" }, [_createElementVNode("span", { class: "w-7 h-7 bg-white/5 rounded-full flex items-center justify-center font-bold text-xs shrink-0" }, "1"), _createElementVNode("p", null, [_createTextVNode("Öffne die URL in deinem Browser (z.B. "), _createElementVNode("strong", null, "Safari"), _createTextVNode(").")])]), _createElementVNode("div", { class: "flex items-start gap-3.5 text-sm text-slate-300" }, [_createElementVNode("span", { class: "w-7 h-7 bg-white/5 rounded-full flex items-center justify-center font-bold text-xs shrink-0" }, "2"), _createElementVNode("p", null, [
              _createTextVNode("Tippe auf das "),
              _createElementVNode("strong", null, "Teilen-Symbol"),
              _createTextVNode(),
              _createElementVNode("i", {
                "data-lucide": "share",
                class: "inline w-5 h-5 text-accent"
              }),
              _createTextVNode(" in der Leiste.")
            ])]), _createElementVNode("div", { class: "flex items-start gap-3.5 text-sm text-slate-300" }, [_createElementVNode("span", { class: "w-7 h-7 bg-white/5 rounded-full flex items-center justify-center font-bold text-xs shrink-0" }, "3"), _createElementVNode("p", null, [_createTextVNode("Wähle "), _createElementVNode("strong", null, "\"Zum Home-Bildschirm\""), _createTextVNode(".")])])], -1)),
            _createElementVNode("button", {
              onClick: $event => (closeModal('isInstallGuideModalOpen')),
              class: "mt-6 w-full btn-accent py-4.5 rounded-full font-black uppercase text-sm cursor-pointer active:scale-95 transition-transform"
            }, "Alles klar!", 8, _hoisted_640)
          ])]))
        : _createCommentVNode("", true),
      isNotificationsOpen
        ? (_openBlock(), _createElementBlock("div", _hoisted_641, [_createElementVNode("div", _hoisted_642, [_createElementVNode("div", {
            class: "modal-drag-handle md:hidden shrink-0 px-6 pt-6",
            onTouchstart: _withModifiers($event => (modalDragStart($event, 'isNotificationsOpen')), ["stop"]),
            onTouchmove: _withModifiers($event => (modalDragMove($event)), ["stop"]),
            onTouchend: _withModifiers($event => (modalDragEnd($event)), ["stop"])
          }, null, 40, _hoisted_643), _createElementVNode("button", {
            onClick: $event => (isNotificationsOpen = false),
            class: "absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer modal-close-btn z-20"
          }, [...(_cache[203] || (_cache[203] = [_createElementVNode("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [_createElementVNode("line", {
            x1: "18",
            y1: "6",
            x2: "6",
            y2: "18"
          }), _createElementVNode("line", {
            x1: "6",
            y1: "6",
            x2: "18",
            y2: "18"
          })], -1)]))], 8, _hoisted_644), _createElementVNode("div", {
            class: "overflow-y-auto no-scrollbar px-6 sm:px-8 pb-12 pt-2 sm:pt-4",
            onTouchstart: $event => (modalDragStart($event, 'isNotificationsOpen')),
            onTouchmove: $event => (modalDragMove($event)),
            onTouchend: $event => (modalDragEnd($event))
          }, [
            _createElementVNode("h2", {
              class: "text-2xl font-black text-white mb-2 pr-10 flex items-center gap-3",
              onTouchstart: _withModifiers($event => (modalDragStart($event, 'isNotificationsOpen')), ["stop"]),
              onTouchmove: _withModifiers($event => (modalDragMove($event)), ["stop"]),
              onTouchend: _withModifiers($event => (modalDragEnd($event)), ["stop"])
            }, [...(_cache[204] || (_cache[204] = [_createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "#818cf8",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [_createElementVNode("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }), _createElementVNode("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })], -1), _createTextVNode(" Benachrichtigungen ", -1)]))], 40, _hoisted_646),
            _cache[212] || (_cache[212] = _createElementVNode("p", { class: "text-xs text-slate-500 mb-6" }, "Aktivitäten und Freundschaftsanfragen", -1)),
            _createElementVNode("div", _hoisted_647, [_createElementVNode("div", _hoisted_648, [_cache[205] || (_cache[205] = _createElementVNode("div", null, [_createElementVNode("p", { class: "font-black text-white text-sm" }, "Klausur-Erinnerungen"), _createElementVNode("p", { class: "text-[11px] text-slate-500 mt-0.5" }, "Benachrichtigung, wenn die App offen ist")], -1)), _createElementVNode("button", {
              type: "button",
              onClick: $event => (examRemindersEnabled ? (examRemindersEnabled = false, saveReminderSettings()) : requestPushPermission()),
              class: _normalizeClass([examRemindersEnabled ? 'bg-accent' : 'bg-slate-700', "relative inline-flex h-8 w-14 rounded-full transition-all cursor-pointer shrink-0"])
            }, [_createElementVNode("span", {
              class: _normalizeClass([examRemindersEnabled ? 'translate-x-7' : 'translate-x-1', "inline-block h-6 w-6 transform rounded-full bg-white mt-1 shadow-md"]),
              style: {"transition":"transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)"}
            }, null, 2)], 10, _hoisted_649)]), examRemindersEnabled
              ? (_openBlock(), _createElementBlock("div", _hoisted_650, [
                  _cache[206] || (_cache[206] = _createElementVNode("span", { class: "text-xs text-slate-400" }, "Erinnere mich", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": $event => ((examReminderDays) = $event),
                    onChange: saveReminderSettings,
                    class: "bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white px-3 py-1.5 outline-none"
                  }, [
                    _createElementVNode("option", { value: 0 }, "am selben Tag", 8, _hoisted_652),
                    _createElementVNode("option", { value: 1 }, "1 Tag vorher", 8, _hoisted_653),
                    _createElementVNode("option", { value: 2 }, "2 Tage vorher", 8, _hoisted_654),
                    _createElementVNode("option", { value: 3 }, "3 Tage vorher", 8, _hoisted_655),
                    _createElementVNode("option", { value: 7 }, "1 Woche vorher", 8, _hoisted_656)
                  ], 40, _hoisted_651), [[
                    _vModelSelect,
                    examReminderDays,
                    void 0,
                    { number: true }
                  ]]),
                  _cache[207] || (_cache[207] = _createElementVNode("span", { class: "text-xs text-slate-400" }, "um", -1)),
                  _withDirectives(_createElementVNode("input", {
                    type: "time",
                    "onUpdate:modelValue": $event => ((examReminderTime) = $event),
                    onChange: saveReminderSettings,
                    class: "bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white px-3 py-1.5 outline-none"
                  }, null, 40, _hoisted_657), [[_vModelText, examReminderTime]])
                ]))
              : _createCommentVNode("", true)]),
            (!notifications || notifications.length === 0)
              ? (_openBlock(), _createElementBlock("div", _hoisted_658, [...(_cache[208] || (_cache[208] = [_createElementVNode("div", { class: "w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto empty-state-icon" }, [_createElementVNode("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "32",
                  height: "32",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  class: "text-slate-600"
                }, [
                  _createElementVNode("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }),
                  _createElementVNode("path", { d: "M18.63 13A17.89 17.89 0 0 1 18 8" }),
                  _createElementVNode("path", { d: "M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" }),
                  _createElementVNode("path", { d: "M18 8a6 6 0 0 0-9.33-5" }),
                  _createElementVNode("line", {
                    x1: "1",
                    y1: "1",
                    x2: "23",
                    y2: "23"
                  })
                ])], -1), _createElementVNode("p", { class: "text-slate-500 font-bold text-sm" }, "Keine Benachrichtigungen", -1)]))]))
              : (_openBlock(), _createElementBlock("div", _hoisted_659, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(notifications, (notif) => {
                  return (_openBlock(), _createElementBlock("div", {
                    key: notif.id,
                    class: _normalizeClass(["bg-black/20 border rounded-3xl p-4 flex items-start gap-4 transition-all", notif.read ? 'border-white/5' : 'border-accent-border bg-accent-dim2'])
                  }, [_createElementVNode("div", { class: _normalizeClass(["w-10 h-10 rounded-full flex items-center justify-center shrink-0", notif.type === 'friend_request' ? 'bg-accent-dim2 text-accent' : notif.type === 'friend_accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/20 text-violet-400']) }, [(notif.type === 'friend_request')
                    ? (_openBlock(), _createElementBlock("svg", _hoisted_660, [...(_cache[209] || (_cache[209] = [
                        _createElementVNode("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }, null, -1),
                        _createElementVNode("circle", {
                          cx: "9",
                          cy: "7",
                          r: "4"
                        }, null, -1),
                        _createElementVNode("line", {
                          x1: "19",
                          y1: "8",
                          x2: "19",
                          y2: "14"
                        }, null, -1),
                        _createElementVNode("line", {
                          x1: "22",
                          y1: "11",
                          x2: "16",
                          y2: "11"
                        }, null, -1)
                      ]))]))
                    : (notif.type === 'friend_accepted')
                      ? (_openBlock(), _createElementBlock("svg", _hoisted_661, [...(_cache[210] || (_cache[210] = [_createElementVNode("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }, null, -1), _createElementVNode("circle", {
                          cx: "9",
                          cy: "7",
                          r: "4"
                        }, null, -1), _createElementVNode("polyline", { points: "16 11 18 13 22 9" }, null, -1)]))]))
                      : (_openBlock(), _createElementBlock("svg", _hoisted_662, [...(_cache[211] || (_cache[211] = [_createElementVNode("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }, null, -1), _createElementVNode("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }, null, -1)]))]))], 2), _createElementVNode("div", _hoisted_663, [_createElementVNode("p", _hoisted_664, _toDisplayString(notif.message), 1), _createElementVNode("p", _hoisted_665, _toDisplayString(notif.timeAgo), 1), (notif.type === 'friend_request' && !notif.responded)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_666, [_createElementVNode("button", {
                        onClick: $event => (acceptFriendRequest(notif)),
                        class: "flex-1 toggle-accent-on text-white py-2 rounded-full text-xs font-black uppercase cursor-pointer active:scale-95 transition-transform"
                      }, "Annehmen", 8, _hoisted_667), _createElementVNode("button", {
                        onClick: $event => (declineFriendRequest(notif)),
                        class: "flex-1 bg-white/5 border border-white/10 text-slate-400 py-2 rounded-full text-xs font-black uppercase cursor-pointer active:scale-95 transition-transform"
                      }, "Ablehnen", 8, _hoisted_668)]))
                    : (notif.type === 'friend_request' && notif.responded)
                      ? (_openBlock(), _createElementBlock("div", _hoisted_669, [_createElementVNode("span", { class: _normalizeClass(["text-xs font-bold", notif.accepted ? 'text-emerald-400' : 'text-slate-500']) }, _toDisplayString(notif.accepted ? '✓ Angenommen' : 'Abgelehnt'), 3)]))
                      : _createCommentVNode("", true)]), (!notif.read)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_670))
                    : _createCommentVNode("", true)], 2))
                }), 128))])),
            (unreadNotifications && unreadNotifications.length > 0)
              ? (_openBlock(), _createElementBlock("button", {
                  key: 2,
                  onClick: markAllNotificationsRead,
                  class: "mt-6 w-full bg-white/5 border border-white/10 text-slate-400 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-transform"
                }, " Alle als gelesen markieren ", 8, _hoisted_671))
              : _createCommentVNode("", true)
          ], 40, _hoisted_645)])]))
        : _createCommentVNode("", true),
      isFriendsOpen
        ? (_openBlock(), _createElementBlock("div", {
            key: 16,
            onClick: _withModifiers($event => (isFriendsOpen = false), ["self"]),
            class: "fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-950/70 backdrop-blur-md p-0 md:p-6 modal-overlay-enter"
          }, [_createElementVNode("div", _hoisted_673, [_createElementVNode("div", {
            class: "modal-drag-handle md:hidden shrink-0 px-6 pt-6",
            onTouchstart: _withModifiers($event => (modalDragStart($event, 'isFriendsOpen')), ["stop"]),
            onTouchmove: _withModifiers($event => (modalDragMove($event)), ["stop"]),
            onTouchend: _withModifiers($event => (modalDragEnd($event)), ["stop"])
          }, null, 40, _hoisted_674), _createElementVNode("div", _hoisted_675, [_createElementVNode("div", {
            class: "flex items-center justify-between mb-5",
            onTouchstart: _withModifiers($event => (modalDragStart($event, 'isFriendsOpen')), ["stop"]),
            onTouchmove: _withModifiers($event => (modalDragMove($event)), ["stop"]),
            onTouchend: _withModifiers($event => (modalDragEnd($event)), ["stop"])
          }, [_cache[214] || (_cache[214] = _createElementVNode("h2", { class: "text-2xl font-black text-white flex items-center gap-3" }, [_createElementVNode("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "28",
            height: "28",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#818cf8",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            _createElementVNode("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
            _createElementVNode("circle", {
              cx: "9",
              cy: "7",
              r: "4"
            }),
            _createElementVNode("line", {
              x1: "19",
              y1: "8",
              x2: "19",
              y2: "14"
            }),
            _createElementVNode("line", {
              x1: "22",
              y1: "11",
              x2: "16",
              y2: "11"
            })
          ]), _createTextVNode(" Soziales ")], -1)), _createElementVNode("button", {
            onClick: $event => (isFriendsOpen = false),
            class: "w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 cursor-pointer modal-close-btn shrink-0"
          }, [...(_cache[213] || (_cache[213] = [_createElementVNode("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [_createElementVNode("line", {
            x1: "18",
            y1: "6",
            x2: "6",
            y2: "18"
          }), _createElementVNode("line", {
            x1: "6",
            y1: "6",
            x2: "18",
            y2: "18"
          })], -1)]))], 8, _hoisted_677)], 40, _hoisted_676), _createElementVNode("div", _hoisted_678, [_createElementVNode("nav", _hoisted_679, [
            _createElementVNode("div", {
              class: "liquid-glass-glider pointer-events-none",
              style: _normalizeStyle({
                                     width: 'calc((100% - 12px) / 3)',
                                     left: `calc(6px + ${activeFriendsSubNavIndex} * ((100% - 12px) / 3))`
                                 })
            }, [...(_cache[215] || (_cache[215] = [_createElementVNode("div", { class: "glider-specular-top" }, null, -1), _createElementVNode("div", { class: "glider-dot-glow" }, null, -1)]))], 4),
            _createElementVNode("button", {
              onClick: $event => (friendsTab = 'members'),
              class: _normalizeClass(["relative z-10 flex-1 py-2 rounded-full text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95", activeFriendsSubNavIndex === 0 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
            }, " Mitglieder ", 10, _hoisted_680),
            _createElementVNode("button", {
              onClick: $event => (friendsTab = 'friends'),
              class: _normalizeClass(["relative z-10 flex-1 py-2 rounded-full text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95", activeFriendsSubNavIndex === 1 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
            }, " Freunde ", 10, _hoisted_681),
            _createElementVNode("button", {
              onClick: $event => (friendsTab = 'compare'),
              class: _normalizeClass(["relative z-10 flex-1 py-2 rounded-full text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95", activeFriendsSubNavIndex === 2 ? 'text-[#2d694c] font-black' : 'text-[#6E665E] font-bold hover:text-[#1f1b16]'])
            }, " Vergleich ", 10, _hoisted_682)
          ])])]), _createElementVNode("div", {
            class: "flex-1 overflow-y-auto no-scrollbar px-6 sm:px-8 pb-8",
            onTouchstart: $event => (modalDragStart($event, 'isFriendsOpen')),
            onTouchmove: $event => (modalDragMove($event)),
            onTouchend: $event => (modalDragEnd($event))
          }, [(friendsTab === 'members')
            ? (_openBlock(), _createElementBlock("div", _hoisted_684, [(!allMembers || allMembers.length === 0)
                ? (_openBlock(), _createElementBlock("div", _hoisted_685, [...(_cache[216] || (_cache[216] = [_createElementVNode("div", { class: "w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto empty-state-icon" }, [_createElementVNode("i", {
                    "data-lucide": "user-x",
                    class: "w-7 h-7 text-slate-600"
                  })], -1), _createElementVNode("p", { class: "text-slate-500 font-bold text-sm" }, "Keine weiteren Nutzer gefunden", -1)]))]))
                : (_openBlock(true), _createElementBlock(_Fragment, { key: 1 }, _renderList(allMembers, (member) => {
                    return (_openBlock(), _createElementBlock("div", {
                      key: member.uid,
                      class: "bg-black/20 border border-white/5 rounded-3xl p-4 flex items-center gap-3 transition-all"
                    }, [_createElementVNode("div", { class: _normalizeClass(["w-11 h-11 rounded-full flex items-center justify-center font-black text-base shrink-0 overflow-hidden", isFriend(member.uid) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-accent-dim2 text-accent']) }, [(member.photoUrl && (member.photoUrl.startsWith('data:') || member.photoUrl.startsWith('http')))
                      ? (_openBlock(), _createElementBlock("img", {
                          key: 0,
                          src: member.photoUrl,
                          class: "w-full h-full object-cover"
                        }, null, 8, _hoisted_686))
                      : (member.photoUrl)
                        ? (_openBlock(), _createElementBlock("span", _hoisted_687, _toDisplayString(member.photoUrl), 1))
                        : (_openBlock(), _createElementBlock("span", _hoisted_688, _toDisplayString(member.displayName ? member.displayName[0].toUpperCase() : '?'), 1))], 2), _createElementVNode("div", _hoisted_689, [_createElementVNode("p", _hoisted_690, _toDisplayString(member.displayName || member.email), 1), _createElementVNode("p", _hoisted_691, "Klasse " + _toDisplayString(member.currentClass || '?'), 1)]), (!isFriend(member.uid) && !hasSentRequest(member.uid))
                      ? (_openBlock(), _createElementBlock("button", {
                          key: 0,
                          onClick: $event => (sendFriendRequest(member)),
                          title: "Freundschaftsanfrage senden",
                          class: "w-10 h-10 toggle-accent-on text-white rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-all hover:bg-accent-dim shadow-lg shadow-black/30 shrink-0"
                        }, [...(_cache[217] || (_cache[217] = [_createElementVNode("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          width: "18",
                          height: "18",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round"
                        }, [
                          _createElementVNode("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
                          _createElementVNode("circle", {
                            cx: "9",
                            cy: "7",
                            r: "4"
                          }),
                          _createElementVNode("line", {
                            x1: "19",
                            y1: "8",
                            x2: "19",
                            y2: "14"
                          }),
                          _createElementVNode("line", {
                            x1: "22",
                            y1: "11",
                            x2: "16",
                            y2: "11"
                          })
                        ], -1)]))], 8, _hoisted_692))
                      : (hasSentRequest(member.uid))
                        ? (_openBlock(), _createElementBlock("button", {
                            key: 1,
                            onClick: $event => (sendFriendRequest(member)),
                            title: "Anfrage ausstehend – erneut senden",
                            class: "w-10 h-10 bg-amber-500/15 border border-amber-500/25 text-amber-400 rounded-full flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-all hover:bg-amber-500/25"
                          }, [...(_cache[218] || (_cache[218] = [_createElementVNode("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "18",
                            height: "18",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            "stroke-width": "2",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          }, [_createElementVNode("circle", {
                            cx: "12",
                            cy: "12",
                            r: "10"
                          }), _createElementVNode("polyline", { points: "12 6 12 12 16 14" })], -1)]))], 8, _hoisted_693))
                        : (isFriend(member.uid))
                          ? (_openBlock(), _createElementBlock("div", _hoisted_694, [...(_cache[219] || (_cache[219] = [_createElementVNode("svg", {
                              xmlns: "http://www.w3.org/2000/svg",
                              width: "18",
                              height: "18",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "2",
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round"
                            }, [_createElementVNode("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }), _createElementVNode("circle", {
                              cx: "9",
                              cy: "7",
                              r: "4"
                            }), _createElementVNode("polyline", { points: "16 11 18 13 22 9" })], -1)]))]))
                          : _createCommentVNode("", true)]))
                  }), 128))]))
            : _createCommentVNode("", true), (friendsTab === 'friends')
            ? (_openBlock(), _createElementBlock("div", _hoisted_695, [(!friends || friends.length === 0)
                ? (_openBlock(), _createElementBlock("div", _hoisted_696, [...(_cache[220] || (_cache[220] = [_createElementVNode("div", { class: "w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto empty-state-icon" }, [_createElementVNode("i", {
                    "data-lucide": "user-plus",
                    class: "w-7 h-7 text-slate-600"
                  })], -1), _createElementVNode("p", { class: "text-slate-500 font-bold text-sm" }, "Noch keine Freunde", -1), _createElementVNode("p", { class: "text-xs text-slate-600" }, "Füge Nutzer über die Mitgliederliste hinzu", -1)]))]))
                : (_openBlock(true), _createElementBlock(_Fragment, { key: 1 }, _renderList(friends, (friend) => {
                    return (_openBlock(), _createElementBlock("div", {
                      key: friend.uid,
                      class: "bg-black/20 border border-white/5 rounded-3xl p-4 flex items-center gap-3"
                    }, [_createElementVNode("div", _hoisted_697, [(friend.photoUrl && (friend.photoUrl.startsWith('data:') || friend.photoUrl.startsWith('http')))
                      ? (_openBlock(), _createElementBlock("img", {
                          key: 0,
                          src: friend.photoUrl,
                          class: "w-full h-full object-cover"
                        }, null, 8, _hoisted_698))
                      : (friend.photoUrl)
                        ? (_openBlock(), _createElementBlock("span", _hoisted_699, _toDisplayString(friend.photoUrl), 1))
                        : (_openBlock(), _createElementBlock("span", _hoisted_700, _toDisplayString(friend.displayName ? friend.displayName[0].toUpperCase() : '?'), 1))]), _createElementVNode("div", _hoisted_701, [_createElementVNode("p", _hoisted_702, _toDisplayString(friend.displayName || friend.email), 1), _createElementVNode("p", _hoisted_703, "Klasse " + _toDisplayString(friend.currentClass || '?'), 1)]), _createElementVNode("div", _hoisted_704, [_createElementVNode("button", {
                      onClick: $event => {friendsTab = 'compare'; selectedFriend = friend},
                      class: "text-xs font-bold text-accent px-3 py-2 bg-accent-dim2 border border-accent-border rounded-full cursor-pointer active:scale-95 transition-transform hover:bg-accent-dim flex items-center gap-1.5"
                    }, [...(_cache[221] || (_cache[221] = [_createElementVNode("i", {
                      "data-lucide": "bar-chart-2",
                      class: "w-3.5 h-3.5"
                    }, null, -1), _createTextVNode(" Vergleich ", -1)]))], 8, _hoisted_705), _createElementVNode("button", {
                      onClick: $event => (removeFriend(friend.uid)),
                      title: "Freundschaft beenden",
                      class: "w-9 h-9 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-all hover:bg-rose-500/20"
                    }, [...(_cache[222] || (_cache[222] = [_createElementVNode("i", {
                      "data-lucide": "user-x",
                      class: "w-4 h-4"
                    }, null, -1)]))], 8, _hoisted_706)])]))
                  }), 128))]))
            : _createCommentVNode("", true), (friendsTab === 'compare')
            ? (_openBlock(), _createElementBlock("div", _hoisted_707, [(!friends || friends.length === 0)
                ? (_openBlock(), _createElementBlock("div", _hoisted_708, [...(_cache[223] || (_cache[223] = [_createElementVNode("div", { class: "w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto empty-state-icon" }, [_createElementVNode("i", {
                    "data-lucide": "lock",
                    class: "w-7 h-7 text-slate-600"
                  })], -1), _createElementVNode("p", { class: "text-slate-500 font-bold text-sm" }, "Keine Freunde", -1), _createElementVNode("p", { class: "text-xs text-slate-600" }, "Befreunde dich zuerst mit jemandem", -1)]))]))
                : (_openBlock(), _createElementBlock("div", _hoisted_709, [_createElementVNode("div", _hoisted_710, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(friends, (f) => {
                    return (_openBlock(), _createElementBlock("button", {
                      key: f.uid,
                      onClick: $event => (selectedFriend = f),
                      class: _normalizeClass([selectedFriend && selectedFriend.uid === f.uid ? 'toggle-accent-on text-white border-accent shadow-lg shadow-black/30' : 'bg-black/20 text-slate-400 border-white/5', "px-3.5 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all active:scale-95 flex items-center gap-2"])
                    }, [_createElementVNode("div", _hoisted_712, [(f.photoUrl && (f.photoUrl.startsWith('data:') || f.photoUrl.startsWith('http')))
                      ? (_openBlock(), _createElementBlock("img", {
                          key: 0,
                          src: f.photoUrl,
                          class: "w-full h-full object-cover"
                        }, null, 8, _hoisted_713))
                      : (f.photoUrl)
                        ? (_openBlock(), _createElementBlock("span", _hoisted_714, _toDisplayString(f.photoUrl), 1))
                        : (_openBlock(), _createElementBlock("span", _hoisted_715, _toDisplayString(f.displayName ? f.displayName[0].toUpperCase() : '?'), 1))]), _createElementVNode("span", null, _toDisplayString(f.displayName || f.email), 1)], 10, _hoisted_711))
                  }), 128))]), (!selectedFriend)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_716, "Wähle einen Freund aus"))
                    : (_openBlock(), _createElementBlock("div", _hoisted_717, [
                        _createElementVNode("div", _hoisted_718, [_createElementVNode("div", _hoisted_719, [_cache[224] || (_cache[224] = _createElementVNode("span", { class: "text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5" }, [_createElementVNode("i", {
                          "data-lucide": "swords",
                          class: "w-3.5 h-3.5 text-accent"
                        }), _createTextVNode(" Head-to-Head Duell ")], -1)), _createElementVNode("span", _hoisted_720, "Halbjahr " + _toDisplayString(selectedHalfYear), 1)]), _createElementVNode("div", _hoisted_721, [_createElementVNode("div", _hoisted_722, [
                          _createElementVNode("div", _hoisted_723, [(userAvatar && (userAvatar.startsWith('data:') || userAvatar.startsWith('http')))
                            ? (_openBlock(), _createElementBlock("img", {
                                key: 0,
                                src: userAvatar,
                                class: "w-full h-full object-cover"
                              }, null, 8, _hoisted_724))
                            : userAvatar
                              ? (_openBlock(), _createElementBlock("span", _hoisted_725, _toDisplayString(userAvatar), 1))
                              : (_openBlock(), _createElementBlock("span", _hoisted_726, _toDisplayString(displayName ? displayName.slice(0,2).toUpperCase() : 'ICH'), 1))]),
                          _createElementVNode("h4", _hoisted_727, _toDisplayString(displayName || 'Ich'), 1),
                          _createElementVNode("span", _hoisted_728, "Kl. " + _toDisplayString(currentClass), 1),
                          _createElementVNode("div", _hoisted_729, _toDisplayString(comparisonSummary ? formatNumber(comparisonSummary.myOverall) : '-'), 1),
                          _cache[225] || (_cache[225] = _createElementVNode("span", { class: "text-[9px] text-slate-400 font-semibold uppercase" }, "Dein Ø", -1))
                        ]), _createElementVNode("div", _hoisted_730, [_cache[226] || (_cache[226] = _createElementVNode("span", { class: "w-8 h-8 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center text-xs font-black shadow-inner" }, " VS ", -1)), comparisonSummary
                          ? (_openBlock(), _createElementBlock("div", _hoisted_731, _toDisplayString(comparisonSummary.myWins) + ":" + _toDisplayString(comparisonSummary.friendWins), 1))
                          : _createCommentVNode("", true)]), _createElementVNode("div", _hoisted_732, [
                          _createElementVNode("div", _hoisted_733, [(selectedFriend.photoUrl && (selectedFriend.photoUrl.startsWith('data:') || selectedFriend.photoUrl.startsWith('http')))
                            ? (_openBlock(), _createElementBlock("img", {
                                key: 0,
                                src: selectedFriend.photoUrl,
                                class: "w-full h-full object-cover"
                              }, null, 8, _hoisted_734))
                            : (selectedFriend.photoUrl)
                              ? (_openBlock(), _createElementBlock("span", _hoisted_735, _toDisplayString(selectedFriend.photoUrl), 1))
                              : (_openBlock(), _createElementBlock("span", _hoisted_736, _toDisplayString(selectedFriend.displayName ? selectedFriend.displayName.slice(0,2).toUpperCase() : '?'), 1))]),
                          _createElementVNode("h4", _hoisted_737, _toDisplayString(selectedFriend.displayName || 'Freund'), 1),
                          _createElementVNode("span", _hoisted_738, "Kl. " + _toDisplayString(selectedFriend.currentClass || '?'), 1),
                          _createElementVNode("div", _hoisted_739, _toDisplayString(comparisonSummary ? formatNumber(comparisonSummary.friendOverall) : '-'), 1),
                          _cache[227] || (_cache[227] = _createElementVNode("span", { class: "text-[9px] text-slate-400 font-semibold uppercase" }, "Freund Ø", -1))
                        ])]), (comparisonSummary && comparisonSummary.myOverall !== null && comparisonSummary.friendOverall !== null)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_740, [(comparisonSummary.diff > 0.05)
                              ? (_openBlock(), _createElementBlock("span", _hoisted_741, " 🏆 +" + _toDisplayString(formatNumber(comparisonSummary.diff)) + " Pkt Vorsprung für dich! ", 1))
                              : (comparisonSummary.diff < -0.05)
                                ? (_openBlock(), _createElementBlock("span", _hoisted_742, " ⚡ " + _toDisplayString(formatNumber(Math.abs(comparisonSummary.diff))) + " Pkt Rückstand — Aufholjagd gestartet! ", 1))
                                : (_openBlock(), _createElementBlock("span", _hoisted_743, " 🤝 Absoluter Gleichstand im Schnitt! "))]))
                          : _createCommentVNode("", true)]),
                        (comparisonSummary && comparisonSummary.categories && comparisonSummary.categories.length > 0)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_744, [_cache[228] || (_cache[228] = _createElementVNode("div", { class: "flex items-center justify-between mb-3" }, [_createElementVNode("h5", { class: "text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" }, [_createElementVNode("i", {
                              "data-lucide": "layers",
                              class: "w-3.5 h-3.5 text-accent"
                            }), _createTextVNode(" Fachbereichs-Dominanz ")]), _createElementVNode("span", { class: "text-[10px] text-accent font-semibold" }, "Ausbau-Vorschlag ✨")], -1)), _createElementVNode("div", _hoisted_745, [(_openBlock(true), _createElementBlock(_Fragment, null, _renderList(comparisonSummary.categories, (cat) => {
                              return (_openBlock(), _createElementBlock("div", {
                                key: cat.label,
                                class: "bg-white/5 rounded-2xl p-3 border border-white/5"
                              }, [_createElementVNode("div", _hoisted_746, [_createElementVNode("span", _hoisted_747, _toDisplayString(cat.label), 1), _createElementVNode("span", { class: _normalizeClass([cat.myAvg > cat.friendAvg ? 'text-emerald-400' : (cat.friendAvg > cat.myAvg ? 'text-rose-400' : 'text-slate-400'), "text-[11px]"]) }, _toDisplayString(cat.myAvg > cat.friendAvg ? 'Du führst' : (cat.friendAvg > cat.myAvg ? (selectedFriend.displayName || 'Freund') + ' führt' : 'Gleichstand')), 3)]), _createElementVNode("div", _hoisted_748, [_createElementVNode("span", _hoisted_749, _toDisplayString(cat.myAvg !== null ? formatNumber(cat.myAvg) : '-'), 1), _createElementVNode("div", _hoisted_750, [_createElementVNode("div", {
                                class: "h-full bg-emerald-500 rounded-l-full transition-all",
                                style: _normalizeStyle({ width: ((cat.myAvg || 0) / ((cat.myAvg||0) + (cat.friendAvg||0.01)) * 100) + '%' })
                              }, null, 4), _createElementVNode("div", {
                                class: "h-full bg-accent rounded-r-full transition-all",
                                style: _normalizeStyle({ width: ((cat.friendAvg || 0) / ((cat.myAvg||0.01) + (cat.friendAvg||0)) * 100) + '%' })
                              }, null, 4)]), _createElementVNode("span", _hoisted_751, _toDisplayString(cat.friendAvg !== null ? formatNumber(cat.friendAvg) : '-'), 1)])]))
                            }), 128))])]))
                          : _createCommentVNode("", true),
                        _createElementVNode("div", _hoisted_752, [_createElementVNode("h5", _hoisted_753, [_cache[229] || (_cache[229] = _createElementVNode("span", null, "Gemeinsame Fächer im Detail", -1)), _createElementVNode("span", null, _toDisplayString((comparisonData || []).length) + " Fächer", 1)]), (!comparisonData || comparisonData.length === 0)
                          ? (_openBlock(), _createElementBlock("div", _hoisted_754, " Keine gemeinsamen Fächer oder noch keine Noten eingetragen. "))
                          : _createCommentVNode("", true), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(comparisonData, (row) => {
                          return (_openBlock(), _createElementBlock("div", {
                            key: row.subjectName,
                            class: "grid grid-cols-3 gap-3 items-center bg-black/20 border border-white/5 rounded-3xl px-4 py-3 hover:border-white/10 transition-colors"
                          }, [_createElementVNode("div", _hoisted_755, [_createElementVNode("div", { class: _normalizeClass(["text-2xl font-black leading-none font-['Epilogue']", row.myAvg !== null && row.friendAvg !== null ? (row.myAvg >= row.friendAvg ? 'text-emerald-400' : 'text-rose-400') : 'text-white']) }, _toDisplayString(row.myAvg !== null ? formatNumber(row.myAvg) : '–'), 3), (row.myAvg !== null && row.friendAvg !== null)
                            ? (_openBlock(), _createElementBlock("div", {
                                key: 0,
                                class: _normalizeClass(["text-[9px] font-bold mt-1", row.myAvg >= row.friendAvg ? 'text-emerald-500' : 'text-rose-500'])
                              }, _toDisplayString(row.myAvg > row.friendAvg ? '▲ besser' : (row.friendAvg > row.myAvg ? '▼ schlechter' : '= gleich')), 3))
                            : _createCommentVNode("", true)]), _createElementVNode("div", _hoisted_756, [_createElementVNode("div", {
                            class: "w-3 h-3 rounded-full mx-auto mb-1 shadow-sm",
                            style: _normalizeStyle({backgroundColor: row.color})
                          }, null, 4), _createElementVNode("p", _hoisted_757, _toDisplayString(row.subjectName), 1)]), _createElementVNode("div", _hoisted_758, [_createElementVNode("div", { class: _normalizeClass(["text-2xl font-black leading-none font-['Epilogue']", row.friendAvg !== null && row.myAvg !== null ? (row.friendAvg >= row.myAvg ? 'text-emerald-400' : 'text-rose-400') : 'text-accent-light']) }, _toDisplayString(row.friendAvg !== null ? formatNumber(row.friendAvg) : '–'), 3), (row.friendAvg !== null && row.myAvg !== null)
                            ? (_openBlock(), _createElementBlock("div", {
                                key: 0,
                                class: _normalizeClass(["text-[9px] font-bold mt-1", row.friendAvg >= row.myAvg ? 'text-emerald-500' : 'text-rose-500'])
                              }, _toDisplayString(row.friendAvg > row.myAvg ? '▲ besser' : (row.myAvg > row.friendAvg ? '▼ schlechter' : '= gleich')), 3))
                            : _createCommentVNode("", true)])]))
                        }), 128))]),
                        _cache[230] || (_cache[230] = _createElementVNode("div", { class: "bg-gradient-to-r from-accent-dim2/20 to-white/5 border border-white/5 rounded-3xl p-4 space-y-2 mt-4" }, [_createElementVNode("p", { class: "text-[11px] font-black uppercase text-accent tracking-wider flex items-center gap-1.5" }, [_createElementVNode("i", {
                          "data-lucide": "sparkles",
                          class: "w-3.5 h-3.5"
                        }), _createTextVNode(" Vorschläge für nächste Vergleichs-Features: ")]), _createElementVNode("ul", { class: "text-xs text-slate-300 space-y-1.5 pl-1 leading-relaxed" }, [_createElementVNode("li", { class: "flex items-start gap-1.5" }, [_createElementVNode("span", { class: "text-emerald-400 font-bold shrink-0" }, "✓"), _createElementVNode("span", null, [_createElementVNode("strong", null, "Lernziel-Challenge:"), _createTextVNode(" Setzt euch gemeinsam ein Ziel für die nächste Klausur und feiert den Erfolg.")])]), _createElementVNode("li", { class: "flex items-start gap-1.5" }, [_createElementVNode("span", { class: "text-accent font-bold shrink-0" }, "✓"), _createElementVNode("span", null, [_createElementVNode("strong", null, "Zeugnis-Prognose Duell:"), _createTextVNode(" Vergleicht euren prognostizierten Abiturschnitt oder Notenschnitt zum Jahresende.")])]), _createElementVNode("li", { class: "flex items-start gap-1.5" }, [_createElementVNode("span", { class: "text-amber-400 font-bold shrink-0" }, "✓"), _createElementVNode("span", null, [_createElementVNode("strong", null, "Privatsphäre pro Fach:"), _createTextVNode(" Einzelne Noten oder Fächer selektiv verbergen.")])])])], -1))
                      ]))]))]))
            : _createCommentVNode("", true)], 40, _hoisted_683)])], 8, _hoisted_672))
        : _createCommentVNode("", true)
    ]))
  }
}