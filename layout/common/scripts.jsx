const { Component, Fragment } = require('inferno');
const Plugins = require('./plugins');

module.exports = class extends Component {
    render() {
        const { site, config, helper, page } = this.props;
        const { url_for, cdn } = helper;
        const { article } = config;
        const language = page.lang || page.language || config.language || 'en';

        let fold = 'unfolded';
        let clipboard = true;
        if (article && article.highlight) {
            if (typeof article.highlight.clipboard !== 'undefined') {
                clipboard = !!article.highlight.clipboard;
            }
            if (typeof article.highlight.fold === 'string') {
                fold = article.highlight.fold;
            }
        }

        const embeddedConfig = `var IcarusThemeSettings = {
            article: {
                highlight: {
                    clipboard: ${clipboard},
                    fold: '${fold}'
                }
            },
        };`;


        const busuanzi_init = `if (typeof ${config.busuanzi_site_offset} !== 'undefined' 
            && ${config.plugins.busuanzi} == true) {
                $(document).ready(function () {
                    var int = setInterval(fixCount, 100);
                    var busuanziSiteOffset = parseInt(${config.busuanzi_site_offset});
                    function fixCount() {
                        if ($("#busuanzi_container_site_uv").css("display") != "none" && parseInt($("#busuanzi_value_site_uv").html()) > 0) {
                            clearInterval(int);
                            $("#busuanzi_value_site_uv").html(parseInt($("#busuanzi_value_site_uv").html()) + busuanziSiteOffset);
                        }
                    }
                });
        }`;

        return <Fragment>
            <script src={cdn('jquery', '3.3.1', 'dist/jquery.min.js')}></script>
            <script src={cdn('moment', '2.22.2', 'min/moment-with-locales.min.js')}></script>
            <script dangerouslySetInnerHTML={{ __html: busuanzi_init }}></script>
            {clipboard && <script src={cdn('clipboard', '2.0.4', 'dist/clipboard.min.js')} defer></script>}
            <script dangerouslySetInnerHTML={{ __html: `moment.locale("${language}");` }}></script>
            <script dangerouslySetInnerHTML={{ __html: embeddedConfig }}></script>
            <script src={url_for('/js/column.js')}></script>
            <Plugins site={site} config={config} page={page} helper={helper} head={false} />
            <script src={url_for('/js/main.js')} defer={true}></script>
            <script src={url_for('/js/imaegoo/universe.js')}></script>
        </Fragment>;
    }
};
