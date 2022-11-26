const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const classname = require('hexo-component-inferno/lib/util/classname');

function isSameLink(a, b) {
    function santize(url) {
        let paths = url.replace(/(^\w+:|^)\/\//, '').split('#')[0].split('/').filter(p => p.trim() !== '');
        if (paths.length > 0 && paths[paths.length - 1].trim() === 'index.html') {
            paths = paths.slice(0, paths.length - 1);
        }
        return paths.join('/');
    }
    return santize(a) === santize(b);
}

class Navbar extends Component {
    render() {
        const {
            logo,
            logoUrl,
            siteUrl,
            siteTitle,
            menu,
            links,
            showToc,
            tocTitle,
            showSearch,
            searchTitle
        } = this.props;

        let navbarLogo = '';
        if (logo) {
            const { text, url } = logo || {};
            if (text) {
                navbarLogo = (
                    <>
                        <img src={url} alt={siteTitle} height="28" />
                        &nbsp;
                        {logo.text}
                    </>
                );
            } else {
                navbarLogo = <img src={url} alt={siteTitle} height="28" />;
            }
        } else {
            navbarLogo = siteTitle;
        }

        return <nav class="navbar navbar-main">
            <div class="container navbar-container">
                <div class="navbar-brand justify-content-center">
                    <a class="navbar-item navbar-logo" href={siteUrl}>
                        {navbarLogo}
                    </a>
                </div>
                <div class="navbar-menu">
                    {Object.keys(menu).length ? <div class="navbar-start">
                        {Object.keys(menu).map(name => {
                            const item = menu[name];
                            const { url, icon, active } = item;
                            return <a class={classname({ 'navbar-item': true, 'is-active': active })} href={url}>
                                {icon && <i class={classname({ 'nav-icon': true, [icon]: true })}></i>}
                                {name}
                            </a>;
                        })}
                    </div> : null}
                    <div class="navbar-end">
                        {Object.keys(links).length ? <Fragment>
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <a class="navbar-item" target="_blank" rel="noopener" title={name} href={link.url}>
                                    {link.icon ? <i class={link.icon}></i> : name}
                                </a>;
                            })}
                        </Fragment> : null}
                        {showToc ? <a class="navbar-item is-hidden-tablet catalogue" title={tocTitle} href="javascript:;">
                            <i class="fas fa-list-ul"></i>
                        </a> : null}
                        {showSearch ? <a class="navbar-item search" title={searchTitle} href="javascript:;">
                            <i class="fas fa-search"></i>
                        </a> : null}
                    </div>
                </div>
            </div>
        </nav>;
    }
}

module.exports = cacheComponent(Navbar, 'common.navbar', props => {
    const { config, helper, page } = props;
    const { url_for, _p, __ } = helper;
    const { logo, title, navbar, widgets, search } = config;

    const hasTocWidget = Array.isArray(widgets) && widgets.find(widget => widget.type === 'toc');
    const showToc = (config.toc === true || page.toc) && hasTocWidget && ['page', 'post'].includes(page.layout);

    const menu = {};
    if (navbar && navbar.menu) {
        const pageUrl = typeof page.path !== 'undefined' ? url_for(page.path) : '';
        Object.keys(navbar.menu).forEach(name => {
            const uriInfo = navbar.menu[name];
            const { url: uri, icon } = typeof uriInfo === 'string' ? { url: uriInfo, icon: '' } : uriInfo;
            const url = url_for(uri);
            const active = isSameLink(url, pageUrl);
            menu[name] = { url, active, icon };
        });
    }

    const links = {};
    if (navbar && navbar.links) {
        Object.keys(navbar.links).forEach(name => {
            const link = navbar.links[name];
            links[name] = {
                url: url_for(typeof link === 'string' ? link : link.url),
                icon: link.icon
            };
        });
    }

    return {
        logo,
        logoUrl: url_for(logo),
        siteUrl: url_for('/'),
        siteTitle: title,
        menu,
        links,
        showToc,
        tocTitle: _p('widget.catalogue', Infinity),
        showSearch: search && search.type,
        searchTitle: __('search.search')
    };
});
