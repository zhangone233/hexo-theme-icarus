const { Component } = require('inferno');
const classname = require('hexo-component-inferno/lib/util/classname');
const Head = require('./common/head');
const Navbar = require('./common/navbar');
const Widgets = require('./common/widgets');
const Footer = require('./common/footer');
const Scripts = require('./common/scripts');
const Search = require('./common/search');

module.exports = class extends Component {

    render() {
        const { site, config, page, helper, body } = this.props;
        const { usePjax } = config;

        // pjax 现在还有问题：目录与回到顶部按钮不正常
        const pjaxJs = `
            (function($){
                var MyApp = {
                    initPjax: function(){
                        var self = this;
                        // 初始化
                        $(document).pjax('a[target!="_blank"]', '#pjax-container', {
                            fragment: "#pjax-container",
                            timeout: 10000
                        });

                        // pjax请求开始
                        // $(document).on('pjax:start', function () {
                        // });

                        // 从服务器端加载的 HTML 内容完成之后，替换当前内容之前
                        $(document).on('pjax:beforeReplace', function (event) {
                            
                        });

                        // PJAX 渲染结束时
                        $(document).on('pjax:end', function() {
                            self.siteBootUp();
                            // 在「局部刷新」时才会运行
                            // console.log("局部执行");
                        });
                        self.siteBootUp();
                    },
                    /*
                     * Things to be execute when normal page load
                     * and pjax page load.
                     */
                    siteBootUp: function() {
                        //「局部刷新」和「页面刷新」都需要运行的代码
                        // console.log("全局执行");
                        window.$__mainInit && window.$__mainInit();
                        window.$__backToTopInit && window.$__backToTopInit();
                    },
                    /** init Waline comments */
                    initWaline: function() {
                        var containerId = '#waline-thread';
                        if (window.Waline && $(containerId).get(0)) {
                            window.Waline.init({
                                el: containerId,
                                serverURL: 'https://my-waline-iota.vercel.app',
                                path: window.location.pathname,
                                search: false,
                                texRenderer: false,
                                imageUploader: false,
                                emoji: '//unpkg.com/@waline/emojis@1.1.0/weibo',
                            });
                        };
                    },
                };
                window.MyApp = MyApp;
            })(jQuery);
            
            //「页面刷新」事件触发运行
            $(document).ready(function() {
                MyApp.initPjax();
            });
        `;

        const language = page.lang || page.language || config.language;
        const columnCount = Widgets.getColumnCount(config.widgets, config, page);

        return <html lang={language ? language.substr(0, 2) : ''}>
            <Head site={site} config={config} helper={helper} page={page} />
            {/* <body class={`is-${columnCount}-column`}> */}
            <body class={`is-${3}-column`}>
                <script type="text/javascript" src="/js/imaegoo/night.js"></script>
                <canvas id="universe"></canvas>

                <Navbar config={config} helper={helper} page={page} />
                <section class="section">
                    <div class="container" id="pjax-container">
                        <div class="columns">
                            <div class={classname({
                                column: true,
                                'order-2': true,
                                'column-main': true,
                                'is-12': columnCount === 1,
                                // 'is-8-tablet is-8-desktop is-8-widescreen': columnCount === 2,
                                'is-8-tablet is-8-desktop is-9-widescreen': columnCount === 2,
                                'is-8-tablet is-8-desktop is-6-widescreen': columnCount === 3
                            })} dangerouslySetInnerHTML={{ __html: body }}></div>
                            <Widgets site={site} config={config} helper={helper} page={page} position={'left'} />
                            <Widgets site={site} config={config} helper={helper} page={page} position={'right'} />
                        </div>
                    </div>
                </section>
                <Footer config={config} helper={helper} />
                <Scripts site={site} config={config} helper={helper} page={page} />
                <Search config={config} helper={helper} />

                {/* {usePjax ? <script src="https://cdn.jsdelivr.net/npm/pjax@0.2.8/pjax.js"></script> : null} */}
                {usePjax ? <script src="https://cdn.bootcss.com/jquery.pjax/2.0.1/jquery.pjax.min.js"></script> : null}
                {usePjax ? <script type="text/javascript" dangerouslySetInnerHTML={{ __html: pjaxJs }}></script> : null}

            </body>
        </html>;
    }
};
