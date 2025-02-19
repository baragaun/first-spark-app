<script lang="ts">
    import House from "lucide-svelte/icons/house";
    import Inbox from "lucide-svelte/icons/inbox";
    import Settings from "lucide-svelte/icons/settings";
    import BookUser from "lucide-svelte/icons/book-user";
    import MessageSquare from "lucide-svelte/icons/message-square"
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";

    const items = [
        {
            title: "Home",
            url: "#",
            icon: House,
        },
        {
            title: "Inbox",
            url: "#",
            icon: Inbox,
        },
        {
            title: "Conversations",
            url: "#",
            icon: MessageSquare,
        },
        {
            title: "Contacts",
            url: "#",
            icon: BookUser,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
        },
    ];
</script>
<div class="flex">
    <Sidebar.Root>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.Menu>
                    {#each items as item (item.title)}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton>
                                {#snippet child({ props })}
                                    <a href={item.url} {...props}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/each}
                </Sidebar.Menu>
            </Sidebar.Group>
        </Sidebar.Content>
    </Sidebar.Root>
</div>
