export const menuItems = [
    {
        id: 1,
        label: "menuitems.calendar.text",
        icon: "bx-calendar",
        link: "/",
        role:  ["Project Manager","Super Admin", "Employee"]
    },
    {
        id: 2,
        label: "menuitems.scheduler.text",
        icon: "bx-pie-chart-alt-2",
        link: "/scheduler",
        role:  ["Project Manager","Super Admin"]
    },
    {
        id: 3,
        label: "menuitems.dashboard.text",
        icon: "bx-pie-chart-alt-2",
        link: "/dashboard",
        role:  ["Super Admin"]
    },

    {
        id: 4,
        label: "menuitems.employee.text",
        icon: "bx-user",
        link: "/employee",
        role:  ["Project Manager","Super Admin"]
       
    },
    {
        id: 5,
        label: "menuitems.resources.text",
        icon: "bx-aperture",
        link: "/resource",
        role:  ["Project Manager","Super Admin"]
       
    },
    {
        id:6,
        label: "menuitems.filemanager.text",
        link: "/file-manager",
        icon: "bx-file",
        role:  ["Project Manager","Super Admin",]
    },
    {
        id: 7,
        label: "menuitems.projects.text",
        icon: "bx-briefcase-alt-2",
        link: "/projects",
        role:  ["Project Manager","Super Admin"]
    },
    {
        id: 8,
        label: "menuitems.tasks.text",
        icon: "bx-task",
        link: "/tasks",
        role:  ["Project Manager","Super Admin", "Employee"]
    },

    {
        id: 10,
        label: "menuitems.company.text",
        icon: "bxs-user-detail",
        link: "/company",
        role:  ["Super Admin"]
    },
    {
        id: 11,
        label: "menuitems.settings.text",
        icon: "bx-cog",
        role:  ["Super Admin"],
        subItems: [
            {
                id: 23,
                label: "menuitems.resourcesettings.text",
                link: "/settings",
                role:  ["Super Admin"],
                parentId: 11
            },
            {
                id: 24,
                label: "menuitems.manageEmployees.text",
                link: "/manage-employees",
                role:  ["Super Admin"],
                parentId: 11
            },
           
        ]
    },
    {
        id: 12,
        label: "menuitems.owner_dashboard.text",
        icon: "bx-pie-chart-alt-2",
        link: "/owner_dashboard",
        role:  ["Owner"]
    },
    {
        id: 13,
        label: "menuitems.owner_companies.text",
        icon: "bxs-user-detail",
        link: "/owner_companies",
        role:  ["Owner"],
        
    },
    
    
];

