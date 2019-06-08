export default [
    {
        path:'/',
        component:'../layouts/IndexLayout',
        routes: [
            {path:'/',redirect:'/log'},
            {
                path:'/log',
                name:'管理日志',
                icon:'',
                component: './Log'
            }
        ]
    }
]