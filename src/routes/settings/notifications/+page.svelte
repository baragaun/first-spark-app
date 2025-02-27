<script lang="ts">
    import { cn } from '$lib/utils';
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';

    // Notification settings state
    let emailNotifications = $state(true);
    let pushNotifications = $state(true);
    let isLoading = $state(false);

    const handleSave = async () => {
        isLoading = true;
        // TODO: Implement save notification preferences logic
        isLoading = false;
    };
</script>

<div class="container py-6">
    <div class="flex items-center justify-between">
        <h1 class="font-lexend text-3xl font-bold tracking-tight">Notification Settings</h1>
        <Button variant="outline" href="/settings">Back to Settings</Button>
    </div>

    <div class="mt-8">
        <Card.Root>
            <Card.Header>
                <Card.Title>Notification Preferences</Card.Title>
                <Card.Description>Choose how you want to receive notifications.</Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="email-notifications"
                            bind:checked={emailNotifications}
                            class="h-4 w-4 rounded border-input"
                        />
                        <label for="email-notifications">Email Notifications</label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="push-notifications"
                            bind:checked={pushNotifications}
                            class="h-4 w-4 rounded border-input"
                        />
                        <label for="push-notifications">Push Notifications</label>
                    </div>
                </div>
            </Card.Content>
            <Card.Footer>
                <Button disabled={isLoading} onclick={handleSave}>Save Preferences</Button>
            </Card.Footer>
        </Card.Root>
    </div>
</div>