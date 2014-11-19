/* mimoza 0.3.0 https://github.com/nodeca/mimoza */!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.Mimoza=e():"undefined"!=typeof global?global.Mimoza=e():"undefined"!=typeof self&&(self.Mimoza=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


// mime files data
var rules = require('./rules');


// leaves only extension from the given string
//   normalize('foo/bar.js')  // -> '.js'
//   normalize('bar.js')      // -> '.js'
//   normalize('.js')         // -> '.js'
//   normalize('js')          // -> '.js'
function normalize(path) {
  // edge case: '/txt' & '\txt' are not resolveable
  if (/[\\/][^\\/.]+$/.test(path)) { return; }

  return '.' + path.replace(/.*[\.\/\\]/, '').toLowerCase();
}

// Remove charset/types/spaces, convenent for external data check
// " tExt/htMl ; charset=UTF-8 ; type=foo " -> "text/html"
function clearMime(mimeType) {
  if (!mimeType || (String(mimeType) !== mimeType)) { return undefined; }
  return mimeType.split(';')[0].trim().toLowerCase();
}


/**
 * class Mimoza
 **/

/**
 *  new Mimoza([options])
 *
 *  Initiates new instance of Mimoza.
 *
 *  ##### Options
 *
 *  - **defaultType** _(String):_ Default mime type used as last-resort
 *    for [[Mimoza#getMimeType]]. By default: `undefined`.
 *  - **preloaded** _(Boolean):_ Init instance with default mime rules
 **/
var Mimoza = module.exports = function Mimoza(options) {
  options = options || {};

  // Map of `extension -> mimeType` pairs.
  Object.defineProperty(this, 'types',          { value: Object.create(null) });

  // Map of `mimeType -> extensions` pairs.
  Object.defineProperty(this, 'extensions',     { value: Object.create(null) });

  // Map of `mimeType` -> true for compressible types
  Object.defineProperty(this, 'compressibles',  { value: Object.create(null) });

  // Used as last-resort for [[Mimoza#getMimeType]].
  Object.defineProperty(this, 'defaultType',    { value: options.defaultType });

  if (options.preloaded) {
    this.loadMimes(rules.mimeTypes);
    this.loadMimes(rules.nodeTypes);
    this.loadCompressibles(rules.compressibleTypes);
  }
};


/**
 *  Mimoza#define(map) -> Void
 *
 *  Batch version of [[Mimoza#register]].
 *
 *  ##### Example
 *
 *  ```javascript
 *  mime.define({
 *    'audio/ogg':  ['oga', 'ogg', 'spx'],
 *    'audio/webm': ['weba']
 *  });
 *
 *  // equals to:
 *
 *  mime.register('audio/ogg', ['oga', 'ogg', 'spx']);
 *  mime.register('audio/webm', ['weba']);
 *  ```
 **/
Mimoza.prototype.define = function define(map) {
  Object.getOwnPropertyNames(map).forEach(function (type) {
    this.register(type, map[type]);
  }, this);
};


/**
 *  Mimoza#register(mimeType, extensions[, overrideDefault = false]) -> Void
 *  - mimeType (String):
 *  - extensions (String|Array):
 *  - overrideDefault (Boolean):
 *
 *  Register given `extensions` as representatives of `mimeType` and register
 *  first element of `extensions` as default extension for the `mimeType`.
 *
 *
 *  ##### Example
 *
 *  ```javascript
 *  mime.register('audio/ogg', ['oga', 'ogg', 'spx']);
 *
 *  mime.getMimeType('.oga');       // -> 'audio/ogg'
 *  mime.getMimeType('.ogg');       // -> 'audio/ogg'
 *  mime.getExtension('audio/ogg'); // -> '.oga'
 *  ```
 *
 *  ##### Overriding default extension
 *
 *  `mimeType -> extension` is set only once, if you wnt to override it,
 *  pass `overrideDefault` flag as true. See example below:
 *
 *  ```javascript
 *  mime.register('audio/ogg', ['oga']);
 *  mime.getExtension('audio/ogg');
 *  // -> '.oga'
 *
 *  mime.register('audio/ogg', ['spx']);
 *  mime.getExtension('audio/ogg');
 *  // -> '.oga'
 *
 *  mime.register('audio/ogg', ['ogg'], true);
 *  mime.getExtension('audio/ogg');
 *  // -> '.ogg'
 *  ```
 **/
Mimoza.prototype.register = function register(mimeType, extensions, overrideDefault) {
  extensions = Array.isArray(extensions) ? extensions : [extensions];

  if (!mimeType || !extensions || 0 === extensions.length) {
    return;
  }

  // pollute `extension -> mimeType` map
  extensions.forEach(function (ext) {
    this.types[normalize(ext)] = mimeType;
  }, this);

  // use case insensitive mime types for extention resolve
  if (overrideDefault || undefined === this.extensions[mimeType.toLowerCase()]) {
    this.extensions[mimeType.toLowerCase()] = normalize(extensions[0]);
  }
};


/**
 *  Mimoza#loadMimes(rules) -> Void
 *
 *  Load multiline string containing Apache2-style ".types" file
 *
 *  This may be called multiple times (it's expected).
 *  Where files declare overlapping types/extensions, the last one wins.
 **/
Mimoza.prototype.loadMimes = function loadMimes(rules) {

  rules.split(/[\r\n]+/).forEach(function (line) {
    // TODO: fix this buggy RegExp as it produce lots of "empty" data
    // Clean up whitespace/comments, and split into fields
    var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);

    this.register(fields.shift(), fields);
  }, this);
};


/**
 *  Mimoza#loadCompressibles(rules) -> Void
 *
 *  Load multiline string containing Apache2-style ".types" file with list
 *  of compressible mimes. Currently only first element of each line is used.
 *
 *  This may be called multiple times (it's expected).
 *  Where files declare overlapping types/extensions, the last one wins.
 **/
Mimoza.prototype.loadCompressibles = function loadCompressibles(rules) {

  rules.split(/[\r\n]+/).forEach(function (line) {
    // TODO: fix this buggy RegExp as it produce lots of "empty" data
    // Clean up whitespace/comments, and split into fields
    var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);

    if (!fields[0]) { return; }
    this.compressibles[fields[0]] = true;
  }, this);
};


/**
 *  Mimoza#getMimeType(path[, fallback]) -> String
 *
 *  Lookup a mime type based on extension
 **/
Mimoza.prototype.getMimeType = function getMimeType(path, fallback) {
  return this.types[normalize(path)] || fallback || this.defaultType;
};


/**
 *  Mimoza#getExtension(mimeType) -> String
 *
 *  Return file extension associated with a mime type.
 **/
Mimoza.prototype.getExtension = function getExtension(mimeType) {
  return this.extensions[clearMime(mimeType)];
};


/**
 *  Mimoza#isCompressible(mimeType) -> Boolean
 *
 *  Check if mime type is compressible with gzip/deflate.
 **/
Mimoza.prototype.isCompressible = function isCompressible(mimeType) {
  return !!this.compressibles[clearMime(mimeType)];
};


// Returns whenever an asset is text or not
var TEXT_MIME_RE = new RegExp([
  '^text/',
  '/json$',
  '/javascript$'
].join('|'));

/**
 *  Mimoza#isText(mimeType) -> Boolean
 *
 *  Check if mime type provides text content. Can be used to add encoding.
 **/
Mimoza.prototype.isText = function isText(mimeType) {
  return TEXT_MIME_RE.test(clearMime(mimeType));
};


////////////////////////////////////////////////////////////////////////////////
//
// Public methods to work with module without creating new instance, if default
// configs are ok for you.
//


// builtin instance of mimoza
var builtin = new Mimoza({ preloaded: true });

/**
 *  Mimoza.getMimeType(path, fallback) -> String
 *
 *  Proxy to [[Mimoza#getMimeType]] of internal, built-in instance of [[Mimoza]]
 *  filled with some default types.
 **/
Mimoza.getMimeType = function _getMimeType(path, fallback) {
  return builtin.getMimeType(path, fallback);
};

/**
 *  Mimoza.getExtension(mimeType) -> String
 *
 *  Proxy to [[Mimoza#getExtension]] of internal, built-in instance of [[Mimoza]]
 *  filled with some default types.
 **/
Mimoza.getExtension = function _getExtension(mimeType) {
  return builtin.getExtension(mimeType);
};

/**
 *  Mimoza.isCompressible(mimeType) -> Boolean
 *
 *  Proxy to [[Mimoza#isCompressible]] of internal, built-in instance
 *  of [[Mimoza]] filled with some default types.
 **/
Mimoza.isCompressible = function _isCompressible(mimeType) {
  return builtin.isCompressible(mimeType);
};

/**
 *  Mimoza.isText(mimeType) -> Boolean
 *
 *  Proxy to [[Mimoza#isText]] of internal, built-in instance
 *  of [[Mimoza]].
 **/
Mimoza.isText = function _isCompressibleExtention(mimeType) {
  return builtin.isText(mimeType);
};

},{"./rules":2}],2:[function(require,module,exports){
// Mime rules data loader. Browser version
'use strict';


module.exports = require('../types/rules.json');
},{"../types/rules.json":3}],3:[function(require,module,exports){
module.exports={"mimeTypes":"application/andrew-inset ez\napplication/applixware aw\napplication/atom+xml atom\napplication/atomcat+xml atomcat\napplication/atomsvc+xml atomsvc\napplication/ccxml+xml ccxml\napplication/cdmi-capability cdmia\napplication/cdmi-container cdmic\napplication/cdmi-domain cdmid\napplication/cdmi-object cdmio\napplication/cdmi-queue cdmiq\napplication/cu-seeme cu\napplication/davmount+xml davmount\napplication/docbook+xml dbk\napplication/dssc+der dssc\napplication/dssc+xml xdssc\napplication/ecmascript ecma\napplication/emma+xml emma\napplication/epub+zip epub\napplication/exi exi\napplication/font-tdpfr pfr\napplication/gml+xml gml\napplication/gpx+xml gpx\napplication/gxf gxf\napplication/hyperstudio stk\napplication/inkml+xml ink inkml\napplication/ipfix ipfix\napplication/java-archive jar\napplication/java-serialized-object ser\napplication/java-vm class\napplication/javascript js\napplication/json json\napplication/jsonml+json jsonml\napplication/lost+xml lostxml\napplication/mac-binhex40 hqx\napplication/mac-compactpro cpt\napplication/mads+xml mads\napplication/marc mrc\napplication/marcxml+xml mrcx\napplication/mathematica ma nb mb\napplication/mathml+xml mathml\napplication/mbox mbox\napplication/mediaservercontrol+xml mscml\napplication/metalink+xml metalink\napplication/metalink4+xml meta4\napplication/mets+xml mets\napplication/mods+xml mods\napplication/mp21 m21 mp21\napplication/mp4 mp4s\napplication/msword doc dot\napplication/mxf mxf\napplication/octet-stream bin dms lrf mar so dist distz pkg bpk dump elc deploy\napplication/oda oda\napplication/oebps-package+xml opf\napplication/ogg ogx\napplication/omdoc+xml omdoc\napplication/onenote onetoc onetoc2 onetmp onepkg\napplication/oxps oxps\napplication/patch-ops-error+xml xer\napplication/pdf pdf\napplication/pgp-encrypted pgp\napplication/pgp-signature asc sig\napplication/pics-rules prf\napplication/pkcs10 p10\napplication/pkcs7-mime p7m p7c\napplication/pkcs7-signature p7s\napplication/pkcs8 p8\napplication/pkix-attr-cert ac\napplication/pkix-cert cer\napplication/pkix-crl crl\napplication/pkix-pkipath pkipath\napplication/pkixcmp pki\napplication/pls+xml pls\napplication/postscript ai eps ps\napplication/prs.cww cww\napplication/pskc+xml pskcxml\napplication/rdf+xml rdf\napplication/reginfo+xml rif\napplication/relax-ng-compact-syntax rnc\napplication/resource-lists+xml rl\napplication/resource-lists-diff+xml rld\napplication/rls-services+xml rs\napplication/rpki-ghostbusters gbr\napplication/rpki-manifest mft\napplication/rpki-roa roa\napplication/rsd+xml rsd\napplication/rss+xml rss\napplication/rtf rtf\napplication/sbml+xml sbml\napplication/scvp-cv-request scq\napplication/scvp-cv-response scs\napplication/scvp-vp-request spq\napplication/scvp-vp-response spp\napplication/sdp sdp\napplication/set-payment-initiation setpay\napplication/set-registration-initiation setreg\napplication/shf+xml shf\napplication/smil+xml smi smil\napplication/sparql-query rq\napplication/sparql-results+xml srx\napplication/srgs gram\napplication/srgs+xml grxml\napplication/sru+xml sru\napplication/ssdl+xml ssdl\napplication/ssml+xml ssml\napplication/tei+xml tei teicorpus\napplication/thraud+xml tfi\napplication/timestamped-data tsd\napplication/vnd.3gpp.pic-bw-large plb\napplication/vnd.3gpp.pic-bw-small psb\napplication/vnd.3gpp.pic-bw-var pvb\napplication/vnd.3gpp2.tcap tcap\napplication/vnd.3m.post-it-notes pwn\napplication/vnd.accpac.simply.aso aso\napplication/vnd.accpac.simply.imp imp\napplication/vnd.acucobol acu\napplication/vnd.acucorp atc acutc\napplication/vnd.adobe.air-application-installer-package+zip air\napplication/vnd.adobe.formscentral.fcdt fcdt\napplication/vnd.adobe.fxp fxp fxpl\napplication/vnd.adobe.xdp+xml xdp\napplication/vnd.adobe.xfdf xfdf\napplication/vnd.ahead.space ahead\napplication/vnd.airzip.filesecure.azf azf\napplication/vnd.airzip.filesecure.azs azs\napplication/vnd.amazon.ebook azw\napplication/vnd.americandynamics.acc acc\napplication/vnd.amiga.ami ami\napplication/vnd.android.package-archive apk\napplication/vnd.anser-web-certificate-issue-initiation cii\napplication/vnd.anser-web-funds-transfer-initiation fti\napplication/vnd.antix.game-component atx\napplication/vnd.apple.installer+xml mpkg\napplication/vnd.apple.mpegurl m3u8\napplication/vnd.aristanetworks.swi swi\napplication/vnd.astraea-software.iota iota\napplication/vnd.audiograph aep\napplication/vnd.blueice.multipass mpm\napplication/vnd.bmi bmi\napplication/vnd.businessobjects rep\napplication/vnd.chemdraw+xml cdxml\napplication/vnd.chipnuts.karaoke-mmd mmd\napplication/vnd.cinderella cdy\napplication/vnd.claymore cla\napplication/vnd.cloanto.rp9 rp9\napplication/vnd.clonk.c4group c4g c4d c4f c4p c4u\napplication/vnd.cluetrust.cartomobile-config c11amc\napplication/vnd.cluetrust.cartomobile-config-pkg c11amz\napplication/vnd.commonspace csp\napplication/vnd.contact.cmsg cdbcmsg\napplication/vnd.cosmocaller cmc\napplication/vnd.crick.clicker clkx\napplication/vnd.crick.clicker.keyboard clkk\napplication/vnd.crick.clicker.palette clkp\napplication/vnd.crick.clicker.template clkt\napplication/vnd.crick.clicker.wordbank clkw\napplication/vnd.criticaltools.wbs+xml wbs\napplication/vnd.ctc-posml pml\napplication/vnd.cups-ppd ppd\napplication/vnd.curl.car car\napplication/vnd.curl.pcurl pcurl\napplication/vnd.dart dart\napplication/vnd.data-vision.rdz rdz\napplication/vnd.dece.data uvf uvvf uvd uvvd\napplication/vnd.dece.ttml+xml uvt uvvt\napplication/vnd.dece.unspecified uvx uvvx\napplication/vnd.dece.zip uvz uvvz\napplication/vnd.denovo.fcselayout-link fe_launch\napplication/vnd.dna dna\napplication/vnd.dolby.mlp mlp\napplication/vnd.dpgraph dpg\napplication/vnd.dreamfactory dfac\napplication/vnd.ds-keypoint kpxx\napplication/vnd.dvb.ait ait\napplication/vnd.dvb.service svc\napplication/vnd.dynageo geo\napplication/vnd.ecowin.chart mag\napplication/vnd.enliven nml\napplication/vnd.epson.esf esf\napplication/vnd.epson.msf msf\napplication/vnd.epson.quickanime qam\napplication/vnd.epson.salt slt\napplication/vnd.epson.ssf ssf\napplication/vnd.eszigno3+xml es3 et3\napplication/vnd.ezpix-album ez2\napplication/vnd.ezpix-package ez3\napplication/vnd.fdf fdf\napplication/vnd.fdsn.mseed mseed\napplication/vnd.fdsn.seed seed dataless\napplication/vnd.flographit gph\napplication/vnd.fluxtime.clip ftc\napplication/vnd.framemaker fm frame maker book\napplication/vnd.frogans.fnc fnc\napplication/vnd.frogans.ltf ltf\napplication/vnd.fsc.weblaunch fsc\napplication/vnd.fujitsu.oasys oas\napplication/vnd.fujitsu.oasys2 oa2\napplication/vnd.fujitsu.oasys3 oa3\napplication/vnd.fujitsu.oasysgp fg5\napplication/vnd.fujitsu.oasysprs bh2\napplication/vnd.fujixerox.ddd ddd\napplication/vnd.fujixerox.docuworks xdw\napplication/vnd.fujixerox.docuworks.binder xbd\napplication/vnd.fuzzysheet fzs\napplication/vnd.genomatix.tuxedo txd\napplication/vnd.geogebra.file ggb\napplication/vnd.geogebra.tool ggt\napplication/vnd.geometry-explorer gex gre\napplication/vnd.geonext gxt\napplication/vnd.geoplan g2w\napplication/vnd.geospace g3w\napplication/vnd.gmx gmx\napplication/vnd.google-earth.kml+xml kml\napplication/vnd.google-earth.kmz kmz\napplication/vnd.grafeq gqf gqs\napplication/vnd.groove-account gac\napplication/vnd.groove-help ghf\napplication/vnd.groove-identity-message gim\napplication/vnd.groove-injector grv\napplication/vnd.groove-tool-message gtm\napplication/vnd.groove-tool-template tpl\napplication/vnd.groove-vcard vcg\napplication/vnd.hal+xml hal\napplication/vnd.handheld-entertainment+xml zmm\napplication/vnd.hbci hbci\napplication/vnd.hhe.lesson-player les\napplication/vnd.hp-hpgl hpgl\napplication/vnd.hp-hpid hpid\napplication/vnd.hp-hps hps\napplication/vnd.hp-jlyt jlt\napplication/vnd.hp-pcl pcl\napplication/vnd.hp-pclxl pclxl\napplication/vnd.hydrostatix.sof-data sfd-hdstx\napplication/vnd.ibm.minipay mpy\napplication/vnd.ibm.modcap afp listafp list3820\napplication/vnd.ibm.rights-management irm\napplication/vnd.ibm.secure-container sc\napplication/vnd.iccprofile icc icm\napplication/vnd.igloader igl\napplication/vnd.immervision-ivp ivp\napplication/vnd.immervision-ivu ivu\napplication/vnd.insors.igm igm\napplication/vnd.intercon.formnet xpw xpx\napplication/vnd.intergeo i2g\napplication/vnd.intu.qbo qbo\napplication/vnd.intu.qfx qfx\napplication/vnd.ipunplugged.rcprofile rcprofile\napplication/vnd.irepository.package+xml irp\napplication/vnd.is-xpr xpr\napplication/vnd.isac.fcs fcs\napplication/vnd.jam jam\napplication/vnd.jcp.javame.midlet-rms rms\napplication/vnd.jisp jisp\napplication/vnd.joost.joda-archive joda\napplication/vnd.kahootz ktz ktr\napplication/vnd.kde.karbon karbon\napplication/vnd.kde.kchart chrt\napplication/vnd.kde.kformula kfo\napplication/vnd.kde.kivio flw\napplication/vnd.kde.kontour kon\napplication/vnd.kde.kpresenter kpr kpt\napplication/vnd.kde.kspread ksp\napplication/vnd.kde.kword kwd kwt\napplication/vnd.kenameaapp htke\napplication/vnd.kidspiration kia\napplication/vnd.kinar kne knp\napplication/vnd.koan skp skd skt skm\napplication/vnd.kodak-descriptor sse\napplication/vnd.las.las+xml lasxml\napplication/vnd.llamagraphics.life-balance.desktop lbd\napplication/vnd.llamagraphics.life-balance.exchange+xml lbe\napplication/vnd.lotus-1-2-3 123\napplication/vnd.lotus-approach apr\napplication/vnd.lotus-freelance pre\napplication/vnd.lotus-notes nsf\napplication/vnd.lotus-organizer org\napplication/vnd.lotus-screencam scm\napplication/vnd.lotus-wordpro lwp\napplication/vnd.macports.portpkg portpkg\napplication/vnd.mcd mcd\napplication/vnd.medcalcdata mc1\napplication/vnd.mediastation.cdkey cdkey\napplication/vnd.mfer mwf\napplication/vnd.mfmp mfm\napplication/vnd.micrografx.flo flo\napplication/vnd.micrografx.igx igx\napplication/vnd.mif mif\napplication/vnd.mobius.daf daf\napplication/vnd.mobius.dis dis\napplication/vnd.mobius.mbk mbk\napplication/vnd.mobius.mqy mqy\napplication/vnd.mobius.msl msl\napplication/vnd.mobius.plc plc\napplication/vnd.mobius.txf txf\napplication/vnd.mophun.application mpn\napplication/vnd.mophun.certificate mpc\napplication/vnd.mozilla.xul+xml xul\napplication/vnd.ms-artgalry cil\napplication/vnd.ms-cab-compressed cab\napplication/vnd.ms-excel xls xlm xla xlc xlt xlw\napplication/vnd.ms-excel.addin.macroenabled.12 xlam\napplication/vnd.ms-excel.sheet.binary.macroenabled.12 xlsb\napplication/vnd.ms-excel.sheet.macroenabled.12 xlsm\napplication/vnd.ms-excel.template.macroenabled.12 xltm\napplication/vnd.ms-fontobject eot\napplication/vnd.ms-htmlhelp chm\napplication/vnd.ms-ims ims\napplication/vnd.ms-lrm lrm\napplication/vnd.ms-officetheme thmx\napplication/vnd.ms-pki.seccat cat\napplication/vnd.ms-pki.stl stl\napplication/vnd.ms-powerpoint ppt pps pot\napplication/vnd.ms-powerpoint.addin.macroenabled.12 ppam\napplication/vnd.ms-powerpoint.presentation.macroenabled.12 pptm\napplication/vnd.ms-powerpoint.slide.macroenabled.12 sldm\napplication/vnd.ms-powerpoint.slideshow.macroenabled.12 ppsm\napplication/vnd.ms-powerpoint.template.macroenabled.12 potm\napplication/vnd.ms-project mpp mpt\napplication/vnd.ms-word.document.macroenabled.12 docm\napplication/vnd.ms-word.template.macroenabled.12 dotm\napplication/vnd.ms-works wps wks wcm wdb\napplication/vnd.ms-wpl wpl\napplication/vnd.ms-xpsdocument xps\napplication/vnd.mseq mseq\napplication/vnd.musician mus\napplication/vnd.muvee.style msty\napplication/vnd.mynfc taglet\napplication/vnd.neurolanguage.nlu nlu\napplication/vnd.nitf ntf nitf\napplication/vnd.noblenet-directory nnd\napplication/vnd.noblenet-sealer nns\napplication/vnd.noblenet-web nnw\napplication/vnd.nokia.n-gage.data ngdat\napplication/vnd.nokia.n-gage.symbian.install n-gage\napplication/vnd.nokia.radio-preset rpst\napplication/vnd.nokia.radio-presets rpss\napplication/vnd.novadigm.edm edm\napplication/vnd.novadigm.edx edx\napplication/vnd.novadigm.ext ext\napplication/vnd.oasis.opendocument.chart odc\napplication/vnd.oasis.opendocument.chart-template otc\napplication/vnd.oasis.opendocument.database odb\napplication/vnd.oasis.opendocument.formula odf\napplication/vnd.oasis.opendocument.formula-template odft\napplication/vnd.oasis.opendocument.graphics odg\napplication/vnd.oasis.opendocument.graphics-template otg\napplication/vnd.oasis.opendocument.image odi\napplication/vnd.oasis.opendocument.image-template oti\napplication/vnd.oasis.opendocument.presentation odp\napplication/vnd.oasis.opendocument.presentation-template otp\napplication/vnd.oasis.opendocument.spreadsheet ods\napplication/vnd.oasis.opendocument.spreadsheet-template ots\napplication/vnd.oasis.opendocument.text odt\napplication/vnd.oasis.opendocument.text-master odm\napplication/vnd.oasis.opendocument.text-template ott\napplication/vnd.oasis.opendocument.text-web oth\napplication/vnd.olpc-sugar xo\napplication/vnd.oma.dd2+xml dd2\napplication/vnd.openofficeorg.extension oxt\napplication/vnd.openxmlformats-officedocument.presentationml.presentation pptx\napplication/vnd.openxmlformats-officedocument.presentationml.slide sldx\napplication/vnd.openxmlformats-officedocument.presentationml.slideshow ppsx\napplication/vnd.openxmlformats-officedocument.presentationml.template potx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet xlsx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.template xltx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.document docx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.template dotx\napplication/vnd.osgeo.mapguide.package mgp\napplication/vnd.osgi.dp dp\napplication/vnd.osgi.subsystem esa\napplication/vnd.palm pdb pqa oprc\napplication/vnd.pawaafile paw\napplication/vnd.pg.format str\napplication/vnd.pg.osasli ei6\napplication/vnd.picsel efif\napplication/vnd.pmi.widget wg\napplication/vnd.pocketlearn plf\napplication/vnd.powerbuilder6 pbd\napplication/vnd.previewsystems.box box\napplication/vnd.proteus.magazine mgz\napplication/vnd.publishare-delta-tree qps\napplication/vnd.pvi.ptid1 ptid\napplication/vnd.quark.quarkxpress qxd qxt qwd qwt qxl qxb\napplication/vnd.realvnc.bed bed\napplication/vnd.recordare.musicxml mxl\napplication/vnd.recordare.musicxml+xml musicxml\napplication/vnd.rig.cryptonote cryptonote\napplication/vnd.rim.cod cod\napplication/vnd.rn-realmedia rm\napplication/vnd.rn-realmedia-vbr rmvb\napplication/vnd.route66.link66+xml link66\napplication/vnd.sailingtracker.track st\napplication/vnd.seemail see\napplication/vnd.sema sema\napplication/vnd.semd semd\napplication/vnd.semf semf\napplication/vnd.shana.informed.formdata ifm\napplication/vnd.shana.informed.formtemplate itp\napplication/vnd.shana.informed.interchange iif\napplication/vnd.shana.informed.package ipk\napplication/vnd.simtech-mindmapper twd twds\napplication/vnd.smaf mmf\napplication/vnd.smart.teacher teacher\napplication/vnd.solent.sdkm+xml sdkm sdkd\napplication/vnd.spotfire.dxp dxp\napplication/vnd.spotfire.sfs sfs\napplication/vnd.stardivision.calc sdc\napplication/vnd.stardivision.draw sda\napplication/vnd.stardivision.impress sdd\napplication/vnd.stardivision.math smf\napplication/vnd.stardivision.writer sdw vor\napplication/vnd.stardivision.writer-global sgl\napplication/vnd.stepmania.package smzip\napplication/vnd.stepmania.stepchart sm\napplication/vnd.sun.xml.calc sxc\napplication/vnd.sun.xml.calc.template stc\napplication/vnd.sun.xml.draw sxd\napplication/vnd.sun.xml.draw.template std\napplication/vnd.sun.xml.impress sxi\napplication/vnd.sun.xml.impress.template sti\napplication/vnd.sun.xml.math sxm\napplication/vnd.sun.xml.writer sxw\napplication/vnd.sun.xml.writer.global sxg\napplication/vnd.sun.xml.writer.template stw\napplication/vnd.sus-calendar sus susp\napplication/vnd.svd svd\napplication/vnd.symbian.install sis sisx\napplication/vnd.syncml+xml xsm\napplication/vnd.syncml.dm+wbxml bdm\napplication/vnd.syncml.dm+xml xdm\napplication/vnd.tao.intent-module-archive tao\napplication/vnd.tcpdump.pcap pcap cap dmp\napplication/vnd.tmobile-livetv tmo\napplication/vnd.trid.tpt tpt\napplication/vnd.triscape.mxs mxs\napplication/vnd.trueapp tra\napplication/vnd.ufdl ufd ufdl\napplication/vnd.uiq.theme utz\napplication/vnd.umajin umj\napplication/vnd.unity unityweb\napplication/vnd.uoml+xml uoml\napplication/vnd.vcx vcx\napplication/vnd.visio vsd vst vss vsw\napplication/vnd.visionary vis\napplication/vnd.vsf vsf\napplication/vnd.wap.wbxml wbxml\napplication/vnd.wap.wmlc wmlc\napplication/vnd.wap.wmlscriptc wmlsc\napplication/vnd.webturbo wtb\napplication/vnd.wolfram.player nbp\napplication/vnd.wordperfect wpd\napplication/vnd.wqd wqd\napplication/vnd.wt.stf stf\napplication/vnd.xara xar\napplication/vnd.xfdl xfdl\napplication/vnd.yamaha.hv-dic hvd\napplication/vnd.yamaha.hv-script hvs\napplication/vnd.yamaha.hv-voice hvp\napplication/vnd.yamaha.openscoreformat osf\napplication/vnd.yamaha.openscoreformat.osfpvg+xml osfpvg\napplication/vnd.yamaha.smaf-audio saf\napplication/vnd.yamaha.smaf-phrase spf\napplication/vnd.yellowriver-custom-menu cmp\napplication/vnd.zul zir zirz\napplication/vnd.zzazz.deck+xml zaz\napplication/voicexml+xml vxml\napplication/widget wgt\napplication/winhlp hlp\napplication/wsdl+xml wsdl\napplication/wspolicy+xml wspolicy\napplication/x-7z-compressed 7z\napplication/x-abiword abw\napplication/x-ace-compressed ace\napplication/x-apple-diskimage dmg\napplication/x-authorware-bin aab x32 u32 vox\napplication/x-authorware-map aam\napplication/x-authorware-seg aas\napplication/x-bcpio bcpio\napplication/x-bittorrent torrent\napplication/x-blorb blb blorb\napplication/x-bzip bz\napplication/x-bzip2 bz2 boz\napplication/x-cbr cbr cba cbt cbz cb7\napplication/x-cdlink vcd\napplication/x-cfs-compressed cfs\napplication/x-chat chat\napplication/x-chess-pgn pgn\napplication/x-conference nsc\napplication/x-cpio cpio\napplication/x-csh csh\napplication/x-debian-package deb udeb\napplication/x-dgc-compressed dgc\napplication/x-director dir dcr dxr cst cct cxt w3d fgd swa\napplication/x-doom wad\napplication/x-dtbncx+xml ncx\napplication/x-dtbook+xml dtb\napplication/x-dtbresource+xml res\napplication/x-dvi dvi\napplication/x-envoy evy\napplication/x-eva eva\napplication/x-font-bdf bdf\napplication/x-font-ghostscript gsf\napplication/x-font-linux-psf psf\napplication/x-font-otf otf\napplication/x-font-pcf pcf\napplication/x-font-snf snf\napplication/x-font-ttf ttf ttc\napplication/x-font-type1 pfa pfb pfm afm\napplication/x-font-woff woff\napplication/x-freearc arc\napplication/x-futuresplash spl\napplication/x-gca-compressed gca\napplication/x-glulx ulx\napplication/x-gnumeric gnumeric\napplication/x-gramps-xml gramps\napplication/x-gtar gtar\napplication/x-hdf hdf\napplication/x-install-instructions install\napplication/x-iso9660-image iso\napplication/x-java-jnlp-file jnlp\napplication/x-latex latex\napplication/x-lzh-compressed lzh lha\napplication/x-mie mie\napplication/x-mobipocket-ebook prc mobi\napplication/x-ms-application application\napplication/x-ms-shortcut lnk\napplication/x-ms-wmd wmd\napplication/x-ms-wmz wmz\napplication/x-ms-xbap xbap\napplication/x-msaccess mdb\napplication/x-msbinder obd\napplication/x-mscardfile crd\napplication/x-msclip clp\napplication/x-msdownload exe dll com bat msi\napplication/x-msmediaview mvb m13 m14\napplication/x-msmetafile wmf wmz emf emz\napplication/x-msmoney mny\napplication/x-mspublisher pub\napplication/x-msschedule scd\napplication/x-msterminal trm\napplication/x-mswrite wri\napplication/x-netcdf nc cdf\napplication/x-nzb nzb\napplication/x-pkcs12 p12 pfx\napplication/x-pkcs7-certificates p7b spc\napplication/x-pkcs7-certreqresp p7r\napplication/x-rar-compressed rar\napplication/x-research-info-systems ris\napplication/x-sh sh\napplication/x-shar shar\napplication/x-shockwave-flash swf\napplication/x-silverlight-app xap\napplication/x-sql sql\napplication/x-stuffit sit\napplication/x-stuffitx sitx\napplication/x-subrip srt\napplication/x-sv4cpio sv4cpio\napplication/x-sv4crc sv4crc\napplication/x-t3vm-image t3\napplication/x-tads gam\napplication/x-tar tar\napplication/x-tcl tcl\napplication/x-tex tex\napplication/x-tex-tfm tfm\napplication/x-texinfo texinfo texi\napplication/x-tgif obj\napplication/x-ustar ustar\napplication/x-wais-source src\napplication/x-x509-ca-cert der crt\napplication/x-xfig fig\napplication/x-xliff+xml xlf\napplication/x-xpinstall xpi\napplication/x-xz xz\napplication/x-zmachine z1 z2 z3 z4 z5 z6 z7 z8\napplication/xaml+xml xaml\napplication/xcap-diff+xml xdf\napplication/xenc+xml xenc\napplication/xhtml+xml xhtml xht\napplication/xml xml xsl\napplication/xml-dtd dtd\napplication/xop+xml xop\napplication/xproc+xml xpl\napplication/xslt+xml xslt\napplication/xspf+xml xspf\napplication/xv+xml mxml xhvml xvml xvm\napplication/yang yang\napplication/yin+xml yin\napplication/zip zip\naudio/adpcm adp\naudio/basic au snd\naudio/midi mid midi kar rmi\naudio/mp4 mp4a\naudio/mpeg mpga mp2 mp2a mp3 m2a m3a\naudio/ogg oga ogg spx\naudio/s3m s3m\naudio/silk sil\naudio/vnd.dece.audio uva uvva\naudio/vnd.digital-winds eol\naudio/vnd.dra dra\naudio/vnd.dts dts\naudio/vnd.dts.hd dtshd\naudio/vnd.lucent.voice lvp\naudio/vnd.ms-playready.media.pya pya\naudio/vnd.nuera.ecelp4800 ecelp4800\naudio/vnd.nuera.ecelp7470 ecelp7470\naudio/vnd.nuera.ecelp9600 ecelp9600\naudio/vnd.rip rip\naudio/webm weba\naudio/x-aac aac\naudio/x-aiff aif aiff aifc\naudio/x-caf caf\naudio/x-flac flac\naudio/x-matroska mka\naudio/x-mpegurl m3u\naudio/x-ms-wax wax\naudio/x-ms-wma wma\naudio/x-pn-realaudio ram ra\naudio/x-pn-realaudio-plugin rmp\naudio/x-wav wav\naudio/xm xm\nchemical/x-cdx cdx\nchemical/x-cif cif\nchemical/x-cmdf cmdf\nchemical/x-cml cml\nchemical/x-csml csml\nchemical/x-xyz xyz\nimage/bmp bmp\nimage/cgm cgm\nimage/g3fax g3\nimage/gif gif\nimage/ief ief\nimage/jpeg jpeg jpg jpe\nimage/ktx ktx\nimage/png png\nimage/prs.btif btif\nimage/sgi sgi\nimage/svg+xml svg svgz\nimage/tiff tiff tif\nimage/vnd.adobe.photoshop psd\nimage/vnd.dece.graphic uvi uvvi uvg uvvg\nimage/vnd.dvb.subtitle sub\nimage/vnd.djvu djvu djv\nimage/vnd.dwg dwg\nimage/vnd.dxf dxf\nimage/vnd.fastbidsheet fbs\nimage/vnd.fpx fpx\nimage/vnd.fst fst\nimage/vnd.fujixerox.edmics-mmr mmr\nimage/vnd.fujixerox.edmics-rlc rlc\nimage/vnd.ms-modi mdi\nimage/vnd.ms-photo wdp\nimage/vnd.net-fpx npx\nimage/vnd.wap.wbmp wbmp\nimage/vnd.xiff xif\nimage/webp webp\nimage/x-3ds 3ds\nimage/x-cmu-raster ras\nimage/x-cmx cmx\nimage/x-freehand fh fhc fh4 fh5 fh7\nimage/x-icon ico\nimage/x-mrsid-image sid\nimage/x-pcx pcx\nimage/x-pict pic pct\nimage/x-portable-anymap pnm\nimage/x-portable-bitmap pbm\nimage/x-portable-graymap pgm\nimage/x-portable-pixmap ppm\nimage/x-rgb rgb\nimage/x-tga tga\nimage/x-xbitmap xbm\nimage/x-xpixmap xpm\nimage/x-xwindowdump xwd\nmessage/rfc822 eml mime\nmodel/iges igs iges\nmodel/mesh msh mesh silo\nmodel/vnd.collada+xml dae\nmodel/vnd.dwf dwf\nmodel/vnd.gdl gdl\nmodel/vnd.gtw gtw\nmodel/vnd.mts mts\nmodel/vnd.vtu vtu\nmodel/vrml wrl vrml\nmodel/x3d+binary x3db x3dbz\nmodel/x3d+vrml x3dv x3dvz\nmodel/x3d+xml x3d x3dz\ntext/cache-manifest appcache\ntext/calendar ics ifb\ntext/css css\ntext/csv csv\ntext/html html htm\ntext/n3 n3\ntext/plain txt text conf def list log in\ntext/prs.lines.tag dsc\ntext/richtext rtx\ntext/sgml sgml sgm\ntext/tab-separated-values tsv\ntext/troff t tr roff man me ms\ntext/turtle ttl\ntext/uri-list uri uris urls\ntext/vcard vcard\ntext/vnd.curl curl\ntext/vnd.curl.dcurl dcurl\ntext/vnd.curl.scurl scurl\ntext/vnd.curl.mcurl mcurl\ntext/vnd.dvb.subtitle sub\ntext/vnd.fly fly\ntext/vnd.fmi.flexstor flx\ntext/vnd.graphviz gv\ntext/vnd.in3d.3dml 3dml\ntext/vnd.in3d.spot spot\ntext/vnd.sun.j2me.app-descriptor jad\ntext/vnd.wap.wml wml\ntext/vnd.wap.wmlscript wmls\ntext/x-asm s asm\ntext/x-c c cc cxx cpp h hh dic\ntext/x-fortran f for f77 f90\ntext/x-java-source java\ntext/x-opml opml\ntext/x-pascal p pas\ntext/x-nfo nfo\ntext/x-setext etx\ntext/x-sfv sfv\ntext/x-uuencode uu\ntext/x-vcalendar vcs\ntext/x-vcard vcf\nvideo/3gpp 3gp\nvideo/3gpp2 3g2\nvideo/h261 h261\nvideo/h263 h263\nvideo/h264 h264\nvideo/jpeg jpgv\nvideo/jpm jpm jpgm\nvideo/mj2 mj2 mjp2\nvideo/mp4 mp4 mp4v mpg4\nvideo/mpeg mpeg mpg mpe m1v m2v\nvideo/ogg ogv\nvideo/quicktime qt mov\nvideo/vnd.dece.hd uvh uvvh\nvideo/vnd.dece.mobile uvm uvvm\nvideo/vnd.dece.pd uvp uvvp\nvideo/vnd.dece.sd uvs uvvs\nvideo/vnd.dece.video uvv uvvv\nvideo/vnd.dvb.file dvb\nvideo/vnd.fvt fvt\nvideo/vnd.mpegurl mxu m4u\nvideo/vnd.ms-playready.media.pyv pyv\nvideo/vnd.uvvu.mp4 uvu uvvu\nvideo/vnd.vivo viv\nvideo/webm webm\nvideo/x-f4v f4v\nvideo/x-fli fli\nvideo/x-flv flv\nvideo/x-m4v m4v\nvideo/x-matroska mkv mk3d mks\nvideo/x-mng mng\nvideo/x-ms-asf asf asx\nvideo/x-ms-vob vob\nvideo/x-ms-wm wm\nvideo/x-ms-wmv wmv\nvideo/x-ms-wmx wmx\nvideo/x-ms-wvx wvx\nvideo/x-msvideo avi\nvideo/x-sgi-movie movie\nvideo/x-smv smv\nx-conference/x-cooltalk ice\n","nodeTypes":"text/vtt vtt\napplication/x-chrome-extension crx\ntext/x-component htc\ntext/cache-manifest manifest\napplication/octet-stream buffer\napplication/mp4 m4p\naudio/mp4 m4a\nvideo/MP2T ts\ntext/event-stream event-stream\napplication/x-web-app-manifest+json webapp\ntext/x-lua lua\napplication/x-lua-bytecode luac\ntext/x-markdown markdown md mkd\ntext/plain ini\napplication/dash+xml mdp\nfont/opentype otf\n","compressibleTypes":"application/atom+xml atom\napplication/gml+xml gml\napplication/gpx+xml gpx\napplication/ecmascript ecma\napplication/java-vm class\napplication/javascript js\napplication/json json\napplication/jsonml+json jsonml\napplication/mathml+xml mathml\napplication/msword doc dot\napplication/pgp-signature asc sig\napplication/pkix-cert cer\napplication/postscript ai eps ps\napplication/rdf+xml rdf\napplication/rsd+xml rsd\napplication/rss+xml rss\napplication/rtf rtf\napplication/vnd.google-earth.kml+xml kml\napplication/vnd.mozilla.xul+xml xul\napplication/vnd.ms-excel xls xlm xla xlc xlt xlw\napplication/vnd.ms-fontobject eot\napplication/vnd.ms-powerpoint ppt pps pot\napplication/x-font-ttf ttf ttc\napplication/x-latex latex\napplication/x-sh sh\napplication/x-tar tar\napplication/x-tcl tcl\napplication/x-tex tex\napplication/xhtml+xml xhtml xht\napplication/xml xml xsl\napplication/xop+xml xop\napplication/xslt+xml xslt\naudio/x-wav wav\nfont/opentype otf\nimage/svg+xml svg svgz\nimage/bmp bmp\nimage/tiff tiff tif\nmessage/rfc822 eml mime\ntext/cache-manifest appcache\ntext/calendar ics ifb\ntext/css css\ntext/csv csv\ntext/html html htm\ntext/n3 n3\ntext/plain txt text conf def list log in\ntext/richtext rtx\ntext/sgml sgml sgm\ntext/vcard vcard\ntext/x-asm s asm\ntext/x-c c cc cxx cpp h hh dic\ntext/x-fortran f for f77 f90\ntext/x-java-source java\ntext/x-opml opml\ntext/x-pascal p pas\ntext/x-nfo nfo\ntext/x-setext etx\ntext/x-sfv sfv\ntext/x-uuencode uu\ntext/x-vcalendar vcs\ntext/x-vcard vcf\napplication/dart dart\nfont/opentype otf\ntext/x-markdown markdown md mkd\ntext/x-component htc\napplication/x-web-app-manifest+json webapp\n"}
},{}]},{},[1])
(1)
});