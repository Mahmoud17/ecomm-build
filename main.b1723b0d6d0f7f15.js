"use strict";
(self.webpackChunkecomm = self.webpackChunkecomm || []).push([
  [179],
  {
    332: () => {
      function ee(e) {
        return "function" == typeof e;
      }
      function Ss(e) {
        const r = e((n) => {
          Error.call(n), (n.stack = new Error().stack);
        });
        return (
          (r.prototype = Object.create(Error.prototype)),
          (r.prototype.constructor = r),
          r
        );
      }
      const da = Ss(
        (e) =>
          function (r) {
            e(this),
              (this.message = r
                ? `${r.length} errors occurred during unsubscription:\n${r
                    .map((n, i) => `${i + 1}) ${n.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = r);
          }
      );
      function fi(e, t) {
        if (e) {
          const r = e.indexOf(t);
          0 <= r && e.splice(r, 1);
        }
      }
      class vt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: r } = this;
            if (r)
              if (((this._parentage = null), Array.isArray(r)))
                for (const s of r) s.remove(this);
              else r.remove(this);
            const { initialTeardown: n } = this;
            if (ee(n))
              try {
                n();
              } catch (s) {
                t = s instanceof da ? s.errors : [s];
              }
            const { _finalizers: i } = this;
            if (i) {
              this._finalizers = null;
              for (const s of i)
                try {
                  Ig(s);
                } catch (o) {
                  (t = t ?? []),
                    o instanceof da ? (t = [...t, ...o.errors]) : t.push(o);
                }
            }
            if (t) throw new da(t);
          }
        }
        add(t) {
          var r;
          if (t && t !== this)
            if (this.closed) Ig(t);
            else {
              if (t instanceof vt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (r = this._finalizers) && void 0 !== r ? r : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: r } = this;
          return r === t || (Array.isArray(r) && r.includes(t));
        }
        _addParent(t) {
          const { _parentage: r } = this;
          this._parentage = Array.isArray(r) ? (r.push(t), r) : r ? [r, t] : t;
        }
        _removeParent(t) {
          const { _parentage: r } = this;
          r === t ? (this._parentage = null) : Array.isArray(r) && fi(r, t);
        }
        remove(t) {
          const { _finalizers: r } = this;
          r && fi(r, t), t instanceof vt && t._removeParent(this);
        }
      }
      vt.EMPTY = (() => {
        const e = new vt();
        return (e.closed = !0), e;
      })();
      const Sg = vt.EMPTY;
      function Mg(e) {
        return (
          e instanceof vt ||
          (e && "closed" in e && ee(e.remove) && ee(e.add) && ee(e.unsubscribe))
        );
      }
      function Ig(e) {
        ee(e) ? e() : e.unsubscribe();
      }
      const Fr = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        fa = {
          setTimeout(e, t, ...r) {
            const { delegate: n } = fa;
            return n?.setTimeout
              ? n.setTimeout(e, t, ...r)
              : setTimeout(e, t, ...r);
          },
          clearTimeout(e) {
            const { delegate: t } = fa;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Tg(e) {
        fa.setTimeout(() => {
          const { onUnhandledError: t } = Fr;
          if (!t) throw e;
          t(e);
        });
      }
      function ha() {}
      const pM = fc("C", void 0, void 0);
      function fc(e, t, r) {
        return { kind: e, value: t, error: r };
      }
      let kr = null;
      function pa(e) {
        if (Fr.useDeprecatedSynchronousErrorHandling) {
          const t = !kr;
          if ((t && (kr = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: r, error: n } = kr;
            if (((kr = null), r)) throw n;
          }
        } else e();
      }
      class hc extends vt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), Mg(t) && t.add(this))
              : (this.destination = CM);
        }
        static create(t, r, n) {
          return new Ms(t, r, n);
        }
        next(t) {
          this.isStopped
            ? gc(
                (function mM(e) {
                  return fc("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? gc(
                (function gM(e) {
                  return fc("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? gc(pM, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const yM = Function.prototype.bind;
      function pc(e, t) {
        return yM.call(e, t);
      }
      class _M {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: r } = this;
          if (r.next)
            try {
              r.next(t);
            } catch (n) {
              ga(n);
            }
        }
        error(t) {
          const { partialObserver: r } = this;
          if (r.error)
            try {
              r.error(t);
            } catch (n) {
              ga(n);
            }
          else ga(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (r) {
              ga(r);
            }
        }
      }
      class Ms extends hc {
        constructor(t, r, n) {
          let i;
          if ((super(), ee(t) || !t))
            i = {
              next: t ?? void 0,
              error: r ?? void 0,
              complete: n ?? void 0,
            };
          else {
            let s;
            this && Fr.useDeprecatedNextContext
              ? ((s = Object.create(t)),
                (s.unsubscribe = () => this.unsubscribe()),
                (i = {
                  next: t.next && pc(t.next, s),
                  error: t.error && pc(t.error, s),
                  complete: t.complete && pc(t.complete, s),
                }))
              : (i = t);
          }
          this.destination = new _M(i);
        }
      }
      function ga(e) {
        Fr.useDeprecatedSynchronousErrorHandling
          ? (function vM(e) {
              Fr.useDeprecatedSynchronousErrorHandling &&
                kr &&
                ((kr.errorThrown = !0), (kr.error = e));
            })(e)
          : Tg(e);
      }
      function gc(e, t) {
        const { onStoppedNotification: r } = Fr;
        r && fa.setTimeout(() => r(e, t));
      }
      const CM = {
          closed: !0,
          next: ha,
          error: function DM(e) {
            throw e;
          },
          complete: ha,
        },
        mc =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function or(e) {
        return e;
      }
      function Ag(e) {
        return 0 === e.length
          ? or
          : 1 === e.length
          ? e[0]
          : function (r) {
              return e.reduce((n, i) => i(n), r);
            };
      }
      let Ie = (() => {
        class e {
          constructor(r) {
            r && (this._subscribe = r);
          }
          lift(r) {
            const n = new e();
            return (n.source = this), (n.operator = r), n;
          }
          subscribe(r, n, i) {
            const s = (function bM(e) {
              return (
                (e && e instanceof hc) ||
                ((function EM(e) {
                  return e && ee(e.next) && ee(e.error) && ee(e.complete);
                })(e) &&
                  Mg(e))
              );
            })(r)
              ? r
              : new Ms(r, n, i);
            return (
              pa(() => {
                const { operator: o, source: a } = this;
                s.add(
                  o
                    ? o.call(s, a)
                    : a
                    ? this._subscribe(s)
                    : this._trySubscribe(s)
                );
              }),
              s
            );
          }
          _trySubscribe(r) {
            try {
              return this._subscribe(r);
            } catch (n) {
              r.error(n);
            }
          }
          forEach(r, n) {
            return new (n = Ng(n))((i, s) => {
              const o = new Ms({
                next: (a) => {
                  try {
                    r(a);
                  } catch (l) {
                    s(l), o.unsubscribe();
                  }
                },
                error: s,
                complete: i,
              });
              this.subscribe(o);
            });
          }
          _subscribe(r) {
            var n;
            return null === (n = this.source) || void 0 === n
              ? void 0
              : n.subscribe(r);
          }
          [mc]() {
            return this;
          }
          pipe(...r) {
            return Ag(r)(this);
          }
          toPromise(r) {
            return new (r = Ng(r))((n, i) => {
              let s;
              this.subscribe(
                (o) => (s = o),
                (o) => i(o),
                () => n(s)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function Ng(e) {
        var t;
        return null !== (t = e ?? Fr.Promise) && void 0 !== t ? t : Promise;
      }
      const SM = Ss(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let be = (() => {
        class e extends Ie {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(r) {
            const n = new Rg(this, this);
            return (n.operator = r), n;
          }
          _throwIfClosed() {
            if (this.closed) throw new SM();
          }
          next(r) {
            pa(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const n of this.currentObservers) n.next(r);
              }
            });
          }
          error(r) {
            pa(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = r);
                const { observers: n } = this;
                for (; n.length; ) n.shift().error(r);
              }
            });
          }
          complete() {
            pa(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: r } = this;
                for (; r.length; ) r.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var r;
            return (
              (null === (r = this.observers) || void 0 === r
                ? void 0
                : r.length) > 0
            );
          }
          _trySubscribe(r) {
            return this._throwIfClosed(), super._trySubscribe(r);
          }
          _subscribe(r) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(r),
              this._innerSubscribe(r)
            );
          }
          _innerSubscribe(r) {
            const { hasError: n, isStopped: i, observers: s } = this;
            return n || i
              ? Sg
              : ((this.currentObservers = null),
                s.push(r),
                new vt(() => {
                  (this.currentObservers = null), fi(s, r);
                }));
          }
          _checkFinalizedStatuses(r) {
            const { hasError: n, thrownError: i, isStopped: s } = this;
            n ? r.error(i) : s && r.complete();
          }
          asObservable() {
            const r = new Ie();
            return (r.source = this), r;
          }
        }
        return (e.create = (t, r) => new Rg(t, r)), e;
      })();
      class Rg extends be {
        constructor(t, r) {
          super(), (this.destination = t), (this.source = r);
        }
        next(t) {
          var r, n;
          null ===
            (n =
              null === (r = this.destination) || void 0 === r
                ? void 0
                : r.next) ||
            void 0 === n ||
            n.call(r, t);
        }
        error(t) {
          var r, n;
          null ===
            (n =
              null === (r = this.destination) || void 0 === r
                ? void 0
                : r.error) ||
            void 0 === n ||
            n.call(r, t);
        }
        complete() {
          var t, r;
          null ===
            (r =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === r ||
            r.call(t);
        }
        _subscribe(t) {
          var r, n;
          return null !==
            (n =
              null === (r = this.source) || void 0 === r
                ? void 0
                : r.subscribe(t)) && void 0 !== n
            ? n
            : Sg;
        }
      }
      function Pg(e) {
        return ee(e?.lift);
      }
      function Ne(e) {
        return (t) => {
          if (Pg(t))
            return t.lift(function (r) {
              try {
                return e(r, this);
              } catch (n) {
                this.error(n);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Oe(e, t, r, n, i) {
        return new MM(e, t, r, n, i);
      }
      class MM extends hc {
        constructor(t, r, n, i, s, o) {
          super(t),
            (this.onFinalize = s),
            (this.shouldUnsubscribe = o),
            (this._next = r
              ? function (a) {
                  try {
                    r(a);
                  } catch (l) {
                    t.error(l);
                  }
                }
              : super._next),
            (this._error = i
              ? function (a) {
                  try {
                    i(a);
                  } catch (l) {
                    t.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = n
              ? function () {
                  try {
                    n();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: r } = this;
            super.unsubscribe(),
              !r &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function te(e, t) {
        return Ne((r, n) => {
          let i = 0;
          r.subscribe(
            Oe(n, (s) => {
              n.next(e.call(t, s, i++));
            })
          );
        });
      }
      function ar(e) {
        return this instanceof ar ? ((this.v = e), this) : new ar(e);
      }
      function kg(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var r,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function Dc(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                r = t && e[t],
                n = 0;
              if (r) return r.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && n >= e.length && (e = void 0),
                      { value: e && e[n++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (r = {}),
            n("next"),
            n("throw"),
            n("return"),
            (r[Symbol.asyncIterator] = function () {
              return this;
            }),
            r);
        function n(s) {
          r[s] =
            e[s] &&
            function (o) {
              return new Promise(function (a, l) {
                !(function i(s, o, a, l) {
                  Promise.resolve(l).then(function (u) {
                    s({ value: u, done: a });
                  }, o);
                })(a, l, (o = e[s](o)).done, o.value);
              });
            };
        }
      }
      "function" == typeof SuppressedError && SuppressedError;
      const Cc = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Lg(e) {
        return ee(e?.then);
      }
      function Vg(e) {
        return ee(e[mc]);
      }
      function jg(e) {
        return Symbol.asyncIterator && ee(e?.[Symbol.asyncIterator]);
      }
      function $g(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Bg = (function QM() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Hg(e) {
        return ee(e?.[Bg]);
      }
      function Ug(e) {
        return (function Fg(e, t, r) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var i,
            n = r.apply(e, t || []),
            s = [];
          return (
            (i = {}),
            o("next"),
            o("throw"),
            o("return"),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i
          );
          function o(f) {
            n[f] &&
              (i[f] = function (h) {
                return new Promise(function (g, m) {
                  s.push([f, h, g, m]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function l(f) {
                f.value instanceof ar
                  ? Promise.resolve(f.value.v).then(u, c)
                  : d(s[0][2], f);
              })(n[f](h));
            } catch (g) {
              d(s[0][3], g);
            }
          }
          function u(f) {
            a("next", f);
          }
          function c(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), s.shift(), s.length && a(s[0][0], s[0][1]);
          }
        })(this, arguments, function* () {
          const r = e.getReader();
          try {
            for (;;) {
              const { value: n, done: i } = yield ar(r.read());
              if (i) return yield ar(void 0);
              yield yield ar(n);
            }
          } finally {
            r.releaseLock();
          }
        });
      }
      function zg(e) {
        return ee(e?.getReader);
      }
      function it(e) {
        if (e instanceof Ie) return e;
        if (null != e) {
          if (Vg(e))
            return (function KM(e) {
              return new Ie((t) => {
                const r = e[mc]();
                if (ee(r.subscribe)) return r.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (Cc(e))
            return (function ZM(e) {
              return new Ie((t) => {
                for (let r = 0; r < e.length && !t.closed; r++) t.next(e[r]);
                t.complete();
              });
            })(e);
          if (Lg(e))
            return (function YM(e) {
              return new Ie((t) => {
                e.then(
                  (r) => {
                    t.closed || (t.next(r), t.complete());
                  },
                  (r) => t.error(r)
                ).then(null, Tg);
              });
            })(e);
          if (jg(e)) return qg(e);
          if (Hg(e))
            return (function XM(e) {
              return new Ie((t) => {
                for (const r of e) if ((t.next(r), t.closed)) return;
                t.complete();
              });
            })(e);
          if (zg(e))
            return (function JM(e) {
              return qg(Ug(e));
            })(e);
        }
        throw $g(e);
      }
      function qg(e) {
        return new Ie((t) => {
          (function eI(e, t) {
            var r, n, i, s;
            return (function Og(e, t, r, n) {
              return new (r || (r = Promise))(function (s, o) {
                function a(c) {
                  try {
                    u(n.next(c));
                  } catch (d) {
                    o(d);
                  }
                }
                function l(c) {
                  try {
                    u(n.throw(c));
                  } catch (d) {
                    o(d);
                  }
                }
                function u(c) {
                  c.done
                    ? s(c.value)
                    : (function i(s) {
                        return s instanceof r
                          ? s
                          : new r(function (o) {
                              o(s);
                            });
                      })(c.value).then(a, l);
                }
                u((n = n.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (r = kg(e); !(n = yield r.next()).done; )
                  if ((t.next(n.value), t.closed)) return;
              } catch (o) {
                i = { error: o };
              } finally {
                try {
                  n && !n.done && (s = r.return) && (yield s.call(r));
                } finally {
                  if (i) throw i.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((r) => t.error(r));
        });
      }
      function $n(e, t, r, n = 0, i = !1) {
        const s = t.schedule(function () {
          r(), i ? e.add(this.schedule(null, n)) : this.unsubscribe();
        }, n);
        if ((e.add(s), !i)) return s;
      }
      function je(e, t, r = 1 / 0) {
        return ee(t)
          ? je((n, i) => te((s, o) => t(n, s, i, o))(it(e(n, i))), r)
          : ("number" == typeof t && (r = t),
            Ne((n, i) =>
              (function tI(e, t, r, n, i, s, o, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !u && t.complete();
                  },
                  h = (m) => (u < n ? g(m) : l.push(m)),
                  g = (m) => {
                    s && t.next(m), u++;
                    let y = !1;
                    it(r(m, c++)).subscribe(
                      Oe(
                        t,
                        (D) => {
                          i?.(D), s ? h(D) : t.next(D);
                        },
                        () => {
                          y = !0;
                        },
                        void 0,
                        () => {
                          if (y)
                            try {
                              for (u--; l.length && u < n; ) {
                                const D = l.shift();
                                o ? $n(t, o, () => g(D)) : g(D);
                              }
                              f();
                            } catch (D) {
                              t.error(D);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Oe(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(n, i, e, r)
            ));
      }
      function hi(e = 1 / 0) {
        return je(or, e);
      }
      const pn = new Ie((e) => e.complete());
      function Gg(e) {
        return e && ee(e.schedule);
      }
      function wc(e) {
        return e[e.length - 1];
      }
      function Wg(e) {
        return ee(wc(e)) ? e.pop() : void 0;
      }
      function Is(e) {
        return Gg(wc(e)) ? e.pop() : void 0;
      }
      function Qg(e, t = 0) {
        return Ne((r, n) => {
          r.subscribe(
            Oe(
              n,
              (i) => $n(n, e, () => n.next(i), t),
              () => $n(n, e, () => n.complete(), t),
              (i) => $n(n, e, () => n.error(i), t)
            )
          );
        });
      }
      function Kg(e, t = 0) {
        return Ne((r, n) => {
          n.add(e.schedule(() => r.subscribe(n), t));
        });
      }
      function Zg(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new Ie((r) => {
          $n(r, t, () => {
            const n = e[Symbol.asyncIterator]();
            $n(
              r,
              t,
              () => {
                n.next().then((i) => {
                  i.done ? r.complete() : r.next(i.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Le(e, t) {
        return t
          ? (function uI(e, t) {
              if (null != e) {
                if (Vg(e))
                  return (function iI(e, t) {
                    return it(e).pipe(Kg(t), Qg(t));
                  })(e, t);
                if (Cc(e))
                  return (function oI(e, t) {
                    return new Ie((r) => {
                      let n = 0;
                      return t.schedule(function () {
                        n === e.length
                          ? r.complete()
                          : (r.next(e[n++]), r.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (Lg(e))
                  return (function sI(e, t) {
                    return it(e).pipe(Kg(t), Qg(t));
                  })(e, t);
                if (jg(e)) return Zg(e, t);
                if (Hg(e))
                  return (function aI(e, t) {
                    return new Ie((r) => {
                      let n;
                      return (
                        $n(r, t, () => {
                          (n = e[Bg]()),
                            $n(
                              r,
                              t,
                              () => {
                                let i, s;
                                try {
                                  ({ value: i, done: s } = n.next());
                                } catch (o) {
                                  return void r.error(o);
                                }
                                s ? r.complete() : r.next(i);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ee(n?.return) && n.return()
                      );
                    });
                  })(e, t);
                if (zg(e))
                  return (function lI(e, t) {
                    return Zg(Ug(e), t);
                  })(e, t);
              }
              throw $g(e);
            })(e, t)
          : it(e);
      }
      function gn(...e) {
        const t = Is(e),
          r = (function rI(e, t) {
            return "number" == typeof wc(e) ? e.pop() : t;
          })(e, 1 / 0),
          n = e;
        return n.length ? (1 === n.length ? it(n[0]) : hi(r)(Le(n, t))) : pn;
      }
      class st extends be {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const r = super._subscribe(t);
          return !r.closed && t.next(this._value), r;
        }
        getValue() {
          const { hasError: t, thrownError: r, _value: n } = this;
          if (t) throw r;
          return this._throwIfClosed(), n;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function V(...e) {
        return Le(e, Is(e));
      }
      function Yg(e = {}) {
        const {
          connector: t = () => new be(),
          resetOnError: r = !0,
          resetOnComplete: n = !0,
          resetOnRefCountZero: i = !0,
        } = e;
        return (s) => {
          let o,
            a,
            l,
            u = 0,
            c = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (o = l = void 0), (c = d = !1);
            },
            g = () => {
              const m = o;
              h(), m?.unsubscribe();
            };
          return Ne((m, y) => {
            u++, !d && !c && f();
            const D = (l = l ?? t());
            y.add(() => {
              u--, 0 === u && !d && !c && (a = Ec(g, i));
            }),
              D.subscribe(y),
              !o &&
                u > 0 &&
                ((o = new Ms({
                  next: (v) => D.next(v),
                  error: (v) => {
                    (d = !0), f(), (a = Ec(h, r, v)), D.error(v);
                  },
                  complete: () => {
                    (c = !0), f(), (a = Ec(h, n)), D.complete();
                  },
                })),
                it(m).subscribe(o));
          })(s);
        };
      }
      function Ec(e, t, ...r) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const n = new Ms({
          next: () => {
            n.unsubscribe(), e();
          },
        });
        return it(t(...r)).subscribe(n);
      }
      function Xe(e, t) {
        return Ne((r, n) => {
          let i = null,
            s = 0,
            o = !1;
          const a = () => o && !i && n.complete();
          r.subscribe(
            Oe(
              n,
              (l) => {
                i?.unsubscribe();
                let u = 0;
                const c = s++;
                it(e(l, c)).subscribe(
                  (i = Oe(
                    n,
                    (d) => n.next(t ? t(l, d, c, u++) : d),
                    () => {
                      (i = null), a();
                    }
                  ))
                );
              },
              () => {
                (o = !0), a();
              }
            )
          );
        });
      }
      function dI(e, t) {
        return e === t;
      }
      function de(e) {
        for (let t in e) if (e[t] === de) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function ma(e, t) {
        for (const r in t)
          t.hasOwnProperty(r) && !e.hasOwnProperty(r) && (e[r] = t[r]);
      }
      function $e(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map($e).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const r = t.indexOf("\n");
        return -1 === r ? t : t.substring(0, r);
      }
      function bc(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const fI = de({ __forward_ref__: de });
      function _e(e) {
        return (
          (e.__forward_ref__ = _e),
          (e.toString = function () {
            return $e(this());
          }),
          e
        );
      }
      function z(e) {
        return Sc(e) ? e() : e;
      }
      function Sc(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(fI) &&
          e.__forward_ref__ === _e
        );
      }
      function Mc(e) {
        return e && !!e.ɵproviders;
      }
      const Xg = "https://g.co/ng/security#xss";
      class C extends Error {
        constructor(t, r) {
          super(
            (function va(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, r)
          ),
            (this.code = t);
        }
      }
      function G(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function Ic(e, t) {
        throw new C(-201, !1);
      }
      function Ut(e, t) {
        null == e &&
          (function $(e, t, r, n) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == n ? "" : ` [Expected=> ${r} ${n} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function R(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function yt(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function ya(e) {
        return Jg(e, Da) || Jg(e, em);
      }
      function Jg(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function _a(e) {
        return e && (e.hasOwnProperty(Tc) || e.hasOwnProperty(DI))
          ? e[Tc]
          : null;
      }
      const Da = de({ ɵprov: de }),
        Tc = de({ ɵinj: de }),
        em = de({ ngInjectableDef: de }),
        DI = de({ ngInjectorDef: de });
      var X = (function (e) {
        return (
          (e[(e.Default = 0)] = "Default"),
          (e[(e.Host = 1)] = "Host"),
          (e[(e.Self = 2)] = "Self"),
          (e[(e.SkipSelf = 4)] = "SkipSelf"),
          (e[(e.Optional = 8)] = "Optional"),
          e
        );
      })(X || {});
      let Ac;
      function _t(e) {
        const t = Ac;
        return (Ac = e), t;
      }
      function nm(e, t, r) {
        const n = ya(e);
        return n && "root" == n.providedIn
          ? void 0 === n.value
            ? (n.value = n.factory())
            : n.value
          : r & X.Optional
          ? null
          : void 0 !== t
          ? t
          : void Ic($e(e));
      }
      const De = globalThis,
        Ts = {},
        xc = "__NG_DI_FLAG__",
        Ca = "ngTempTokenPath",
        EI = /\n/gm,
        im = "__source";
      let pi;
      function lr(e) {
        const t = pi;
        return (pi = e), t;
      }
      function MI(e, t = X.Default) {
        if (void 0 === pi) throw new C(-203, !1);
        return null === pi
          ? nm(e, void 0, t)
          : pi.get(e, t & X.Optional ? null : void 0, t);
      }
      function M(e, t = X.Default) {
        return (
          (function tm() {
            return Ac;
          })() || MI
        )(z(e), t);
      }
      function P(e, t = X.Default) {
        return M(e, wa(t));
      }
      function wa(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Fc(e) {
        const t = [];
        for (let r = 0; r < e.length; r++) {
          const n = z(e[r]);
          if (Array.isArray(n)) {
            if (0 === n.length) throw new C(900, !1);
            let i,
              s = X.Default;
            for (let o = 0; o < n.length; o++) {
              const a = n[o],
                l = II(a);
              "number" == typeof l
                ? -1 === l
                  ? (i = a.token)
                  : (s |= l)
                : (i = a);
            }
            t.push(M(i, s));
          } else t.push(M(n));
        }
        return t;
      }
      function As(e, t) {
        return (e[xc] = t), (e.prototype[xc] = t), e;
      }
      function II(e) {
        return e[xc];
      }
      function Bn(e) {
        return { toString: e }.toString();
      }
      var Ea = (function (e) {
          return (
            (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e
          );
        })(Ea || {}),
        zt = (function (e) {
          return (
            (e[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            e
          );
        })(zt || {});
      const mn = {},
        se = [],
        ba = de({ ɵcmp: de }),
        kc = de({ ɵdir: de }),
        Lc = de({ ɵpipe: de }),
        om = de({ ɵmod: de }),
        Hn = de({ ɵfac: de }),
        Ns = de({ __NG_ELEMENT_ID__: de }),
        am = de({ __NG_ENV_ID__: de });
      function lm(e, t, r) {
        let n = e.length;
        for (;;) {
          const i = e.indexOf(t, r);
          if (-1 === i) return i;
          if (0 === i || e.charCodeAt(i - 1) <= 32) {
            const s = t.length;
            if (i + s === n || e.charCodeAt(i + s) <= 32) return i;
          }
          r = i + 1;
        }
      }
      function Vc(e, t, r) {
        let n = 0;
        for (; n < r.length; ) {
          const i = r[n];
          if ("number" == typeof i) {
            if (0 !== i) break;
            n++;
            const s = r[n++],
              o = r[n++],
              a = r[n++];
            e.setAttribute(t, o, a, s);
          } else {
            const s = i,
              o = r[++n];
            cm(s) ? e.setProperty(t, s, o) : e.setAttribute(t, s, o), n++;
          }
        }
        return n;
      }
      function um(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function cm(e) {
        return 64 === e.charCodeAt(0);
      }
      function Rs(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let r = -1;
            for (let n = 0; n < t.length; n++) {
              const i = t[n];
              "number" == typeof i
                ? (r = i)
                : 0 === r ||
                  dm(e, r, i, null, -1 === r || 2 === r ? t[++n] : null);
            }
          }
        return e;
      }
      function dm(e, t, r, n, i) {
        let s = 0,
          o = e.length;
        if (-1 === t) o = -1;
        else
          for (; s < e.length; ) {
            const a = e[s++];
            if ("number" == typeof a) {
              if (a === t) {
                o = -1;
                break;
              }
              if (a > t) {
                o = s - 1;
                break;
              }
            }
          }
        for (; s < e.length; ) {
          const a = e[s];
          if ("number" == typeof a) break;
          if (a === r) {
            if (null === n) return void (null !== i && (e[s + 1] = i));
            if (n === e[s + 1]) return void (e[s + 2] = i);
          }
          s++, null !== n && s++, null !== i && s++;
        }
        -1 !== o && (e.splice(o, 0, t), (s = o + 1)),
          e.splice(s++, 0, r),
          null !== n && e.splice(s++, 0, n),
          null !== i && e.splice(s++, 0, i);
      }
      const fm = "ng-template";
      function NI(e, t, r) {
        let n = 0,
          i = !0;
        for (; n < e.length; ) {
          let s = e[n++];
          if ("string" == typeof s && i) {
            const o = e[n++];
            if (r && "class" === s && -1 !== lm(o.toLowerCase(), t, 0))
              return !0;
          } else {
            if (1 === s) {
              for (; n < e.length && "string" == typeof (s = e[n++]); )
                if (s.toLowerCase() === t) return !0;
              return !1;
            }
            "number" == typeof s && (i = !1);
          }
        }
        return !1;
      }
      function hm(e) {
        return 4 === e.type && e.value !== fm;
      }
      function RI(e, t, r) {
        return t === (4 !== e.type || r ? e.value : fm);
      }
      function PI(e, t, r) {
        let n = 4;
        const i = e.attrs || [],
          s = (function FI(e) {
            for (let t = 0; t < e.length; t++) if (um(e[t])) return t;
            return e.length;
          })(i);
        let o = !1;
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          if ("number" != typeof l) {
            if (!o)
              if (4 & n) {
                if (
                  ((n = 2 | (1 & n)),
                  ("" !== l && !RI(e, l, r)) || ("" === l && 1 === t.length))
                ) {
                  if (en(n)) return !1;
                  o = !0;
                }
              } else {
                const u = 8 & n ? l : t[++a];
                if (8 & n && null !== e.attrs) {
                  if (!NI(e.attrs, u, r)) {
                    if (en(n)) return !1;
                    o = !0;
                  }
                  continue;
                }
                const d = OI(8 & n ? "class" : l, i, hm(e), r);
                if (-1 === d) {
                  if (en(n)) return !1;
                  o = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > s ? "" : i[d + 1].toLowerCase();
                  const h = 8 & n ? f : null;
                  if ((h && -1 !== lm(h, u, 0)) || (2 & n && u !== f)) {
                    if (en(n)) return !1;
                    o = !0;
                  }
                }
              }
          } else {
            if (!o && !en(n) && !en(l)) return !1;
            if (o && en(l)) continue;
            (o = !1), (n = l | (1 & n));
          }
        }
        return en(n) || o;
      }
      function en(e) {
        return 0 == (1 & e);
      }
      function OI(e, t, r, n) {
        if (null === t) return -1;
        let i = 0;
        if (n || !r) {
          let s = !1;
          for (; i < t.length; ) {
            const o = t[i];
            if (o === e) return i;
            if (3 === o || 6 === o) s = !0;
            else {
              if (1 === o || 2 === o) {
                let a = t[++i];
                for (; "string" == typeof a; ) a = t[++i];
                continue;
              }
              if (4 === o) break;
              if (0 === o) {
                i += 4;
                continue;
              }
            }
            i += s ? 1 : 2;
          }
          return -1;
        }
        return (function kI(e, t) {
          let r = e.indexOf(4);
          if (r > -1)
            for (r++; r < e.length; ) {
              const n = e[r];
              if ("number" == typeof n) return -1;
              if (n === t) return r;
              r++;
            }
          return -1;
        })(t, e);
      }
      function pm(e, t, r = !1) {
        for (let n = 0; n < t.length; n++) if (PI(e, t[n], r)) return !0;
        return !1;
      }
      function gm(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function VI(e) {
        let t = e[0],
          r = 1,
          n = 2,
          i = "",
          s = !1;
        for (; r < e.length; ) {
          let o = e[r];
          if ("string" == typeof o)
            if (2 & n) {
              const a = e[++r];
              i += "[" + o + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & n ? (i += "." + o) : 4 & n && (i += " " + o);
          else
            "" !== i && !en(o) && ((t += gm(s, i)), (i = "")),
              (n = o),
              (s = s || !en(n));
          r++;
        }
        return "" !== i && (t += gm(s, i)), t;
      }
      function Ue(e) {
        return Bn(() => {
          const t = vm(e),
            r = {
              ...t,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === Ea.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (t.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              signals: e.signals ?? !1,
              data: e.data || {},
              encapsulation: e.encapsulation || zt.Emulated,
              styles: e.styles || se,
              _: null,
              schemas: e.schemas || null,
              tView: null,
              id: "",
            };
          ym(r);
          const n = e.dependencies;
          return (
            (r.directiveDefs = Sa(n, !1)),
            (r.pipeDefs = Sa(n, !0)),
            (r.id = (function GI(e) {
              let t = 0;
              const r = [
                e.selectors,
                e.ngContentSelectors,
                e.hostVars,
                e.hostAttrs,
                e.consts,
                e.vars,
                e.decls,
                e.encapsulation,
                e.standalone,
                e.signals,
                e.exportAs,
                JSON.stringify(e.inputs),
                JSON.stringify(e.outputs),
                Object.getOwnPropertyNames(e.type.prototype),
                !!e.contentQueries,
                !!e.viewQuery,
              ].join("|");
              for (const i of r) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
              return (t += 2147483648), "c" + t;
            })(r)),
            r
          );
        });
      }
      function HI(e) {
        return ne(e) || qe(e);
      }
      function UI(e) {
        return null !== e;
      }
      function Nt(e) {
        return Bn(() => ({
          type: e.type,
          bootstrap: e.bootstrap || se,
          declarations: e.declarations || se,
          imports: e.imports || se,
          exports: e.exports || se,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function mm(e, t) {
        if (null == e) return mn;
        const r = {};
        for (const n in e)
          if (e.hasOwnProperty(n)) {
            let i = e[n],
              s = i;
            Array.isArray(i) && ((s = i[1]), (i = i[0])),
              (r[i] = n),
              t && (t[i] = s);
          }
        return r;
      }
      function B(e) {
        return Bn(() => {
          const t = vm(e);
          return ym(t), t;
        });
      }
      function Dt(e) {
        return {
          type: e.type,
          name: e.name,
          factory: null,
          pure: !1 !== e.pure,
          standalone: !0 === e.standalone,
          onDestroy: e.type.prototype.ngOnDestroy || null,
        };
      }
      function ne(e) {
        return e[ba] || null;
      }
      function qe(e) {
        return e[kc] || null;
      }
      function ot(e) {
        return e[Lc] || null;
      }
      function Rt(e, t) {
        const r = e[om] || null;
        if (!r && !0 === t)
          throw new Error(`Type ${$e(e)} does not have '\u0275mod' property.`);
        return r;
      }
      function vm(e) {
        const t = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: t,
          inputTransforms: null,
          inputConfig: e.inputs || mn,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          signals: !0 === e.signals,
          selectors: e.selectors || se,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: mm(e.inputs, t),
          outputs: mm(e.outputs),
        };
      }
      function ym(e) {
        e.features?.forEach((t) => t(e));
      }
      function Sa(e, t) {
        if (!e) return null;
        const r = t ? ot : HI;
        return () =>
          ("function" == typeof e ? e() : e).map((n) => r(n)).filter(UI);
      }
      const Re = 0,
        N = 1,
        K = 2,
        Me = 3,
        tn = 4,
        Ps = 5,
        Je = 6,
        mi = 7,
        xe = 8,
        ur = 9,
        vi = 10,
        W = 11,
        Os = 12,
        _m = 13,
        yi = 14,
        Fe = 15,
        xs = 16,
        _i = 17,
        vn = 18,
        Fs = 19,
        Dm = 20,
        cr = 21,
        Un = 22,
        ks = 23,
        Ls = 24,
        J = 25,
        jc = 1,
        Cm = 2,
        yn = 7,
        Di = 9,
        Ge = 11;
      function Ct(e) {
        return Array.isArray(e) && "object" == typeof e[jc];
      }
      function at(e) {
        return Array.isArray(e) && !0 === e[jc];
      }
      function $c(e) {
        return 0 != (4 & e.flags);
      }
      function Vr(e) {
        return e.componentOffset > -1;
      }
      function Ia(e) {
        return 1 == (1 & e.flags);
      }
      function nn(e) {
        return !!e.template;
      }
      function Bc(e) {
        return 0 != (512 & e[K]);
      }
      function jr(e, t) {
        return e.hasOwnProperty(Hn) ? e[Hn] : null;
      }
      let We = null,
        Ta = !1;
      function qt(e) {
        const t = We;
        return (We = e), t;
      }
      const bm = {
        version: 0,
        dirty: !1,
        producerNode: void 0,
        producerLastReadVersion: void 0,
        producerIndexOfThis: void 0,
        nextProducerIndex: 0,
        liveConsumerNode: void 0,
        liveConsumerIndexOfThis: void 0,
        consumerAllowSignalWrites: !1,
        consumerIsAlwaysLive: !1,
        producerMustRecompute: () => !1,
        producerRecomputeValue: () => {},
        consumerMarkedDirty: () => {},
      };
      function Mm(e) {
        if (!js(e) || e.dirty) {
          if (!e.producerMustRecompute(e) && !Am(e)) return void (e.dirty = !1);
          e.producerRecomputeValue(e), (e.dirty = !1);
        }
      }
      function Tm(e) {
        (e.dirty = !0),
          (function Im(e) {
            if (void 0 === e.liveConsumerNode) return;
            const t = Ta;
            Ta = !0;
            try {
              for (const r of e.liveConsumerNode) r.dirty || Tm(r);
            } finally {
              Ta = t;
            }
          })(e),
          e.consumerMarkedDirty?.(e);
      }
      function Uc(e) {
        return e && (e.nextProducerIndex = 0), qt(e);
      }
      function zc(e, t) {
        if (
          (qt(t),
          e &&
            void 0 !== e.producerNode &&
            void 0 !== e.producerIndexOfThis &&
            void 0 !== e.producerLastReadVersion)
        ) {
          if (js(e))
            for (let r = e.nextProducerIndex; r < e.producerNode.length; r++)
              Aa(e.producerNode[r], e.producerIndexOfThis[r]);
          for (; e.producerNode.length > e.nextProducerIndex; )
            e.producerNode.pop(),
              e.producerLastReadVersion.pop(),
              e.producerIndexOfThis.pop();
        }
      }
      function Am(e) {
        Ci(e);
        for (let t = 0; t < e.producerNode.length; t++) {
          const r = e.producerNode[t],
            n = e.producerLastReadVersion[t];
          if (n !== r.version || (Mm(r), n !== r.version)) return !0;
        }
        return !1;
      }
      function Nm(e) {
        if ((Ci(e), js(e)))
          for (let t = 0; t < e.producerNode.length; t++)
            Aa(e.producerNode[t], e.producerIndexOfThis[t]);
        (e.producerNode.length =
          e.producerLastReadVersion.length =
          e.producerIndexOfThis.length =
            0),
          e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
      }
      function Aa(e, t) {
        if (
          ((function Pm(e) {
            (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
          })(e),
          Ci(e),
          1 === e.liveConsumerNode.length)
        )
          for (let n = 0; n < e.producerNode.length; n++)
            Aa(e.producerNode[n], e.producerIndexOfThis[n]);
        const r = e.liveConsumerNode.length - 1;
        if (
          ((e.liveConsumerNode[t] = e.liveConsumerNode[r]),
          (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[r]),
          e.liveConsumerNode.length--,
          e.liveConsumerIndexOfThis.length--,
          t < e.liveConsumerNode.length)
        ) {
          const n = e.liveConsumerIndexOfThis[t],
            i = e.liveConsumerNode[t];
          Ci(i), (i.producerIndexOfThis[n] = t);
        }
      }
      function js(e) {
        return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
      }
      function Ci(e) {
        (e.producerNode ??= []),
          (e.producerIndexOfThis ??= []),
          (e.producerLastReadVersion ??= []);
      }
      let Om = null;
      const Lm = () => {},
        sT = (() => ({
          ...bm,
          consumerIsAlwaysLive: !0,
          consumerAllowSignalWrites: !1,
          consumerMarkedDirty: (e) => {
            e.schedule(e.ref);
          },
          hasRun: !1,
          cleanupFn: Lm,
        }))();
      class oT {
        constructor(t, r, n) {
          (this.previousValue = t),
            (this.currentValue = r),
            (this.firstChange = n);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Pt() {
        return Vm;
      }
      function Vm(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = lT), aT;
      }
      function aT() {
        const e = $m(this),
          t = e?.current;
        if (t) {
          const r = e.previous;
          if (r === mn) e.previous = t;
          else for (let n in t) r[n] = t[n];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function lT(e, t, r, n) {
        const i = this.declaredInputs[r],
          s =
            $m(e) ||
            (function uT(e, t) {
              return (e[jm] = t);
            })(e, { previous: mn, current: null }),
          o = s.current || (s.current = {}),
          a = s.previous,
          l = a[i];
        (o[i] = new oT(l && l.currentValue, t, a === mn)), (e[n] = t);
      }
      Pt.ngInherit = !0;
      const jm = "__ngSimpleChanges__";
      function $m(e) {
        return e[jm] || null;
      }
      const _n = function (e, t, r) {};
      function Ce(e) {
        for (; Array.isArray(e); ) e = e[Re];
        return e;
      }
      function Na(e, t) {
        return Ce(t[e]);
      }
      function wt(e, t) {
        return Ce(t[e.index]);
      }
      function Um(e, t) {
        return e.data[t];
      }
      function wi(e, t) {
        return e[t];
      }
      function Ot(e, t) {
        const r = t[e];
        return Ct(r) ? r : r[Re];
      }
      function fr(e, t) {
        return null == t ? null : e[t];
      }
      function zm(e) {
        e[_i] = 0;
      }
      function gT(e) {
        1024 & e[K] || ((e[K] |= 1024), Gm(e, 1));
      }
      function qm(e) {
        1024 & e[K] && ((e[K] &= -1025), Gm(e, -1));
      }
      function Gm(e, t) {
        let r = e[Me];
        if (null === r) return;
        r[Ps] += t;
        let n = r;
        for (
          r = r[Me];
          null !== r && ((1 === t && 1 === n[Ps]) || (-1 === t && 0 === n[Ps]));

        )
          (r[Ps] += t), (n = r), (r = r[Me]);
      }
      const H = {
        lFrame: rv(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function Km() {
        return H.bindingsEnabled;
      }
      function b() {
        return H.lFrame.lView;
      }
      function re() {
        return H.lFrame.tView;
      }
      function rn(e) {
        return (H.lFrame.contextLView = e), e[xe];
      }
      function sn(e) {
        return (H.lFrame.contextLView = null), e;
      }
      function Qe() {
        let e = Zm();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Zm() {
        return H.lFrame.currentTNode;
      }
      function Dn(e, t) {
        const r = H.lFrame;
        (r.currentTNode = e), (r.isParent = t);
      }
      function Kc() {
        return H.lFrame.isParent;
      }
      function Zc() {
        H.lFrame.isParent = !1;
      }
      function lt() {
        const e = H.lFrame;
        let t = e.bindingRootIndex;
        return (
          -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t
        );
      }
      function bi() {
        return H.lFrame.bindingIndex++;
      }
      function IT(e, t) {
        const r = H.lFrame;
        (r.bindingIndex = r.bindingRootIndex = e), Yc(t);
      }
      function Yc(e) {
        H.lFrame.currentDirectiveIndex = e;
      }
      function ev() {
        return H.lFrame.currentQueryIndex;
      }
      function Jc(e) {
        H.lFrame.currentQueryIndex = e;
      }
      function AT(e) {
        const t = e[N];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[Je] : null;
      }
      function tv(e, t, r) {
        if (r & X.SkipSelf) {
          let i = t,
            s = e;
          for (
            ;
            !((i = i.parent),
            null !== i ||
              r & X.Host ||
              ((i = AT(s)), null === i || ((s = s[yi]), 10 & i.type)));

          );
          if (null === i) return !1;
          (t = i), (e = s);
        }
        const n = (H.lFrame = nv());
        return (n.currentTNode = t), (n.lView = e), !0;
      }
      function ed(e) {
        const t = nv(),
          r = e[N];
        (H.lFrame = t),
          (t.currentTNode = r.firstChild),
          (t.lView = e),
          (t.tView = r),
          (t.contextLView = e),
          (t.bindingIndex = r.bindingStartIndex),
          (t.inI18n = !1);
      }
      function nv() {
        const e = H.lFrame,
          t = null === e ? null : e.child;
        return null === t ? rv(e) : t;
      }
      function rv(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function iv() {
        const e = H.lFrame;
        return (
          (H.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const sv = iv;
      function td() {
        const e = iv();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function ut() {
        return H.lFrame.selectedIndex;
      }
      function $r(e) {
        H.lFrame.selectedIndex = e;
      }
      function Te() {
        const e = H.lFrame;
        return Um(e.tView, e.selectedIndex);
      }
      let av = !0;
      function Ra() {
        return av;
      }
      function hr(e) {
        av = e;
      }
      function Pa(e, t) {
        for (let r = t.directiveStart, n = t.directiveEnd; r < n; r++) {
          const s = e.data[r].type.prototype,
            {
              ngAfterContentInit: o,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = s;
          o && (e.contentHooks ??= []).push(-r, o),
            a &&
              ((e.contentHooks ??= []).push(r, a),
              (e.contentCheckHooks ??= []).push(r, a)),
            l && (e.viewHooks ??= []).push(-r, l),
            u &&
              ((e.viewHooks ??= []).push(r, u),
              (e.viewCheckHooks ??= []).push(r, u)),
            null != c && (e.destroyHooks ??= []).push(r, c);
        }
      }
      function Oa(e, t, r) {
        lv(e, t, 3, r);
      }
      function xa(e, t, r, n) {
        (3 & e[K]) === r && lv(e, t, r, n);
      }
      function nd(e, t) {
        let r = e[K];
        (3 & r) === t && ((r &= 8191), (r += 1), (e[K] = r));
      }
      function lv(e, t, r, n) {
        const s = n ?? -1,
          o = t.length - 1;
        let a = 0;
        for (let l = void 0 !== n ? 65535 & e[_i] : 0; l < o; l++)
          if ("number" == typeof t[l + 1]) {
            if (((a = t[l]), null != n && a >= n)) break;
          } else
            t[l] < 0 && (e[_i] += 65536),
              (a < s || -1 == s) &&
                (LT(e, r, t, l), (e[_i] = (4294901760 & e[_i]) + l + 2)),
              l++;
      }
      function uv(e, t) {
        _n(4, e, t);
        const r = qt(null);
        try {
          t.call(e);
        } finally {
          qt(r), _n(5, e, t);
        }
      }
      function LT(e, t, r, n) {
        const i = r[n] < 0,
          s = r[n + 1],
          a = e[i ? -r[n] : r[n]];
        i
          ? e[K] >> 13 < e[_i] >> 16 &&
            (3 & e[K]) === t &&
            ((e[K] += 8192), uv(a, s))
          : uv(a, s);
      }
      const Si = -1;
      class Bs {
        constructor(t, r, n) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = r),
            (this.injectImpl = n);
        }
      }
      function id(e) {
        return e !== Si;
      }
      function Hs(e) {
        return 32767 & e;
      }
      function Us(e, t) {
        let r = (function BT(e) {
            return e >> 16;
          })(e),
          n = t;
        for (; r > 0; ) (n = n[yi]), r--;
        return n;
      }
      let sd = !0;
      function Fa(e) {
        const t = sd;
        return (sd = e), t;
      }
      const cv = 255,
        dv = 5;
      let HT = 0;
      const Cn = {};
      function ka(e, t) {
        const r = fv(e, t);
        if (-1 !== r) return r;
        const n = t[N];
        n.firstCreatePass &&
          ((e.injectorIndex = t.length),
          od(n.data, e),
          od(t, null),
          od(n.blueprint, null));
        const i = La(e, t),
          s = e.injectorIndex;
        if (id(i)) {
          const o = Hs(i),
            a = Us(i, t),
            l = a[N].data;
          for (let u = 0; u < 8; u++) t[s + u] = a[o + u] | l[o + u];
        }
        return (t[s + 8] = i), s;
      }
      function od(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function fv(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function La(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let r = 0,
          n = null,
          i = t;
        for (; null !== i; ) {
          if (((n = _v(i)), null === n)) return Si;
          if ((r++, (i = i[yi]), -1 !== n.injectorIndex))
            return n.injectorIndex | (r << 16);
        }
        return Si;
      }
      function ad(e, t, r) {
        !(function UT(e, t, r) {
          let n;
          "string" == typeof r
            ? (n = r.charCodeAt(0) || 0)
            : r.hasOwnProperty(Ns) && (n = r[Ns]),
            null == n && (n = r[Ns] = HT++);
          const i = n & cv;
          t.data[e + (i >> dv)] |= 1 << i;
        })(e, t, r);
      }
      function hv(e, t, r) {
        if (r & X.Optional || void 0 !== e) return e;
        Ic();
      }
      function pv(e, t, r, n) {
        if (
          (r & X.Optional && void 0 === n && (n = null),
          !(r & (X.Self | X.Host)))
        ) {
          const i = e[ur],
            s = _t(void 0);
          try {
            return i ? i.get(t, n, r & X.Optional) : nm(t, n, r & X.Optional);
          } finally {
            _t(s);
          }
        }
        return hv(n, 0, r);
      }
      function gv(e, t, r, n = X.Default, i) {
        if (null !== e) {
          if (2048 & t[K] && !(n & X.Self)) {
            const o = (function KT(e, t, r, n, i) {
              let s = e,
                o = t;
              for (
                ;
                null !== s && null !== o && 2048 & o[K] && !(512 & o[K]);

              ) {
                const a = mv(s, o, r, n | X.Self, Cn);
                if (a !== Cn) return a;
                let l = s.parent;
                if (!l) {
                  const u = o[Dm];
                  if (u) {
                    const c = u.get(r, Cn, n);
                    if (c !== Cn) return c;
                  }
                  (l = _v(o)), (o = o[yi]);
                }
                s = l;
              }
              return i;
            })(e, t, r, n, Cn);
            if (o !== Cn) return o;
          }
          const s = mv(e, t, r, n, Cn);
          if (s !== Cn) return s;
        }
        return pv(t, r, n, i);
      }
      function mv(e, t, r, n, i) {
        const s = (function GT(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Ns) ? e[Ns] : void 0;
          return "number" == typeof t ? (t >= 0 ? t & cv : QT) : t;
        })(r);
        if ("function" == typeof s) {
          if (!tv(t, e, n)) return n & X.Host ? hv(i, 0, n) : pv(t, r, n, i);
          try {
            let o;
            if (((o = s(n)), null != o || n & X.Optional)) return o;
            Ic();
          } finally {
            sv();
          }
        } else if ("number" == typeof s) {
          let o = null,
            a = fv(e, t),
            l = Si,
            u = n & X.Host ? t[Fe][Je] : null;
          for (
            (-1 === a || n & X.SkipSelf) &&
            ((l = -1 === a ? La(e, t) : t[a + 8]),
            l !== Si && yv(n, !1)
              ? ((o = t[N]), (a = Hs(l)), (t = Us(l, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[N];
            if (vv(s, a, c.data)) {
              const d = qT(a, t, r, o, n, u);
              if (d !== Cn) return d;
            }
            (l = t[a + 8]),
              l !== Si && yv(n, t[N].data[a + 8] === u) && vv(s, a, t)
                ? ((o = c), (a = Hs(l)), (t = Us(l, t)))
                : (a = -1);
          }
        }
        return i;
      }
      function qT(e, t, r, n, i, s) {
        const o = t[N],
          a = o.data[e + 8],
          c = Va(
            a,
            o,
            r,
            null == n ? Vr(a) && sd : n != o && 0 != (3 & a.type),
            i & X.Host && s === a
          );
        return null !== c ? Br(t, o, c, a) : Cn;
      }
      function Va(e, t, r, n, i) {
        const s = e.providerIndexes,
          o = t.data,
          a = 1048575 & s,
          l = e.directiveStart,
          c = s >> 20,
          f = i ? a + c : e.directiveEnd;
        for (let h = n ? a : a + c; h < f; h++) {
          const g = o[h];
          if ((h < l && r === g) || (h >= l && g.type === r)) return h;
        }
        if (i) {
          const h = o[l];
          if (h && nn(h) && h.type === r) return l;
        }
        return null;
      }
      function Br(e, t, r, n) {
        let i = e[r];
        const s = t.data;
        if (
          (function VT(e) {
            return e instanceof Bs;
          })(i)
        ) {
          const o = i;
          o.resolving &&
            (function hI(e, t) {
              const r = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new C(
                -200,
                `Circular dependency in DI detected for ${e}${r}`
              );
            })(
              (function le(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : G(e);
              })(s[r])
            );
          const a = Fa(o.canSeeViewProviders);
          o.resolving = !0;
          const u = o.injectImpl ? _t(o.injectImpl) : null;
          tv(e, n, X.Default);
          try {
            (i = e[r] = o.factory(void 0, s, e, n)),
              t.firstCreatePass &&
                r >= n.directiveStart &&
                (function kT(e, t, r) {
                  const {
                    ngOnChanges: n,
                    ngOnInit: i,
                    ngDoCheck: s,
                  } = t.type.prototype;
                  if (n) {
                    const o = Vm(t);
                    (r.preOrderHooks ??= []).push(e, o),
                      (r.preOrderCheckHooks ??= []).push(e, o);
                  }
                  i && (r.preOrderHooks ??= []).push(0 - e, i),
                    s &&
                      ((r.preOrderHooks ??= []).push(e, s),
                      (r.preOrderCheckHooks ??= []).push(e, s));
                })(r, s[r], t);
          } finally {
            null !== u && _t(u), Fa(a), (o.resolving = !1), sv();
          }
        }
        return i;
      }
      function vv(e, t, r) {
        return !!(r[t + (e >> dv)] & (1 << e));
      }
      function yv(e, t) {
        return !(e & X.Self || (e & X.Host && t));
      }
      class ct {
        constructor(t, r) {
          (this._tNode = t), (this._lView = r);
        }
        get(t, r, n) {
          return gv(this._tNode, this._lView, t, wa(n), r);
        }
      }
      function QT() {
        return new ct(Qe(), b());
      }
      function Ke(e) {
        return Bn(() => {
          const t = e.prototype.constructor,
            r = t[Hn] || ld(t),
            n = Object.prototype;
          let i = Object.getPrototypeOf(e.prototype).constructor;
          for (; i && i !== n; ) {
            const s = i[Hn] || ld(i);
            if (s && s !== r) return s;
            i = Object.getPrototypeOf(i);
          }
          return (s) => new s();
        });
      }
      function ld(e) {
        return Sc(e)
          ? () => {
              const t = ld(z(e));
              return t && t();
            }
          : jr(e);
      }
      function _v(e) {
        const t = e[N],
          r = t.type;
        return 2 === r ? t.declTNode : 1 === r ? e[Je] : null;
      }
      const Ii = "__parameters__";
      function Ai(e, t, r) {
        return Bn(() => {
          const n = (function ud(e) {
            return function (...r) {
              if (e) {
                const n = e(...r);
                for (const i in n) this[i] = n[i];
              }
            };
          })(t);
          function i(...s) {
            if (this instanceof i) return n.apply(this, s), this;
            const o = new i(...s);
            return (a.annotation = o), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(Ii)
                ? l[Ii]
                : Object.defineProperty(l, Ii, { value: [] })[Ii];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(o), l;
            }
          }
          return (
            r && (i.prototype = Object.create(r.prototype)),
            (i.prototype.ngMetadataName = e),
            (i.annotationCls = i),
            i
          );
        });
      }
      function Ri(e, t) {
        e.forEach((r) => (Array.isArray(r) ? Ri(r, t) : t(r)));
      }
      function Cv(e, t, r) {
        t >= e.length ? e.push(r) : e.splice(t, 0, r);
      }
      function $a(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function xt(e, t, r) {
        let n = Pi(e, t);
        return (
          n >= 0
            ? (e[1 | n] = r)
            : ((n = ~n),
              (function nA(e, t, r, n) {
                let i = e.length;
                if (i == t) e.push(r, n);
                else if (1 === i) e.push(n, e[0]), (e[0] = r);
                else {
                  for (i--, e.push(e[i - 1], e[i]); i > t; )
                    (e[i] = e[i - 2]), i--;
                  (e[t] = r), (e[t + 1] = n);
                }
              })(e, n, t, r)),
          n
        );
      }
      function cd(e, t) {
        const r = Pi(e, t);
        if (r >= 0) return e[1 | r];
      }
      function Pi(e, t) {
        return (function wv(e, t, r) {
          let n = 0,
            i = e.length >> r;
          for (; i !== n; ) {
            const s = n + ((i - n) >> 1),
              o = e[s << r];
            if (t === o) return s << r;
            o > t ? (i = s) : (n = s + 1);
          }
          return ~(i << r);
        })(e, t, 1);
      }
      const Ha = As(Ai("Optional"), 8),
        Ua = As(Ai("SkipSelf"), 4);
      function Qa(e) {
        return 128 == (128 & e.flags);
      }
      var pr = (function (e) {
        return (
          (e[(e.Important = 1)] = "Important"),
          (e[(e.DashCase = 2)] = "DashCase"),
          e
        );
      })(pr || {});
      const EA = /^>|^->|<!--|-->|--!>|<!-$/g,
        bA = /(<|>)/g,
        SA = "\u200b$1\u200b";
      const gd = new Map();
      let MA = 0;
      const vd = "__ngContext__";
      function et(e, t) {
        Ct(t)
          ? ((e[vd] = t[Fs]),
            (function TA(e) {
              gd.set(e[Fs], e);
            })(t))
          : (e[vd] = t);
      }
      let yd;
      function _d(e, t) {
        return yd(e, t);
      }
      function Ks(e) {
        const t = e[Me];
        return at(t) ? t[Me] : t;
      }
      function Hv(e) {
        return zv(e[Os]);
      }
      function Uv(e) {
        return zv(e[tn]);
      }
      function zv(e) {
        for (; null !== e && !at(e); ) e = e[tn];
        return e;
      }
      function Fi(e, t, r, n, i) {
        if (null != n) {
          let s,
            o = !1;
          at(n) ? (s = n) : Ct(n) && ((o = !0), (n = n[Re]));
          const a = Ce(n);
          0 === e && null !== r
            ? null == i
              ? Qv(t, r, a)
              : Hr(t, r, a, i || null, !0)
            : 1 === e && null !== r
            ? Hr(t, r, a, i || null, !0)
            : 2 === e
            ? (function tl(e, t, r) {
                const n = Ja(e, t);
                n &&
                  (function WA(e, t, r, n) {
                    e.removeChild(t, r, n);
                  })(e, n, t, r);
              })(t, a, o)
            : 3 === e && t.destroyNode(a),
            null != s &&
              (function ZA(e, t, r, n, i) {
                const s = r[yn];
                s !== Ce(r) && Fi(t, e, n, s, i);
                for (let a = Ge; a < r.length; a++) {
                  const l = r[a];
                  Ys(l[N], l, e, t, n, s);
                }
              })(t, e, s, r, i);
        }
      }
      function Dd(e, t) {
        return e.createComment(
          (function xv(e) {
            return e.replace(EA, (t) => t.replace(bA, SA));
          })(t)
        );
      }
      function Ya(e, t, r) {
        return e.createElement(t, r);
      }
      function Gv(e, t) {
        const r = e[Di],
          n = r.indexOf(t);
        qm(t), r.splice(n, 1);
      }
      function Xa(e, t) {
        if (e.length <= Ge) return;
        const r = Ge + t,
          n = e[r];
        if (n) {
          const i = n[xs];
          null !== i && i !== e && Gv(i, n), t > 0 && (e[r - 1][tn] = n[tn]);
          const s = $a(e, Ge + t);
          !(function jA(e, t) {
            Ys(e, t, t[W], 2, null, null), (t[Re] = null), (t[Je] = null);
          })(n[N], n);
          const o = s[vn];
          null !== o && o.detachView(s[N]),
            (n[Me] = null),
            (n[tn] = null),
            (n[K] &= -129);
        }
        return n;
      }
      function Cd(e, t) {
        if (!(256 & t[K])) {
          const r = t[W];
          t[ks] && Nm(t[ks]),
            t[Ls] && Nm(t[Ls]),
            r.destroyNode && Ys(e, t, r, 3, null, null),
            (function HA(e) {
              let t = e[Os];
              if (!t) return wd(e[N], e);
              for (; t; ) {
                let r = null;
                if (Ct(t)) r = t[Os];
                else {
                  const n = t[Ge];
                  n && (r = n);
                }
                if (!r) {
                  for (; t && !t[tn] && t !== e; )
                    Ct(t) && wd(t[N], t), (t = t[Me]);
                  null === t && (t = e), Ct(t) && wd(t[N], t), (r = t && t[tn]);
                }
                t = r;
              }
            })(t);
        }
      }
      function wd(e, t) {
        if (!(256 & t[K])) {
          (t[K] &= -129),
            (t[K] |= 256),
            (function GA(e, t) {
              let r;
              if (null != e && null != (r = e.destroyHooks))
                for (let n = 0; n < r.length; n += 2) {
                  const i = t[r[n]];
                  if (!(i instanceof Bs)) {
                    const s = r[n + 1];
                    if (Array.isArray(s))
                      for (let o = 0; o < s.length; o += 2) {
                        const a = i[s[o]],
                          l = s[o + 1];
                        _n(4, a, l);
                        try {
                          l.call(a);
                        } finally {
                          _n(5, a, l);
                        }
                      }
                    else {
                      _n(4, i, s);
                      try {
                        s.call(i);
                      } finally {
                        _n(5, i, s);
                      }
                    }
                  }
                }
            })(e, t),
            (function qA(e, t) {
              const r = e.cleanup,
                n = t[mi];
              if (null !== r)
                for (let s = 0; s < r.length - 1; s += 2)
                  if ("string" == typeof r[s]) {
                    const o = r[s + 3];
                    o >= 0 ? n[o]() : n[-o].unsubscribe(), (s += 2);
                  } else r[s].call(n[r[s + 1]]);
              null !== n && (t[mi] = null);
              const i = t[cr];
              if (null !== i) {
                t[cr] = null;
                for (let s = 0; s < i.length; s++) (0, i[s])();
              }
            })(e, t),
            1 === t[N].type && t[W].destroy();
          const r = t[xs];
          if (null !== r && at(t[Me])) {
            r !== t[Me] && Gv(r, t);
            const n = t[vn];
            null !== n && n.detachView(e);
          }
          !(function AA(e) {
            gd.delete(e[Fs]);
          })(t);
        }
      }
      function Ed(e, t, r) {
        return (function Wv(e, t, r) {
          let n = t;
          for (; null !== n && 40 & n.type; ) n = (t = n).parent;
          if (null === n) return r[Re];
          {
            const { componentOffset: i } = n;
            if (i > -1) {
              const { encapsulation: s } = e.data[n.directiveStart + i];
              if (s === zt.None || s === zt.Emulated) return null;
            }
            return wt(n, r);
          }
        })(e, t.parent, r);
      }
      function Hr(e, t, r, n, i) {
        e.insertBefore(t, r, n, i);
      }
      function Qv(e, t, r) {
        e.appendChild(t, r);
      }
      function Kv(e, t, r, n, i) {
        null !== n ? Hr(e, t, r, n, i) : Qv(e, t, r);
      }
      function Ja(e, t) {
        return e.parentNode(t);
      }
      let bd,
        nl,
        Td,
        rl,
        Xv = function Yv(e, t, r) {
          return 40 & e.type ? wt(e, r) : null;
        };
      function el(e, t, r, n) {
        const i = Ed(e, n, t),
          s = t[W],
          a = (function Zv(e, t, r) {
            return Xv(e, t, r);
          })(n.parent || t[Je], n, t);
        if (null != i)
          if (Array.isArray(r))
            for (let l = 0; l < r.length; l++) Kv(s, i, r[l], a, !1);
          else Kv(s, i, r, a, !1);
        void 0 !== bd && bd(s, n, t, r, i);
      }
      function Zs(e, t) {
        if (null !== t) {
          const r = t.type;
          if (3 & r) return wt(t, e);
          if (4 & r) return Sd(-1, e[t.index]);
          if (8 & r) {
            const n = t.child;
            if (null !== n) return Zs(e, n);
            {
              const i = e[t.index];
              return at(i) ? Sd(-1, i) : Ce(i);
            }
          }
          if (32 & r) return _d(t, e)() || Ce(e[t.index]);
          {
            const n = ey(e, t);
            return null !== n
              ? Array.isArray(n)
                ? n[0]
                : Zs(Ks(e[Fe]), n)
              : Zs(e, t.next);
          }
        }
        return null;
      }
      function ey(e, t) {
        return null !== t ? e[Fe][Je].projection[t.projection] : null;
      }
      function Sd(e, t) {
        const r = Ge + e + 1;
        if (r < t.length) {
          const n = t[r],
            i = n[N].firstChild;
          if (null !== i) return Zs(n, i);
        }
        return t[yn];
      }
      function Md(e, t, r, n, i, s, o) {
        for (; null != r; ) {
          const a = n[r.index],
            l = r.type;
          if (
            (o && 0 === t && (a && et(Ce(a), n), (r.flags |= 2)),
            32 != (32 & r.flags))
          )
            if (8 & l) Md(e, t, r.child, n, i, s, !1), Fi(t, e, i, a, s);
            else if (32 & l) {
              const u = _d(r, n);
              let c;
              for (; (c = u()); ) Fi(t, e, i, c, s);
              Fi(t, e, i, a, s);
            } else 16 & l ? ny(e, t, n, r, i, s) : Fi(t, e, i, a, s);
          r = o ? r.projectionNext : r.next;
        }
      }
      function Ys(e, t, r, n, i, s) {
        Md(r, n, e.firstChild, t, i, s, !1);
      }
      function ny(e, t, r, n, i, s) {
        const o = r[Fe],
          l = o[Je].projection[n.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) Fi(t, e, i, l[u], s);
        else {
          let u = l;
          const c = o[Me];
          Qa(n) && (u.flags |= 128), Md(e, t, u, c, i, s, !0);
        }
      }
      function ry(e, t, r) {
        "" === r
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", r);
      }
      function iy(e, t, r) {
        const { mergedAttrs: n, classes: i, styles: s } = r;
        null !== n && Vc(e, t, n),
          null !== i && ry(e, t, i),
          null !== s &&
            (function XA(e, t, r) {
              e.setAttribute(t, "style", r);
            })(e, t, s);
      }
      function ki(e) {
        return (
          (function Id() {
            if (void 0 === nl && ((nl = null), De.trustedTypes))
              try {
                nl = De.trustedTypes.createPolicy("angular", {
                  createHTML: (e) => e,
                  createScript: (e) => e,
                  createScriptURL: (e) => e,
                });
              } catch {}
            return nl;
          })()?.createHTML(e) || e
        );
      }
      function Li() {
        if (void 0 !== Td) return Td;
        if (typeof document < "u") return document;
        throw new C(210, !1);
      }
      function Ad() {
        if (void 0 === rl && ((rl = null), De.trustedTypes))
          try {
            rl = De.trustedTypes.createPolicy("angular#unsafe-bypass", {
              createHTML: (e) => e,
              createScript: (e) => e,
              createScriptURL: (e) => e,
            });
          } catch {}
        return rl;
      }
      function sy(e) {
        return Ad()?.createHTML(e) || e;
      }
      function ay(e) {
        return Ad()?.createScriptURL(e) || e;
      }
      class ly {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Xg})`;
        }
      }
      function gr(e) {
        return e instanceof ly ? e.changingThisBreaksApplicationSecurity : e;
      }
      function Xs(e, t) {
        const r = (function u1(e) {
          return (e instanceof ly && e.getTypeName()) || null;
        })(e);
        if (null != r && r !== t) {
          if ("ResourceURL" === r && "URL" === t) return !0;
          throw new Error(`Required a safe ${t}, got a ${r} (see ${Xg})`);
        }
        return r === t;
      }
      class c1 {
        constructor(t) {
          this.inertDocumentHelper = t;
        }
        getInertBodyElement(t) {
          t = "<body><remove></remove>" + t;
          try {
            const r = new window.DOMParser().parseFromString(
              ki(t),
              "text/html"
            ).body;
            return null === r
              ? this.inertDocumentHelper.getInertBodyElement(t)
              : (r.removeChild(r.firstChild), r);
          } catch {
            return null;
          }
        }
      }
      class d1 {
        constructor(t) {
          (this.defaultDoc = t),
            (this.inertDocument =
              this.defaultDoc.implementation.createHTMLDocument(
                "sanitization-inert"
              ));
        }
        getInertBodyElement(t) {
          const r = this.inertDocument.createElement("template");
          return (r.innerHTML = ki(t)), r;
        }
      }
      const h1 = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
      function Nd(e) {
        return (e = String(e)).match(h1) ? e : "unsafe:" + e;
      }
      function Gn(e) {
        const t = {};
        for (const r of e.split(",")) t[r] = !0;
        return t;
      }
      function Js(...e) {
        const t = {};
        for (const r of e)
          for (const n in r) r.hasOwnProperty(n) && (t[n] = !0);
        return t;
      }
      const cy = Gn("area,br,col,hr,img,wbr"),
        dy = Gn("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        fy = Gn("rp,rt"),
        Rd = Js(
          cy,
          Js(
            dy,
            Gn(
              "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
            )
          ),
          Js(
            fy,
            Gn(
              "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
            )
          ),
          Js(fy, dy)
        ),
        Pd = Gn("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
        hy = Js(
          Pd,
          Gn(
            "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
          ),
          Gn(
            "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
          )
        ),
        p1 = Gn("script,style,template");
      class g1 {
        constructor() {
          (this.sanitizedSomething = !1), (this.buf = []);
        }
        sanitizeChildren(t) {
          let r = t.firstChild,
            n = !0;
          for (; r; )
            if (
              (r.nodeType === Node.ELEMENT_NODE
                ? (n = this.startElement(r))
                : r.nodeType === Node.TEXT_NODE
                ? this.chars(r.nodeValue)
                : (this.sanitizedSomething = !0),
              n && r.firstChild)
            )
              r = r.firstChild;
            else
              for (; r; ) {
                r.nodeType === Node.ELEMENT_NODE && this.endElement(r);
                let i = this.checkClobberedElement(r, r.nextSibling);
                if (i) {
                  r = i;
                  break;
                }
                r = this.checkClobberedElement(r, r.parentNode);
              }
          return this.buf.join("");
        }
        startElement(t) {
          const r = t.nodeName.toLowerCase();
          if (!Rd.hasOwnProperty(r))
            return (this.sanitizedSomething = !0), !p1.hasOwnProperty(r);
          this.buf.push("<"), this.buf.push(r);
          const n = t.attributes;
          for (let i = 0; i < n.length; i++) {
            const s = n.item(i),
              o = s.name,
              a = o.toLowerCase();
            if (!hy.hasOwnProperty(a)) {
              this.sanitizedSomething = !0;
              continue;
            }
            let l = s.value;
            Pd[a] && (l = Nd(l)), this.buf.push(" ", o, '="', py(l), '"');
          }
          return this.buf.push(">"), !0;
        }
        endElement(t) {
          const r = t.nodeName.toLowerCase();
          Rd.hasOwnProperty(r) &&
            !cy.hasOwnProperty(r) &&
            (this.buf.push("</"), this.buf.push(r), this.buf.push(">"));
        }
        chars(t) {
          this.buf.push(py(t));
        }
        checkClobberedElement(t, r) {
          if (
            r &&
            (t.compareDocumentPosition(r) &
              Node.DOCUMENT_POSITION_CONTAINED_BY) ===
              Node.DOCUMENT_POSITION_CONTAINED_BY
          )
            throw new Error(
              `Failed to sanitize html because the element is clobbered: ${t.outerHTML}`
            );
          return r;
        }
      }
      const m1 = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
        v1 = /([^\#-~ |!])/g;
      function py(e) {
        return e
          .replace(/&/g, "&amp;")
          .replace(m1, function (t) {
            return (
              "&#" +
              (1024 * (t.charCodeAt(0) - 55296) +
                (t.charCodeAt(1) - 56320) +
                65536) +
              ";"
            );
          })
          .replace(v1, function (t) {
            return "&#" + t.charCodeAt(0) + ";";
          })
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }
      let il;
      function Od(e) {
        return "content" in e &&
          (function _1(e) {
            return (
              e.nodeType === Node.ELEMENT_NODE && "TEMPLATE" === e.nodeName
            );
          })(e)
          ? e.content
          : null;
      }
      var Vi = (function (e) {
        return (
          (e[(e.NONE = 0)] = "NONE"),
          (e[(e.HTML = 1)] = "HTML"),
          (e[(e.STYLE = 2)] = "STYLE"),
          (e[(e.SCRIPT = 3)] = "SCRIPT"),
          (e[(e.URL = 4)] = "URL"),
          (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
          e
        );
      })(Vi || {});
      function sl(e) {
        const t = eo();
        return t
          ? sy(t.sanitize(Vi.HTML, e) || "")
          : Xs(e, "HTML")
          ? sy(gr(e))
          : (function y1(e, t) {
              let r = null;
              try {
                il =
                  il ||
                  (function uy(e) {
                    const t = new d1(e);
                    return (function f1() {
                      try {
                        return !!new window.DOMParser().parseFromString(
                          ki(""),
                          "text/html"
                        );
                      } catch {
                        return !1;
                      }
                    })()
                      ? new c1(t)
                      : t;
                  })(e);
                let n = t ? String(t) : "";
                r = il.getInertBodyElement(n);
                let i = 5,
                  s = n;
                do {
                  if (0 === i)
                    throw new Error(
                      "Failed to sanitize html because the input is unstable"
                    );
                  i--,
                    (n = s),
                    (s = r.innerHTML),
                    (r = il.getInertBodyElement(n));
                } while (n !== s);
                return ki(new g1().sanitizeChildren(Od(r) || r));
              } finally {
                if (r) {
                  const n = Od(r) || r;
                  for (; n.firstChild; ) n.removeChild(n.firstChild);
                }
              }
            })(Li(), G(e));
      }
      function Wn(e) {
        const t = eo();
        return t
          ? t.sanitize(Vi.URL, e) || ""
          : Xs(e, "URL")
          ? gr(e)
          : Nd(G(e));
      }
      function gy(e) {
        const t = eo();
        if (t) return ay(t.sanitize(Vi.RESOURCE_URL, e) || "");
        if (Xs(e, "ResourceURL")) return ay(gr(e));
        throw new C(904, !1);
      }
      function eo() {
        const e = b();
        return e && e[vi].sanitizer;
      }
      class O {
        constructor(t, r) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof r
              ? (this.__NG_ELEMENT_ID__ = r)
              : void 0 !== r &&
                (this.ɵprov = R({
                  token: this,
                  providedIn: r.providedIn || "root",
                  factory: r.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const to = new O("ENVIRONMENT_INITIALIZER"),
        vy = new O("INJECTOR", -1),
        yy = new O("INJECTOR_DEF_TYPES");
      class xd {
        get(t, r = Ts) {
          if (r === Ts) {
            const n = new Error(`NullInjectorError: No provider for ${$e(t)}!`);
            throw ((n.name = "NullInjectorError"), n);
          }
          return r;
        }
      }
      function S1(...e) {
        return { ɵproviders: _y(0, e), ɵfromNgModule: !0 };
      }
      function _y(e, ...t) {
        const r = [],
          n = new Set();
        let i;
        const s = (o) => {
          r.push(o);
        };
        return (
          Ri(t, (o) => {
            const a = o;
            ol(a, s, [], n) && ((i ||= []), i.push(a));
          }),
          void 0 !== i && Dy(i, s),
          r
        );
      }
      function Dy(e, t) {
        for (let r = 0; r < e.length; r++) {
          const { ngModule: n, providers: i } = e[r];
          kd(i, (s) => {
            t(s, n);
          });
        }
      }
      function ol(e, t, r, n) {
        if (!(e = z(e))) return !1;
        let i = null,
          s = _a(e);
        const o = !s && ne(e);
        if (s || o) {
          if (o && !o.standalone) return !1;
          i = e;
        } else {
          const l = e.ngModule;
          if (((s = _a(l)), !s)) return !1;
          i = l;
        }
        const a = n.has(i);
        if (o) {
          if (a) return !1;
          if ((n.add(i), o.dependencies)) {
            const l =
              "function" == typeof o.dependencies
                ? o.dependencies()
                : o.dependencies;
            for (const u of l) ol(u, t, r, n);
          }
        } else {
          if (!s) return !1;
          {
            if (null != s.imports && !a) {
              let u;
              n.add(i);
              try {
                Ri(s.imports, (c) => {
                  ol(c, t, r, n) && ((u ||= []), u.push(c));
                });
              } finally {
              }
              void 0 !== u && Dy(u, t);
            }
            if (!a) {
              const u = jr(i) || (() => new i());
              t({ provide: i, useFactory: u, deps: se }, i),
                t({ provide: yy, useValue: i, multi: !0 }, i),
                t({ provide: to, useValue: () => M(i), multi: !0 }, i);
            }
            const l = s.providers;
            if (null != l && !a) {
              const u = e;
              kd(l, (c) => {
                t(c, u);
              });
            }
          }
        }
        return i !== e && void 0 !== e.providers;
      }
      function kd(e, t) {
        for (let r of e)
          Mc(r) && (r = r.ɵproviders), Array.isArray(r) ? kd(r, t) : t(r);
      }
      const M1 = de({ provide: String, useValue: de });
      function Ld(e) {
        return null !== e && "object" == typeof e && M1 in e;
      }
      function Ur(e) {
        return "function" == typeof e;
      }
      const Vd = new O("Set Injector scope."),
        al = {},
        T1 = {};
      let jd;
      function ll() {
        return void 0 === jd && (jd = new xd()), jd;
      }
      class Ft {}
      class ul extends Ft {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, r, n, i) {
          super(),
            (this.parent = r),
            (this.source = n),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Bd(t, (o) => this.processProvider(o)),
            this.records.set(vy, ji(void 0, this)),
            i.has("environment") && this.records.set(Ft, ji(void 0, this));
          const s = this.records.get(Vd);
          null != s && "string" == typeof s.value && this.scopes.add(s.value),
            (this.injectorDefTypes = new Set(this.get(yy.multi, se, X.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const r of this._ngOnDestroyHooks) r.ngOnDestroy();
            const t = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const r of t) r();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear();
          }
        }
        onDestroy(t) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(t),
            () => this.removeOnDestroy(t)
          );
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const r = lr(this),
            n = _t(void 0);
          try {
            return t();
          } finally {
            lr(r), _t(n);
          }
        }
        get(t, r = Ts, n = X.Default) {
          if ((this.assertNotDestroyed(), t.hasOwnProperty(am)))
            return t[am](this);
          n = wa(n);
          const s = lr(this),
            o = _t(void 0);
          try {
            if (!(n & X.SkipSelf)) {
              let l = this.records.get(t);
              if (void 0 === l) {
                const u =
                  (function O1(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof O)
                    );
                  })(t) && ya(t);
                (l = u && this.injectableDefInScope(u) ? ji($d(t), al) : null),
                  this.records.set(t, l);
              }
              if (null != l) return this.hydrate(t, l);
            }
            return (n & X.Self ? ll() : this.parent).get(
              t,
              (r = n & X.Optional && r === Ts ? null : r)
            );
          } catch (a) {
            if ("NullInjectorError" === a.name) {
              if (((a[Ca] = a[Ca] || []).unshift($e(t)), s)) throw a;
              return (function TI(e, t, r, n) {
                const i = e[Ca];
                throw (
                  (t[im] && i.unshift(t[im]),
                  (e.message = (function AI(e, t, r, n = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let i = $e(t);
                    if (Array.isArray(t)) i = t.map($e).join(" -> ");
                    else if ("object" == typeof t) {
                      let s = [];
                      for (let o in t)
                        if (t.hasOwnProperty(o)) {
                          let a = t[o];
                          s.push(
                            o +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : $e(a))
                          );
                        }
                      i = `{${s.join(", ")}}`;
                    }
                    return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${e.replace(
                      EI,
                      "\n  "
                    )}`;
                  })("\n" + e.message, i, r, n)),
                  (e.ngTokenPath = i),
                  (e[Ca] = null),
                  e)
                );
              })(a, t, "R3InjectorError", this.source);
            }
            throw a;
          } finally {
            _t(o), lr(s);
          }
        }
        resolveInjectorInitializers() {
          const t = lr(this),
            r = _t(void 0);
          try {
            const i = this.get(to.multi, se, X.Self);
            for (const s of i) s();
          } finally {
            lr(t), _t(r);
          }
        }
        toString() {
          const t = [],
            r = this.records;
          for (const n of r.keys()) t.push($e(n));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new C(205, !1);
        }
        processProvider(t) {
          let r = Ur((t = z(t))) ? t : z(t && t.provide);
          const n = (function N1(e) {
            return Ld(e) ? ji(void 0, e.useValue) : ji(Ey(e), al);
          })(t);
          if (Ur(t) || !0 !== t.multi) this.records.get(r);
          else {
            let i = this.records.get(r);
            i ||
              ((i = ji(void 0, al, !0)),
              (i.factory = () => Fc(i.multi)),
              this.records.set(r, i)),
              (r = t),
              i.multi.push(t);
          }
          this.records.set(r, n);
        }
        hydrate(t, r) {
          return (
            r.value === al && ((r.value = T1), (r.value = r.factory())),
            "object" == typeof r.value &&
              r.value &&
              (function P1(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(r.value) &&
              this._ngOnDestroyHooks.add(r.value),
            r.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const r = z(t.providedIn);
          return "string" == typeof r
            ? "any" === r || this.scopes.has(r)
            : this.injectorDefTypes.has(r);
        }
        removeOnDestroy(t) {
          const r = this._onDestroyHooks.indexOf(t);
          -1 !== r && this._onDestroyHooks.splice(r, 1);
        }
      }
      function $d(e) {
        const t = ya(e),
          r = null !== t ? t.factory : jr(e);
        if (null !== r) return r;
        if (e instanceof O) throw new C(204, !1);
        if (e instanceof Function)
          return (function A1(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function Gs(e, t) {
                  const r = [];
                  for (let n = 0; n < e; n++) r.push(t);
                  return r;
                })(t, "?"),
                new C(204, !1))
              );
            const r = (function _I(e) {
              return (e && (e[Da] || e[em])) || null;
            })(e);
            return null !== r ? () => r.factory(e) : () => new e();
          })(e);
        throw new C(204, !1);
      }
      function Ey(e, t, r) {
        let n;
        if (Ur(e)) {
          const i = z(e);
          return jr(i) || $d(i);
        }
        if (Ld(e)) n = () => z(e.useValue);
        else if (
          (function wy(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          n = () => e.useFactory(...Fc(e.deps || []));
        else if (
          (function Cy(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          n = () => M(z(e.useExisting));
        else {
          const i = z(e && (e.useClass || e.provide));
          if (
            !(function R1(e) {
              return !!e.deps;
            })(e)
          )
            return jr(i) || $d(i);
          n = () => new i(...Fc(e.deps));
        }
        return n;
      }
      function ji(e, t, r = !1) {
        return { factory: e, value: t, multi: r ? [] : void 0 };
      }
      function Bd(e, t) {
        for (const r of e)
          Array.isArray(r) ? Bd(r, t) : r && Mc(r) ? Bd(r.ɵproviders, t) : t(r);
      }
      const cl = new O("AppId", { providedIn: "root", factory: () => x1 }),
        x1 = "ng",
        by = new O("Platform Initializer"),
        wn = new O("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        Sy = new O("AnimationModuleType"),
        My = new O("CSP nonce", {
          providedIn: "root",
          factory: () =>
            Li()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let Iy = (e, t, r) => null;
      function Kd(e, t, r = !1) {
        return Iy(e, t, r);
      }
      class z1 {}
      class Ny {}
      class G1 {
        resolveComponentFactory(t) {
          throw (function q1(e) {
            const t = Error(`No component factory found for ${$e(e)}.`);
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let ml = (() => {
        class t {}
        return (t.NULL = new G1()), t;
      })();
      function W1() {
        return Hi(Qe(), b());
      }
      function Hi(e, t) {
        return new dt(wt(e, t));
      }
      let dt = (() => {
        class t {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (t.__NG_ELEMENT_ID__ = W1), t;
      })();
      function Q1(e) {
        return e instanceof dt ? e.nativeElement : e;
      }
      class io {}
      let En = (() => {
          class t {
            constructor() {
              this.destroyNode = null;
            }
          }
          return (
            (t.__NG_ELEMENT_ID__ = () =>
              (function K1() {
                const e = b(),
                  r = Ot(Qe().index, e);
                return (Ct(r) ? r : e)[W];
              })()),
            t
          );
        })(),
        Z1 = (() => {
          var e;
          class t {}
          return (
            ((e = t).ɵprov = R({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            t
          );
        })();
      class so {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const Y1 = new so("16.2.6"),
        Xd = {};
      function Fy(e, t = null, r = null, n) {
        const i = ky(e, t, r, n);
        return i.resolveInjectorInitializers(), i;
      }
      function ky(e, t = null, r = null, n, i = new Set()) {
        const s = [r || se, S1(e)];
        return (
          (n = n || ("object" == typeof e ? void 0 : $e(e))),
          new ul(s, t || ll(), n || null, i)
        );
      }
      let kt = (() => {
        var e;
        class t {
          static create(n, i) {
            if (Array.isArray(n)) return Fy({ name: "" }, i, n, "");
            {
              const s = n.name ?? "";
              return Fy({ name: s }, n.parent, n.providers, s);
            }
          }
        }
        return (
          ((e = t).THROW_IF_NOT_FOUND = Ts),
          (e.NULL = new xd()),
          (e.ɵprov = R({ token: e, providedIn: "any", factory: () => M(vy) })),
          (e.__NG_ELEMENT_ID__ = -1),
          t
        );
      })();
      function ef(e) {
        return e.ngOriginalError;
      }
      class bn {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const r = this._findOriginalError(t);
          this._console.error("ERROR", t),
            r && this._console.error("ORIGINAL ERROR", r);
        }
        _findOriginalError(t) {
          let r = t && ef(t);
          for (; r && ef(r); ) r = ef(r);
          return r || null;
        }
      }
      function nf(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const ve = class iN extends be {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, r, n) {
          let i = t,
            s = r || (() => null),
            o = n;
          if (t && "object" == typeof t) {
            const l = t;
            (i = l.next?.bind(l)),
              (s = l.error?.bind(l)),
              (o = l.complete?.bind(l));
          }
          this.__isAsync && ((s = nf(s)), i && (i = nf(i)), o && (o = nf(o)));
          const a = super.subscribe({ next: i, error: s, complete: o });
          return t instanceof vt && t.add(a), a;
        }
      };
      function Vy(...e) {}
      class ue {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: r = !1,
          shouldCoalesceRunChangeDetection: n = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ve(!1)),
            (this.onMicrotaskEmpty = new ve(!1)),
            (this.onStable = new ve(!1)),
            (this.onError = new ve(!1)),
            typeof Zone > "u")
          )
            throw new C(908, !1);
          Zone.assertZonePatched();
          const i = this;
          (i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !n && r),
            (i.shouldCoalesceRunChangeDetection = n),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function sN() {
              const e = "function" == typeof De.requestAnimationFrame;
              let t = De[e ? "requestAnimationFrame" : "setTimeout"],
                r = De[e ? "cancelAnimationFrame" : "clearTimeout"];
              if (typeof Zone < "u" && t && r) {
                const n = t[Zone.__symbol__("OriginalDelegate")];
                n && (t = n);
                const i = r[Zone.__symbol__("OriginalDelegate")];
                i && (r = i);
              }
              return {
                nativeRequestAnimationFrame: t,
                nativeCancelAnimationFrame: r,
              };
            })().nativeRequestAnimationFrame),
            (function lN(e) {
              const t = () => {
                !(function aN(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(De, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                sf(e),
                                (e.isCheckStableRunning = !0),
                                rf(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    sf(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (r, n, i, s, o, a) => {
                  if (
                    (function cN(e) {
                      return (
                        !(!Array.isArray(e) || 1 !== e.length) &&
                        !0 === e[0].data?.__ignore_ng_zone__
                      );
                    })(a)
                  )
                    return r.invokeTask(i, s, o, a);
                  try {
                    return jy(e), r.invokeTask(i, s, o, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === s.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      $y(e);
                  }
                },
                onInvoke: (r, n, i, s, o, a, l) => {
                  try {
                    return jy(e), r.invoke(i, s, o, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), $y(e);
                  }
                },
                onHasTask: (r, n, i, s) => {
                  r.hasTask(i, s),
                    n === i &&
                      ("microTask" == s.change
                        ? ((e._hasPendingMicrotasks = s.microTask),
                          sf(e),
                          rf(e))
                        : "macroTask" == s.change &&
                          (e.hasPendingMacrotasks = s.macroTask));
                },
                onHandleError: (r, n, i, s) => (
                  r.handleError(i, s),
                  e.runOutsideAngular(() => e.onError.emit(s)),
                  !1
                ),
              });
            })(i);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!ue.isInAngularZone()) throw new C(909, !1);
        }
        static assertNotInAngularZone() {
          if (ue.isInAngularZone()) throw new C(909, !1);
        }
        run(t, r, n) {
          return this._inner.run(t, r, n);
        }
        runTask(t, r, n, i) {
          const s = this._inner,
            o = s.scheduleEventTask("NgZoneEvent: " + i, t, oN, Vy, Vy);
          try {
            return s.runTask(o, r, n);
          } finally {
            s.cancelTask(o);
          }
        }
        runGuarded(t, r, n) {
          return this._inner.runGuarded(t, r, n);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const oN = {};
      function rf(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function sf(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function jy(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function $y(e) {
        e._nesting--, rf(e);
      }
      class uN {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ve()),
            (this.onMicrotaskEmpty = new ve()),
            (this.onStable = new ve()),
            (this.onError = new ve());
        }
        run(t, r, n) {
          return t.apply(r, n);
        }
        runGuarded(t, r, n) {
          return t.apply(r, n);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, r, n, i) {
          return t.apply(r, n);
        }
      }
      const By = new O("", { providedIn: "root", factory: Hy });
      function Hy() {
        const e = P(ue);
        let t = !0;
        return gn(
          new Ie((i) => {
            (t =
              e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
              e.runOutsideAngular(() => {
                i.next(t), i.complete();
              });
          }),
          new Ie((i) => {
            let s;
            e.runOutsideAngular(() => {
              s = e.onStable.subscribe(() => {
                ue.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    !t &&
                      !e.hasPendingMacrotasks &&
                      !e.hasPendingMicrotasks &&
                      ((t = !0), i.next(!0));
                  });
              });
            });
            const o = e.onUnstable.subscribe(() => {
              ue.assertInAngularZone(),
                t &&
                  ((t = !1),
                  e.runOutsideAngular(() => {
                    i.next(!1);
                  }));
            });
            return () => {
              s.unsubscribe(), o.unsubscribe();
            };
          }).pipe(Yg())
        );
      }
      function Uy(e) {
        return e.ownerDocument;
      }
      function Qn(e) {
        return e instanceof Function ? e() : e;
      }
      let af = (() => {
        var e;
        class t {
          constructor() {
            (this.renderDepth = 0), (this.handler = null);
          }
          begin() {
            this.handler?.validateBegin(), this.renderDepth++;
          }
          end() {
            this.renderDepth--,
              0 === this.renderDepth && this.handler?.execute();
          }
          ngOnDestroy() {
            this.handler?.destroy(), (this.handler = null);
          }
        }
        return (
          ((e = t).ɵprov = R({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          })),
          t
        );
      })();
      function oo(e) {
        for (; e; ) {
          e[K] |= 64;
          const t = Ks(e);
          if (Bc(e) && !t) return e;
          e = t;
        }
        return null;
      }
      const Qy = new O("", { providedIn: "root", factory: () => !1 });
      let yl = null;
      function Xy(e, t) {
        return e[t] ?? t_();
      }
      function Jy(e, t) {
        const r = t_();
        r.producerNode?.length && ((e[t] = yl), (r.lView = e), (yl = e_()));
      }
      const _N = {
        ...bm,
        consumerIsAlwaysLive: !0,
        consumerMarkedDirty: (e) => {
          oo(e.lView);
        },
        lView: null,
      };
      function e_() {
        return Object.create(_N);
      }
      function t_() {
        return (yl ??= e_()), yl;
      }
      const Q = {};
      function S(e) {
        n_(re(), b(), ut() + e, !1);
      }
      function n_(e, t, r, n) {
        if (!n)
          if (3 == (3 & t[K])) {
            const s = e.preOrderCheckHooks;
            null !== s && Oa(t, s, r);
          } else {
            const s = e.preOrderHooks;
            null !== s && xa(t, s, 0, r);
          }
        $r(r);
      }
      function _(e, t = X.Default) {
        const r = b();
        return null === r ? M(e, t) : gv(Qe(), r, z(e), t);
      }
      function _l(e, t, r, n, i, s, o, a, l, u, c) {
        const d = t.blueprint.slice();
        return (
          (d[Re] = i),
          (d[K] = 140 | n),
          (null !== u || (e && 2048 & e[K])) && (d[K] |= 2048),
          zm(d),
          (d[Me] = d[yi] = e),
          (d[xe] = r),
          (d[vi] = o || (e && e[vi])),
          (d[W] = a || (e && e[W])),
          (d[ur] = l || (e && e[ur]) || null),
          (d[Je] = s),
          (d[Fs] = (function IA() {
            return MA++;
          })()),
          (d[Un] = c),
          (d[Dm] = u),
          (d[Fe] = 2 == t.type ? e[Fe] : d),
          d
        );
      }
      function qi(e, t, r, n, i) {
        let s = e.data[t];
        if (null === s)
          (s = (function lf(e, t, r, n, i) {
            const s = Zm(),
              o = Kc(),
              l = (e.data[t] = (function IN(e, t, r, n, i, s) {
                let o = t ? t.injectorIndex : -1,
                  a = 0;
                return (
                  (function Ei() {
                    return null !== H.skipHydrationRootTNode;
                  })() && (a |= 128),
                  {
                    type: r,
                    index: n,
                    insertBeforeIndex: null,
                    injectorIndex: o,
                    directiveStart: -1,
                    directiveEnd: -1,
                    directiveStylingLast: -1,
                    componentOffset: -1,
                    propertyBindings: null,
                    flags: a,
                    providerIndexes: 0,
                    value: i,
                    attrs: s,
                    mergedAttrs: null,
                    localNames: null,
                    initialInputs: void 0,
                    inputs: null,
                    outputs: null,
                    tView: null,
                    next: null,
                    prev: null,
                    projectionNext: null,
                    child: null,
                    parent: t,
                    projection: null,
                    styles: null,
                    stylesWithoutHost: null,
                    residualStyles: void 0,
                    classes: null,
                    classesWithoutHost: null,
                    residualClasses: void 0,
                    classBindings: 0,
                    styleBindings: 0,
                  }
                );
              })(0, o ? s : s && s.parent, r, t, n, i));
            return (
              null === e.firstChild && (e.firstChild = l),
              null !== s &&
                (o
                  ? null == s.child && null !== l.parent && (s.child = l)
                  : null === s.next && ((s.next = l), (l.prev = s))),
              l
            );
          })(e, t, r, n, i)),
            (function MT() {
              return H.lFrame.inI18n;
            })() && (s.flags |= 32);
        else if (64 & s.type) {
          (s.type = r), (s.value = n), (s.attrs = i);
          const o = (function $s() {
            const e = H.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          s.injectorIndex = null === o ? -1 : o.injectorIndex;
        }
        return Dn(s, !0), s;
      }
      function ao(e, t, r, n) {
        if (0 === r) return -1;
        const i = t.length;
        for (let s = 0; s < r; s++)
          t.push(n), e.blueprint.push(n), e.data.push(null);
        return i;
      }
      function i_(e, t, r, n, i) {
        const s = Xy(t, ks),
          o = ut(),
          a = 2 & n;
        try {
          $r(-1), a && t.length > J && n_(e, t, J, !1), _n(a ? 2 : 0, i);
          const u = a ? s : null,
            c = Uc(u);
          try {
            null !== u && (u.dirty = !1), r(n, i);
          } finally {
            zc(u, c);
          }
        } finally {
          a && null === t[ks] && Jy(t, ks), $r(o), _n(a ? 3 : 1, i);
        }
      }
      function uf(e, t, r) {
        if ($c(t)) {
          const n = qt(null);
          try {
            const s = t.directiveEnd;
            for (let o = t.directiveStart; o < s; o++) {
              const a = e.data[o];
              a.contentQueries && a.contentQueries(1, r[o], o);
            }
          } finally {
            qt(n);
          }
        }
      }
      function cf(e, t, r) {
        Km() &&
          ((function xN(e, t, r, n) {
            const i = r.directiveStart,
              s = r.directiveEnd;
            Vr(r) &&
              (function BN(e, t, r) {
                const n = wt(t, e),
                  i = s_(r);
                let o = 16;
                r.signals ? (o = 4096) : r.onPush && (o = 64);
                const a = Dl(
                  e,
                  _l(
                    e,
                    i,
                    null,
                    o,
                    n,
                    t,
                    null,
                    e[vi].rendererFactory.createRenderer(n, r),
                    null,
                    null,
                    null
                  )
                );
                e[t.index] = a;
              })(t, r, e.data[i + r.componentOffset]),
              e.firstCreatePass || ka(r, t),
              et(n, t);
            const o = r.initialInputs;
            for (let a = i; a < s; a++) {
              const l = e.data[a],
                u = Br(t, e, a, r);
              et(u, t),
                null !== o && HN(0, a - i, u, l, 0, o),
                nn(l) && (Ot(r.index, t)[xe] = Br(t, e, a, r));
            }
          })(e, t, r, wt(r, t)),
          64 == (64 & r.flags) && c_(e, t, r));
      }
      function df(e, t, r = wt) {
        const n = t.localNames;
        if (null !== n) {
          let i = t.index + 1;
          for (let s = 0; s < n.length; s += 2) {
            const o = n[s + 1],
              a = -1 === o ? r(t, e) : e[o];
            e[i++] = a;
          }
        }
      }
      function s_(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = ff(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
            ))
          : t;
      }
      function ff(e, t, r, n, i, s, o, a, l, u, c) {
        const d = J + n,
          f = d + i,
          h = (function CN(e, t) {
            const r = [];
            for (let n = 0; n < t; n++) r.push(n < e ? null : Q);
            return r;
          })(d, f),
          g = "function" == typeof u ? u() : u;
        return (h[N] = {
          type: e,
          blueprint: h,
          template: r,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: h.slice().fill(null, d),
          bindingStartIndex: d,
          expandoStartIndex: f,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof s ? s() : s,
          pipeRegistry: "function" == typeof o ? o() : o,
          firstChild: null,
          schemas: l,
          consts: g,
          incompleteFirstPass: !1,
          ssrId: c,
        });
      }
      let o_ = (e) => null;
      function a_(e, t, r, n) {
        for (let i in e)
          if (e.hasOwnProperty(i)) {
            r = null === r ? {} : r;
            const s = e[i];
            null === n
              ? l_(r, t, i, s)
              : n.hasOwnProperty(i) && l_(r, t, n[i], s);
          }
        return r;
      }
      function l_(e, t, r, n) {
        e.hasOwnProperty(r) ? e[r].push(t, n) : (e[r] = [t, n]);
      }
      function hf(e, t, r, n) {
        if (Km()) {
          const i = null === n ? null : { "": -1 },
            s = (function kN(e, t) {
              const r = e.directiveRegistry;
              let n = null,
                i = null;
              if (r)
                for (let s = 0; s < r.length; s++) {
                  const o = r[s];
                  if (pm(t, o.selectors, !1))
                    if ((n || (n = []), nn(o)))
                      if (null !== o.findHostDirectiveDefs) {
                        const a = [];
                        (i = i || new Map()),
                          o.findHostDirectiveDefs(o, a, i),
                          n.unshift(...a, o),
                          pf(e, t, a.length);
                      } else n.unshift(o), pf(e, t, 0);
                    else
                      (i = i || new Map()),
                        o.findHostDirectiveDefs?.(o, n, i),
                        n.push(o);
                }
              return null === n ? null : [n, i];
            })(e, r);
          let o, a;
          null === s ? (o = a = null) : ([o, a] = s),
            null !== o && u_(e, t, r, o, i, a),
            i &&
              (function LN(e, t, r) {
                if (t) {
                  const n = (e.localNames = []);
                  for (let i = 0; i < t.length; i += 2) {
                    const s = r[t[i + 1]];
                    if (null == s) throw new C(-301, !1);
                    n.push(t[i], s);
                  }
                }
              })(r, n, i);
        }
        r.mergedAttrs = Rs(r.mergedAttrs, r.attrs);
      }
      function u_(e, t, r, n, i, s) {
        for (let u = 0; u < n.length; u++) ad(ka(r, t), e, n[u].type);
        !(function jN(e, t, r) {
          (e.flags |= 1),
            (e.directiveStart = t),
            (e.directiveEnd = t + r),
            (e.providerIndexes = t);
        })(r, e.data.length, n.length);
        for (let u = 0; u < n.length; u++) {
          const c = n[u];
          c.providersResolver && c.providersResolver(c);
        }
        let o = !1,
          a = !1,
          l = ao(e, t, n.length, null);
        for (let u = 0; u < n.length; u++) {
          const c = n[u];
          (r.mergedAttrs = Rs(r.mergedAttrs, c.hostAttrs)),
            $N(e, r, t, l, c),
            VN(l, c, i),
            null !== c.contentQueries && (r.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (r.flags |= 64);
          const d = c.type.prototype;
          !o &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(r.index), (o = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
            l++;
        }
        !(function TN(e, t, r) {
          const i = t.directiveEnd,
            s = e.data,
            o = t.attrs,
            a = [];
          let l = null,
            u = null;
          for (let c = t.directiveStart; c < i; c++) {
            const d = s[c],
              f = r ? r.get(d) : null,
              g = f ? f.outputs : null;
            (l = a_(d.inputs, c, l, f ? f.inputs : null)),
              (u = a_(d.outputs, c, u, g));
            const m = null === l || null === o || hm(t) ? null : UN(l, c, o);
            a.push(m);
          }
          null !== l &&
            (l.hasOwnProperty("class") && (t.flags |= 8),
            l.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = l),
            (t.outputs = u);
        })(e, r, s);
      }
      function c_(e, t, r) {
        const n = r.directiveStart,
          i = r.directiveEnd,
          s = r.index,
          o = (function TT() {
            return H.lFrame.currentDirectiveIndex;
          })();
        try {
          $r(s);
          for (let a = n; a < i; a++) {
            const l = e.data[a],
              u = t[a];
            Yc(a),
              (null !== l.hostBindings ||
                0 !== l.hostVars ||
                null !== l.hostAttrs) &&
                FN(l, u);
          }
        } finally {
          $r(-1), Yc(o);
        }
      }
      function FN(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function pf(e, t, r) {
        (t.componentOffset = r), (e.components ??= []).push(t.index);
      }
      function VN(e, t, r) {
        if (r) {
          if (t.exportAs)
            for (let n = 0; n < t.exportAs.length; n++) r[t.exportAs[n]] = e;
          nn(t) && (r[""] = e);
        }
      }
      function $N(e, t, r, n, i) {
        e.data[n] = i;
        const s = i.factory || (i.factory = jr(i.type)),
          o = new Bs(s, nn(i), _);
        (e.blueprint[n] = o),
          (r[n] = o),
          (function PN(e, t, r, n, i) {
            const s = i.hostBindings;
            if (s) {
              let o = e.hostBindingOpCodes;
              null === o && (o = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function ON(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const r = e[--t];
                  if ("number" == typeof r && r < 0) return r;
                }
                return 0;
              })(o) != a && o.push(a),
                o.push(r, n, s);
            }
          })(e, t, n, ao(e, r, i.hostVars, Q), i);
      }
      function Sn(e, t, r, n, i, s) {
        const o = wt(e, t);
        !(function gf(e, t, r, n, i, s, o) {
          if (null == s) e.removeAttribute(t, i, r);
          else {
            const a = null == o ? G(s) : o(s, n || "", i);
            e.setAttribute(t, i, a, r);
          }
        })(t[W], o, s, e.value, r, n, i);
      }
      function HN(e, t, r, n, i, s) {
        const o = s[t];
        if (null !== o)
          for (let a = 0; a < o.length; ) d_(n, r, o[a++], o[a++], o[a++]);
      }
      function d_(e, t, r, n, i) {
        const s = qt(null);
        try {
          const o = e.inputTransforms;
          null !== o && o.hasOwnProperty(n) && (i = o[n].call(t, i)),
            null !== e.setInput ? e.setInput(t, i, r, n) : (t[n] = i);
        } finally {
          qt(s);
        }
      }
      function UN(e, t, r) {
        let n = null,
          i = 0;
        for (; i < r.length; ) {
          const s = r[i];
          if (0 !== s)
            if (5 !== s) {
              if ("number" == typeof s) break;
              if (e.hasOwnProperty(s)) {
                null === n && (n = []);
                const o = e[s];
                for (let a = 0; a < o.length; a += 2)
                  if (o[a] === t) {
                    n.push(s, o[a + 1], r[i + 1]);
                    break;
                  }
              }
              i += 2;
            } else i += 2;
          else i += 4;
        }
        return n;
      }
      function f_(e, t, r, n) {
        return [e, !0, !1, t, null, 0, n, r, null, null, null];
      }
      function h_(e, t) {
        const r = e.contentQueries;
        if (null !== r)
          for (let n = 0; n < r.length; n += 2) {
            const s = r[n + 1];
            if (-1 !== s) {
              const o = e.data[s];
              Jc(r[n]), o.contentQueries(2, t[s], s);
            }
          }
      }
      function Dl(e, t) {
        return e[Os] ? (e[_m][tn] = t) : (e[Os] = t), (e[_m] = t), t;
      }
      function mf(e, t, r) {
        Jc(0);
        const n = qt(null);
        try {
          t(e, r);
        } finally {
          qt(n);
        }
      }
      function p_(e) {
        return e[mi] || (e[mi] = []);
      }
      function g_(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function v_(e, t) {
        const r = e[ur],
          n = r ? r.get(bn, null) : null;
        n && n.handleError(t);
      }
      function vf(e, t, r, n, i) {
        for (let s = 0; s < r.length; ) {
          const o = r[s++],
            a = r[s++];
          d_(e.data[o], t[o], n, a, i);
        }
      }
      function zN(e, t) {
        const r = Ot(t, e),
          n = r[N];
        !(function qN(e, t) {
          for (let r = t.length; r < e.blueprint.length; r++)
            t.push(e.blueprint[r]);
        })(n, r);
        const i = r[Re];
        null !== i && null === r[Un] && (r[Un] = Kd(i, r[ur])), yf(n, r, r[xe]);
      }
      function yf(e, t, r) {
        ed(t);
        try {
          const n = e.viewQuery;
          null !== n && mf(1, n, r);
          const i = e.template;
          null !== i && i_(e, t, i, 1, r),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && h_(e, t),
            e.staticViewQueries && mf(2, e.viewQuery, r);
          const s = e.components;
          null !== s &&
            (function GN(e, t) {
              for (let r = 0; r < t.length; r++) zN(e, t[r]);
            })(t, s);
        } catch (n) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            n)
          );
        } finally {
          (t[K] &= -5), td();
        }
      }
      let y_ = (() => {
        var e;
        class t {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(n, i, s) {
            const o = typeof Zone > "u" ? null : Zone.current,
              a = (function iT(e, t, r) {
                const n = Object.create(sT);
                r && (n.consumerAllowSignalWrites = !0),
                  (n.fn = e),
                  (n.schedule = t);
                const i = (o) => {
                  n.cleanupFn = o;
                };
                return (
                  (n.ref = {
                    notify: () => Tm(n),
                    run: () => {
                      if (((n.dirty = !1), n.hasRun && !Am(n))) return;
                      n.hasRun = !0;
                      const o = Uc(n);
                      try {
                        n.cleanupFn(), (n.cleanupFn = Lm), n.fn(i);
                      } finally {
                        zc(n, o);
                      }
                    },
                    cleanup: () => n.cleanupFn(),
                  }),
                  n.ref
                );
              })(
                n,
                (c) => {
                  this.all.has(c) && this.queue.set(c, o);
                },
                s
              );
            let l;
            this.all.add(a), a.notify();
            const u = () => {
              a.cleanup(), l?.(), this.all.delete(a), this.queue.delete(a);
            };
            return (l = i?.onDestroy(u)), { destroy: u };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [n, i] of this.queue)
                this.queue.delete(n), i ? i.run(() => n.run()) : n.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
        }
        return (
          ((e = t).ɵprov = R({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          })),
          t
        );
      })();
      function Cl(e, t, r) {
        let n = r ? e.styles : null,
          i = r ? e.classes : null,
          s = 0;
        if (null !== t)
          for (let o = 0; o < t.length; o++) {
            const a = t[o];
            "number" == typeof a
              ? (s = a)
              : 1 == s
              ? (i = bc(i, a))
              : 2 == s && (n = bc(n, a + ": " + t[++o] + ";"));
          }
        r ? (e.styles = n) : (e.stylesWithoutHost = n),
          r ? (e.classes = i) : (e.classesWithoutHost = i);
      }
      function lo(e, t, r, n, i = !1) {
        for (; null !== r; ) {
          const s = t[r.index];
          null !== s && n.push(Ce(s)), at(s) && __(s, n);
          const o = r.type;
          if (8 & o) lo(e, t, r.child, n);
          else if (32 & o) {
            const a = _d(r, t);
            let l;
            for (; (l = a()); ) n.push(l);
          } else if (16 & o) {
            const a = ey(t, r);
            if (Array.isArray(a)) n.push(...a);
            else {
              const l = Ks(t[Fe]);
              lo(l[N], l, a, n, !0);
            }
          }
          r = i ? r.projectionNext : r.next;
        }
        return n;
      }
      function __(e, t) {
        for (let r = Ge; r < e.length; r++) {
          const n = e[r],
            i = n[N].firstChild;
          null !== i && lo(n[N], n, i, t);
        }
        e[yn] !== e[Re] && t.push(e[yn]);
      }
      function wl(e, t, r, n = !0) {
        const i = t[vi],
          s = i.rendererFactory,
          o = i.afterRenderEventManager;
        s.begin?.(), o?.begin();
        try {
          D_(e, t, e.template, r);
        } catch (l) {
          throw (n && v_(t, l), l);
        } finally {
          s.end?.(), i.effectManager?.flush(), o?.end();
        }
      }
      function D_(e, t, r, n) {
        const i = t[K];
        if (256 != (256 & i)) {
          t[vi].effectManager?.flush(), ed(t);
          try {
            zm(t),
              (function Xm(e) {
                return (H.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== r && i_(e, t, r, 2, n);
            const o = 3 == (3 & i);
            if (o) {
              const u = e.preOrderCheckHooks;
              null !== u && Oa(t, u, null);
            } else {
              const u = e.preOrderHooks;
              null !== u && xa(t, u, 0, null), nd(t, 0);
            }
            if (
              ((function KN(e) {
                for (let t = Hv(e); null !== t; t = Uv(t)) {
                  if (!t[Cm]) continue;
                  const r = t[Di];
                  for (let n = 0; n < r.length; n++) {
                    gT(r[n]);
                  }
                }
              })(t),
              C_(t, 2),
              null !== e.contentQueries && h_(e, t),
              o)
            ) {
              const u = e.contentCheckHooks;
              null !== u && Oa(t, u);
            } else {
              const u = e.contentHooks;
              null !== u && xa(t, u, 1), nd(t, 1);
            }
            !(function DN(e, t) {
              const r = e.hostBindingOpCodes;
              if (null === r) return;
              const n = Xy(t, Ls);
              try {
                for (let i = 0; i < r.length; i++) {
                  const s = r[i];
                  if (s < 0) $r(~s);
                  else {
                    const o = s,
                      a = r[++i],
                      l = r[++i];
                    IT(a, o), (n.dirty = !1);
                    const u = Uc(n);
                    try {
                      l(2, t[o]);
                    } finally {
                      zc(n, u);
                    }
                  }
                }
              } finally {
                null === t[Ls] && Jy(t, Ls), $r(-1);
              }
            })(e, t);
            const a = e.components;
            null !== a && E_(t, a, 0);
            const l = e.viewQuery;
            if ((null !== l && mf(2, l, n), o)) {
              const u = e.viewCheckHooks;
              null !== u && Oa(t, u);
            } else {
              const u = e.viewHooks;
              null !== u && xa(t, u, 2), nd(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[K] &= -73),
              qm(t);
          } finally {
            td();
          }
        }
      }
      function C_(e, t) {
        for (let r = Hv(e); null !== r; r = Uv(r))
          for (let n = Ge; n < r.length; n++) w_(r[n], t);
      }
      function ZN(e, t, r) {
        w_(Ot(t, e), r);
      }
      function w_(e, t) {
        if (
          !(function hT(e) {
            return 128 == (128 & e[K]);
          })(e)
        )
          return;
        const r = e[N],
          n = e[K];
        if ((80 & n && 0 === t) || 1024 & n || 2 === t)
          D_(r, e, r.template, e[xe]);
        else if (e[Ps] > 0) {
          C_(e, 1);
          const i = r.components;
          null !== i && E_(e, i, 1);
        }
      }
      function E_(e, t, r) {
        for (let n = 0; n < t.length; n++) ZN(e, t[n], r);
      }
      class uo {
        get rootNodes() {
          const t = this._lView,
            r = t[N];
          return lo(r, t, r.firstChild, []);
        }
        constructor(t, r) {
          (this._lView = t),
            (this._cdRefInjectingView = r),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[xe];
        }
        set context(t) {
          this._lView[xe] = t;
        }
        get destroyed() {
          return 256 == (256 & this._lView[K]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[Me];
            if (at(t)) {
              const r = t[8],
                n = r ? r.indexOf(this) : -1;
              n > -1 && (Xa(t, n), $a(r, n));
            }
            this._attachedToViewContainer = !1;
          }
          Cd(this._lView[N], this._lView);
        }
        onDestroy(t) {
          !(function Wm(e, t) {
            if (256 == (256 & e[K])) throw new C(911, !1);
            null === e[cr] && (e[cr] = []), e[cr].push(t);
          })(this._lView, t);
        }
        markForCheck() {
          oo(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[K] &= -129;
        }
        reattach() {
          this._lView[K] |= 128;
        }
        detectChanges() {
          wl(this._lView[N], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new C(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function BA(e, t) {
              Ys(e, t, t[W], 2, null, null);
            })(this._lView[N], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new C(902, !1);
          this._appRef = t;
        }
      }
      class YN extends uo {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          wl(t[N], t, t[xe], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class b_ extends ml {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const r = ne(t);
          return new co(r, this.ngModule);
        }
      }
      function S_(e) {
        const t = [];
        for (let r in e)
          e.hasOwnProperty(r) && t.push({ propName: e[r], templateName: r });
        return t;
      }
      class JN {
        constructor(t, r) {
          (this.injector = t), (this.parentInjector = r);
        }
        get(t, r, n) {
          n = wa(n);
          const i = this.injector.get(t, Xd, n);
          return i !== Xd || r === Xd ? i : this.parentInjector.get(t, r, n);
        }
      }
      class co extends Ny {
        get inputs() {
          const t = this.componentDef,
            r = t.inputTransforms,
            n = S_(t.inputs);
          if (null !== r)
            for (const i of n)
              r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
          return n;
        }
        get outputs() {
          return S_(this.componentDef.outputs);
        }
        constructor(t, r) {
          super(),
            (this.componentDef = t),
            (this.ngModule = r),
            (this.componentType = t.type),
            (this.selector = (function jI(e) {
              return e.map(VI).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!r);
        }
        create(t, r, n, i) {
          let s = (i = i || this.ngModule) instanceof Ft ? i : i?.injector;
          s &&
            null !== this.componentDef.getStandaloneInjector &&
            (s = this.componentDef.getStandaloneInjector(s) || s);
          const o = s ? new JN(t, s) : t,
            a = o.get(io, null);
          if (null === a) throw new C(407, !1);
          const d = {
              rendererFactory: a,
              sanitizer: o.get(Z1, null),
              effectManager: o.get(y_, null),
              afterRenderEventManager: o.get(af, null),
            },
            f = a.createRenderer(null, this.componentDef),
            h = this.componentDef.selectors[0][0] || "div",
            g = n
              ? (function wN(e, t, r, n) {
                  const s = n.get(Qy, !1) || r === zt.ShadowDom,
                    o = e.selectRootElement(t, s);
                  return (
                    (function EN(e) {
                      o_(e);
                    })(o),
                    o
                  );
                })(f, n, this.componentDef.encapsulation, o)
              : Ya(
                  f,
                  h,
                  (function XN(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(h)
                ),
            D = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528;
          let v = null;
          null !== g && (v = Kd(g, o, !0));
          const A = ff(0, null, null, 1, 0, null, null, null, null, null, null),
            I = _l(null, A, null, D, null, null, d, f, o, null, v);
          let U, me;
          ed(I);
          try {
            const ge = this.componentDef;
            let Ye,
              Tt = null;
            ge.findHostDirectiveDefs
              ? ((Ye = []),
                (Tt = new Map()),
                ge.findHostDirectiveDefs(ge, Ye, Tt),
                Ye.push(ge))
              : (Ye = [ge]);
            const hn = (function tR(e, t) {
                const r = e[N],
                  n = J;
                return (e[n] = t), qi(r, n, 2, "#host", null);
              })(I, g),
              cc = (function nR(e, t, r, n, i, s, o) {
                const a = i[N];
                !(function rR(e, t, r, n) {
                  for (const i of e)
                    t.mergedAttrs = Rs(t.mergedAttrs, i.hostAttrs);
                  null !== t.mergedAttrs &&
                    (Cl(t, t.mergedAttrs, !0), null !== r && iy(n, r, t));
                })(n, e, t, o);
                let l = null;
                null !== t && (l = Kd(t, i[ur]));
                const u = s.rendererFactory.createRenderer(t, r);
                let c = 16;
                r.signals ? (c = 4096) : r.onPush && (c = 64);
                const d = _l(
                  i,
                  s_(r),
                  null,
                  c,
                  i[e.index],
                  e,
                  s,
                  u,
                  null,
                  null,
                  l
                );
                return (
                  a.firstCreatePass && pf(a, e, n.length - 1),
                  Dl(i, d),
                  (i[e.index] = d)
                );
              })(hn, g, ge, Ye, I, d, f);
            (me = Um(A, J)),
              g &&
                (function sR(e, t, r, n) {
                  if (n) Vc(e, r, ["ng-version", Y1.full]);
                  else {
                    const { attrs: i, classes: s } = (function $I(e) {
                      const t = [],
                        r = [];
                      let n = 1,
                        i = 2;
                      for (; n < e.length; ) {
                        let s = e[n];
                        if ("string" == typeof s)
                          2 === i
                            ? "" !== s && t.push(s, e[++n])
                            : 8 === i && r.push(s);
                        else {
                          if (!en(i)) break;
                          i = s;
                        }
                        n++;
                      }
                      return { attrs: t, classes: r };
                    })(t.selectors[0]);
                    i && Vc(e, r, i),
                      s && s.length > 0 && ry(e, r, s.join(" "));
                  }
                })(f, ge, g, n),
              void 0 !== r &&
                (function oR(e, t, r) {
                  const n = (e.projection = []);
                  for (let i = 0; i < t.length; i++) {
                    const s = r[i];
                    n.push(null != s ? Array.from(s) : null);
                  }
                })(me, this.ngContentSelectors, r),
              (U = (function iR(e, t, r, n, i, s) {
                const o = Qe(),
                  a = i[N],
                  l = wt(o, i);
                u_(a, i, o, r, null, n);
                for (let c = 0; c < r.length; c++)
                  et(Br(i, a, o.directiveStart + c, o), i);
                c_(a, i, o), l && et(l, i);
                const u = Br(i, a, o.directiveStart + o.componentOffset, o);
                if (((e[xe] = i[xe] = u), null !== s))
                  for (const c of s) c(u, t);
                return uf(a, o, e), u;
              })(cc, ge, Ye, Tt, I, [aR])),
              yf(A, I, null);
          } finally {
            td();
          }
          return new eR(this.componentType, U, Hi(me, I), I, me);
        }
      }
      class eR extends z1 {
        constructor(t, r, n, i, s) {
          super(),
            (this.location = n),
            (this._rootLView = i),
            (this._tNode = s),
            (this.previousInputValues = null),
            (this.instance = r),
            (this.hostView = this.changeDetectorRef = new YN(i)),
            (this.componentType = t);
        }
        setInput(t, r) {
          const n = this._tNode.inputs;
          let i;
          if (null !== n && (i = n[t])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(t) &&
                Object.is(this.previousInputValues.get(t), r))
            )
              return;
            const s = this._rootLView;
            vf(s[N], s, i, t, r),
              this.previousInputValues.set(t, r),
              oo(Ot(this._tNode.index, s));
          }
        }
        get injector() {
          return new ct(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function aR() {
        const e = Qe();
        Pa(b()[N], e);
      }
      function fe(e) {
        let t = (function M_(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          r = !0;
        const n = [e];
        for (; t; ) {
          let i;
          if (nn(e)) i = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new C(903, !1);
            i = t.ɵdir;
          }
          if (i) {
            if (r) {
              n.push(i);
              const o = e;
              (o.inputs = El(e.inputs)),
                (o.inputTransforms = El(e.inputTransforms)),
                (o.declaredInputs = El(e.declaredInputs)),
                (o.outputs = El(e.outputs));
              const a = i.hostBindings;
              a && dR(e, a);
              const l = i.viewQuery,
                u = i.contentQueries;
              if (
                (l && uR(e, l),
                u && cR(e, u),
                ma(e.inputs, i.inputs),
                ma(e.declaredInputs, i.declaredInputs),
                ma(e.outputs, i.outputs),
                null !== i.inputTransforms &&
                  (null === o.inputTransforms && (o.inputTransforms = {}),
                  ma(o.inputTransforms, i.inputTransforms)),
                nn(i) && i.data.animation)
              ) {
                const c = e.data;
                c.animation = (c.animation || []).concat(i.data.animation);
              }
            }
            const s = i.features;
            if (s)
              for (let o = 0; o < s.length; o++) {
                const a = s[o];
                a && a.ngInherit && a(e), a === fe && (r = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function lR(e) {
          let t = 0,
            r = null;
          for (let n = e.length - 1; n >= 0; n--) {
            const i = e[n];
            (i.hostVars = t += i.hostVars),
              (i.hostAttrs = Rs(i.hostAttrs, (r = Rs(r, i.hostAttrs))));
          }
        })(n);
      }
      function El(e) {
        return e === mn ? {} : e === se ? [] : e;
      }
      function uR(e, t) {
        const r = e.viewQuery;
        e.viewQuery = r
          ? (n, i) => {
              t(n, i), r(n, i);
            }
          : t;
      }
      function cR(e, t) {
        const r = e.contentQueries;
        e.contentQueries = r
          ? (n, i, s) => {
              t(n, i, s), r(n, i, s);
            }
          : t;
      }
      function dR(e, t) {
        const r = e.hostBindings;
        e.hostBindings = r
          ? (n, i) => {
              t(n, i), r(n, i);
            }
          : t;
      }
      function N_(e) {
        const t = e.inputConfig,
          r = {};
        for (const n in t)
          if (t.hasOwnProperty(n)) {
            const i = t[n];
            Array.isArray(i) && i[2] && (r[n] = i[2]);
          }
        e.inputTransforms = r;
      }
      function bl(e) {
        return (
          !!_f(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function _f(e) {
        return null !== e && ("function" == typeof e || "object" == typeof e);
      }
      function Mn(e, t, r) {
        return (e[t] = r);
      }
      function tt(e, t, r) {
        return !Object.is(e[t], r) && ((e[t] = r), !0);
      }
      function zr(e, t, r, n) {
        const i = tt(e, t, r);
        return tt(e, t + 1, n) || i;
      }
      function Wt(e, t, r, n, i, s) {
        const o = zr(e, t, r, n);
        return zr(e, t + 2, i, s) || o;
      }
      function In(e, t, r, n) {
        const i = b();
        return tt(i, bi(), t) && (re(), Sn(Te(), i, e, t, r, n)), In;
      }
      function k(e, t, r, n, i, s, o, a) {
        const l = b(),
          u = re(),
          c = e + J,
          d = u.firstCreatePass
            ? (function kR(e, t, r, n, i, s, o, a, l) {
                const u = t.consts,
                  c = qi(t, e, 4, o || null, fr(u, a));
                hf(t, r, c, fr(u, l)), Pa(t, c);
                const d = (c.tView = ff(
                  2,
                  c,
                  n,
                  i,
                  s,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  u,
                  null
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, c),
                    (d.queries = t.queries.embeddedTView(c))),
                  c
                );
              })(c, u, l, t, r, n, i, s, o)
            : u.data[c];
        Dn(d, !1);
        const f = U_(u, l, d, e);
        Ra() && el(u, l, f, d),
          et(f, l),
          Dl(l, (l[c] = f_(f, l, f, d))),
          Ia(d) && cf(u, l, d),
          null != o && df(l, d, a);
      }
      let U_ = function z_(e, t, r, n) {
        return hr(!0), t[W].createComment("");
      };
      function Sf(e) {
        return wi(
          (function ST() {
            return H.lFrame.contextLView;
          })(),
          J + e
        );
      }
      function T(e, t, r) {
        const n = b();
        return (
          tt(n, bi(), t) &&
            (function Lt(e, t, r, n, i, s, o, a) {
              const l = wt(t, r);
              let c,
                u = t.inputs;
              !a && null != u && (c = u[n])
                ? (vf(e, r, c, n, i),
                  Vr(t) &&
                    (function NN(e, t) {
                      const r = Ot(t, e);
                      16 & r[K] || (r[K] |= 64);
                    })(r, t.index))
                : 3 & t.type &&
                  ((n = (function AN(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(n)),
                  (i = null != o ? o(i, t.value || "", n) : i),
                  s.setProperty(l, n, i));
            })(re(), Te(), n, e, t, n[W], r, !1),
          T
        );
      }
      function Mf(e, t, r, n, i) {
        const o = i ? "class" : "style";
        vf(e, r, t.inputs[o], o, n);
      }
      function w(e, t, r, n) {
        const i = b(),
          s = re(),
          o = J + e,
          a = i[W],
          l = s.firstCreatePass
            ? (function $R(e, t, r, n, i, s) {
                const o = t.consts,
                  l = qi(t, e, 2, n, fr(o, i));
                return (
                  hf(t, r, l, fr(o, s)),
                  null !== l.attrs && Cl(l, l.attrs, !1),
                  null !== l.mergedAttrs && Cl(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(o, s, i, t, r, n)
            : s.data[o],
          u = q_(s, i, l, a, t, e);
        i[o] = u;
        const c = Ia(l);
        return (
          Dn(l, !0),
          iy(a, u, l),
          32 != (32 & l.flags) && Ra() && el(s, i, u, l),
          0 ===
            (function vT() {
              return H.lFrame.elementDepthCount;
            })() && et(u, i),
          (function yT() {
            H.lFrame.elementDepthCount++;
          })(),
          c && (cf(s, i, l), uf(s, l, i)),
          null !== n && df(i, l),
          w
        );
      }
      function E() {
        let e = Qe();
        Kc() ? Zc() : ((e = e.parent), Dn(e, !1));
        const t = e;
        (function DT(e) {
          return H.skipHydrationRootTNode === e;
        })(t) &&
          (function bT() {
            H.skipHydrationRootTNode = null;
          })(),
          (function _T() {
            H.lFrame.elementDepthCount--;
          })();
        const r = re();
        return (
          r.firstCreatePass && (Pa(r, e), $c(e) && r.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function jT(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            Mf(r, t, b(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function $T(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Mf(r, t, b(), t.stylesWithoutHost, !1),
          E
        );
      }
      function q(e, t, r, n) {
        return w(e, t, r, n), E(), q;
      }
      let q_ = (e, t, r, n, i, s) => (
        hr(!0),
        Ya(
          n,
          i,
          (function ov() {
            return H.lFrame.currentNamespace;
          })()
        )
      );
      function qr(e, t, r) {
        const n = b(),
          i = re(),
          s = e + J,
          o = i.firstCreatePass
            ? (function UR(e, t, r, n, i) {
                const s = t.consts,
                  o = fr(s, n),
                  a = qi(t, e, 8, "ng-container", o);
                return (
                  null !== o && Cl(a, o, !0),
                  hf(t, r, a, fr(s, i)),
                  null !== t.queries && t.queries.elementStart(t, a),
                  a
                );
              })(s, i, n, t, r)
            : i.data[s];
        Dn(o, !0);
        const a = W_(i, n, o, e);
        return (
          (n[s] = a),
          Ra() && el(i, n, a, o),
          et(a, n),
          Ia(o) && (cf(i, n, o), uf(i, o, n)),
          null != r && df(n, o),
          qr
        );
      }
      function Gr() {
        let e = Qe();
        const t = re();
        return (
          Kc() ? Zc() : ((e = e.parent), Dn(e, !1)),
          t.firstCreatePass && (Pa(t, e), $c(e) && t.queries.elementEnd(e)),
          Gr
        );
      }
      let W_ = (e, t, r, n) => (hr(!0), Dd(t[W], ""));
      function mr() {
        return b();
      }
      function mo(e) {
        return !!e && "function" == typeof e.then;
      }
      function Q_(e) {
        return !!e && "function" == typeof e.subscribe;
      }
      function ce(e, t, r, n) {
        const i = b(),
          s = re(),
          o = Qe();
        return (
          (function Z_(e, t, r, n, i, s, o) {
            const a = Ia(n),
              u = e.firstCreatePass && g_(e),
              c = t[xe],
              d = p_(t);
            let f = !0;
            if (3 & n.type || o) {
              const m = wt(n, t),
                y = o ? o(m) : m,
                D = d.length,
                v = o ? (I) => o(Ce(I[n.index])) : n.index;
              let A = null;
              if (
                (!o &&
                  a &&
                  (A = (function GR(e, t, r, n) {
                    const i = e.cleanup;
                    if (null != i)
                      for (let s = 0; s < i.length - 1; s += 2) {
                        const o = i[s];
                        if (o === r && i[s + 1] === n) {
                          const a = t[mi],
                            l = i[s + 2];
                          return a.length > l ? a[l] : null;
                        }
                        "string" == typeof o && (s += 2);
                      }
                    return null;
                  })(e, t, i, n.index)),
                null !== A)
              )
                ((A.__ngLastListenerFn__ || A).__ngNextListenerFn__ = s),
                  (A.__ngLastListenerFn__ = s),
                  (f = !1);
              else {
                s = X_(n, t, c, s, !1);
                const I = r.listen(y, i, s);
                d.push(s, I), u && u.push(i, v, D, D + 1);
              }
            } else s = X_(n, t, c, s, !1);
            const h = n.outputs;
            let g;
            if (f && null !== h && (g = h[i])) {
              const m = g.length;
              if (m)
                for (let y = 0; y < m; y += 2) {
                  const U = t[g[y]][g[y + 1]].subscribe(s),
                    me = d.length;
                  d.push(s, U), u && u.push(i, n.index, me, -(me + 1));
                }
            }
          })(s, i, i[W], o, e, t, n),
          ce
        );
      }
      function Y_(e, t, r, n) {
        try {
          return _n(6, t, r), !1 !== r(n);
        } catch (i) {
          return v_(e, i), !1;
        } finally {
          _n(7, t, r);
        }
      }
      function X_(e, t, r, n, i) {
        return function s(o) {
          if (o === Function) return n;
          oo(e.componentOffset > -1 ? Ot(e.index, t) : t);
          let l = Y_(t, r, n, o),
            u = s.__ngNextListenerFn__;
          for (; u; ) (l = Y_(t, r, u, o) && l), (u = u.__ngNextListenerFn__);
          return i && !1 === l && o.preventDefault(), l;
        };
      }
      function he(e = 1) {
        return (function NT(e) {
          return (H.lFrame.contextLView = (function RT(e, t) {
            for (; e > 0; ) (t = t[yi]), e--;
            return t;
          })(e, H.lFrame.contextLView))[xe];
        })(e);
      }
      function Al(e, t) {
        return (e << 17) | (t << 2);
      }
      function vr(e) {
        return (e >> 17) & 32767;
      }
      function Tf(e) {
        return 2 | e;
      }
      function Wr(e) {
        return (131068 & e) >> 2;
      }
      function Af(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function Nf(e) {
        return 1 | e;
      }
      function lD(e, t, r, n, i) {
        const s = e[r + 1],
          o = null === t;
        let a = n ? vr(s) : Wr(s),
          l = !1;
        for (; 0 !== a && (!1 === l || o); ) {
          const c = e[a + 1];
          tP(e[a], t) && ((l = !0), (e[a + 1] = n ? Nf(c) : Tf(c))),
            (a = n ? vr(c) : Wr(c));
        }
        l && (e[r + 1] = n ? Tf(s) : Nf(s));
      }
      function tP(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Pi(e, t) >= 0)
        );
      }
      function Nl(e, t) {
        return (
          (function on(e, t, r, n) {
            const i = b(),
              s = re(),
              o = (function qn(e) {
                const t = H.lFrame,
                  r = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + e), r;
              })(2);
            s.firstUpdatePass &&
              (function vD(e, t, r, n) {
                const i = e.data;
                if (null === i[r + 1]) {
                  const s = i[ut()],
                    o = (function mD(e, t) {
                      return t >= e.expandoStartIndex;
                    })(e, r);
                  (function CD(e, t) {
                    return 0 != (e.flags & (t ? 8 : 16));
                  })(s, n) &&
                    null === t &&
                    !o &&
                    (t = !1),
                    (t = (function cP(e, t, r, n) {
                      const i = (function Xc(e) {
                        const t = H.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : e[t];
                      })(e);
                      let s = n ? t.residualClasses : t.residualStyles;
                      if (null === i)
                        0 === (n ? t.classBindings : t.styleBindings) &&
                          ((r = vo((r = Rf(null, e, t, r, n)), t.attrs, n)),
                          (s = null));
                      else {
                        const o = t.directiveStylingLast;
                        if (-1 === o || e[o] !== i)
                          if (((r = Rf(i, e, t, r, n)), null === s)) {
                            let l = (function dP(e, t, r) {
                              const n = r ? t.classBindings : t.styleBindings;
                              if (0 !== Wr(n)) return e[vr(n)];
                            })(e, t, n);
                            void 0 !== l &&
                              Array.isArray(l) &&
                              ((l = Rf(null, e, t, l[1], n)),
                              (l = vo(l, t.attrs, n)),
                              (function fP(e, t, r, n) {
                                e[vr(r ? t.classBindings : t.styleBindings)] =
                                  n;
                              })(e, t, n, l));
                          } else
                            s = (function hP(e, t, r) {
                              let n;
                              const i = t.directiveEnd;
                              for (
                                let s = 1 + t.directiveStylingLast;
                                s < i;
                                s++
                              )
                                n = vo(n, e[s].hostAttrs, r);
                              return vo(n, t.attrs, r);
                            })(e, t, n);
                      }
                      return (
                        void 0 !== s &&
                          (n
                            ? (t.residualClasses = s)
                            : (t.residualStyles = s)),
                        r
                      );
                    })(i, s, t, n)),
                    (function JR(e, t, r, n, i, s) {
                      let o = s ? t.classBindings : t.styleBindings,
                        a = vr(o),
                        l = Wr(o);
                      e[n] = r;
                      let c,
                        u = !1;
                      if (
                        (Array.isArray(r)
                          ? ((c = r[1]),
                            (null === c || Pi(r, c) > 0) && (u = !0))
                          : (c = r),
                        i)
                      )
                        if (0 !== l) {
                          const f = vr(e[a + 1]);
                          (e[n + 1] = Al(f, a)),
                            0 !== f && (e[f + 1] = Af(e[f + 1], n)),
                            (e[a + 1] = (function YR(e, t) {
                              return (131071 & e) | (t << 17);
                            })(e[a + 1], n));
                        } else
                          (e[n + 1] = Al(a, 0)),
                            0 !== a && (e[a + 1] = Af(e[a + 1], n)),
                            (a = n);
                      else
                        (e[n + 1] = Al(l, 0)),
                          0 === a ? (a = n) : (e[l + 1] = Af(e[l + 1], n)),
                          (l = n);
                      u && (e[n + 1] = Tf(e[n + 1])),
                        lD(e, c, n, !0),
                        lD(e, c, n, !1),
                        (function eP(e, t, r, n, i) {
                          const s = i ? e.residualClasses : e.residualStyles;
                          null != s &&
                            "string" == typeof t &&
                            Pi(s, t) >= 0 &&
                            (r[n + 1] = Nf(r[n + 1]));
                        })(t, c, e, n, s),
                        (o = Al(a, l)),
                        s ? (t.classBindings = o) : (t.styleBindings = o);
                    })(i, s, t, r, o, n);
                }
              })(s, e, o, n),
              t !== Q &&
                tt(i, o, t) &&
                (function _D(e, t, r, n, i, s, o, a) {
                  if (!(3 & t.type)) return;
                  const l = e.data,
                    u = l[a + 1],
                    c = (function XR(e) {
                      return 1 == (1 & e);
                    })(u)
                      ? DD(l, t, r, i, Wr(u), o)
                      : void 0;
                  Rl(c) ||
                    (Rl(s) ||
                      ((function ZR(e) {
                        return 2 == (2 & e);
                      })(u) &&
                        (s = DD(l, null, r, i, a, o))),
                    (function YA(e, t, r, n, i) {
                      if (t) i ? e.addClass(r, n) : e.removeClass(r, n);
                      else {
                        let s = -1 === n.indexOf("-") ? void 0 : pr.DashCase;
                        null == i
                          ? e.removeStyle(r, n, s)
                          : ("string" == typeof i &&
                              i.endsWith("!important") &&
                              ((i = i.slice(0, -10)), (s |= pr.Important)),
                            e.setStyle(r, n, i, s));
                      }
                    })(n, o, Na(ut(), r), i, s));
                })(
                  s,
                  s.data[ut()],
                  i,
                  i[W],
                  e,
                  (i[o + 1] = (function vP(e, t) {
                    return (
                      null == e ||
                        "" === e ||
                        ("string" == typeof t
                          ? (e += t)
                          : "object" == typeof e && (e = $e(gr(e)))),
                      e
                    );
                  })(t, r)),
                  n,
                  o
                );
          })(e, t, null, !0),
          Nl
        );
      }
      function Rf(e, t, r, n, i) {
        let s = null;
        const o = r.directiveEnd;
        let a = r.directiveStylingLast;
        for (
          -1 === a ? (a = r.directiveStart) : a++;
          a < o && ((s = t[a]), (n = vo(n, s.hostAttrs, i)), s !== e);

        )
          a++;
        return null !== e && (r.directiveStylingLast = a), n;
      }
      function vo(e, t, r) {
        const n = r ? 1 : 2;
        let i = -1;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const o = t[s];
            "number" == typeof o
              ? (i = o)
              : i === n &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                xt(e, o, !!r || t[++s]));
          }
        return void 0 === e ? null : e;
      }
      function DD(e, t, r, n, i, s) {
        const o = null === t;
        let a;
        for (; i > 0; ) {
          const l = e[i],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let f = r[i + 1];
          f === Q && (f = d ? se : void 0);
          let h = d ? cd(f, n) : c === n ? f : void 0;
          if ((u && !Rl(h) && (h = cd(l, n)), Rl(h) && ((a = h), o))) return a;
          const g = e[i + 1];
          i = o ? vr(g) : Wr(g);
        }
        if (null !== t) {
          let l = s ? t.residualClasses : t.residualStyles;
          null != l && (a = cd(l, n));
        }
        return a;
      }
      function Rl(e) {
        return void 0 !== e;
      }
      function x(e, t = "") {
        const r = b(),
          n = re(),
          i = e + J,
          s = n.firstCreatePass ? qi(n, i, 1, t, null) : n.data[i],
          o = wD(n, r, s, t, e);
        (r[i] = o), Ra() && el(n, r, o, s), Dn(s, !1);
      }
      let wD = (e, t, r, n, i) => (
        hr(!0),
        (function Za(e, t) {
          return e.createText(t);
        })(t[W], n)
      );
      function Vt(e) {
        return Qt("", e, ""), Vt;
      }
      function Qt(e, t, r) {
        const n = b(),
          i = (function Wi(e, t, r, n) {
            return tt(e, bi(), r) ? t + G(r) + n : Q;
          })(n, e, t, r);
        return (
          i !== Q &&
            (function Kn(e, t, r) {
              const n = Na(t, e);
              !(function qv(e, t, r) {
                e.setValue(t, r);
              })(e[W], n, r);
            })(n, ut(), i),
          Qt
        );
      }
      const Qr = void 0;
      var jP = [
        "en",
        [["a", "p"], ["AM", "PM"], Qr],
        [["AM", "PM"], Qr, Qr],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        Qr,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        Qr,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", Qr, "{1} 'at' {0}", Qr],
        [
          ".",
          ",",
          ";",
          "%",
          "+",
          "-",
          "E",
          "\xd7",
          "\u2030",
          "\u221e",
          "NaN",
          ":",
        ],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function VP(e) {
          const r = Math.floor(Math.abs(e)),
            n = e.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === r && 0 === n ? 1 : 5;
        },
      ];
      let ns = {};
      function ft(e) {
        const t = (function $P(e) {
          return e.toLowerCase().replace(/_/g, "-");
        })(e);
        let r = UD(t);
        if (r) return r;
        const n = t.split("-")[0];
        if (((r = UD(n)), r)) return r;
        if ("en" === n) return jP;
        throw new C(701, !1);
      }
      function UD(e) {
        return (
          e in ns ||
            (ns[e] =
              De.ng &&
              De.ng.common &&
              De.ng.common.locales &&
              De.ng.common.locales[e]),
          ns[e]
        );
      }
      var we = (function (e) {
        return (
          (e[(e.LocaleId = 0)] = "LocaleId"),
          (e[(e.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
          (e[(e.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
          (e[(e.DaysFormat = 3)] = "DaysFormat"),
          (e[(e.DaysStandalone = 4)] = "DaysStandalone"),
          (e[(e.MonthsFormat = 5)] = "MonthsFormat"),
          (e[(e.MonthsStandalone = 6)] = "MonthsStandalone"),
          (e[(e.Eras = 7)] = "Eras"),
          (e[(e.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
          (e[(e.WeekendRange = 9)] = "WeekendRange"),
          (e[(e.DateFormat = 10)] = "DateFormat"),
          (e[(e.TimeFormat = 11)] = "TimeFormat"),
          (e[(e.DateTimeFormat = 12)] = "DateTimeFormat"),
          (e[(e.NumberSymbols = 13)] = "NumberSymbols"),
          (e[(e.NumberFormats = 14)] = "NumberFormats"),
          (e[(e.CurrencyCode = 15)] = "CurrencyCode"),
          (e[(e.CurrencySymbol = 16)] = "CurrencySymbol"),
          (e[(e.CurrencyName = 17)] = "CurrencyName"),
          (e[(e.Currencies = 18)] = "Currencies"),
          (e[(e.Directionality = 19)] = "Directionality"),
          (e[(e.PluralCase = 20)] = "PluralCase"),
          (e[(e.ExtraData = 21)] = "ExtraData"),
          e
        );
      })(we || {});
      const rs = "en-US";
      let zD = rs;
      function xf(e, t, r, n, i) {
        if (((e = z(e)), Array.isArray(e)))
          for (let s = 0; s < e.length; s++) xf(e[s], t, r, n, i);
        else {
          const s = re(),
            o = b(),
            a = Qe();
          let l = Ur(e) ? e : z(e.provide);
          const u = Ey(e),
            c = 1048575 & a.providerIndexes,
            d = a.directiveStart,
            f = a.providerIndexes >> 20;
          if (Ur(e) || !e.multi) {
            const h = new Bs(u, i, _),
              g = kf(l, t, i ? c : c + f, d);
            -1 === g
              ? (ad(ka(a, o), s, l),
                Ff(s, e, t.length),
                t.push(l),
                a.directiveStart++,
                a.directiveEnd++,
                i && (a.providerIndexes += 1048576),
                r.push(h),
                o.push(h))
              : ((r[g] = h), (o[g] = h));
          } else {
            const h = kf(l, t, c + f, d),
              g = kf(l, t, c, c + f),
              y = g >= 0 && r[g];
            if ((i && !y) || (!i && !(h >= 0 && r[h]))) {
              ad(ka(a, o), s, l);
              const D = (function VO(e, t, r, n, i) {
                const s = new Bs(e, r, _);
                return (
                  (s.multi = []),
                  (s.index = t),
                  (s.componentProviders = 0),
                  gC(s, i, n && !r),
                  s
                );
              })(i ? LO : kO, r.length, i, n, u);
              !i && y && (r[g].providerFactory = D),
                Ff(s, e, t.length, 0),
                t.push(l),
                a.directiveStart++,
                a.directiveEnd++,
                i && (a.providerIndexes += 1048576),
                r.push(D),
                o.push(D);
            } else Ff(s, e, h > -1 ? h : g, gC(r[i ? g : h], u, !i && n));
            !i && n && y && r[g].componentProviders++;
          }
        }
      }
      function Ff(e, t, r, n) {
        const i = Ur(t),
          s = (function I1(e) {
            return !!e.useClass;
          })(t);
        if (i || s) {
          const l = (s ? z(t.useClass) : t).prototype.ngOnDestroy;
          if (l) {
            const u = e.destroyHooks || (e.destroyHooks = []);
            if (!i && t.multi) {
              const c = u.indexOf(r);
              -1 === c ? u.push(r, [n, l]) : u[c + 1].push(n, l);
            } else u.push(r, l);
          }
        }
      }
      function gC(e, t, r) {
        return r && e.componentProviders++, e.multi.push(t) - 1;
      }
      function kf(e, t, r, n) {
        for (let i = r; i < n; i++) if (t[i] === e) return i;
        return -1;
      }
      function kO(e, t, r, n) {
        return Lf(this.multi, []);
      }
      function LO(e, t, r, n) {
        const i = this.multi;
        let s;
        if (this.providerFactory) {
          const o = this.providerFactory.componentProviders,
            a = Br(r, r[N], this.providerFactory.index, n);
          (s = a.slice(0, o)), Lf(i, s);
          for (let l = o; l < a.length; l++) s.push(a[l]);
        } else (s = []), Lf(i, s);
        return s;
      }
      function Lf(e, t) {
        for (let r = 0; r < e.length; r++) t.push((0, e[r])());
        return t;
      }
      function Se(e, t = []) {
        return (r) => {
          r.providersResolver = (n, i) =>
            (function FO(e, t, r) {
              const n = re();
              if (n.firstCreatePass) {
                const i = nn(e);
                xf(r, n.data, n.blueprint, i, !0),
                  xf(t, n.data, n.blueprint, i, !1);
              }
            })(n, i ? i(e) : e, t);
        };
      }
      class Kr {}
      class mC {}
      class Vf extends Kr {
        constructor(t, r, n) {
          super(),
            (this._parent = r),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new b_(this));
          const i = Rt(t);
          (this._bootstrapComponents = Qn(i.bootstrap)),
            (this._r3Injector = ky(
              t,
              r,
              [
                { provide: Kr, useValue: this },
                { provide: ml, useValue: this.componentFactoryResolver },
                ...n,
              ],
              $e(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((r) => r()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class jf extends mC {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new Vf(this.moduleType, t, []);
        }
      }
      class vC extends Kr {
        constructor(t) {
          super(),
            (this.componentFactoryResolver = new b_(this)),
            (this.instance = null);
          const r = new ul(
            [
              ...t.providers,
              { provide: Kr, useValue: this },
              { provide: ml, useValue: this.componentFactoryResolver },
            ],
            t.parent || ll(),
            t.debugName,
            new Set(["environment"])
          );
          (this.injector = r),
            t.runEnvironmentInitializers && r.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function $f(e, t, r = null) {
        return new vC({
          providers: e,
          parent: t,
          debugName: r,
          runEnvironmentInitializers: !0,
        }).injector;
      }
      let BO = (() => {
        var e;
        class t {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n)) {
              const i = _y(0, n.type),
                s =
                  i.length > 0
                    ? $f([i], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n, s);
            }
            return this.cachedInjectors.get(n);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          ((e = t).ɵprov = R({
            token: e,
            providedIn: "environment",
            factory: () => new e(M(Ft)),
          })),
          t
        );
      })();
      function yC(e) {
        e.getStandaloneInjector = (t) =>
          t.get(BO).getOrCreateStandaloneInjector(e);
      }
      function yr(e, t, r, n) {
        return (function MC(e, t, r, n, i, s) {
          const o = t + r;
          return tt(e, o, i)
            ? Mn(e, o + 1, s ? n.call(s, i) : n(i))
            : Eo(e, o + 1);
        })(b(), lt(), e, t, r, n);
      }
      function kl(e, t, r, n, i) {
        return IC(b(), lt(), e, t, r, n, i);
      }
      function SC(e, t, r, n, i, s, o) {
        return (function AC(e, t, r, n, i, s, o, a, l) {
          const u = t + r;
          return Wt(e, u, i, s, o, a)
            ? Mn(e, u + 4, l ? n.call(l, i, s, o, a) : n(i, s, o, a))
            : Eo(e, u + 4);
        })(b(), lt(), e, t, r, n, i, s, o);
      }
      function Hf(e, t, r, n, i, s, o, a) {
        const l = lt() + e,
          u = b(),
          c = Wt(u, l, r, n, i, s);
        return tt(u, l + 4, o) || c
          ? Mn(u, l + 5, a ? t.call(a, r, n, i, s, o) : t(r, n, i, s, o))
          : (function fo(e, t) {
              return e[t];
            })(u, l + 5);
      }
      function Eo(e, t) {
        const r = e[t];
        return r === Q ? void 0 : r;
      }
      function IC(e, t, r, n, i, s, o) {
        const a = t + r;
        return zr(e, a, i, s)
          ? Mn(e, a + 2, o ? n.call(o, i, s) : n(i, s))
          : Eo(e, a + 2);
      }
      function PC(e, t, r, n) {
        const i = e + J,
          s = b(),
          o = wi(s, i);
        return (function bo(e, t) {
          return e[N].data[t].pure;
        })(s, i)
          ? IC(s, lt(), t, o.transform, r, n, o)
          : o.transform(r, n);
      }
      function ax() {
        return this._results[Symbol.iterator]();
      }
      class Uf {
        get changes() {
          return this._changes || (this._changes = new ve());
        }
        constructor(t = !1) {
          (this._emitDistinctChangesOnly = t),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const r = Uf.prototype;
          r[Symbol.iterator] || (r[Symbol.iterator] = ax);
        }
        get(t) {
          return this._results[t];
        }
        map(t) {
          return this._results.map(t);
        }
        filter(t) {
          return this._results.filter(t);
        }
        find(t) {
          return this._results.find(t);
        }
        reduce(t, r) {
          return this._results.reduce(t, r);
        }
        forEach(t) {
          this._results.forEach(t);
        }
        some(t) {
          return this._results.some(t);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(t, r) {
          const n = this;
          n.dirty = !1;
          const i = (function Gt(e) {
            return e.flat(Number.POSITIVE_INFINITY);
          })(t);
          (this._changesDetected = !(function eA(e, t, r) {
            if (e.length !== t.length) return !1;
            for (let n = 0; n < e.length; n++) {
              let i = e[n],
                s = t[n];
              if ((r && ((i = r(i)), (s = r(s))), s !== i)) return !1;
            }
            return !0;
          })(n._results, i, r)) &&
            ((n._results = i),
            (n.length = i.length),
            (n.last = i[this.length - 1]),
            (n.first = i[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      function ux(e, t, r, n = !0) {
        const i = t[N];
        if (
          ((function UA(e, t, r, n) {
            const i = Ge + n,
              s = r.length;
            n > 0 && (r[i - 1][tn] = t),
              n < s - Ge
                ? ((t[tn] = r[i]), Cv(r, Ge + n, t))
                : (r.push(t), (t[tn] = null)),
              (t[Me] = r);
            const o = t[xs];
            null !== o &&
              r !== o &&
              (function zA(e, t) {
                const r = e[Di];
                t[Fe] !== t[Me][Me][Fe] && (e[Cm] = !0),
                  null === r ? (e[Di] = [t]) : r.push(t);
              })(o, t);
            const a = t[vn];
            null !== a && a.insertView(e), (t[K] |= 128);
          })(i, t, e, r),
          n)
        ) {
          const s = Sd(r, e),
            o = t[W],
            a = Ja(o, e[yn]);
          null !== a &&
            (function $A(e, t, r, n, i, s) {
              (n[Re] = i), (n[Je] = t), Ys(e, n, r, 1, i, s);
            })(i, e[Je], o, t, a, s);
        }
      }
      let Nn = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = fx), t;
      })();
      const cx = Nn,
        dx = class extends cx {
          constructor(t, r, n) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = r),
              (this.elementRef = n);
          }
          get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
          }
          createEmbeddedView(t, r) {
            return this.createEmbeddedViewImpl(t, r);
          }
          createEmbeddedViewImpl(t, r, n) {
            const i = (function lx(e, t, r, n) {
              const i = t.tView,
                a = _l(
                  e,
                  i,
                  r,
                  4096 & e[K] ? 4096 : 16,
                  null,
                  t,
                  null,
                  null,
                  null,
                  n?.injector ?? null,
                  n?.hydrationInfo ?? null
                );
              a[xs] = e[t.index];
              const u = e[vn];
              return (
                null !== u && (a[vn] = u.createEmbeddedView(i)), yf(i, a, r), a
              );
            })(this._declarationLView, this._declarationTContainer, t, {
              injector: r,
              hydrationInfo: n,
            });
            return new uo(i);
          }
        };
      function fx() {
        return Ll(Qe(), b());
      }
      function Ll(e, t) {
        return 4 & e.type ? new dx(t, e, Hi(e, t)) : null;
      }
      let ln = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = yx), t;
      })();
      function yx() {
        return jC(Qe(), b());
      }
      const _x = ln,
        LC = class extends _x {
          constructor(t, r, n) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = r),
              (this._hostLView = n);
          }
          get element() {
            return Hi(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new ct(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = La(this._hostTNode, this._hostLView);
            if (id(t)) {
              const r = Us(t, this._hostLView),
                n = Hs(t);
              return new ct(r[N].data[n + 8], r);
            }
            return new ct(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const r = VC(this._lContainer);
            return (null !== r && r[t]) || null;
          }
          get length() {
            return this._lContainer.length - Ge;
          }
          createEmbeddedView(t, r, n) {
            let i, s;
            "number" == typeof n
              ? (i = n)
              : null != n && ((i = n.index), (s = n.injector));
            const a = t.createEmbeddedViewImpl(r || {}, s, null);
            return this.insertImpl(a, i, false), a;
          }
          createComponent(t, r, n, i, s) {
            const o =
              t &&
              !(function qs(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (o) a = r;
            else {
              const m = r || {};
              (a = m.index),
                (n = m.injector),
                (i = m.projectableNodes),
                (s = m.environmentInjector || m.ngModuleRef);
            }
            const l = o ? t : new co(ne(t)),
              u = n || this.parentInjector;
            if (!s && null == l.ngModule) {
              const y = (o ? u : this.parentInjector).get(Ft, null);
              y && (s = y);
            }
            ne(l.componentType ?? {});
            const h = l.create(u, i, null, s);
            return this.insertImpl(h.hostView, a, false), h;
          }
          insert(t, r) {
            return this.insertImpl(t, r, !1);
          }
          insertImpl(t, r, n) {
            const i = t._lView;
            if (
              (function pT(e) {
                return at(e[Me]);
              })(i)
            ) {
              const l = this.indexOf(t);
              if (-1 !== l) this.detach(l);
              else {
                const u = i[Me],
                  c = new LC(u, u[Je], u[Me]);
                c.detach(c.indexOf(t));
              }
            }
            const o = this._adjustIndex(r),
              a = this._lContainer;
            return (
              ux(a, i, o, !n), t.attachToViewContainerRef(), Cv(zf(a), o, t), t
            );
          }
          move(t, r) {
            return this.insert(t, r);
          }
          indexOf(t) {
            const r = VC(this._lContainer);
            return null !== r ? r.indexOf(t) : -1;
          }
          remove(t) {
            const r = this._adjustIndex(t, -1),
              n = Xa(this._lContainer, r);
            n && ($a(zf(this._lContainer), r), Cd(n[N], n));
          }
          detach(t) {
            const r = this._adjustIndex(t, -1),
              n = Xa(this._lContainer, r);
            return n && null != $a(zf(this._lContainer), r) ? new uo(n) : null;
          }
          _adjustIndex(t, r = 0) {
            return t ?? this.length + r;
          }
        };
      function VC(e) {
        return e[8];
      }
      function zf(e) {
        return e[8] || (e[8] = []);
      }
      function jC(e, t) {
        let r;
        const n = t[e.index];
        return (
          at(n)
            ? (r = n)
            : ((r = f_(n, t, null, e)), (t[e.index] = r), Dl(t, r)),
          $C(r, t, e, n),
          new LC(r, e, t)
        );
      }
      let $C = function BC(e, t, r, n) {
        if (e[yn]) return;
        let i;
        (i =
          8 & r.type
            ? Ce(n)
            : (function Dx(e, t) {
                const r = e[W],
                  n = r.createComment(""),
                  i = wt(t, e);
                return (
                  Hr(
                    r,
                    Ja(r, i),
                    n,
                    (function QA(e, t) {
                      return e.nextSibling(t);
                    })(r, i),
                    !1
                  ),
                  n
                );
              })(t, r)),
          (e[yn] = i);
      };
      class qf {
        constructor(t) {
          (this.queryList = t), (this.matches = null);
        }
        clone() {
          return new qf(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class Gf {
        constructor(t = []) {
          this.queries = t;
        }
        createEmbeddedView(t) {
          const r = t.queries;
          if (null !== r) {
            const n =
                null !== t.contentQueries ? t.contentQueries[0] : r.length,
              i = [];
            for (let s = 0; s < n; s++) {
              const o = r.getByIndex(s);
              i.push(this.queries[o.indexInDeclarationView].clone());
            }
            return new Gf(i);
          }
          return null;
        }
        insertView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        detachView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        dirtyQueriesWithMatches(t) {
          for (let r = 0; r < this.queries.length; r++)
            null !== GC(t, r).matches && this.queries[r].setDirty();
        }
      }
      class HC {
        constructor(t, r, n = null) {
          (this.predicate = t), (this.flags = r), (this.read = n);
        }
      }
      class Wf {
        constructor(t = []) {
          this.queries = t;
        }
        elementStart(t, r) {
          for (let n = 0; n < this.queries.length; n++)
            this.queries[n].elementStart(t, r);
        }
        elementEnd(t) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementEnd(t);
        }
        embeddedTView(t) {
          let r = null;
          for (let n = 0; n < this.length; n++) {
            const i = null !== r ? r.length : 0,
              s = this.getByIndex(n).embeddedTView(t, i);
            s &&
              ((s.indexInDeclarationView = n),
              null !== r ? r.push(s) : (r = [s]));
          }
          return null !== r ? new Wf(r) : null;
        }
        template(t, r) {
          for (let n = 0; n < this.queries.length; n++)
            this.queries[n].template(t, r);
        }
        getByIndex(t) {
          return this.queries[t];
        }
        get length() {
          return this.queries.length;
        }
        track(t) {
          this.queries.push(t);
        }
      }
      class Qf {
        constructor(t, r = -1) {
          (this.metadata = t),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = r);
        }
        elementStart(t, r) {
          this.isApplyingToNode(r) && this.matchTNode(t, r);
        }
        elementEnd(t) {
          this._declarationNodeIndex === t.index &&
            (this._appliesToNextNode = !1);
        }
        template(t, r) {
          this.elementStart(t, r);
        }
        embeddedTView(t, r) {
          return this.isApplyingToNode(t)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-t.index, r),
              new Qf(this.metadata))
            : null;
        }
        isApplyingToNode(t) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const r = this._declarationNodeIndex;
            let n = t.parent;
            for (; null !== n && 8 & n.type && n.index !== r; ) n = n.parent;
            return r === (null !== n ? n.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(t, r) {
          const n = this.metadata.predicate;
          if (Array.isArray(n))
            for (let i = 0; i < n.length; i++) {
              const s = n[i];
              this.matchTNodeWithReadOption(t, r, Ex(r, s)),
                this.matchTNodeWithReadOption(t, r, Va(r, t, s, !1, !1));
            }
          else
            n === Nn
              ? 4 & r.type && this.matchTNodeWithReadOption(t, r, -1)
              : this.matchTNodeWithReadOption(t, r, Va(r, t, n, !1, !1));
        }
        matchTNodeWithReadOption(t, r, n) {
          if (null !== n) {
            const i = this.metadata.read;
            if (null !== i)
              if (i === dt || i === ln || (i === Nn && 4 & r.type))
                this.addMatch(r.index, -2);
              else {
                const s = Va(r, t, i, !1, !1);
                null !== s && this.addMatch(r.index, s);
              }
            else this.addMatch(r.index, n);
          }
        }
        addMatch(t, r) {
          null === this.matches
            ? (this.matches = [t, r])
            : this.matches.push(t, r);
        }
      }
      function Ex(e, t) {
        const r = e.localNames;
        if (null !== r)
          for (let n = 0; n < r.length; n += 2) if (r[n] === t) return r[n + 1];
        return null;
      }
      function Sx(e, t, r, n) {
        return -1 === r
          ? (function bx(e, t) {
              return 11 & e.type ? Hi(e, t) : 4 & e.type ? Ll(e, t) : null;
            })(t, e)
          : -2 === r
          ? (function Mx(e, t, r) {
              return r === dt
                ? Hi(t, e)
                : r === Nn
                ? Ll(t, e)
                : r === ln
                ? jC(t, e)
                : void 0;
            })(e, t, n)
          : Br(e, e[N], r, t);
      }
      function UC(e, t, r, n) {
        const i = t[vn].queries[n];
        if (null === i.matches) {
          const s = e.data,
            o = r.matches,
            a = [];
          for (let l = 0; l < o.length; l += 2) {
            const u = o[l];
            a.push(u < 0 ? null : Sx(t, s[u], o[l + 1], r.metadata.read));
          }
          i.matches = a;
        }
        return i.matches;
      }
      function Kf(e, t, r, n) {
        const i = e.queries.getByIndex(r),
          s = i.matches;
        if (null !== s) {
          const o = UC(e, t, i, r);
          for (let a = 0; a < s.length; a += 2) {
            const l = s[a];
            if (l > 0) n.push(o[a / 2]);
            else {
              const u = s[a + 1],
                c = t[-l];
              for (let d = Ge; d < c.length; d++) {
                const f = c[d];
                f[xs] === f[Me] && Kf(f[N], f, u, n);
              }
              if (null !== c[Di]) {
                const d = c[Di];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  Kf(h[N], h, u, n);
                }
              }
            }
          }
        }
        return n;
      }
      function Zf(e) {
        const t = b(),
          r = re(),
          n = ev();
        Jc(n + 1);
        const i = GC(r, n);
        if (
          e.dirty &&
          (function fT(e) {
            return 4 == (4 & e[K]);
          })(t) ===
            (2 == (2 & i.metadata.flags))
        ) {
          if (null === i.matches) e.reset([]);
          else {
            const s = i.crossesNgTemplate ? Kf(r, t, n, []) : UC(r, t, i, n);
            e.reset(s, Q1), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function Yf(e, t, r, n) {
        const i = re();
        if (i.firstCreatePass) {
          const s = Qe();
          (function qC(e, t, r) {
            null === e.queries && (e.queries = new Wf()),
              e.queries.track(new Qf(t, r));
          })(i, new HC(t, r, n), s.index),
            (function Ax(e, t) {
              const r = e.contentQueries || (e.contentQueries = []);
              t !== (r.length ? r[r.length - 1] : -1) &&
                r.push(e.queries.length - 1, t);
            })(i, e),
            2 == (2 & r) && (i.staticContentQueries = !0);
        }
        !(function zC(e, t, r) {
          const n = new Uf(4 == (4 & r));
          (function MN(e, t, r, n) {
            const i = p_(t);
            i.push(r), e.firstCreatePass && g_(e).push(n, i.length - 1);
          })(e, t, n, n.destroy),
            null === t[vn] && (t[vn] = new Gf()),
            t[vn].queries.push(new qf(n));
        })(i, b(), r);
      }
      function Xf() {
        return (function Tx(e, t) {
          return e[vn].queries[t].queryList;
        })(b(), ev());
      }
      function GC(e, t) {
        return e.queries.getByIndex(t);
      }
      function Jf(e, t) {
        return Ll(e, t);
      }
      const sh = new O("Application Initializer");
      let oh = (() => {
          var e;
          class t {
            constructor() {
              (this.initialized = !1),
                (this.done = !1),
                (this.donePromise = new Promise((n, i) => {
                  (this.resolve = n), (this.reject = i);
                })),
                (this.appInits = P(sh, { optional: !0 }) ?? []);
            }
            runInitializers() {
              if (this.initialized) return;
              const n = [];
              for (const s of this.appInits) {
                const o = s();
                if (mo(o)) n.push(o);
                else if (Q_(o)) {
                  const a = new Promise((l, u) => {
                    o.subscribe({ complete: l, error: u });
                  });
                  n.push(a);
                }
              }
              const i = () => {
                (this.done = !0), this.resolve();
              };
              Promise.all(n)
                .then(() => {
                  i();
                })
                .catch((s) => {
                  this.reject(s);
                }),
                0 === n.length && i(),
                (this.initialized = !0);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        uw = (() => {
          var e;
          class t {
            log(n) {
              console.log(n);
            }
            warn(n) {
              console.warn(n);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            t
          );
        })();
      const Zn = new O("LocaleId", {
          providedIn: "root",
          factory: () =>
            P(Zn, X.Optional | X.SkipSelf) ||
            (function Zx() {
              return (typeof $localize < "u" && $localize.locale) || rs;
            })(),
        }),
        Yx = new O("DefaultCurrencyCode", {
          providedIn: "root",
          factory: () => "USD",
        });
      let $l = (() => {
        var e;
        class t {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new st(!1));
          }
          add() {
            this.hasPendingTasks.next(!0);
            const n = this.taskId++;
            return this.pendingTasks.add(n), n;
          }
          remove(n) {
            this.pendingTasks.delete(n),
              0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
          }
          ngOnDestroy() {
            this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      class Jx {
        constructor(t, r) {
          (this.ngModuleFactory = t), (this.componentFactories = r);
        }
      }
      let cw = (() => {
        var e;
        class t {
          compileModuleSync(n) {
            return new jf(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const i = this.compileModuleSync(n),
              o = Qn(Rt(n).declarations).reduce((a, l) => {
                const u = ne(l);
                return u && a.push(new co(u)), a;
              }, []);
            return new Jx(i, o);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const pw = new O(""),
        Hl = new O("");
      let dh,
        uh = (() => {
          var e;
          class t {
            constructor(n, i, s) {
              (this._ngZone = n),
                (this.registry = i),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                dh ||
                  ((function _F(e) {
                    dh = e;
                  })(s),
                  s.addToWindow(i)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      ue.assertNotInAngularZone(),
                        queueMicrotask(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                queueMicrotask(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (i) =>
                    !i.updateCb ||
                    !i.updateCb(n) ||
                    (clearTimeout(i.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, i, s) {
              let o = -1;
              i &&
                i > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (a) => a.timeoutId !== o
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, i)),
                this._callbacks.push({ doneCb: n, timeoutId: o, updateCb: s });
            }
            whenStable(n, i, s) {
              if (s && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, i, s), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, i, s) {
              return [];
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(M(ue), M(ch), M(Hl));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        ch = (() => {
          var e;
          class t {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, i) {
              this._applications.set(n, i);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, i = !0) {
              return dh?.findTestabilityInTree(this, n, i) ?? null;
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            t
          );
        })(),
        _r = null;
      const gw = new O("AllowMultipleToken"),
        fh = new O("PlatformDestroyListeners"),
        hh = new O("appBootstrapListener");
      class vw {
        constructor(t, r) {
          (this.name = t), (this.token = r);
        }
      }
      function _w(e, t, r = []) {
        const n = `Platform: ${t}`,
          i = new O(n);
        return (s = []) => {
          let o = ph();
          if (!o || o.injector.get(gw, !1)) {
            const a = [...r, ...s, { provide: i, useValue: !0 }];
            e
              ? e(a)
              : (function wF(e) {
                  if (_r && !_r.get(gw, !1)) throw new C(400, !1);
                  (function mw() {
                    !(function JI(e) {
                      Om = e;
                    })(() => {
                      throw new C(600, !1);
                    });
                  })(),
                    (_r = e);
                  const t = e.get(Cw);
                  (function yw(e) {
                    e.get(by, null)?.forEach((r) => r());
                  })(e);
                })(
                  (function Dw(e = [], t) {
                    return kt.create({
                      name: t,
                      providers: [
                        { provide: Vd, useValue: "platform" },
                        { provide: fh, useValue: new Set([() => (_r = null)]) },
                        ...e,
                      ],
                    });
                  })(a, n)
                );
          }
          return (function bF(e) {
            const t = ph();
            if (!t) throw new C(401, !1);
            return t;
          })();
        };
      }
      function ph() {
        return _r?.get(Cw) ?? null;
      }
      let Cw = (() => {
        var e;
        class t {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, i) {
            const s = (function SF(e = "zone.js", t) {
              return "noop" === e ? new uN() : "zone.js" === e ? new ue(t) : e;
            })(
              i?.ngZone,
              (function ww(e) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
                };
              })({
                eventCoalescing: i?.ngZoneEventCoalescing,
                runCoalescing: i?.ngZoneRunCoalescing,
              })
            );
            return s.run(() => {
              const o = (function $O(e, t, r) {
                  return new Vf(e, t, r);
                })(
                  n.moduleType,
                  this.injector,
                  (function Iw(e) {
                    return [
                      { provide: ue, useFactory: e },
                      {
                        provide: to,
                        multi: !0,
                        useFactory: () => {
                          const t = P(IF, { optional: !0 });
                          return () => t.initialize();
                        },
                      },
                      { provide: Mw, useFactory: MF },
                      { provide: By, useFactory: Hy },
                    ];
                  })(() => s)
                ),
                a = o.injector.get(bn, null);
              return (
                s.runOutsideAngular(() => {
                  const l = s.onError.subscribe({
                    next: (u) => {
                      a.handleError(u);
                    },
                  });
                  o.onDestroy(() => {
                    Ul(this._modules, o), l.unsubscribe();
                  });
                }),
                (function Ew(e, t, r) {
                  try {
                    const n = r();
                    return mo(n)
                      ? n.catch((i) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(i)), i)
                          );
                        })
                      : n;
                  } catch (n) {
                    throw (t.runOutsideAngular(() => e.handleError(n)), n);
                  }
                })(a, s, () => {
                  const l = o.injector.get(oh);
                  return (
                    l.runInitializers(),
                    l.donePromise.then(
                      () => (
                        (function qD(e) {
                          Ut(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (zD = e.toLowerCase().replace(/_/g, "-"));
                        })(o.injector.get(Zn, rs) || rs),
                        this._moduleDoBootstrap(o),
                        o
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, i = []) {
            const s = bw({}, i);
            return (function DF(e, t, r) {
              const n = new jf(r);
              return Promise.resolve(n);
            })(0, 0, n).then((o) => this.bootstrapModuleFactory(o, s));
          }
          _moduleDoBootstrap(n) {
            const i = n.injector.get(Zr);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((s) => i.bootstrap(s));
            else {
              if (!n.instance.ngDoBootstrap) throw new C(-403, !1);
              n.instance.ngDoBootstrap(i);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new C(404, !1);
            this._modules.slice().forEach((i) => i.destroy()),
              this._destroyListeners.forEach((i) => i());
            const n = this._injector.get(fh, null);
            n && (n.forEach((i) => i()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(kt));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          t
        );
      })();
      function bw(e, t) {
        return Array.isArray(t) ? t.reduce(bw, e) : { ...e, ...t };
      }
      let Zr = (() => {
        var e;
        class t {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = P(Mw)),
              (this.zoneIsStable = P(By)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = P($l).hasPendingTasks.pipe(
                Xe((n) => (n ? V(!1) : this.zoneIsStable)),
                (function cI(e, t = or) {
                  return (
                    (e = e ?? dI),
                    Ne((r, n) => {
                      let i,
                        s = !0;
                      r.subscribe(
                        Oe(n, (o) => {
                          const a = t(o);
                          (s || !e(i, a)) && ((s = !1), (i = a), n.next(o));
                        })
                      );
                    })
                  );
                })(),
                Yg()
              )),
              (this._injector = P(Ft));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, i) {
            const s = n instanceof Ny;
            if (!this._injector.get(oh).done)
              throw (
                (!s &&
                  (function gi(e) {
                    const t = ne(e) || qe(e) || ot(e);
                    return null !== t && t.standalone;
                  })(n),
                new C(405, !1))
              );
            let a;
            (a = s ? n : this._injector.get(ml).resolveComponentFactory(n)),
              this.componentTypes.push(a.componentType);
            const l = (function CF(e) {
                return e.isBoundToModule;
              })(a)
                ? void 0
                : this._injector.get(Kr),
              c = a.create(kt.NULL, [], i || a.selector, l),
              d = c.location.nativeElement,
              f = c.injector.get(pw, null);
            return (
              f?.registerApplication(d),
              c.onDestroy(() => {
                this.detachView(c.hostView),
                  Ul(this.components, c),
                  f?.unregisterApplication(d);
              }),
              this._loadComponent(c),
              c
            );
          }
          tick() {
            if (this._runningTick) throw new C(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this.internalErrorHandler(n);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const i = n;
            this._views.push(i), i.attachToAppRef(this);
          }
          detachView(n) {
            const i = n;
            Ul(this._views, i), i.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const i = this._injector.get(hh, []);
            i.push(...this._bootstrapListeners), i.forEach((s) => s(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => Ul(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new C(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function Ul(e, t) {
        const r = e.indexOf(t);
        r > -1 && e.splice(r, 1);
      }
      const Mw = new O("", {
        providedIn: "root",
        factory: () => P(bn).handleError.bind(void 0),
      });
      function MF() {
        const e = P(ue),
          t = P(bn);
        return (r) => e.runOutsideAngular(() => t.handleError(r));
      }
      let IF = (() => {
        var e;
        class t {
          constructor() {
            (this.zone = P(ue)), (this.applicationRef = P(Zr));
          }
          initialize() {
            this._onMicrotaskEmptySubscription ||
              (this._onMicrotaskEmptySubscription =
                this.zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this.zone.run(() => {
                      this.applicationRef.tick();
                    });
                  },
                }));
          }
          ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      let Io = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = NF), t;
      })();
      function NF(e) {
        return (function RF(e, t, r) {
          if (Vr(e) && !r) {
            const n = Ot(e.index, t);
            return new uo(n, n);
          }
          return 47 & e.type ? new uo(t[Fe], t) : null;
        })(Qe(), b(), 16 == (16 & e));
      }
      class Rw {
        constructor() {}
        supports(t) {
          return bl(t);
        }
        create(t) {
          return new LF(t);
        }
      }
      const kF = (e, t) => t;
      class LF {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || kF);
        }
        forEachItem(t) {
          let r;
          for (r = this._itHead; null !== r; r = r._next) t(r);
        }
        forEachOperation(t) {
          let r = this._itHead,
            n = this._removalsHead,
            i = 0,
            s = null;
          for (; r || n; ) {
            const o = !n || (r && r.currentIndex < Ow(n, i, s)) ? r : n,
              a = Ow(o, i, s),
              l = o.currentIndex;
            if (o === n) i--, (n = n._nextRemoved);
            else if (((r = r._next), null == o.previousIndex)) i++;
            else {
              s || (s = []);
              const u = a - i,
                c = l - i;
              if (u != c) {
                for (let f = 0; f < u; f++) {
                  const h = f < s.length ? s[f] : (s[f] = 0),
                    g = h + f;
                  c <= g && g < u && (s[f] = h + 1);
                }
                s[o.previousIndex] = c - u;
              }
            }
            a !== l && t(o, a, l);
          }
        }
        forEachPreviousItem(t) {
          let r;
          for (r = this._previousItHead; null !== r; r = r._nextPrevious) t(r);
        }
        forEachAddedItem(t) {
          let r;
          for (r = this._additionsHead; null !== r; r = r._nextAdded) t(r);
        }
        forEachMovedItem(t) {
          let r;
          for (r = this._movesHead; null !== r; r = r._nextMoved) t(r);
        }
        forEachRemovedItem(t) {
          let r;
          for (r = this._removalsHead; null !== r; r = r._nextRemoved) t(r);
        }
        forEachIdentityChange(t) {
          let r;
          for (
            r = this._identityChangesHead;
            null !== r;
            r = r._nextIdentityChange
          )
            t(r);
        }
        diff(t) {
          if ((null == t && (t = []), !bl(t))) throw new C(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let i,
            s,
            o,
            r = this._itHead,
            n = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (s = t[a]),
                (o = this._trackByFn(a, s)),
                null !== r && Object.is(r.trackById, o)
                  ? (n && (r = this._verifyReinsertion(r, s, o, a)),
                    Object.is(r.item, s) || this._addIdentityChange(r, s))
                  : ((r = this._mismatch(r, s, o, a)), (n = !0)),
                (r = r._next);
          } else
            (i = 0),
              (function yR(e, t) {
                if (Array.isArray(e))
                  for (let r = 0; r < e.length; r++) t(e[r]);
                else {
                  const r = e[Symbol.iterator]();
                  let n;
                  for (; !(n = r.next()).done; ) t(n.value);
                }
              })(t, (a) => {
                (o = this._trackByFn(i, a)),
                  null !== r && Object.is(r.trackById, o)
                    ? (n && (r = this._verifyReinsertion(r, a, o, i)),
                      Object.is(r.item, a) || this._addIdentityChange(r, a))
                    : ((r = this._mismatch(r, a, o, i)), (n = !0)),
                  (r = r._next),
                  i++;
              }),
              (this.length = i);
          return this._truncate(r), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, r, n, i) {
          let s;
          return (
            null === t ? (s = this._itTail) : ((s = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(n, null))
              ? (Object.is(t.item, r) || this._addIdentityChange(t, r),
                this._reinsertAfter(t, s, i))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(n, i))
              ? (Object.is(t.item, r) || this._addIdentityChange(t, r),
                this._moveAfter(t, s, i))
              : (t = this._addAfter(new VF(r, n), s, i)),
            t
          );
        }
        _verifyReinsertion(t, r, n, i) {
          let s =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(n, null);
          return (
            null !== s
              ? (t = this._reinsertAfter(s, t._prev, i))
              : t.currentIndex != i &&
                ((t.currentIndex = i), this._addToMoves(t, i)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const r = t._next;
            this._addToRemovals(this._unlink(t)), (t = r);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, r, n) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const i = t._prevRemoved,
            s = t._nextRemoved;
          return (
            null === i ? (this._removalsHead = s) : (i._nextRemoved = s),
            null === s ? (this._removalsTail = i) : (s._prevRemoved = i),
            this._insertAfter(t, r, n),
            this._addToMoves(t, n),
            t
          );
        }
        _moveAfter(t, r, n) {
          return (
            this._unlink(t),
            this._insertAfter(t, r, n),
            this._addToMoves(t, n),
            t
          );
        }
        _addAfter(t, r, n) {
          return (
            this._insertAfter(t, r, n),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, r, n) {
          const i = null === r ? this._itHead : r._next;
          return (
            (t._next = i),
            (t._prev = r),
            null === i ? (this._itTail = t) : (i._prev = t),
            null === r ? (this._itHead = t) : (r._next = t),
            null === this._linkedRecords && (this._linkedRecords = new Pw()),
            this._linkedRecords.put(t),
            (t.currentIndex = n),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const r = t._prev,
            n = t._next;
          return (
            null === r ? (this._itHead = n) : (r._next = n),
            null === n ? (this._itTail = r) : (n._prev = r),
            t
          );
        }
        _addToMoves(t, r) {
          return (
            t.previousIndex === r ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new Pw()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, r) {
          return (
            (t.item = r),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class VF {
        constructor(t, r) {
          (this.item = t),
            (this.trackById = r),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class jF {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, r) {
          let n;
          for (n = this._head; null !== n; n = n._nextDup)
            if (
              (null === r || r <= n.currentIndex) &&
              Object.is(n.trackById, t)
            )
              return n;
          return null;
        }
        remove(t) {
          const r = t._prevDup,
            n = t._nextDup;
          return (
            null === r ? (this._head = n) : (r._nextDup = n),
            null === n ? (this._tail = r) : (n._prevDup = r),
            null === this._head
          );
        }
      }
      class Pw {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const r = t.trackById;
          let n = this.map.get(r);
          n || ((n = new jF()), this.map.set(r, n)), n.add(t);
        }
        get(t, r) {
          const i = this.map.get(t);
          return i ? i.get(t, r) : null;
        }
        remove(t) {
          const r = t.trackById;
          return this.map.get(r).remove(t) && this.map.delete(r), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function Ow(e, t, r) {
        const n = e.previousIndex;
        if (null === n) return n;
        let i = 0;
        return r && n < r.length && (i = r[n]), n + t + i;
      }
      class xw {
        constructor() {}
        supports(t) {
          return t instanceof Map || _f(t);
        }
        create() {
          return new $F();
        }
      }
      class $F {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._changesHead ||
            null !== this._removalsHead
          );
        }
        forEachItem(t) {
          let r;
          for (r = this._mapHead; null !== r; r = r._next) t(r);
        }
        forEachPreviousItem(t) {
          let r;
          for (r = this._previousMapHead; null !== r; r = r._nextPrevious) t(r);
        }
        forEachChangedItem(t) {
          let r;
          for (r = this._changesHead; null !== r; r = r._nextChanged) t(r);
        }
        forEachAddedItem(t) {
          let r;
          for (r = this._additionsHead; null !== r; r = r._nextAdded) t(r);
        }
        forEachRemovedItem(t) {
          let r;
          for (r = this._removalsHead; null !== r; r = r._nextRemoved) t(r);
        }
        diff(t) {
          if (t) {
            if (!(t instanceof Map || _f(t))) throw new C(900, !1);
          } else t = new Map();
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let r = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(t, (n, i) => {
              if (r && r.key === i)
                this._maybeAddToChanges(r, n),
                  (this._appendAfter = r),
                  (r = r._next);
              else {
                const s = this._getOrCreateRecordForKey(i, n);
                r = this._insertBeforeOrAppend(r, s);
              }
            }),
            r)
          ) {
            r._prev && (r._prev._next = null), (this._removalsHead = r);
            for (let n = r; null !== n; n = n._nextRemoved)
              n === this._mapHead && (this._mapHead = null),
                this._records.delete(n.key),
                (n._nextRemoved = n._next),
                (n.previousValue = n.currentValue),
                (n.currentValue = null),
                (n._prev = null),
                (n._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(t, r) {
          if (t) {
            const n = t._prev;
            return (
              (r._next = t),
              (r._prev = n),
              (t._prev = r),
              n && (n._next = r),
              t === this._mapHead && (this._mapHead = r),
              (this._appendAfter = t),
              t
            );
          }
          return (
            this._appendAfter
              ? ((this._appendAfter._next = r), (r._prev = this._appendAfter))
              : (this._mapHead = r),
            (this._appendAfter = r),
            null
          );
        }
        _getOrCreateRecordForKey(t, r) {
          if (this._records.has(t)) {
            const i = this._records.get(t);
            this._maybeAddToChanges(i, r);
            const s = i._prev,
              o = i._next;
            return (
              s && (s._next = o),
              o && (o._prev = s),
              (i._next = null),
              (i._prev = null),
              i
            );
          }
          const n = new BF(t);
          return (
            this._records.set(t, n),
            (n.currentValue = r),
            this._addToAdditions(n),
            n
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              this._previousMapHead = this._mapHead, t = this._previousMapHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._changesHead; null !== t; t = t._nextChanged)
              t.previousValue = t.currentValue;
            for (t = this._additionsHead; null != t; t = t._nextAdded)
              t.previousValue = t.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(t, r) {
          Object.is(r, t.currentValue) ||
            ((t.previousValue = t.currentValue),
            (t.currentValue = r),
            this._addToChanges(t));
        }
        _addToAdditions(t) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = t)
            : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
        }
        _addToChanges(t) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = t)
            : ((this._changesTail._nextChanged = t), (this._changesTail = t));
        }
        _forEach(t, r) {
          t instanceof Map
            ? t.forEach(r)
            : Object.keys(t).forEach((n) => r(t[n], n));
        }
      }
      class BF {
        constructor(t) {
          (this.key = t),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function Fw() {
        return new Gl([new Rw()]);
      }
      let Gl = (() => {
        var e;
        class t {
          constructor(n) {
            this.factories = n;
          }
          static create(n, i) {
            if (null != i) {
              const s = i.factories.slice();
              n = n.concat(s);
            }
            return new t(n);
          }
          static extend(n) {
            return {
              provide: t,
              useFactory: (i) => t.create(n, i || Fw()),
              deps: [[t, new Ua(), new Ha()]],
            };
          }
          find(n) {
            const i = this.factories.find((s) => s.supports(n));
            if (null != i) return i;
            throw new C(901, !1);
          }
        }
        return (
          ((e = t).ɵprov = R({ token: e, providedIn: "root", factory: Fw })), t
        );
      })();
      function kw() {
        return new To([new xw()]);
      }
      let To = (() => {
        var e;
        class t {
          constructor(n) {
            this.factories = n;
          }
          static create(n, i) {
            if (i) {
              const s = i.factories.slice();
              n = n.concat(s);
            }
            return new t(n);
          }
          static extend(n) {
            return {
              provide: t,
              useFactory: (i) => t.create(n, i || kw()),
              deps: [[t, new Ua(), new Ha()]],
            };
          }
          find(n) {
            const i = this.factories.find((s) => s.supports(n));
            if (i) return i;
            throw new C(901, !1);
          }
        }
        return (
          ((e = t).ɵprov = R({ token: e, providedIn: "root", factory: kw })), t
        );
      })();
      const zF = _w(null, "core", []);
      let qF = (() => {
        var e;
        class t {
          constructor(n) {}
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(Zr));
          }),
          (e.ɵmod = Nt({ type: e })),
          (e.ɵinj = yt({})),
          t
        );
      })();
      function os(e) {
        return "boolean" == typeof e ? e : null != e && "false" !== e;
      }
      let Dh = null;
      function Dr() {
        return Dh;
      }
      class sk {}
      const pt = new O("DocumentToken");
      let Ch = (() => {
        var e;
        class t {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return P(ak);
            },
            providedIn: "platform",
          })),
          t
        );
      })();
      const ok = new O("Location Initialized");
      let ak = (() => {
        var e;
        class t extends Ch {
          constructor() {
            super(),
              (this._doc = P(pt)),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Dr().getBaseHref(this._doc);
          }
          onPopState(n) {
            const i = Dr().getGlobalEventTarget(this._doc, "window");
            return (
              i.addEventListener("popstate", n, !1),
              () => i.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const i = Dr().getGlobalEventTarget(this._doc, "window");
            return (
              i.addEventListener("hashchange", n, !1),
              () => i.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(n) {
            this._location.pathname = n;
          }
          pushState(n, i, s) {
            this._history.pushState(n, i, s);
          }
          replaceState(n, i, s) {
            this._history.replaceState(n, i, s);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return new e();
            },
            providedIn: "platform",
          })),
          t
        );
      })();
      function wh(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let r = 0;
        return (
          e.endsWith("/") && r++,
          t.startsWith("/") && r++,
          2 == r ? e + t.substring(1) : 1 == r ? e + t : e + "/" + t
        );
      }
      function qw(e) {
        const t = e.match(/#|\?|$/),
          r = (t && t.index) || e.length;
        return e.slice(0, r - ("/" === e[r - 1] ? 1 : 0)) + e.slice(r);
      }
      function Yn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let Xr = (() => {
        var e;
        class t {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return P(Ww);
            },
            providedIn: "root",
          })),
          t
        );
      })();
      const Gw = new O("appBaseHref");
      let Ww = (() => {
          var e;
          class t extends Xr {
            constructor(n, i) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  i ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  P(pt).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return wh(this._baseHref, n);
            }
            path(n = !1) {
              const i =
                  this._platformLocation.pathname +
                  Yn(this._platformLocation.search),
                s = this._platformLocation.hash;
              return s && n ? `${i}${s}` : i;
            }
            pushState(n, i, s, o) {
              const a = this.prepareExternalUrl(s + Yn(o));
              this._platformLocation.pushState(n, i, a);
            }
            replaceState(n, i, s, o) {
              const a = this.prepareExternalUrl(s + Yn(o));
              this._platformLocation.replaceState(n, i, a);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(M(Ch), M(Gw, 8));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        lk = (() => {
          var e;
          class t extends Xr {
            constructor(n, i) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != i && (this._baseHref = i);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let i = this._platformLocation.hash;
              return null == i && (i = "#"), i.length > 0 ? i.substring(1) : i;
            }
            prepareExternalUrl(n) {
              const i = wh(this._baseHref, n);
              return i.length > 0 ? "#" + i : i;
            }
            pushState(n, i, s, o) {
              let a = this.prepareExternalUrl(s + Yn(o));
              0 == a.length && (a = this._platformLocation.pathname),
                this._platformLocation.pushState(n, i, a);
            }
            replaceState(n, i, s, o) {
              let a = this.prepareExternalUrl(s + Yn(o));
              0 == a.length && (a = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, i, a);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(M(Ch), M(Gw, 8));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        Eh = (() => {
          var e;
          class t {
            constructor(n) {
              (this._subject = new ve()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const i = this._locationStrategy.getBaseHref();
              (this._basePath = (function dk(e) {
                if (new RegExp("^(https?:)?//").test(e)) {
                  const [, r] = e.split(/\/\/[^\/]+/);
                  return r;
                }
                return e;
              })(qw(Qw(i)))),
                this._locationStrategy.onPopState((s) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: s.state,
                    type: s.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, i = "") {
              return this.path() == this.normalize(n + Yn(i));
            }
            normalize(n) {
              return t.stripTrailingSlash(
                (function ck(e, t) {
                  if (!e || !t.startsWith(e)) return t;
                  const r = t.substring(e.length);
                  return "" === r || ["/", ";", "?", "#"].includes(r[0])
                    ? r
                    : t;
                })(this._basePath, Qw(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, i = "", s = null) {
              this._locationStrategy.pushState(s, "", n, i),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + Yn(i)),
                  s
                );
            }
            replaceState(n, i = "", s = null) {
              this._locationStrategy.replaceState(s, "", n, i),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + Yn(i)),
                  s
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((i) => {
                    this._notifyUrlChangeListeners(i.url, i.state);
                  })),
                () => {
                  const i = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(i, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", i) {
              this._urlChangeListeners.forEach((s) => s(n, i));
            }
            subscribe(n, i, s) {
              return this._subject.subscribe({
                next: n,
                error: i,
                complete: s,
              });
            }
          }
          return (
            ((e = t).normalizeQueryParams = Yn),
            (e.joinWithSlash = wh),
            (e.stripTrailingSlash = qw),
            (e.ɵfac = function (n) {
              return new (n || e)(M(Xr));
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return (function uk() {
                  return new Eh(M(Xr));
                })();
              },
              providedIn: "root",
            })),
            t
          );
        })();
      function Qw(e) {
        return e.replace(/\/index.html$/, "");
      }
      const Kw = {
        ADP: [void 0, void 0, 0],
        AFN: [void 0, "\u060b", 0],
        ALL: [void 0, void 0, 0],
        AMD: [void 0, "\u058f", 2],
        AOA: [void 0, "Kz"],
        ARS: [void 0, "$"],
        AUD: ["A$", "$"],
        AZN: [void 0, "\u20bc"],
        BAM: [void 0, "KM"],
        BBD: [void 0, "$"],
        BDT: [void 0, "\u09f3"],
        BHD: [void 0, void 0, 3],
        BIF: [void 0, void 0, 0],
        BMD: [void 0, "$"],
        BND: [void 0, "$"],
        BOB: [void 0, "Bs"],
        BRL: ["R$"],
        BSD: [void 0, "$"],
        BWP: [void 0, "P"],
        BYN: [void 0, void 0, 2],
        BYR: [void 0, void 0, 0],
        BZD: [void 0, "$"],
        CAD: ["CA$", "$", 2],
        CHF: [void 0, void 0, 2],
        CLF: [void 0, void 0, 4],
        CLP: [void 0, "$", 0],
        CNY: ["CN\xa5", "\xa5"],
        COP: [void 0, "$", 2],
        CRC: [void 0, "\u20a1", 2],
        CUC: [void 0, "$"],
        CUP: [void 0, "$"],
        CZK: [void 0, "K\u010d", 2],
        DJF: [void 0, void 0, 0],
        DKK: [void 0, "kr", 2],
        DOP: [void 0, "$"],
        EGP: [void 0, "E\xa3"],
        ESP: [void 0, "\u20a7", 0],
        EUR: ["\u20ac"],
        FJD: [void 0, "$"],
        FKP: [void 0, "\xa3"],
        GBP: ["\xa3"],
        GEL: [void 0, "\u20be"],
        GHS: [void 0, "GH\u20b5"],
        GIP: [void 0, "\xa3"],
        GNF: [void 0, "FG", 0],
        GTQ: [void 0, "Q"],
        GYD: [void 0, "$", 2],
        HKD: ["HK$", "$"],
        HNL: [void 0, "L"],
        HRK: [void 0, "kn"],
        HUF: [void 0, "Ft", 2],
        IDR: [void 0, "Rp", 2],
        ILS: ["\u20aa"],
        INR: ["\u20b9"],
        IQD: [void 0, void 0, 0],
        IRR: [void 0, void 0, 0],
        ISK: [void 0, "kr", 0],
        ITL: [void 0, void 0, 0],
        JMD: [void 0, "$"],
        JOD: [void 0, void 0, 3],
        JPY: ["\xa5", void 0, 0],
        KHR: [void 0, "\u17db"],
        KMF: [void 0, "CF", 0],
        KPW: [void 0, "\u20a9", 0],
        KRW: ["\u20a9", void 0, 0],
        KWD: [void 0, void 0, 3],
        KYD: [void 0, "$"],
        KZT: [void 0, "\u20b8"],
        LAK: [void 0, "\u20ad", 0],
        LBP: [void 0, "L\xa3", 0],
        LKR: [void 0, "Rs"],
        LRD: [void 0, "$"],
        LTL: [void 0, "Lt"],
        LUF: [void 0, void 0, 0],
        LVL: [void 0, "Ls"],
        LYD: [void 0, void 0, 3],
        MGA: [void 0, "Ar", 0],
        MGF: [void 0, void 0, 0],
        MMK: [void 0, "K", 0],
        MNT: [void 0, "\u20ae", 2],
        MRO: [void 0, void 0, 0],
        MUR: [void 0, "Rs", 2],
        MXN: ["MX$", "$"],
        MYR: [void 0, "RM"],
        NAD: [void 0, "$"],
        NGN: [void 0, "\u20a6"],
        NIO: [void 0, "C$"],
        NOK: [void 0, "kr", 2],
        NPR: [void 0, "Rs"],
        NZD: ["NZ$", "$"],
        OMR: [void 0, void 0, 3],
        PHP: ["\u20b1"],
        PKR: [void 0, "Rs", 2],
        PLN: [void 0, "z\u0142"],
        PYG: [void 0, "\u20b2", 0],
        RON: [void 0, "lei"],
        RSD: [void 0, void 0, 0],
        RUB: [void 0, "\u20bd"],
        RWF: [void 0, "RF", 0],
        SBD: [void 0, "$"],
        SEK: [void 0, "kr", 2],
        SGD: [void 0, "$"],
        SHP: [void 0, "\xa3"],
        SLE: [void 0, void 0, 2],
        SLL: [void 0, void 0, 0],
        SOS: [void 0, void 0, 0],
        SRD: [void 0, "$"],
        SSP: [void 0, "\xa3"],
        STD: [void 0, void 0, 0],
        STN: [void 0, "Db"],
        SYP: [void 0, "\xa3", 0],
        THB: [void 0, "\u0e3f"],
        TMM: [void 0, void 0, 0],
        TND: [void 0, void 0, 3],
        TOP: [void 0, "T$"],
        TRL: [void 0, void 0, 0],
        TRY: [void 0, "\u20ba"],
        TTD: [void 0, "$"],
        TWD: ["NT$", "$", 2],
        TZS: [void 0, void 0, 2],
        UAH: [void 0, "\u20b4"],
        UGX: [void 0, void 0, 0],
        USD: ["$"],
        UYI: [void 0, void 0, 0],
        UYU: [void 0, "$"],
        UYW: [void 0, void 0, 4],
        UZS: [void 0, void 0, 2],
        VEF: [void 0, "Bs", 2],
        VND: ["\u20ab", void 0, 0],
        VUV: [void 0, void 0, 0],
        XAF: ["FCFA", void 0, 0],
        XCD: ["EC$", "$"],
        XOF: ["F\u202fCFA", void 0, 0],
        XPF: ["CFPF", void 0, 0],
        XXX: ["\xa4"],
        YER: [void 0, void 0, 0],
        ZAR: [void 0, "R"],
        ZMK: [void 0, void 0, 0],
        ZMW: [void 0, "ZK"],
        ZWD: [void 0, void 0, 0],
      };
      var Ql = (function (e) {
          return (
            (e[(e.Decimal = 0)] = "Decimal"),
            (e[(e.Percent = 1)] = "Percent"),
            (e[(e.Currency = 2)] = "Currency"),
            (e[(e.Scientific = 3)] = "Scientific"),
            e
          );
        })(Ql || {}),
        ke = (function (e) {
          return (
            (e[(e.Decimal = 0)] = "Decimal"),
            (e[(e.Group = 1)] = "Group"),
            (e[(e.List = 2)] = "List"),
            (e[(e.PercentSign = 3)] = "PercentSign"),
            (e[(e.PlusSign = 4)] = "PlusSign"),
            (e[(e.MinusSign = 5)] = "MinusSign"),
            (e[(e.Exponential = 6)] = "Exponential"),
            (e[(e.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
            (e[(e.PerMille = 8)] = "PerMille"),
            (e[(e.Infinity = 9)] = "Infinity"),
            (e[(e.NaN = 10)] = "NaN"),
            (e[(e.TimeSeparator = 11)] = "TimeSeparator"),
            (e[(e.CurrencyDecimal = 12)] = "CurrencyDecimal"),
            (e[(e.CurrencyGroup = 13)] = "CurrencyGroup"),
            e
          );
        })(ke || {});
      function Kt(e, t) {
        const r = ft(e),
          n = r[we.NumberSymbols][t];
        if (typeof n > "u") {
          if (t === ke.CurrencyDecimal) return r[we.NumberSymbols][ke.Decimal];
          if (t === ke.CurrencyGroup) return r[we.NumberSymbols][ke.Group];
        }
        return n;
      }
      const Vk = /^(\d+)?\.((\d+)(-(\d+))?)?$/,
        eE = 22,
        ru = ".",
        No = "0",
        jk = ";",
        $k = ",",
        Th = "#";
      function Hk(e, t, r, n, i) {
        const o = (function Nh(e, t = "-") {
          const r = {
              minInt: 1,
              minFrac: 0,
              maxFrac: 0,
              posPre: "",
              posSuf: "",
              negPre: "",
              negSuf: "",
              gSize: 0,
              lgSize: 0,
            },
            n = e.split(jk),
            i = n[0],
            s = n[1],
            o =
              -1 !== i.indexOf(ru)
                ? i.split(ru)
                : [
                    i.substring(0, i.lastIndexOf(No) + 1),
                    i.substring(i.lastIndexOf(No) + 1),
                  ],
            a = o[0],
            l = o[1] || "";
          r.posPre = a.substring(0, a.indexOf(Th));
          for (let c = 0; c < l.length; c++) {
            const d = l.charAt(c);
            d === No
              ? (r.minFrac = r.maxFrac = c + 1)
              : d === Th
              ? (r.maxFrac = c + 1)
              : (r.posSuf += d);
          }
          const u = a.split($k);
          if (
            ((r.gSize = u[1] ? u[1].length : 0),
            (r.lgSize = u[2] || u[1] ? (u[2] || u[1]).length : 0),
            s)
          ) {
            const c = i.length - r.posPre.length - r.posSuf.length,
              d = s.indexOf(Th);
            (r.negPre = s.substring(0, d).replace(/'/g, "")),
              (r.negSuf = s.slice(d + c).replace(/'/g, ""));
          } else (r.negPre = t + r.posPre), (r.negSuf = r.posSuf);
          return r;
        })(
          (function bh(e, t) {
            return ft(e)[we.NumberFormats][t];
          })(t, Ql.Currency),
          Kt(t, ke.MinusSign)
        );
        return (
          (o.minFrac = (function bk(e) {
            let t;
            const r = Kw[e];
            return r && (t = r[2]), "number" == typeof t ? t : 2;
          })(n)),
          (o.maxFrac = o.minFrac),
          (function Ah(e, t, r, n, i, s, o = !1) {
            let a = "",
              l = !1;
            if (isFinite(e)) {
              let u = (function Gk(e) {
                let n,
                  i,
                  s,
                  o,
                  a,
                  t = Math.abs(e) + "",
                  r = 0;
                for (
                  (i = t.indexOf(ru)) > -1 && (t = t.replace(ru, "")),
                    (s = t.search(/e/i)) > 0
                      ? (i < 0 && (i = s),
                        (i += +t.slice(s + 1)),
                        (t = t.substring(0, s)))
                      : i < 0 && (i = t.length),
                    s = 0;
                  t.charAt(s) === No;
                  s++
                );
                if (s === (a = t.length)) (n = [0]), (i = 1);
                else {
                  for (a--; t.charAt(a) === No; ) a--;
                  for (i -= s, n = [], o = 0; s <= a; s++, o++)
                    n[o] = Number(t.charAt(s));
                }
                return (
                  i > eE && ((n = n.splice(0, eE - 1)), (r = i - 1), (i = 1)),
                  { digits: n, exponent: r, integerLen: i }
                );
              })(e);
              o &&
                (u = (function qk(e) {
                  if (0 === e.digits[0]) return e;
                  const t = e.digits.length - e.integerLen;
                  return (
                    e.exponent
                      ? (e.exponent += 2)
                      : (0 === t
                          ? e.digits.push(0, 0)
                          : 1 === t && e.digits.push(0),
                        (e.integerLen += 2)),
                    e
                  );
                })(u));
              let c = t.minInt,
                d = t.minFrac,
                f = t.maxFrac;
              if (s) {
                const v = s.match(Vk);
                if (null === v)
                  throw new Error(`${s} is not a valid digit info`);
                const A = v[1],
                  I = v[3],
                  U = v[5];
                null != A && (c = Rh(A)),
                  null != I && (d = Rh(I)),
                  null != U ? (f = Rh(U)) : null != I && d > f && (f = d);
              }
              !(function Wk(e, t, r) {
                if (t > r)
                  throw new Error(
                    `The minimum number of digits after fraction (${t}) is higher than the maximum (${r}).`
                  );
                let n = e.digits,
                  i = n.length - e.integerLen;
                const s = Math.min(Math.max(t, i), r);
                let o = s + e.integerLen,
                  a = n[o];
                if (o > 0) {
                  n.splice(Math.max(e.integerLen, o));
                  for (let d = o; d < n.length; d++) n[d] = 0;
                } else {
                  (i = Math.max(0, i)),
                    (e.integerLen = 1),
                    (n.length = Math.max(1, (o = s + 1))),
                    (n[0] = 0);
                  for (let d = 1; d < o; d++) n[d] = 0;
                }
                if (a >= 5)
                  if (o - 1 < 0) {
                    for (let d = 0; d > o; d--) n.unshift(0), e.integerLen++;
                    n.unshift(1), e.integerLen++;
                  } else n[o - 1]++;
                for (; i < Math.max(0, s); i++) n.push(0);
                let l = 0 !== s;
                const u = t + e.integerLen,
                  c = n.reduceRight(function (d, f, h, g) {
                    return (
                      (g[h] = (f += d) < 10 ? f : f - 10),
                      l && (0 === g[h] && h >= u ? g.pop() : (l = !1)),
                      f >= 10 ? 1 : 0
                    );
                  }, 0);
                c && (n.unshift(c), e.integerLen++);
              })(u, d, f);
              let h = u.digits,
                g = u.integerLen;
              const m = u.exponent;
              let y = [];
              for (l = h.every((v) => !v); g < c; g++) h.unshift(0);
              for (; g < 0; g++) h.unshift(0);
              g > 0 ? (y = h.splice(g, h.length)) : ((y = h), (h = [0]));
              const D = [];
              for (
                h.length >= t.lgSize &&
                D.unshift(h.splice(-t.lgSize, h.length).join(""));
                h.length > t.gSize;

              )
                D.unshift(h.splice(-t.gSize, h.length).join(""));
              h.length && D.unshift(h.join("")),
                (a = D.join(Kt(r, n))),
                y.length && (a += Kt(r, i) + y.join("")),
                m && (a += Kt(r, ke.Exponential) + "+" + m);
            } else a = Kt(r, ke.Infinity);
            return (
              (a =
                e < 0 && !l
                  ? t.negPre + a + t.negSuf
                  : t.posPre + a + t.posSuf),
              a
            );
          })(e, o, t, ke.CurrencyGroup, ke.CurrencyDecimal, i)
            .replace("\xa4", r)
            .replace("\xa4", "")
            .trim()
        );
      }
      function Rh(e) {
        const t = parseInt(e);
        if (isNaN(t))
          throw new Error("Invalid integer literal when parsing " + e);
        return t;
      }
      function rE(e, t) {
        t = encodeURIComponent(t);
        for (const r of e.split(";")) {
          const n = r.indexOf("="),
            [i, s] = -1 == n ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
          if (i.trim() === t) return decodeURIComponent(s);
        }
        return null;
      }
      const Oh = /\s+/,
        iE = [];
      let xh = (() => {
        var e;
        class t {
          constructor(n, i, s, o) {
            (this._iterableDiffers = n),
              (this._keyValueDiffers = i),
              (this._ngEl = s),
              (this._renderer = o),
              (this.initialClasses = iE),
              (this.stateMap = new Map());
          }
          set klass(n) {
            this.initialClasses = null != n ? n.trim().split(Oh) : iE;
          }
          set ngClass(n) {
            this.rawClass = "string" == typeof n ? n.trim().split(Oh) : n;
          }
          ngDoCheck() {
            for (const i of this.initialClasses) this._updateState(i, !0);
            const n = this.rawClass;
            if (Array.isArray(n) || n instanceof Set)
              for (const i of n) this._updateState(i, !0);
            else if (null != n)
              for (const i of Object.keys(n)) this._updateState(i, !!n[i]);
            this._applyStateDiff();
          }
          _updateState(n, i) {
            const s = this.stateMap.get(n);
            void 0 !== s
              ? (s.enabled !== i && ((s.changed = !0), (s.enabled = i)),
                (s.touched = !0))
              : this.stateMap.set(n, { enabled: i, changed: !0, touched: !0 });
          }
          _applyStateDiff() {
            for (const n of this.stateMap) {
              const i = n[0],
                s = n[1];
              s.changed
                ? (this._toggleClass(i, s.enabled), (s.changed = !1))
                : s.touched ||
                  (s.enabled && this._toggleClass(i, !1),
                  this.stateMap.delete(i)),
                (s.touched = !1);
            }
          }
          _toggleClass(n, i) {
            (n = n.trim()).length > 0 &&
              n.split(Oh).forEach((s) => {
                i
                  ? this._renderer.addClass(this._ngEl.nativeElement, s)
                  : this._renderer.removeClass(this._ngEl.nativeElement, s);
              });
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(Gl), _(To), _(dt), _(En));
          }),
          (e.ɵdir = B({
            type: e,
            selectors: [["", "ngClass", ""]],
            inputs: { klass: ["class", "klass"], ngClass: "ngClass" },
            standalone: !0,
          })),
          t
        );
      })();
      class Zk {
        constructor(t, r, n, i) {
          (this.$implicit = t),
            (this.ngForOf = r),
            (this.index = n),
            (this.count = i);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let Rn = (() => {
        var e;
        class t {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, i, s) {
            (this._viewContainer = n),
              (this._template = i),
              (this._differs = s),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const i = this._viewContainer;
            n.forEachOperation((s, o, a) => {
              if (null == s.previousIndex)
                i.createEmbeddedView(
                  this._template,
                  new Zk(s.item, this._ngForOf, -1, -1),
                  null === a ? void 0 : a
                );
              else if (null == a) i.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const l = i.get(o);
                i.move(l, a), oE(l, s);
              }
            });
            for (let s = 0, o = i.length; s < o; s++) {
              const l = i.get(s).context;
              (l.index = s), (l.count = o), (l.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((s) => {
              oE(i.get(s.currentIndex), s);
            });
          }
          static ngTemplateContextGuard(n, i) {
            return !0;
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(ln), _(Nn), _(Gl));
          }),
          (e.ɵdir = B({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          t
        );
      })();
      function oE(e, t) {
        e.context.$implicit = t.item;
      }
      let Cr = (() => {
        var e;
        class t {
          constructor(n, i) {
            (this._viewContainer = n),
              (this._context = new Yk()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = i);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            aE("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            aE("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, i) {
            return !0;
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(ln), _(Nn));
          }),
          (e.ɵdir = B({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          t
        );
      })();
      class Yk {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function aE(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${$e(t)}'.`
          );
      }
      let uE = (() => {
          var e;
          class t {
            constructor(n, i, s) {
              (this._ngEl = n),
                (this._differs = i),
                (this._renderer = s),
                (this._ngStyle = null),
                (this._differ = null);
            }
            set ngStyle(n) {
              (this._ngStyle = n),
                !this._differ &&
                  n &&
                  (this._differ = this._differs.find(n).create());
            }
            ngDoCheck() {
              if (this._differ) {
                const n = this._differ.diff(this._ngStyle);
                n && this._applyChanges(n);
              }
            }
            _setStyle(n, i) {
              const [s, o] = n.split("."),
                a = -1 === s.indexOf("-") ? void 0 : pr.DashCase;
              null != i
                ? this._renderer.setStyle(
                    this._ngEl.nativeElement,
                    s,
                    o ? `${i}${o}` : i,
                    a
                  )
                : this._renderer.removeStyle(this._ngEl.nativeElement, s, a);
            }
            _applyChanges(n) {
              n.forEachRemovedItem((i) => this._setStyle(i.key, null)),
                n.forEachAddedItem((i) =>
                  this._setStyle(i.key, i.currentValue)
                ),
                n.forEachChangedItem((i) =>
                  this._setStyle(i.key, i.currentValue)
                );
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(_(dt), _(To), _(En));
            }),
            (e.ɵdir = B({
              type: e,
              selectors: [["", "ngStyle", ""]],
              inputs: { ngStyle: "ngStyle" },
              standalone: !0,
            })),
            t
          );
        })(),
        cE = (() => {
          var e;
          class t {
            constructor(n) {
              (this._viewContainerRef = n),
                (this._viewRef = null),
                (this.ngTemplateOutletContext = null),
                (this.ngTemplateOutlet = null),
                (this.ngTemplateOutletInjector = null);
            }
            ngOnChanges(n) {
              if (n.ngTemplateOutlet || n.ngTemplateOutletInjector) {
                const i = this._viewContainerRef;
                if (
                  (this._viewRef && i.remove(i.indexOf(this._viewRef)),
                  this.ngTemplateOutlet)
                ) {
                  const {
                    ngTemplateOutlet: s,
                    ngTemplateOutletContext: o,
                    ngTemplateOutletInjector: a,
                  } = this;
                  this._viewRef = i.createEmbeddedView(
                    s,
                    o,
                    a ? { injector: a } : void 0
                  );
                } else this._viewRef = null;
              } else
                this._viewRef &&
                  n.ngTemplateOutletContext &&
                  this.ngTemplateOutletContext &&
                  (this._viewRef.context = this.ngTemplateOutletContext);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(_(ln));
            }),
            (e.ɵdir = B({
              type: e,
              selectors: [["", "ngTemplateOutlet", ""]],
              inputs: {
                ngTemplateOutletContext: "ngTemplateOutletContext",
                ngTemplateOutlet: "ngTemplateOutlet",
                ngTemplateOutletInjector: "ngTemplateOutletInjector",
              },
              standalone: !0,
              features: [Pt],
            })),
            t
          );
        })();
      let fE = (() => {
        var e;
        class t {
          constructor(n, i = "USD") {
            (this._locale = n), (this._defaultCurrencyCode = i);
          }
          transform(n, i = this._defaultCurrencyCode, s = "symbol", o, a) {
            if (
              !(function Lh(e) {
                return !(null == e || "" === e || e != e);
              })(n)
            )
              return null;
            (a = a || this._locale),
              "boolean" == typeof s && (s = s ? "symbol" : "code");
            let l = i || this._defaultCurrencyCode;
            "code" !== s &&
              (l =
                "symbol" === s || "symbol-narrow" === s
                  ? (function wk(e, t, r = "en") {
                      const n =
                          (function yk(e) {
                            return ft(e)[we.Currencies];
                          })(r)[e] ||
                          Kw[e] ||
                          [],
                        i = n[1];
                      return "narrow" === t && "string" == typeof i
                        ? i
                        : n[0] || e;
                    })(l, "symbol" === s ? "wide" : "narrow", a)
                  : s);
            try {
              return Hk(
                (function Vh(e) {
                  if ("string" == typeof e && !isNaN(Number(e) - parseFloat(e)))
                    return Number(e);
                  if ("number" != typeof e)
                    throw new Error(`${e} is not a number`);
                  return e;
                })(n),
                a,
                l,
                i,
                o
              );
            } catch (u) {
              throw (function cn(e, t) {
                return new C(2100, !1);
              })();
            }
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(Zn, 16), _(Yx, 16));
          }),
          (e.ɵpipe = Dt({
            name: "currency",
            type: e,
            pure: !0,
            standalone: !0,
          })),
          t
        );
      })();
      let hE = (() => {
        var e;
        class t {}
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = Nt({ type: e })),
          (e.ɵinj = yt({})),
          t
        );
      })();
      const pE = "browser";
      function jh(e) {
        return e === pE;
      }
      function gE(e) {
        return "server" === e;
      }
      let SL = (() => {
        var e;
        class t {}
        return (
          ((e = t).ɵprov = R({
            token: e,
            providedIn: "root",
            factory: () => new ML(M(pt), window),
          })),
          t
        );
      })();
      class ML {
        constructor(t, r) {
          (this.document = t), (this.window = r), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const r = (function IL(e, t) {
            const r = e.getElementById(t) || e.getElementsByName(t)[0];
            if (r) return r;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              "function" == typeof e.body.attachShadow
            ) {
              const n = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let i = n.currentNode;
              for (; i; ) {
                const s = i.shadowRoot;
                if (s) {
                  const o =
                    s.getElementById(t) || s.querySelector(`[name="${t}"]`);
                  if (o) return o;
                }
                i = n.nextNode();
              }
            }
            return null;
          })(this.document, t);
          r && (this.scrollToElement(r), r.focus());
        }
        setHistoryScrollRestoration(t) {
          this.supportsScrolling() &&
            (this.window.history.scrollRestoration = t);
        }
        scrollToElement(t) {
          const r = t.getBoundingClientRect(),
            n = r.left + this.window.pageXOffset,
            i = r.top + this.window.pageYOffset,
            s = this.offset();
          this.window.scrollTo(n - s[0], i - s[1]);
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      class mE {}
      class ZL extends sk {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class Hh extends ZL {
        static makeCurrent() {
          !(function ik(e) {
            Dh || (Dh = e);
          })(new Hh());
        }
        onAndCancel(t, r, n) {
          return (
            t.addEventListener(r, n),
            () => {
              t.removeEventListener(r, n);
            }
          );
        }
        dispatchEvent(t, r) {
          t.dispatchEvent(r);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, r) {
          return (r = r || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, r) {
          return "window" === r
            ? window
            : "document" === r
            ? t
            : "body" === r
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const r = (function YL() {
            return (
              (Po = Po || document.querySelector("base")),
              Po ? Po.getAttribute("href") : null
            );
          })();
          return null == r
            ? null
            : (function XL(e) {
                (ou = ou || document.createElement("a")),
                  ou.setAttribute("href", e);
                const t = ou.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(r);
        }
        resetBaseElement() {
          Po = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return rE(document.cookie, t);
        }
      }
      let ou,
        Po = null,
        eV = (() => {
          var e;
          class t {
            build() {
              return new XMLHttpRequest();
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            t
          );
        })();
      const Uh = new O("EventManagerPlugins");
      let CE = (() => {
        var e;
        class t {
          constructor(n, i) {
            (this._zone = i),
              (this._eventNameToPlugin = new Map()),
              n.forEach((s) => {
                s.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, i, s) {
            return this._findPluginFor(i).addEventListener(n, i, s);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            let i = this._eventNameToPlugin.get(n);
            if (i) return i;
            if (((i = this._plugins.find((o) => o.supports(n))), !i))
              throw new C(5101, !1);
            return this._eventNameToPlugin.set(n, i), i;
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(Uh), M(ue));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      class wE {
        constructor(t) {
          this._doc = t;
        }
      }
      const zh = "ng-app-id";
      let EE = (() => {
        var e;
        class t {
          constructor(n, i, s, o = {}) {
            (this.doc = n),
              (this.appId = i),
              (this.nonce = s),
              (this.platformId = o),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = gE(o)),
              this.resetHostNodes();
          }
          addStyles(n) {
            for (const i of n)
              1 === this.changeUsageCount(i, 1) && this.onStyleAdded(i);
          }
          removeStyles(n) {
            for (const i of n)
              this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
          }
          ngOnDestroy() {
            const n = this.styleNodesInDOM;
            n && (n.forEach((i) => i.remove()), n.clear());
            for (const i of this.getAllStyles()) this.onStyleRemoved(i);
            this.resetHostNodes();
          }
          addHost(n) {
            this.hostNodes.add(n);
            for (const i of this.getAllStyles()) this.addStyleToHost(n, i);
          }
          removeHost(n) {
            this.hostNodes.delete(n);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(n) {
            for (const i of this.hostNodes) this.addStyleToHost(i, n);
          }
          onStyleRemoved(n) {
            const i = this.styleRef;
            i.get(n)?.elements?.forEach((s) => s.remove()), i.delete(n);
          }
          collectServerRenderedStyles() {
            const n = this.doc.head?.querySelectorAll(
              `style[${zh}="${this.appId}"]`
            );
            if (n?.length) {
              const i = new Map();
              return (
                n.forEach((s) => {
                  null != s.textContent && i.set(s.textContent, s);
                }),
                i
              );
            }
            return null;
          }
          changeUsageCount(n, i) {
            const s = this.styleRef;
            if (s.has(n)) {
              const o = s.get(n);
              return (o.usage += i), o.usage;
            }
            return s.set(n, { usage: i, elements: [] }), i;
          }
          getStyleElement(n, i) {
            const s = this.styleNodesInDOM,
              o = s?.get(i);
            if (o?.parentNode === n)
              return s.delete(i), o.removeAttribute(zh), o;
            {
              const a = this.doc.createElement("style");
              return (
                this.nonce && a.setAttribute("nonce", this.nonce),
                (a.textContent = i),
                this.platformIsServer && a.setAttribute(zh, this.appId),
                a
              );
            }
          }
          addStyleToHost(n, i) {
            const s = this.getStyleElement(n, i);
            n.appendChild(s);
            const o = this.styleRef,
              a = o.get(i)?.elements;
            a ? a.push(s) : o.set(i, { elements: [s], usage: 1 });
          }
          resetHostNodes() {
            const n = this.hostNodes;
            n.clear(), n.add(this.doc.head);
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(pt), M(cl), M(My, 8), M(wn));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      const qh = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Gh = /%COMP%/g,
        iV = new O("RemoveStylesOnCompDestroy", {
          providedIn: "root",
          factory: () => !1,
        });
      function SE(e, t) {
        return t.map((r) => r.replace(Gh, e));
      }
      let Wh = (() => {
        var e;
        class t {
          constructor(n, i, s, o, a, l, u, c = null) {
            (this.eventManager = n),
              (this.sharedStylesHost = i),
              (this.appId = s),
              (this.removeStylesOnCompDestroy = o),
              (this.doc = a),
              (this.platformId = l),
              (this.ngZone = u),
              (this.nonce = c),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = gE(l)),
              (this.defaultRenderer = new Qh(n, a, u, this.platformIsServer));
          }
          createRenderer(n, i) {
            if (!n || !i) return this.defaultRenderer;
            this.platformIsServer &&
              i.encapsulation === zt.ShadowDom &&
              (i = { ...i, encapsulation: zt.Emulated });
            const s = this.getOrCreateRenderer(n, i);
            return (
              s instanceof IE
                ? s.applyToHost(n)
                : s instanceof Kh && s.applyStyles(),
              s
            );
          }
          getOrCreateRenderer(n, i) {
            const s = this.rendererByCompId;
            let o = s.get(i.id);
            if (!o) {
              const a = this.doc,
                l = this.ngZone,
                u = this.eventManager,
                c = this.sharedStylesHost,
                d = this.removeStylesOnCompDestroy,
                f = this.platformIsServer;
              switch (i.encapsulation) {
                case zt.Emulated:
                  o = new IE(u, c, i, this.appId, d, a, l, f);
                  break;
                case zt.ShadowDom:
                  return new lV(u, c, n, i, a, l, this.nonce, f);
                default:
                  o = new Kh(u, c, i, d, a, l, f);
              }
              s.set(i.id, o);
            }
            return o;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(
              M(CE),
              M(EE),
              M(cl),
              M(iV),
              M(pt),
              M(wn),
              M(ue),
              M(My)
            );
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      class Qh {
        constructor(t, r, n, i) {
          (this.eventManager = t),
            (this.doc = r),
            (this.ngZone = n),
            (this.platformIsServer = i),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, r) {
          return r
            ? this.doc.createElementNS(qh[r] || r, t)
            : this.doc.createElement(t);
        }
        createComment(t) {
          return this.doc.createComment(t);
        }
        createText(t) {
          return this.doc.createTextNode(t);
        }
        appendChild(t, r) {
          (ME(t) ? t.content : t).appendChild(r);
        }
        insertBefore(t, r, n) {
          t && (ME(t) ? t.content : t).insertBefore(r, n);
        }
        removeChild(t, r) {
          t && t.removeChild(r);
        }
        selectRootElement(t, r) {
          let n = "string" == typeof t ? this.doc.querySelector(t) : t;
          if (!n) throw new C(-5104, !1);
          return r || (n.textContent = ""), n;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, r, n, i) {
          if (i) {
            r = i + ":" + r;
            const s = qh[i];
            s ? t.setAttributeNS(s, r, n) : t.setAttribute(r, n);
          } else t.setAttribute(r, n);
        }
        removeAttribute(t, r, n) {
          if (n) {
            const i = qh[n];
            i ? t.removeAttributeNS(i, r) : t.removeAttribute(`${n}:${r}`);
          } else t.removeAttribute(r);
        }
        addClass(t, r) {
          t.classList.add(r);
        }
        removeClass(t, r) {
          t.classList.remove(r);
        }
        setStyle(t, r, n, i) {
          i & (pr.DashCase | pr.Important)
            ? t.style.setProperty(r, n, i & pr.Important ? "important" : "")
            : (t.style[r] = n);
        }
        removeStyle(t, r, n) {
          n & pr.DashCase ? t.style.removeProperty(r) : (t.style[r] = "");
        }
        setProperty(t, r, n) {
          t[r] = n;
        }
        setValue(t, r) {
          t.nodeValue = r;
        }
        listen(t, r, n) {
          if (
            "string" == typeof t &&
            !(t = Dr().getGlobalEventTarget(this.doc, t))
          )
            throw new Error(`Unsupported event target ${t} for event ${r}`);
          return this.eventManager.addEventListener(
            t,
            r,
            this.decoratePreventDefault(n)
          );
        }
        decoratePreventDefault(t) {
          return (r) => {
            if ("__ngUnwrap__" === r) return t;
            !1 ===
              (this.platformIsServer
                ? this.ngZone.runGuarded(() => t(r))
                : t(r)) && r.preventDefault();
          };
        }
      }
      function ME(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class lV extends Qh {
        constructor(t, r, n, i, s, o, a, l) {
          super(t, s, o, l),
            (this.sharedStylesHost = r),
            (this.hostEl = n),
            (this.shadowRoot = n.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const u = SE(i.id, i.styles);
          for (const c of u) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a),
              (d.textContent = c),
              this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        appendChild(t, r) {
          return super.appendChild(this.nodeOrShadowRoot(t), r);
        }
        insertBefore(t, r, n) {
          return super.insertBefore(this.nodeOrShadowRoot(t), r, n);
        }
        removeChild(t, r) {
          return super.removeChild(this.nodeOrShadowRoot(t), r);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class Kh extends Qh {
        constructor(t, r, n, i, s, o, a, l) {
          super(t, s, o, a),
            (this.sharedStylesHost = r),
            (this.removeStylesOnCompDestroy = i),
            (this.styles = l ? SE(l, n.styles) : n.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles);
        }
        destroy() {
          this.removeStylesOnCompDestroy &&
            this.sharedStylesHost.removeStyles(this.styles);
        }
      }
      class IE extends Kh {
        constructor(t, r, n, i, s, o, a, l) {
          const u = i + "-" + n.id;
          super(t, r, n, s, o, a, l, u),
            (this.contentAttr = (function sV(e) {
              return "_ngcontent-%COMP%".replace(Gh, e);
            })(u)),
            (this.hostAttr = (function oV(e) {
              return "_nghost-%COMP%".replace(Gh, e);
            })(u));
        }
        applyToHost(t) {
          this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, r) {
          const n = super.createElement(t, r);
          return super.setAttribute(n, this.contentAttr, ""), n;
        }
      }
      let uV = (() => {
        var e;
        class t extends wE {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, i, s) {
            return (
              n.addEventListener(i, s, !1),
              () => this.removeEventListener(n, i, s)
            );
          }
          removeEventListener(n, i, s) {
            return n.removeEventListener(i, s);
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(pt));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      const TE = ["alt", "control", "meta", "shift"],
        cV = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        dV = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let fV = (() => {
        var e;
        class t extends wE {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != t.parseEventName(n);
          }
          addEventListener(n, i, s) {
            const o = t.parseEventName(i),
              a = t.eventCallback(o.fullKey, s, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Dr().onAndCancel(n, o.domEventName, a));
          }
          static parseEventName(n) {
            const i = n.toLowerCase().split("."),
              s = i.shift();
            if (0 === i.length || ("keydown" !== s && "keyup" !== s))
              return null;
            const o = t._normalizeKey(i.pop());
            let a = "",
              l = i.indexOf("code");
            if (
              (l > -1 && (i.splice(l, 1), (a = "code.")),
              TE.forEach((c) => {
                const d = i.indexOf(c);
                d > -1 && (i.splice(d, 1), (a += c + "."));
              }),
              (a += o),
              0 != i.length || 0 === o.length)
            )
              return null;
            const u = {};
            return (u.domEventName = s), (u.fullKey = a), u;
          }
          static matchEventFullKeyCode(n, i) {
            let s = cV[n.key] || n.key,
              o = "";
            return (
              i.indexOf("code.") > -1 && ((s = n.code), (o = "code.")),
              !(null == s || !s) &&
                ((s = s.toLowerCase()),
                " " === s ? (s = "space") : "." === s && (s = "dot"),
                TE.forEach((a) => {
                  a !== s && (0, dV[a])(n) && (o += a + ".");
                }),
                (o += s),
                o === i)
            );
          }
          static eventCallback(n, i, s) {
            return (o) => {
              t.matchEventFullKeyCode(o, n) && s.runGuarded(() => i(o));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(pt));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      const mV = _w(zF, "browser", [
          { provide: wn, useValue: pE },
          {
            provide: by,
            useValue: function hV() {
              Hh.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: pt,
            useFactory: function gV() {
              return (
                (function n1(e) {
                  Td = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        vV = new O(""),
        RE = [
          {
            provide: Hl,
            useClass: class JL {
              addToWindow(t) {
                (De.getAngularTestability = (n, i = !0) => {
                  const s = t.findTestabilityInTree(n, i);
                  if (null == s) throw new C(5103, !1);
                  return s;
                }),
                  (De.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (De.getAllAngularRootElements = () => t.getAllRootElements()),
                  De.frameworkStabilizers || (De.frameworkStabilizers = []),
                  De.frameworkStabilizers.push((n) => {
                    const i = De.getAllAngularTestabilities();
                    let s = i.length,
                      o = !1;
                    const a = function (l) {
                      (o = o || l), s--, 0 == s && n(o);
                    };
                    i.forEach((l) => {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, r, n) {
                return null == r
                  ? null
                  : t.getTestability(r) ??
                      (n
                        ? Dr().isShadowRoot(r)
                          ? this.findTestabilityInTree(t, r.host, !0)
                          : this.findTestabilityInTree(t, r.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: pw, useClass: uh, deps: [ue, ch, Hl] },
          { provide: uh, useClass: uh, deps: [ue, ch, Hl] },
        ],
        PE = [
          { provide: Vd, useValue: "root" },
          {
            provide: bn,
            useFactory: function pV() {
              return new bn();
            },
            deps: [],
          },
          { provide: Uh, useClass: uV, multi: !0, deps: [pt, ue, wn] },
          { provide: Uh, useClass: fV, multi: !0, deps: [pt] },
          Wh,
          EE,
          CE,
          { provide: io, useExisting: Wh },
          { provide: mE, useClass: eV, deps: [] },
          [],
        ];
      let OE = (() => {
          var e;
          class t {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: t,
                providers: [{ provide: cl, useValue: n.appId }],
              };
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(M(vV, 12));
            }),
            (e.ɵmod = Nt({ type: e })),
            (e.ɵinj = yt({ providers: [...PE, ...RE], imports: [hE, qF] })),
            t
          );
        })(),
        xE = (() => {
          var e;
          class t {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(M(pt));
            }),
            (e.ɵprov = R({
              token: e,
              factory: function (n) {
                let i = null;
                return (
                  (i = n
                    ? new n()
                    : (function _V() {
                        return new xE(M(pt));
                      })()),
                  i
                );
              },
              providedIn: "root",
            })),
            t
          );
        })();
      function ls(e, t) {
        return ee(t) ? je(e, t, 1) : je(e, 1);
      }
      function Mt(e, t) {
        return Ne((r, n) => {
          let i = 0;
          r.subscribe(Oe(n, (s) => e.call(t, s, i++) && n.next(s)));
        });
      }
      function Oo(e) {
        return Ne((t, r) => {
          try {
            t.subscribe(r);
          } finally {
            r.add(e);
          }
        });
      }
      typeof window < "u" && window;
      class au {}
      class lu {}
      class Pn {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? "string" == typeof t
                ? (this.lazyInit = () => {
                    (this.headers = new Map()),
                      t.split("\n").forEach((r) => {
                        const n = r.indexOf(":");
                        if (n > 0) {
                          const i = r.slice(0, n),
                            s = i.toLowerCase(),
                            o = r.slice(n + 1).trim();
                          this.maybeSetNormalizedName(i, s),
                            this.headers.has(s)
                              ? this.headers.get(s).push(o)
                              : this.headers.set(s, [o]);
                        }
                      });
                  })
                : typeof Headers < "u" && t instanceof Headers
                ? ((this.headers = new Map()),
                  t.forEach((r, n) => {
                    this.setHeaderEntries(n, r);
                  }))
                : (this.lazyInit = () => {
                    (this.headers = new Map()),
                      Object.entries(t).forEach(([r, n]) => {
                        this.setHeaderEntries(r, n);
                      });
                  })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const r = this.headers.get(t.toLowerCase());
          return r && r.length > 0 ? r[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, r) {
          return this.clone({ name: t, value: r, op: "a" });
        }
        set(t, r) {
          return this.clone({ name: t, value: r, op: "s" });
        }
        delete(t, r) {
          return this.clone({ name: t, value: r, op: "d" });
        }
        maybeSetNormalizedName(t, r) {
          this.normalizedNames.has(r) || this.normalizedNames.set(r, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Pn
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((r) => {
              this.headers.set(r, t.headers.get(r)),
                this.normalizedNames.set(r, t.normalizedNames.get(r));
            });
        }
        clone(t) {
          const r = new Pn();
          return (
            (r.lazyInit =
              this.lazyInit && this.lazyInit instanceof Pn
                ? this.lazyInit
                : this),
            (r.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            r
          );
        }
        applyUpdate(t) {
          const r = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let n = t.value;
              if (("string" == typeof n && (n = [n]), 0 === n.length)) return;
              this.maybeSetNormalizedName(t.name, r);
              const i = ("a" === t.op ? this.headers.get(r) : void 0) || [];
              i.push(...n), this.headers.set(r, i);
              break;
            case "d":
              const s = t.value;
              if (s) {
                let o = this.headers.get(r);
                if (!o) return;
                (o = o.filter((a) => -1 === s.indexOf(a))),
                  0 === o.length
                    ? (this.headers.delete(r), this.normalizedNames.delete(r))
                    : this.headers.set(r, o);
              } else this.headers.delete(r), this.normalizedNames.delete(r);
          }
        }
        setHeaderEntries(t, r) {
          const n = (Array.isArray(r) ? r : [r]).map((s) => s.toString()),
            i = t.toLowerCase();
          this.headers.set(i, n), this.maybeSetNormalizedName(t, i);
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((r) =>
              t(this.normalizedNames.get(r), this.headers.get(r))
            );
        }
      }
      class bV {
        encodeKey(t) {
          return VE(t);
        }
        encodeValue(t) {
          return VE(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const MV = /%(\d[a-f0-9])/gi,
        IV = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function VE(e) {
        return encodeURIComponent(e).replace(MV, (t, r) => IV[r] ?? t);
      }
      function uu(e) {
        return `${e}`;
      }
      class Er {
        constructor(t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new bV()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function SV(e, t) {
              const r = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((i) => {
                      const s = i.indexOf("="),
                        [o, a] =
                          -1 == s
                            ? [t.decodeKey(i), ""]
                            : [
                                t.decodeKey(i.slice(0, s)),
                                t.decodeValue(i.slice(s + 1)),
                              ],
                        l = r.get(o) || [];
                      l.push(a), r.set(o, l);
                    }),
                r
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach((r) => {
                  const n = t.fromObject[r],
                    i = Array.isArray(n) ? n.map(uu) : [uu(n)];
                  this.map.set(r, i);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const r = this.map.get(t);
          return r ? r[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, r) {
          return this.clone({ param: t, value: r, op: "a" });
        }
        appendAll(t) {
          const r = [];
          return (
            Object.keys(t).forEach((n) => {
              const i = t[n];
              Array.isArray(i)
                ? i.forEach((s) => {
                    r.push({ param: n, value: s, op: "a" });
                  })
                : r.push({ param: n, value: i, op: "a" });
            }),
            this.clone(r)
          );
        }
        set(t, r) {
          return this.clone({ param: t, value: r, op: "s" });
        }
        delete(t, r) {
          return this.clone({ param: t, value: r, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((t) => {
                const r = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map((n) => r + "=" + this.encoder.encodeValue(n))
                  .join("&");
              })
              .filter((t) => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const r = new Er({ encoder: this.encoder });
          return (
            (r.cloneFrom = this.cloneFrom || this),
            (r.updates = (this.updates || []).concat(t)),
            r
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach((t) => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const r =
                      ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    r.push(uu(t.value)), this.map.set(t.param, r);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let n = this.map.get(t.param) || [];
                      const i = n.indexOf(uu(t.value));
                      -1 !== i && n.splice(i, 1),
                        n.length > 0
                          ? this.map.set(t.param, n)
                          : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class TV {
        constructor() {
          this.map = new Map();
        }
        set(t, r) {
          return this.map.set(t, r), this;
        }
        get(t) {
          return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
          );
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function jE(e) {
        return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
      }
      function $E(e) {
        return typeof Blob < "u" && e instanceof Blob;
      }
      function BE(e) {
        return typeof FormData < "u" && e instanceof FormData;
      }
      class xo {
        constructor(t, r, n, i) {
          let s;
          if (
            ((this.url = r),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function AV(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || i
              ? ((this.body = void 0 !== n ? n : null), (s = i))
              : (s = n),
            s &&
              ((this.reportProgress = !!s.reportProgress),
              (this.withCredentials = !!s.withCredentials),
              s.responseType && (this.responseType = s.responseType),
              s.headers && (this.headers = s.headers),
              s.context && (this.context = s.context),
              s.params && (this.params = s.params)),
            this.headers || (this.headers = new Pn()),
            this.context || (this.context = new TV()),
            this.params)
          ) {
            const o = this.params.toString();
            if (0 === o.length) this.urlWithParams = r;
            else {
              const a = r.indexOf("?");
              this.urlWithParams =
                r + (-1 === a ? "?" : a < r.length - 1 ? "&" : "") + o;
            }
          } else (this.params = new Er()), (this.urlWithParams = r);
        }
        serializeBody() {
          return null === this.body
            ? null
            : jE(this.body) ||
              $E(this.body) ||
              BE(this.body) ||
              (function NV(e) {
                return (
                  typeof URLSearchParams < "u" && e instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof Er
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || BE(this.body)
            ? null
            : $E(this.body)
            ? this.body.type || null
            : jE(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof Er
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(t = {}) {
          const r = t.method || this.method,
            n = t.url || this.url,
            i = t.responseType || this.responseType,
            s = void 0 !== t.body ? t.body : this.body,
            o =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            a =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress;
          let l = t.headers || this.headers,
            u = t.params || this.params;
          const c = t.context ?? this.context;
          return (
            void 0 !== t.setHeaders &&
              (l = Object.keys(t.setHeaders).reduce(
                (d, f) => d.set(f, t.setHeaders[f]),
                l
              )),
            t.setParams &&
              (u = Object.keys(t.setParams).reduce(
                (d, f) => d.set(f, t.setParams[f]),
                u
              )),
            new xo(r, n, s, {
              params: u,
              headers: l,
              context: c,
              reportProgress: a,
              responseType: i,
              withCredentials: o,
            })
          );
        }
      }
      var us = (function (e) {
        return (
          (e[(e.Sent = 0)] = "Sent"),
          (e[(e.UploadProgress = 1)] = "UploadProgress"),
          (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
          (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
          (e[(e.Response = 4)] = "Response"),
          (e[(e.User = 5)] = "User"),
          e
        );
      })(us || {});
      class Yh {
        constructor(t, r = 200, n = "OK") {
          (this.headers = t.headers || new Pn()),
            (this.status = void 0 !== t.status ? t.status : r),
            (this.statusText = t.statusText || n),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Xh extends Yh {
        constructor(t = {}) {
          super(t), (this.type = us.ResponseHeader);
        }
        clone(t = {}) {
          return new Xh({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class cs extends Yh {
        constructor(t = {}) {
          super(t),
            (this.type = us.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new cs({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class HE extends Yh {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${
                    t.status
                  } ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function Jh(e, t) {
        return {
          body: t,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let cu = (() => {
        var e;
        class t {
          constructor(n) {
            this.handler = n;
          }
          request(n, i, s = {}) {
            let o;
            if (n instanceof xo) o = n;
            else {
              let u, c;
              (u = s.headers instanceof Pn ? s.headers : new Pn(s.headers)),
                s.params &&
                  (c =
                    s.params instanceof Er
                      ? s.params
                      : new Er({ fromObject: s.params })),
                (o = new xo(n, i, void 0 !== s.body ? s.body : null, {
                  headers: u,
                  context: s.context,
                  params: c,
                  reportProgress: s.reportProgress,
                  responseType: s.responseType || "json",
                  withCredentials: s.withCredentials,
                }));
            }
            const a = V(o).pipe(ls((u) => this.handler.handle(u)));
            if (n instanceof xo || "events" === s.observe) return a;
            const l = a.pipe(Mt((u) => u instanceof cs));
            switch (s.observe || "body") {
              case "body":
                switch (o.responseType) {
                  case "arraybuffer":
                    return l.pipe(
                      te((u) => {
                        if (null !== u.body && !(u.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return u.body;
                      })
                    );
                  case "blob":
                    return l.pipe(
                      te((u) => {
                        if (null !== u.body && !(u.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return u.body;
                      })
                    );
                  case "text":
                    return l.pipe(
                      te((u) => {
                        if (null !== u.body && "string" != typeof u.body)
                          throw new Error("Response is not a string.");
                        return u.body;
                      })
                    );
                  default:
                    return l.pipe(te((u) => u.body));
                }
              case "response":
                return l;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${s.observe}}`
                );
            }
          }
          delete(n, i = {}) {
            return this.request("DELETE", n, i);
          }
          get(n, i = {}) {
            return this.request("GET", n, i);
          }
          head(n, i = {}) {
            return this.request("HEAD", n, i);
          }
          jsonp(n, i) {
            return this.request("JSONP", n, {
              params: new Er().append(i, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, i = {}) {
            return this.request("OPTIONS", n, i);
          }
          patch(n, i, s = {}) {
            return this.request("PATCH", n, Jh(s, i));
          }
          post(n, i, s = {}) {
            return this.request("POST", n, Jh(s, i));
          }
          put(n, i, s = {}) {
            return this.request("PUT", n, Jh(s, i));
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(au));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      function qE(e, t) {
        return t(e);
      }
      function PV(e, t) {
        return (r, n) => t.intercept(r, { handle: (i) => e(i, n) });
      }
      const xV = new O(""),
        Fo = new O(""),
        GE = new O("");
      function FV() {
        let e = null;
        return (t, r) => {
          null === e &&
            (e = (P(xV, { optional: !0 }) ?? []).reduceRight(PV, qE));
          const n = P($l),
            i = n.add();
          return e(t, r).pipe(Oo(() => n.remove(i)));
        };
      }
      let WE = (() => {
        var e;
        class t extends au {
          constructor(n, i) {
            super(),
              (this.backend = n),
              (this.injector = i),
              (this.chain = null),
              (this.pendingTasks = P($l));
          }
          handle(n) {
            if (null === this.chain) {
              const s = Array.from(
                new Set([
                  ...this.injector.get(Fo),
                  ...this.injector.get(GE, []),
                ])
              );
              this.chain = s.reduceRight(
                (o, a) =>
                  (function OV(e, t, r) {
                    return (n, i) => r.runInContext(() => t(n, (s) => e(s, i)));
                  })(o, a, this.injector),
                qE
              );
            }
            const i = this.pendingTasks.add();
            return this.chain(n, (s) => this.backend.handle(s)).pipe(
              Oo(() => this.pendingTasks.remove(i))
            );
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(lu), M(Ft));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      const jV = /^\)\]\}',?\n/;
      let KE = (() => {
        var e;
        class t {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method) throw new C(-2800, !1);
            const i = this.xhrFactory;
            return (i.ɵloadImpl ? Le(i.ɵloadImpl()) : V(null)).pipe(
              Xe(
                () =>
                  new Ie((o) => {
                    const a = i.build();
                    if (
                      (a.open(n.method, n.urlWithParams),
                      n.withCredentials && (a.withCredentials = !0),
                      n.headers.forEach((y, D) =>
                        a.setRequestHeader(y, D.join(","))
                      ),
                      n.headers.has("Accept") ||
                        a.setRequestHeader(
                          "Accept",
                          "application/json, text/plain, */*"
                        ),
                      !n.headers.has("Content-Type"))
                    ) {
                      const y = n.detectContentTypeHeader();
                      null !== y && a.setRequestHeader("Content-Type", y);
                    }
                    if (n.responseType) {
                      const y = n.responseType.toLowerCase();
                      a.responseType = "json" !== y ? y : "text";
                    }
                    const l = n.serializeBody();
                    let u = null;
                    const c = () => {
                        if (null !== u) return u;
                        const y = a.statusText || "OK",
                          D = new Pn(a.getAllResponseHeaders()),
                          v =
                            (function $V(e) {
                              return "responseURL" in e && e.responseURL
                                ? e.responseURL
                                : /^X-Request-URL:/m.test(
                                    e.getAllResponseHeaders()
                                  )
                                ? e.getResponseHeader("X-Request-URL")
                                : null;
                            })(a) || n.url;
                        return (
                          (u = new Xh({
                            headers: D,
                            status: a.status,
                            statusText: y,
                            url: v,
                          })),
                          u
                        );
                      },
                      d = () => {
                        let {
                            headers: y,
                            status: D,
                            statusText: v,
                            url: A,
                          } = c(),
                          I = null;
                        204 !== D &&
                          (I =
                            typeof a.response > "u"
                              ? a.responseText
                              : a.response),
                          0 === D && (D = I ? 200 : 0);
                        let U = D >= 200 && D < 300;
                        if ("json" === n.responseType && "string" == typeof I) {
                          const me = I;
                          I = I.replace(jV, "");
                          try {
                            I = "" !== I ? JSON.parse(I) : null;
                          } catch (ge) {
                            (I = me),
                              U && ((U = !1), (I = { error: ge, text: I }));
                          }
                        }
                        U
                          ? (o.next(
                              new cs({
                                body: I,
                                headers: y,
                                status: D,
                                statusText: v,
                                url: A || void 0,
                              })
                            ),
                            o.complete())
                          : o.error(
                              new HE({
                                error: I,
                                headers: y,
                                status: D,
                                statusText: v,
                                url: A || void 0,
                              })
                            );
                      },
                      f = (y) => {
                        const { url: D } = c(),
                          v = new HE({
                            error: y,
                            status: a.status || 0,
                            statusText: a.statusText || "Unknown Error",
                            url: D || void 0,
                          });
                        o.error(v);
                      };
                    let h = !1;
                    const g = (y) => {
                        h || (o.next(c()), (h = !0));
                        let D = { type: us.DownloadProgress, loaded: y.loaded };
                        y.lengthComputable && (D.total = y.total),
                          "text" === n.responseType &&
                            a.responseText &&
                            (D.partialText = a.responseText),
                          o.next(D);
                      },
                      m = (y) => {
                        let D = { type: us.UploadProgress, loaded: y.loaded };
                        y.lengthComputable && (D.total = y.total), o.next(D);
                      };
                    return (
                      a.addEventListener("load", d),
                      a.addEventListener("error", f),
                      a.addEventListener("timeout", f),
                      a.addEventListener("abort", f),
                      n.reportProgress &&
                        (a.addEventListener("progress", g),
                        null !== l &&
                          a.upload &&
                          a.upload.addEventListener("progress", m)),
                      a.send(l),
                      o.next({ type: us.Sent }),
                      () => {
                        a.removeEventListener("error", f),
                          a.removeEventListener("abort", f),
                          a.removeEventListener("load", d),
                          a.removeEventListener("timeout", f),
                          n.reportProgress &&
                            (a.removeEventListener("progress", g),
                            null !== l &&
                              a.upload &&
                              a.upload.removeEventListener("progress", m)),
                          a.readyState !== a.DONE && a.abort();
                      }
                    );
                  })
              )
            );
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(mE));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      const ep = new O("XSRF_ENABLED"),
        ZE = new O("XSRF_COOKIE_NAME", {
          providedIn: "root",
          factory: () => "XSRF-TOKEN",
        }),
        YE = new O("XSRF_HEADER_NAME", {
          providedIn: "root",
          factory: () => "X-XSRF-TOKEN",
        });
      class XE {}
      let UV = (() => {
        var e;
        class t {
          constructor(n, i, s) {
            (this.doc = n),
              (this.platform = i),
              (this.cookieName = s),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const n = this.doc.cookie || "";
            return (
              n !== this.lastCookieString &&
                (this.parseCount++,
                (this.lastToken = rE(n, this.cookieName)),
                (this.lastCookieString = n)),
              this.lastToken
            );
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(pt), M(wn), M(ZE));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      function zV(e, t) {
        const r = e.url.toLowerCase();
        if (
          !P(ep) ||
          "GET" === e.method ||
          "HEAD" === e.method ||
          r.startsWith("http://") ||
          r.startsWith("https://")
        )
          return t(e);
        const n = P(XE).getToken(),
          i = P(YE);
        return (
          null != n &&
            !e.headers.has(i) &&
            (e = e.clone({ headers: e.headers.set(i, n) })),
          t(e)
        );
      }
      var br = (function (e) {
        return (
          (e[(e.Interceptors = 0)] = "Interceptors"),
          (e[(e.LegacyInterceptors = 1)] = "LegacyInterceptors"),
          (e[(e.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
          (e[(e.NoXsrfProtection = 3)] = "NoXsrfProtection"),
          (e[(e.JsonpSupport = 4)] = "JsonpSupport"),
          (e[(e.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
          (e[(e.Fetch = 6)] = "Fetch"),
          e
        );
      })(br || {});
      function Jr(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function qV(...e) {
        const t = [
          cu,
          KE,
          WE,
          { provide: au, useExisting: WE },
          { provide: lu, useExisting: KE },
          { provide: Fo, useValue: zV, multi: !0 },
          { provide: ep, useValue: !0 },
          { provide: XE, useClass: UV },
        ];
        for (const r of e) t.push(...r.ɵproviders);
        return (function Fd(e) {
          return { ɵproviders: e };
        })(t);
      }
      const JE = new O("LEGACY_INTERCEPTOR_FN");
      let WV = (() => {
        var e;
        class t {}
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = Nt({ type: e })),
          (e.ɵinj = yt({
            providers: [
              qV(
                Jr(br.LegacyInterceptors, [
                  { provide: JE, useFactory: FV },
                  { provide: Fo, useExisting: JE, multi: !0 },
                ])
              ),
            ],
          })),
          t
        );
      })();
      const { isArray: JV } = Array,
        { getPrototypeOf: e2, prototype: t2, keys: n2 } = Object;
      function eb(e) {
        if (1 === e.length) {
          const t = e[0];
          if (JV(t)) return { args: t, keys: null };
          if (
            (function r2(e) {
              return e && "object" == typeof e && e2(e) === t2;
            })(t)
          ) {
            const r = n2(t);
            return { args: r.map((n) => t[n]), keys: r };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: i2 } = Array;
      function tp(e) {
        return te((t) =>
          (function s2(e, t) {
            return i2(t) ? e(...t) : e(t);
          })(e, t)
        );
      }
      function tb(e, t) {
        return e.reduce((r, n, i) => ((r[n] = t[i]), r), {});
      }
      let nb = (() => {
          var e;
          class t {
            constructor(n, i) {
              (this._renderer = n),
                (this._elementRef = i),
                (this.onChange = (s) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, i) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, i);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(_(En), _(dt));
            }),
            (e.ɵdir = B({ type: e })),
            t
          );
        })(),
        ei = (() => {
          var e;
          class t extends nb {}
          return (
            ((e = t).ɵfac = (function () {
              let r;
              return function (i) {
                return (r || (r = Ke(e)))(i || e);
              };
            })()),
            (e.ɵdir = B({ type: e, features: [fe] })),
            t
          );
        })();
      const On = new O("NgValueAccessor"),
        l2 = { provide: On, useExisting: _e(() => ds), multi: !0 },
        c2 = new O("CompositionEventMode");
      let ds = (() => {
        var e;
        class t extends nb {
          constructor(n, i, s) {
            super(n, i),
              (this._compositionMode = s),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function u2() {
                  const e = Dr() ? Dr().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", n ?? "");
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(En), _(dt), _(c2, 8));
          }),
          (e.ɵdir = B({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, i) {
              1 & n &&
                ce("input", function (o) {
                  return i._handleInput(o.target.value);
                })("blur", function () {
                  return i.onTouched();
                })("compositionstart", function () {
                  return i._compositionStart();
                })("compositionend", function (o) {
                  return i._compositionEnd(o.target.value);
                });
            },
            features: [Se([l2]), fe],
          })),
          t
        );
      })();
      function Sr(e) {
        return (
          null == e ||
          (("string" == typeof e || Array.isArray(e)) && 0 === e.length)
        );
      }
      function ib(e) {
        return null != e && "number" == typeof e.length;
      }
      const nt = new O("NgValidators"),
        Mr = new O("NgAsyncValidators"),
        d2 =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class It {
        static min(t) {
          return (function sb(e) {
            return (t) => {
              if (Sr(t.value) || Sr(e)) return null;
              const r = parseFloat(t.value);
              return !isNaN(r) && r < e
                ? { min: { min: e, actual: t.value } }
                : null;
            };
          })(t);
        }
        static max(t) {
          return (function ob(e) {
            return (t) => {
              if (Sr(t.value) || Sr(e)) return null;
              const r = parseFloat(t.value);
              return !isNaN(r) && r > e
                ? { max: { max: e, actual: t.value } }
                : null;
            };
          })(t);
        }
        static required(t) {
          return (function ab(e) {
            return Sr(e.value) ? { required: !0 } : null;
          })(t);
        }
        static requiredTrue(t) {
          return (function lb(e) {
            return !0 === e.value ? null : { required: !0 };
          })(t);
        }
        static email(t) {
          return (function ub(e) {
            return Sr(e.value) || d2.test(e.value) ? null : { email: !0 };
          })(t);
        }
        static minLength(t) {
          return (function cb(e) {
            return (t) =>
              Sr(t.value) || !ib(t.value)
                ? null
                : t.value.length < e
                ? {
                    minlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static maxLength(t) {
          return (function db(e) {
            return (t) =>
              ib(t.value) && t.value.length > e
                ? {
                    maxlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static pattern(t) {
          return (function fb(e) {
            if (!e) return fu;
            let t, r;
            return (
              "string" == typeof e
                ? ((r = ""),
                  "^" !== e.charAt(0) && (r += "^"),
                  (r += e),
                  "$" !== e.charAt(e.length - 1) && (r += "$"),
                  (t = new RegExp(r)))
                : ((r = e.toString()), (t = e)),
              (n) => {
                if (Sr(n.value)) return null;
                const i = n.value;
                return t.test(i)
                  ? null
                  : { pattern: { requiredPattern: r, actualValue: i } };
              }
            );
          })(t);
        }
        static nullValidator(t) {
          return null;
        }
        static compose(t) {
          return yb(t);
        }
        static composeAsync(t) {
          return _b(t);
        }
      }
      function fu(e) {
        return null;
      }
      function hb(e) {
        return null != e;
      }
      function pb(e) {
        return mo(e) ? Le(e) : e;
      }
      function gb(e) {
        let t = {};
        return (
          e.forEach((r) => {
            t = null != r ? { ...t, ...r } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function mb(e, t) {
        return t.map((r) => r(e));
      }
      function vb(e) {
        return e.map((t) =>
          (function f2(e) {
            return !e.validate;
          })(t)
            ? t
            : (r) => t.validate(r)
        );
      }
      function yb(e) {
        if (!e) return null;
        const t = e.filter(hb);
        return 0 == t.length
          ? null
          : function (r) {
              return gb(mb(r, t));
            };
      }
      function np(e) {
        return null != e ? yb(vb(e)) : null;
      }
      function _b(e) {
        if (!e) return null;
        const t = e.filter(hb);
        return 0 == t.length
          ? null
          : function (r) {
              return (function o2(...e) {
                const t = Wg(e),
                  { args: r, keys: n } = eb(e),
                  i = new Ie((s) => {
                    const { length: o } = r;
                    if (!o) return void s.complete();
                    const a = new Array(o);
                    let l = o,
                      u = o;
                    for (let c = 0; c < o; c++) {
                      let d = !1;
                      it(r[c]).subscribe(
                        Oe(
                          s,
                          (f) => {
                            d || ((d = !0), u--), (a[c] = f);
                          },
                          () => l--,
                          void 0,
                          () => {
                            (!l || !d) &&
                              (u || s.next(n ? tb(n, a) : a), s.complete());
                          }
                        )
                      );
                    }
                  });
                return t ? i.pipe(tp(t)) : i;
              })(mb(r, t).map(pb)).pipe(te(gb));
            };
      }
      function rp(e) {
        return null != e ? _b(vb(e)) : null;
      }
      function Db(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function Cb(e) {
        return e._rawValidators;
      }
      function wb(e) {
        return e._rawAsyncValidators;
      }
      function ip(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function hu(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function Eb(e, t) {
        const r = ip(t);
        return (
          ip(e).forEach((i) => {
            hu(r, i) || r.push(i);
          }),
          r
        );
      }
      function bb(e, t) {
        return ip(t).filter((r) => !hu(e, r));
      }
      class Sb {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = np(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = rp(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t = void 0) {
          this.control && this.control.reset(t);
        }
        hasError(t, r) {
          return !!this.control && this.control.hasError(t, r);
        }
        getError(t, r) {
          return this.control ? this.control.getError(t, r) : null;
        }
      }
      class mt extends Sb {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Ir extends Sb {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class Mb {
        constructor(t) {
          this._cd = t;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let pu = (() => {
          var e;
          class t extends Mb {
            constructor(n) {
              super(n);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(_(Ir, 2));
            }),
            (e.ɵdir = B({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, i) {
                2 & n &&
                  Nl("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)(
                    "ng-pristine",
                    i.isPristine
                  )("ng-dirty", i.isDirty)("ng-valid", i.isValid)(
                    "ng-invalid",
                    i.isInvalid
                  )("ng-pending", i.isPending);
              },
              features: [fe],
            })),
            t
          );
        })(),
        gu = (() => {
          var e;
          class t extends Mb {
            constructor(n) {
              super(n);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(_(mt, 10));
            }),
            (e.ɵdir = B({
              type: e,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, i) {
                2 & n &&
                  Nl("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)(
                    "ng-pristine",
                    i.isPristine
                  )("ng-dirty", i.isDirty)("ng-valid", i.isValid)(
                    "ng-invalid",
                    i.isInvalid
                  )("ng-pending", i.isPending)("ng-submitted", i.isSubmitted);
              },
              features: [fe],
            })),
            t
          );
        })();
      const ko = "VALID",
        vu = "INVALID",
        fs = "PENDING",
        Lo = "DISABLED";
      function ap(e) {
        return (yu(e) ? e.validators : e) || null;
      }
      function lp(e, t) {
        return (yu(t) ? t.asyncValidators : e) || null;
      }
      function yu(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      class Nb {
        constructor(t, r) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(t),
            this._assignAsyncValidators(r);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === ko;
        }
        get invalid() {
          return this.status === vu;
        }
        get pending() {
          return this.status == fs;
        }
        get disabled() {
          return this.status === Lo;
        }
        get enabled() {
          return this.status !== Lo;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          this._assignValidators(t);
        }
        setAsyncValidators(t) {
          this._assignAsyncValidators(t);
        }
        addValidators(t) {
          this.setValidators(Eb(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(Eb(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(bb(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(bb(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return hu(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return hu(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((r) => {
              r.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((r) => {
              r.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = fs),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const r = this._parentMarkedDirty(t.onlySelf);
          (this.status = Lo),
            (this.errors = null),
            this._forEachChild((n) => {
              n.disable({ ...t, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...t, skipPristineCheck: r }),
            this._onDisabledChange.forEach((n) => n(!0));
        }
        enable(t = {}) {
          const r = this._parentMarkedDirty(t.onlySelf);
          (this.status = ko),
            this._forEachChild((n) => {
              n.enable({ ...t, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors({ ...t, skipPristineCheck: r }),
            this._onDisabledChange.forEach((n) => n(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === ko || this.status === fs) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((r) => r._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Lo : ko;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = fs), (this._hasOwnPendingAsyncValidator = !0);
            const r = pb(this.asyncValidator(this));
            this._asyncValidationSubscription = r.subscribe((n) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(n, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, r = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== r.emitEvent);
        }
        get(t) {
          let r = t;
          return null == r ||
            (Array.isArray(r) || (r = r.split(".")), 0 === r.length)
            ? null
            : r.reduce((n, i) => n && n._find(i), this);
        }
        getError(t, r) {
          const n = r ? this.get(r) : this;
          return n && n.errors ? n.errors[t] : null;
        }
        hasError(t, r) {
          return !!this.getError(t, r);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new ve()), (this.statusChanges = new ve());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Lo
            : this.errors
            ? vu
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(fs)
            ? fs
            : this._anyControlsHaveStatus(vu)
            ? vu
            : ko;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((r) => r.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          yu(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(t) {
          return null;
        }
        _assignValidators(t) {
          (this._rawValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedValidatorFn = (function m2(e) {
              return Array.isArray(e) ? np(e) : e || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(t) {
          (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedAsyncValidatorFn = (function v2(e) {
              return Array.isArray(e) ? rp(e) : e || null;
            })(this._rawAsyncValidators));
        }
      }
      class hs extends Nb {
        constructor(t, r, n) {
          super(ap(r), lp(n, r)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(r),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(t, r) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = r),
              r.setParent(this),
              r._registerOnCollectionChange(this._onCollectionChange),
              r);
        }
        addControl(t, r, n = {}) {
          this.registerControl(t, r),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(t, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        setControl(t, r, n = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            r && this.registerControl(t, r),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        contains(t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
        }
        setValue(t, r = {}) {
          (function Ab(e, t, r) {
            e._forEachChild((n, i) => {
              if (void 0 === r[i]) throw new C(1002, "");
            });
          })(this, 0, t),
            Object.keys(t).forEach((n) => {
              (function Tb(e, t, r) {
                const n = e.controls;
                if (!(t ? Object.keys(n) : n).length) throw new C(1e3, "");
                if (!n[r]) throw new C(1001, "");
              })(this, !0, n),
                this.controls[n].setValue(t[n], {
                  onlySelf: !0,
                  emitEvent: r.emitEvent,
                });
            }),
            this.updateValueAndValidity(r);
        }
        patchValue(t, r = {}) {
          null != t &&
            (Object.keys(t).forEach((n) => {
              const i = this.controls[n];
              i && i.patchValue(t[n], { onlySelf: !0, emitEvent: r.emitEvent });
            }),
            this.updateValueAndValidity(r));
        }
        reset(t = {}, r = {}) {
          this._forEachChild((n, i) => {
            n.reset(t[i], { onlySelf: !0, emitEvent: r.emitEvent });
          }),
            this._updatePristine(r),
            this._updateTouched(r),
            this.updateValueAndValidity(r);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (t, r, n) => ((t[n] = r.getRawValue()), t)
          );
        }
        _syncPendingControls() {
          let t = this._reduceChildren(
            !1,
            (r, n) => !!n._syncPendingControls() || r
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          Object.keys(this.controls).forEach((r) => {
            const n = this.controls[r];
            n && t(n, r);
          });
        }
        _setUpControls() {
          this._forEachChild((t) => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(t) {
          for (const [r, n] of Object.entries(this.controls))
            if (this.contains(r) && t(n)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (r, n, i) => ((n.enabled || this.disabled) && (r[i] = n.value), r)
          );
        }
        _reduceChildren(t, r) {
          let n = t;
          return (
            this._forEachChild((i, s) => {
              n = r(n, i, s);
            }),
            n
          );
        }
        _allControlsDisabled() {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(t) {
          return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
        }
      }
      const ps = new O("CallSetDisabledState", {
          providedIn: "root",
          factory: () => _u,
        }),
        _u = "always";
      function Vo(e, t, r = _u) {
        up(e, t),
          t.valueAccessor.writeValue(e.value),
          (e.disabled || "always" === r) &&
            t.valueAccessor.setDisabledState?.(e.disabled),
          (function D2(e, t) {
            t.valueAccessor.registerOnChange((r) => {
              (e._pendingValue = r),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && Rb(e, t);
            });
          })(e, t),
          (function w2(e, t) {
            const r = (n, i) => {
              t.valueAccessor.writeValue(n), i && t.viewToModelUpdate(n);
            };
            e.registerOnChange(r),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(r);
              });
          })(e, t),
          (function C2(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && Rb(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function _2(e, t) {
            if (t.valueAccessor.setDisabledState) {
              const r = (n) => {
                t.valueAccessor.setDisabledState(n);
              };
              e.registerOnDisabledChange(r),
                t._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(r);
                });
            }
          })(e, t);
      }
      function Cu(e, t, r = !0) {
        const n = () => {};
        t.valueAccessor &&
          (t.valueAccessor.registerOnChange(n),
          t.valueAccessor.registerOnTouched(n)),
          Eu(e, t),
          e &&
            (t._invokeOnDestroyCallbacks(),
            e._registerOnCollectionChange(() => {}));
      }
      function wu(e, t) {
        e.forEach((r) => {
          r.registerOnValidatorChange && r.registerOnValidatorChange(t);
        });
      }
      function up(e, t) {
        const r = Cb(e);
        null !== t.validator
          ? e.setValidators(Db(r, t.validator))
          : "function" == typeof r && e.setValidators([r]);
        const n = wb(e);
        null !== t.asyncValidator
          ? e.setAsyncValidators(Db(n, t.asyncValidator))
          : "function" == typeof n && e.setAsyncValidators([n]);
        const i = () => e.updateValueAndValidity();
        wu(t._rawValidators, i), wu(t._rawAsyncValidators, i);
      }
      function Eu(e, t) {
        let r = !1;
        if (null !== e) {
          if (null !== t.validator) {
            const i = Cb(e);
            if (Array.isArray(i) && i.length > 0) {
              const s = i.filter((o) => o !== t.validator);
              s.length !== i.length && ((r = !0), e.setValidators(s));
            }
          }
          if (null !== t.asyncValidator) {
            const i = wb(e);
            if (Array.isArray(i) && i.length > 0) {
              const s = i.filter((o) => o !== t.asyncValidator);
              s.length !== i.length && ((r = !0), e.setAsyncValidators(s));
            }
          }
        }
        const n = () => {};
        return wu(t._rawValidators, n), wu(t._rawAsyncValidators, n), r;
      }
      function Rb(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function xb(e, t) {
        const r = e.indexOf(t);
        r > -1 && e.splice(r, 1);
      }
      function Fb(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const Yt = class extends Nb {
        constructor(t = null, r, n) {
          super(ap(r), lp(n, r)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(t),
            this._setUpdateStrategy(r),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            yu(r) &&
              (r.nonNullable || r.initialValueIsDefault) &&
              (this.defaultValue = Fb(t) ? t.value : t);
        }
        setValue(t, r = {}) {
          (this.value = this._pendingValue = t),
            this._onChange.length &&
              !1 !== r.emitModelToViewChange &&
              this._onChange.forEach((n) =>
                n(this.value, !1 !== r.emitViewToModelChange)
              ),
            this.updateValueAndValidity(r);
        }
        patchValue(t, r = {}) {
          this.setValue(t, r);
        }
        reset(t = this.defaultValue, r = {}) {
          this._applyFormState(t),
            this.markAsPristine(r),
            this.markAsUntouched(r),
            this.setValue(this.value, r),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(t) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(t) {
          this._onChange.push(t);
        }
        _unregisterOnChange(t) {
          xb(this._onChange, t);
        }
        registerOnDisabledChange(t) {
          this._onDisabledChange.push(t);
        }
        _unregisterOnDisabledChange(t) {
          xb(this._onDisabledChange, t);
        }
        _forEachChild(t) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(t) {
          Fb(t)
            ? ((this.value = this._pendingValue = t.value),
              t.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = t);
        }
      };
      let bu = (() => {
          var e;
          class t {}
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = B({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            t
          );
        })(),
        Bb = (() => {
          var e;
          class t {}
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Nt({ type: e })),
            (e.ɵinj = yt({})),
            t
          );
        })();
      const pp = new O("NgModelWithFormControlWarning"),
        k2 = { provide: mt, useExisting: _e(() => gs) };
      let gs = (() => {
        var e;
        class t extends mt {
          constructor(n, i, s) {
            super(),
              (this.callSetDisabledState = s),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new ve()),
              this._setValidators(n),
              this._setAsyncValidators(i);
          }
          ngOnChanges(n) {
            this._checkFormPresent(),
              n.hasOwnProperty("form") &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (Eu(this.form, this),
              this.form._onCollectionChange === this._onCollectionChange &&
                this.form._registerOnCollectionChange(() => {}));
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          addControl(n) {
            const i = this.form.get(n.path);
            return (
              Vo(i, n, this.callSetDisabledState),
              i.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(n),
              i
            );
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            Cu(n.control || null, n, !1),
              (function M2(e, t) {
                const r = e.indexOf(t);
                r > -1 && e.splice(r, 1);
              })(this.directives, n);
          }
          addFormGroup(n) {
            this._setUpFormContainer(n);
          }
          removeFormGroup(n) {
            this._cleanUpFormContainer(n);
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          addFormArray(n) {
            this._setUpFormContainer(n);
          }
          removeFormArray(n) {
            this._cleanUpFormContainer(n);
          }
          getFormArray(n) {
            return this.form.get(n.path);
          }
          updateModel(n, i) {
            this.form.get(n.path).setValue(i);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function Ob(e, t) {
                e._syncPendingControls(),
                  t.forEach((r) => {
                    const n = r.control;
                    "submit" === n.updateOn &&
                      n._pendingChange &&
                      (r.viewToModelUpdate(n._pendingValue),
                      (n._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(n),
              "dialog" === n?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n = void 0) {
            this.form.reset(n), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((n) => {
              const i = n.control,
                s = this.form.get(n.path);
              i !== s &&
                (Cu(i || null, n),
                ((e) => e instanceof Yt)(s) &&
                  (Vo(s, n, this.callSetDisabledState), (n.control = s)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(n) {
            const i = this.form.get(n.path);
            (function Pb(e, t) {
              up(e, t);
            })(i, n),
              i.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(n) {
            if (this.form) {
              const i = this.form.get(n.path);
              i &&
                (function E2(e, t) {
                  return Eu(e, t);
                })(i, n) &&
                i.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            up(this.form, this), this._oldForm && Eu(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(nt, 10), _(Mr, 10), _(ps, 8));
          }),
          (e.ɵdir = B({
            type: e,
            selectors: [["", "formGroup", ""]],
            hostBindings: function (n, i) {
              1 & n &&
                ce("submit", function (o) {
                  return i.onSubmit(o);
                })("reset", function () {
                  return i.onReset();
                });
            },
            inputs: { form: ["formGroup", "form"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [Se([k2]), fe, Pt],
          })),
          t
        );
      })();
      const j2 = { provide: Ir, useExisting: _e(() => $o) };
      let $o = (() => {
          var e;
          class t extends Ir {
            set isDisabled(n) {}
            constructor(n, i, s, o, a) {
              super(),
                (this._ngModelWarningConfig = a),
                (this._added = !1),
                (this.name = null),
                (this.update = new ve()),
                (this._ngModelWarningSent = !1),
                (this._parent = n),
                this._setValidators(i),
                this._setAsyncValidators(s),
                (this.valueAccessor = (function fp(e, t) {
                  if (!t) return null;
                  let r, n, i;
                  return (
                    Array.isArray(t),
                    t.forEach((s) => {
                      s.constructor === ds
                        ? (r = s)
                        : (function S2(e) {
                            return Object.getPrototypeOf(e.constructor) === ei;
                          })(s)
                        ? (n = s)
                        : (i = s);
                    }),
                    i || n || r || null
                  );
                })(0, o));
            }
            ngOnChanges(n) {
              this._added || this._setUpControl(),
                (function dp(e, t) {
                  if (!e.hasOwnProperty("model")) return !1;
                  const r = e.model;
                  return !!r.isFirstChange() || !Object.is(t, r.currentValue);
                })(n, this.viewModel) &&
                  ((this.viewModel = this.model),
                  this.formDirective.updateModel(this, this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            get path() {
              return (function Du(e, t) {
                return [...t.path, e];
              })(
                null == this.name ? this.name : this.name.toString(),
                this._parent
              );
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            _checkParentType() {}
            _setUpControl() {
              this._checkParentType(),
                (this.control = this.formDirective.addControl(this)),
                (this._added = !0);
            }
          }
          return (
            ((e = t)._ngModelWarningSentOnce = !1),
            (e.ɵfac = function (n) {
              return new (n || e)(
                _(mt, 13),
                _(nt, 10),
                _(Mr, 10),
                _(On, 10),
                _(pp, 8)
              );
            }),
            (e.ɵdir = B({
              type: e,
              selectors: [["", "formControlName", ""]],
              inputs: {
                name: ["formControlName", "name"],
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
              },
              outputs: { update: "ngModelChange" },
              features: [Se([j2]), fe, Pt],
            })),
            t
          );
        })(),
        ej = (() => {
          var e;
          class t {}
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Nt({ type: e })),
            (e.ɵinj = yt({ imports: [Bb] })),
            t
          );
        })(),
        nj = (() => {
          var e;
          class t {
            static withConfig(n) {
              return {
                ngModule: t,
                providers: [
                  {
                    provide: pp,
                    useValue: n.warnOnNgModelWithFormControl ?? "always",
                  },
                  { provide: ps, useValue: n.callSetDisabledState ?? _u },
                ],
              };
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Nt({ type: e })),
            (e.ɵinj = yt({ imports: [ej] })),
            t
          );
        })();
      class rS {}
      class rj {}
      const er = "*";
      function ij(e, t) {
        return { type: 7, name: e, definitions: t, options: {} };
      }
      function iS(e, t = null) {
        return { type: 4, styles: t, timings: e };
      }
      function sS(e, t = null) {
        return { type: 2, steps: e, options: t };
      }
      function Su(e) {
        return { type: 6, styles: e, offset: null };
      }
      function oS(e, t, r) {
        return { type: 0, name: e, styles: t, options: r };
      }
      function aS(e, t, r = null) {
        return { type: 1, expr: e, animation: t, options: r };
      }
      class Bo {
        constructor(t = 0, r = 0) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this._started = !1),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._position = 0),
            (this.parentPlayer = null),
            (this.totalTime = t + r);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
            (this._started = !0);
        }
        triggerMicrotask() {
          queueMicrotask(() => this._onFinish());
        }
        _onStart() {
          this._onStartFns.forEach((t) => t()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish();
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.hasStarted() || this._onStart(),
            this.finish(),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          (this._started = !1),
            (this._finished = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        setPosition(t) {
          this._position = this.totalTime ? t * this.totalTime : 1;
        }
        getPosition() {
          return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(t) {
          const r = "start" == t ? this._onStartFns : this._onDoneFns;
          r.forEach((n) => n()), (r.length = 0);
        }
      }
      class lS {
        constructor(t) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._onDestroyFns = []),
            (this.parentPlayer = null),
            (this.totalTime = 0),
            (this.players = t);
          let r = 0,
            n = 0,
            i = 0;
          const s = this.players.length;
          0 == s
            ? queueMicrotask(() => this._onFinish())
            : this.players.forEach((o) => {
                o.onDone(() => {
                  ++r == s && this._onFinish();
                }),
                  o.onDestroy(() => {
                    ++n == s && this._onDestroy();
                  }),
                  o.onStart(() => {
                    ++i == s && this._onStart();
                  });
              }),
            (this.totalTime = this.players.reduce(
              (o, a) => Math.max(o, a.totalTime),
              0
            ));
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        init() {
          this.players.forEach((t) => t.init());
        }
        onStart(t) {
          this._onStartFns.push(t);
        }
        _onStart() {
          this.hasStarted() ||
            ((this._started = !0),
            this._onStartFns.forEach((t) => t()),
            (this._onStartFns = []));
        }
        onDone(t) {
          this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this.parentPlayer || this.init(),
            this._onStart(),
            this.players.forEach((t) => t.play());
        }
        pause() {
          this.players.forEach((t) => t.pause());
        }
        restart() {
          this.players.forEach((t) => t.restart());
        }
        finish() {
          this._onFinish(), this.players.forEach((t) => t.finish());
        }
        destroy() {
          this._onDestroy();
        }
        _onDestroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._onFinish(),
            this.players.forEach((t) => t.destroy()),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          this.players.forEach((t) => t.reset()),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1);
        }
        setPosition(t) {
          const r = t * this.totalTime;
          this.players.forEach((n) => {
            const i = n.totalTime ? Math.min(1, r / n.totalTime) : 1;
            n.setPosition(i);
          });
        }
        getPosition() {
          const t = this.players.reduce(
            (r, n) => (null === r || n.totalTime > r.totalTime ? n : r),
            null
          );
          return null != t ? t.getPosition() : 0;
        }
        beforeDestroy() {
          this.players.forEach((t) => {
            t.beforeDestroy && t.beforeDestroy();
          });
        }
        triggerCallback(t) {
          const r = "start" == t ? this._onStartFns : this._onDoneFns;
          r.forEach((n) => n()), (r.length = 0);
        }
      }
      function uS(e) {
        return new C(3e3, !1);
      }
      function Tr(e) {
        switch (e.length) {
          case 0:
            return new Bo();
          case 1:
            return e[0];
          default:
            return new lS(e);
        }
      }
      function cS(e, t, r = new Map(), n = new Map()) {
        const i = [],
          s = [];
        let o = -1,
          a = null;
        if (
          (t.forEach((l) => {
            const u = l.get("offset"),
              c = u == o,
              d = (c && a) || new Map();
            l.forEach((f, h) => {
              let g = h,
                m = f;
              if ("offset" !== h)
                switch (((g = e.normalizePropertyName(g, i)), m)) {
                  case "!":
                    m = r.get(h);
                    break;
                  case er:
                    m = n.get(h);
                    break;
                  default:
                    m = e.normalizeStyleValue(h, g, m, i);
                }
              d.set(g, m);
            }),
              c || s.push(d),
              (a = d),
              (o = u);
          }),
          i.length)
        )
          throw (function Ij(e) {
            return new C(3502, !1);
          })();
        return s;
      }
      function Cp(e, t, r, n) {
        switch (t) {
          case "start":
            e.onStart(() => n(r && wp(r, "start", e)));
            break;
          case "done":
            e.onDone(() => n(r && wp(r, "done", e)));
            break;
          case "destroy":
            e.onDestroy(() => n(r && wp(r, "destroy", e)));
        }
      }
      function wp(e, t, r) {
        const s = Ep(
            e.element,
            e.triggerName,
            e.fromState,
            e.toState,
            t || e.phaseName,
            r.totalTime ?? e.totalTime,
            !!r.disabled
          ),
          o = e._data;
        return null != o && (s._data = o), s;
      }
      function Ep(e, t, r, n, i = "", s = 0, o) {
        return {
          element: e,
          triggerName: t,
          fromState: r,
          toState: n,
          phaseName: i,
          totalTime: s,
          disabled: !!o,
        };
      }
      function $t(e, t, r) {
        let n = e.get(t);
        return n || e.set(t, (n = r)), n;
      }
      function dS(e) {
        const t = e.indexOf(":");
        return [e.substring(1, t), e.slice(t + 1)];
      }
      const jj = (() =>
        typeof document > "u" ? null : document.documentElement)();
      function bp(e) {
        const t = e.parentNode || e.host || null;
        return t === jj ? null : t;
      }
      let ni = null,
        fS = !1;
      function hS(e, t) {
        for (; t; ) {
          if (t === e) return !0;
          t = bp(t);
        }
        return !1;
      }
      function pS(e, t, r) {
        if (r) return Array.from(e.querySelectorAll(t));
        const n = e.querySelector(t);
        return n ? [n] : [];
      }
      let gS = (() => {
          var e;
          class t {
            validateStyleProperty(n) {
              return (function Bj(e) {
                ni ||
                  ((ni =
                    (function Hj() {
                      return typeof document < "u" ? document.body : null;
                    })() || {}),
                  (fS = !!ni.style && "WebkitAppearance" in ni.style));
                let t = !0;
                return (
                  ni.style &&
                    !(function $j(e) {
                      return "ebkit" == e.substring(1, 6);
                    })(e) &&
                    ((t = e in ni.style),
                    !t &&
                      fS &&
                      (t =
                        "Webkit" + e.charAt(0).toUpperCase() + e.slice(1) in
                        ni.style)),
                  t
                );
              })(n);
            }
            matchesElement(n, i) {
              return !1;
            }
            containsElement(n, i) {
              return hS(n, i);
            }
            getParentElement(n) {
              return bp(n);
            }
            query(n, i, s) {
              return pS(n, i, s);
            }
            computeStyle(n, i, s) {
              return s || "";
            }
            animate(n, i, s, o, a, l = [], u) {
              return new Bo(s, o);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        Sp = (() => {
          class t {}
          return (t.NOOP = new gS()), t;
        })();
      const Uj = 1e3,
        Mp = "ng-enter",
        Mu = "ng-leave",
        Iu = "ng-trigger",
        Tu = ".ng-trigger",
        vS = "ng-animating",
        Ip = ".ng-animating";
      function tr(e) {
        if ("number" == typeof e) return e;
        const t = e.match(/^(-?[\.\d]+)(m?s)/);
        return !t || t.length < 2 ? 0 : Tp(parseFloat(t[1]), t[2]);
      }
      function Tp(e, t) {
        return "s" === t ? e * Uj : e;
      }
      function Au(e, t, r) {
        return e.hasOwnProperty("duration")
          ? e
          : (function qj(e, t, r) {
              let i,
                s = 0,
                o = "";
              if ("string" == typeof e) {
                const a = e.match(
                  /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i
                );
                if (null === a)
                  return t.push(uS()), { duration: 0, delay: 0, easing: "" };
                i = Tp(parseFloat(a[1]), a[2]);
                const l = a[3];
                null != l && (s = Tp(parseFloat(l), a[4]));
                const u = a[5];
                u && (o = u);
              } else i = e;
              if (!r) {
                let a = !1,
                  l = t.length;
                i < 0 &&
                  (t.push(
                    (function sj() {
                      return new C(3100, !1);
                    })()
                  ),
                  (a = !0)),
                  s < 0 &&
                    (t.push(
                      (function oj() {
                        return new C(3101, !1);
                      })()
                    ),
                    (a = !0)),
                  a && t.splice(l, 0, uS());
              }
              return { duration: i, delay: s, easing: o };
            })(e, t, r);
      }
      function Ho(e, t = {}) {
        return (
          Object.keys(e).forEach((r) => {
            t[r] = e[r];
          }),
          t
        );
      }
      function yS(e) {
        const t = new Map();
        return (
          Object.keys(e).forEach((r) => {
            t.set(r, e[r]);
          }),
          t
        );
      }
      function Ar(e, t = new Map(), r) {
        if (r) for (let [n, i] of r) t.set(n, i);
        for (let [n, i] of e) t.set(n, i);
        return t;
      }
      function xn(e, t, r) {
        t.forEach((n, i) => {
          const s = Np(i);
          r && !r.has(i) && r.set(i, e.style[s]), (e.style[s] = n);
        });
      }
      function ri(e, t) {
        t.forEach((r, n) => {
          const i = Np(n);
          e.style[i] = "";
        });
      }
      function Uo(e) {
        return Array.isArray(e) ? (1 == e.length ? e[0] : sS(e)) : e;
      }
      const Ap = new RegExp("{{\\s*(.+?)\\s*}}", "g");
      function DS(e) {
        let t = [];
        if ("string" == typeof e) {
          let r;
          for (; (r = Ap.exec(e)); ) t.push(r[1]);
          Ap.lastIndex = 0;
        }
        return t;
      }
      function zo(e, t, r) {
        const n = e.toString(),
          i = n.replace(Ap, (s, o) => {
            let a = t[o];
            return (
              null == a &&
                (r.push(
                  (function lj(e) {
                    return new C(3003, !1);
                  })()
                ),
                (a = "")),
              a.toString()
            );
          });
        return i == n ? e : i;
      }
      function Nu(e) {
        const t = [];
        let r = e.next();
        for (; !r.done; ) t.push(r.value), (r = e.next());
        return t;
      }
      const Qj = /-+([a-z0-9])/g;
      function Np(e) {
        return e.replace(Qj, (...t) => t[1].toUpperCase());
      }
      function Bt(e, t, r) {
        switch (t.type) {
          case 7:
            return e.visitTrigger(t, r);
          case 0:
            return e.visitState(t, r);
          case 1:
            return e.visitTransition(t, r);
          case 2:
            return e.visitSequence(t, r);
          case 3:
            return e.visitGroup(t, r);
          case 4:
            return e.visitAnimate(t, r);
          case 5:
            return e.visitKeyframes(t, r);
          case 6:
            return e.visitStyle(t, r);
          case 8:
            return e.visitReference(t, r);
          case 9:
            return e.visitAnimateChild(t, r);
          case 10:
            return e.visitAnimateRef(t, r);
          case 11:
            return e.visitQuery(t, r);
          case 12:
            return e.visitStagger(t, r);
          default:
            throw (function uj(e) {
              return new C(3004, !1);
            })();
        }
      }
      function CS(e, t) {
        return window.getComputedStyle(e)[t];
      }
      const Ru = "*";
      function Yj(e, t) {
        const r = [];
        return (
          "string" == typeof e
            ? e.split(/\s*,\s*/).forEach((n) =>
                (function Xj(e, t, r) {
                  if (":" == e[0]) {
                    const l = (function Jj(e, t) {
                      switch (e) {
                        case ":enter":
                          return "void => *";
                        case ":leave":
                          return "* => void";
                        case ":increment":
                          return (r, n) => parseFloat(n) > parseFloat(r);
                        case ":decrement":
                          return (r, n) => parseFloat(n) < parseFloat(r);
                        default:
                          return (
                            t.push(
                              (function Ej(e) {
                                return new C(3016, !1);
                              })()
                            ),
                            "* => *"
                          );
                      }
                    })(e, r);
                    if ("function" == typeof l) return void t.push(l);
                    e = l;
                  }
                  const n = e.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                  if (null == n || n.length < 4)
                    return (
                      r.push(
                        (function wj(e) {
                          return new C(3015, !1);
                        })()
                      ),
                      t
                    );
                  const i = n[1],
                    s = n[2],
                    o = n[3];
                  t.push(wS(i, o));
                  "<" == s[0] && !(i == Ru && o == Ru) && t.push(wS(o, i));
                })(n, r, t)
              )
            : r.push(e),
          r
        );
      }
      const Pu = new Set(["true", "1"]),
        Ou = new Set(["false", "0"]);
      function wS(e, t) {
        const r = Pu.has(e) || Ou.has(e),
          n = Pu.has(t) || Ou.has(t);
        return (i, s) => {
          let o = e == Ru || e == i,
            a = t == Ru || t == s;
          return (
            !o && r && "boolean" == typeof i && (o = i ? Pu.has(e) : Ou.has(e)),
            !a && n && "boolean" == typeof s && (a = s ? Pu.has(t) : Ou.has(t)),
            o && a
          );
        };
      }
      const e$ = new RegExp("s*:selfs*,?", "g");
      function Rp(e, t, r, n) {
        return new t$(e).build(t, r, n);
      }
      class t$ {
        constructor(t) {
          this._driver = t;
        }
        build(t, r, n) {
          const i = new i$(r);
          return this._resetContextStyleTimingState(i), Bt(this, Uo(t), i);
        }
        _resetContextStyleTimingState(t) {
          (t.currentQuerySelector = ""),
            (t.collectedStyles = new Map()),
            t.collectedStyles.set("", new Map()),
            (t.currentTime = 0);
        }
        visitTrigger(t, r) {
          let n = (r.queryCount = 0),
            i = (r.depCount = 0);
          const s = [],
            o = [];
          return (
            "@" == t.name.charAt(0) &&
              r.errors.push(
                (function dj() {
                  return new C(3006, !1);
                })()
              ),
            t.definitions.forEach((a) => {
              if ((this._resetContextStyleTimingState(r), 0 == a.type)) {
                const l = a,
                  u = l.name;
                u
                  .toString()
                  .split(/\s*,\s*/)
                  .forEach((c) => {
                    (l.name = c), s.push(this.visitState(l, r));
                  }),
                  (l.name = u);
              } else if (1 == a.type) {
                const l = this.visitTransition(a, r);
                (n += l.queryCount), (i += l.depCount), o.push(l);
              } else
                r.errors.push(
                  (function fj() {
                    return new C(3007, !1);
                  })()
                );
            }),
            {
              type: 7,
              name: t.name,
              states: s,
              transitions: o,
              queryCount: n,
              depCount: i,
              options: null,
            }
          );
        }
        visitState(t, r) {
          const n = this.visitStyle(t.styles, r),
            i = (t.options && t.options.params) || null;
          if (n.containsDynamicStyles) {
            const s = new Set(),
              o = i || {};
            n.styles.forEach((a) => {
              a instanceof Map &&
                a.forEach((l) => {
                  DS(l).forEach((u) => {
                    o.hasOwnProperty(u) || s.add(u);
                  });
                });
            }),
              s.size &&
                (Nu(s.values()),
                r.errors.push(
                  (function hj(e, t) {
                    return new C(3008, !1);
                  })()
                ));
          }
          return {
            type: 0,
            name: t.name,
            style: n,
            options: i ? { params: i } : null,
          };
        }
        visitTransition(t, r) {
          (r.queryCount = 0), (r.depCount = 0);
          const n = Bt(this, Uo(t.animation), r);
          return {
            type: 1,
            matchers: Yj(t.expr, r.errors),
            animation: n,
            queryCount: r.queryCount,
            depCount: r.depCount,
            options: ii(t.options),
          };
        }
        visitSequence(t, r) {
          return {
            type: 2,
            steps: t.steps.map((n) => Bt(this, n, r)),
            options: ii(t.options),
          };
        }
        visitGroup(t, r) {
          const n = r.currentTime;
          let i = 0;
          const s = t.steps.map((o) => {
            r.currentTime = n;
            const a = Bt(this, o, r);
            return (i = Math.max(i, r.currentTime)), a;
          });
          return (
            (r.currentTime = i), { type: 3, steps: s, options: ii(t.options) }
          );
        }
        visitAnimate(t, r) {
          const n = (function o$(e, t) {
            if (e.hasOwnProperty("duration")) return e;
            if ("number" == typeof e) return Pp(Au(e, t).duration, 0, "");
            const r = e;
            if (
              r
                .split(/\s+/)
                .some((s) => "{" == s.charAt(0) && "{" == s.charAt(1))
            ) {
              const s = Pp(0, 0, "");
              return (s.dynamic = !0), (s.strValue = r), s;
            }
            const i = Au(r, t);
            return Pp(i.duration, i.delay, i.easing);
          })(t.timings, r.errors);
          r.currentAnimateTimings = n;
          let i,
            s = t.styles ? t.styles : Su({});
          if (5 == s.type) i = this.visitKeyframes(s, r);
          else {
            let o = t.styles,
              a = !1;
            if (!o) {
              a = !0;
              const u = {};
              n.easing && (u.easing = n.easing), (o = Su(u));
            }
            r.currentTime += n.duration + n.delay;
            const l = this.visitStyle(o, r);
            (l.isEmptyStep = a), (i = l);
          }
          return (
            (r.currentAnimateTimings = null),
            { type: 4, timings: n, style: i, options: null }
          );
        }
        visitStyle(t, r) {
          const n = this._makeStyleAst(t, r);
          return this._validateStyleAst(n, r), n;
        }
        _makeStyleAst(t, r) {
          const n = [],
            i = Array.isArray(t.styles) ? t.styles : [t.styles];
          for (let a of i)
            "string" == typeof a
              ? a === er
                ? n.push(a)
                : r.errors.push(new C(3002, !1))
              : n.push(yS(a));
          let s = !1,
            o = null;
          return (
            n.forEach((a) => {
              if (
                a instanceof Map &&
                (a.has("easing") && ((o = a.get("easing")), a.delete("easing")),
                !s)
              )
                for (let l of a.values())
                  if (l.toString().indexOf("{{") >= 0) {
                    s = !0;
                    break;
                  }
            }),
            {
              type: 6,
              styles: n,
              easing: o,
              offset: t.offset,
              containsDynamicStyles: s,
              options: null,
            }
          );
        }
        _validateStyleAst(t, r) {
          const n = r.currentAnimateTimings;
          let i = r.currentTime,
            s = r.currentTime;
          n && s > 0 && (s -= n.duration + n.delay),
            t.styles.forEach((o) => {
              "string" != typeof o &&
                o.forEach((a, l) => {
                  const u = r.collectedStyles.get(r.currentQuerySelector),
                    c = u.get(l);
                  let d = !0;
                  c &&
                    (s != i &&
                      s >= c.startTime &&
                      i <= c.endTime &&
                      (r.errors.push(
                        (function gj(e, t, r, n, i) {
                          return new C(3010, !1);
                        })()
                      ),
                      (d = !1)),
                    (s = c.startTime)),
                    d && u.set(l, { startTime: s, endTime: i }),
                    r.options &&
                      (function Wj(e, t, r) {
                        const n = t.params || {},
                          i = DS(e);
                        i.length &&
                          i.forEach((s) => {
                            n.hasOwnProperty(s) ||
                              r.push(
                                (function aj(e) {
                                  return new C(3001, !1);
                                })()
                              );
                          });
                      })(a, r.options, r.errors);
                });
            });
        }
        visitKeyframes(t, r) {
          const n = { type: 5, styles: [], options: null };
          if (!r.currentAnimateTimings)
            return (
              r.errors.push(
                (function mj() {
                  return new C(3011, !1);
                })()
              ),
              n
            );
          let s = 0;
          const o = [];
          let a = !1,
            l = !1,
            u = 0;
          const c = t.steps.map((D) => {
            const v = this._makeStyleAst(D, r);
            let A =
                null != v.offset
                  ? v.offset
                  : (function s$(e) {
                      if ("string" == typeof e) return null;
                      let t = null;
                      if (Array.isArray(e))
                        e.forEach((r) => {
                          if (r instanceof Map && r.has("offset")) {
                            const n = r;
                            (t = parseFloat(n.get("offset"))),
                              n.delete("offset");
                          }
                        });
                      else if (e instanceof Map && e.has("offset")) {
                        const r = e;
                        (t = parseFloat(r.get("offset"))), r.delete("offset");
                      }
                      return t;
                    })(v.styles),
              I = 0;
            return (
              null != A && (s++, (I = v.offset = A)),
              (l = l || I < 0 || I > 1),
              (a = a || I < u),
              (u = I),
              o.push(I),
              v
            );
          });
          l &&
            r.errors.push(
              (function vj() {
                return new C(3012, !1);
              })()
            ),
            a &&
              r.errors.push(
                (function yj() {
                  return new C(3200, !1);
                })()
              );
          const d = t.steps.length;
          let f = 0;
          s > 0 && s < d
            ? r.errors.push(
                (function _j() {
                  return new C(3202, !1);
                })()
              )
            : 0 == s && (f = 1 / (d - 1));
          const h = d - 1,
            g = r.currentTime,
            m = r.currentAnimateTimings,
            y = m.duration;
          return (
            c.forEach((D, v) => {
              const A = f > 0 ? (v == h ? 1 : f * v) : o[v],
                I = A * y;
              (r.currentTime = g + m.delay + I),
                (m.duration = I),
                this._validateStyleAst(D, r),
                (D.offset = A),
                n.styles.push(D);
            }),
            n
          );
        }
        visitReference(t, r) {
          return {
            type: 8,
            animation: Bt(this, Uo(t.animation), r),
            options: ii(t.options),
          };
        }
        visitAnimateChild(t, r) {
          return r.depCount++, { type: 9, options: ii(t.options) };
        }
        visitAnimateRef(t, r) {
          return {
            type: 10,
            animation: this.visitReference(t.animation, r),
            options: ii(t.options),
          };
        }
        visitQuery(t, r) {
          const n = r.currentQuerySelector,
            i = t.options || {};
          r.queryCount++, (r.currentQuery = t);
          const [s, o] = (function n$(e) {
            const t = !!e.split(/\s*,\s*/).find((r) => ":self" == r);
            return (
              t && (e = e.replace(e$, "")),
              (e = e
                .replace(/@\*/g, Tu)
                .replace(/@\w+/g, (r) => Tu + "-" + r.slice(1))
                .replace(/:animating/g, Ip)),
              [e, t]
            );
          })(t.selector);
          (r.currentQuerySelector = n.length ? n + " " + s : s),
            $t(r.collectedStyles, r.currentQuerySelector, new Map());
          const a = Bt(this, Uo(t.animation), r);
          return (
            (r.currentQuery = null),
            (r.currentQuerySelector = n),
            {
              type: 11,
              selector: s,
              limit: i.limit || 0,
              optional: !!i.optional,
              includeSelf: o,
              animation: a,
              originalSelector: t.selector,
              options: ii(t.options),
            }
          );
        }
        visitStagger(t, r) {
          r.currentQuery ||
            r.errors.push(
              (function Dj() {
                return new C(3013, !1);
              })()
            );
          const n =
            "full" === t.timings
              ? { duration: 0, delay: 0, easing: "full" }
              : Au(t.timings, r.errors, !0);
          return {
            type: 12,
            animation: Bt(this, Uo(t.animation), r),
            timings: n,
            options: null,
          };
        }
      }
      class i$ {
        constructor(t) {
          (this.errors = t),
            (this.queryCount = 0),
            (this.depCount = 0),
            (this.currentTransition = null),
            (this.currentQuery = null),
            (this.currentQuerySelector = null),
            (this.currentAnimateTimings = null),
            (this.currentTime = 0),
            (this.collectedStyles = new Map()),
            (this.options = null),
            (this.unsupportedCSSPropertiesFound = new Set());
        }
      }
      function ii(e) {
        return (
          e
            ? (e = Ho(e)).params &&
              (e.params = (function r$(e) {
                return e ? Ho(e) : null;
              })(e.params))
            : (e = {}),
          e
        );
      }
      function Pp(e, t, r) {
        return { duration: e, delay: t, easing: r };
      }
      function Op(e, t, r, n, i, s, o = null, a = !1) {
        return {
          type: 1,
          element: e,
          keyframes: t,
          preStyleProps: r,
          postStyleProps: n,
          duration: i,
          delay: s,
          totalTime: i + s,
          easing: o,
          subTimeline: a,
        };
      }
      class xu {
        constructor() {
          this._map = new Map();
        }
        get(t) {
          return this._map.get(t) || [];
        }
        append(t, r) {
          let n = this._map.get(t);
          n || this._map.set(t, (n = [])), n.push(...r);
        }
        has(t) {
          return this._map.has(t);
        }
        clear() {
          this._map.clear();
        }
      }
      const u$ = new RegExp(":enter", "g"),
        d$ = new RegExp(":leave", "g");
      function xp(e, t, r, n, i, s = new Map(), o = new Map(), a, l, u = []) {
        return new f$().buildKeyframes(e, t, r, n, i, s, o, a, l, u);
      }
      class f$ {
        buildKeyframes(t, r, n, i, s, o, a, l, u, c = []) {
          u = u || new xu();
          const d = new Fp(t, r, u, i, s, c, []);
          d.options = l;
          const f = l.delay ? tr(l.delay) : 0;
          d.currentTimeline.delayNextStep(f),
            d.currentTimeline.setStyles([o], null, d.errors, l),
            Bt(this, n, d);
          const h = d.timelines.filter((g) => g.containsAnimation());
          if (h.length && a.size) {
            let g;
            for (let m = h.length - 1; m >= 0; m--) {
              const y = h[m];
              if (y.element === r) {
                g = y;
                break;
              }
            }
            g &&
              !g.allowOnlyTimelineStyles() &&
              g.setStyles([a], null, d.errors, l);
          }
          return h.length
            ? h.map((g) => g.buildKeyframes())
            : [Op(r, [], [], [], 0, f, "", !1)];
        }
        visitTrigger(t, r) {}
        visitState(t, r) {}
        visitTransition(t, r) {}
        visitAnimateChild(t, r) {
          const n = r.subInstructions.get(r.element);
          if (n) {
            const i = r.createSubContext(t.options),
              s = r.currentTimeline.currentTime,
              o = this._visitSubInstructions(n, i, i.options);
            s != o && r.transformIntoNewTimeline(o);
          }
          r.previousNode = t;
        }
        visitAnimateRef(t, r) {
          const n = r.createSubContext(t.options);
          n.transformIntoNewTimeline(),
            this._applyAnimationRefDelays(
              [t.options, t.animation.options],
              r,
              n
            ),
            this.visitReference(t.animation, n),
            r.transformIntoNewTimeline(n.currentTimeline.currentTime),
            (r.previousNode = t);
        }
        _applyAnimationRefDelays(t, r, n) {
          for (const i of t) {
            const s = i?.delay;
            if (s) {
              const o =
                "number" == typeof s ? s : tr(zo(s, i?.params ?? {}, r.errors));
              n.delayNextStep(o);
            }
          }
        }
        _visitSubInstructions(t, r, n) {
          let s = r.currentTimeline.currentTime;
          const o = null != n.duration ? tr(n.duration) : null,
            a = null != n.delay ? tr(n.delay) : null;
          return (
            0 !== o &&
              t.forEach((l) => {
                const u = r.appendInstructionToTimeline(l, o, a);
                s = Math.max(s, u.duration + u.delay);
              }),
            s
          );
        }
        visitReference(t, r) {
          r.updateOptions(t.options, !0),
            Bt(this, t.animation, r),
            (r.previousNode = t);
        }
        visitSequence(t, r) {
          const n = r.subContextCount;
          let i = r;
          const s = t.options;
          if (
            s &&
            (s.params || s.delay) &&
            ((i = r.createSubContext(s)),
            i.transformIntoNewTimeline(),
            null != s.delay)
          ) {
            6 == i.previousNode.type &&
              (i.currentTimeline.snapshotCurrentStyles(),
              (i.previousNode = Fu));
            const o = tr(s.delay);
            i.delayNextStep(o);
          }
          t.steps.length &&
            (t.steps.forEach((o) => Bt(this, o, i)),
            i.currentTimeline.applyStylesToKeyframe(),
            i.subContextCount > n && i.transformIntoNewTimeline()),
            (r.previousNode = t);
        }
        visitGroup(t, r) {
          const n = [];
          let i = r.currentTimeline.currentTime;
          const s = t.options && t.options.delay ? tr(t.options.delay) : 0;
          t.steps.forEach((o) => {
            const a = r.createSubContext(t.options);
            s && a.delayNextStep(s),
              Bt(this, o, a),
              (i = Math.max(i, a.currentTimeline.currentTime)),
              n.push(a.currentTimeline);
          }),
            n.forEach((o) => r.currentTimeline.mergeTimelineCollectedStyles(o)),
            r.transformIntoNewTimeline(i),
            (r.previousNode = t);
        }
        _visitTiming(t, r) {
          if (t.dynamic) {
            const n = t.strValue;
            return Au(r.params ? zo(n, r.params, r.errors) : n, r.errors);
          }
          return { duration: t.duration, delay: t.delay, easing: t.easing };
        }
        visitAnimate(t, r) {
          const n = (r.currentAnimateTimings = this._visitTiming(t.timings, r)),
            i = r.currentTimeline;
          n.delay && (r.incrementTime(n.delay), i.snapshotCurrentStyles());
          const s = t.style;
          5 == s.type
            ? this.visitKeyframes(s, r)
            : (r.incrementTime(n.duration),
              this.visitStyle(s, r),
              i.applyStylesToKeyframe()),
            (r.currentAnimateTimings = null),
            (r.previousNode = t);
        }
        visitStyle(t, r) {
          const n = r.currentTimeline,
            i = r.currentAnimateTimings;
          !i && n.hasCurrentStyleProperties() && n.forwardFrame();
          const s = (i && i.easing) || t.easing;
          t.isEmptyStep
            ? n.applyEmptyStep(s)
            : n.setStyles(t.styles, s, r.errors, r.options),
            (r.previousNode = t);
        }
        visitKeyframes(t, r) {
          const n = r.currentAnimateTimings,
            i = r.currentTimeline.duration,
            s = n.duration,
            a = r.createSubContext().currentTimeline;
          (a.easing = n.easing),
            t.styles.forEach((l) => {
              a.forwardTime((l.offset || 0) * s),
                a.setStyles(l.styles, l.easing, r.errors, r.options),
                a.applyStylesToKeyframe();
            }),
            r.currentTimeline.mergeTimelineCollectedStyles(a),
            r.transformIntoNewTimeline(i + s),
            (r.previousNode = t);
        }
        visitQuery(t, r) {
          const n = r.currentTimeline.currentTime,
            i = t.options || {},
            s = i.delay ? tr(i.delay) : 0;
          s &&
            (6 === r.previousNode.type ||
              (0 == n && r.currentTimeline.hasCurrentStyleProperties())) &&
            (r.currentTimeline.snapshotCurrentStyles(), (r.previousNode = Fu));
          let o = n;
          const a = r.invokeQuery(
            t.selector,
            t.originalSelector,
            t.limit,
            t.includeSelf,
            !!i.optional,
            r.errors
          );
          r.currentQueryTotal = a.length;
          let l = null;
          a.forEach((u, c) => {
            r.currentQueryIndex = c;
            const d = r.createSubContext(t.options, u);
            s && d.delayNextStep(s),
              u === r.element && (l = d.currentTimeline),
              Bt(this, t.animation, d),
              d.currentTimeline.applyStylesToKeyframe(),
              (o = Math.max(o, d.currentTimeline.currentTime));
          }),
            (r.currentQueryIndex = 0),
            (r.currentQueryTotal = 0),
            r.transformIntoNewTimeline(o),
            l &&
              (r.currentTimeline.mergeTimelineCollectedStyles(l),
              r.currentTimeline.snapshotCurrentStyles()),
            (r.previousNode = t);
        }
        visitStagger(t, r) {
          const n = r.parentContext,
            i = r.currentTimeline,
            s = t.timings,
            o = Math.abs(s.duration),
            a = o * (r.currentQueryTotal - 1);
          let l = o * r.currentQueryIndex;
          switch (s.duration < 0 ? "reverse" : s.easing) {
            case "reverse":
              l = a - l;
              break;
            case "full":
              l = n.currentStaggerTime;
          }
          const c = r.currentTimeline;
          l && c.delayNextStep(l);
          const d = c.currentTime;
          Bt(this, t.animation, r),
            (r.previousNode = t),
            (n.currentStaggerTime =
              i.currentTime - d + (i.startTime - n.currentTimeline.startTime));
        }
      }
      const Fu = {};
      class Fp {
        constructor(t, r, n, i, s, o, a, l) {
          (this._driver = t),
            (this.element = r),
            (this.subInstructions = n),
            (this._enterClassName = i),
            (this._leaveClassName = s),
            (this.errors = o),
            (this.timelines = a),
            (this.parentContext = null),
            (this.currentAnimateTimings = null),
            (this.previousNode = Fu),
            (this.subContextCount = 0),
            (this.options = {}),
            (this.currentQueryIndex = 0),
            (this.currentQueryTotal = 0),
            (this.currentStaggerTime = 0),
            (this.currentTimeline = l || new ku(this._driver, r, 0)),
            a.push(this.currentTimeline);
        }
        get params() {
          return this.options.params;
        }
        updateOptions(t, r) {
          if (!t) return;
          const n = t;
          let i = this.options;
          null != n.duration && (i.duration = tr(n.duration)),
            null != n.delay && (i.delay = tr(n.delay));
          const s = n.params;
          if (s) {
            let o = i.params;
            o || (o = this.options.params = {}),
              Object.keys(s).forEach((a) => {
                (!r || !o.hasOwnProperty(a)) &&
                  (o[a] = zo(s[a], o, this.errors));
              });
          }
        }
        _copyOptions() {
          const t = {};
          if (this.options) {
            const r = this.options.params;
            if (r) {
              const n = (t.params = {});
              Object.keys(r).forEach((i) => {
                n[i] = r[i];
              });
            }
          }
          return t;
        }
        createSubContext(t = null, r, n) {
          const i = r || this.element,
            s = new Fp(
              this._driver,
              i,
              this.subInstructions,
              this._enterClassName,
              this._leaveClassName,
              this.errors,
              this.timelines,
              this.currentTimeline.fork(i, n || 0)
            );
          return (
            (s.previousNode = this.previousNode),
            (s.currentAnimateTimings = this.currentAnimateTimings),
            (s.options = this._copyOptions()),
            s.updateOptions(t),
            (s.currentQueryIndex = this.currentQueryIndex),
            (s.currentQueryTotal = this.currentQueryTotal),
            (s.parentContext = this),
            this.subContextCount++,
            s
          );
        }
        transformIntoNewTimeline(t) {
          return (
            (this.previousNode = Fu),
            (this.currentTimeline = this.currentTimeline.fork(this.element, t)),
            this.timelines.push(this.currentTimeline),
            this.currentTimeline
          );
        }
        appendInstructionToTimeline(t, r, n) {
          const i = {
              duration: r ?? t.duration,
              delay: this.currentTimeline.currentTime + (n ?? 0) + t.delay,
              easing: "",
            },
            s = new h$(
              this._driver,
              t.element,
              t.keyframes,
              t.preStyleProps,
              t.postStyleProps,
              i,
              t.stretchStartingKeyframe
            );
          return this.timelines.push(s), i;
        }
        incrementTime(t) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + t);
        }
        delayNextStep(t) {
          t > 0 && this.currentTimeline.delayNextStep(t);
        }
        invokeQuery(t, r, n, i, s, o) {
          let a = [];
          if ((i && a.push(this.element), t.length > 0)) {
            t = (t = t.replace(u$, "." + this._enterClassName)).replace(
              d$,
              "." + this._leaveClassName
            );
            let u = this._driver.query(this.element, t, 1 != n);
            0 !== n &&
              (u = n < 0 ? u.slice(u.length + n, u.length) : u.slice(0, n)),
              a.push(...u);
          }
          return (
            !s &&
              0 == a.length &&
              o.push(
                (function Cj(e) {
                  return new C(3014, !1);
                })()
              ),
            a
          );
        }
      }
      class ku {
        constructor(t, r, n, i) {
          (this._driver = t),
            (this.element = r),
            (this.startTime = n),
            (this._elementTimelineStylesLookup = i),
            (this.duration = 0),
            (this.easing = null),
            (this._previousKeyframe = new Map()),
            (this._currentKeyframe = new Map()),
            (this._keyframes = new Map()),
            (this._styleSummary = new Map()),
            (this._localTimelineStyles = new Map()),
            (this._pendingStyles = new Map()),
            (this._backFill = new Map()),
            (this._currentEmptyStepKeyframe = null),
            this._elementTimelineStylesLookup ||
              (this._elementTimelineStylesLookup = new Map()),
            (this._globalTimelineStyles =
              this._elementTimelineStylesLookup.get(r)),
            this._globalTimelineStyles ||
              ((this._globalTimelineStyles = this._localTimelineStyles),
              this._elementTimelineStylesLookup.set(
                r,
                this._localTimelineStyles
              )),
            this._loadKeyframe();
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.hasCurrentStyleProperties();
            default:
              return !0;
          }
        }
        hasCurrentStyleProperties() {
          return this._currentKeyframe.size > 0;
        }
        get currentTime() {
          return this.startTime + this.duration;
        }
        delayNextStep(t) {
          const r = 1 === this._keyframes.size && this._pendingStyles.size;
          this.duration || r
            ? (this.forwardTime(this.currentTime + t),
              r && this.snapshotCurrentStyles())
            : (this.startTime += t);
        }
        fork(t, r) {
          return (
            this.applyStylesToKeyframe(),
            new ku(
              this._driver,
              t,
              r || this.currentTime,
              this._elementTimelineStylesLookup
            )
          );
        }
        _loadKeyframe() {
          this._currentKeyframe &&
            (this._previousKeyframe = this._currentKeyframe),
            (this._currentKeyframe = this._keyframes.get(this.duration)),
            this._currentKeyframe ||
              ((this._currentKeyframe = new Map()),
              this._keyframes.set(this.duration, this._currentKeyframe));
        }
        forwardFrame() {
          (this.duration += 1), this._loadKeyframe();
        }
        forwardTime(t) {
          this.applyStylesToKeyframe(),
            (this.duration = t),
            this._loadKeyframe();
        }
        _updateStyle(t, r) {
          this._localTimelineStyles.set(t, r),
            this._globalTimelineStyles.set(t, r),
            this._styleSummary.set(t, { time: this.currentTime, value: r });
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(t) {
          t && this._previousKeyframe.set("easing", t);
          for (let [r, n] of this._globalTimelineStyles)
            this._backFill.set(r, n || er), this._currentKeyframe.set(r, er);
          this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        setStyles(t, r, n, i) {
          r && this._previousKeyframe.set("easing", r);
          const s = (i && i.params) || {},
            o = (function p$(e, t) {
              const r = new Map();
              let n;
              return (
                e.forEach((i) => {
                  if ("*" === i) {
                    n = n || t.keys();
                    for (let s of n) r.set(s, er);
                  } else Ar(i, r);
                }),
                r
              );
            })(t, this._globalTimelineStyles);
          for (let [a, l] of o) {
            const u = zo(l, s, n);
            this._pendingStyles.set(a, u),
              this._localTimelineStyles.has(a) ||
                this._backFill.set(a, this._globalTimelineStyles.get(a) ?? er),
              this._updateStyle(a, u);
          }
        }
        applyStylesToKeyframe() {
          0 != this._pendingStyles.size &&
            (this._pendingStyles.forEach((t, r) => {
              this._currentKeyframe.set(r, t);
            }),
            this._pendingStyles.clear(),
            this._localTimelineStyles.forEach((t, r) => {
              this._currentKeyframe.has(r) || this._currentKeyframe.set(r, t);
            }));
        }
        snapshotCurrentStyles() {
          for (let [t, r] of this._localTimelineStyles)
            this._pendingStyles.set(t, r), this._updateStyle(t, r);
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration);
        }
        get properties() {
          const t = [];
          for (let r in this._currentKeyframe) t.push(r);
          return t;
        }
        mergeTimelineCollectedStyles(t) {
          t._styleSummary.forEach((r, n) => {
            const i = this._styleSummary.get(n);
            (!i || r.time > i.time) && this._updateStyle(n, r.value);
          });
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const t = new Set(),
            r = new Set(),
            n = 1 === this._keyframes.size && 0 === this.duration;
          let i = [];
          this._keyframes.forEach((a, l) => {
            const u = Ar(a, new Map(), this._backFill);
            u.forEach((c, d) => {
              "!" === c ? t.add(d) : c === er && r.add(d);
            }),
              n || u.set("offset", l / this.duration),
              i.push(u);
          });
          const s = t.size ? Nu(t.values()) : [],
            o = r.size ? Nu(r.values()) : [];
          if (n) {
            const a = i[0],
              l = new Map(a);
            a.set("offset", 0), l.set("offset", 1), (i = [a, l]);
          }
          return Op(
            this.element,
            i,
            s,
            o,
            this.duration,
            this.startTime,
            this.easing,
            !1
          );
        }
      }
      class h$ extends ku {
        constructor(t, r, n, i, s, o, a = !1) {
          super(t, r, o.delay),
            (this.keyframes = n),
            (this.preStyleProps = i),
            (this.postStyleProps = s),
            (this._stretchStartingKeyframe = a),
            (this.timings = {
              duration: o.duration,
              delay: o.delay,
              easing: o.easing,
            });
        }
        containsAnimation() {
          return this.keyframes.length > 1;
        }
        buildKeyframes() {
          let t = this.keyframes,
            { delay: r, duration: n, easing: i } = this.timings;
          if (this._stretchStartingKeyframe && r) {
            const s = [],
              o = n + r,
              a = r / o,
              l = Ar(t[0]);
            l.set("offset", 0), s.push(l);
            const u = Ar(t[0]);
            u.set("offset", SS(a)), s.push(u);
            const c = t.length - 1;
            for (let d = 1; d <= c; d++) {
              let f = Ar(t[d]);
              const h = f.get("offset");
              f.set("offset", SS((r + h * n) / o)), s.push(f);
            }
            (n = o), (r = 0), (i = ""), (t = s);
          }
          return Op(
            this.element,
            t,
            this.preStyleProps,
            this.postStyleProps,
            n,
            r,
            i,
            !0
          );
        }
      }
      function SS(e, t = 3) {
        const r = Math.pow(10, t - 1);
        return Math.round(e * r) / r;
      }
      class kp {}
      const g$ = new Set([
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "left",
        "top",
        "bottom",
        "right",
        "fontSize",
        "outlineWidth",
        "outlineOffset",
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",
        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",
        "borderRadius",
        "borderWidth",
        "borderTopWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "textIndent",
        "perspective",
      ]);
      class m$ extends kp {
        normalizePropertyName(t, r) {
          return Np(t);
        }
        normalizeStyleValue(t, r, n, i) {
          let s = "";
          const o = n.toString().trim();
          if (g$.has(r) && 0 !== n && "0" !== n)
            if ("number" == typeof n) s = "px";
            else {
              const a = n.match(/^[+-]?[\d\.]+([a-z]*)$/);
              a &&
                0 == a[1].length &&
                i.push(
                  (function cj(e, t) {
                    return new C(3005, !1);
                  })()
                );
            }
          return o + s;
        }
      }
      function MS(e, t, r, n, i, s, o, a, l, u, c, d, f) {
        return {
          type: 0,
          element: e,
          triggerName: t,
          isRemovalTransition: i,
          fromState: r,
          fromStyles: s,
          toState: n,
          toStyles: o,
          timelines: a,
          queriedElements: l,
          preStyleProps: u,
          postStyleProps: c,
          totalTime: d,
          errors: f,
        };
      }
      const Lp = {};
      class IS {
        constructor(t, r, n) {
          (this._triggerName = t), (this.ast = r), (this._stateStyles = n);
        }
        match(t, r, n, i) {
          return (function v$(e, t, r, n, i) {
            return e.some((s) => s(t, r, n, i));
          })(this.ast.matchers, t, r, n, i);
        }
        buildStyles(t, r, n) {
          let i = this._stateStyles.get("*");
          return (
            void 0 !== t && (i = this._stateStyles.get(t?.toString()) || i),
            i ? i.buildStyles(r, n) : new Map()
          );
        }
        build(t, r, n, i, s, o, a, l, u, c) {
          const d = [],
            f = (this.ast.options && this.ast.options.params) || Lp,
            g = this.buildStyles(n, (a && a.params) || Lp, d),
            m = (l && l.params) || Lp,
            y = this.buildStyles(i, m, d),
            D = new Set(),
            v = new Map(),
            A = new Map(),
            I = "void" === i,
            U = { params: y$(m, f), delay: this.ast.options?.delay },
            me = c ? [] : xp(t, r, this.ast.animation, s, o, g, y, U, u, d);
          let ge = 0;
          if (
            (me.forEach((Tt) => {
              ge = Math.max(Tt.duration + Tt.delay, ge);
            }),
            d.length)
          )
            return MS(r, this._triggerName, n, i, I, g, y, [], [], v, A, ge, d);
          me.forEach((Tt) => {
            const hn = Tt.element,
              cc = $t(v, hn, new Set());
            Tt.preStyleProps.forEach((ci) => cc.add(ci));
            const ca = $t(A, hn, new Set());
            Tt.postStyleProps.forEach((ci) => ca.add(ci)),
              hn !== r && D.add(hn);
          });
          const Ye = Nu(D.values());
          return MS(r, this._triggerName, n, i, I, g, y, me, Ye, v, A, ge);
        }
      }
      function y$(e, t) {
        const r = Ho(t);
        for (const n in e) e.hasOwnProperty(n) && null != e[n] && (r[n] = e[n]);
        return r;
      }
      class _$ {
        constructor(t, r, n) {
          (this.styles = t), (this.defaultParams = r), (this.normalizer = n);
        }
        buildStyles(t, r) {
          const n = new Map(),
            i = Ho(this.defaultParams);
          return (
            Object.keys(t).forEach((s) => {
              const o = t[s];
              null !== o && (i[s] = o);
            }),
            this.styles.styles.forEach((s) => {
              "string" != typeof s &&
                s.forEach((o, a) => {
                  o && (o = zo(o, i, r));
                  const l = this.normalizer.normalizePropertyName(a, r);
                  (o = this.normalizer.normalizeStyleValue(a, l, o, r)),
                    n.set(a, o);
                });
            }),
            n
          );
        }
      }
      class C$ {
        constructor(t, r, n) {
          (this.name = t),
            (this.ast = r),
            (this._normalizer = n),
            (this.transitionFactories = []),
            (this.states = new Map()),
            r.states.forEach((i) => {
              this.states.set(
                i.name,
                new _$(i.style, (i.options && i.options.params) || {}, n)
              );
            }),
            TS(this.states, "true", "1"),
            TS(this.states, "false", "0"),
            r.transitions.forEach((i) => {
              this.transitionFactories.push(new IS(t, i, this.states));
            }),
            (this.fallbackTransition = (function w$(e, t, r) {
              return new IS(
                e,
                {
                  type: 1,
                  animation: { type: 2, steps: [], options: null },
                  matchers: [(o, a) => !0],
                  options: null,
                  queryCount: 0,
                  depCount: 0,
                },
                t
              );
            })(t, this.states));
        }
        get containsQueries() {
          return this.ast.queryCount > 0;
        }
        matchTransition(t, r, n, i) {
          return (
            this.transitionFactories.find((o) => o.match(t, r, n, i)) || null
          );
        }
        matchStyles(t, r, n) {
          return this.fallbackTransition.buildStyles(t, r, n);
        }
      }
      function TS(e, t, r) {
        e.has(t)
          ? e.has(r) || e.set(r, e.get(t))
          : e.has(r) && e.set(t, e.get(r));
      }
      const E$ = new xu();
      class b$ {
        constructor(t, r, n) {
          (this.bodyNode = t),
            (this._driver = r),
            (this._normalizer = n),
            (this._animations = new Map()),
            (this._playersById = new Map()),
            (this.players = []);
        }
        register(t, r) {
          const n = [],
            s = Rp(this._driver, r, n, []);
          if (n.length)
            throw (function Tj(e) {
              return new C(3503, !1);
            })();
          this._animations.set(t, s);
        }
        _buildPlayer(t, r, n) {
          const i = t.element,
            s = cS(this._normalizer, t.keyframes, r, n);
          return this._driver.animate(
            i,
            s,
            t.duration,
            t.delay,
            t.easing,
            [],
            !0
          );
        }
        create(t, r, n = {}) {
          const i = [],
            s = this._animations.get(t);
          let o;
          const a = new Map();
          if (
            (s
              ? ((o = xp(
                  this._driver,
                  r,
                  s,
                  Mp,
                  Mu,
                  new Map(),
                  new Map(),
                  n,
                  E$,
                  i
                )),
                o.forEach((c) => {
                  const d = $t(a, c.element, new Map());
                  c.postStyleProps.forEach((f) => d.set(f, null));
                }))
              : (i.push(
                  (function Aj() {
                    return new C(3300, !1);
                  })()
                ),
                (o = [])),
            i.length)
          )
            throw (function Nj(e) {
              return new C(3504, !1);
            })();
          a.forEach((c, d) => {
            c.forEach((f, h) => {
              c.set(h, this._driver.computeStyle(d, h, er));
            });
          });
          const u = Tr(
            o.map((c) => {
              const d = a.get(c.element);
              return this._buildPlayer(c, new Map(), d);
            })
          );
          return (
            this._playersById.set(t, u),
            u.onDestroy(() => this.destroy(t)),
            this.players.push(u),
            u
          );
        }
        destroy(t) {
          const r = this._getPlayer(t);
          r.destroy(), this._playersById.delete(t);
          const n = this.players.indexOf(r);
          n >= 0 && this.players.splice(n, 1);
        }
        _getPlayer(t) {
          const r = this._playersById.get(t);
          if (!r)
            throw (function Rj(e) {
              return new C(3301, !1);
            })();
          return r;
        }
        listen(t, r, n, i) {
          const s = Ep(r, "", "", "");
          return Cp(this._getPlayer(t), n, s, i), () => {};
        }
        command(t, r, n, i) {
          if ("register" == n) return void this.register(t, i[0]);
          if ("create" == n) return void this.create(t, r, i[0] || {});
          const s = this._getPlayer(t);
          switch (n) {
            case "play":
              s.play();
              break;
            case "pause":
              s.pause();
              break;
            case "reset":
              s.reset();
              break;
            case "restart":
              s.restart();
              break;
            case "finish":
              s.finish();
              break;
            case "init":
              s.init();
              break;
            case "setPosition":
              s.setPosition(parseFloat(i[0]));
              break;
            case "destroy":
              this.destroy(t);
          }
        }
      }
      const AS = "ng-animate-queued",
        Vp = "ng-animate-disabled",
        A$ = [],
        NS = {
          namespaceId: "",
          setForRemoval: !1,
          setForMove: !1,
          hasAnimation: !1,
          removedBeforeQueried: !1,
        },
        N$ = {
          namespaceId: "",
          setForMove: !1,
          setForRemoval: !1,
          hasAnimation: !1,
          removedBeforeQueried: !0,
        },
        dn = "__ng_removed";
      class jp {
        get params() {
          return this.options.params;
        }
        constructor(t, r = "") {
          this.namespaceId = r;
          const n = t && t.hasOwnProperty("value");
          if (
            ((this.value = (function x$(e) {
              return e ?? null;
            })(n ? t.value : t)),
            n)
          ) {
            const s = Ho(t);
            delete s.value, (this.options = s);
          } else this.options = {};
          this.options.params || (this.options.params = {});
        }
        absorbOptions(t) {
          const r = t.params;
          if (r) {
            const n = this.options.params;
            Object.keys(r).forEach((i) => {
              null == n[i] && (n[i] = r[i]);
            });
          }
        }
      }
      const qo = "void",
        $p = new jp(qo);
      class R$ {
        constructor(t, r, n) {
          (this.id = t),
            (this.hostElement = r),
            (this._engine = n),
            (this.players = []),
            (this._triggers = new Map()),
            (this._queue = []),
            (this._elementListeners = new Map()),
            (this._hostClassName = "ng-tns-" + t),
            Xt(r, this._hostClassName);
        }
        listen(t, r, n, i) {
          if (!this._triggers.has(r))
            throw (function Pj(e, t) {
              return new C(3302, !1);
            })();
          if (null == n || 0 == n.length)
            throw (function Oj(e) {
              return new C(3303, !1);
            })();
          if (
            !(function F$(e) {
              return "start" == e || "done" == e;
            })(n)
          )
            throw (function xj(e, t) {
              return new C(3400, !1);
            })();
          const s = $t(this._elementListeners, t, []),
            o = { name: r, phase: n, callback: i };
          s.push(o);
          const a = $t(this._engine.statesByElement, t, new Map());
          return (
            a.has(r) || (Xt(t, Iu), Xt(t, Iu + "-" + r), a.set(r, $p)),
            () => {
              this._engine.afterFlush(() => {
                const l = s.indexOf(o);
                l >= 0 && s.splice(l, 1), this._triggers.has(r) || a.delete(r);
              });
            }
          );
        }
        register(t, r) {
          return !this._triggers.has(t) && (this._triggers.set(t, r), !0);
        }
        _getTrigger(t) {
          const r = this._triggers.get(t);
          if (!r)
            throw (function Fj(e) {
              return new C(3401, !1);
            })();
          return r;
        }
        trigger(t, r, n, i = !0) {
          const s = this._getTrigger(r),
            o = new Bp(this.id, r, t);
          let a = this._engine.statesByElement.get(t);
          a ||
            (Xt(t, Iu),
            Xt(t, Iu + "-" + r),
            this._engine.statesByElement.set(t, (a = new Map())));
          let l = a.get(r);
          const u = new jp(n, this.id);
          if (
            (!(n && n.hasOwnProperty("value")) &&
              l &&
              u.absorbOptions(l.options),
            a.set(r, u),
            l || (l = $p),
            u.value !== qo && l.value === u.value)
          ) {
            if (
              !(function V$(e, t) {
                const r = Object.keys(e),
                  n = Object.keys(t);
                if (r.length != n.length) return !1;
                for (let i = 0; i < r.length; i++) {
                  const s = r[i];
                  if (!t.hasOwnProperty(s) || e[s] !== t[s]) return !1;
                }
                return !0;
              })(l.params, u.params)
            ) {
              const m = [],
                y = s.matchStyles(l.value, l.params, m),
                D = s.matchStyles(u.value, u.params, m);
              m.length
                ? this._engine.reportError(m)
                : this._engine.afterFlush(() => {
                    ri(t, y), xn(t, D);
                  });
            }
            return;
          }
          const f = $t(this._engine.playersByElement, t, []);
          f.forEach((m) => {
            m.namespaceId == this.id &&
              m.triggerName == r &&
              m.queued &&
              m.destroy();
          });
          let h = s.matchTransition(l.value, u.value, t, u.params),
            g = !1;
          if (!h) {
            if (!i) return;
            (h = s.fallbackTransition), (g = !0);
          }
          return (
            this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: t,
              triggerName: r,
              transition: h,
              fromState: l,
              toState: u,
              player: o,
              isFallbackTransition: g,
            }),
            g ||
              (Xt(t, AS),
              o.onStart(() => {
                ms(t, AS);
              })),
            o.onDone(() => {
              let m = this.players.indexOf(o);
              m >= 0 && this.players.splice(m, 1);
              const y = this._engine.playersByElement.get(t);
              if (y) {
                let D = y.indexOf(o);
                D >= 0 && y.splice(D, 1);
              }
            }),
            this.players.push(o),
            f.push(o),
            o
          );
        }
        deregister(t) {
          this._triggers.delete(t),
            this._engine.statesByElement.forEach((r) => r.delete(t)),
            this._elementListeners.forEach((r, n) => {
              this._elementListeners.set(
                n,
                r.filter((i) => i.name != t)
              );
            });
        }
        clearElementCache(t) {
          this._engine.statesByElement.delete(t),
            this._elementListeners.delete(t);
          const r = this._engine.playersByElement.get(t);
          r &&
            (r.forEach((n) => n.destroy()),
            this._engine.playersByElement.delete(t));
        }
        _signalRemovalForInnerTriggers(t, r) {
          const n = this._engine.driver.query(t, Tu, !0);
          n.forEach((i) => {
            if (i[dn]) return;
            const s = this._engine.fetchNamespacesByElement(i);
            s.size
              ? s.forEach((o) => o.triggerLeaveAnimation(i, r, !1, !0))
              : this.clearElementCache(i);
          }),
            this._engine.afterFlushAnimationsDone(() =>
              n.forEach((i) => this.clearElementCache(i))
            );
        }
        triggerLeaveAnimation(t, r, n, i) {
          const s = this._engine.statesByElement.get(t),
            o = new Map();
          if (s) {
            const a = [];
            if (
              (s.forEach((l, u) => {
                if ((o.set(u, l.value), this._triggers.has(u))) {
                  const c = this.trigger(t, u, qo, i);
                  c && a.push(c);
                }
              }),
              a.length)
            )
              return (
                this._engine.markElementAsRemoved(this.id, t, !0, r, o),
                n && Tr(a).onDone(() => this._engine.processLeaveNode(t)),
                !0
              );
          }
          return !1;
        }
        prepareLeaveAnimationListeners(t) {
          const r = this._elementListeners.get(t),
            n = this._engine.statesByElement.get(t);
          if (r && n) {
            const i = new Set();
            r.forEach((s) => {
              const o = s.name;
              if (i.has(o)) return;
              i.add(o);
              const l = this._triggers.get(o).fallbackTransition,
                u = n.get(o) || $p,
                c = new jp(qo),
                d = new Bp(this.id, o, t);
              this._engine.totalQueuedPlayers++,
                this._queue.push({
                  element: t,
                  triggerName: o,
                  transition: l,
                  fromState: u,
                  toState: c,
                  player: d,
                  isFallbackTransition: !0,
                });
            });
          }
        }
        removeNode(t, r) {
          const n = this._engine;
          if (
            (t.childElementCount && this._signalRemovalForInnerTriggers(t, r),
            this.triggerLeaveAnimation(t, r, !0))
          )
            return;
          let i = !1;
          if (n.totalAnimations) {
            const s = n.players.length ? n.playersByQueriedElement.get(t) : [];
            if (s && s.length) i = !0;
            else {
              let o = t;
              for (; (o = o.parentNode); )
                if (n.statesByElement.get(o)) {
                  i = !0;
                  break;
                }
            }
          }
          if ((this.prepareLeaveAnimationListeners(t), i))
            n.markElementAsRemoved(this.id, t, !1, r);
          else {
            const s = t[dn];
            (!s || s === NS) &&
              (n.afterFlush(() => this.clearElementCache(t)),
              n.destroyInnerAnimations(t),
              n._onRemovalComplete(t, r));
          }
        }
        insertNode(t, r) {
          Xt(t, this._hostClassName);
        }
        drainQueuedTransitions(t) {
          const r = [];
          return (
            this._queue.forEach((n) => {
              const i = n.player;
              if (i.destroyed) return;
              const s = n.element,
                o = this._elementListeners.get(s);
              o &&
                o.forEach((a) => {
                  if (a.name == n.triggerName) {
                    const l = Ep(
                      s,
                      n.triggerName,
                      n.fromState.value,
                      n.toState.value
                    );
                    (l._data = t), Cp(n.player, a.phase, l, a.callback);
                  }
                }),
                i.markedForDestroy
                  ? this._engine.afterFlush(() => {
                      i.destroy();
                    })
                  : r.push(n);
            }),
            (this._queue = []),
            r.sort((n, i) => {
              const s = n.transition.ast.depCount,
                o = i.transition.ast.depCount;
              return 0 == s || 0 == o
                ? s - o
                : this._engine.driver.containsElement(n.element, i.element)
                ? 1
                : -1;
            })
          );
        }
        destroy(t) {
          this.players.forEach((r) => r.destroy()),
            this._signalRemovalForInnerTriggers(this.hostElement, t);
        }
      }
      class P$ {
        _onRemovalComplete(t, r) {
          this.onRemovalComplete(t, r);
        }
        constructor(t, r, n) {
          (this.bodyNode = t),
            (this.driver = r),
            (this._normalizer = n),
            (this.players = []),
            (this.newHostElements = new Map()),
            (this.playersByElement = new Map()),
            (this.playersByQueriedElement = new Map()),
            (this.statesByElement = new Map()),
            (this.disabledNodes = new Set()),
            (this.totalAnimations = 0),
            (this.totalQueuedPlayers = 0),
            (this._namespaceLookup = {}),
            (this._namespaceList = []),
            (this._flushFns = []),
            (this._whenQuietFns = []),
            (this.namespacesByHostElement = new Map()),
            (this.collectedEnterElements = []),
            (this.collectedLeaveElements = []),
            (this.onRemovalComplete = (i, s) => {});
        }
        get queuedPlayers() {
          const t = [];
          return (
            this._namespaceList.forEach((r) => {
              r.players.forEach((n) => {
                n.queued && t.push(n);
              });
            }),
            t
          );
        }
        createNamespace(t, r) {
          const n = new R$(t, r, this);
          return (
            this.bodyNode && this.driver.containsElement(this.bodyNode, r)
              ? this._balanceNamespaceList(n, r)
              : (this.newHostElements.set(r, n), this.collectEnterElement(r)),
            (this._namespaceLookup[t] = n)
          );
        }
        _balanceNamespaceList(t, r) {
          const n = this._namespaceList,
            i = this.namespacesByHostElement;
          if (n.length - 1 >= 0) {
            let o = !1,
              a = this.driver.getParentElement(r);
            for (; a; ) {
              const l = i.get(a);
              if (l) {
                const u = n.indexOf(l);
                n.splice(u + 1, 0, t), (o = !0);
                break;
              }
              a = this.driver.getParentElement(a);
            }
            o || n.unshift(t);
          } else n.push(t);
          return i.set(r, t), t;
        }
        register(t, r) {
          let n = this._namespaceLookup[t];
          return n || (n = this.createNamespace(t, r)), n;
        }
        registerTrigger(t, r, n) {
          let i = this._namespaceLookup[t];
          i && i.register(r, n) && this.totalAnimations++;
        }
        destroy(t, r) {
          t &&
            (this.afterFlush(() => {}),
            this.afterFlushAnimationsDone(() => {
              const n = this._fetchNamespace(t);
              this.namespacesByHostElement.delete(n.hostElement);
              const i = this._namespaceList.indexOf(n);
              i >= 0 && this._namespaceList.splice(i, 1),
                n.destroy(r),
                delete this._namespaceLookup[t];
            }));
        }
        _fetchNamespace(t) {
          return this._namespaceLookup[t];
        }
        fetchNamespacesByElement(t) {
          const r = new Set(),
            n = this.statesByElement.get(t);
          if (n)
            for (let i of n.values())
              if (i.namespaceId) {
                const s = this._fetchNamespace(i.namespaceId);
                s && r.add(s);
              }
          return r;
        }
        trigger(t, r, n, i) {
          if (Lu(r)) {
            const s = this._fetchNamespace(t);
            if (s) return s.trigger(r, n, i), !0;
          }
          return !1;
        }
        insertNode(t, r, n, i) {
          if (!Lu(r)) return;
          const s = r[dn];
          if (s && s.setForRemoval) {
            (s.setForRemoval = !1), (s.setForMove = !0);
            const o = this.collectedLeaveElements.indexOf(r);
            o >= 0 && this.collectedLeaveElements.splice(o, 1);
          }
          if (t) {
            const o = this._fetchNamespace(t);
            o && o.insertNode(r, n);
          }
          i && this.collectEnterElement(r);
        }
        collectEnterElement(t) {
          this.collectedEnterElements.push(t);
        }
        markElementAsDisabled(t, r) {
          r
            ? this.disabledNodes.has(t) ||
              (this.disabledNodes.add(t), Xt(t, Vp))
            : this.disabledNodes.has(t) &&
              (this.disabledNodes.delete(t), ms(t, Vp));
        }
        removeNode(t, r, n) {
          if (Lu(r)) {
            const i = t ? this._fetchNamespace(t) : null;
            i ? i.removeNode(r, n) : this.markElementAsRemoved(t, r, !1, n);
            const s = this.namespacesByHostElement.get(r);
            s && s.id !== t && s.removeNode(r, n);
          } else this._onRemovalComplete(r, n);
        }
        markElementAsRemoved(t, r, n, i, s) {
          this.collectedLeaveElements.push(r),
            (r[dn] = {
              namespaceId: t,
              setForRemoval: i,
              hasAnimation: n,
              removedBeforeQueried: !1,
              previousTriggersValues: s,
            });
        }
        listen(t, r, n, i, s) {
          return Lu(r) ? this._fetchNamespace(t).listen(r, n, i, s) : () => {};
        }
        _buildInstruction(t, r, n, i, s) {
          return t.transition.build(
            this.driver,
            t.element,
            t.fromState.value,
            t.toState.value,
            n,
            i,
            t.fromState.options,
            t.toState.options,
            r,
            s
          );
        }
        destroyInnerAnimations(t) {
          let r = this.driver.query(t, Tu, !0);
          r.forEach((n) => this.destroyActiveAnimationsForElement(n)),
            0 != this.playersByQueriedElement.size &&
              ((r = this.driver.query(t, Ip, !0)),
              r.forEach((n) => this.finishActiveQueriedAnimationOnElement(n)));
        }
        destroyActiveAnimationsForElement(t) {
          const r = this.playersByElement.get(t);
          r &&
            r.forEach((n) => {
              n.queued ? (n.markedForDestroy = !0) : n.destroy();
            });
        }
        finishActiveQueriedAnimationOnElement(t) {
          const r = this.playersByQueriedElement.get(t);
          r && r.forEach((n) => n.finish());
        }
        whenRenderingDone() {
          return new Promise((t) => {
            if (this.players.length) return Tr(this.players).onDone(() => t());
            t();
          });
        }
        processLeaveNode(t) {
          const r = t[dn];
          if (r && r.setForRemoval) {
            if (((t[dn] = NS), r.namespaceId)) {
              this.destroyInnerAnimations(t);
              const n = this._fetchNamespace(r.namespaceId);
              n && n.clearElementCache(t);
            }
            this._onRemovalComplete(t, r.setForRemoval);
          }
          t.classList?.contains(Vp) && this.markElementAsDisabled(t, !1),
            this.driver.query(t, ".ng-animate-disabled", !0).forEach((n) => {
              this.markElementAsDisabled(n, !1);
            });
        }
        flush(t = -1) {
          let r = [];
          if (
            (this.newHostElements.size &&
              (this.newHostElements.forEach((n, i) =>
                this._balanceNamespaceList(n, i)
              ),
              this.newHostElements.clear()),
            this.totalAnimations && this.collectedEnterElements.length)
          )
            for (let n = 0; n < this.collectedEnterElements.length; n++)
              Xt(this.collectedEnterElements[n], "ng-star-inserted");
          if (
            this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)
          ) {
            const n = [];
            try {
              r = this._flushAnimations(n, t);
            } finally {
              for (let i = 0; i < n.length; i++) n[i]();
            }
          } else
            for (let n = 0; n < this.collectedLeaveElements.length; n++)
              this.processLeaveNode(this.collectedLeaveElements[n]);
          if (
            ((this.totalQueuedPlayers = 0),
            (this.collectedEnterElements.length = 0),
            (this.collectedLeaveElements.length = 0),
            this._flushFns.forEach((n) => n()),
            (this._flushFns = []),
            this._whenQuietFns.length)
          ) {
            const n = this._whenQuietFns;
            (this._whenQuietFns = []),
              r.length
                ? Tr(r).onDone(() => {
                    n.forEach((i) => i());
                  })
                : n.forEach((i) => i());
          }
        }
        reportError(t) {
          throw (function kj(e) {
            return new C(3402, !1);
          })();
        }
        _flushAnimations(t, r) {
          const n = new xu(),
            i = [],
            s = new Map(),
            o = [],
            a = new Map(),
            l = new Map(),
            u = new Map(),
            c = new Set();
          this.disabledNodes.forEach((F) => {
            c.add(F);
            const L = this.driver.query(F, ".ng-animate-queued", !0);
            for (let j = 0; j < L.length; j++) c.add(L[j]);
          });
          const d = this.bodyNode,
            f = Array.from(this.statesByElement.keys()),
            h = OS(f, this.collectedEnterElements),
            g = new Map();
          let m = 0;
          h.forEach((F, L) => {
            const j = Mp + m++;
            g.set(L, j), F.forEach((ie) => Xt(ie, j));
          });
          const y = [],
            D = new Set(),
            v = new Set();
          for (let F = 0; F < this.collectedLeaveElements.length; F++) {
            const L = this.collectedLeaveElements[F],
              j = L[dn];
            j &&
              j.setForRemoval &&
              (y.push(L),
              D.add(L),
              j.hasAnimation
                ? this.driver
                    .query(L, ".ng-star-inserted", !0)
                    .forEach((ie) => D.add(ie))
                : v.add(L));
          }
          const A = new Map(),
            I = OS(f, Array.from(D));
          I.forEach((F, L) => {
            const j = Mu + m++;
            A.set(L, j), F.forEach((ie) => Xt(ie, j));
          }),
            t.push(() => {
              h.forEach((F, L) => {
                const j = g.get(L);
                F.forEach((ie) => ms(ie, j));
              }),
                I.forEach((F, L) => {
                  const j = A.get(L);
                  F.forEach((ie) => ms(ie, j));
                }),
                y.forEach((F) => {
                  this.processLeaveNode(F);
                });
            });
          const U = [],
            me = [];
          for (let F = this._namespaceList.length - 1; F >= 0; F--)
            this._namespaceList[F].drainQueuedTransitions(r).forEach((j) => {
              const ie = j.player,
                ze = j.element;
              if ((U.push(ie), this.collectedEnterElements.length)) {
                const rt = ze[dn];
                if (rt && rt.setForMove) {
                  if (
                    rt.previousTriggersValues &&
                    rt.previousTriggersValues.has(j.triggerName)
                  ) {
                    const di = rt.previousTriggersValues.get(j.triggerName),
                      Jt = this.statesByElement.get(j.element);
                    if (Jt && Jt.has(j.triggerName)) {
                      const dc = Jt.get(j.triggerName);
                      (dc.value = di), Jt.set(j.triggerName, dc);
                    }
                  }
                  return void ie.destroy();
                }
              }
              const jn = !d || !this.driver.containsElement(d, ze),
                Ht = A.get(ze),
                xr = g.get(ze),
                Ae = this._buildInstruction(j, n, xr, Ht, jn);
              if (Ae.errors && Ae.errors.length) return void me.push(Ae);
              if (jn)
                return (
                  ie.onStart(() => ri(ze, Ae.fromStyles)),
                  ie.onDestroy(() => xn(ze, Ae.toStyles)),
                  void i.push(ie)
                );
              if (j.isFallbackTransition)
                return (
                  ie.onStart(() => ri(ze, Ae.fromStyles)),
                  ie.onDestroy(() => xn(ze, Ae.toStyles)),
                  void i.push(ie)
                );
              const hM = [];
              Ae.timelines.forEach((rt) => {
                (rt.stretchStartingKeyframe = !0),
                  this.disabledNodes.has(rt.element) || hM.push(rt);
              }),
                (Ae.timelines = hM),
                n.append(ze, Ae.timelines),
                o.push({ instruction: Ae, player: ie, element: ze }),
                Ae.queriedElements.forEach((rt) => $t(a, rt, []).push(ie)),
                Ae.preStyleProps.forEach((rt, di) => {
                  if (rt.size) {
                    let Jt = l.get(di);
                    Jt || l.set(di, (Jt = new Set())),
                      rt.forEach((dc, bg) => Jt.add(bg));
                  }
                }),
                Ae.postStyleProps.forEach((rt, di) => {
                  let Jt = u.get(di);
                  Jt || u.set(di, (Jt = new Set())),
                    rt.forEach((dc, bg) => Jt.add(bg));
                });
            });
          if (me.length) {
            const F = [];
            me.forEach((L) => {
              F.push(
                (function Lj(e, t) {
                  return new C(3505, !1);
                })()
              );
            }),
              U.forEach((L) => L.destroy()),
              this.reportError(F);
          }
          const ge = new Map(),
            Ye = new Map();
          o.forEach((F) => {
            const L = F.element;
            n.has(L) &&
              (Ye.set(L, L),
              this._beforeAnimationBuild(
                F.player.namespaceId,
                F.instruction,
                ge
              ));
          }),
            i.forEach((F) => {
              const L = F.element;
              this._getPreviousPlayers(
                L,
                !1,
                F.namespaceId,
                F.triggerName,
                null
              ).forEach((ie) => {
                $t(ge, L, []).push(ie), ie.destroy();
              });
            });
          const Tt = y.filter((F) => FS(F, l, u)),
            hn = new Map();
          PS(hn, this.driver, v, u, er).forEach((F) => {
            FS(F, l, u) && Tt.push(F);
          });
          const ca = new Map();
          h.forEach((F, L) => {
            PS(ca, this.driver, new Set(F), l, "!");
          }),
            Tt.forEach((F) => {
              const L = hn.get(F),
                j = ca.get(F);
              hn.set(
                F,
                new Map([...(L?.entries() ?? []), ...(j?.entries() ?? [])])
              );
            });
          const ci = [],
            dM = [],
            fM = {};
          o.forEach((F) => {
            const { element: L, player: j, instruction: ie } = F;
            if (n.has(L)) {
              if (c.has(L))
                return (
                  j.onDestroy(() => xn(L, ie.toStyles)),
                  (j.disabled = !0),
                  j.overrideTotalTime(ie.totalTime),
                  void i.push(j)
                );
              let ze = fM;
              if (Ye.size > 1) {
                let Ht = L;
                const xr = [];
                for (; (Ht = Ht.parentNode); ) {
                  const Ae = Ye.get(Ht);
                  if (Ae) {
                    ze = Ae;
                    break;
                  }
                  xr.push(Ht);
                }
                xr.forEach((Ae) => Ye.set(Ae, ze));
              }
              const jn = this._buildAnimation(j.namespaceId, ie, ge, s, ca, hn);
              if ((j.setRealPlayer(jn), ze === fM)) ci.push(j);
              else {
                const Ht = this.playersByElement.get(ze);
                Ht && Ht.length && (j.parentPlayer = Tr(Ht)), i.push(j);
              }
            } else
              ri(L, ie.fromStyles),
                j.onDestroy(() => xn(L, ie.toStyles)),
                dM.push(j),
                c.has(L) && i.push(j);
          }),
            dM.forEach((F) => {
              const L = s.get(F.element);
              if (L && L.length) {
                const j = Tr(L);
                F.setRealPlayer(j);
              }
            }),
            i.forEach((F) => {
              F.parentPlayer ? F.syncPlayerEvents(F.parentPlayer) : F.destroy();
            });
          for (let F = 0; F < y.length; F++) {
            const L = y[F],
              j = L[dn];
            if ((ms(L, Mu), j && j.hasAnimation)) continue;
            let ie = [];
            if (a.size) {
              let jn = a.get(L);
              jn && jn.length && ie.push(...jn);
              let Ht = this.driver.query(L, Ip, !0);
              for (let xr = 0; xr < Ht.length; xr++) {
                let Ae = a.get(Ht[xr]);
                Ae && Ae.length && ie.push(...Ae);
              }
            }
            const ze = ie.filter((jn) => !jn.destroyed);
            ze.length ? k$(this, L, ze) : this.processLeaveNode(L);
          }
          return (
            (y.length = 0),
            ci.forEach((F) => {
              this.players.push(F),
                F.onDone(() => {
                  F.destroy();
                  const L = this.players.indexOf(F);
                  this.players.splice(L, 1);
                }),
                F.play();
            }),
            ci
          );
        }
        afterFlush(t) {
          this._flushFns.push(t);
        }
        afterFlushAnimationsDone(t) {
          this._whenQuietFns.push(t);
        }
        _getPreviousPlayers(t, r, n, i, s) {
          let o = [];
          if (r) {
            const a = this.playersByQueriedElement.get(t);
            a && (o = a);
          } else {
            const a = this.playersByElement.get(t);
            if (a) {
              const l = !s || s == qo;
              a.forEach((u) => {
                u.queued || (!l && u.triggerName != i) || o.push(u);
              });
            }
          }
          return (
            (n || i) &&
              (o = o.filter(
                (a) => !((n && n != a.namespaceId) || (i && i != a.triggerName))
              )),
            o
          );
        }
        _beforeAnimationBuild(t, r, n) {
          const s = r.element,
            o = r.isRemovalTransition ? void 0 : t,
            a = r.isRemovalTransition ? void 0 : r.triggerName;
          for (const l of r.timelines) {
            const u = l.element,
              c = u !== s,
              d = $t(n, u, []);
            this._getPreviousPlayers(u, c, o, a, r.toState).forEach((h) => {
              const g = h.getRealPlayer();
              g.beforeDestroy && g.beforeDestroy(), h.destroy(), d.push(h);
            });
          }
          ri(s, r.fromStyles);
        }
        _buildAnimation(t, r, n, i, s, o) {
          const a = r.triggerName,
            l = r.element,
            u = [],
            c = new Set(),
            d = new Set(),
            f = r.timelines.map((g) => {
              const m = g.element;
              c.add(m);
              const y = m[dn];
              if (y && y.removedBeforeQueried)
                return new Bo(g.duration, g.delay);
              const D = m !== l,
                v = (function L$(e) {
                  const t = [];
                  return xS(e, t), t;
                })((n.get(m) || A$).map((ge) => ge.getRealPlayer())).filter(
                  (ge) => !!ge.element && ge.element === m
                ),
                A = s.get(m),
                I = o.get(m),
                U = cS(this._normalizer, g.keyframes, A, I),
                me = this._buildPlayer(g, U, v);
              if ((g.subTimeline && i && d.add(m), D)) {
                const ge = new Bp(t, a, m);
                ge.setRealPlayer(me), u.push(ge);
              }
              return me;
            });
          u.forEach((g) => {
            $t(this.playersByQueriedElement, g.element, []).push(g),
              g.onDone(() =>
                (function O$(e, t, r) {
                  let n = e.get(t);
                  if (n) {
                    if (n.length) {
                      const i = n.indexOf(r);
                      n.splice(i, 1);
                    }
                    0 == n.length && e.delete(t);
                  }
                  return n;
                })(this.playersByQueriedElement, g.element, g)
              );
          }),
            c.forEach((g) => Xt(g, vS));
          const h = Tr(f);
          return (
            h.onDestroy(() => {
              c.forEach((g) => ms(g, vS)), xn(l, r.toStyles);
            }),
            d.forEach((g) => {
              $t(i, g, []).push(h);
            }),
            h
          );
        }
        _buildPlayer(t, r, n) {
          return r.length > 0
            ? this.driver.animate(
                t.element,
                r,
                t.duration,
                t.delay,
                t.easing,
                n
              )
            : new Bo(t.duration, t.delay);
        }
      }
      class Bp {
        constructor(t, r, n) {
          (this.namespaceId = t),
            (this.triggerName = r),
            (this.element = n),
            (this._player = new Bo()),
            (this._containsRealPlayer = !1),
            (this._queuedCallbacks = new Map()),
            (this.destroyed = !1),
            (this.parentPlayer = null),
            (this.markedForDestroy = !1),
            (this.disabled = !1),
            (this.queued = !0),
            (this.totalTime = 0);
        }
        setRealPlayer(t) {
          this._containsRealPlayer ||
            ((this._player = t),
            this._queuedCallbacks.forEach((r, n) => {
              r.forEach((i) => Cp(t, n, void 0, i));
            }),
            this._queuedCallbacks.clear(),
            (this._containsRealPlayer = !0),
            this.overrideTotalTime(t.totalTime),
            (this.queued = !1));
        }
        getRealPlayer() {
          return this._player;
        }
        overrideTotalTime(t) {
          this.totalTime = t;
        }
        syncPlayerEvents(t) {
          const r = this._player;
          r.triggerCallback && t.onStart(() => r.triggerCallback("start")),
            t.onDone(() => this.finish()),
            t.onDestroy(() => this.destroy());
        }
        _queueEvent(t, r) {
          $t(this._queuedCallbacks, t, []).push(r);
        }
        onDone(t) {
          this.queued && this._queueEvent("done", t), this._player.onDone(t);
        }
        onStart(t) {
          this.queued && this._queueEvent("start", t), this._player.onStart(t);
        }
        onDestroy(t) {
          this.queued && this._queueEvent("destroy", t),
            this._player.onDestroy(t);
        }
        init() {
          this._player.init();
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted();
        }
        play() {
          !this.queued && this._player.play();
        }
        pause() {
          !this.queued && this._player.pause();
        }
        restart() {
          !this.queued && this._player.restart();
        }
        finish() {
          this._player.finish();
        }
        destroy() {
          (this.destroyed = !0), this._player.destroy();
        }
        reset() {
          !this.queued && this._player.reset();
        }
        setPosition(t) {
          this.queued || this._player.setPosition(t);
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(t) {
          const r = this._player;
          r.triggerCallback && r.triggerCallback(t);
        }
      }
      function Lu(e) {
        return e && 1 === e.nodeType;
      }
      function RS(e, t) {
        const r = e.style.display;
        return (e.style.display = t ?? "none"), r;
      }
      function PS(e, t, r, n, i) {
        const s = [];
        r.forEach((l) => s.push(RS(l)));
        const o = [];
        n.forEach((l, u) => {
          const c = new Map();
          l.forEach((d) => {
            const f = t.computeStyle(u, d, i);
            c.set(d, f), (!f || 0 == f.length) && ((u[dn] = N$), o.push(u));
          }),
            e.set(u, c);
        });
        let a = 0;
        return r.forEach((l) => RS(l, s[a++])), o;
      }
      function OS(e, t) {
        const r = new Map();
        if ((e.forEach((a) => r.set(a, [])), 0 == t.length)) return r;
        const i = new Set(t),
          s = new Map();
        function o(a) {
          if (!a) return 1;
          let l = s.get(a);
          if (l) return l;
          const u = a.parentNode;
          return (l = r.has(u) ? u : i.has(u) ? 1 : o(u)), s.set(a, l), l;
        }
        return (
          t.forEach((a) => {
            const l = o(a);
            1 !== l && r.get(l).push(a);
          }),
          r
        );
      }
      function Xt(e, t) {
        e.classList?.add(t);
      }
      function ms(e, t) {
        e.classList?.remove(t);
      }
      function k$(e, t, r) {
        Tr(r).onDone(() => e.processLeaveNode(t));
      }
      function xS(e, t) {
        for (let r = 0; r < e.length; r++) {
          const n = e[r];
          n instanceof lS ? xS(n.players, t) : t.push(n);
        }
      }
      function FS(e, t, r) {
        const n = r.get(e);
        if (!n) return !1;
        let i = t.get(e);
        return i ? n.forEach((s) => i.add(s)) : t.set(e, n), r.delete(e), !0;
      }
      class Vu {
        constructor(t, r, n) {
          (this.bodyNode = t),
            (this._driver = r),
            (this._normalizer = n),
            (this._triggerCache = {}),
            (this.onRemovalComplete = (i, s) => {}),
            (this._transitionEngine = new P$(t, r, n)),
            (this._timelineEngine = new b$(t, r, n)),
            (this._transitionEngine.onRemovalComplete = (i, s) =>
              this.onRemovalComplete(i, s));
        }
        registerTrigger(t, r, n, i, s) {
          const o = t + "-" + i;
          let a = this._triggerCache[o];
          if (!a) {
            const l = [],
              c = Rp(this._driver, s, l, []);
            if (l.length)
              throw (function Mj(e, t) {
                return new C(3404, !1);
              })();
            (a = (function D$(e, t, r) {
              return new C$(e, t, r);
            })(i, c, this._normalizer)),
              (this._triggerCache[o] = a);
          }
          this._transitionEngine.registerTrigger(r, i, a);
        }
        register(t, r) {
          this._transitionEngine.register(t, r);
        }
        destroy(t, r) {
          this._transitionEngine.destroy(t, r);
        }
        onInsert(t, r, n, i) {
          this._transitionEngine.insertNode(t, r, n, i);
        }
        onRemove(t, r, n) {
          this._transitionEngine.removeNode(t, r, n);
        }
        disableAnimations(t, r) {
          this._transitionEngine.markElementAsDisabled(t, r);
        }
        process(t, r, n, i) {
          if ("@" == n.charAt(0)) {
            const [s, o] = dS(n);
            this._timelineEngine.command(s, r, o, i);
          } else this._transitionEngine.trigger(t, r, n, i);
        }
        listen(t, r, n, i, s) {
          if ("@" == n.charAt(0)) {
            const [o, a] = dS(n);
            return this._timelineEngine.listen(o, r, a, s);
          }
          return this._transitionEngine.listen(t, r, n, i, s);
        }
        flush(t = -1) {
          this._transitionEngine.flush(t);
        }
        get players() {
          return [
            ...this._transitionEngine.players,
            ...this._timelineEngine.players,
          ];
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone();
        }
        afterFlushAnimationsDone(t) {
          this._transitionEngine.afterFlushAnimationsDone(t);
        }
      }
      let $$ = (() => {
        class t {
          constructor(n, i, s) {
            (this._element = n),
              (this._startStyles = i),
              (this._endStyles = s),
              (this._state = 0);
            let o = t.initialStylesByElement.get(n);
            o || t.initialStylesByElement.set(n, (o = new Map())),
              (this._initialStyles = o);
          }
          start() {
            this._state < 1 &&
              (this._startStyles &&
                xn(this._element, this._startStyles, this._initialStyles),
              (this._state = 1));
          }
          finish() {
            this.start(),
              this._state < 2 &&
                (xn(this._element, this._initialStyles),
                this._endStyles &&
                  (xn(this._element, this._endStyles),
                  (this._endStyles = null)),
                (this._state = 1));
          }
          destroy() {
            this.finish(),
              this._state < 3 &&
                (t.initialStylesByElement.delete(this._element),
                this._startStyles &&
                  (ri(this._element, this._startStyles),
                  (this._endStyles = null)),
                this._endStyles &&
                  (ri(this._element, this._endStyles),
                  (this._endStyles = null)),
                xn(this._element, this._initialStyles),
                (this._state = 3));
          }
        }
        return (t.initialStylesByElement = new WeakMap()), t;
      })();
      function Hp(e) {
        let t = null;
        return (
          e.forEach((r, n) => {
            (function B$(e) {
              return "display" === e || "position" === e;
            })(n) && ((t = t || new Map()), t.set(n, r));
          }),
          t
        );
      }
      class kS {
        constructor(t, r, n, i) {
          (this.element = t),
            (this.keyframes = r),
            (this.options = n),
            (this._specialStyles = i),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._initialized = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this.time = 0),
            (this.parentPlayer = null),
            (this.currentSnapshot = new Map()),
            (this._duration = n.duration),
            (this._delay = n.delay || 0),
            (this.time = this._duration + this._delay);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart();
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const t = this.keyframes;
          (this.domPlayer = this._triggerWebAnimation(
            this.element,
            t,
            this.options
          )),
            (this._finalKeyframe = t.length ? t[t.length - 1] : new Map()),
            this.domPlayer.addEventListener("finish", () => this._onFinish());
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _convertKeyframesToObject(t) {
          const r = [];
          return (
            t.forEach((n) => {
              r.push(Object.fromEntries(n));
            }),
            r
          );
        }
        _triggerWebAnimation(t, r, n) {
          return t.animate(this._convertKeyframesToObject(r), n);
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        play() {
          this._buildPlayer(),
            this.hasStarted() ||
              (this._onStartFns.forEach((t) => t()),
              (this._onStartFns = []),
              (this._started = !0),
              this._specialStyles && this._specialStyles.start()),
            this.domPlayer.play();
        }
        pause() {
          this.init(), this.domPlayer.pause();
        }
        finish() {
          this.init(),
            this._specialStyles && this._specialStyles.finish(),
            this._onFinish(),
            this.domPlayer.finish();
        }
        reset() {
          this._resetDomPlayerState(),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
          this.reset(), this.play();
        }
        hasStarted() {
          return this._started;
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._resetDomPlayerState(),
            this._onFinish(),
            this._specialStyles && this._specialStyles.destroy(),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        setPosition(t) {
          void 0 === this.domPlayer && this.init(),
            (this.domPlayer.currentTime = t * this.time);
        }
        getPosition() {
          return +(this.domPlayer.currentTime ?? 0) / this.time;
        }
        get totalTime() {
          return this._delay + this._duration;
        }
        beforeDestroy() {
          const t = new Map();
          this.hasStarted() &&
            this._finalKeyframe.forEach((n, i) => {
              "offset" !== i &&
                t.set(i, this._finished ? n : CS(this.element, i));
            }),
            (this.currentSnapshot = t);
        }
        triggerCallback(t) {
          const r = "start" === t ? this._onStartFns : this._onDoneFns;
          r.forEach((n) => n()), (r.length = 0);
        }
      }
      class H$ {
        validateStyleProperty(t) {
          return !0;
        }
        validateAnimatableStyleProperty(t) {
          return !0;
        }
        matchesElement(t, r) {
          return !1;
        }
        containsElement(t, r) {
          return hS(t, r);
        }
        getParentElement(t) {
          return bp(t);
        }
        query(t, r, n) {
          return pS(t, r, n);
        }
        computeStyle(t, r, n) {
          return window.getComputedStyle(t)[r];
        }
        animate(t, r, n, i, s, o = []) {
          const l = {
            duration: n,
            delay: i,
            fill: 0 == i ? "both" : "forwards",
          };
          s && (l.easing = s);
          const u = new Map(),
            c = o.filter((h) => h instanceof kS);
          (function Kj(e, t) {
            return 0 === e || 0 === t;
          })(n, i) &&
            c.forEach((h) => {
              h.currentSnapshot.forEach((g, m) => u.set(m, g));
            });
          let d = (function Gj(e) {
            return e.length
              ? e[0] instanceof Map
                ? e
                : e.map((t) => yS(t))
              : [];
          })(r).map((h) => Ar(h));
          d = (function Zj(e, t, r) {
            if (r.size && t.length) {
              let n = t[0],
                i = [];
              if (
                (r.forEach((s, o) => {
                  n.has(o) || i.push(o), n.set(o, s);
                }),
                i.length)
              )
                for (let s = 1; s < t.length; s++) {
                  let o = t[s];
                  i.forEach((a) => o.set(a, CS(e, a)));
                }
            }
            return t;
          })(t, d, u);
          const f = (function j$(e, t) {
            let r = null,
              n = null;
            return (
              Array.isArray(t) && t.length
                ? ((r = Hp(t[0])), t.length > 1 && (n = Hp(t[t.length - 1])))
                : t instanceof Map && (r = Hp(t)),
              r || n ? new $$(e, r, n) : null
            );
          })(t, d);
          return new kS(t, d, l, f);
        }
      }
      let U$ = (() => {
        var e;
        class t extends rS {
          constructor(n, i) {
            super(),
              (this._nextAnimationId = 0),
              (this._renderer = n.createRenderer(i.body, {
                id: "0",
                encapsulation: zt.None,
                styles: [],
                data: { animation: [] },
              }));
          }
          build(n) {
            const i = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const s = Array.isArray(n) ? sS(n) : n;
            return (
              LS(this._renderer, null, i, "register", [s]),
              new z$(i, this._renderer)
            );
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(io), M(pt));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      class z$ extends rj {
        constructor(t, r) {
          super(), (this._id = t), (this._renderer = r);
        }
        create(t, r) {
          return new q$(this._id, t, r || {}, this._renderer);
        }
      }
      class q$ {
        constructor(t, r, n, i) {
          (this.id = t),
            (this.element = r),
            (this._renderer = i),
            (this.parentPlayer = null),
            (this._started = !1),
            (this.totalTime = 0),
            this._command("create", n);
        }
        _listen(t, r) {
          return this._renderer.listen(this.element, `@@${this.id}:${t}`, r);
        }
        _command(t, ...r) {
          return LS(this._renderer, this.element, this.id, t, r);
        }
        onDone(t) {
          this._listen("done", t);
        }
        onStart(t) {
          this._listen("start", t);
        }
        onDestroy(t) {
          this._listen("destroy", t);
        }
        init() {
          this._command("init");
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this._command("play"), (this._started = !0);
        }
        pause() {
          this._command("pause");
        }
        restart() {
          this._command("restart");
        }
        finish() {
          this._command("finish");
        }
        destroy() {
          this._command("destroy");
        }
        reset() {
          this._command("reset"), (this._started = !1);
        }
        setPosition(t) {
          this._command("setPosition", t);
        }
        getPosition() {
          return this._renderer.engine.players[+this.id]?.getPosition() ?? 0;
        }
      }
      function LS(e, t, r, n, i) {
        return e.setProperty(t, `@@${r}:${n}`, i);
      }
      const VS = "@.disabled";
      let G$ = (() => {
        var e;
        class t {
          constructor(n, i, s) {
            (this.delegate = n),
              (this.engine = i),
              (this._zone = s),
              (this._currentId = 0),
              (this._microtaskId = 1),
              (this._animationCallbacksBuffer = []),
              (this._rendererCache = new Map()),
              (this._cdRecurDepth = 0),
              (i.onRemovalComplete = (o, a) => {
                const l = a?.parentNode(o);
                l && a.removeChild(l, o);
              });
          }
          createRenderer(n, i) {
            const o = this.delegate.createRenderer(n, i);
            if (!(n && i && i.data && i.data.animation)) {
              let d = this._rendererCache.get(o);
              return (
                d ||
                  ((d = new jS("", o, this.engine, () =>
                    this._rendererCache.delete(o)
                  )),
                  this._rendererCache.set(o, d)),
                d
              );
            }
            const a = i.id,
              l = i.id + "-" + this._currentId;
            this._currentId++, this.engine.register(l, n);
            const u = (d) => {
              Array.isArray(d)
                ? d.forEach(u)
                : this.engine.registerTrigger(a, l, n, d.name, d);
            };
            return i.data.animation.forEach(u), new W$(this, l, o, this.engine);
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
          }
          _scheduleCountTask() {
            queueMicrotask(() => {
              this._microtaskId++;
            });
          }
          scheduleListenerCallback(n, i, s) {
            n >= 0 && n < this._microtaskId
              ? this._zone.run(() => i(s))
              : (0 == this._animationCallbacksBuffer.length &&
                  queueMicrotask(() => {
                    this._zone.run(() => {
                      this._animationCallbacksBuffer.forEach((o) => {
                        const [a, l] = o;
                        a(l);
                      }),
                        (this._animationCallbacksBuffer = []);
                    });
                  }),
                this._animationCallbacksBuffer.push([i, s]));
          }
          end() {
            this._cdRecurDepth--,
              0 == this._cdRecurDepth &&
                this._zone.runOutsideAngular(() => {
                  this._scheduleCountTask(),
                    this.engine.flush(this._microtaskId);
                }),
              this.delegate.end && this.delegate.end();
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone();
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(io), M(Vu), M(ue));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      class jS {
        constructor(t, r, n, i) {
          (this.namespaceId = t),
            (this.delegate = r),
            (this.engine = n),
            (this._onDestroy = i);
        }
        get data() {
          return this.delegate.data;
        }
        destroyNode(t) {
          this.delegate.destroyNode?.(t);
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate),
            this.engine.afterFlushAnimationsDone(() => {
              queueMicrotask(() => {
                this.delegate.destroy();
              });
            }),
            this._onDestroy?.();
        }
        createElement(t, r) {
          return this.delegate.createElement(t, r);
        }
        createComment(t) {
          return this.delegate.createComment(t);
        }
        createText(t) {
          return this.delegate.createText(t);
        }
        appendChild(t, r) {
          this.delegate.appendChild(t, r),
            this.engine.onInsert(this.namespaceId, r, t, !1);
        }
        insertBefore(t, r, n, i = !0) {
          this.delegate.insertBefore(t, r, n),
            this.engine.onInsert(this.namespaceId, r, t, i);
        }
        removeChild(t, r, n) {
          this.engine.onRemove(this.namespaceId, r, this.delegate);
        }
        selectRootElement(t, r) {
          return this.delegate.selectRootElement(t, r);
        }
        parentNode(t) {
          return this.delegate.parentNode(t);
        }
        nextSibling(t) {
          return this.delegate.nextSibling(t);
        }
        setAttribute(t, r, n, i) {
          this.delegate.setAttribute(t, r, n, i);
        }
        removeAttribute(t, r, n) {
          this.delegate.removeAttribute(t, r, n);
        }
        addClass(t, r) {
          this.delegate.addClass(t, r);
        }
        removeClass(t, r) {
          this.delegate.removeClass(t, r);
        }
        setStyle(t, r, n, i) {
          this.delegate.setStyle(t, r, n, i);
        }
        removeStyle(t, r, n) {
          this.delegate.removeStyle(t, r, n);
        }
        setProperty(t, r, n) {
          "@" == r.charAt(0) && r == VS
            ? this.disableAnimations(t, !!n)
            : this.delegate.setProperty(t, r, n);
        }
        setValue(t, r) {
          this.delegate.setValue(t, r);
        }
        listen(t, r, n) {
          return this.delegate.listen(t, r, n);
        }
        disableAnimations(t, r) {
          this.engine.disableAnimations(t, r);
        }
      }
      class W$ extends jS {
        constructor(t, r, n, i, s) {
          super(r, n, i, s), (this.factory = t), (this.namespaceId = r);
        }
        setProperty(t, r, n) {
          "@" == r.charAt(0)
            ? "." == r.charAt(1) && r == VS
              ? this.disableAnimations(t, (n = void 0 === n || !!n))
              : this.engine.process(this.namespaceId, t, r.slice(1), n)
            : this.delegate.setProperty(t, r, n);
        }
        listen(t, r, n) {
          if ("@" == r.charAt(0)) {
            const i = (function Q$(e) {
              switch (e) {
                case "body":
                  return document.body;
                case "document":
                  return document;
                case "window":
                  return window;
                default:
                  return e;
              }
            })(t);
            let s = r.slice(1),
              o = "";
            return (
              "@" != s.charAt(0) &&
                ([s, o] = (function K$(e) {
                  const t = e.indexOf(".");
                  return [e.substring(0, t), e.slice(t + 1)];
                })(s)),
              this.engine.listen(this.namespaceId, i, s, o, (a) => {
                this.factory.scheduleListenerCallback(a._data || -1, n, a);
              })
            );
          }
          return this.delegate.listen(t, r, n);
        }
      }
      const $S = [
          { provide: rS, useClass: U$ },
          {
            provide: kp,
            useFactory: function Y$() {
              return new m$();
            },
          },
          {
            provide: Vu,
            useClass: (() => {
              var e;
              class t extends Vu {
                constructor(n, i, s, o) {
                  super(n.body, i, s);
                }
                ngOnDestroy() {
                  this.flush();
                }
              }
              return (
                ((e = t).ɵfac = function (n) {
                  return new (n || e)(M(pt), M(Sp), M(kp), M(Zr));
                }),
                (e.ɵprov = R({ token: e, factory: e.ɵfac })),
                t
              );
            })(),
          },
          {
            provide: io,
            useFactory: function X$(e, t, r) {
              return new G$(e, t, r);
            },
            deps: [Wh, Vu, ue],
          },
        ],
        Up = [
          { provide: Sp, useFactory: () => new H$() },
          { provide: Sy, useValue: "BrowserAnimations" },
          ...$S,
        ],
        BS = [
          { provide: Sp, useClass: gS },
          { provide: Sy, useValue: "NoopAnimations" },
          ...$S,
        ];
      let J$ = (() => {
        var e;
        class t {
          static withConfig(n) {
            return { ngModule: t, providers: n.disableAnimations ? BS : Up };
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = Nt({ type: e })),
          (e.ɵinj = yt({ providers: Up, imports: [OE] })),
          t
        );
      })();
      function zp(...e) {
        const t = Is(e),
          r = Wg(e),
          { args: n, keys: i } = eb(e);
        if (0 === n.length) return Le([], t);
        const s = new Ie(
          (function tB(e, t, r = or) {
            return (n) => {
              HS(
                t,
                () => {
                  const { length: i } = e,
                    s = new Array(i);
                  let o = i,
                    a = i;
                  for (let l = 0; l < i; l++)
                    HS(
                      t,
                      () => {
                        const u = Le(e[l], t);
                        let c = !1;
                        u.subscribe(
                          Oe(
                            n,
                            (d) => {
                              (s[l] = d),
                                c || ((c = !0), a--),
                                a || n.next(r(s.slice()));
                            },
                            () => {
                              --o || n.complete();
                            }
                          )
                        );
                      },
                      n
                    );
                },
                n
              );
            };
          })(n, t, i ? (o) => tb(i, o) : or)
        );
        return r ? s.pipe(tp(r)) : s;
      }
      function HS(e, t, r) {
        e ? $n(r, e, t) : t();
      }
      const $u = Ss(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function Bu(...e) {
        return (function nB() {
          return hi(1);
        })()(Le(e, Is(e)));
      }
      function US(e) {
        return new Ie((t) => {
          it(e()).subscribe(t);
        });
      }
      function Go(e, t) {
        const r = ee(e) ? e : () => e,
          n = (i) => i.error(r());
        return new Ie(t ? (i) => t.schedule(n, 0, i) : n);
      }
      function qp() {
        return Ne((e, t) => {
          let r = null;
          e._refCount++;
          const n = Oe(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (r = null);
            const i = e._connection,
              s = r;
            (r = null),
              i && (!s || i === s) && i.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(n), n.closed || (r = e.connect());
        });
      }
      class zS extends Ie {
        constructor(t, r) {
          super(),
            (this.source = t),
            (this.subjectFactory = r),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Pg(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null), t?.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new vt();
            const r = this.getSubject();
            t.add(
              this.source.subscribe(
                Oe(
                  r,
                  void 0,
                  () => {
                    this._teardown(), r.complete();
                  },
                  (n) => {
                    this._teardown(), r.error(n);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = vt.EMPTY));
          }
          return t;
        }
        refCount() {
          return qp()(this);
        }
      }
      function Fn(e) {
        return e <= 0
          ? () => pn
          : Ne((t, r) => {
              let n = 0;
              t.subscribe(
                Oe(r, (i) => {
                  ++n <= e && (r.next(i), e <= n && r.complete());
                })
              );
            });
      }
      function Hu(e) {
        return Ne((t, r) => {
          let n = !1;
          t.subscribe(
            Oe(
              r,
              (i) => {
                (n = !0), r.next(i);
              },
              () => {
                n || r.next(e), r.complete();
              }
            )
          );
        });
      }
      function qS(e = iB) {
        return Ne((t, r) => {
          let n = !1;
          t.subscribe(
            Oe(
              r,
              (i) => {
                (n = !0), r.next(i);
              },
              () => (n ? r.complete() : r.error(e()))
            )
          );
        });
      }
      function iB() {
        return new $u();
      }
      function kn(e, t) {
        const r = arguments.length >= 2;
        return (n) =>
          n.pipe(
            e ? Mt((i, s) => e(i, s, n)) : or,
            Fn(1),
            r ? Hu(t) : qS(() => new $u())
          );
      }
      function Y(e, t, r) {
        const n = ee(e) || t || r ? { next: e, error: t, complete: r } : e;
        return n
          ? Ne((i, s) => {
              var o;
              null === (o = n.subscribe) || void 0 === o || o.call(n);
              let a = !0;
              i.subscribe(
                Oe(
                  s,
                  (l) => {
                    var u;
                    null === (u = n.next) || void 0 === u || u.call(n, l),
                      s.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = n.complete) || void 0 === l || l.call(n),
                      s.complete();
                  },
                  (l) => {
                    var u;
                    (a = !1),
                      null === (u = n.error) || void 0 === u || u.call(n, l),
                      s.error(l);
                  },
                  () => {
                    var l, u;
                    a &&
                      (null === (l = n.unsubscribe) ||
                        void 0 === l ||
                        l.call(n)),
                      null === (u = n.finalize) || void 0 === u || u.call(n);
                  }
                )
              );
            })
          : or;
      }
      function si(e) {
        return Ne((t, r) => {
          let s,
            n = null,
            i = !1;
          (n = t.subscribe(
            Oe(r, void 0, void 0, (o) => {
              (s = it(e(o, si(e)(t)))),
                n ? (n.unsubscribe(), (n = null), s.subscribe(r)) : (i = !0);
            })
          )),
            i && (n.unsubscribe(), (n = null), s.subscribe(r));
        });
      }
      function GS(e, t, r, n, i) {
        return (s, o) => {
          let a = r,
            l = t,
            u = 0;
          s.subscribe(
            Oe(
              o,
              (c) => {
                const d = u++;
                (l = a ? e(l, c, d) : ((a = !0), c)), n && o.next(l);
              },
              i &&
                (() => {
                  a && o.next(l), o.complete();
                })
            )
          );
        };
      }
      function Gp(e) {
        return e <= 0
          ? () => pn
          : Ne((t, r) => {
              let n = [];
              t.subscribe(
                Oe(
                  r,
                  (i) => {
                    n.push(i), e < n.length && n.shift();
                  },
                  () => {
                    for (const i of n) r.next(i);
                    r.complete();
                  },
                  void 0,
                  () => {
                    n = null;
                  }
                )
              );
            });
      }
      function WS(e) {
        return te(() => e);
      }
      const Z = "primary",
        Wo = Symbol("RouteTitle");
      class lB {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const r = this.params[t];
            return Array.isArray(r) ? r[0] : r;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const r = this.params[t];
            return Array.isArray(r) ? r : [r];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function vs(e) {
        return new lB(e);
      }
      function uB(e, t, r) {
        const n = r.path.split("/");
        if (
          n.length > e.length ||
          ("full" === r.pathMatch && (t.hasChildren() || n.length < e.length))
        )
          return null;
        const i = {};
        for (let s = 0; s < n.length; s++) {
          const o = n[s],
            a = e[s];
          if (o.startsWith(":")) i[o.substring(1)] = a;
          else if (o !== a.path) return null;
        }
        return { consumed: e.slice(0, n.length), posParams: i };
      }
      function Ln(e, t) {
        const r = e ? Object.keys(e) : void 0,
          n = t ? Object.keys(t) : void 0;
        if (!r || !n || r.length != n.length) return !1;
        let i;
        for (let s = 0; s < r.length; s++)
          if (((i = r[s]), !QS(e[i], t[i]))) return !1;
        return !0;
      }
      function QS(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const r = [...e].sort(),
            n = [...t].sort();
          return r.every((i, s) => n[s] === i);
        }
        return e === t;
      }
      function KS(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Nr(e) {
        return (function eB(e) {
          return !!e && (e instanceof Ie || (ee(e.lift) && ee(e.subscribe)));
        })(e)
          ? e
          : mo(e)
          ? Le(Promise.resolve(e))
          : V(e);
      }
      const dB = {
          exact: function XS(e, t, r) {
            if (
              !oi(e.segments, t.segments) ||
              !Uu(e.segments, t.segments, r) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const n in t.children)
              if (!e.children[n] || !XS(e.children[n], t.children[n], r))
                return !1;
            return !0;
          },
          subset: JS,
        },
        ZS = {
          exact: function fB(e, t) {
            return Ln(e, t);
          },
          subset: function hB(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((r) => QS(e[r], t[r]))
            );
          },
          ignored: () => !0,
        };
      function YS(e, t, r) {
        return (
          dB[r.paths](e.root, t.root, r.matrixParams) &&
          ZS[r.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === r.fragment && e.fragment !== t.fragment)
        );
      }
      function JS(e, t, r) {
        return e0(e, t, t.segments, r);
      }
      function e0(e, t, r, n) {
        if (e.segments.length > r.length) {
          const i = e.segments.slice(0, r.length);
          return !(!oi(i, r) || t.hasChildren() || !Uu(i, r, n));
        }
        if (e.segments.length === r.length) {
          if (!oi(e.segments, r) || !Uu(e.segments, r, n)) return !1;
          for (const i in t.children)
            if (!e.children[i] || !JS(e.children[i], t.children[i], n))
              return !1;
          return !0;
        }
        {
          const i = r.slice(0, e.segments.length),
            s = r.slice(e.segments.length);
          return (
            !!(oi(e.segments, i) && Uu(e.segments, i, n) && e.children[Z]) &&
            e0(e.children[Z], t, s, n)
          );
        }
      }
      function Uu(e, t, r) {
        return t.every((n, i) => ZS[r](e[i].parameters, n.parameters));
      }
      class ys {
        constructor(t = new pe([], {}), r = {}, n = null) {
          (this.root = t), (this.queryParams = r), (this.fragment = n);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = vs(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return mB.serialize(this);
        }
      }
      class pe {
        constructor(t, r) {
          (this.segments = t),
            (this.children = r),
            (this.parent = null),
            Object.values(r).forEach((n) => (n.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return zu(this);
        }
      }
      class Qo {
        constructor(t, r) {
          (this.path = t), (this.parameters = r);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = vs(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return r0(this);
        }
      }
      function oi(e, t) {
        return e.length === t.length && e.every((r, n) => r.path === t[n].path);
      }
      let Ko = (() => {
        var e;
        class t {}
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return new Wp();
            },
            providedIn: "root",
          })),
          t
        );
      })();
      class Wp {
        parse(t) {
          const r = new IB(t);
          return new ys(
            r.parseRootSegment(),
            r.parseQueryParams(),
            r.parseFragment()
          );
        }
        serialize(t) {
          const r = `/${Zo(t.root, !0)}`,
            n = (function _B(e) {
              const t = Object.keys(e)
                .map((r) => {
                  const n = e[r];
                  return Array.isArray(n)
                    ? n.map((i) => `${qu(r)}=${qu(i)}`).join("&")
                    : `${qu(r)}=${qu(n)}`;
                })
                .filter((r) => !!r);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${r}${n}${
            "string" == typeof t.fragment
              ? `#${(function vB(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const mB = new Wp();
      function zu(e) {
        return e.segments.map((t) => r0(t)).join("/");
      }
      function Zo(e, t) {
        if (!e.hasChildren()) return zu(e);
        if (t) {
          const r = e.children[Z] ? Zo(e.children[Z], !1) : "",
            n = [];
          return (
            Object.entries(e.children).forEach(([i, s]) => {
              i !== Z && n.push(`${i}:${Zo(s, !1)}`);
            }),
            n.length > 0 ? `${r}(${n.join("//")})` : r
          );
        }
        {
          const r = (function gB(e, t) {
            let r = [];
            return (
              Object.entries(e.children).forEach(([n, i]) => {
                n === Z && (r = r.concat(t(i, n)));
              }),
              Object.entries(e.children).forEach(([n, i]) => {
                n !== Z && (r = r.concat(t(i, n)));
              }),
              r
            );
          })(e, (n, i) =>
            i === Z ? [Zo(e.children[Z], !1)] : [`${i}:${Zo(n, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[Z]
            ? `${zu(e)}/${r[0]}`
            : `${zu(e)}/(${r.join("//")})`;
        }
      }
      function t0(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function qu(e) {
        return t0(e).replace(/%3B/gi, ";");
      }
      function Qp(e) {
        return t0(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function Gu(e) {
        return decodeURIComponent(e);
      }
      function n0(e) {
        return Gu(e.replace(/\+/g, "%20"));
      }
      function r0(e) {
        return `${Qp(e.path)}${(function yB(e) {
          return Object.keys(e)
            .map((t) => `;${Qp(t)}=${Qp(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const DB = /^[^\/()?;#]+/;
      function Kp(e) {
        const t = e.match(DB);
        return t ? t[0] : "";
      }
      const CB = /^[^\/()?;=#]+/,
        EB = /^[^=?&#]+/,
        SB = /^[^&#]+/;
      class IB {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new pe([], {})
              : new pe([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let r = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (r = this.parseParens(!0)));
          let n = {};
          return (
            this.peekStartsWith("(") && (n = this.parseParens(!1)),
            (t.length > 0 || Object.keys(r).length > 0) &&
              (n[Z] = new pe(t, r)),
            n
          );
        }
        parseSegment() {
          const t = Kp(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new C(4009, !1);
          return this.capture(t), new Qo(Gu(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const r = (function wB(e) {
            const t = e.match(CB);
            return t ? t[0] : "";
          })(this.remaining);
          if (!r) return;
          this.capture(r);
          let n = "";
          if (this.consumeOptional("=")) {
            const i = Kp(this.remaining);
            i && ((n = i), this.capture(n));
          }
          t[Gu(r)] = Gu(n);
        }
        parseQueryParam(t) {
          const r = (function bB(e) {
            const t = e.match(EB);
            return t ? t[0] : "";
          })(this.remaining);
          if (!r) return;
          this.capture(r);
          let n = "";
          if (this.consumeOptional("=")) {
            const o = (function MB(e) {
              const t = e.match(SB);
              return t ? t[0] : "";
            })(this.remaining);
            o && ((n = o), this.capture(n));
          }
          const i = n0(r),
            s = n0(n);
          if (t.hasOwnProperty(i)) {
            let o = t[i];
            Array.isArray(o) || ((o = [o]), (t[i] = o)), o.push(s);
          } else t[i] = s;
        }
        parseParens(t) {
          const r = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const n = Kp(this.remaining),
              i = this.remaining[n.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new C(4010, !1);
            let s;
            n.indexOf(":") > -1
              ? ((s = n.slice(0, n.indexOf(":"))),
                this.capture(s),
                this.capture(":"))
              : t && (s = Z);
            const o = this.parseChildren();
            (r[s] = 1 === Object.keys(o).length ? o[Z] : new pe([], o)),
              this.consumeOptional("//");
          }
          return r;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new C(4011, !1);
        }
      }
      function s0(e) {
        return e.segments.length > 0 ? new pe([], { [Z]: e }) : e;
      }
      function o0(e) {
        const t = {};
        for (const n of Object.keys(e.children)) {
          const s = o0(e.children[n]);
          if (n === Z && 0 === s.segments.length && s.hasChildren())
            for (const [o, a] of Object.entries(s.children)) t[o] = a;
          else (s.segments.length > 0 || s.hasChildren()) && (t[n] = s);
        }
        return (function TB(e) {
          if (1 === e.numberOfChildren && e.children[Z]) {
            const t = e.children[Z];
            return new pe(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new pe(e.segments, t));
      }
      function ai(e) {
        return e instanceof ys;
      }
      function a0(e) {
        let t;
        const i = s0(
          (function r(s) {
            const o = {};
            for (const l of s.children) {
              const u = r(l);
              o[l.outlet] = u;
            }
            const a = new pe(s.url, o);
            return s === e && (t = a), a;
          })(e.root)
        );
        return t ?? i;
      }
      function l0(e, t, r, n) {
        let i = e;
        for (; i.parent; ) i = i.parent;
        if (0 === t.length) return Zp(i, i, i, r, n);
        const s = (function NB(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new c0(!0, 0, e);
          let t = 0,
            r = !1;
          const n = e.reduce((i, s, o) => {
            if ("object" == typeof s && null != s) {
              if (s.outlets) {
                const a = {};
                return (
                  Object.entries(s.outlets).forEach(([l, u]) => {
                    a[l] = "string" == typeof u ? u.split("/") : u;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (s.segmentPath) return [...i, s.segmentPath];
            }
            return "string" != typeof s
              ? [...i, s]
              : 0 === o
              ? (s.split("/").forEach((a, l) => {
                  (0 == l && "." === a) ||
                    (0 == l && "" === a
                      ? (r = !0)
                      : ".." === a
                      ? t++
                      : "" != a && i.push(a));
                }),
                i)
              : [...i, s];
          }, []);
          return new c0(r, t, n);
        })(t);
        if (s.toRoot()) return Zp(i, i, new pe([], {}), r, n);
        const o = (function RB(e, t, r) {
            if (e.isAbsolute) return new Qu(t, !0, 0);
            if (!r) return new Qu(t, !1, NaN);
            if (null === r.parent) return new Qu(r, !0, 0);
            const n = Wu(e.commands[0]) ? 0 : 1;
            return (function PB(e, t, r) {
              let n = e,
                i = t,
                s = r;
              for (; s > i; ) {
                if (((s -= i), (n = n.parent), !n)) throw new C(4005, !1);
                i = n.segments.length;
              }
              return new Qu(n, !1, i - s);
            })(r, r.segments.length - 1 + n, e.numberOfDoubleDots);
          })(s, i, e),
          a = o.processChildren
            ? Xo(o.segmentGroup, o.index, s.commands)
            : d0(o.segmentGroup, o.index, s.commands);
        return Zp(i, o.segmentGroup, a, r, n);
      }
      function Wu(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function Yo(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function Zp(e, t, r, n, i) {
        let o,
          s = {};
        n &&
          Object.entries(n).forEach(([l, u]) => {
            s[l] = Array.isArray(u) ? u.map((c) => `${c}`) : `${u}`;
          }),
          (o = e === t ? r : u0(e, t, r));
        const a = s0(o0(o));
        return new ys(a, s, i);
      }
      function u0(e, t, r) {
        const n = {};
        return (
          Object.entries(e.children).forEach(([i, s]) => {
            n[i] = s === t ? r : u0(s, t, r);
          }),
          new pe(e.segments, n)
        );
      }
      class c0 {
        constructor(t, r, n) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = r),
            (this.commands = n),
            t && n.length > 0 && Wu(n[0]))
          )
            throw new C(4003, !1);
          const i = n.find(Yo);
          if (i && i !== KS(n)) throw new C(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class Qu {
        constructor(t, r, n) {
          (this.segmentGroup = t), (this.processChildren = r), (this.index = n);
        }
      }
      function d0(e, t, r) {
        if (
          (e || (e = new pe([], {})),
          0 === e.segments.length && e.hasChildren())
        )
          return Xo(e, t, r);
        const n = (function xB(e, t, r) {
            let n = 0,
              i = t;
            const s = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < e.segments.length; ) {
              if (n >= r.length) return s;
              const o = e.segments[i],
                a = r[n];
              if (Yo(a)) break;
              const l = `${a}`,
                u = n < r.length - 1 ? r[n + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!h0(l, u, o)) return s;
                n += 2;
              } else {
                if (!h0(l, {}, o)) return s;
                n++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: n };
          })(e, t, r),
          i = r.slice(n.commandIndex);
        if (n.match && n.pathIndex < e.segments.length) {
          const s = new pe(e.segments.slice(0, n.pathIndex), {});
          return (
            (s.children[Z] = new pe(e.segments.slice(n.pathIndex), e.children)),
            Xo(s, 0, i)
          );
        }
        return n.match && 0 === i.length
          ? new pe(e.segments, {})
          : n.match && !e.hasChildren()
          ? Yp(e, t, r)
          : n.match
          ? Xo(e, 0, i)
          : Yp(e, t, r);
      }
      function Xo(e, t, r) {
        if (0 === r.length) return new pe(e.segments, {});
        {
          const n = (function OB(e) {
              return Yo(e[0]) ? e[0].outlets : { [Z]: e };
            })(r),
            i = {};
          if (
            Object.keys(n).some((s) => s !== Z) &&
            e.children[Z] &&
            1 === e.numberOfChildren &&
            0 === e.children[Z].segments.length
          ) {
            const s = Xo(e.children[Z], t, r);
            return new pe(e.segments, s.children);
          }
          return (
            Object.entries(n).forEach(([s, o]) => {
              "string" == typeof o && (o = [o]),
                null !== o && (i[s] = d0(e.children[s], t, o));
            }),
            Object.entries(e.children).forEach(([s, o]) => {
              void 0 === n[s] && (i[s] = o);
            }),
            new pe(e.segments, i)
          );
        }
      }
      function Yp(e, t, r) {
        const n = e.segments.slice(0, t);
        let i = 0;
        for (; i < r.length; ) {
          const s = r[i];
          if (Yo(s)) {
            const l = FB(s.outlets);
            return new pe(n, l);
          }
          if (0 === i && Wu(r[0])) {
            n.push(new Qo(e.segments[t].path, f0(r[0]))), i++;
            continue;
          }
          const o = Yo(s) ? s.outlets[Z] : `${s}`,
            a = i < r.length - 1 ? r[i + 1] : null;
          o && a && Wu(a)
            ? (n.push(new Qo(o, f0(a))), (i += 2))
            : (n.push(new Qo(o, {})), i++);
        }
        return new pe(n, {});
      }
      function FB(e) {
        const t = {};
        return (
          Object.entries(e).forEach(([r, n]) => {
            "string" == typeof n && (n = [n]),
              null !== n && (t[r] = Yp(new pe([], {}), 0, n));
          }),
          t
        );
      }
      function f0(e) {
        const t = {};
        return Object.entries(e).forEach(([r, n]) => (t[r] = `${n}`)), t;
      }
      function h0(e, t, r) {
        return e == r.path && Ln(t, r.parameters);
      }
      const Jo = "imperative";
      class Vn {
        constructor(t, r) {
          (this.id = t), (this.url = r);
        }
      }
      class Ku extends Vn {
        constructor(t, r, n = "imperative", i = null) {
          super(t, r),
            (this.type = 0),
            (this.navigationTrigger = n),
            (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Rr extends Vn {
        constructor(t, r, n) {
          super(t, r), (this.urlAfterRedirects = n), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class ea extends Vn {
        constructor(t, r, n, i) {
          super(t, r), (this.reason = n), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class _s extends Vn {
        constructor(t, r, n, i) {
          super(t, r), (this.reason = n), (this.code = i), (this.type = 16);
        }
      }
      class Zu extends Vn {
        constructor(t, r, n, i) {
          super(t, r), (this.error = n), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class p0 extends Vn {
        constructor(t, r, n, i) {
          super(t, r),
            (this.urlAfterRedirects = n),
            (this.state = i),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class kB extends Vn {
        constructor(t, r, n, i) {
          super(t, r),
            (this.urlAfterRedirects = n),
            (this.state = i),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class LB extends Vn {
        constructor(t, r, n, i, s) {
          super(t, r),
            (this.urlAfterRedirects = n),
            (this.state = i),
            (this.shouldActivate = s),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class VB extends Vn {
        constructor(t, r, n, i) {
          super(t, r),
            (this.urlAfterRedirects = n),
            (this.state = i),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class jB extends Vn {
        constructor(t, r, n, i) {
          super(t, r),
            (this.urlAfterRedirects = n),
            (this.state = i),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class $B {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class BB {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class HB {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class UB {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class zB {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class qB {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class g0 {
        constructor(t, r, n) {
          (this.routerEvent = t),
            (this.position = r),
            (this.anchor = n),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class Xp {}
      class Jp {
        constructor(t) {
          this.url = t;
        }
      }
      class GB {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.injector = null),
            (this.children = new ta()),
            (this.attachRef = null);
        }
      }
      let ta = (() => {
        var e;
        class t {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, i) {
            const s = this.getOrCreateContext(n);
            (s.outlet = i), this.contexts.set(n, s);
          }
          onChildOutletDestroyed(n) {
            const i = this.getContext(n);
            i && ((i.outlet = null), (i.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let i = this.getContext(n);
            return i || ((i = new GB()), this.contexts.set(n, i)), i;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      class m0 {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const r = this.pathFromRoot(t);
          return r.length > 1 ? r[r.length - 2] : null;
        }
        children(t) {
          const r = eg(t, this._root);
          return r ? r.children.map((n) => n.value) : [];
        }
        firstChild(t) {
          const r = eg(t, this._root);
          return r && r.children.length > 0 ? r.children[0].value : null;
        }
        siblings(t) {
          const r = tg(t, this._root);
          return r.length < 2
            ? []
            : r[r.length - 2].children
                .map((i) => i.value)
                .filter((i) => i !== t);
        }
        pathFromRoot(t) {
          return tg(t, this._root).map((r) => r.value);
        }
      }
      function eg(e, t) {
        if (e === t.value) return t;
        for (const r of t.children) {
          const n = eg(e, r);
          if (n) return n;
        }
        return null;
      }
      function tg(e, t) {
        if (e === t.value) return [t];
        for (const r of t.children) {
          const n = tg(e, r);
          if (n.length) return n.unshift(t), n;
        }
        return [];
      }
      class nr {
        constructor(t, r) {
          (this.value = t), (this.children = r);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function Ds(e) {
        const t = {};
        return e && e.children.forEach((r) => (t[r.value.outlet] = r)), t;
      }
      class v0 extends m0 {
        constructor(t, r) {
          super(t), (this.snapshot = r), ng(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function y0(e, t) {
        const r = (function WB(e, t) {
            const o = new Yu([], {}, {}, "", {}, Z, t, null, {});
            return new D0("", new nr(o, []));
          })(0, t),
          n = new st([new Qo("", {})]),
          i = new st({}),
          s = new st({}),
          o = new st({}),
          a = new st(""),
          l = new rr(n, i, o, a, s, Z, t, r.root);
        return (l.snapshot = r.root), new v0(new nr(l, []), r);
      }
      class rr {
        constructor(t, r, n, i, s, o, a, l) {
          (this.urlSubject = t),
            (this.paramsSubject = r),
            (this.queryParamsSubject = n),
            (this.fragmentSubject = i),
            (this.dataSubject = s),
            (this.outlet = o),
            (this.component = a),
            (this._futureSnapshot = l),
            (this.title =
              this.dataSubject?.pipe(te((u) => u[Wo])) ?? V(void 0)),
            (this.url = t),
            (this.params = r),
            (this.queryParams = n),
            (this.fragment = i),
            (this.data = s);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(te((t) => vs(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(te((t) => vs(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function _0(e, t = "emptyOnly") {
        const r = e.pathFromRoot;
        let n = 0;
        if ("always" !== t)
          for (n = r.length - 1; n >= 1; ) {
            const i = r[n],
              s = r[n - 1];
            if (i.routeConfig && "" === i.routeConfig.path) n--;
            else {
              if (s.component) break;
              n--;
            }
          }
        return (function QB(e) {
          return e.reduce(
            (t, r) => ({
              params: { ...t.params, ...r.params },
              data: { ...t.data, ...r.data },
              resolve: {
                ...r.data,
                ...t.resolve,
                ...r.routeConfig?.data,
                ...r._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(r.slice(n));
      }
      class Yu {
        get title() {
          return this.data?.[Wo];
        }
        constructor(t, r, n, i, s, o, a, l, u) {
          (this.url = t),
            (this.params = r),
            (this.queryParams = n),
            (this.fragment = i),
            (this.data = s),
            (this.outlet = o),
            (this.component = a),
            (this.routeConfig = l),
            (this._resolve = u);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = vs(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = vs(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((n) => n.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class D0 extends m0 {
        constructor(t, r) {
          super(r), (this.url = t), ng(this, r);
        }
        toString() {
          return C0(this._root);
        }
      }
      function ng(e, t) {
        (t.value._routerState = e), t.children.forEach((r) => ng(e, r));
      }
      function C0(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(C0).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function rg(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            r = e._futureSnapshot;
          (e.snapshot = r),
            Ln(t.queryParams, r.queryParams) ||
              e.queryParamsSubject.next(r.queryParams),
            t.fragment !== r.fragment && e.fragmentSubject.next(r.fragment),
            Ln(t.params, r.params) || e.paramsSubject.next(r.params),
            (function cB(e, t) {
              if (e.length !== t.length) return !1;
              for (let r = 0; r < e.length; ++r) if (!Ln(e[r], t[r])) return !1;
              return !0;
            })(t.url, r.url) || e.urlSubject.next(r.url),
            Ln(t.data, r.data) || e.dataSubject.next(r.data);
        } else
          (e.snapshot = e._futureSnapshot),
            e.dataSubject.next(e._futureSnapshot.data);
      }
      function ig(e, t) {
        const r =
          Ln(e.params, t.params) &&
          (function pB(e, t) {
            return (
              oi(e, t) && e.every((r, n) => Ln(r.parameters, t[n].parameters))
            );
          })(e.url, t.url);
        return (
          r &&
          !(!e.parent != !t.parent) &&
          (!e.parent || ig(e.parent, t.parent))
        );
      }
      let sg = (() => {
        var e;
        class t {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = Z),
              (this.activateEvents = new ve()),
              (this.deactivateEvents = new ve()),
              (this.attachEvents = new ve()),
              (this.detachEvents = new ve()),
              (this.parentContexts = P(ta)),
              (this.location = P(ln)),
              (this.changeDetector = P(Io)),
              (this.environmentInjector = P(Ft)),
              (this.inputBinder = P(Xu, { optional: !0 })),
              (this.supportsBindingToComponentInputs = !0);
          }
          get activatedComponentRef() {
            return this.activated;
          }
          ngOnChanges(n) {
            if (n.name) {
              const { firstChange: i, previousValue: s } = n.name;
              if (i) return;
              this.isTrackedInParentContexts(s) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(s)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name),
              this.inputBinder?.unsubscribeFromRouteData(this);
          }
          isTrackedInParentContexts(n) {
            return this.parentContexts.getContext(n)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const n = this.parentContexts.getContext(this.name);
            n?.route &&
              (n.attachRef
                ? this.attach(n.attachRef, n.route)
                : this.activateWith(n.route, n.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new C(4012, !1);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new C(4012, !1);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new C(4012, !1);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, i) {
            (this.activated = n),
              (this._activatedRoute = i),
              this.location.insert(n.hostView),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, i) {
            if (this.isActivated) throw new C(4013, !1);
            this._activatedRoute = n;
            const s = this.location,
              a = n.snapshot.component,
              l = this.parentContexts.getOrCreateContext(this.name).children,
              u = new KB(n, l, s.injector);
            (this.activated = s.createComponent(a, {
              index: s.length,
              injector: u,
              environmentInjector: i ?? this.environmentInjector,
            })),
              this.changeDetector.markForCheck(),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵdir = B({
            type: e,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [Pt],
          })),
          t
        );
      })();
      class KB {
        constructor(t, r, n) {
          (this.route = t), (this.childContexts = r), (this.parent = n);
        }
        get(t, r) {
          return t === rr
            ? this.route
            : t === ta
            ? this.childContexts
            : this.parent.get(t, r);
        }
      }
      const Xu = new O("");
      let w0 = (() => {
        var e;
        class t {
          constructor() {
            this.outletDataSubscriptions = new Map();
          }
          bindActivatedRouteToOutletComponent(n) {
            this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
          }
          unsubscribeFromRouteData(n) {
            this.outletDataSubscriptions.get(n)?.unsubscribe(),
              this.outletDataSubscriptions.delete(n);
          }
          subscribeToRouteData(n) {
            const { activatedRoute: i } = n,
              s = zp([i.queryParams, i.params, i.data])
                .pipe(
                  Xe(
                    ([o, a, l], u) => (
                      (l = { ...o, ...a, ...l }),
                      0 === u ? V(l) : Promise.resolve(l)
                    )
                  )
                )
                .subscribe((o) => {
                  if (
                    !n.isActivated ||
                    !n.activatedComponentRef ||
                    n.activatedRoute !== i ||
                    null === i.component
                  )
                    return void this.unsubscribeFromRouteData(n);
                  const a = (function rk(e) {
                    const t = ne(e);
                    if (!t) return null;
                    const r = new co(t);
                    return {
                      get selector() {
                        return r.selector;
                      },
                      get type() {
                        return r.componentType;
                      },
                      get inputs() {
                        return r.inputs;
                      },
                      get outputs() {
                        return r.outputs;
                      },
                      get ngContentSelectors() {
                        return r.ngContentSelectors;
                      },
                      get isStandalone() {
                        return t.standalone;
                      },
                      get isSignal() {
                        return t.signals;
                      },
                    };
                  })(i.component);
                  if (a)
                    for (const { templateName: l } of a.inputs)
                      n.activatedComponentRef.setInput(l, o[l]);
                  else this.unsubscribeFromRouteData(n);
                });
            this.outletDataSubscriptions.set(n, s);
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      function na(e, t, r) {
        if (r && e.shouldReuseRoute(t.value, r.value.snapshot)) {
          const n = r.value;
          n._futureSnapshot = t.value;
          const i = (function YB(e, t, r) {
            return t.children.map((n) => {
              for (const i of r.children)
                if (e.shouldReuseRoute(n.value, i.value.snapshot))
                  return na(e, n, i);
              return na(e, n);
            });
          })(e, t, r);
          return new nr(n, i);
        }
        {
          if (e.shouldAttach(t.value)) {
            const s = e.retrieve(t.value);
            if (null !== s) {
              const o = s.route;
              return (
                (o.value._futureSnapshot = t.value),
                (o.children = t.children.map((a) => na(e, a))),
                o
              );
            }
          }
          const n = (function XB(e) {
              return new rr(
                new st(e.url),
                new st(e.params),
                new st(e.queryParams),
                new st(e.fragment),
                new st(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            i = t.children.map((s) => na(e, s));
          return new nr(n, i);
        }
      }
      const og = "ngNavigationCancelingError";
      function E0(e, t) {
        const { redirectTo: r, navigationBehaviorOptions: n } = ai(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          i = b0(!1, 0, t);
        return (i.url = r), (i.navigationBehaviorOptions = n), i;
      }
      function b0(e, t, r) {
        const n = new Error("NavigationCancelingError: " + (e || ""));
        return (n[og] = !0), (n.cancellationCode = t), r && (n.url = r), n;
      }
      function S0(e) {
        return e && e[og];
      }
      let M0 = (() => {
        var e;
        class t {}
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = Ue({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [yC],
            decls: 1,
            vars: 0,
            template: function (n, i) {
              1 & n && q(0, "router-outlet");
            },
            dependencies: [sg],
            encapsulation: 2,
          })),
          t
        );
      })();
      function ag(e) {
        const t = e.children && e.children.map(ag),
          r = t ? { ...e, children: t } : { ...e };
        return (
          !r.component &&
            !r.loadComponent &&
            (t || r.loadChildren) &&
            r.outlet &&
            r.outlet !== Z &&
            (r.component = M0),
          r
        );
      }
      function fn(e) {
        return e.outlet || Z;
      }
      function ra(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let t = e.parent; t; t = t.parent) {
          const r = t.routeConfig;
          if (r?._loadedInjector) return r._loadedInjector;
          if (r?._injector) return r._injector;
        }
        return null;
      }
      class oH {
        constructor(t, r, n, i, s) {
          (this.routeReuseStrategy = t),
            (this.futureState = r),
            (this.currState = n),
            (this.forwardEvent = i),
            (this.inputBindingEnabled = s);
        }
        activate(t) {
          const r = this.futureState._root,
            n = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(r, n, t),
            rg(this.futureState.root),
            this.activateChildRoutes(r, n, t);
        }
        deactivateChildRoutes(t, r, n) {
          const i = Ds(r);
          t.children.forEach((s) => {
            const o = s.value.outlet;
            this.deactivateRoutes(s, i[o], n), delete i[o];
          }),
            Object.values(i).forEach((s) => {
              this.deactivateRouteAndItsChildren(s, n);
            });
        }
        deactivateRoutes(t, r, n) {
          const i = t.value,
            s = r ? r.value : null;
          if (i === s)
            if (i.component) {
              const o = n.getContext(i.outlet);
              o && this.deactivateChildRoutes(t, r, o.children);
            } else this.deactivateChildRoutes(t, r, n);
          else s && this.deactivateRouteAndItsChildren(r, n);
        }
        deactivateRouteAndItsChildren(t, r) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, r)
            : this.deactivateRouteAndOutlet(t, r);
        }
        detachAndStoreRouteSubtree(t, r) {
          const n = r.getContext(t.value.outlet),
            i = n && t.value.component ? n.children : r,
            s = Ds(t);
          for (const o of Object.keys(s))
            this.deactivateRouteAndItsChildren(s[o], i);
          if (n && n.outlet) {
            const o = n.outlet.detach(),
              a = n.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: o,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, r) {
          const n = r.getContext(t.value.outlet),
            i = n && t.value.component ? n.children : r,
            s = Ds(t);
          for (const o of Object.keys(s))
            this.deactivateRouteAndItsChildren(s[o], i);
          n &&
            (n.outlet &&
              (n.outlet.deactivate(), n.children.onOutletDeactivated()),
            (n.attachRef = null),
            (n.route = null));
        }
        activateChildRoutes(t, r, n) {
          const i = Ds(r);
          t.children.forEach((s) => {
            this.activateRoutes(s, i[s.value.outlet], n),
              this.forwardEvent(new qB(s.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new UB(t.value.snapshot));
        }
        activateRoutes(t, r, n) {
          const i = t.value,
            s = r ? r.value : null;
          if ((rg(i), i === s))
            if (i.component) {
              const o = n.getOrCreateContext(i.outlet);
              this.activateChildRoutes(t, r, o.children);
            } else this.activateChildRoutes(t, r, n);
          else if (i.component) {
            const o = n.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                o.children.onOutletReAttached(a.contexts),
                (o.attachRef = a.componentRef),
                (o.route = a.route.value),
                o.outlet && o.outlet.attach(a.componentRef, a.route.value),
                rg(a.route.value),
                this.activateChildRoutes(t, null, o.children);
            } else {
              const a = ra(i.snapshot);
              (o.attachRef = null),
                (o.route = i),
                (o.injector = a),
                o.outlet && o.outlet.activateWith(i, o.injector),
                this.activateChildRoutes(t, null, o.children);
            }
          } else this.activateChildRoutes(t, null, n);
        }
      }
      class I0 {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Ju {
        constructor(t, r) {
          (this.component = t), (this.route = r);
        }
      }
      function aH(e, t, r) {
        const n = e._root;
        return ia(n, t ? t._root : null, r, [n.value]);
      }
      function Cs(e, t) {
        const r = Symbol(),
          n = t.get(e, r);
        return n === r
          ? "function" != typeof e ||
            (function yI(e) {
              return null !== ya(e);
            })(e)
            ? t.get(e)
            : e
          : n;
      }
      function ia(
        e,
        t,
        r,
        n,
        i = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const s = Ds(t);
        return (
          e.children.forEach((o) => {
            (function uH(
              e,
              t,
              r,
              n,
              i = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const s = e.value,
                o = t ? t.value : null,
                a = r ? r.getContext(e.value.outlet) : null;
              if (o && s.routeConfig === o.routeConfig) {
                const l = (function cH(e, t, r) {
                  if ("function" == typeof r) return r(e, t);
                  switch (r) {
                    case "pathParamsChange":
                      return !oi(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !oi(e.url, t.url) || !Ln(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !ig(e, t) || !Ln(e.queryParams, t.queryParams);
                    default:
                      return !ig(e, t);
                  }
                })(o, s, s.routeConfig.runGuardsAndResolvers);
                l
                  ? i.canActivateChecks.push(new I0(n))
                  : ((s.data = o.data), (s._resolvedData = o._resolvedData)),
                  ia(e, t, s.component ? (a ? a.children : null) : r, n, i),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new Ju(a.outlet.component, o));
              } else
                o && sa(t, a, i),
                  i.canActivateChecks.push(new I0(n)),
                  ia(e, null, s.component ? (a ? a.children : null) : r, n, i);
            })(o, s[o.value.outlet], r, n.concat([o.value]), i),
              delete s[o.value.outlet];
          }),
          Object.entries(s).forEach(([o, a]) => sa(a, r.getContext(o), i)),
          i
        );
      }
      function sa(e, t, r) {
        const n = Ds(e),
          i = e.value;
        Object.entries(n).forEach(([s, o]) => {
          sa(o, i.component ? (t ? t.children.getContext(s) : null) : t, r);
        }),
          r.canDeactivateChecks.push(
            new Ju(
              i.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              i
            )
          );
      }
      function oa(e) {
        return "function" == typeof e;
      }
      function T0(e) {
        return e instanceof $u || "EmptyError" === e?.name;
      }
      const ec = Symbol("INITIAL_VALUE");
      function ws() {
        return Xe((e) =>
          zp(
            e.map((t) =>
              t.pipe(
                Fn(1),
                (function rB(...e) {
                  const t = Is(e);
                  return Ne((r, n) => {
                    (t ? Bu(e, r, t) : Bu(e, r)).subscribe(n);
                  });
                })(ec)
              )
            )
          ).pipe(
            te((t) => {
              for (const r of t)
                if (!0 !== r) {
                  if (r === ec) return ec;
                  if (!1 === r || r instanceof ys) return r;
                }
              return !0;
            }),
            Mt((t) => t !== ec),
            Fn(1)
          )
        );
      }
      function A0(e) {
        return (function wM(...e) {
          return Ag(e);
        })(
          Y((t) => {
            if (ai(t)) throw E0(0, t);
          }),
          te((t) => !0 === t)
        );
      }
      class tc {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class N0 {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function Es(e) {
        return Go(new tc(e));
      }
      function R0(e) {
        return Go(new N0(e));
      }
      class NH {
        constructor(t, r) {
          (this.urlSerializer = t), (this.urlTree = r);
        }
        noMatchError(t) {
          return new C(4002, !1);
        }
        lineralizeSegments(t, r) {
          let n = [],
            i = r.root;
          for (;;) {
            if (((n = n.concat(i.segments)), 0 === i.numberOfChildren))
              return V(n);
            if (i.numberOfChildren > 1 || !i.children[Z])
              return Go(new C(4e3, !1));
            i = i.children[Z];
          }
        }
        applyRedirectCommands(t, r, n) {
          return this.applyRedirectCreateUrlTree(
            r,
            this.urlSerializer.parse(r),
            t,
            n
          );
        }
        applyRedirectCreateUrlTree(t, r, n, i) {
          const s = this.createSegmentGroup(t, r.root, n, i);
          return new ys(
            s,
            this.createQueryParams(r.queryParams, this.urlTree.queryParams),
            r.fragment
          );
        }
        createQueryParams(t, r) {
          const n = {};
          return (
            Object.entries(t).forEach(([i, s]) => {
              if ("string" == typeof s && s.startsWith(":")) {
                const a = s.substring(1);
                n[i] = r[a];
              } else n[i] = s;
            }),
            n
          );
        }
        createSegmentGroup(t, r, n, i) {
          const s = this.createSegments(t, r.segments, n, i);
          let o = {};
          return (
            Object.entries(r.children).forEach(([a, l]) => {
              o[a] = this.createSegmentGroup(t, l, n, i);
            }),
            new pe(s, o)
          );
        }
        createSegments(t, r, n, i) {
          return r.map((s) =>
            s.path.startsWith(":")
              ? this.findPosParam(t, s, i)
              : this.findOrReturn(s, n)
          );
        }
        findPosParam(t, r, n) {
          const i = n[r.path.substring(1)];
          if (!i) throw new C(4001, !1);
          return i;
        }
        findOrReturn(t, r) {
          let n = 0;
          for (const i of r) {
            if (i.path === t.path) return r.splice(n), i;
            n++;
          }
          return t;
        }
      }
      const lg = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function RH(e, t, r, n, i) {
        const s = ug(e, t, r);
        return s.matched
          ? ((n = (function eH(e, t) {
              return (
                e.providers &&
                  !e._injector &&
                  (e._injector = $f(e.providers, t, `Route: ${e.path}`)),
                e._injector ?? t
              );
            })(t, n)),
            (function IH(e, t, r, n) {
              const i = t.canMatch;
              return i && 0 !== i.length
                ? V(
                    i.map((o) => {
                      const a = Cs(o, e);
                      return Nr(
                        (function mH(e) {
                          return e && oa(e.canMatch);
                        })(a)
                          ? a.canMatch(t, r)
                          : e.runInContext(() => a(t, r))
                      );
                    })
                  ).pipe(ws(), A0())
                : V(!0);
            })(n, t, r).pipe(te((o) => (!0 === o ? s : { ...lg }))))
          : V(s);
      }
      function ug(e, t, r) {
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || r.length > 0)
            ? { ...lg }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: r,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (t.matcher || uB)(r, e, t);
        if (!i) return { ...lg };
        const s = {};
        Object.entries(i.posParams ?? {}).forEach(([a, l]) => {
          s[a] = l.path;
        });
        const o =
          i.consumed.length > 0
            ? { ...s, ...i.consumed[i.consumed.length - 1].parameters }
            : s;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: r.slice(i.consumed.length),
          parameters: o,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function P0(e, t, r, n) {
        return r.length > 0 &&
          (function xH(e, t, r) {
            return r.some((n) => nc(e, t, n) && fn(n) !== Z);
          })(e, r, n)
          ? {
              segmentGroup: new pe(t, OH(n, new pe(r, e.children))),
              slicedSegments: [],
            }
          : 0 === r.length &&
            (function FH(e, t, r) {
              return r.some((n) => nc(e, t, n));
            })(e, r, n)
          ? {
              segmentGroup: new pe(e.segments, PH(e, 0, r, n, e.children)),
              slicedSegments: r,
            }
          : { segmentGroup: new pe(e.segments, e.children), slicedSegments: r };
      }
      function PH(e, t, r, n, i) {
        const s = {};
        for (const o of n)
          if (nc(e, r, o) && !i[fn(o)]) {
            const a = new pe([], {});
            s[fn(o)] = a;
          }
        return { ...i, ...s };
      }
      function OH(e, t) {
        const r = {};
        r[Z] = t;
        for (const n of e)
          if ("" === n.path && fn(n) !== Z) {
            const i = new pe([], {});
            r[fn(n)] = i;
          }
        return r;
      }
      function nc(e, t, r) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== r.pathMatch) &&
          "" === r.path
        );
      }
      class jH {
        constructor(t, r, n, i, s, o, a) {
          (this.injector = t),
            (this.configLoader = r),
            (this.rootComponentType = n),
            (this.config = i),
            (this.urlTree = s),
            (this.paramsInheritanceStrategy = o),
            (this.urlSerializer = a),
            (this.allowRedirects = !0),
            (this.applyRedirects = new NH(this.urlSerializer, this.urlTree));
        }
        noMatchError(t) {
          return new C(4002, !1);
        }
        recognize() {
          const t = P0(this.urlTree.root, [], [], this.config).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            Z
          ).pipe(
            si((r) => {
              if (r instanceof N0)
                return (
                  (this.allowRedirects = !1),
                  (this.urlTree = r.urlTree),
                  this.match(r.urlTree)
                );
              throw r instanceof tc ? this.noMatchError(r) : r;
            }),
            te((r) => {
              const n = new Yu(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  Z,
                  this.rootComponentType,
                  null,
                  {}
                ),
                i = new nr(n, r),
                s = new D0("", i),
                o = (function AB(e, t, r = null, n = null) {
                  return l0(a0(e), t, r, n);
                })(n, [], this.urlTree.queryParams, this.urlTree.fragment);
              return (
                (o.queryParams = this.urlTree.queryParams),
                (s.url = this.urlSerializer.serialize(o)),
                this.inheritParamsAndData(s._root),
                { state: s, tree: o }
              );
            })
          );
        }
        match(t) {
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t.root,
            Z
          ).pipe(
            si((n) => {
              throw n instanceof tc ? this.noMatchError(n) : n;
            })
          );
        }
        inheritParamsAndData(t) {
          const r = t.value,
            n = _0(r, this.paramsInheritanceStrategy);
          (r.params = Object.freeze(n.params)),
            (r.data = Object.freeze(n.data)),
            t.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(t, r, n, i) {
          return 0 === n.segments.length && n.hasChildren()
            ? this.processChildren(t, r, n)
            : this.processSegment(t, r, n, n.segments, i, !0);
        }
        processChildren(t, r, n) {
          const i = [];
          for (const s of Object.keys(n.children))
            "primary" === s ? i.unshift(s) : i.push(s);
          return Le(i).pipe(
            ls((s) => {
              const o = n.children[s],
                a = (function iH(e, t) {
                  const r = e.filter((n) => fn(n) === t);
                  return r.push(...e.filter((n) => fn(n) !== t)), r;
                })(r, s);
              return this.processSegmentGroup(t, a, o, s);
            }),
            (function sB(e, t) {
              return Ne(GS(e, t, arguments.length >= 2, !0));
            })((s, o) => (s.push(...o), s)),
            Hu(null),
            (function oB(e, t) {
              const r = arguments.length >= 2;
              return (n) =>
                n.pipe(
                  e ? Mt((i, s) => e(i, s, n)) : or,
                  Gp(1),
                  r ? Hu(t) : qS(() => new $u())
                );
            })(),
            je((s) => {
              if (null === s) return Es(n);
              const o = O0(s);
              return (
                (function $H(e) {
                  e.sort((t, r) =>
                    t.value.outlet === Z
                      ? -1
                      : r.value.outlet === Z
                      ? 1
                      : t.value.outlet.localeCompare(r.value.outlet)
                  );
                })(o),
                V(o)
              );
            })
          );
        }
        processSegment(t, r, n, i, s, o) {
          return Le(r).pipe(
            ls((a) =>
              this.processSegmentAgainstRoute(
                a._injector ?? t,
                r,
                a,
                n,
                i,
                s,
                o
              ).pipe(
                si((l) => {
                  if (l instanceof tc) return V(null);
                  throw l;
                })
              )
            ),
            kn((a) => !!a),
            si((a) => {
              if (T0(a))
                return (function LH(e, t, r) {
                  return 0 === t.length && !e.children[r];
                })(n, i, s)
                  ? V([])
                  : Es(n);
              throw a;
            })
          );
        }
        processSegmentAgainstRoute(t, r, n, i, s, o, a) {
          return (function kH(e, t, r, n) {
            return (
              !!(fn(e) === n || (n !== Z && nc(t, r, e))) &&
              ("**" === e.path || ug(t, e, r).matched)
            );
          })(n, i, s, o)
            ? void 0 === n.redirectTo
              ? this.matchSegmentAgainstRoute(t, i, n, s, o, a)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, i, r, n, s, o)
              : Es(i)
            : Es(i);
        }
        expandSegmentAgainstRouteUsingRedirect(t, r, n, i, s, o) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, i, o)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                r,
                n,
                i,
                s,
                o
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, n, i) {
          const s = this.applyRedirects.applyRedirectCommands(
            [],
            n.redirectTo,
            {}
          );
          return n.redirectTo.startsWith("/")
            ? R0(s)
            : this.applyRedirects.lineralizeSegments(n, s).pipe(
                je((o) => {
                  const a = new pe(o, {});
                  return this.processSegment(t, r, a, o, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, r, n, i, s, o) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: u,
            positionalParamSegments: c,
          } = ug(r, i, s);
          if (!a) return Es(r);
          const d = this.applyRedirects.applyRedirectCommands(
            l,
            i.redirectTo,
            c
          );
          return i.redirectTo.startsWith("/")
            ? R0(d)
            : this.applyRedirects
                .lineralizeSegments(i, d)
                .pipe(
                  je((f) => this.processSegment(t, n, r, f.concat(u), o, !1))
                );
        }
        matchSegmentAgainstRoute(t, r, n, i, s, o) {
          let a;
          if ("**" === n.path) {
            const l = i.length > 0 ? KS(i).parameters : {};
            (a = V({
              snapshot: new Yu(
                i,
                l,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                x0(n),
                fn(n),
                n.component ?? n._loadedComponent ?? null,
                n,
                F0(n)
              ),
              consumedSegments: [],
              remainingSegments: [],
            })),
              (r.children = {});
          } else
            a = RH(r, n, i, t).pipe(
              te(
                ({
                  matched: l,
                  consumedSegments: u,
                  remainingSegments: c,
                  parameters: d,
                }) =>
                  l
                    ? {
                        snapshot: new Yu(
                          u,
                          d,
                          Object.freeze({ ...this.urlTree.queryParams }),
                          this.urlTree.fragment,
                          x0(n),
                          fn(n),
                          n.component ?? n._loadedComponent ?? null,
                          n,
                          F0(n)
                        ),
                        consumedSegments: u,
                        remainingSegments: c,
                      }
                    : null
              )
            );
          return a.pipe(
            Xe((l) =>
              null === l
                ? Es(r)
                : this.getChildConfig((t = n._injector ?? t), n, i).pipe(
                    Xe(({ routes: u }) => {
                      const c = n._loadedInjector ?? t,
                        {
                          snapshot: d,
                          consumedSegments: f,
                          remainingSegments: h,
                        } = l,
                        { segmentGroup: g, slicedSegments: m } = P0(r, f, h, u);
                      if (0 === m.length && g.hasChildren())
                        return this.processChildren(c, u, g).pipe(
                          te((D) => (null === D ? null : [new nr(d, D)]))
                        );
                      if (0 === u.length && 0 === m.length)
                        return V([new nr(d, [])]);
                      const y = fn(n) === s;
                      return this.processSegment(
                        c,
                        u,
                        g,
                        m,
                        y ? Z : s,
                        !0
                      ).pipe(te((D) => [new nr(d, D)]));
                    })
                  )
            )
          );
        }
        getChildConfig(t, r, n) {
          return r.children
            ? V({ routes: r.children, injector: t })
            : r.loadChildren
            ? void 0 !== r._loadedRoutes
              ? V({ routes: r._loadedRoutes, injector: r._loadedInjector })
              : (function MH(e, t, r, n) {
                  const i = t.canLoad;
                  return void 0 === i || 0 === i.length
                    ? V(!0)
                    : V(
                        i.map((o) => {
                          const a = Cs(o, e);
                          return Nr(
                            (function fH(e) {
                              return e && oa(e.canLoad);
                            })(a)
                              ? a.canLoad(t, r)
                              : e.runInContext(() => a(t, r))
                          );
                        })
                      ).pipe(ws(), A0());
                })(t, r, n).pipe(
                  je((i) =>
                    i
                      ? this.configLoader.loadChildren(t, r).pipe(
                          Y((s) => {
                            (r._loadedRoutes = s.routes),
                              (r._loadedInjector = s.injector);
                          })
                        )
                      : (function AH(e) {
                          return Go(b0(!1, 3));
                        })()
                  )
                )
            : V({ routes: [], injector: t });
        }
      }
      function BH(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path;
      }
      function O0(e) {
        const t = [],
          r = new Set();
        for (const n of e) {
          if (!BH(n)) {
            t.push(n);
            continue;
          }
          const i = t.find((s) => n.value.routeConfig === s.value.routeConfig);
          void 0 !== i ? (i.children.push(...n.children), r.add(i)) : t.push(n);
        }
        for (const n of r) {
          const i = O0(n.children);
          t.push(new nr(n.value, i));
        }
        return t.filter((n) => !r.has(n));
      }
      function x0(e) {
        return e.data || {};
      }
      function F0(e) {
        return e.resolve || {};
      }
      function k0(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function cg(e) {
        return Xe((t) => {
          const r = e(t);
          return r ? Le(r).pipe(te(() => t)) : V(t);
        });
      }
      const bs = new O("ROUTES");
      let dg = (() => {
        var e;
        class t {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = P(cw));
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return V(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const i = Nr(n.loadComponent()).pipe(
                te(L0),
                Y((o) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = o);
                }),
                Oo(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              s = new zS(i, () => new be()).pipe(qp());
            return this.componentLoaders.set(n, s), s;
          }
          loadChildren(n, i) {
            if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
            if (i._loadedRoutes)
              return V({
                routes: i._loadedRoutes,
                injector: i._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(i);
            const o = (function QH(e, t, r, n) {
                return Nr(e.loadChildren()).pipe(
                  te(L0),
                  je((i) =>
                    i instanceof mC || Array.isArray(i)
                      ? V(i)
                      : Le(t.compileModuleAsync(i))
                  ),
                  te((i) => {
                    n && n(e);
                    let s,
                      o,
                      a = !1;
                    return (
                      Array.isArray(i)
                        ? ((o = i), !0)
                        : ((s = i.create(r).injector),
                          (o = s
                            .get(bs, [], { optional: !0, self: !0 })
                            .flat())),
                      { routes: o.map(ag), injector: s }
                    );
                  })
                );
              })(i, this.compiler, n, this.onLoadEndListener).pipe(
                Oo(() => {
                  this.childrenLoaders.delete(i);
                })
              ),
              a = new zS(o, () => new be()).pipe(qp());
            return this.childrenLoaders.set(i, a), a;
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function L0(e) {
        return (function KH(e) {
          return e && "object" == typeof e && "default" in e;
        })(e)
          ? e.default
          : e;
      }
      let rc = (() => {
        var e;
        class t {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.currentTransition = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new be()),
              (this.transitionAbortSubject = new be()),
              (this.configLoader = P(dg)),
              (this.environmentInjector = P(Ft)),
              (this.urlSerializer = P(Ko)),
              (this.rootContexts = P(ta)),
              (this.inputBindingEnabled = null !== P(Xu, { optional: !0 })),
              (this.navigationId = 0),
              (this.afterPreactivation = () => V(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (s) =>
                this.events.next(new BB(s))),
              (this.configLoader.onLoadStartListener = (s) =>
                this.events.next(new $B(s)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(n) {
            const i = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...n, id: i });
          }
          setupNavigations(n, i, s) {
            return (
              (this.transitions = new st({
                id: 0,
                currentUrlTree: i,
                currentRawUrl: i,
                currentBrowserUrl: i,
                extractedUrl: n.urlHandlingStrategy.extract(i),
                urlAfterRedirects: n.urlHandlingStrategy.extract(i),
                rawUrl: i,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Jo,
                restoredState: null,
                currentSnapshot: s.snapshot,
                targetSnapshot: null,
                currentRouterState: s,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                Mt((o) => 0 !== o.id),
                te((o) => ({
                  ...o,
                  extractedUrl: n.urlHandlingStrategy.extract(o.rawUrl),
                })),
                Xe((o) => {
                  this.currentTransition = o;
                  let a = !1,
                    l = !1;
                  return V(o).pipe(
                    Y((u) => {
                      this.currentNavigation = {
                        id: u.id,
                        initialUrl: u.rawUrl,
                        extractedUrl: u.extractedUrl,
                        trigger: u.source,
                        extras: u.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    Xe((u) => {
                      const c = u.currentBrowserUrl.toString(),
                        d =
                          !n.navigated ||
                          u.extractedUrl.toString() !== c ||
                          c !== u.currentUrlTree.toString();
                      if (
                        !d &&
                        "reload" !==
                          (u.extras.onSameUrlNavigation ??
                            n.onSameUrlNavigation)
                      ) {
                        const h = "";
                        return (
                          this.events.next(
                            new _s(
                              u.id,
                              this.urlSerializer.serialize(u.rawUrl),
                              h,
                              0
                            )
                          ),
                          u.resolve(null),
                          pn
                        );
                      }
                      if (n.urlHandlingStrategy.shouldProcessUrl(u.rawUrl))
                        return V(u).pipe(
                          Xe((h) => {
                            const g = this.transitions?.getValue();
                            return (
                              this.events.next(
                                new Ku(
                                  h.id,
                                  this.urlSerializer.serialize(h.extractedUrl),
                                  h.source,
                                  h.restoredState
                                )
                              ),
                              g !== this.transitions?.getValue()
                                ? pn
                                : Promise.resolve(h)
                            );
                          }),
                          (function HH(e, t, r, n, i, s) {
                            return je((o) =>
                              (function VH(e, t, r, n, i, s, o = "emptyOnly") {
                                return new jH(e, t, r, n, i, o, s).recognize();
                              })(e, t, r, n, o.extractedUrl, i, s).pipe(
                                te(({ state: a, tree: l }) => ({
                                  ...o,
                                  targetSnapshot: a,
                                  urlAfterRedirects: l,
                                }))
                              )
                            );
                          })(
                            this.environmentInjector,
                            this.configLoader,
                            this.rootComponentType,
                            n.config,
                            this.urlSerializer,
                            n.paramsInheritanceStrategy
                          ),
                          Y((h) => {
                            (o.targetSnapshot = h.targetSnapshot),
                              (o.urlAfterRedirects = h.urlAfterRedirects),
                              (this.currentNavigation = {
                                ...this.currentNavigation,
                                finalUrl: h.urlAfterRedirects,
                              });
                            const g = new p0(
                              h.id,
                              this.urlSerializer.serialize(h.extractedUrl),
                              this.urlSerializer.serialize(h.urlAfterRedirects),
                              h.targetSnapshot
                            );
                            this.events.next(g);
                          })
                        );
                      if (
                        d &&
                        n.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)
                      ) {
                        const {
                            id: h,
                            extractedUrl: g,
                            source: m,
                            restoredState: y,
                            extras: D,
                          } = u,
                          v = new Ku(h, this.urlSerializer.serialize(g), m, y);
                        this.events.next(v);
                        const A = y0(0, this.rootComponentType).snapshot;
                        return (
                          (this.currentTransition = o =
                            {
                              ...u,
                              targetSnapshot: A,
                              urlAfterRedirects: g,
                              extras: {
                                ...D,
                                skipLocationChange: !1,
                                replaceUrl: !1,
                              },
                            }),
                          V(o)
                        );
                      }
                      {
                        const h = "";
                        return (
                          this.events.next(
                            new _s(
                              u.id,
                              this.urlSerializer.serialize(u.extractedUrl),
                              h,
                              1
                            )
                          ),
                          u.resolve(null),
                          pn
                        );
                      }
                    }),
                    Y((u) => {
                      const c = new kB(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(c);
                    }),
                    te(
                      (u) => (
                        (this.currentTransition = o =
                          {
                            ...u,
                            guards: aH(
                              u.targetSnapshot,
                              u.currentSnapshot,
                              this.rootContexts
                            ),
                          }),
                        o
                      )
                    ),
                    (function yH(e, t) {
                      return je((r) => {
                        const {
                          targetSnapshot: n,
                          currentSnapshot: i,
                          guards: {
                            canActivateChecks: s,
                            canDeactivateChecks: o,
                          },
                        } = r;
                        return 0 === o.length && 0 === s.length
                          ? V({ ...r, guardsResult: !0 })
                          : (function _H(e, t, r, n) {
                              return Le(e).pipe(
                                je((i) =>
                                  (function SH(e, t, r, n, i) {
                                    const s =
                                      t && t.routeConfig
                                        ? t.routeConfig.canDeactivate
                                        : null;
                                    return s && 0 !== s.length
                                      ? V(
                                          s.map((a) => {
                                            const l = ra(t) ?? i,
                                              u = Cs(a, l);
                                            return Nr(
                                              (function gH(e) {
                                                return e && oa(e.canDeactivate);
                                              })(u)
                                                ? u.canDeactivate(e, t, r, n)
                                                : l.runInContext(() =>
                                                    u(e, t, r, n)
                                                  )
                                            ).pipe(kn());
                                          })
                                        ).pipe(ws())
                                      : V(!0);
                                  })(i.component, i.route, r, t, n)
                                ),
                                kn((i) => !0 !== i, !0)
                              );
                            })(o, n, i, e).pipe(
                              je((a) =>
                                a &&
                                (function dH(e) {
                                  return "boolean" == typeof e;
                                })(a)
                                  ? (function DH(e, t, r, n) {
                                      return Le(t).pipe(
                                        ls((i) =>
                                          Bu(
                                            (function wH(e, t) {
                                              return (
                                                null !== e && t && t(new HB(e)),
                                                V(!0)
                                              );
                                            })(i.route.parent, n),
                                            (function CH(e, t) {
                                              return (
                                                null !== e && t && t(new zB(e)),
                                                V(!0)
                                              );
                                            })(i.route, n),
                                            (function bH(e, t, r) {
                                              const n = t[t.length - 1],
                                                s = t
                                                  .slice(0, t.length - 1)
                                                  .reverse()
                                                  .map((o) =>
                                                    (function lH(e) {
                                                      const t = e.routeConfig
                                                        ? e.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return t && 0 !== t.length
                                                        ? { node: e, guards: t }
                                                        : null;
                                                    })(o)
                                                  )
                                                  .filter((o) => null !== o)
                                                  .map((o) =>
                                                    US(() =>
                                                      V(
                                                        o.guards.map((l) => {
                                                          const u =
                                                              ra(o.node) ?? r,
                                                            c = Cs(l, u);
                                                          return Nr(
                                                            (function pH(e) {
                                                              return (
                                                                e &&
                                                                oa(
                                                                  e.canActivateChild
                                                                )
                                                              );
                                                            })(c)
                                                              ? c.canActivateChild(
                                                                  n,
                                                                  e
                                                                )
                                                              : u.runInContext(
                                                                  () => c(n, e)
                                                                )
                                                          ).pipe(kn());
                                                        })
                                                      ).pipe(ws())
                                                    )
                                                  );
                                              return V(s).pipe(ws());
                                            })(e, i.path, r),
                                            (function EH(e, t, r) {
                                              const n = t.routeConfig
                                                ? t.routeConfig.canActivate
                                                : null;
                                              if (!n || 0 === n.length)
                                                return V(!0);
                                              const i = n.map((s) =>
                                                US(() => {
                                                  const o = ra(t) ?? r,
                                                    a = Cs(s, o);
                                                  return Nr(
                                                    (function hH(e) {
                                                      return (
                                                        e && oa(e.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(t, e)
                                                      : o.runInContext(() =>
                                                          a(t, e)
                                                        )
                                                  ).pipe(kn());
                                                })
                                              );
                                              return V(i).pipe(ws());
                                            })(e, i.route, r)
                                          )
                                        ),
                                        kn((i) => !0 !== i, !0)
                                      );
                                    })(n, s, e, t)
                                  : V(a)
                              ),
                              te((a) => ({ ...r, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (u) => this.events.next(u)),
                    Y((u) => {
                      if (
                        ((o.guardsResult = u.guardsResult), ai(u.guardsResult))
                      )
                        throw E0(0, u.guardsResult);
                      const c = new LB(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot,
                        !!u.guardsResult
                      );
                      this.events.next(c);
                    }),
                    Mt(
                      (u) =>
                        !!u.guardsResult ||
                        (this.cancelNavigationTransition(u, "", 3), !1)
                    ),
                    cg((u) => {
                      if (u.guards.canActivateChecks.length)
                        return V(u).pipe(
                          Y((c) => {
                            const d = new VB(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              this.urlSerializer.serialize(c.urlAfterRedirects),
                              c.targetSnapshot
                            );
                            this.events.next(d);
                          }),
                          Xe((c) => {
                            let d = !1;
                            return V(c).pipe(
                              (function UH(e, t) {
                                return je((r) => {
                                  const {
                                    targetSnapshot: n,
                                    guards: { canActivateChecks: i },
                                  } = r;
                                  if (!i.length) return V(r);
                                  let s = 0;
                                  return Le(i).pipe(
                                    ls((o) =>
                                      (function zH(e, t, r, n) {
                                        const i = e.routeConfig,
                                          s = e._resolve;
                                        return (
                                          void 0 !== i?.title &&
                                            !k0(i) &&
                                            (s[Wo] = i.title),
                                          (function qH(e, t, r, n) {
                                            const i = (function GH(e) {
                                              return [
                                                ...Object.keys(e),
                                                ...Object.getOwnPropertySymbols(
                                                  e
                                                ),
                                              ];
                                            })(e);
                                            if (0 === i.length) return V({});
                                            const s = {};
                                            return Le(i).pipe(
                                              je((o) =>
                                                (function WH(e, t, r, n) {
                                                  const i = ra(t) ?? n,
                                                    s = Cs(e, i);
                                                  return Nr(
                                                    s.resolve
                                                      ? s.resolve(t, r)
                                                      : i.runInContext(() =>
                                                          s(t, r)
                                                        )
                                                  );
                                                })(e[o], t, r, n).pipe(
                                                  kn(),
                                                  Y((a) => {
                                                    s[o] = a;
                                                  })
                                                )
                                              ),
                                              Gp(1),
                                              WS(s),
                                              si((o) => (T0(o) ? pn : Go(o)))
                                            );
                                          })(s, e, t, n).pipe(
                                            te(
                                              (o) => (
                                                (e._resolvedData = o),
                                                (e.data = _0(e, r).resolve),
                                                i &&
                                                  k0(i) &&
                                                  (e.data[Wo] = i.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(o.route, n, e, t)
                                    ),
                                    Y(() => s++),
                                    Gp(1),
                                    je((o) => (s === i.length ? V(r) : pn))
                                  );
                                });
                              })(
                                n.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              Y({
                                next: () => (d = !0),
                                complete: () => {
                                  d ||
                                    this.cancelNavigationTransition(c, "", 2);
                                },
                              })
                            );
                          }),
                          Y((c) => {
                            const d = new jB(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              this.urlSerializer.serialize(c.urlAfterRedirects),
                              c.targetSnapshot
                            );
                            this.events.next(d);
                          })
                        );
                    }),
                    cg((u) => {
                      const c = (d) => {
                        const f = [];
                        d.routeConfig?.loadComponent &&
                          !d.routeConfig._loadedComponent &&
                          f.push(
                            this.configLoader.loadComponent(d.routeConfig).pipe(
                              Y((h) => {
                                d.component = h;
                              }),
                              te(() => {})
                            )
                          );
                        for (const h of d.children) f.push(...c(h));
                        return f;
                      };
                      return zp(c(u.targetSnapshot.root)).pipe(Hu(), Fn(1));
                    }),
                    cg(() => this.afterPreactivation()),
                    te((u) => {
                      const c = (function ZB(e, t, r) {
                        const n = na(e, t._root, r ? r._root : void 0);
                        return new v0(n, t);
                      })(
                        n.routeReuseStrategy,
                        u.targetSnapshot,
                        u.currentRouterState
                      );
                      return (
                        (this.currentTransition = o =
                          { ...u, targetRouterState: c }),
                        o
                      );
                    }),
                    Y(() => {
                      this.events.next(new Xp());
                    }),
                    ((e, t, r, n) =>
                      te(
                        (i) => (
                          new oH(
                            t,
                            i.targetRouterState,
                            i.currentRouterState,
                            r,
                            n
                          ).activate(e),
                          i
                        )
                      ))(
                      this.rootContexts,
                      n.routeReuseStrategy,
                      (u) => this.events.next(u),
                      this.inputBindingEnabled
                    ),
                    Fn(1),
                    Y({
                      next: (u) => {
                        (a = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          this.events.next(
                            new Rr(
                              u.id,
                              this.urlSerializer.serialize(u.extractedUrl),
                              this.urlSerializer.serialize(u.urlAfterRedirects)
                            )
                          ),
                          n.titleStrategy?.updateTitle(
                            u.targetRouterState.snapshot
                          ),
                          u.resolve(!0);
                      },
                      complete: () => {
                        a = !0;
                      },
                    }),
                    (function aB(e) {
                      return Ne((t, r) => {
                        it(e).subscribe(Oe(r, () => r.complete(), ha)),
                          !r.closed && t.subscribe(r);
                      });
                    })(
                      this.transitionAbortSubject.pipe(
                        Y((u) => {
                          throw u;
                        })
                      )
                    ),
                    Oo(() => {
                      a || l || this.cancelNavigationTransition(o, "", 1),
                        this.currentNavigation?.id === o.id &&
                          (this.currentNavigation = null);
                    }),
                    si((u) => {
                      if (((l = !0), S0(u)))
                        this.events.next(
                          new ea(
                            o.id,
                            this.urlSerializer.serialize(o.extractedUrl),
                            u.message,
                            u.cancellationCode
                          )
                        ),
                          (function JB(e) {
                            return S0(e) && ai(e.url);
                          })(u)
                            ? this.events.next(new Jp(u.url))
                            : o.resolve(!1);
                      else {
                        this.events.next(
                          new Zu(
                            o.id,
                            this.urlSerializer.serialize(o.extractedUrl),
                            u,
                            o.targetSnapshot ?? void 0
                          )
                        );
                        try {
                          o.resolve(n.errorHandler(u));
                        } catch (c) {
                          o.reject(c);
                        }
                      }
                      return pn;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(n, i, s) {
            const o = new ea(
              n.id,
              this.urlSerializer.serialize(n.extractedUrl),
              i,
              s
            );
            this.events.next(o), n.resolve(!1);
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function V0(e) {
        return e !== Jo;
      }
      let j0 = (() => {
          var e;
          class t {
            buildTitle(n) {
              let i,
                s = n.root;
              for (; void 0 !== s; )
                (i = this.getResolvedTitleForRoute(s) ?? i),
                  (s = s.children.find((o) => o.outlet === Z));
              return i;
            }
            getResolvedTitleForRoute(n) {
              return n.data[Wo];
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return P(ZH);
              },
              providedIn: "root",
            })),
            t
          );
        })(),
        ZH = (() => {
          var e;
          class t extends j0 {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const i = this.buildTitle(n);
              void 0 !== i && this.title.setTitle(i);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(M(xE));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        YH = (() => {
          var e;
          class t {}
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return P(JH);
              },
              providedIn: "root",
            })),
            t
          );
        })();
      class XH {
        shouldDetach(t) {
          return !1;
        }
        store(t, r) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, r) {
          return t.routeConfig === r.routeConfig;
        }
      }
      let JH = (() => {
        var e;
        class t extends XH {}
        return (
          ((e = t).ɵfac = (function () {
            let r;
            return function (i) {
              return (r || (r = Ke(e)))(i || e);
            };
          })()),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const ic = new O("", { providedIn: "root", factory: () => ({}) });
      let eU = (() => {
          var e;
          class t {}
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return P(tU);
              },
              providedIn: "root",
            })),
            t
          );
        })(),
        tU = (() => {
          var e;
          class t {
            shouldProcessUrl(n) {
              return !0;
            }
            extract(n) {
              return n;
            }
            merge(n, i) {
              return n;
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            t
          );
        })();
      var aa = (function (e) {
        return (
          (e[(e.COMPLETE = 0)] = "COMPLETE"),
          (e[(e.FAILED = 1)] = "FAILED"),
          (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
          e
        );
      })(aa || {});
      function $0(e, t) {
        e.events
          .pipe(
            Mt(
              (r) =>
                r instanceof Rr ||
                r instanceof ea ||
                r instanceof Zu ||
                r instanceof _s
            ),
            te((r) =>
              r instanceof Rr || r instanceof _s
                ? aa.COMPLETE
                : r instanceof ea && (0 === r.code || 1 === r.code)
                ? aa.REDIRECTING
                : aa.FAILED
            ),
            Mt((r) => r !== aa.REDIRECTING),
            Fn(1)
          )
          .subscribe(() => {
            t();
          });
      }
      function nU(e) {
        throw e;
      }
      function rU(e, t, r) {
        return t.parse("/");
      }
      const iU = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        sU = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let Ze = (() => {
        var e;
        class t {
          get navigationId() {
            return this.navigationTransitions.navigationId;
          }
          get browserPageId() {
            return "computed" !== this.canceledNavigationResolution
              ? this.currentPageId
              : this.location.getState()?.ɵrouterPageId ?? this.currentPageId;
          }
          get events() {
            return this._events;
          }
          constructor() {
            (this.disposed = !1),
              (this.currentPageId = 0),
              (this.console = P(uw)),
              (this.isNgZoneEnabled = !1),
              (this._events = new be()),
              (this.options = P(ic, { optional: !0 }) || {}),
              (this.pendingTasks = P($l)),
              (this.errorHandler = this.options.errorHandler || nU),
              (this.malformedUriErrorHandler =
                this.options.malformedUriErrorHandler || rU),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.urlHandlingStrategy = P(eU)),
              (this.routeReuseStrategy = P(YH)),
              (this.titleStrategy = P(j0)),
              (this.onSameUrlNavigation =
                this.options.onSameUrlNavigation || "ignore"),
              (this.paramsInheritanceStrategy =
                this.options.paramsInheritanceStrategy || "emptyOnly"),
              (this.urlUpdateStrategy =
                this.options.urlUpdateStrategy || "deferred"),
              (this.canceledNavigationResolution =
                this.options.canceledNavigationResolution || "replace"),
              (this.config = P(bs, { optional: !0 })?.flat() ?? []),
              (this.navigationTransitions = P(rc)),
              (this.urlSerializer = P(Ko)),
              (this.location = P(Eh)),
              (this.componentInputBindingEnabled = !!P(Xu, { optional: !0 })),
              (this.eventsSubscription = new vt()),
              (this.isNgZoneEnabled =
                P(ue) instanceof ue && ue.isInAngularZone()),
              this.resetConfig(this.config),
              (this.currentUrlTree = new ys()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = y0(0, null)),
              this.navigationTransitions
                .setupNavigations(this, this.currentUrlTree, this.routerState)
                .subscribe(
                  (n) => {
                    (this.lastSuccessfulId = n.id),
                      (this.currentPageId = this.browserPageId);
                  },
                  (n) => {
                    this.console.warn(`Unhandled Navigation Error: ${n}`);
                  }
                ),
              this.subscribeToNavigationEvents();
          }
          subscribeToNavigationEvents() {
            const n = this.navigationTransitions.events.subscribe((i) => {
              try {
                const { currentTransition: s } = this.navigationTransitions;
                if (null === s) return void (B0(i) && this._events.next(i));
                if (i instanceof Ku)
                  V0(s.source) && (this.browserUrlTree = s.extractedUrl);
                else if (i instanceof _s) this.rawUrlTree = s.rawUrl;
                else if (i instanceof p0) {
                  if ("eager" === this.urlUpdateStrategy) {
                    if (!s.extras.skipLocationChange) {
                      const o = this.urlHandlingStrategy.merge(
                        s.urlAfterRedirects,
                        s.rawUrl
                      );
                      this.setBrowserUrl(o, s);
                    }
                    this.browserUrlTree = s.urlAfterRedirects;
                  }
                } else if (i instanceof Xp)
                  (this.currentUrlTree = s.urlAfterRedirects),
                    (this.rawUrlTree = this.urlHandlingStrategy.merge(
                      s.urlAfterRedirects,
                      s.rawUrl
                    )),
                    (this.routerState = s.targetRouterState),
                    "deferred" === this.urlUpdateStrategy &&
                      (s.extras.skipLocationChange ||
                        this.setBrowserUrl(this.rawUrlTree, s),
                      (this.browserUrlTree = s.urlAfterRedirects));
                else if (i instanceof ea)
                  0 !== i.code && 1 !== i.code && (this.navigated = !0),
                    (3 === i.code || 2 === i.code) && this.restoreHistory(s);
                else if (i instanceof Jp) {
                  const o = this.urlHandlingStrategy.merge(
                      i.url,
                      s.currentRawUrl
                    ),
                    a = {
                      skipLocationChange: s.extras.skipLocationChange,
                      replaceUrl:
                        "eager" === this.urlUpdateStrategy || V0(s.source),
                    };
                  this.scheduleNavigation(o, Jo, null, a, {
                    resolve: s.resolve,
                    reject: s.reject,
                    promise: s.promise,
                  });
                }
                i instanceof Zu && this.restoreHistory(s, !0),
                  i instanceof Rr && (this.navigated = !0),
                  B0(i) && this._events.next(i);
              } catch (s) {
                this.navigationTransitions.transitionAbortSubject.next(s);
              }
            });
            this.eventsSubscription.add(n);
          }
          resetRootComponentType(n) {
            (this.routerState.root.component = n),
              (this.navigationTransitions.rootComponentType = n);
          }
          initialNavigation() {
            if (
              (this.setUpLocationChangeListener(),
              !this.navigationTransitions.hasRequestedNavigation)
            ) {
              const n = this.location.getState();
              this.navigateToSyncWithBrowser(this.location.path(!0), Jo, n);
            }
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const i = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === i &&
                  setTimeout(() => {
                    this.navigateToSyncWithBrowser(n.url, i, n.state);
                  }, 0);
              }));
          }
          navigateToSyncWithBrowser(n, i, s) {
            const o = { replaceUrl: !0 },
              a = s?.navigationId ? s : null;
            if (s) {
              const u = { ...s };
              delete u.navigationId,
                delete u.ɵrouterPageId,
                0 !== Object.keys(u).length && (o.state = u);
            }
            const l = this.parseUrl(n);
            this.scheduleNavigation(l, i, a, o);
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.navigationTransitions.currentNavigation;
          }
          get lastSuccessfulNavigation() {
            return this.navigationTransitions.lastSuccessfulNavigation;
          }
          resetConfig(n) {
            (this.config = n.map(ag)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.navigationTransitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0),
              this.eventsSubscription.unsubscribe();
          }
          createUrlTree(n, i = {}) {
            const {
                relativeTo: s,
                queryParams: o,
                fragment: a,
                queryParamsHandling: l,
                preserveFragment: u,
              } = i,
              c = u ? this.currentUrlTree.fragment : a;
            let f,
              d = null;
            switch (l) {
              case "merge":
                d = { ...this.currentUrlTree.queryParams, ...o };
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = o || null;
            }
            null !== d && (d = this.removeEmptyProps(d));
            try {
              f = a0(s ? s.snapshot : this.routerState.snapshot.root);
            } catch {
              ("string" != typeof n[0] || !n[0].startsWith("/")) && (n = []),
                (f = this.currentUrlTree.root);
            }
            return l0(f, n, d, c ?? null);
          }
          navigateByUrl(n, i = { skipLocationChange: !1 }) {
            const s = ai(n) ? n : this.parseUrl(n),
              o = this.urlHandlingStrategy.merge(s, this.rawUrlTree);
            return this.scheduleNavigation(o, Jo, null, i);
          }
          navigate(n, i = { skipLocationChange: !1 }) {
            return (
              (function oU(e) {
                for (let t = 0; t < e.length; t++)
                  if (null == e[t]) throw new C(4008, !1);
              })(n),
              this.navigateByUrl(this.createUrlTree(n, i), i)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let i;
            try {
              i = this.urlSerializer.parse(n);
            } catch (s) {
              i = this.malformedUriErrorHandler(s, this.urlSerializer, n);
            }
            return i;
          }
          isActive(n, i) {
            let s;
            if (((s = !0 === i ? { ...iU } : !1 === i ? { ...sU } : i), ai(n)))
              return YS(this.currentUrlTree, n, s);
            const o = this.parseUrl(n);
            return YS(this.currentUrlTree, o, s);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((i, s) => {
              const o = n[s];
              return null != o && (i[s] = o), i;
            }, {});
          }
          scheduleNavigation(n, i, s, o, a) {
            if (this.disposed) return Promise.resolve(!1);
            let l, u, c;
            a
              ? ((l = a.resolve), (u = a.reject), (c = a.promise))
              : (c = new Promise((f, h) => {
                  (l = f), (u = h);
                }));
            const d = this.pendingTasks.add();
            return (
              $0(this, () => {
                queueMicrotask(() => this.pendingTasks.remove(d));
              }),
              this.navigationTransitions.handleNavigationRequest({
                source: i,
                restoredState: s,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                currentBrowserUrl: this.browserUrlTree,
                rawUrl: n,
                extras: o,
                resolve: l,
                reject: u,
                promise: c,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              c.catch((f) => Promise.reject(f))
            );
          }
          setBrowserUrl(n, i) {
            const s = this.urlSerializer.serialize(n);
            if (this.location.isCurrentPathEqualTo(s) || i.extras.replaceUrl) {
              const a = {
                ...i.extras.state,
                ...this.generateNgRouterState(i.id, this.browserPageId),
              };
              this.location.replaceState(s, "", a);
            } else {
              const o = {
                ...i.extras.state,
                ...this.generateNgRouterState(i.id, this.browserPageId + 1),
              };
              this.location.go(s, "", o);
            }
          }
          restoreHistory(n, i = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const o = this.currentPageId - this.browserPageId;
              0 !== o
                ? this.location.historyGo(o)
                : this.currentUrlTree ===
                    this.getCurrentNavigation()?.finalUrl &&
                  0 === o &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree());
            } else
              "replace" === this.canceledNavigationResolution &&
                (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          generateNgRouterState(n, i) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: i }
              : { navigationId: n };
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function B0(e) {
        return !(e instanceof Xp || e instanceof Jp);
      }
      let Pr = (() => {
          var e;
          class t {
            constructor(n, i, s, o, a, l) {
              (this.router = n),
                (this.route = i),
                (this.tabIndexAttribute = s),
                (this.renderer = o),
                (this.el = a),
                (this.locationStrategy = l),
                (this.href = null),
                (this.commands = null),
                (this.onChanges = new be()),
                (this.preserveFragment = !1),
                (this.skipLocationChange = !1),
                (this.replaceUrl = !1);
              const u = a.nativeElement.tagName?.toLowerCase();
              (this.isAnchorElement = "a" === u || "area" === u),
                this.isAnchorElement
                  ? (this.subscription = n.events.subscribe((c) => {
                      c instanceof Rr && this.updateHref();
                    }))
                  : this.setTabIndexIfNotOnNativeEl("0");
            }
            setTabIndexIfNotOnNativeEl(n) {
              null != this.tabIndexAttribute ||
                this.isAnchorElement ||
                this.applyAttributeValue("tabindex", n);
            }
            ngOnChanges(n) {
              this.isAnchorElement && this.updateHref(),
                this.onChanges.next(this);
            }
            set routerLink(n) {
              null != n
                ? ((this.commands = Array.isArray(n) ? n : [n]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick(n, i, s, o, a) {
              return (
                !!(
                  null === this.urlTree ||
                  (this.isAnchorElement &&
                    (0 !== n ||
                      i ||
                      s ||
                      o ||
                      a ||
                      ("string" == typeof this.target &&
                        "_self" != this.target)))
                ) ||
                (this.router.navigateByUrl(this.urlTree, {
                  skipLocationChange: this.skipLocationChange,
                  replaceUrl: this.replaceUrl,
                  state: this.state,
                }),
                !this.isAnchorElement)
              );
            }
            ngOnDestroy() {
              this.subscription?.unsubscribe();
            }
            updateHref() {
              this.href =
                null !== this.urlTree && this.locationStrategy
                  ? this.locationStrategy?.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
              const n =
                null === this.href
                  ? null
                  : (function my(e, t, r) {
                      return (function b1(e, t) {
                        return ("src" === t &&
                          ("embed" === e ||
                            "frame" === e ||
                            "iframe" === e ||
                            "media" === e ||
                            "script" === e)) ||
                          ("href" === t && ("base" === e || "link" === e))
                          ? gy
                          : Wn;
                      })(
                        t,
                        r
                      )(e);
                    })(
                      this.href,
                      this.el.nativeElement.tagName.toLowerCase(),
                      "href"
                    );
              this.applyAttributeValue("href", n);
            }
            applyAttributeValue(n, i) {
              const s = this.renderer,
                o = this.el.nativeElement;
              null !== i ? s.setAttribute(o, n, i) : s.removeAttribute(o, n);
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: this.preserveFragment,
                  });
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(
                _(Ze),
                _(rr),
                (function ja(e) {
                  return (function zT(e, t) {
                    if ("class" === t) return e.classes;
                    if ("style" === t) return e.styles;
                    const r = e.attrs;
                    if (r) {
                      const n = r.length;
                      let i = 0;
                      for (; i < n; ) {
                        const s = r[i];
                        if (um(s)) break;
                        if (0 === s) i += 2;
                        else if ("number" == typeof s)
                          for (i++; i < n && "string" == typeof r[i]; ) i++;
                        else {
                          if (s === t) return r[i + 1];
                          i += 2;
                        }
                      }
                    }
                    return null;
                  })(Qe(), e);
                })("tabindex"),
                _(En),
                _(dt),
                _(Xr)
              );
            }),
            (e.ɵdir = B({
              type: e,
              selectors: [["", "routerLink", ""]],
              hostVars: 1,
              hostBindings: function (n, i) {
                1 & n &&
                  ce("click", function (o) {
                    return i.onClick(
                      o.button,
                      o.ctrlKey,
                      o.shiftKey,
                      o.altKey,
                      o.metaKey
                    );
                  }),
                  2 & n && In("target", i.target);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                relativeTo: "relativeTo",
                preserveFragment: ["preserveFragment", "preserveFragment", os],
                skipLocationChange: [
                  "skipLocationChange",
                  "skipLocationChange",
                  os,
                ],
                replaceUrl: ["replaceUrl", "replaceUrl", os],
                routerLink: "routerLink",
              },
              standalone: !0,
              features: [N_, Pt],
            })),
            t
          );
        })(),
        H0 = (() => {
          var e;
          class t {
            get isActive() {
              return this._isActive;
            }
            constructor(n, i, s, o, a) {
              (this.router = n),
                (this.element = i),
                (this.renderer = s),
                (this.cdr = o),
                (this.link = a),
                (this.classes = []),
                (this._isActive = !1),
                (this.routerLinkActiveOptions = { exact: !1 }),
                (this.isActiveChange = new ve()),
                (this.routerEventsSubscription = n.events.subscribe((l) => {
                  l instanceof Rr && this.update();
                }));
            }
            ngAfterContentInit() {
              V(this.links.changes, V(null))
                .pipe(hi())
                .subscribe((n) => {
                  this.update(), this.subscribeToEachLinkOnChanges();
                });
            }
            subscribeToEachLinkOnChanges() {
              this.linkInputChangesSubscription?.unsubscribe();
              const n = [...this.links.toArray(), this.link]
                .filter((i) => !!i)
                .map((i) => i.onChanges);
              this.linkInputChangesSubscription = Le(n)
                .pipe(hi())
                .subscribe((i) => {
                  this._isActive !== this.isLinkActive(this.router)(i) &&
                    this.update();
                });
            }
            set routerLinkActive(n) {
              const i = Array.isArray(n) ? n : n.split(" ");
              this.classes = i.filter((s) => !!s);
            }
            ngOnChanges(n) {
              this.update();
            }
            ngOnDestroy() {
              this.routerEventsSubscription.unsubscribe(),
                this.linkInputChangesSubscription?.unsubscribe();
            }
            update() {
              !this.links ||
                !this.router.navigated ||
                queueMicrotask(() => {
                  const n = this.hasActiveLinks();
                  this._isActive !== n &&
                    ((this._isActive = n),
                    this.cdr.markForCheck(),
                    this.classes.forEach((i) => {
                      n
                        ? this.renderer.addClass(this.element.nativeElement, i)
                        : this.renderer.removeClass(
                            this.element.nativeElement,
                            i
                          );
                    }),
                    n && void 0 !== this.ariaCurrentWhenActive
                      ? this.renderer.setAttribute(
                          this.element.nativeElement,
                          "aria-current",
                          this.ariaCurrentWhenActive.toString()
                        )
                      : this.renderer.removeAttribute(
                          this.element.nativeElement,
                          "aria-current"
                        ),
                    this.isActiveChange.emit(n));
                });
            }
            isLinkActive(n) {
              const i = (function aU(e) {
                return !!e.paths;
              })(this.routerLinkActiveOptions)
                ? this.routerLinkActiveOptions
                : this.routerLinkActiveOptions.exact || !1;
              return (s) => !!s.urlTree && n.isActive(s.urlTree, i);
            }
            hasActiveLinks() {
              const n = this.isLinkActive(this.router);
              return (this.link && n(this.link)) || this.links.some(n);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(_(Ze), _(dt), _(En), _(Io), _(Pr, 8));
            }),
            (e.ɵdir = B({
              type: e,
              selectors: [["", "routerLinkActive", ""]],
              contentQueries: function (n, i, s) {
                if ((1 & n && Yf(s, Pr, 5), 2 & n)) {
                  let o;
                  Zf((o = Xf())) && (i.links = o);
                }
              },
              inputs: {
                routerLinkActiveOptions: "routerLinkActiveOptions",
                ariaCurrentWhenActive: "ariaCurrentWhenActive",
                routerLinkActive: "routerLinkActive",
              },
              outputs: { isActiveChange: "isActiveChange" },
              exportAs: ["routerLinkActive"],
              standalone: !0,
              features: [Pt],
            })),
            t
          );
        })();
      class U0 {}
      let lU = (() => {
        var e;
        class t {
          constructor(n, i, s, o, a) {
            (this.router = n),
              (this.injector = s),
              (this.preloadingStrategy = o),
              (this.loader = a);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                Mt((n) => n instanceof Rr),
                ls(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, i) {
            const s = [];
            for (const o of i) {
              o.providers &&
                !o._injector &&
                (o._injector = $f(o.providers, n, `Route: ${o.path}`));
              const a = o._injector ?? n,
                l = o._loadedInjector ?? a;
              ((o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) ||
                (o.loadComponent && !o._loadedComponent)) &&
                s.push(this.preloadConfig(a, o)),
                (o.children || o._loadedRoutes) &&
                  s.push(this.processRoutes(l, o.children ?? o._loadedRoutes));
            }
            return Le(s).pipe(hi());
          }
          preloadConfig(n, i) {
            return this.preloadingStrategy.preload(i, () => {
              let s;
              s =
                i.loadChildren && void 0 === i.canLoad
                  ? this.loader.loadChildren(n, i)
                  : V(null);
              const o = s.pipe(
                je((a) =>
                  null === a
                    ? V(void 0)
                    : ((i._loadedRoutes = a.routes),
                      (i._loadedInjector = a.injector),
                      this.processRoutes(a.injector ?? n, a.routes))
                )
              );
              return i.loadComponent && !i._loadedComponent
                ? Le([o, this.loader.loadComponent(i)]).pipe(hi())
                : o;
            });
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(Ze), M(cw), M(Ft), M(U0), M(dg));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const fg = new O("");
      let z0 = (() => {
        var e;
        class t {
          constructor(n, i, s, o, a = {}) {
            (this.urlSerializer = n),
              (this.transitions = i),
              (this.viewportScroller = s),
              (this.zone = o),
              (this.options = a),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (a.scrollPositionRestoration =
                a.scrollPositionRestoration || "disabled"),
              (a.anchorScrolling = a.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof Ku
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof Rr
                ? ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.urlAfterRedirects).fragment
                  ))
                : n instanceof _s &&
                  0 === n.code &&
                  ((this.lastSource = void 0),
                  (this.restoredId = 0),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.url).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof g0 &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, i) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new g0(
                      n,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      i
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            !(function r_() {
              throw new Error("invalid");
            })();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      function ir(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function G0() {
        const e = P(kt);
        return (t) => {
          const r = e.get(Zr);
          if (t !== r.components[0]) return;
          const n = e.get(Ze),
            i = e.get(W0);
          1 === e.get(hg) && n.initialNavigation(),
            e.get(Q0, null, X.Optional)?.setUpPreloading(),
            e.get(fg, null, X.Optional)?.init(),
            n.resetRootComponentType(r.componentTypes[0]),
            i.closed || (i.next(), i.complete(), i.unsubscribe());
        };
      }
      const W0 = new O("", { factory: () => new be() }),
        hg = new O("", { providedIn: "root", factory: () => 1 }),
        Q0 = new O("");
      function fU(e) {
        return ir(0, [
          { provide: Q0, useExisting: lU },
          { provide: U0, useExisting: e },
        ]);
      }
      const K0 = new O("ROUTER_FORROOT_GUARD"),
        pU = [
          Eh,
          { provide: Ko, useClass: Wp },
          Ze,
          ta,
          {
            provide: rr,
            useFactory: function q0(e) {
              return e.routerState.root;
            },
            deps: [Ze],
          },
          dg,
          [],
        ];
      function gU() {
        return new vw("Router", Ze);
      }
      let Z0 = (() => {
        var e;
        class t {
          constructor(n) {}
          static forRoot(n, i) {
            return {
              ngModule: t,
              providers: [
                pU,
                [],
                { provide: bs, multi: !0, useValue: n },
                {
                  provide: K0,
                  useFactory: _U,
                  deps: [[Ze, new Ha(), new Ua()]],
                },
                { provide: ic, useValue: i || {} },
                i?.useHash
                  ? { provide: Xr, useClass: lk }
                  : { provide: Xr, useClass: Ww },
                {
                  provide: fg,
                  useFactory: () => {
                    const e = P(SL),
                      t = P(ue),
                      r = P(ic),
                      n = P(rc),
                      i = P(Ko);
                    return (
                      r.scrollOffset && e.setOffset(r.scrollOffset),
                      new z0(i, n, e, t, r)
                    );
                  },
                },
                i?.preloadingStrategy
                  ? fU(i.preloadingStrategy).ɵproviders
                  : [],
                { provide: vw, multi: !0, useFactory: gU },
                i?.initialNavigation ? DU(i) : [],
                i?.bindToComponentInputs
                  ? ir(8, [w0, { provide: Xu, useExisting: w0 }]).ɵproviders
                  : [],
                [
                  { provide: Y0, useFactory: G0 },
                  { provide: hh, multi: !0, useExisting: Y0 },
                ],
              ],
            };
          }
          static forChild(n) {
            return {
              ngModule: t,
              providers: [{ provide: bs, multi: !0, useValue: n }],
            };
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(K0, 8));
          }),
          (e.ɵmod = Nt({ type: e })),
          (e.ɵinj = yt({})),
          t
        );
      })();
      function _U(e) {
        return "guarded";
      }
      function DU(e) {
        return [
          "disabled" === e.initialNavigation
            ? ir(3, [
                {
                  provide: sh,
                  multi: !0,
                  useFactory: () => {
                    const t = P(Ze);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: hg, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? ir(2, [
                { provide: hg, useValue: 0 },
                {
                  provide: sh,
                  multi: !0,
                  deps: [kt],
                  useFactory: (t) => {
                    const r = t.get(ok, Promise.resolve());
                    return () =>
                      r.then(
                        () =>
                          new Promise((n) => {
                            const i = t.get(Ze),
                              s = t.get(W0);
                            $0(i, () => {
                              n(!0);
                            }),
                              (t.get(rc).afterPreactivation = () => (
                                n(!0), s.closed ? V(void 0) : s
                              )),
                              i.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const Y0 = new O("");
      let li = (() => {
          var e;
          class t {
            constructor(n) {
              this._Httpclient = n;
            }
            getProducts() {
              return this._Httpclient.get(
                "https://ecommerce.routemisr.com/api/v1/products"
              );
            }
            getProduct(n) {
              return this._Httpclient.get(
                "https://ecommerce.routemisr.com/api/v1/products/" + n
              );
            }
            getCategories() {
              return this._Httpclient.get(
                "https://ecommerce.routemisr.com/api/v1/categories"
              );
            }
            getCategory(n) {
              return this._Httpclient.get(
                `https://ecommerce.routemisr.com/api/v1/categories/${n}`
              );
            }
            getBrands() {
              return this._Httpclient.get(
                "https://ecommerce.routemisr.com/api/v1/brands"
              );
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(M(cu));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        ui = (() => {
          var e;
          class t {
            constructor(n) {
              (this._HttpClient = n),
                (this.headers = { token: localStorage.getItem("userToken") }),
                (this.baseURL = "https://ecommerce.routemisr.com/api/v1/cart"),
                (this.cartId = new st(null)),
                (this.numOfItems = new st(0)),
                this.getLoggedUserCart().subscribe({
                  next: (i) => {
                    this.cartId.next(i.data._id),
                      this.numOfItems.next(i.numOfCartItems);
                  },
                  error: (i) => console.log(i),
                });
            }
            addToCart(n) {
              return this._HttpClient.post(
                this.baseURL,
                { productId: n },
                { headers: this.headers }
              );
            }
            getLoggedUserCart() {
              return this._HttpClient.get(this.baseURL, {
                headers: this.headers,
              });
            }
            removeProduct(n) {
              return this._HttpClient.delete(this.baseURL + "/" + n, {
                headers: this.headers,
              });
            }
            updateProduct(n, i) {
              return this._HttpClient.put(
                this.baseURL + "/" + n,
                { count: i },
                { headers: this.headers }
              );
            }
            onlinePayment(n, i) {
              return this._HttpClient.post(
                `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${i}?url=http://localhost:4200`,
                { shippingAddress: n },
                { headers: this.headers }
              );
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(M(cu));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            t
          );
        })();
      function la(e) {
        return (la =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t &&
                  "function" == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? "symbol"
                  : typeof t;
              })(e);
      }
      function p(e, t, r) {
        return (
          (t = (function EU(e) {
            var t = (function wU(e, t) {
              if ("object" !== la(e) || null === e) return e;
              var r = e[Symbol.toPrimitive];
              if (void 0 !== r) {
                var n = r.call(e, t || "default");
                if ("object" !== la(n)) return n;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value."
                );
              }
              return ("string" === t ? String : Number)(e);
            })(e, "string");
            return "symbol" === la(t) ? t : String(t);
          })(t)) in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      const bU = ["addListener", "removeListener"],
        SU = ["addEventListener", "removeEventListener"],
        MU = ["on", "off"];
      function pg(e, t, r, n) {
        if ((ee(r) && ((n = r), (r = void 0)), n))
          return pg(e, t, r).pipe(tp(n));
        const [i, s] = (function AU(e) {
          return ee(e.addEventListener) && ee(e.removeEventListener);
        })(e)
          ? SU.map((o) => (a) => e[o](t, a, r))
          : (function IU(e) {
              return ee(e.addListener) && ee(e.removeListener);
            })(e)
          ? bU.map(X0(e, t))
          : (function TU(e) {
              return ee(e.on) && ee(e.off);
            })(e)
          ? MU.map(X0(e, t))
          : [];
        if (!i && Cc(e)) return je((o) => pg(o, t, r))(it(e));
        if (!i) throw new TypeError("Invalid event target");
        return new Ie((o) => {
          const a = (...l) => o.next(1 < l.length ? l : l[0]);
          return i(a), () => s(a);
        });
      }
      function X0(e, t) {
        return (r) => (n) => e[r](t, n);
      }
      function J0(e) {
        return Mt((t, r) => e <= r);
      }
      const RU = (e, t) => (e.push(t), e);
      class OU extends vt {
        constructor(t, r) {
          super();
        }
        schedule(t, r = 0) {
          return this;
        }
      }
      const sc = {
          setInterval(e, t, ...r) {
            const { delegate: n } = sc;
            return n?.setInterval
              ? n.setInterval(e, t, ...r)
              : setInterval(e, t, ...r);
          },
          clearInterval(e) {
            const { delegate: t } = sc;
            return (t?.clearInterval || clearInterval)(e);
          },
          delegate: void 0,
        },
        eM = { now: () => (eM.delegate || Date).now(), delegate: void 0 };
      class ua {
        constructor(t, r = ua.now) {
          (this.schedulerActionCtor = t), (this.now = r);
        }
        schedule(t, r = 0, n) {
          return new this.schedulerActionCtor(this, t).schedule(n, r);
        }
      }
      ua.now = eM.now;
      const tM = new (class FU extends ua {
          constructor(t, r = ua.now) {
            super(t, r), (this.actions = []), (this._active = !1);
          }
          flush(t) {
            const { actions: r } = this;
            if (this._active) return void r.push(t);
            let n;
            this._active = !0;
            do {
              if ((n = t.execute(t.state, t.delay))) break;
            } while ((t = r.shift()));
            if (((this._active = !1), n)) {
              for (; (t = r.shift()); ) t.unsubscribe();
              throw n;
            }
          }
        })(
          class xU extends OU {
            constructor(t, r) {
              super(t, r),
                (this.scheduler = t),
                (this.work = r),
                (this.pending = !1);
            }
            schedule(t, r = 0) {
              var n;
              if (this.closed) return this;
              this.state = t;
              const i = this.id,
                s = this.scheduler;
              return (
                null != i && (this.id = this.recycleAsyncId(s, i, r)),
                (this.pending = !0),
                (this.delay = r),
                (this.id =
                  null !== (n = this.id) && void 0 !== n
                    ? n
                    : this.requestAsyncId(s, this.id, r)),
                this
              );
            }
            requestAsyncId(t, r, n = 0) {
              return sc.setInterval(t.flush.bind(t, this), n);
            }
            recycleAsyncId(t, r, n = 0) {
              if (null != n && this.delay === n && !1 === this.pending)
                return r;
              null != r && sc.clearInterval(r);
            }
            execute(t, r) {
              if (this.closed) return new Error("executing a cancelled action");
              this.pending = !1;
              const n = this._execute(t, r);
              if (n) return n;
              !1 === this.pending &&
                null != this.id &&
                (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
            }
            _execute(t, r) {
              let i,
                n = !1;
              try {
                this.work(t);
              } catch (s) {
                (n = !0),
                  (i = s || new Error("Scheduled action threw falsy error"));
              }
              if (n) return this.unsubscribe(), i;
            }
            unsubscribe() {
              if (!this.closed) {
                const { id: t, scheduler: r } = this,
                  { actions: n } = r;
                (this.work = this.state = this.scheduler = null),
                  (this.pending = !1),
                  fi(n, this),
                  null != t && (this.id = this.recycleAsyncId(r, t, null)),
                  (this.delay = null),
                  super.unsubscribe();
              }
            }
          }
        ),
        kU = tM;
      function nM(e, t) {
        return t
          ? (r) =>
              Bu(
                t.pipe(
                  Fn(1),
                  (function LU() {
                    return Ne((e, t) => {
                      e.subscribe(Oe(t, ha));
                    });
                  })()
                ),
                r.pipe(nM(e))
              )
          : je((r, n) => it(e(r, n)).pipe(Fn(1), WS(r)));
      }
      function BU(e, t) {}
      const HU = function (e, t) {
        return { $implicit: e, index: t };
      };
      function UU(e, t) {
        if ((1 & e && k(0, BU, 0, 0, "ng-template", 4), 2 & e)) {
          const r = he(),
            n = r.$implicit,
            i = r.index,
            s = he();
          T("ngTemplateOutlet", n.tplRef)(
            "ngTemplateOutletContext",
            kl(2, HU, s.preparePublicSlide(n), i)
          );
        }
      }
      const zU = function (e, t, r, n) {
        return { width: e, "margin-left": t, "margin-right": r, left: n };
      };
      function qU(e, t) {
        if (1 & e) {
          const r = mr();
          qr(0),
            w(1, "div", 2),
            ce("animationend", function () {
              const s = rn(r).$implicit;
              return sn(he().clear(s.id));
            }),
            k(2, UU, 1, 5, null, 3),
            E(),
            Gr();
        }
        if (2 & e) {
          const r = t.$implicit;
          S(1),
            T("ngClass", r.classes)(
              "ngStyle",
              SC(
                4,
                zU,
                r.width + "px",
                r.marginL ? r.marginL + "px" : "",
                r.marginR ? r.marginR + "px" : "",
                r.left
              )
            )("@autoHeight", r.heightState),
            S(1),
            T("ngIf", r.load);
        }
      }
      const GU = function (e, t, r, n, i) {
          return {
            width: e,
            transform: t,
            transition: r,
            "padding-left": n,
            "padding-right": i,
          };
        },
        WU = function (e, t) {
          return { isMouseDragable: e, isTouchDragable: t };
        };
      function QU(e, t) {
        if ((1 & e && (w(0, "div", 4), q(1, "owl-stage", 5), E()), 2 & e)) {
          const r = he();
          S(1),
            T(
              "owlDraggable",
              kl(
                3,
                WU,
                null == r.owlDOMData ? null : r.owlDOMData.isMouseDragable,
                null == r.owlDOMData ? null : r.owlDOMData.isTouchDragable
              )
            )("stageData", r.stageData)("slidesData", r.slidesData);
        }
      }
      const KU = function (e, t) {
        return { active: e, "owl-dot-text": t };
      };
      function ZU(e, t) {
        if (1 & e) {
          const r = mr();
          w(0, "div", 11),
            ce("click", function () {
              const s = rn(r).$implicit;
              return sn(he(2).moveByDot(s.id));
            }),
            q(1, "span", 12),
            E();
        }
        if (2 & e) {
          const r = t.$implicit;
          T("ngClass", kl(2, KU, r.active, r.showInnerContent)),
            S(1),
            T("innerHTML", r.innerContent, sl);
        }
      }
      const oc = function (e) {
        return { disabled: e };
      };
      function YU(e, t) {
        if (1 & e) {
          const r = mr();
          qr(0),
            w(1, "div", 6)(2, "div", 7),
            ce("click", function () {
              return rn(r), sn(he().prev());
            }),
            E(),
            w(3, "div", 8),
            ce("click", function () {
              return rn(r), sn(he().next());
            }),
            E()(),
            w(4, "div", 9),
            k(5, ZU, 2, 5, "div", 10),
            E(),
            Gr();
        }
        if (2 & e) {
          const r = he();
          S(1),
            T(
              "ngClass",
              yr(7, oc, null == r.navData ? null : r.navData.disabled)
            ),
            S(1),
            T(
              "ngClass",
              yr(
                9,
                oc,
                null == r.navData || null == r.navData.prev
                  ? null
                  : r.navData.prev.disabled
              )
            )(
              "innerHTML",
              null == r.navData || null == r.navData.prev
                ? null
                : r.navData.prev.htmlText,
              sl
            ),
            S(1),
            T(
              "ngClass",
              yr(
                11,
                oc,
                null == r.navData || null == r.navData.next
                  ? null
                  : r.navData.next.disabled
              )
            )(
              "innerHTML",
              null == r.navData || null == r.navData.next
                ? null
                : r.navData.next.htmlText,
              sl
            ),
            S(1),
            T(
              "ngClass",
              yr(13, oc, null == r.dotsData ? null : r.dotsData.disabled)
            ),
            S(1),
            T("ngForOf", null == r.dotsData ? null : r.dotsData.dots);
        }
      }
      const XU = function (e, t, r, n, i) {
        return {
          "owl-rtl": e,
          "owl-loaded": t,
          "owl-responsive": r,
          "owl-drag": n,
          "owl-grab": i,
        };
      };
      class JU {
        constructor() {
          p(this, "items", 3),
            p(this, "skip_validateItems", !1),
            p(this, "loop", !1),
            p(this, "center", !1),
            p(this, "rewind", !1),
            p(this, "mouseDrag", !0),
            p(this, "touchDrag", !0),
            p(this, "pullDrag", !0),
            p(this, "freeDrag", !1),
            p(this, "margin", 0),
            p(this, "stagePadding", 0),
            p(this, "merge", !1),
            p(this, "mergeFit", !0),
            p(this, "autoWidth", !1),
            p(this, "startPosition", 0),
            p(this, "rtl", !1),
            p(this, "smartSpeed", 250),
            p(this, "fluidSpeed", !1),
            p(this, "dragEndSpeed", !1),
            p(this, "responsive", {}),
            p(this, "responsiveRefreshRate", 200),
            p(this, "nav", !1),
            p(this, "navText", ["prev", "next"]),
            p(this, "navSpeed", !1),
            p(this, "slideBy", 1),
            p(this, "dots", !0),
            p(this, "dotsEach", !1),
            p(this, "dotsData", !1),
            p(this, "dotsSpeed", !1),
            p(this, "autoplay", !1),
            p(this, "autoplayTimeout", 5e3),
            p(this, "autoplayHoverPause", !1),
            p(this, "autoplaySpeed", !1),
            p(this, "autoplayMouseleaveTimeout", 1),
            p(this, "lazyLoad", !1),
            p(this, "lazyLoadEager", 0),
            p(this, "slideTransition", ""),
            p(this, "animateOut", !1),
            p(this, "animateIn", !1),
            p(this, "autoHeight", !1),
            p(this, "URLhashListener", !1);
        }
      }
      class e3 {
        constructor() {
          p(this, "items", "number"),
            p(this, "skip_validateItems", "boolean"),
            p(this, "loop", "boolean"),
            p(this, "center", "boolean"),
            p(this, "rewind", "boolean"),
            p(this, "mouseDrag", "boolean"),
            p(this, "touchDrag", "boolean"),
            p(this, "pullDrag", "boolean"),
            p(this, "freeDrag", "boolean"),
            p(this, "margin", "number"),
            p(this, "stagePadding", "number"),
            p(this, "merge", "boolean"),
            p(this, "mergeFit", "boolean"),
            p(this, "autoWidth", "boolean"),
            p(this, "startPosition", "number|string"),
            p(this, "rtl", "boolean"),
            p(this, "smartSpeed", "number"),
            p(this, "fluidSpeed", "boolean"),
            p(this, "dragEndSpeed", "number|boolean"),
            p(this, "responsive", {}),
            p(this, "responsiveRefreshRate", "number"),
            p(this, "nav", "boolean"),
            p(this, "navText", "string[]"),
            p(this, "navSpeed", "number|boolean"),
            p(this, "slideBy", "number|string"),
            p(this, "dots", "boolean"),
            p(this, "dotsEach", "number|boolean"),
            p(this, "dotsData", "boolean"),
            p(this, "dotsSpeed", "number|boolean"),
            p(this, "autoplay", "boolean"),
            p(this, "autoplayTimeout", "number"),
            p(this, "autoplayHoverPause", "boolean"),
            p(this, "autoplaySpeed", "number|boolean"),
            p(this, "autoplayMouseleaveTimeout", "number"),
            p(this, "lazyLoad", "boolean"),
            p(this, "lazyLoadEager", "number"),
            p(this, "slideTransition", "string"),
            p(this, "animateOut", "string|boolean"),
            p(this, "animateIn", "string|boolean"),
            p(this, "autoHeight", "boolean"),
            p(this, "URLhashListener", "boolean");
        }
      }
      let gg = (() => {
        var e;
        class t {
          constructor(n) {
            p(this, "errorHandler", void 0), (this.errorHandler = n);
          }
          log(n, ...i) {}
          error(n) {
            this.errorHandler.handleError(n);
          }
          warn(n, ...i) {
            console.warn(n, ...i);
          }
        }
        return (
          (e = t),
          p(t, "\u0275fac", function (n) {
            return new (n || e)(M(bn));
          }),
          p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
          t
        );
      })();
      var rM = (function (e) {
          return (e.Event = "event"), (e.State = "state"), e;
        })(rM || {}),
        ac = (function (e) {
          return (
            (e.Default = "default"), (e.Inner = "inner"), (e.Outer = "outer"), e
          );
        })(ac || {});
      let sr = (() => {
          var e;
          class t {
            get invalidated() {
              return this._invalidated;
            }
            get states() {
              return this._states;
            }
            constructor(n) {
              p(this, "logger", void 0),
                p(this, "_viewSettingsShipper$", new be()),
                p(this, "_initializedCarousel$", new be()),
                p(this, "_changeSettingsCarousel$", new be()),
                p(this, "_changedSettingsCarousel$", new be()),
                p(this, "_translateCarousel$", new be()),
                p(this, "_translatedCarousel$", new be()),
                p(this, "_resizeCarousel$", new be()),
                p(this, "_resizedCarousel$", new be()),
                p(this, "_refreshCarousel$", new be()),
                p(this, "_refreshedCarousel$", new be()),
                p(this, "_dragCarousel$", new be()),
                p(this, "_draggedCarousel$", new be()),
                p(this, "settings", { items: 0 }),
                p(this, "owlDOMData", {
                  rtl: !1,
                  isResponsive: !1,
                  isRefreshed: !1,
                  isLoaded: !1,
                  isLoading: !1,
                  isMouseDragable: !1,
                  isGrab: !1,
                  isTouchDragable: !1,
                }),
                p(this, "stageData", {
                  transform: "translate3d(0px,0px,0px)",
                  transition: "0s",
                  width: 0,
                  paddingL: 0,
                  paddingR: 0,
                }),
                p(this, "slidesData", void 0),
                p(this, "navData", void 0),
                p(this, "dotsData", void 0),
                p(this, "_width", void 0),
                p(this, "_items", []),
                p(this, "_widths", []),
                p(this, "_supress", {}),
                p(this, "_plugins", {}),
                p(this, "_current", null),
                p(this, "_clones", []),
                p(this, "_mergers", []),
                p(this, "_speed", null),
                p(this, "_coordinates", []),
                p(this, "_breakpoint", null),
                p(this, "clonedIdPrefix", "cloned-"),
                p(this, "_options", {}),
                p(this, "_invalidated", {}),
                p(this, "_states", {
                  current: {},
                  tags: {
                    initializing: ["busy"],
                    animating: ["busy"],
                    dragging: ["interacting"],
                  },
                }),
                p(this, "_pipe", [
                  {
                    filter: ["width", "items", "settings"],
                    run: (i) => {
                      i.current =
                        this._items &&
                        this._items[this.relative(this._current)]?.id;
                    },
                  },
                  {
                    filter: ["width", "items", "settings"],
                    run: (i) => {
                      const s = this.settings.margin || "",
                        a = this.settings.rtl,
                        l = {
                          "margin-left": a ? s : "",
                          "margin-right": a ? "" : s,
                        };
                      !this.settings.autoWidth ||
                        this.slidesData.forEach((u) => {
                          (u.marginL = l["margin-left"]),
                            (u.marginR = l["margin-right"]);
                        }),
                        (i.css = l);
                    },
                  },
                  {
                    filter: ["width", "items", "settings"],
                    run: (i) => {
                      const s =
                          +(this.width() / this.settings.items).toFixed(3) -
                          this.settings.margin,
                        o = !this.settings.autoWidth,
                        a = [];
                      let l = null,
                        u = this._items.length;
                      for (i.items = { merge: !1, width: s }; u-- > 0; )
                        (l = this._mergers[u]),
                          (l =
                            (this.settings.mergeFit &&
                              Math.min(l, this.settings.items)) ||
                            l),
                          (i.items.merge = l > 1 || i.items.merge),
                          (a[u] = o
                            ? s * l
                            : this._items[u].width
                            ? this._items[u].width
                            : s);
                      (this._widths = a),
                        this.slidesData.forEach((c, d) => {
                          (c.width = this._widths[d]),
                            (c.marginR = i.css["margin-right"]),
                            (c.marginL = i.css["margin-left"]);
                        });
                    },
                  },
                  {
                    filter: ["items", "settings"],
                    run: () => {
                      const i = [],
                        s = this._items,
                        o = this.settings,
                        a = Math.max(2 * o.items, 4),
                        l = 2 * Math.ceil(s.length / 2);
                      let u = [],
                        c = [],
                        d =
                          o.loop && s.length
                            ? o.rewind
                              ? a
                              : Math.max(a, l)
                            : 0;
                      for (d /= 2; d-- > 0; )
                        i.push(this.normalize(i.length / 2, !0)),
                          u.push({ ...this.slidesData[i[i.length - 1]] }),
                          i.push(
                            this.normalize(
                              s.length - 1 - (i.length - 1) / 2,
                              !0
                            )
                          ),
                          c.unshift({ ...this.slidesData[i[i.length - 1]] });
                      (this._clones = i),
                        (u = u.map(
                          (f) => (
                            (f.id = `${this.clonedIdPrefix}${f.id}`),
                            (f.isActive = !1),
                            (f.isCloned = !0),
                            f
                          )
                        )),
                        (c = c.map(
                          (f) => (
                            (f.id = `${this.clonedIdPrefix}${f.id}`),
                            (f.isActive = !1),
                            (f.isCloned = !0),
                            f
                          )
                        )),
                        (this.slidesData = c.concat(this.slidesData).concat(u));
                    },
                  },
                  {
                    filter: ["width", "items", "settings"],
                    run: () => {
                      const i = this.settings.rtl ? 1 : -1,
                        s = this._clones.length + this._items.length,
                        o = [];
                      let a = -1,
                        l = 0,
                        u = 0;
                      for (; ++a < s; )
                        (l = o[a - 1] || 0),
                          (u =
                            this._widths[this.relative(a)] +
                            this.settings.margin),
                          o.push(l + u * i);
                      this._coordinates = o;
                    },
                  },
                  {
                    filter: ["width", "items", "settings"],
                    run: () => {
                      const i = this.settings.stagePadding,
                        s = this._coordinates,
                        o = {
                          width: Math.ceil(Math.abs(s[s.length - 1])) + 2 * i,
                          "padding-left": i || "",
                          "padding-right": i || "",
                        };
                      (this.stageData.width = o.width),
                        (this.stageData.paddingL = o["padding-left"]),
                        (this.stageData.paddingR = o["padding-right"]);
                    },
                  },
                  {
                    filter: ["width", "items", "settings"],
                    run: (i) => {
                      let s = i.current
                        ? this.slidesData.findIndex((o) => o.id === i.current)
                        : 0;
                      (s = Math.max(
                        this.minimum(),
                        Math.min(this.maximum(), s)
                      )),
                        this.reset(s);
                    },
                  },
                  {
                    filter: ["position"],
                    run: () => {
                      this.animate(this.coordinates(this._current));
                    },
                  },
                  {
                    filter: ["width", "position", "items", "settings"],
                    run: () => {
                      const i = this.settings.rtl ? 1 : -1,
                        s = 2 * this.settings.stagePadding,
                        o = [];
                      let a, l, u, c, d, f;
                      if (
                        ((a = this.coordinates(this.current())),
                        "number" == typeof a ? (a += s) : (a = 0),
                        (l = a + this.width() * i),
                        -1 === i && this.settings.center)
                      ) {
                        const h = this._coordinates.filter((g) =>
                          this.settings.items % 2 == 1 ? g >= a : g > a
                        );
                        a = h.length ? h[h.length - 1] : a;
                      }
                      for (d = 0, f = this._coordinates.length; d < f; d++)
                        (u = Math.ceil(this._coordinates[d - 1] || 0)),
                          (c = Math.ceil(
                            Math.abs(this._coordinates[d]) + s * i
                          )),
                          ((this._op(u, "<=", a) && this._op(u, ">", l)) ||
                            (this._op(c, "<", a) && this._op(c, ">", l))) &&
                            o.push(d);
                      this.slidesData.forEach((h) => ((h.isActive = !1), h)),
                        o.forEach((h) => {
                          this.slidesData[h].isActive = !0;
                        }),
                        this.settings.center &&
                          (this.slidesData.forEach(
                            (h) => ((h.isCentered = !1), h)
                          ),
                          (this.slidesData[this.current()].isCentered = !0));
                    },
                  },
                ]),
                (this.logger = n);
            }
            getViewCurSettings() {
              return this._viewSettingsShipper$.asObservable();
            }
            getInitializedState() {
              return this._initializedCarousel$.asObservable();
            }
            getChangeState() {
              return this._changeSettingsCarousel$.asObservable();
            }
            getChangedState() {
              return this._changedSettingsCarousel$.asObservable();
            }
            getTranslateState() {
              return this._translateCarousel$.asObservable();
            }
            getTranslatedState() {
              return this._translatedCarousel$.asObservable();
            }
            getResizeState() {
              return this._resizeCarousel$.asObservable();
            }
            getResizedState() {
              return this._resizedCarousel$.asObservable();
            }
            getRefreshState() {
              return this._refreshCarousel$.asObservable();
            }
            getRefreshedState() {
              return this._refreshedCarousel$.asObservable();
            }
            getDragState() {
              return this._dragCarousel$.asObservable();
            }
            getDraggedState() {
              return this._draggedCarousel$.asObservable();
            }
            setOptions(n) {
              const i = new JU(),
                s = this._validateOptions(n, i);
              this._options = { ...i, ...s };
            }
            _validateOptions(n, i) {
              const s = { ...n },
                o = new e3(),
                a = (l, u) => (
                  this.logger.log(
                    `options.${u} must be type of ${l}; ${u}=${n[u]} skipped to defaults: ${u}=${i[u]}`
                  ),
                  i[u]
                );
              for (const l in s)
                if (s.hasOwnProperty(l))
                  if ("number" === o[l])
                    this._isNumeric(s[l])
                      ? ((s[l] = +s[l]),
                        (s[l] =
                          "items" === l
                            ? this._validateItems(s[l], s.skip_validateItems)
                            : s[l]))
                      : (s[l] = a(o[l], l));
                  else if ("boolean" === o[l] && "boolean" != typeof s[l])
                    s[l] = a(o[l], l);
                  else if (
                    "number|boolean" !== o[l] ||
                    this._isNumberOrBoolean(s[l])
                  )
                    if (
                      "number|string" !== o[l] ||
                      this._isNumberOrString(s[l])
                    )
                      if (
                        "string|boolean" !== o[l] ||
                        this._isStringOrBoolean(s[l])
                      ) {
                        if ("string[]" === o[l])
                          if (Array.isArray(s[l])) {
                            let u = !1;
                            s[l].forEach((c) => {
                              u = "string" == typeof c;
                            }),
                              u || (s[l] = a(o[l], l));
                          } else s[l] = a(o[l], l);
                      } else s[l] = a(o[l], l);
                    else s[l] = a(o[l], l);
                  else s[l] = a(o[l], l);
              return s;
            }
            _validateItems(n, i) {
              let s = n;
              return (
                n > this._items.length
                  ? i
                    ? this.logger.log(
                        "The option 'items' in your options is bigger than the number of slides. The navigation got disabled"
                      )
                    : ((s = this._items.length),
                      this.logger.log(
                        "The option 'items' in your options is bigger than the number of slides. This option is updated to the current number of slides and the navigation got disabled"
                      ))
                  : n === this._items.length &&
                    (this.settings.dots || this.settings.nav) &&
                    this.logger.log(
                      "Option 'items' in your options is equal to the number of slides. So the navigation got disabled"
                    ),
                s
              );
            }
            setCarouselWidth(n) {
              this._width = n;
            }
            setup(n, i, s) {
              this.setCarouselWidth(n),
                this.setItems(i),
                this._defineSlidesData(),
                this.setOptions(s),
                (this.settings = { ...this._options }),
                this.setOptionsForViewport(),
                this._trigger("change", {
                  property: { name: "settings", value: this.settings },
                }),
                this.invalidate("settings"),
                this._trigger("changed", {
                  property: { name: "settings", value: this.settings },
                });
            }
            setOptionsForViewport() {
              const n = this._width,
                i = this._options.responsive;
              let s = -1;
              if (!Object.keys(i).length) return;
              if (!n) return void (this.settings.items = 1);
              for (const a in i)
                i.hasOwnProperty(a) && +a <= n && +a > s && (s = Number(a));
              (this.settings = {
                ...this._options,
                ...i[s],
                items:
                  i[s] && i[s].items
                    ? this._validateItems(
                        i[s].items,
                        this._options.skip_validateItems
                      )
                    : this._options.items,
              }),
                delete this.settings.responsive,
                (this.owlDOMData.isResponsive = !0),
                (this.owlDOMData.isMouseDragable = this.settings.mouseDrag),
                (this.owlDOMData.isTouchDragable = this.settings.touchDrag);
              const o = [];
              this._items.forEach((a) => {
                o.push(this.settings.merge ? a.dataMerge : 1);
              }),
                (this._mergers = o),
                (this._breakpoint = s),
                this.invalidate("settings");
            }
            initialize(n) {
              this.enter("initializing"),
                (this.owlDOMData.rtl = this.settings.rtl),
                this._mergers.length && (this._mergers = []),
                n.forEach((i) => {
                  this._mergers.push(this.settings.merge ? i.dataMerge : 1);
                }),
                (this._clones = []),
                this.reset(
                  this._isNumeric(this.settings.startPosition)
                    ? +this.settings.startPosition
                    : 0
                ),
                this.invalidate("items"),
                this.refresh(),
                (this.owlDOMData.isLoaded = !0),
                (this.owlDOMData.isMouseDragable = this.settings.mouseDrag),
                (this.owlDOMData.isTouchDragable = this.settings.touchDrag),
                this.sendChanges(),
                this.leave("initializing"),
                this._trigger("initialized");
            }
            sendChanges() {
              this._viewSettingsShipper$.next({
                owlDOMData: this.owlDOMData,
                stageData: this.stageData,
                slidesData: this.slidesData,
                navData: this.navData,
                dotsData: this.dotsData,
              });
            }
            _optionsLogic() {
              this.settings.autoWidth &&
                ((this.settings.stagePadding = 0), (this.settings.merge = !1));
            }
            update() {
              let n = 0;
              const i = this._pipe.length,
                s = (a) => this._invalidated[a],
                o = {};
              for (; n < i; ) {
                const a = this._pipe[n].filter.filter(s);
                (this._invalidated.all || a.length > 0) && this._pipe[n].run(o),
                  n++;
              }
              this.slidesData.forEach(
                (a) => (a.classes = this.setCurSlideClasses(a))
              ),
                this.sendChanges(),
                (this._invalidated = {}),
                this.is("valid") || this.enter("valid");
            }
            width(n) {
              switch ((n = n || ac.Default)) {
                case ac.Inner:
                case ac.Outer:
                  return this._width;
                default:
                  return (
                    this._width -
                    2 * this.settings.stagePadding +
                    this.settings.margin
                  );
              }
            }
            refresh() {
              this.enter("refreshing"),
                this._trigger("refresh"),
                this._defineSlidesData(),
                this.setOptionsForViewport(),
                this._optionsLogic(),
                this.update(),
                this.leave("refreshing"),
                this._trigger("refreshed");
            }
            onResize(n) {
              if (!this._items.length) return !1;
              this.setCarouselWidth(n),
                this.enter("resizing"),
                this._trigger("resize"),
                this.invalidate("width"),
                this.refresh(),
                this.leave("resizing"),
                this._trigger("resized");
            }
            prepareDragging(n) {
              let s,
                i = null;
              return (
                (s = this.stageData.transform
                  .replace(/.*\(|\)| |[^,-\d]\w|\)/g, "")
                  .split(",")),
                (i = { x: +s[0], y: +s[1] }),
                this.is("animating") && this.invalidate("position"),
                "mousedown" === n.type && (this.owlDOMData.isGrab = !0),
                this.speed(0),
                i
              );
            }
            enterDragging() {
              this.enter("dragging"), this._trigger("drag");
            }
            defineNewCoordsDrag(n, i) {
              let s = null,
                o = null,
                a = null;
              const l = this.difference(i.pointer, this.pointer(n)),
                u = this.difference(i.stage.start, l);
              return (
                !!this.is("dragging") &&
                (this.settings.loop
                  ? ((s = this.coordinates(this.minimum())),
                    (o = +this.coordinates(this.maximum() + 1) - s),
                    (u.x = ((((u.x - s) % o) + o) % o) + s))
                  : ((s = this.coordinates(
                      this.settings.rtl ? this.maximum() : this.minimum()
                    )),
                    (o = this.coordinates(
                      this.settings.rtl ? this.minimum() : this.maximum()
                    )),
                    (a = this.settings.pullDrag ? (-1 * l.x) / 5 : 0),
                    (u.x = Math.max(Math.min(u.x, s + a), o + a))),
                u)
              );
            }
            finishDragging(n, i, s) {
              const a = this.difference(i.pointer, this.pointer(n)),
                l = i.stage.current,
                u = ["right", "left"][
                  +(this.settings.rtl
                    ? a.x < +this.settings.rtl
                    : a.x > +this.settings.rtl)
                ];
              let c, d, f;
              ((0 !== a.x && this.is("dragging")) || !this.is("valid")) &&
                (this.speed(
                  +this.settings.dragEndSpeed || this.settings.smartSpeed
                ),
                (c = this.closest(l.x, 0 !== a.x ? u : i.direction)),
                (d = this.current()),
                (f = this.current(-1 === c ? void 0 : c)),
                d !== f && (this.invalidate("position"), this.update()),
                (i.direction = u),
                (Math.abs(a.x) > 3 || new Date().getTime() - i.time > 300) &&
                  s()),
                this.is("dragging") &&
                  (this.leave("dragging"), this._trigger("dragged"));
            }
            closest(n, i) {
              const o = this.width();
              let a = this.coordinates(),
                l = -1;
              this.settings.center &&
                (a = a.map((u) => (0 === u && (u += 1e-6), u)));
              for (
                let u = 0;
                u < a.length &&
                ("left" === i && n > a[u] - 30 && n < a[u] + 30
                  ? (l = u)
                  : "right" === i && n > a[u] - o - 30 && n < a[u] - o + 30
                  ? (l = u + 1)
                  : this._op(n, "<", a[u]) &&
                    this._op(n, ">", a[u + 1] || a[u] - o)
                  ? (l = "left" === i ? u + 1 : u)
                  : null === i && n > a[u] - 30 && n < a[u] + 30 && (l = u),
                -1 === l);
                u++
              );
              return (
                this.settings.loop ||
                  (this._op(n, ">", a[this.minimum()])
                    ? (l = n = this.minimum())
                    : this._op(n, "<", a[this.maximum()]) &&
                      (l = n = this.maximum())),
                l
              );
            }
            animate(n) {
              const i = this.speed() > 0;
              this.is("animating") && this.onTransitionEnd(),
                i && (this.enter("animating"), this._trigger("translate")),
                (this.stageData.transform = "translate3d(" + n + "px,0px,0px)"),
                (this.stageData.transition =
                  this.speed() / 1e3 +
                  "s" +
                  (this.settings.slideTransition
                    ? " " + this.settings.slideTransition
                    : ""));
            }
            is(n) {
              return this._states.current[n] && this._states.current[n] > 0;
            }
            current(n) {
              return void 0 === n
                ? this._current
                : 0 !== this._items.length
                ? ((n = this.normalize(n)),
                  this._current !== n &&
                    (this._trigger("change", {
                      property: { name: "position", value: n },
                    }),
                    (this._current = n),
                    this.invalidate("position"),
                    this._trigger("changed", {
                      property: { name: "position", value: this._current },
                    })),
                  this._current)
                : void 0;
            }
            invalidate(n) {
              return (
                "string" == typeof n &&
                  ((this._invalidated[n] = !0),
                  this.is("valid") && this.leave("valid")),
                Object.keys(this._invalidated)
              );
            }
            reset(n) {
              void 0 !== (n = this.normalize(n)) &&
                ((this._speed = 0),
                (this._current = n),
                this._suppress(["translate", "translated"]),
                this.animate(this.coordinates(n)),
                this._release(["translate", "translated"]));
            }
            normalize(n, i) {
              const s = this._items.length,
                o = i ? 0 : this._clones.length;
              return (
                !this._isNumeric(n) || s < 1
                  ? (n = void 0)
                  : (n < 0 || n >= s + o) &&
                    (n = ((((n - o / 2) % s) + s) % s) + o / 2),
                n
              );
            }
            relative(n) {
              return this.normalize((n -= this._clones.length / 2), !0);
            }
            maximum(n = !1) {
              const i = this.settings;
              let o,
                a,
                l,
                s = this._coordinates.length;
              if (i.loop) s = this._clones.length / 2 + this._items.length - 1;
              else if (i.autoWidth || i.merge) {
                for (
                  o = this._items.length,
                    a = this.slidesData[--o].width,
                    l = this._width;
                  o-- > 0 &&
                  ((a += +this.slidesData[o].width + this.settings.margin),
                  !(a > l));

                );
                s = o + 1;
              } else
                s = i.center
                  ? this._items.length - 1
                  : this._items.length - i.items;
              return n && (s -= this._clones.length / 2), Math.max(s, 0);
            }
            minimum(n = !1) {
              return n ? 0 : this._clones.length / 2;
            }
            items(n) {
              return void 0 === n
                ? this._items.slice()
                : ((n = this.normalize(n, !0)), [this._items[n]]);
            }
            mergers(n) {
              return void 0 === n
                ? this._mergers.slice()
                : ((n = this.normalize(n, !0)), this._mergers[n]);
            }
            clones(n) {
              const i = this._clones.length / 2,
                s = i + this._items.length,
                o = (a) => (a % 2 == 0 ? s + a / 2 : i - (a + 1) / 2);
              return void 0 === n
                ? this._clones.map((a, l) => o(l))
                : this._clones
                    .map((a, l) => (a === n ? o(l) : null))
                    .filter((a) => a);
            }
            speed(n) {
              return void 0 !== n && (this._speed = n), this._speed;
            }
            coordinates(n) {
              let o,
                a,
                i = 1,
                s = n - 1;
              return void 0 === n
                ? ((a = this._coordinates.map((l, u) => this.coordinates(u))),
                  a)
                : (this.settings.center
                    ? (this.settings.rtl && ((i = -1), (s = n + 1)),
                      (o = this._coordinates[n]),
                      (o +=
                        ((this.width() - o + (this._coordinates[s] || 0)) / 2) *
                        i))
                    : (o = this._coordinates[s] || 0),
                  (o = Math.ceil(o)),
                  o);
            }
            _duration(n, i, s) {
              return 0 === s
                ? 0
                : Math.min(Math.max(Math.abs(i - n), 1), 6) *
                    Math.abs(+s || this.settings.smartSpeed);
            }
            to(n, i) {
              let s = this.current(),
                o = null,
                a = n - this.relative(s),
                l = this.maximum(),
                u = 0;
              const c = +(a > 0) - +(a < 0),
                d = this._items.length,
                f = this.minimum();
              this.settings.loop
                ? (!this.settings.rewind &&
                    Math.abs(a) > d / 2 &&
                    (a += -1 * c * d),
                  (o = (((((n = s + a) - f) % d) + d) % d) + f),
                  o !== n &&
                    o - a <= l &&
                    o - a > 0 &&
                    ((s = o - a),
                    (n = o),
                    (u = 30),
                    this.reset(s),
                    this.sendChanges()))
                : this.settings.rewind
                ? ((l += 1), (n = ((n % l) + l) % l))
                : (n = Math.max(f, Math.min(l, n))),
                setTimeout(() => {
                  this.speed(this._duration(s, n, i)),
                    this.current(n),
                    this.update();
                }, u);
            }
            next(n) {
              (n = n || !1), this.to(this.relative(this.current()) + 1, n);
            }
            prev(n) {
              (n = n || !1), this.to(this.relative(this.current()) - 1, n);
            }
            onTransitionEnd(n) {
              if (void 0 !== n) return !1;
              this.leave("animating"), this._trigger("translated");
            }
            _viewport() {
              let n;
              return (
                this._width
                  ? (n = this._width)
                  : this.logger.log("Can not detect viewport width."),
                n
              );
            }
            setItems(n) {
              this._items = n;
            }
            _defineSlidesData() {
              let n;
              this.slidesData &&
                this.slidesData.length &&
                ((n = new Map()),
                this.slidesData.forEach((i) => {
                  i.load && n.set(i.id, i.load);
                })),
                (this.slidesData = this._items.map((i) => ({
                  id: `${i.id}`,
                  isActive: !1,
                  tplRef: i.tplRef,
                  dataMerge: i.dataMerge,
                  width: 0,
                  isCloned: !1,
                  load: !!n && n.get(i.id),
                  hashFragment: i.dataHash,
                })));
            }
            setCurSlideClasses(n) {
              const i = {
                active: n.isActive,
                center: n.isCentered,
                cloned: n.isCloned,
                animated: n.isAnimated,
                "owl-animated-in": n.isDefAnimatedIn,
                "owl-animated-out": n.isDefAnimatedOut,
              };
              return (
                this.settings.animateIn &&
                  (i[this.settings.animateIn] = n.isCustomAnimatedIn),
                this.settings.animateOut &&
                  (i[this.settings.animateOut] = n.isCustomAnimatedOut),
                i
              );
            }
            _op(n, i, s) {
              const o = this.settings.rtl;
              switch (i) {
                case "<":
                  return o ? n > s : n < s;
                case ">":
                  return o ? n < s : n > s;
                case ">=":
                  return o ? n <= s : n >= s;
                case "<=":
                  return o ? n >= s : n <= s;
              }
            }
            _trigger(n, i, s, o, a) {
              switch (n) {
                case "initialized":
                  this._initializedCarousel$.next(n);
                  break;
                case "change":
                  this._changeSettingsCarousel$.next(i);
                  break;
                case "changed":
                  this._changedSettingsCarousel$.next(i);
                  break;
                case "drag":
                  this._dragCarousel$.next(n);
                  break;
                case "dragged":
                  this._draggedCarousel$.next(n);
                  break;
                case "resize":
                  this._resizeCarousel$.next(n);
                  break;
                case "resized":
                  this._resizedCarousel$.next(n);
                  break;
                case "refresh":
                  this._refreshCarousel$.next(n);
                  break;
                case "refreshed":
                  this._refreshedCarousel$.next(n);
                  break;
                case "translate":
                  this._translateCarousel$.next(n);
                  break;
                case "translated":
                  this._translatedCarousel$.next(n);
              }
            }
            enter(n) {
              [n].concat(this._states.tags[n] || []).forEach((i) => {
                void 0 === this._states.current[i] &&
                  (this._states.current[i] = 0),
                  this._states.current[i]++;
              });
            }
            leave(n) {
              [n].concat(this._states.tags[n] || []).forEach((i) => {
                (0 === this._states.current[i] || this._states.current[i]) &&
                  this._states.current[i]--;
              });
            }
            register(n) {
              n.type === rM.State &&
                ((this._states.tags[n.name] = this._states.tags[n.name]
                  ? this._states.tags[n.name].concat(n.tags)
                  : n.tags),
                (this._states.tags[n.name] = this._states.tags[n.name].filter(
                  (i, s) => this._states.tags[n.name].indexOf(i) === s
                )));
            }
            _suppress(n) {
              n.forEach((i) => {
                this._supress[i] = !0;
              });
            }
            _release(n) {
              n.forEach((i) => {
                delete this._supress[i];
              });
            }
            pointer(n) {
              const i = { x: null, y: null };
              return (
                (n =
                  (n = n.originalEvent || n || window.event).touches &&
                  n.touches.length
                    ? n.touches[0]
                    : n.changedTouches && n.changedTouches.length
                    ? n.changedTouches[0]
                    : n).pageX
                  ? ((i.x = n.pageX), (i.y = n.pageY))
                  : ((i.x = n.clientX), (i.y = n.clientY)),
                i
              );
            }
            _isNumeric(n) {
              return !isNaN(parseFloat(n));
            }
            _isNumberOrBoolean(n) {
              return this._isNumeric(n) || "boolean" == typeof n;
            }
            _isNumberOrString(n) {
              return this._isNumeric(n) || "string" == typeof n;
            }
            _isStringOrBoolean(n) {
              return "string" == typeof n || "boolean" == typeof n;
            }
            difference(n, i) {
              return null === n || null === i
                ? { x: 0, y: 0 }
                : { x: n.x - i.x, y: n.y - i.y };
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(M(gg));
            }),
            p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        iM = (() => {
          var e;
          class t {
            constructor(n) {
              p(this, "carouselService", void 0),
                p(this, "navSubscription", void 0),
                p(this, "_initialized", !1),
                p(this, "_pages", []),
                p(this, "_navData", {
                  disabled: !1,
                  prev: { disabled: !1, htmlText: "" },
                  next: { disabled: !1, htmlText: "" },
                }),
                p(this, "_dotsData", { disabled: !1, dots: [] }),
                (this.carouselService = n),
                this.spyDataStreams();
            }
            ngOnDestroy() {
              this.navSubscription.unsubscribe();
            }
            spyDataStreams() {
              const o = gn(
                this.carouselService.getInitializedState().pipe(
                  Y((a) => {
                    this.initialize(),
                      this._updateNavPages(),
                      this.draw(),
                      this.update(),
                      this.carouselService.sendChanges();
                  })
                ),
                this.carouselService.getChangedState().pipe(
                  Mt((a) => "position" === a.property.name),
                  Y((a) => {
                    this.update();
                  })
                ),
                this.carouselService.getRefreshedState().pipe(
                  Y(() => {
                    this._updateNavPages(),
                      this.draw(),
                      this.update(),
                      this.carouselService.sendChanges();
                  })
                )
              );
              this.navSubscription = o.subscribe(() => {});
            }
            initialize() {
              (this._navData.disabled = !0),
                (this._navData.prev.htmlText =
                  this.carouselService.settings.navText[0]),
                (this._navData.next.htmlText =
                  this.carouselService.settings.navText[1]),
                (this._dotsData.disabled = !0),
                (this.carouselService.navData = this._navData),
                (this.carouselService.dotsData = this._dotsData);
            }
            _updateNavPages() {
              let n, i, s;
              const o = this.carouselService.clones().length / 2,
                a = o + this.carouselService.items().length,
                l = this.carouselService.maximum(!0),
                u = [],
                c = this.carouselService.settings;
              let d =
                c.center || c.autoWidth || c.dotsData
                  ? 1
                  : Math.floor(Number(c.dotsEach)) || Math.floor(c.items);
              if (
                ((d = +d),
                "page" !== c.slideBy &&
                  (c.slideBy = Math.min(+c.slideBy, c.items)),
                c.dots || "page" === c.slideBy)
              )
                for (n = o, i = 0, s = 0; n < a; n++) {
                  if (i >= d || 0 === i) {
                    if (
                      (u.push({
                        start: Math.min(l, n - o),
                        end: n - o + d - 1,
                      }),
                      Math.min(l, n - o) === l)
                    )
                      break;
                    (i = 0), ++s;
                  }
                  i += this.carouselService.mergers(
                    this.carouselService.relative(n)
                  );
                }
              this._pages = u;
            }
            draw() {
              let n;
              const i = this.carouselService.settings,
                s = this.carouselService.items(),
                o = s.length <= i.items;
              if (
                ((this._navData.disabled = !i.nav || o),
                (this._dotsData.disabled = !i.dots || o),
                i.dots)
              )
                if (
                  ((n = this._pages.length - this._dotsData.dots.length),
                  i.dotsData && 0 !== n)
                )
                  (this._dotsData.dots = []),
                    s.forEach((a) => {
                      this._dotsData.dots.push({
                        active: !1,
                        id: `dot-${a.id}`,
                        innerContent: a.dotContent,
                        showInnerContent: !0,
                      });
                    });
                else if (n > 0) {
                  const a =
                    this._dotsData.dots.length > 0
                      ? this._dotsData.dots.length
                      : 0;
                  for (let l = 0; l < n; l++)
                    this._dotsData.dots.push({
                      active: !1,
                      id: `dot-${l + a}`,
                      innerContent: "",
                      showInnerContent: !1,
                    });
                } else n < 0 && this._dotsData.dots.splice(n, Math.abs(n));
              (this.carouselService.navData = this._navData),
                (this.carouselService.dotsData = this._dotsData);
            }
            update() {
              this._updateNavButtons(), this._updateDots();
            }
            _updateNavButtons() {
              const n = this.carouselService.settings,
                i = n.loop || n.rewind,
                s = this.carouselService.relative(
                  this.carouselService.current()
                );
              n.nav &&
                ((this._navData.prev.disabled =
                  !i && s <= this.carouselService.minimum(!0)),
                (this._navData.next.disabled =
                  !i && s >= this.carouselService.maximum(!0))),
                (this.carouselService.navData = this._navData);
            }
            _updateDots() {
              let n;
              this.carouselService.settings.dots &&
                (this._dotsData.dots.forEach((i) => {
                  !0 === i.active && (i.active = !1);
                }),
                (n = this._current()),
                this._dotsData.dots.length &&
                  (this._dotsData.dots[n].active = !0),
                (this.carouselService.dotsData = this._dotsData));
            }
            _current() {
              const n = this.carouselService.relative(
                this.carouselService.current()
              );
              let i;
              const s = this._pages
                .filter((o, a) => o.start <= n && o.end >= n)
                .pop();
              return (
                (i = this._pages.findIndex(
                  (o) => o.start === s.start && o.end === s.end
                )),
                i
              );
            }
            _getPosition(n) {
              let i, s;
              const o = this.carouselService.settings;
              return (
                "page" === o.slideBy
                  ? ((i = this._current()),
                    (s = this._pages.length),
                    n ? ++i : --i,
                    (i = this._pages[((i % s) + s) % s].start))
                  : ((i = this.carouselService.relative(
                      this.carouselService.current()
                    )),
                    (s = this.carouselService.items().length),
                    n ? (i += +o.slideBy) : (i -= +o.slideBy)),
                i
              );
            }
            next(n) {
              this.carouselService.to(this._getPosition(!0), n);
            }
            prev(n) {
              this.carouselService.to(this._getPosition(!1), n);
            }
            to(n, i, s) {
              let o;
              !s && this._pages.length
                ? ((o = this._pages.length),
                  this.carouselService.to(
                    this._pages[((n % o) + o) % o].start,
                    i
                  ))
                : this.carouselService.to(n, i);
            }
            moveByDot(n) {
              const i = this._dotsData.dots.findIndex((s) => n === s.id);
              this.to(i, this.carouselService.settings.dotsSpeed);
            }
            toSlideById(n) {
              const i = this.carouselService.slidesData.findIndex(
                (s) => s.id === n && !1 === s.isCloned
              );
              -1 === i ||
                i === this.carouselService.current() ||
                this.carouselService.to(this.carouselService.relative(i), !1);
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(M(sr));
            }),
            p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
            t
          );
        })();
      const mg = new O("WindowToken");
      class vg {
        get nativeWindow() {
          throw new Error("Not implemented.");
        }
      }
      const r3 = [
          {
            provide: vg,
            useClass: (() => {
              var e;
              class t extends vg {
                constructor() {
                  super();
                }
                get nativeWindow() {
                  return window;
                }
              }
              return (
                (e = t),
                p(t, "\u0275fac", function (n) {
                  return new (n || e)();
                }),
                p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
                t
              );
            })(),
          },
          {
            provide: mg,
            useFactory: function n3(e, t) {
              return jh(t)
                ? e.nativeWindow
                : { setTimeout: (n, i) => {}, clearTimeout: (n) => {} };
            },
            deps: [vg, wn],
          },
        ],
        yg = new O("DocumentToken");
      class _g {
        get nativeDocument() {
          throw new Error("Not implemented.");
        }
      }
      const a3 = [
        {
          provide: _g,
          useClass: (() => {
            var e;
            class t extends _g {
              constructor() {
                super();
              }
              get nativeDocument() {
                return document;
              }
            }
            return (
              (e = t),
              p(t, "\u0275fac", function (n) {
                return new (n || e)();
              }),
              p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
              t
            );
          })(),
        },
        {
          provide: yg,
          useFactory: function o3(e, t) {
            return jh(t)
              ? e.nativeDocument
              : { hidden: !1, visibilityState: "visible" };
          },
          deps: [_g, wn],
        },
      ];
      let sM = (() => {
          var e;
          class t {
            get isAutoplayStopped() {
              return this._isAutoplayStopped;
            }
            set isAutoplayStopped(n) {
              this._isAutoplayStopped = n;
            }
            constructor(n, i, s, o) {
              p(this, "carouselService", void 0),
                p(this, "ngZone", void 0),
                p(this, "autoplaySubscription", void 0),
                p(this, "_timeout", null),
                p(this, "_paused", !1),
                p(this, "_isArtificialAutoplayTimeout", void 0),
                p(this, "_isAutoplayStopped", !1),
                p(this, "winRef", void 0),
                p(this, "docRef", void 0),
                (this.carouselService = n),
                (this.ngZone = o),
                (this.winRef = i),
                (this.docRef = s),
                this.spyDataStreams();
            }
            ngOnDestroy() {
              this.autoplaySubscription.unsubscribe();
            }
            spyDataStreams() {
              const o = gn(
                this.carouselService.getInitializedState().pipe(
                  Y(() => {
                    this.carouselService.settings.autoplay && this.play();
                  })
                ),
                this.carouselService.getChangedState().pipe(
                  Y((a) => {
                    this._handleChangeObservable(a);
                  })
                ),
                this.carouselService.getResizedState().pipe(
                  Y(() => {
                    this.carouselService.settings.autoplay &&
                    !this._isAutoplayStopped
                      ? this.play()
                      : this.stop();
                  })
                )
              );
              this.autoplaySubscription = o.subscribe(() => {});
            }
            play(n, i) {
              this._paused &&
                ((this._paused = !1),
                this._setAutoPlayInterval(
                  this.carouselService.settings.autoplayMouseleaveTimeout
                )),
                !this.carouselService.is("rotating") &&
                  (this.carouselService.enter("rotating"),
                  this._setAutoPlayInterval());
            }
            _getNextTimeout(n, i) {
              return (
                this._timeout && this.winRef.clearTimeout(this._timeout),
                (this._isArtificialAutoplayTimeout = !!n),
                this.ngZone.runOutsideAngular(() =>
                  this.winRef.setTimeout(() => {
                    this.ngZone.run(() => {
                      this._paused ||
                        this.carouselService.is("busy") ||
                        this.carouselService.is("interacting") ||
                        this.docRef.hidden ||
                        this.carouselService.next(
                          i || this.carouselService.settings.autoplaySpeed
                        );
                    });
                  }, n || this.carouselService.settings.autoplayTimeout)
                )
              );
            }
            _setAutoPlayInterval(n) {
              this._timeout = this._getNextTimeout(n);
            }
            stop() {
              this.carouselService.is("rotating") &&
                ((this._paused = !0),
                this.winRef.clearTimeout(this._timeout),
                this.carouselService.leave("rotating"));
            }
            pause() {
              this.carouselService.is("rotating") && (this._paused = !0);
            }
            _handleChangeObservable(n) {
              "settings" === n.property.name
                ? this.carouselService.settings.autoplay
                  ? this.play()
                  : this.stop()
                : "position" === n.property.name &&
                  this.carouselService.settings.autoplay &&
                  this._setAutoPlayInterval();
            }
            _playAfterTranslated() {
              V("translated")
                .pipe(
                  Xe((n) => this.carouselService.getTranslatedState()),
                  kn(),
                  Mt(() => this._isArtificialAutoplayTimeout),
                  Y(() => this._setAutoPlayInterval())
                )
                .subscribe(() => {});
            }
            startPausing() {
              this.carouselService.settings.autoplayHoverPause &&
                this.carouselService.is("rotating") &&
                this.pause();
            }
            startPlayingMouseLeave() {
              this.carouselService.settings.autoplayHoverPause &&
                this.carouselService.is("rotating") &&
                (this.play(), this._playAfterTranslated());
            }
            startPlayingTouchEnd() {
              this.carouselService.settings.autoplayHoverPause &&
                this.carouselService.is("rotating") &&
                (this.play(), this._playAfterTranslated());
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(M(sr), M(mg), M(yg), M(ue));
            }),
            p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        oM = (() => {
          var e;
          class t {
            constructor(n) {
              p(this, "carouselService", void 0),
                p(this, "lazyLoadSubscription", void 0),
                (this.carouselService = n),
                this.spyDataStreams();
            }
            ngOnDestroy() {
              this.lazyLoadSubscription.unsubscribe();
            }
            spyDataStreams() {
              const o = gn(
                this.carouselService.getInitializedState().pipe(
                  Y(() => {
                    const a =
                      this.carouselService.settings &&
                      !this.carouselService.settings.lazyLoad;
                    this.carouselService.slidesData.forEach(
                      (l) => (l.load = !!a)
                    );
                  })
                ),
                this.carouselService.getChangeState(),
                this.carouselService.getResizedState()
              ).pipe(Y((a) => this._defineLazyLoadSlides(a)));
              this.lazyLoadSubscription = o.subscribe(() => {});
            }
            _defineLazyLoadSlides(n) {
              if (
                this.carouselService.settings &&
                this.carouselService.settings.lazyLoad &&
                ((n.property && "position" === n.property.name) ||
                  "initialized" === n ||
                  "resized" === n)
              ) {
                const i = this.carouselService.settings,
                  s = this.carouselService.clones().length;
                let o = (i.center && Math.ceil(i.items / 2)) || i.items,
                  a = (i.center && -1 * o) || 0,
                  l =
                    (n.property && void 0 !== n.property.value
                      ? n.property.value
                      : this.carouselService.current()) + a;
                for (
                  i.lazyLoadEager > 0 &&
                  ((o += i.lazyLoadEager),
                  i.loop && ((l -= i.lazyLoadEager), o++));
                  a++ < o;

                )
                  this._load(s / 2 + this.carouselService.relative(l)),
                    s &&
                      this.carouselService
                        .clones(this.carouselService.relative(l))
                        .forEach((u) => this._load(u)),
                    l++;
              }
            }
            _load(n) {
              this.carouselService.slidesData[n].load ||
                (this.carouselService.slidesData[n].load = !0);
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(M(sr));
            }),
            p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        Dg = (() => {
          var e;
          class t {
            constructor(n) {
              p(this, "carouselService", void 0),
                p(this, "animateSubscription", void 0),
                p(this, "swapping", !0),
                p(this, "previous", void 0),
                p(this, "next", void 0),
                (this.carouselService = n),
                this.spyDataStreams();
            }
            ngOnDestroy() {
              this.animateSubscription.unsubscribe();
            }
            spyDataStreams() {
              const n = this.carouselService.getChangeState().pipe(
                  Y((c) => {
                    "position" === c.property.name &&
                      ((this.previous = this.carouselService.current()),
                      (this.next = c.property.value));
                  })
                ),
                a = gn(
                  this.carouselService.getDragState(),
                  this.carouselService.getDraggedState(),
                  this.carouselService.getTranslatedState()
                ).pipe(Y((c) => (this.swapping = "translated" === c))),
                u = gn(
                  n,
                  this.carouselService.getTranslateState().pipe(
                    Y((c) => {
                      this.swapping &&
                        (this.carouselService._options.animateOut ||
                          this.carouselService._options.animateIn) &&
                        this._swap();
                    })
                  ),
                  a
                ).pipe();
              this.animateSubscription = u.subscribe(() => {});
            }
            _swap() {
              if (1 !== this.carouselService.settings.items) return;
              let n;
              this.carouselService.speed(0);
              const i = this.carouselService.slidesData[this.previous],
                s = this.carouselService.slidesData[this.next],
                o = this.carouselService.settings.animateIn,
                a = this.carouselService.settings.animateOut;
              this.carouselService.current() !== this.previous &&
                (a &&
                  ((n =
                    +this.carouselService.coordinates(this.previous) -
                    +this.carouselService.coordinates(this.next)),
                  this.carouselService.slidesData.forEach((l) => {
                    l.id === i.id &&
                      ((l.left = `${n}px`),
                      (l.isAnimated = !0),
                      (l.isDefAnimatedOut = !0),
                      (l.isCustomAnimatedOut = !0));
                  })),
                o &&
                  this.carouselService.slidesData.forEach((l) => {
                    l.id === s.id &&
                      ((l.isAnimated = !0),
                      (l.isDefAnimatedIn = !0),
                      (l.isCustomAnimatedIn = !0));
                  }));
            }
            clear(n) {
              this.carouselService.slidesData.forEach((i) => {
                i.id === n &&
                  ((i.left = ""),
                  (i.isAnimated = !1),
                  (i.isDefAnimatedOut = !1),
                  (i.isCustomAnimatedOut = !1),
                  (i.isDefAnimatedIn = !1),
                  (i.isCustomAnimatedIn = !1),
                  (i.classes = this.carouselService.setCurSlideClasses(i)));
              }),
                this.carouselService.onTransitionEnd();
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(M(sr));
            }),
            p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        aM = (() => {
          var e;
          class t {
            constructor(n) {
              p(this, "carouselService", void 0),
                p(this, "autoHeightSubscription", void 0),
                (this.carouselService = n),
                this.spyDataStreams();
            }
            ngOnDestroy() {
              this.autoHeightSubscription.unsubscribe();
            }
            spyDataStreams() {
              const o = gn(
                this.carouselService.getInitializedState().pipe(
                  Y((a) => {
                    this.carouselService.settings.autoHeight
                      ? this.update()
                      : this.carouselService.slidesData.forEach(
                          (l) => (l.heightState = "full")
                        );
                  })
                ),
                this.carouselService.getChangedState().pipe(
                  Y((a) => {
                    this.carouselService.settings.autoHeight &&
                      "position" === a.property.name &&
                      this.update();
                  })
                ),
                this.carouselService.getRefreshedState().pipe(
                  Y((a) => {
                    this.carouselService.settings.autoHeight && this.update();
                  })
                )
              );
              this.autoHeightSubscription = o.subscribe(() => {});
            }
            update() {
              const n = this.carouselService.settings.items;
              let i = this.carouselService.current(),
                s = i + n;
              this.carouselService.settings.center &&
                ((i = n % 2 == 1 ? i - (n - 1) / 2 : i - n / 2),
                (s = n % 2 == 1 ? i + n : i + n + 1)),
                this.carouselService.slidesData.forEach((o, a) => {
                  o.heightState = a >= i && a < s ? "full" : "nulled";
                });
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(M(sr));
            }),
            p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        lM = (() => {
          var e;
          class t {
            constructor(n, i, s) {
              p(this, "carouselService", void 0),
                p(this, "route", void 0),
                p(this, "router", void 0),
                p(this, "hashSubscription", void 0),
                p(this, "currentHashFragment", void 0),
                (this.carouselService = n),
                (this.route = i),
                (this.router = s),
                this.spyDataStreams(),
                this.route ||
                  (this.route = { fragment: V("no route").pipe(Fn(1)) }),
                this.router || (this.router = { navigate: (o, a) => {} });
            }
            ngOnDestroy() {
              this.hashSubscription.unsubscribe();
            }
            spyDataStreams() {
              const s = gn(
                this.carouselService
                  .getInitializedState()
                  .pipe(Y(() => this.listenToRoute())),
                this.carouselService.getChangedState().pipe(
                  Y((o) => {
                    if (
                      this.carouselService.settings.URLhashListener &&
                      "position" === o.property.name
                    ) {
                      const a = this.carouselService.current(),
                        l = this.carouselService.slidesData[a].hashFragment;
                      if (!l || l === this.currentHashFragment) return;
                      this.router.navigate(["./"], {
                        fragment: l,
                        relativeTo: this.route,
                      });
                    }
                  })
                )
              );
              this.hashSubscription = s.subscribe(() => {});
            }
            rewind(n) {
              const i = this.carouselService.slidesData.findIndex(
                (s) => s.hashFragment === n && !1 === s.isCloned
              );
              -1 === i ||
                i === this.carouselService.current() ||
                this.carouselService.to(this.carouselService.relative(i), !1);
            }
            listenToRoute() {
              this.route.fragment
                .pipe(
                  J0(
                    "URLHash" === this.carouselService.settings.startPosition
                      ? 0
                      : 2
                  )
                )
                .subscribe((i) => {
                  (this.currentHashFragment = i), this.rewind(i);
                });
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(M(sr), M(rr, 8), M(Ze, 8));
            }),
            p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        l3 = 0,
        lc = (() => {
          var e;
          class t {
            set dataMerge(n) {
              this._dataMerge = this.isNumeric(n) ? n : 1;
            }
            get dataMerge() {
              return this._dataMerge;
            }
            constructor(n) {
              p(this, "tplRef", void 0),
                p(this, "id", "owl-slide-" + l3++),
                p(this, "_dataMerge", 1),
                p(this, "width", 0),
                p(this, "dotContent", ""),
                p(this, "dataHash", ""),
                (this.tplRef = n);
            }
            isNumeric(n) {
              return !isNaN(parseFloat(n));
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(_(Nn));
            }),
            p(
              t,
              "\u0275dir",
              B({
                type: e,
                selectors: [["ng-template", "carouselSlide", ""]],
                inputs: {
                  id: "id",
                  dataMerge: "dataMerge",
                  width: "width",
                  dotContent: "dotContent",
                  dataHash: "dataHash",
                },
              })
            ),
            t
          );
        })(),
        uM = (() => {
          var e;
          class t {
            get onResize$() {
              return this.resizeObservable$;
            }
            constructor(n, i) {
              p(this, "resizeObservable$", void 0),
                (this.resizeObservable$ = jh(i)
                  ? pg(n, "resize")
                  : new be().asObservable());
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(M(mg), M(wn));
            }),
            p(t, "\u0275prov", R({ token: e, factory: e.ɵfac })),
            t
          );
        })(),
        u3 = (() => {
          var e;
          class t {
            constructor(n, i, s, o, a) {
              p(this, "zone", void 0),
                p(this, "el", void 0),
                p(this, "renderer", void 0),
                p(this, "carouselService", void 0),
                p(this, "animateService", void 0),
                p(this, "owlDraggable", void 0),
                p(this, "stageData", void 0),
                p(this, "slidesData", void 0),
                p(this, "listenerMouseMove", void 0),
                p(this, "listenerTouchMove", void 0),
                p(this, "listenerOneMouseMove", void 0),
                p(this, "listenerOneTouchMove", void 0),
                p(this, "listenerMouseUp", void 0),
                p(this, "listenerTouchEnd", void 0),
                p(this, "listenerOneClick", void 0),
                p(this, "listenerATag", void 0),
                p(this, "_drag", {
                  time: null,
                  target: null,
                  pointer: null,
                  stage: { start: null, current: null },
                  direction: null,
                  active: !1,
                  moving: !1,
                }),
                p(this, "_oneDragMove$", new be()),
                p(this, "_oneMoveSubsription", void 0),
                p(this, "preparePublicSlide", (l) => {
                  const u = { ...l };
                  return delete u.tplRef, u;
                }),
                p(this, "bindOneMouseTouchMove", (l) => {
                  this._oneMouseTouchMove(l);
                }),
                p(this, "bindOnDragMove", (l) => {
                  this._onDragMove(l);
                }),
                p(this, "bindOnDragEnd", (l) => {
                  this._onDragEnd(l);
                }),
                p(this, "_oneClickHandler", () => {
                  (this.listenerOneClick = this.renderer.listen(
                    this._drag.target,
                    "click",
                    () => !1
                  )),
                    this.listenerOneClick();
                }),
                (this.zone = n),
                (this.el = i),
                (this.renderer = s),
                (this.carouselService = o),
                (this.animateService = a);
            }
            onMouseDown(n) {
              this.owlDraggable.isMouseDragable && this._onDragStart(n);
            }
            onTouchStart(n) {
              if (n.targetTouches.length >= 2) return !1;
              this.owlDraggable.isTouchDragable && this._onDragStart(n);
            }
            onTouchCancel(n) {
              this._onDragEnd(n);
            }
            onDragStart() {
              if (this.owlDraggable.isMouseDragable) return !1;
            }
            onSelectStart() {
              if (this.owlDraggable.isMouseDragable) return !1;
            }
            ngOnInit() {
              this._oneMoveSubsription = this._oneDragMove$
                .pipe(kn())
                .subscribe(() => {
                  this._sendChanges();
                });
            }
            ngOnDestroy() {
              this._oneMoveSubsription.unsubscribe();
            }
            _onDragStart(n) {
              let i = null;
              3 !== n.which &&
                ((i = this._prepareDragging(n)),
                (this._drag.time = new Date().getTime()),
                (this._drag.target = n.target),
                (this._drag.stage.start = i),
                (this._drag.stage.current = i),
                (this._drag.pointer = this._pointer(n)),
                (this.listenerMouseUp = this.renderer.listen(
                  document,
                  "mouseup",
                  this.bindOnDragEnd
                )),
                (this.listenerTouchEnd = this.renderer.listen(
                  document,
                  "touchend",
                  this.bindOnDragEnd
                )),
                this.zone.runOutsideAngular(() => {
                  (this.listenerOneMouseMove = this.renderer.listen(
                    document,
                    "mousemove",
                    this.bindOneMouseTouchMove
                  )),
                    (this.listenerOneTouchMove = this.renderer.listen(
                      document,
                      "touchmove",
                      this.bindOneMouseTouchMove
                    ));
                }));
            }
            _oneMouseTouchMove(n) {
              const i = this._difference(this._drag.pointer, this._pointer(n));
              this.listenerATag && this.listenerATag(),
                !(
                  Math.abs(i.x) < 3 &&
                  Math.abs(i.y) < 3 &&
                  this._is("valid")
                ) &&
                  ((Math.abs(i.x) < 3 &&
                    Math.abs(i.x) < Math.abs(i.y) &&
                    this._is("valid")) ||
                    (this.listenerOneMouseMove(),
                    this.listenerOneTouchMove(),
                    (this._drag.moving = !0),
                    this.blockClickAnchorInDragging(n),
                    (this.listenerMouseMove = this.renderer.listen(
                      document,
                      "mousemove",
                      this.bindOnDragMove
                    )),
                    (this.listenerTouchMove = this.renderer.listen(
                      document,
                      "touchmove",
                      this.bindOnDragMove
                    )),
                    n.preventDefault(),
                    this._enterDragging(),
                    this._oneDragMove$.next(n)));
            }
            blockClickAnchorInDragging(n) {
              let i = n.target;
              for (; i && !(i instanceof HTMLAnchorElement); )
                i = i.parentElement;
              i instanceof HTMLAnchorElement &&
                (this.listenerATag = this.renderer.listen(
                  i,
                  "click",
                  () => !1
                ));
            }
            _onDragMove(n) {
              let i;
              const s = this.carouselService.defineNewCoordsDrag(n, this._drag);
              !1 !== s &&
                ((i = s),
                n.preventDefault(),
                (this._drag.stage.current = i),
                this._animate(i.x - this._drag.stage.start.x));
            }
            _animate(n) {
              this.renderer.setStyle(
                this.el.nativeElement.children[0],
                "transform",
                `translate3d(${n}px,0px,0px`
              ),
                this.renderer.setStyle(
                  this.el.nativeElement.children[0],
                  "transition",
                  "0s"
                );
            }
            _onDragEnd(n) {
              (this.carouselService.owlDOMData.isGrab = !1),
                this.listenerOneMouseMove(),
                this.listenerOneTouchMove(),
                this._drag.moving &&
                  (this.renderer.setStyle(
                    this.el.nativeElement.children[0],
                    "transform",
                    ""
                  ),
                  this.renderer.setStyle(
                    this.el.nativeElement.children[0],
                    "transition",
                    this.carouselService.speed(
                      +this.carouselService.settings.dragEndSpeed ||
                        this.carouselService.settings.smartSpeed
                    ) /
                      1e3 +
                      "s"
                  ),
                  this._finishDragging(n),
                  this.listenerMouseMove(),
                  this.listenerTouchMove()),
                (this._drag = {
                  time: null,
                  target: null,
                  pointer: null,
                  stage: { start: null, current: null },
                  direction: null,
                  active: !1,
                  moving: !1,
                }),
                this.listenerMouseUp(),
                this.listenerTouchEnd();
            }
            _prepareDragging(n) {
              return this.carouselService.prepareDragging(n);
            }
            _finishDragging(n) {
              this.carouselService.finishDragging(
                n,
                this._drag,
                this._oneClickHandler
              );
            }
            _pointer(n) {
              return this.carouselService.pointer(n);
            }
            _difference(n, i) {
              return this.carouselService.difference(n, i);
            }
            _is(n) {
              return this.carouselService.is(n);
            }
            _enter(n) {
              this.carouselService.enter(n);
            }
            _sendChanges() {
              this.carouselService.sendChanges();
            }
            onTransitionEnd() {
              this.carouselService.onTransitionEnd();
            }
            _enterDragging() {
              this.carouselService.enterDragging();
            }
            clear(n) {
              this.animateService.clear(n);
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)(_(ue), _(dt), _(En), _(sr), _(Dg));
            }),
            p(
              t,
              "\u0275cmp",
              Ue({
                type: e,
                selectors: [["owl-stage"]],
                hostBindings: function (n, i) {
                  1 & n &&
                    ce("mousedown", function (o) {
                      return i.onMouseDown(o);
                    })("touchstart", function (o) {
                      return i.onTouchStart(o);
                    })("touchcancel", function (o) {
                      return i.onTouchCancel(o);
                    })("dragstart", function () {
                      return i.onDragStart();
                    })("selectstart", function () {
                      return i.onSelectStart();
                    });
                },
                inputs: {
                  owlDraggable: "owlDraggable",
                  stageData: "stageData",
                  slidesData: "slidesData",
                },
                decls: 3,
                vars: 8,
                consts: [
                  [1, "owl-stage", 3, "ngStyle", "transitionend"],
                  [4, "ngFor", "ngForOf"],
                  [1, "owl-item", 3, "ngClass", "ngStyle", "animationend"],
                  [4, "ngIf"],
                  [3, "ngTemplateOutlet", "ngTemplateOutletContext"],
                ],
                template: function (n, i) {
                  1 & n &&
                    (w(0, "div")(1, "div", 0),
                    ce("transitionend", function () {
                      return i.onTransitionEnd();
                    }),
                    k(2, qU, 3, 9, "ng-container", 1),
                    E()()),
                    2 & n &&
                      (S(1),
                      T(
                        "ngStyle",
                        Hf(
                          2,
                          GU,
                          i.stageData.width + "px",
                          i.stageData.transform,
                          i.stageData.transition,
                          i.stageData.paddingL
                            ? i.stageData.paddingL + "px"
                            : "",
                          i.stageData.paddingR
                            ? i.stageData.paddingR + "px"
                            : ""
                        )
                      ),
                      S(1),
                      T("ngForOf", i.slidesData));
                },
                dependencies: [xh, Rn, Cr, cE, uE],
                encapsulation: 2,
                data: {
                  animation: [
                    ij("autoHeight", [
                      oS("nulled", Su({ height: 0 })),
                      oS("full", Su({ height: "*" })),
                      aS("full => nulled", [iS("700ms 350ms")]),
                      aS("nulled => full", [iS(350)]),
                    ]),
                  ],
                },
              })
            ),
            t
          );
        })(),
        Cg = (() => {
          var e;
          class t {
            constructor(n, i, s, o, a, l, u, c, d, f, h, g) {
              p(this, "el", void 0),
                p(this, "resizeService", void 0),
                p(this, "carouselService", void 0),
                p(this, "navigationService", void 0),
                p(this, "autoplayService", void 0),
                p(this, "lazyLoadService", void 0),
                p(this, "animateService", void 0),
                p(this, "autoHeightService", void 0),
                p(this, "hashService", void 0),
                p(this, "logger", void 0),
                p(this, "changeDetectorRef", void 0),
                p(this, "slides", void 0),
                p(this, "translated", new ve()),
                p(this, "dragging", new ve()),
                p(this, "change", new ve()),
                p(this, "changed", new ve()),
                p(this, "initialized", new ve()),
                p(this, "carouselWindowWidth", void 0),
                p(this, "resizeSubscription", void 0),
                p(this, "_allObservSubscription", void 0),
                p(this, "_slidesChangesSubscription", void 0),
                p(this, "owlDOMData", void 0),
                p(this, "stageData", void 0),
                p(this, "slidesData", []),
                p(this, "navData", void 0),
                p(this, "dotsData", void 0),
                p(this, "slidesOutputData", void 0),
                p(this, "carouselLoaded", !1),
                p(this, "options", void 0),
                p(this, "prevOptions", void 0),
                p(this, "_viewCurSettings$", void 0),
                p(this, "_translatedCarousel$", void 0),
                p(this, "_draggingCarousel$", void 0),
                p(this, "_changeCarousel$", void 0),
                p(this, "_changedCarousel$", void 0),
                p(this, "_initializedCarousel$", void 0),
                p(this, "_carouselMerge$", void 0),
                p(this, "docRef", void 0),
                (this.el = n),
                (this.resizeService = i),
                (this.carouselService = s),
                (this.navigationService = o),
                (this.autoplayService = a),
                (this.lazyLoadService = l),
                (this.animateService = u),
                (this.autoHeightService = c),
                (this.hashService = d),
                (this.logger = f),
                (this.changeDetectorRef = h),
                (this.docRef = g);
            }
            onVisibilityChange(n) {
              if (this.carouselService.settings.autoplay)
                switch (this.docRef.visibilityState) {
                  case "visible":
                    !this.autoplayService.isAutoplayStopped &&
                      this.autoplayService.play();
                    break;
                  case "hidden":
                    this.autoplayService.pause();
                }
            }
            ngOnInit() {
              this.spyDataStreams(),
                (this.carouselWindowWidth =
                  this.el.nativeElement.querySelector(
                    ".owl-carousel"
                  ).clientWidth);
            }
            ngOnChanges() {
              this.prevOptions !== this.options &&
                (this.prevOptions && this.slides?.toArray().length
                  ? (this.carouselService.setup(
                      this.carouselWindowWidth,
                      this.slides.toArray(),
                      this.options
                    ),
                    this.carouselService.initialize(this.slides.toArray()))
                  : this.prevOptions && !this.slides?.toArray().length
                  ? ((this.carouselLoaded = !1),
                    this.logger.log(
                      "There are no slides to show. So the carousel won't be re-rendered"
                    ))
                  : (this.carouselLoaded = !1),
                (this.prevOptions = this.options));
            }
            ngAfterContentInit() {
              this.slides.toArray().length
                ? (this.carouselService.setup(
                    this.carouselWindowWidth,
                    this.slides.toArray(),
                    this.options
                  ),
                  this.carouselService.initialize(this.slides.toArray()),
                  this._winResizeWatcher())
                : this.logger.log(
                    "There are no slides to show. So the carousel won't be rendered"
                  ),
                (this._slidesChangesSubscription = this.slides.changes
                  .pipe(
                    Y((n) => {
                      this.carouselService.setup(
                        this.carouselWindowWidth,
                        n.toArray(),
                        this.options
                      ),
                        this.carouselService.initialize(n.toArray()),
                        n.toArray().length || (this.carouselLoaded = !1),
                        n.toArray().length &&
                          !this.resizeSubscription &&
                          this._winResizeWatcher();
                    })
                  )
                  .subscribe(() => {}));
            }
            ngOnDestroy() {
              this.resizeSubscription && this.resizeSubscription.unsubscribe(),
                this._slidesChangesSubscription &&
                  this._slidesChangesSubscription.unsubscribe(),
                this._allObservSubscription &&
                  this._allObservSubscription.unsubscribe();
            }
            spyDataStreams() {
              (this._viewCurSettings$ = this.carouselService
                .getViewCurSettings()
                .pipe(
                  Y((n) => {
                    (this.owlDOMData = n.owlDOMData),
                      (this.stageData = n.stageData),
                      (this.slidesData = n.slidesData),
                      this.carouselLoaded || (this.carouselLoaded = !0),
                      (this.navData = n.navData),
                      (this.dotsData = n.dotsData),
                      this.changeDetectorRef.markForCheck();
                  })
                )),
                (this._initializedCarousel$ = this.carouselService
                  .getInitializedState()
                  .pipe(
                    Y(() => {
                      this.gatherTranslatedData(),
                        this.initialized.emit(this.slidesOutputData);
                    })
                  )),
                (this._translatedCarousel$ = this.carouselService
                  .getTranslatedState()
                  .pipe(
                    Y(() => {
                      this.gatherTranslatedData(),
                        this.translated.emit(this.slidesOutputData);
                    })
                  )),
                (this._changeCarousel$ = this.carouselService
                  .getChangeState()
                  .pipe(
                    Y(() => {
                      this.gatherTranslatedData(),
                        this.change.emit(this.slidesOutputData);
                    })
                  )),
                (this._changedCarousel$ = this.carouselService
                  .getChangeState()
                  .pipe(
                    Xe((n) =>
                      gn(
                        V(n).pipe(
                          Mt(() => "position" === n.property.name),
                          Xe(() => Le(this.slidesData)),
                          J0(n.property.value),
                          Fn(this.carouselService.settings.items),
                          te((s) => {
                            const o = this.carouselService.clonedIdPrefix,
                              a =
                                s.id.indexOf(o) >= 0
                                  ? s.id.slice(o.length)
                                  : s.id;
                            return { ...s, id: a, isActive: !0 };
                          }),
                          (function PU() {
                            return Ne((e, t) => {
                              (function NU(e, t) {
                                return Ne(
                                  GS(e, t, arguments.length >= 2, !1, !0)
                                );
                              })(
                                RU,
                                []
                              )(e).subscribe(t);
                            });
                          })(),
                          te((s) => ({
                            slides: s,
                            startPosition: this.carouselService.relative(
                              n.property.value
                            ),
                          }))
                        )
                      )
                    ),
                    Y((n) => {
                      this.gatherTranslatedData(),
                        this.changed.emit(
                          n.slides.length ? n : this.slidesOutputData
                        );
                    })
                  )),
                (this._draggingCarousel$ = this.carouselService
                  .getDragState()
                  .pipe(
                    Y(() => {
                      this.gatherTranslatedData(),
                        this.dragging.emit({
                          dragging: !0,
                          data: this.slidesOutputData,
                        });
                    }),
                    Xe(() =>
                      this.carouselService
                        .getDraggedState()
                        .pipe(te(() => !!this.carouselService.is("animating")))
                    ),
                    Xe((n) =>
                      n
                        ? this.carouselService.getTranslatedState().pipe(kn())
                        : V("not animating")
                    ),
                    Y(() => {
                      this.dragging.emit({
                        dragging: !1,
                        data: this.slidesOutputData,
                      });
                    })
                  )),
                (this._carouselMerge$ = gn(
                  this._viewCurSettings$,
                  this._translatedCarousel$,
                  this._draggingCarousel$,
                  this._changeCarousel$,
                  this._changedCarousel$,
                  this._initializedCarousel$
                )),
                (this._allObservSubscription = this._carouselMerge$.subscribe(
                  () => {}
                ));
            }
            _winResizeWatcher() {
              Object.keys(this.carouselService._options.responsive).length &&
                (this.resizeSubscription = this.resizeService.onResize$
                  .pipe(
                    Mt(
                      () =>
                        this.carouselWindowWidth !==
                        this.el.nativeElement.querySelector(".owl-carousel")
                          .clientWidth
                    ),
                    (function $U(e, t = tM) {
                      const r = (function jU(e = 0, t, r = kU) {
                        let n = -1;
                        return (
                          null != t && (Gg(t) ? (r = t) : (n = t)),
                          new Ie((i) => {
                            let s = (function VU(e) {
                              return e instanceof Date && !isNaN(e);
                            })(e)
                              ? +e - r.now()
                              : e;
                            s < 0 && (s = 0);
                            let o = 0;
                            return r.schedule(function () {
                              i.closed ||
                                (i.next(o++),
                                0 <= n
                                  ? this.schedule(void 0, n)
                                  : i.complete());
                            }, s);
                          })
                        );
                      })(e, t);
                      return nM(() => r);
                    })(this.carouselService.settings.responsiveRefreshRate)
                  )
                  .subscribe(() => {
                    this.carouselService.onResize(
                      this.el.nativeElement.querySelector(".owl-carousel")
                        .clientWidth
                    ),
                      (this.carouselWindowWidth =
                        this.el.nativeElement.querySelector(
                          ".owl-carousel"
                        ).clientWidth);
                  }));
            }
            onTransitionEnd() {
              this.carouselService.onTransitionEnd();
            }
            next() {
              this.carouselLoaded &&
                this.navigationService.next(
                  this.carouselService.settings.navSpeed
                );
            }
            prev() {
              this.carouselLoaded &&
                this.navigationService.prev(
                  this.carouselService.settings.navSpeed
                );
            }
            moveByDot(n) {
              this.carouselLoaded && this.navigationService.moveByDot(n);
            }
            to(n) {
              this.carouselLoaded && this.navigationService.toSlideById(n);
            }
            gatherTranslatedData() {
              let n;
              const i = this.carouselService.clonedIdPrefix,
                s = this.slidesData
                  .filter((o) => !0 === o.isActive)
                  .map((o) => ({
                    id: o.id.indexOf(i) >= 0 ? o.id.slice(i.length) : o.id,
                    width: o.width,
                    marginL: o.marginL,
                    marginR: o.marginR,
                    center: o.isCentered,
                  }));
              (n = this.carouselService.relative(
                this.carouselService.current()
              )),
                (this.slidesOutputData = { startPosition: n, slides: s });
            }
            startPausing() {
              this.autoplayService.startPausing();
            }
            startPlayML() {
              this.autoplayService.startPlayingMouseLeave();
            }
            startPlayTE() {
              this.autoplayService.startPlayingTouchEnd();
            }
            stopAutoplay() {
              (this.autoplayService.isAutoplayStopped = !0),
                this.autoplayService.stop();
            }
            startAutoplay() {
              (this.autoplayService.isAutoplayStopped = !1),
                this.autoplayService.play();
            }
          }
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n ||
                e)(_(dt), _(uM), _(sr), _(iM), _(sM), _(oM), _(Dg), _(aM), _(lM), _(gg), _(Io), _(yg));
            }),
            p(
              t,
              "\u0275cmp",
              Ue({
                type: e,
                selectors: [["owl-carousel-o"]],
                contentQueries: function (n, i, s) {
                  if ((1 & n && Yf(s, lc, 4), 2 & n)) {
                    let o;
                    Zf((o = Xf())) && (i.slides = o);
                  }
                },
                hostBindings: function (n, i) {
                  1 & n &&
                    ce(
                      "visibilitychange",
                      function (o) {
                        return i.onVisibilityChange(o);
                      },
                      0,
                      Uy
                    );
                },
                inputs: { options: "options" },
                outputs: {
                  translated: "translated",
                  dragging: "dragging",
                  change: "change",
                  changed: "changed",
                  initialized: "initialized",
                },
                features: [Se([iM, sM, sr, oM, Dg, aM, lM]), Pt],
                decls: 4,
                vars: 9,
                consts: [
                  [
                    1,
                    "owl-carousel",
                    "owl-theme",
                    3,
                    "ngClass",
                    "mouseover",
                    "mouseleave",
                    "touchstart",
                    "touchend",
                  ],
                  ["owlCarousel", ""],
                  ["class", "owl-stage-outer", 4, "ngIf"],
                  [4, "ngIf"],
                  [1, "owl-stage-outer"],
                  [3, "owlDraggable", "stageData", "slidesData"],
                  [1, "owl-nav", 3, "ngClass"],
                  [1, "owl-prev", 3, "ngClass", "innerHTML", "click"],
                  [1, "owl-next", 3, "ngClass", "innerHTML", "click"],
                  [1, "owl-dots", 3, "ngClass"],
                  [
                    "class",
                    "owl-dot",
                    3,
                    "ngClass",
                    "click",
                    4,
                    "ngFor",
                    "ngForOf",
                  ],
                  [1, "owl-dot", 3, "ngClass", "click"],
                  [3, "innerHTML"],
                ],
                template: function (n, i) {
                  1 & n &&
                    (w(0, "div", 0, 1),
                    ce("mouseover", function () {
                      return i.startPausing();
                    })("mouseleave", function () {
                      return i.startPlayML();
                    })("touchstart", function () {
                      return i.startPausing();
                    })("touchend", function () {
                      return i.startPlayTE();
                    }),
                    k(2, QU, 2, 6, "div", 2),
                    k(3, YU, 6, 15, "ng-container", 3),
                    E()),
                    2 & n &&
                      (T(
                        "ngClass",
                        Hf(
                          3,
                          XU,
                          null == i.owlDOMData ? null : i.owlDOMData.rtl,
                          null == i.owlDOMData ? null : i.owlDOMData.isLoaded,
                          null == i.owlDOMData
                            ? null
                            : i.owlDOMData.isResponsive,
                          null == i.owlDOMData
                            ? null
                            : i.owlDOMData.isMouseDragable,
                          null == i.owlDOMData ? null : i.owlDOMData.isGrab
                        )
                      ),
                      S(2),
                      T("ngIf", i.carouselLoaded),
                      S(1),
                      T("ngIf", i.slides.toArray().length));
                },
                dependencies: [xh, Rn, Cr, u3],
                styles: [".owl-theme[_ngcontent-%COMP%]{display:block}"],
                changeDetection: 0,
              })
            ),
            t
          );
        })(),
        c3 = (() => {
          var e;
          class t {}
          return (
            (e = t),
            p(t, "\u0275fac", function (n) {
              return new (n || e)();
            }),
            p(t, "\u0275mod", Nt({ type: e })),
            p(
              t,
              "\u0275inj",
              yt({ providers: [r3, uM, a3, gg], imports: [hE] })
            ),
            t
          );
        })();
      function d3(e, t) {
        1 & e && q(0, "img", 4), 2 & e && T("src", he().$implicit.image, Wn);
      }
      function f3(e, t) {
        if ((1 & e && (qr(0), k(1, d3, 1, 1, "ng-template", 3), Gr()), 2 & e)) {
          const r = t.$implicit;
          S(1), T("id", r._id);
        }
      }
      let h3 = (() => {
        var e;
        class t {
          constructor(n) {
            (this._products_srevice = n),
              (this.customOptions = {
                loop: !0,
                mouseDrag: !0,
                touchDrag: !0,
                pullDrag: !1,
                dots: !1,
                navSpeed: 700,
                navText: ["", ""],
                responsive: { 0: { items: 7 } },
                nav: !0,
              });
          }
          ngOnInit() {
            this._products_srevice.getCategories().subscribe({
              next: (n) => {
                this.data = n.data;
              },
            });
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(li));
          }),
          (e.ɵcmp = Ue({
            type: e,
            selectors: [["app-category-slider"]],
            decls: 3,
            vars: 2,
            consts: [
              [1, "my-3"],
              [3, "options"],
              [4, "ngFor", "ngForOf"],
              ["carouselSlide", "", 3, "id"],
              ["height", "250px", 1, "w-100", 3, "src"],
            ],
            template: function (n, i) {
              1 & n &&
                (w(0, "div", 0)(1, "owl-carousel-o", 1),
                k(2, f3, 2, 1, "ng-container", 2),
                E()()),
                2 & n &&
                  (S(1),
                  T("options", i.customOptions),
                  S(1),
                  T("ngForOf", i.data));
            },
            dependencies: [Rn, Cg, lc],
          })),
          t
        );
      })();
      function p3(e, t) {
        1 & e && q(0, "img", 11);
      }
      function g3(e, t) {
        1 & e && q(0, "img", 12);
      }
      function m3(e, t) {
        1 & e && q(0, "img", 13);
      }
      const v3 = function (e) {
        return ["/productdetails", e];
      };
      function y3(e, t) {
        if (1 & e) {
          const r = mr();
          w(0, "div", 16)(1, "a", 17)(2, "div"),
            q(3, "img", 18),
            w(4, "h6", 19),
            x(5),
            E(),
            w(6, "h5"),
            x(7),
            E(),
            w(8, "p", 20),
            x(9),
            E(),
            w(10, "p", 20),
            q(11, "i", 21),
            x(12),
            E()()(),
            w(13, "button", 22),
            ce("click", function () {
              const s = rn(r).$implicit;
              return sn(he(2).addToCart(s._id));
            }),
            x(14, "+ Add"),
            E()();
        }
        if (2 & e) {
          const r = t.$implicit;
          S(1),
            T("routerLink", yr(6, v3, r._id)),
            S(2),
            T("src", r.imageCover, Wn),
            S(2),
            Vt(r.category.name),
            S(2),
            Qt("", r.title.split(" ").slice(0, 2).join(" "), "..."),
            S(2),
            Qt("", r.price, " EGP"),
            S(3),
            Qt(" ", r.ratingsAverage, "");
        }
      }
      function _3(e, t) {
        if (
          (1 & e && (w(0, "div", 14), k(1, y3, 15, 8, "div", 15), E()), 2 & e)
        ) {
          const r = he();
          S(1), T("ngForOf", r.items);
        }
      }
      function D3(e, t) {
        1 & e &&
          (w(0, "div", 23)(1, "div", 24),
          q(2, "div")(3, "div")(4, "div")(5, "div"),
          E()());
      }
      let C3 = (() => {
        var e;
        class t {
          constructor(n, i) {
            (this._ProductsService = n),
              (this._cart = i),
              (this.items = []),
              (this.categories = []),
              (this.customOptions = {
                loop: !0,
                mouseDrag: !0,
                touchDrag: !0,
                pullDrag: !1,
                dots: !1,
                navSpeed: 700,
                navText: ["", ""],
                responsive: { 0: { items: 1 } },
                nav: !0,
              });
          }
          ngOnInit() {
            this._ProductsService.getProducts().subscribe((n) => {
              console.log(n), (this.items = n.data);
            }),
              this._ProductsService.getCategories().subscribe((n) => {
                console.log(n), (this.categories = n.data);
              });
          }
          addToCart(n) {
            this._cart.addToCart(n).subscribe({
              next: (i) => {
                console.log(i),
                  this._cart.numOfItems.next(i.numOfCartItems),
                  console.log(this._cart.numOfItems.getValue());
              },
              error: (i) => {
                console.log(i);
              },
            });
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(li), _(ui));
          }),
          (e.ɵcmp = Ue({
            type: e,
            selectors: [["app-home"]],
            decls: 15,
            vars: 3,
            consts: [
              [1, "row", "g-0"],
              [1, "col-md-8"],
              [3, "options"],
              ["carouselSlide", "", "id", "1"],
              ["carouselSlide", "", "id", "2"],
              ["carouselSlide", "", "id", "3"],
              [1, "col-md-4"],
              [
                "src",
                "assets/images/blog-img-2.jpeg",
                "alt",
                "",
                "height",
                "200px",
                1,
                "w-100",
              ],
              [
                "src",
                "assets/images/slider-2.jpeg",
                "alt",
                "",
                "height",
                "200px",
                1,
                "w-100",
              ],
              ["class", "row", 4, "ngIf", "ngIfElse"],
              ["x", ""],
              [
                "src",
                "assets/images/slider-image-1.jpeg",
                "alt",
                "",
                "height",
                "400px",
                1,
                "w-100",
              ],
              [
                "src",
                "assets/images/slider-image-2.jpeg",
                "alt",
                "",
                "height",
                "400px",
                1,
                "w-100",
              ],
              [
                "src",
                "assets/images/slider-image-3.jpeg",
                "alt",
                "",
                "height",
                "400px",
                1,
                "w-100",
              ],
              [1, "row"],
              ["class", "col-md-2 my-3", 4, "ngFor", "ngForOf"],
              [1, "col-md-2", "my-3"],
              [3, "routerLink"],
              ["alt", "", 1, "w-100", 3, "src"],
              [1, "fw-bold", "text-success"],
              [1, "text-muted"],
              [1, "fa-solid", "fa-star", "gold"],
              [1, "btn", "btn-success", "text-white", 3, "click"],
              [
                1,
                "d-flex",
                "justify-content-center",
                "align-items-center",
                "vh-100",
                "w-100",
              ],
              [1, "lds-ring"],
            ],
            template: function (n, i) {
              if (
                (1 & n &&
                  (w(0, "div", 0)(1, "div", 1)(2, "div")(
                    3,
                    "owl-carousel-o",
                    2
                  ),
                  k(4, p3, 1, 0, "ng-template", 3),
                  k(5, g3, 1, 0, "ng-template", 4),
                  k(6, m3, 1, 0, "ng-template", 5),
                  E()()(),
                  w(7, "div", 6)(8, "div"),
                  q(9, "img", 7)(10, "img", 8),
                  E()()(),
                  q(11, "app-category-slider"),
                  k(12, _3, 2, 1, "div", 9),
                  k(13, D3, 6, 0, "ng-template", null, 10, Jf)),
                2 & n)
              ) {
                const s = Sf(14);
                S(3),
                  T("options", i.customOptions),
                  S(9),
                  T("ngIf", i.items.length > 0)("ngIfElse", s);
              }
            },
            dependencies: [Rn, Cr, Pr, Cg, lc, h3],
            styles: [
              ".lds-ring[_ngcontent-%COMP%]{display:inline-block;position:relative;width:80px;height:80px}.lds-ring[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{box-sizing:border-box;display:block;position:absolute;width:64px;height:64px;border:8px solid #000;border-radius:50%;animation:_ngcontent-%COMP%_lds-ring 1.2s cubic-bezier(.5,0,.5,1) infinite;border-color:#000 transparent transparent transparent;margin:50px auto;left:50%}.lds-ring[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(1){animation-delay:-.45s}.lds-ring[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2){animation-delay:-.3s}.lds-ring[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(3){animation-delay:-.15s}@keyframes _ngcontent-%COMP%_lds-ring{0%{transform:rotate(0)}to{transform:rotate(360deg)}}a[_ngcontent-%COMP%]{all:unset;cursor:pointer}.col-md-2[_ngcontent-%COMP%]{transition:1s}",
            ],
          })),
          t
        );
      })();
      const w3 = function (e) {
        return ["/productdetails", e];
      };
      function E3(e, t) {
        if (1 & e) {
          const r = mr();
          w(0, "div", 4)(1, "a", 5)(2, "div"),
            q(3, "img", 6),
            w(4, "h6", 7),
            x(5),
            E(),
            w(6, "h5"),
            x(7),
            E(),
            w(8, "p", 8),
            x(9),
            E(),
            w(10, "p", 8),
            q(11, "i", 9),
            x(12),
            E()()(),
            w(13, "button", 10),
            ce("click", function () {
              const s = rn(r).$implicit;
              return sn(he(2).addToCart(s._id));
            }),
            x(14, " + Add "),
            E()();
        }
        if (2 & e) {
          const r = t.$implicit;
          S(1),
            T("routerLink", yr(6, w3, r._id)),
            S(2),
            T("src", r.imageCover, Wn),
            S(2),
            Vt(r.category.name),
            S(2),
            Qt("", r.title.split(" ").slice(0, 2).join(" "), "..."),
            S(2),
            Qt("", r.price, " EGP"),
            S(3),
            Qt(" ", r.ratingsAverage, " ");
        }
      }
      function b3(e, t) {
        if (
          (1 & e && (w(0, "div", 2), k(1, E3, 15, 8, "div", 3), E()), 2 & e)
        ) {
          const r = he();
          S(1), T("ngForOf", r.items);
        }
      }
      function S3(e, t) {
        1 & e &&
          (w(0, "div", 11)(1, "div", 12),
          q(2, "div")(3, "div")(4, "div")(5, "div"),
          E()());
      }
      let M3 = (() => {
        var e;
        class t {
          constructor(n, i) {
            (this._ProductsService = n), (this._cart = i), (this.items = []);
          }
          ngOnInit() {
            this._ProductsService.getProducts().subscribe((n) => {
              console.log(n), (this.items = n.data);
            });
          }
          addToCart(n) {
            this._cart.addToCart(n).subscribe({
              next: (i) => {
                console.log(i),
                  this._cart.numOfItems.next(i.numOfCartItems),
                  console.log(this._cart.numOfItems.getValue());
              },
              error: (i) => {
                console.log(i);
              },
            });
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(li), _(ui));
          }),
          (e.ɵcmp = Ue({
            type: e,
            selectors: [["app-products"]],
            decls: 3,
            vars: 2,
            consts: [
              ["class", "row", 4, "ngIf", "ngIfElse"],
              ["x", ""],
              [1, "row"],
              ["class", "col-md-2 my-3", 4, "ngFor", "ngForOf"],
              [1, "col-md-2", "my-3"],
              [3, "routerLink"],
              ["alt", "", 1, "w-100", 3, "src"],
              [1, "fw-bold", "text-success"],
              [1, "text-muted"],
              [1, "fa-solid", "fa-star", "gold"],
              [1, "btn", "btn-success", "text-white", 3, "click"],
              [
                1,
                "d-flex",
                "justify-content-center",
                "align-items-center",
                "vh-100",
                "w-100",
              ],
              [1, "lds-ring"],
            ],
            template: function (n, i) {
              if (
                (1 & n &&
                  (k(0, b3, 2, 1, "div", 0),
                  k(1, S3, 6, 0, "ng-template", null, 1, Jf)),
                2 & n)
              ) {
                const s = Sf(2);
                T("ngIf", i.items.length > 0)("ngIfElse", s);
              }
            },
            dependencies: [Rn, Cr, Pr],
            styles: ["a[_ngcontent-%COMP%]{all:unset;cursor:pointer}"],
          })),
          t
        );
      })();
      function I3(e, t) {
        if (1 & e) {
          const r = mr();
          w(0, "div", 3)(1, "div", 4)(2, "div"),
            q(3, "img", 5),
            E()(),
            w(4, "div", 6)(5, "div", 7)(6, "div")(7, "h4"),
            x(8),
            E(),
            w(9, "h6"),
            x(10),
            (function RC(e, t) {
              const r = re();
              let n;
              const i = e + J;
              r.firstCreatePass
                ? ((n = (function nx(e, t) {
                    if (t)
                      for (let r = t.length - 1; r >= 0; r--) {
                        const n = t[r];
                        if (e === n.name) return n;
                      }
                  })(t, r.pipeRegistry)),
                  (r.data[i] = n),
                  n.onDestroy && (r.destroyHooks ??= []).push(i, n.onDestroy))
                : (n = r.data[i]);
              const s = n.factory || (n.factory = jr(n.type)),
                a = _t(_);
              try {
                const l = Fa(!1),
                  u = s();
                return (
                  Fa(l),
                  (function jR(e, t, r, n) {
                    r >= e.data.length &&
                      ((e.data[r] = null), (e.blueprint[r] = null)),
                      (t[r] = n);
                  })(r, b(), i, u),
                  u
                );
              } finally {
                _t(a);
              }
            })(11, "currency"),
            E()(),
            w(12, "div")(13, "button", 8),
            ce("click", function () {
              const s = rn(r).$implicit;
              return sn(he().updateProduct(s.product._id, s.count + 1));
            }),
            x(14, " + "),
            E(),
            w(15, "span", 9),
            x(16),
            E(),
            w(17, "button", 10),
            ce("click", function () {
              const s = rn(r).$implicit;
              return sn(he().updateProduct(s.product._id, s.count - 1));
            }),
            x(18, " - "),
            E()()(),
            w(19, "button", 11),
            ce("click", function () {
              const s = rn(r).$implicit;
              return sn(he().removeProduct(s.product._id));
            }),
            q(20, "i", 12),
            x(21, " Remove "),
            E()()();
        }
        if (2 & e) {
          const r = t.$implicit;
          S(3),
            T("src", r.product.imageCover, Wn),
            S(5),
            Vt(r.product.title),
            S(2),
            Vt(PC(11, 4, r.price, "EGP")),
            S(6),
            Vt(r.count);
        }
      }
      let T3 = (() => {
        var e;
        class t {
          constructor(n) {
            this._cart = n;
          }
          ngOnInit() {
            this._cart.getLoggedUserCart().subscribe({
              next: (n) => {
                console.log(n.data), (this.data = n.data);
              },
              error: (n) => console.log(n),
            });
          }
          removeProduct(n) {
            this._cart.removeProduct(n).subscribe({
              next: (i) => {
                console.log(i.data), (this.data = i.data);
              },
              error: (i) => console.log(i),
            });
          }
          updateProduct(n, i) {
            this._cart.updateProduct(n, i).subscribe({
              next: (s) => {
                console.log(s.data), (this.data = s.data);
              },
              error: (s) => console.log(s),
            });
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(ui));
          }),
          (e.ɵcmp = Ue({
            type: e,
            selectors: [["app-cart"]],
            decls: 8,
            vars: 2,
            consts: [
              [1, "text-success"],
              ["class", "row my-3", 4, "ngFor", "ngForOf"],
              [
                "routerLink",
                "/shippingdetails",
                1,
                "btn",
                "btn-success",
                "mt-3",
                "mb-5",
              ],
              [1, "row", "my-3"],
              [1, "col-md-1"],
              ["alt", "", 1, "w-100", 3, "src"],
              [1, "col-md-11"],
              [1, "d-flex", "justify-content-between"],
              [1, "btn", "add", 3, "click"],
              [1, "d-inline-block", "mx-3"],
              [1, "btn", "remove", 3, "click"],
              [1, "btn", "my-0", 3, "click"],
              [1, "fa", "fa-trash", "text-danger"],
            ],
            template: function (n, i) {
              1 & n &&
                (w(0, "div")(1, "h2"),
                x(2, "Shopping Cart"),
                E(),
                w(3, "h5", 0),
                x(4),
                E(),
                k(5, I3, 22, 7, "div", 1),
                w(6, "button", 2),
                x(7, " Checkout "),
                E()()),
                2 & n &&
                  (S(4),
                  Qt(
                    "Price Total: ",
                    null == i.data ? null : i.data.totalCartPrice,
                    ""
                  ),
                  S(1),
                  T("ngForOf", i.data.products));
            },
            dependencies: [Rn, Pr, fE],
            styles: [
              ".add[_ngcontent-%COMP%]{border-radius:4px;border:1px solid green}.remove[_ngcontent-%COMP%]{border-radius:4px;border:1px solid red}.btn[_ngcontent-%COMP%]{font-weight:bolder}",
            ],
          })),
          t
        );
      })();
      const A3 = function (e) {
        return ["/categorydetails", e];
      };
      function N3(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 2)(1, "div"),
            q(2, "img", 3),
            w(3, "h4"),
            x(4),
            E()()()),
          2 & e)
        ) {
          const r = t.$implicit;
          S(2),
            T("src", r.image, Wn)("routerLink", yr(3, A3, r._id)),
            S(2),
            Vt(r.name);
        }
      }
      let R3 = (() => {
        var e;
        class t {
          constructor(n) {
            this._ProductsService = n;
          }
          ngOnInit() {
            this._ProductsService.getCategories().subscribe((n) => {
              console.log(n), (this.categories = n.data);
            });
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(li));
          }),
          (e.ɵcmp = Ue({
            type: e,
            selectors: [["app-categories"]],
            decls: 2,
            vars: 1,
            consts: [
              [1, "row", "gy-3", "mt-4"],
              ["class", "col-md-3", 4, "ngFor", "ngForOf"],
              [1, "col-md-3"],
              ["height", "400px", 1, "w-100", 3, "src", "routerLink"],
            ],
            template: function (n, i) {
              1 & n && (w(0, "div", 0), k(1, N3, 5, 5, "div", 1), E()),
                2 & n && (S(1), T("ngForOf", i.categories));
            },
            dependencies: [Rn, Pr],
          })),
          t
        );
      })();
      function P3(e, t) {
        if (
          (1 & e && (w(0, "div", 2)(1, "div"), q(2, "img", 3), E()()), 2 & e)
        ) {
          const r = t.$implicit;
          S(2), T("src", r.image, Wn);
        }
      }
      let O3 = (() => {
          var e;
          class t {
            constructor(n) {
              this._ProductsService = n;
            }
            ngOnInit() {
              this._ProductsService.getBrands().subscribe((n) => {
                console.log(n), (this.brands = n.data);
              });
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(_(li));
            }),
            (e.ɵcmp = Ue({
              type: e,
              selectors: [["app-brands"]],
              decls: 2,
              vars: 1,
              consts: [
                [1, "row", "gy-3", "mt-4"],
                ["class", "col-md-3", 4, "ngFor", "ngForOf"],
                [1, "col-md-3"],
                ["height", "200px", 1, "w-100", 3, "src"],
              ],
              template: function (n, i) {
                1 & n && (w(0, "div", 0), k(1, P3, 3, 1, "div", 1), E()),
                  2 & n && (S(1), T("ngForOf", i.brands));
              },
              dependencies: [Rn],
            })),
            t
          );
        })(),
        x3 = (() => {
          var e;
          class t {}
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Ue({
              type: e,
              selectors: [["app-notfound"]],
              decls: 2,
              vars: 0,
              consts: [
                [1, "container"],
                [
                  "src",
                  "assets/images/error.svg",
                  "alt",
                  "",
                  1,
                  "d-block",
                  "w-100",
                ],
              ],
              template: function (n, i) {
                1 & n && (w(0, "div", 0), q(1, "img", 1), E());
              },
              styles: [
                "img[_ngcontent-%COMP%]{max-width:700px;margin:2rem auto}",
              ],
            })),
            t
          );
        })();
      function wg(e) {
        this.message = e;
      }
      (wg.prototype = new Error()).name = "InvalidCharacterError";
      var cM =
        (typeof window < "u" && window.atob && window.atob.bind(window)) ||
        function (e) {
          var t = String(e).replace(/=+$/, "");
          if (t.length % 4 == 1)
            throw new wg(
              "'atob' failed: The string to be decoded is not correctly encoded."
            );
          for (
            var r, n, i = 0, s = 0, o = "";
            (n = t.charAt(s++));
            ~n && ((r = i % 4 ? 64 * r + n : n), i++ % 4)
              ? (o += String.fromCharCode(255 & (r >> ((-2 * i) & 6))))
              : 0
          )
            n =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(
                n
              );
          return o;
        };
      function uc(e) {
        this.message = e;
      }
      (uc.prototype = new Error()).name = "InvalidTokenError";
      let Eg = (() => {
        var e;
        class t {
          constructor(n) {
            (this._HttpClient = n),
              (this.userData = new st(null)),
              null !== localStorage.getItem("userToken") && this.decode();
          }
          decode() {
            const i = (function k3(e, t) {
              if ("string" != typeof e) throw new uc("Invalid token specified");
              var r = !0 === (t = t || {}).header ? 0 : 1;
              try {
                return JSON.parse(
                  (function F3(e) {
                    var t = e.replace(/-/g, "+").replace(/_/g, "/");
                    switch (t.length % 4) {
                      case 0:
                        break;
                      case 2:
                        t += "==";
                        break;
                      case 3:
                        t += "=";
                        break;
                      default:
                        throw "Illegal base64url string!";
                    }
                    try {
                      return decodeURIComponent(
                        cM(t).replace(/(.)/g, function (n, i) {
                          var s = i.charCodeAt(0).toString(16).toUpperCase();
                          return s.length < 2 && (s = "0" + s), "%" + s;
                        })
                      );
                    } catch {
                      return cM(t);
                    }
                  })(e.split(".")[r])
                );
              } catch (n) {
                throw new uc("Invalid token specified: " + n.message);
              }
            })(JSON.stringify(localStorage.getItem("userToken")));
            console.log(i), this.userData.next(i);
          }
          register(n) {
            return this._HttpClient.post(
              "https://ecommerce.routemisr.com/api/v1/auth/signup",
              n
            );
          }
          login(n) {
            return this._HttpClient.post(
              "https://ecommerce.routemisr.com/api/v1/auth/signin",
              n
            );
          }
          logout() {
            this.userData.next(null);
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(M(cu));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function V3(e, t) {
        if ((1 & e && (w(0, "div", 17)(1, "p", 18), x(2), E()()), 2 & e)) {
          const r = he();
          S(2), Vt(r.apiError);
        }
      }
      function j3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Name min length is 3"), E());
      }
      function $3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Name is required"), E());
      }
      function B3(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 19),
            k(1, j3, 2, 0, "p", 20),
            k(2, $3, 2, 0, "p", 20),
            E()),
          2 & e)
        ) {
          const r = he();
          let n, i;
          S(1),
            T(
              "ngIf",
              null == (n = r.registerForm.get("name"))
                ? null
                : n.getError("minlength")
            ),
            S(1),
            T(
              "ngIf",
              null == (i = r.registerForm.get("name"))
                ? null
                : i.getError("required")
            );
        }
      }
      function H3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Please Enter a valid email"), E());
      }
      function U3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Email is required"), E());
      }
      function z3(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 19),
            k(1, H3, 2, 0, "p", 20),
            k(2, U3, 2, 0, "p", 20),
            E()),
          2 & e)
        ) {
          const r = he();
          let n, i;
          S(1),
            T(
              "ngIf",
              null == (n = r.registerForm.get("email"))
                ? null
                : n.getError("email")
            ),
            S(1),
            T(
              "ngIf",
              null == (i = r.registerForm.get("email"))
                ? null
                : i.getError("required")
            );
        }
      }
      function q3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Passwrod min length is 8"), E());
      }
      function G3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Password is required"), E());
      }
      function W3(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 19),
            k(1, q3, 2, 0, "p", 20),
            k(2, G3, 2, 0, "p", 20),
            E()),
          2 & e)
        ) {
          const r = he();
          let n, i;
          S(1),
            T(
              "ngIf",
              null == (n = r.registerForm.get("password"))
                ? null
                : n.getError("minlength")
            ),
            S(1),
            T(
              "ngIf",
              null == (i = r.registerForm.get("password"))
                ? null
                : i.getError("required")
            );
        }
      }
      function Q3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Passwrod min length is 8"), E());
      }
      function K3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Password is required"), E());
      }
      function Z3(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 19),
            k(1, Q3, 2, 0, "p", 20),
            k(2, K3, 2, 0, "p", 20),
            E()),
          2 & e)
        ) {
          const r = he();
          let n, i;
          S(1),
            T(
              "ngIf",
              null == (n = r.registerForm.get("rePassword"))
                ? null
                : n.getError("minlength")
            ),
            S(1),
            T(
              "ngIf",
              null == (i = r.registerForm.get("rePassword"))
                ? null
                : i.getError("required")
            );
        }
      }
      function Y3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Must be an egyptian number"), E());
      }
      function X3(e, t) {
        1 & e && (w(0, "p", 18), x(1, "Phone is required"), E());
      }
      function J3(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 19),
            k(1, Y3, 2, 0, "p", 20),
            k(2, X3, 2, 0, "p", 20),
            E()),
          2 & e)
        ) {
          const r = he();
          let n, i;
          S(1),
            T(
              "ngIf",
              null == (n = r.registerForm.get("phone"))
                ? null
                : n.getError("pattern")
            ),
            S(1),
            T(
              "ngIf",
              null == (i = r.registerForm.get("phone"))
                ? null
                : i.getError("required")
            );
        }
      }
      function ez(e, t) {
        1 & e && q(0, "i", 21);
      }
      function tz(e, t) {
        1 & e && (w(0, "span"), x(1, "Register"), E());
      }
      let nz = (() => {
        var e;
        class t {
          constructor(n, i) {
            (this._Auth = n),
              (this._Router = i),
              (this.loading = !1),
              (this.apiError = ""),
              (this.registerForm = new hs({
                name: new Yt("", [It.minLength(3), It.required]),
                email: new Yt("", [It.email, It.required]),
                password: new Yt("", [It.minLength(8), It.required]),
                rePassword: new Yt("", [It.minLength(8), It.required]),
                phone: new Yt("", [
                  It.pattern(/^01[0125][0-9]{8}/),
                  It.required,
                ]),
              }));
          }
          register(n) {
            (this.loading = !0),
              n.valid &&
                this._Auth.register(n.value).subscribe({
                  next: (i) => {
                    (this.loading = !1),
                      "success" == i.message &&
                        this._Router.navigate(["login"]);
                  },
                  error: (i) => {
                    console.log(i),
                      (this.apiError = i.error.message),
                      (this.loading = !1);
                  },
                });
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(Eg), _(Ze));
          }),
          (e.ɵcmp = Ue({
            type: e,
            selectors: [["app-register"]],
            decls: 27,
            vars: 10,
            consts: [
              [3, "formGroup", "ngSubmit"],
              [1, "my-4"],
              ["class", "alert alert-danger my-4", 4, "ngIf"],
              ["for", "name"],
              [
                "type",
                "text",
                "name",
                "naem",
                "id",
                "name",
                "formControlName",
                "name",
                1,
                "form-control",
              ],
              ["class", "alert alert-danger my-3", 4, "ngIf"],
              ["for", ""],
              [
                "type",
                "email",
                "name",
                "email",
                "id",
                "email",
                "formControlName",
                "email",
                1,
                "form-control",
              ],
              ["for", "password"],
              [
                "type",
                "password",
                "name",
                "password",
                "id",
                "password",
                "formControlName",
                "password",
                1,
                "form-control",
              ],
              ["for", "rePassword"],
              [
                "type",
                "password",
                "name",
                "rePassword",
                "id",
                "rePassword",
                "formControlName",
                "rePassword",
                1,
                "form-control",
              ],
              ["for", "phone"],
              [
                "type",
                "tel",
                "name",
                "phone",
                "id",
                "phone",
                "formControlName",
                "phone",
                1,
                "form-control",
              ],
              [
                "type",
                "submit",
                1,
                "btn",
                "btn-success",
                "d-block",
                "ms-auto",
                "mt-3",
                3,
                "disabled",
              ],
              ["class", "fas fa-spinner fa-spin", 4, "ngIf"],
              [4, "ngIf"],
              [1, "alert", "alert-danger", "my-4"],
              [1, "m-0"],
              [1, "alert", "alert-danger", "my-3"],
              ["class", "m-0", 4, "ngIf"],
              [1, "fas", "fa-spinner", "fa-spin"],
            ],
            template: function (n, i) {
              if (
                (1 & n &&
                  (w(0, "form", 0),
                  ce("ngSubmit", function () {
                    return i.register(i.registerForm);
                  }),
                  w(1, "h3", 1),
                  x(2, "Register Now"),
                  E(),
                  k(3, V3, 3, 1, "div", 2),
                  w(4, "label", 3),
                  x(5, "Name"),
                  E(),
                  q(6, "input", 4),
                  k(7, B3, 3, 2, "div", 5),
                  w(8, "label", 6),
                  x(9, "Email"),
                  E(),
                  q(10, "input", 7),
                  k(11, z3, 3, 2, "div", 5),
                  w(12, "label", 8),
                  x(13, "Password"),
                  E(),
                  q(14, "input", 9),
                  k(15, W3, 3, 2, "div", 5),
                  w(16, "label", 10),
                  x(17, "Re-enter Password"),
                  E(),
                  q(18, "input", 11),
                  k(19, Z3, 3, 2, "div", 5),
                  w(20, "label", 12),
                  x(21, "Phone"),
                  E(),
                  q(22, "input", 13),
                  k(23, J3, 3, 2, "div", 5),
                  w(24, "button", 14),
                  k(25, ez, 1, 0, "i", 15),
                  k(26, tz, 2, 0, "span", 16),
                  E()()),
                2 & n)
              ) {
                let s, o, a, l, u;
                T("formGroup", i.registerForm),
                  S(3),
                  T("ngIf", i.apiError),
                  S(4),
                  T(
                    "ngIf",
                    (null == (s = i.registerForm.get("name"))
                      ? null
                      : s.errors) &&
                      (null == (s = i.registerForm.get("name"))
                        ? null
                        : s.touched)
                  ),
                  S(4),
                  T(
                    "ngIf",
                    (null == (o = i.registerForm.get("email"))
                      ? null
                      : o.errors) &&
                      (null == (o = i.registerForm.get("email"))
                        ? null
                        : o.touched)
                  ),
                  S(4),
                  T(
                    "ngIf",
                    (null == (a = i.registerForm.get("password"))
                      ? null
                      : a.errors) &&
                      (null == (a = i.registerForm.get("password"))
                        ? null
                        : a.touched)
                  ),
                  S(4),
                  T(
                    "ngIf",
                    (null == (l = i.registerForm.get("rePassword"))
                      ? null
                      : l.errors) &&
                      (null == (l = i.registerForm.get("rePassword"))
                        ? null
                        : l.touched)
                  ),
                  S(4),
                  T(
                    "ngIf",
                    (null == (u = i.registerForm.get("phone"))
                      ? null
                      : u.errors) &&
                      (null == (u = i.registerForm.get("phone"))
                        ? null
                        : u.touched)
                  ),
                  S(1),
                  T("disabled", i.registerForm.invalid),
                  S(1),
                  T("ngIf", i.loading),
                  S(1),
                  T("ngIf", !i.loading);
              }
            },
            dependencies: [Cr, bu, ds, pu, gu, gs, $o],
          })),
          t
        );
      })();
      function rz(e, t) {
        if ((1 & e && (w(0, "div", 11)(1, "p", 12), x(2), E()()), 2 & e)) {
          const r = he();
          S(2), Vt(r.apiError);
        }
      }
      function iz(e, t) {
        1 & e && (w(0, "p", 12), x(1, "Please Enter a valid email"), E());
      }
      function sz(e, t) {
        1 & e && (w(0, "p", 12), x(1, "Email is required"), E());
      }
      function oz(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 13),
            k(1, iz, 2, 0, "p", 14),
            k(2, sz, 2, 0, "p", 14),
            E()),
          2 & e)
        ) {
          const r = he();
          let n, i;
          S(1),
            T(
              "ngIf",
              null == (n = r.loginForm.get("email"))
                ? null
                : n.getError("email")
            ),
            S(1),
            T(
              "ngIf",
              null == (i = r.loginForm.get("email"))
                ? null
                : i.getError("required")
            );
        }
      }
      function az(e, t) {
        1 & e && (w(0, "p", 12), x(1, "Passwrod min length is 8"), E());
      }
      function lz(e, t) {
        1 & e && (w(0, "p", 12), x(1, "Password is required"), E());
      }
      function uz(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 13),
            k(1, az, 2, 0, "p", 14),
            k(2, lz, 2, 0, "p", 14),
            E()),
          2 & e)
        ) {
          const r = he();
          let n, i;
          S(1),
            T(
              "ngIf",
              null == (n = r.loginForm.get("password"))
                ? null
                : n.getError("minlength")
            ),
            S(1),
            T(
              "ngIf",
              null == (i = r.loginForm.get("password"))
                ? null
                : i.getError("required")
            );
        }
      }
      function cz(e, t) {
        1 & e && q(0, "i", 15);
      }
      function dz(e, t) {
        1 & e && (w(0, "span"), x(1, "Log In"), E());
      }
      let fz = (() => {
        var e;
        class t {
          constructor(n, i) {
            (this._Auth = n),
              (this._Router = i),
              (this.loading = !1),
              (this.apiError = ""),
              (this.loginForm = new hs({
                email: new Yt("", [It.email, It.required]),
                password: new Yt("", [It.minLength(8), It.required]),
              }));
          }
          login(n) {
            (this.loading = !0),
              n.valid &&
                this._Auth.login(n.value).subscribe({
                  next: (i) => {
                    (this.loading = !1),
                      "success" == i.message &&
                        (localStorage.setItem("userToken", i.token),
                        this._Auth.decode(),
                        this._Router.navigate(["/home"]));
                  },
                  error: (i) => {
                    console.log(i),
                      (this.apiError = i.error.message),
                      (this.loading = !1);
                  },
                });
          }
        }
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)(_(Eg), _(Ze));
          }),
          (e.ɵcmp = Ue({
            type: e,
            selectors: [["app-login"]],
            decls: 15,
            vars: 7,
            consts: [
              [3, "formGroup", "ngSubmit"],
              [1, "my-4"],
              ["class", "alert alert-danger my-4", 4, "ngIf"],
              ["for", ""],
              [
                "type",
                "email",
                "name",
                "email",
                "id",
                "email",
                "formControlName",
                "email",
                1,
                "form-control",
              ],
              ["class", "alert alert-danger my-3", 4, "ngIf"],
              ["for", "password"],
              [
                "type",
                "password",
                "name",
                "password",
                "id",
                "password",
                "formControlName",
                "password",
                1,
                "form-control",
              ],
              [
                "type",
                "submit",
                1,
                "btn",
                "btn-success",
                "d-block",
                "ms-auto",
                "mt-3",
                3,
                "disabled",
              ],
              ["class", "fas fa-spinner fa-spin", 4, "ngIf"],
              [4, "ngIf"],
              [1, "alert", "alert-danger", "my-4"],
              [1, "m-0"],
              [1, "alert", "alert-danger", "my-3"],
              ["class", "m-0", 4, "ngIf"],
              [1, "fas", "fa-spinner", "fa-spin"],
            ],
            template: function (n, i) {
              if (
                (1 & n &&
                  (w(0, "form", 0),
                  ce("ngSubmit", function () {
                    return i.login(i.loginForm);
                  }),
                  w(1, "h3", 1),
                  x(2, "Register Now"),
                  E(),
                  k(3, rz, 3, 1, "div", 2),
                  w(4, "label", 3),
                  x(5, "Email"),
                  E(),
                  q(6, "input", 4),
                  k(7, oz, 3, 2, "div", 5),
                  w(8, "label", 6),
                  x(9, "Password"),
                  E(),
                  q(10, "input", 7),
                  k(11, uz, 3, 2, "div", 5),
                  w(12, "button", 8),
                  k(13, cz, 1, 0, "i", 9),
                  k(14, dz, 2, 0, "span", 10),
                  E()()),
                2 & n)
              ) {
                let s, o;
                T("formGroup", i.loginForm),
                  S(3),
                  T("ngIf", i.apiError),
                  S(4),
                  T(
                    "ngIf",
                    (null == (s = i.loginForm.get("email"))
                      ? null
                      : s.errors) &&
                      (null == (s = i.loginForm.get("email"))
                        ? null
                        : s.touched)
                  ),
                  S(4),
                  T(
                    "ngIf",
                    (null == (o = i.loginForm.get("password"))
                      ? null
                      : o.errors) &&
                      (null == (o = i.loginForm.get("password"))
                        ? null
                        : o.touched)
                  ),
                  S(1),
                  T("disabled", i.loginForm.invalid),
                  S(1),
                  T("ngIf", i.loading),
                  S(1),
                  T("ngIf", !i.loading);
              }
            },
            dependencies: [Cr, bu, ds, pu, gu, gs, $o],
          })),
          t
        );
      })();
      const Or = (e, t, r = new Ze()) =>
        null !== localStorage.getItem("userToken") ||
        (r.navigate(["/login"]), !1);
      function hz(e, t) {
        1 & e && q(0, "img", 10), 2 & e && T("src", he().$implicit, Wn);
      }
      function pz(e, t) {
        if (
          (1 & e && (qr(0, 8), k(1, hz, 1, 1, "ng-template", 9), Gr()), 2 & e)
        ) {
          const r = t.$implicit;
          S(1), T("id", r);
        }
      }
      const gz = [
        { path: "", redirectTo: "home", pathMatch: "full" },
        { path: "home", canActivate: [Or], component: C3 },
        { path: "products", canActivate: [Or], component: M3 },
        { path: "cart", canActivate: [Or], component: T3 },
        { path: "categories", canActivate: [Or], component: R3 },
        { path: "brands", canActivate: [Or], component: O3 },
        {
          path: "productdetails/:id",
          canActivate: [Or],
          component: (() => {
            var e;
            class t {
              constructor(n, i, s) {
                (this._ActivatedRoute = n),
                  (this._ProductsService = i),
                  (this._cart = s),
                  (this.id = ""),
                  (this.data = null),
                  (this.customOptions = {
                    loop: !0,
                    mouseDrag: !0,
                    touchDrag: !0,
                    pullDrag: !1,
                    dots: !1,
                    navSpeed: 700,
                    navText: ["", ""],
                    responsive: { 0: { items: 1 } },
                    nav: !0,
                  });
              }
              ngOnInit() {
                this._ActivatedRoute.paramMap.subscribe((n) => {
                  this.id = n.get("id");
                }),
                  this._ProductsService.getProduct(this.id).subscribe({
                    next: (n) => {
                      console.log(n.data), (this.data = n.data);
                    },
                  });
              }
              addToCart(n) {
                this._cart.addToCart(n).subscribe({
                  next: (i) => {
                    console.log(i),
                      this._cart.numOfItems.next(i.numOfCartItems);
                  },
                  error: (i) => {
                    console.log(i);
                  },
                });
              }
            }
            return (
              ((e = t).ɵfac = function (n) {
                return new (n || e)(_(rr), _(li), _(ui));
              }),
              (e.ɵcmp = Ue({
                type: e,
                selectors: [["app-productdetails"]],
                decls: 18,
                vars: 6,
                consts: [
                  [1, "row", "align-items-center", "mt-4"],
                  [1, "col-md-4"],
                  [3, "options"],
                  ["s", "", 4, "ngFor", "ngForOf"],
                  [1, "col-md-8"],
                  [1, "text-muted"],
                  [1, "fa-solid", "fa-star", "gold"],
                  [1, "btn", "btn-success", "text-white", 3, "click"],
                  ["s", ""],
                  ["carouselSlide", "", 3, "id"],
                  [1, "w-100", 3, "src"],
                ],
                template: function (n, i) {
                  1 & n &&
                    (w(0, "div", 0)(1, "div", 1)(2, "div")(
                      3,
                      "owl-carousel-o",
                      2
                    ),
                    k(4, pz, 2, 1, "ng-container", 3),
                    E()()(),
                    w(5, "div", 4)(6, "div")(7, "h2"),
                    x(8),
                    E(),
                    w(9, "p"),
                    x(10),
                    E(),
                    w(11, "p", 5),
                    x(12),
                    E(),
                    w(13, "p", 5),
                    q(14, "i", 6),
                    x(15),
                    E(),
                    w(16, "button", 7),
                    ce("click", function () {
                      return i.addToCart(null == i.data ? null : i.data._id);
                    }),
                    x(17, " + Add "),
                    E()()()()),
                    2 & n &&
                      (S(3),
                      T("options", i.customOptions),
                      S(1),
                      T("ngForOf", null == i.data ? null : i.data.images),
                      S(4),
                      Vt(null == i.data ? null : i.data.title),
                      S(2),
                      Vt(null == i.data ? null : i.data.description),
                      S(2),
                      Qt("", null == i.data ? null : i.data.price, " EGP"),
                      S(3),
                      Qt(
                        " ",
                        null == i.data ? null : i.data.ratingsAverage,
                        " "
                      ));
                },
                dependencies: [Rn, Cg, lc],
              })),
              t
            );
          })(),
        },
        {
          path: "categorydetails/:id",
          canActivate: [Or],
          component: (() => {
            var e;
            class t {
              constructor(n, i, s) {
                (this._ProductsService = n),
                  (this._cart = i),
                  (this._ActivatedRoute = s),
                  (this.id = ""),
                  (this.data = null);
              }
              ngOnInit() {
                this._ActivatedRoute.paramMap.subscribe((n) => {
                  this.id = n.get("id");
                }),
                  this._ProductsService.getCategory(this.id).subscribe({
                    next: (n) => {
                      console.log(n.data), (this.data = n.data);
                    },
                  });
              }
            }
            return (
              ((e = t).ɵfac = function (n) {
                return new (n || e)(_(li), _(ui), _(rr));
              }),
              (e.ɵcmp = Ue({
                type: e,
                selectors: [["app-category-details"]],
                decls: 2,
                vars: 0,
                template: function (n, i) {
                  1 & n && (w(0, "p"), x(1, "category-details works!"), E());
                },
              })),
              t
            );
          })(),
        },
        {
          path: "shippingdetails",
          canActivate: [Or],
          component: (() => {
            var e;
            class t {
              constructor(n) {
                (this._cart = n),
                  (this.cartId = null),
                  (this.shippingForm = new hs({
                    details: new Yt(""),
                    phone: new Yt(null),
                    city: new Yt(""),
                  })),
                  n.cartId.subscribe((i) => {
                    this.cartId = i;
                  });
              }
              handleSubmit(n) {
                console.log(n),
                  this._cart
                    .onlinePayment(this.shippingForm.value, this.cartId)
                    .subscribe({
                      next: (i) => {
                        console.log(i), (window.location.href = i.session.url);
                      },
                      error: (i) => console.log(i),
                    });
              }
            }
            return (
              ((e = t).ɵfac = function (n) {
                return new (n || e)(_(ui));
              }),
              (e.ɵcmp = Ue({
                type: e,
                selectors: [["app-shipping-details"]],
                decls: 14,
                vars: 1,
                consts: [
                  [3, "formGroup", "submit"],
                  ["for", "details"],
                  [
                    "type",
                    "text",
                    "id",
                    "details",
                    "formControlName",
                    "details",
                    1,
                    "form-control",
                  ],
                  ["for", "phone"],
                  [
                    "type",
                    "tel",
                    "id",
                    "phone",
                    "formControlName",
                    "phone",
                    1,
                    "form-control",
                  ],
                  ["for", "city"],
                  [
                    "type",
                    "text",
                    "id",
                    "city",
                    "formControlName",
                    "city",
                    1,
                    "form-control",
                  ],
                  ["type", "submit", 1, "btn", "btn-success", "my-4"],
                  ["type", "submit", 1, "btn", "btn-success", "my-4", "mx-4"],
                ],
                template: function (n, i) {
                  1 & n &&
                    (w(0, "form", 0),
                    ce("submit", function () {
                      return i.handleSubmit(i.shippingForm);
                    }),
                    w(1, "label", 1),
                    x(2, "Enter your detailed address:"),
                    E(),
                    q(3, "input", 2),
                    w(4, "label", 3),
                    x(5, "Enter your phone number:"),
                    E(),
                    q(6, "input", 4),
                    w(7, "label", 5),
                    x(8, "Enter your detailed address:"),
                    E(),
                    q(9, "input", 6),
                    w(10, "button", 7),
                    x(11, "Pay Online"),
                    E(),
                    w(12, "button", 8),
                    x(13, "Pay Cash"),
                    E()()),
                    2 & n && T("formGroup", i.shippingForm);
                },
                dependencies: [bu, ds, pu, gu, gs, $o],
              })),
              t
            );
          })(),
        },
        { path: "register", component: nz },
        { path: "login", component: fz },
        { path: "**", component: x3 },
      ];
      let mz = (() => {
        var e;
        class t {}
        return (
          ((e = t).ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = Nt({ type: e })),
          (e.ɵinj = yt({ imports: [Z0.forRoot(gz, { useHash: !0 }), Z0] })),
          t
        );
      })();
      function vz(e, t) {
        1 & e && (w(0, "li", 10)(1, "a", 20), x(2, "Home"), E()());
      }
      function yz(e, t) {
        if (
          (1 & e &&
            (w(0, "li", 10)(1, "a", 21),
            x(2, "Cart "),
            w(3, "div", 22),
            x(4),
            E()()()),
          2 & e)
        ) {
          const r = he();
          S(4), Vt(r.numItems);
        }
      }
      function _z(e, t) {
        1 & e && (w(0, "li", 10)(1, "a", 23), x(2, "Products"), E()());
      }
      function Dz(e, t) {
        1 & e && (w(0, "li", 10)(1, "a", 24), x(2, "Categories"), E()());
      }
      function Cz(e, t) {
        1 & e && (w(0, "li", 10)(1, "a", 25), x(2, "Brands"), E()());
      }
      function wz(e, t) {
        1 & e && (w(0, "a", 26), x(1, "Register"), E());
      }
      function Ez(e, t) {
        1 & e && (w(0, "a", 27), x(1, "Login"), E());
      }
      function bz(e, t) {
        if (1 & e) {
          const r = mr();
          w(0, "li", 10)(1, "a", 28),
            ce("click", function () {
              return rn(r), sn(he().logout());
            }),
            x(2, "Logout"),
            E()();
        }
      }
      let Sz = (() => {
          var e;
          class t {
            constructor(n, i, s) {
              (this._auth = n),
                (this._Router = i),
                (this._cart = s),
                (this.numItems = 0),
                (this.loggedIn = !1);
            }
            ngOnInit() {
              this._auth.userData.subscribe({
                next: () => {
                  this.loggedIn = null !== this._auth.userData.getValue();
                },
              }),
                this._cart.numOfItems.subscribe((n) => (this.numItems = n));
            }
            logout() {
              this._auth.logout(),
                localStorage.removeItem("userToken"),
                this._Router.navigate(["/login"]);
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)(_(Eg), _(Ze), _(ui));
            }),
            (e.ɵcmp = Ue({
              type: e,
              selectors: [["app-navbar"]],
              decls: 37,
              vars: 8,
              consts: [
                [1, "navbar", "navbar-expand-lg", "bg-body-tertiary"],
                [1, "container"],
                ["routerLink", "home", 1, "navbar-brand"],
                [
                  "src",
                  "assets/images/freshcart-logo.svg",
                  "alt",
                  "",
                  1,
                  "d-block",
                  "w-100",
                ],
                [
                  "type",
                  "button",
                  "data-bs-toggle",
                  "collapse",
                  "data-bs-target",
                  "#navbarSupportedContent",
                  "aria-controls",
                  "navbarSupportedContent",
                  "aria-expanded",
                  "false",
                  "aria-label",
                  "Toggle navigation",
                  1,
                  "navbar-toggler",
                ],
                [1, "navbar-toggler-icon"],
                [
                  "id",
                  "navbarSupportedContent",
                  1,
                  "collapse",
                  "navbar-collapse",
                ],
                [1, "navbar-nav", "me-auto", "mb-2", "mb-lg-0"],
                ["class", "nav-item", 4, "ngIf"],
                ["g-4", "", 1, "navbar-nav", "ms-auto", "mb-2", "mb-lg-0"],
                [1, "nav-item"],
                [1, "nav-link"],
                [1, "fa-brands", "fa-facebook"],
                [1, "fa-brands", "fa-tiktok"],
                [1, "fa-brands", "fa-instagram"],
                [1, "fa-brands", "fa-twitter"],
                [1, "fa-brands", "fa-linkedin"],
                [1, "fa-brands", "fa-youtube"],
                ["routerLink", "register", "class", "nav-link", 4, "ngIf"],
                ["routerLink", "login", "class", "nav-link", 4, "ngIf"],
                [
                  "aria-current",
                  "page",
                  "routerLink",
                  "home",
                  "routerLinkActive",
                  "active",
                  1,
                  "nav-link",
                ],
                [
                  "aria-current",
                  "page",
                  "routerLink",
                  "cart",
                  "routerLinkActive",
                  "active",
                  1,
                  "nav-link",
                ],
                [1, "badge", "bg-success"],
                [
                  "aria-current",
                  "page",
                  "routerLink",
                  "products",
                  "routerLinkActive",
                  "active",
                  1,
                  "nav-link",
                ],
                [
                  "aria-current",
                  "page",
                  "routerLink",
                  "categories",
                  "routerLinkActive",
                  "active",
                  1,
                  "nav-link",
                ],
                [
                  "aria-current",
                  "page",
                  "routerLink",
                  "brands",
                  "routerLinkActive",
                  "active",
                  1,
                  "nav-link",
                ],
                ["routerLink", "register", 1, "nav-link"],
                ["routerLink", "login", 1, "nav-link"],
                [1, "nav-link", "pointer", 3, "click"],
              ],
              template: function (n, i) {
                1 & n &&
                  (w(0, "nav", 0)(1, "div", 1)(2, "a", 2),
                  q(3, "img", 3),
                  E(),
                  w(4, "button", 4),
                  q(5, "span", 5),
                  E(),
                  w(6, "div", 6)(7, "ul", 7),
                  k(8, vz, 3, 0, "li", 8),
                  k(9, yz, 5, 1, "li", 8),
                  k(10, _z, 3, 0, "li", 8),
                  k(11, Dz, 3, 0, "li", 8),
                  k(12, Cz, 3, 0, "li", 8),
                  E(),
                  w(13, "ul", 9)(14, "li", 10)(15, "a", 11),
                  q(16, "i", 12),
                  E()(),
                  w(17, "li", 10)(18, "a", 11),
                  q(19, "i", 13),
                  E()(),
                  w(20, "li", 10)(21, "a", 11),
                  q(22, "i", 14),
                  E()(),
                  w(23, "li", 10)(24, "a", 11),
                  q(25, "i", 15),
                  E()(),
                  w(26, "li", 10)(27, "a", 11),
                  q(28, "i", 16),
                  E()(),
                  w(29, "li", 10)(30, "a", 11),
                  q(31, "i", 17),
                  E()(),
                  w(32, "li", 10),
                  k(33, wz, 2, 0, "a", 18),
                  E(),
                  w(34, "li", 10),
                  k(35, Ez, 2, 0, "a", 19),
                  E(),
                  k(36, bz, 3, 0, "li", 8),
                  E()()()()),
                  2 & n &&
                    (S(8),
                    T("ngIf", i.loggedIn),
                    S(1),
                    T("ngIf", i.loggedIn),
                    S(1),
                    T("ngIf", i.loggedIn),
                    S(1),
                    T("ngIf", i.loggedIn),
                    S(1),
                    T("ngIf", i.loggedIn),
                    S(21),
                    T("ngIf", !i.loggedIn),
                    S(2),
                    T("ngIf", !i.loggedIn),
                    S(1),
                    T("ngIf", i.loggedIn));
              },
              dependencies: [Cr, Pr, H0],
            })),
            t
          );
        })(),
        Mz = (() => {
          var e;
          class t {
            constructor() {
              this.title = "route-ecomm";
            }
          }
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Ue({
              type: e,
              selectors: [["app-root"]],
              decls: 6,
              vars: 0,
              consts: [
                [1, "container"],
                [1, "fixed", "text-center"],
              ],
              template: function (n, i) {
                1 & n &&
                  (q(0, "app-navbar"),
                  w(1, "div", 0),
                  q(2, "router-outlet"),
                  E(),
                  w(3, "footer", 1)(4, "p"),
                  x(5, "This is the footer"),
                  E()());
              },
              dependencies: [sg, Sz],
              styles: [
                "a[_ngcontent-%COMP%]{all:unset;cursor:pointer}.container[_ngcontent-%COMP%]{min-height:90vh}footer[_ngcontent-%COMP%]{background-color:#eee;padding:2rem 4rem}footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}",
              ],
            })),
            t
          );
        })(),
        Iz = (() => {
          var e;
          class t {}
          return (
            ((e = t).ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Nt({ type: e, bootstrap: [Mz] })),
            (e.ɵinj = yt({ imports: [OE, mz, WV, J$, nj, c3] })),
            t
          );
        })();
      mV()
        .bootstrapModule(Iz)
        .catch((e) => console.error(e));
    },
  },
  (ee) => {
    ee((ee.s = 332));
  },
]);
