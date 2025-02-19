<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import {Button} from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
</script>


<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Button variant="ghost" class="relative h-8 w-8 rounded-full">
            <Avatar.Root class="h-9 w-9">
                <Avatar.Image src="" alt="@shadcn" />
                <Avatar.Fallback>SC</Avatar.Fallback>
            </Avatar.Root>
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-56" align="end">
        <DropdownMenu.Label class="font-normal">
            <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">newstudent</p>
                <p class="text-muted-foreground text-xs leading-none">newstudent@example.com</p>
            </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
            <DropdownMenu.Item>
                Profile
                <DropdownMenu.Shortcut>⌘P</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
                Inbox
                <DropdownMenu.Shortcut>⌘I</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
                Settings
                <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
            Log out
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>