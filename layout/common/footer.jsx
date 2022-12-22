const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Footer extends Component {
    render() {
        const {
            logo,
            logoLightUrl,
            logoDarkUrl,
            aplayer,
            siteUrl,
            siteTitle,
            siteYear,
            author,
            links,
            showVisitorCounter,
            visitorCounterTitle,
            ICP,
        } = this.props;

        let footerLogo = '';
        if (logo) {
            const { text, url } = logo || {};
            if (logo.text) {
                footerLogo = (
                    <>
                        <span class='logo-img'>
                            <img src={logoLightUrl} alt={siteTitle} height="28" />
                            &nbsp;
                            {text}
                        </span>
                        <span class='logo-img-dark'>
                            <img src={logoDarkUrl} alt={siteTitle} height="28" />
                            &nbsp;
                            {text}
                        </span>
                    </>
                );
            } else {
                footerLogo = [
                    <img class="logo-img" src={logoLightUrl} alt={siteTitle} height="28" />,
                    <img class="logo-img-dark" src={logoDarkUrl} alt={siteTitle} height="28" />
                ]
            }
        } else {
            footerLogo = siteTitle;
        }

        return <footer class="footer">
            <div class="container">
                <div class="level">
                    <div class="level-start">
                        <a class="footer-logo is-block mb-2" href={siteUrl}>
                            {footerLogo}
                            {/* {logo && logo.text ? logo.text : [
                                <img class="logo-img" src={logoLightUrl} alt={siteTitle} height="28" />,
                                <img class="logo-img-dark" src={logoDarkUrl} alt={siteTitle} height="28" />
                            ]} */}
                        </a>
                        <p class="is-size-7">
                            <span dangerouslySetInnerHTML={{ __html: `&copy; ${siteYear} ${author || siteTitle}` }}></span>
                            &nbsp;&nbsp;Powered by <a href="https://hexo.io/" target="_blank" rel="noopener">Hexo</a>&nbsp;&&nbsp;
                            <a href="https://github.com/ppoffice/hexo-theme-icarus" target="_blank" rel="noopener">Icarus</a>
                            {showVisitorCounter ? <br /> : null}
                            {showVisitorCounter ? <span id="busuanzi_container_site_uv"
                                dangerouslySetInnerHTML={{ __html: visitorCounterTitle }}></span> : null}
                            {ICP ? <span>&nbsp;&nbsp;<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">{ICP}</a></span> : null}
                        </p>
                    </div>
                    <div class="level-end">
                        {Object.keys(links).length ? <div class="field has-addons">
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <p class="control">
                                    <a class={`button is-transparent ${link.icon ? 'is-large' : ''}`} target="_blank" rel="noopener" title={name} href={link.url}>
                                        {link.icon ? <i class={link.icon}></i> : name}
                                    </a>
                                </p>;
                            })}
                        </div> : null}

                        {!!aplayer?.enable && (
                            <div class="sideMusic">
                                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/zhangone233/APlayer@master/dist/APlayer.min.css" />
                                {/* <script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script> */}
                                <script src="https://cdn.jsdelivr.net/gh/zhangone233/APlayer@master/dist/APlayer.min.js"></script>
                                <script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>
                                <meting-js
                                    type="playlist" // song, playlist, album, search, artist
                                    id={aplayer.id}
                                    server={aplayer.server} 
                                    fixed="true"
                                    autoplay="false"
                                    loop="all"
                                    order="list"
                                    preload="auto"
                                    list-folded="ture"
                                    list-max-height="400px"
                                    lrctype="0"
                                    storagename="__aplayer-setting"
                                    theme="#2980b9"
                                    volume="0.7"
                                >
                                </meting-js>	
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>;
    }
}

module.exports = cacheComponent(Footer, 'common.footer', props => {
    const { config, helper } = props;
    const { url_for, _p, date } = helper;
    const { logo, title, author, footer, plugins, aplayer, record_information } = config;

    const logoLight = logo instanceof String ? logo : logo.light
    const logoDark = logo instanceof String ? logo : logo.dark

    const links = {};
    if (footer && footer.links) {
        Object.keys(footer.links).forEach(name => {
            const link = footer.links[name];
            links[name] = {
                url: url_for(typeof link === 'string' ? link : link.url),
                icon: link.icon
            };
        });
    }

    return {
        logo,
        logoLightUrl: url_for(logoLight),
        logoDarkUrl: url_for(logoDark),
        siteUrl: url_for('/'),
        aplayer,
        siteTitle: title,
        siteYear: date(new Date(), 'YYYY'),
        author,
        links,
        showVisitorCounter: plugins && plugins.busuanzi === true,
        visitorCounterTitle: _p('plugin.visitor_count', '<span id="busuanzi_value_site_uv">0</span>'),
        ICP: record_information?.ICP,
    };
});
