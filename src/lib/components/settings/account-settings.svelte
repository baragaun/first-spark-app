<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import * as Alert from '$lib/components/ui/alert';
    import { AlertTriangle } from 'lucide-svelte';
    import { cn } from '$lib/utils';

    // State management using Svelte 5 runes
    let isLoading = $state(false);
    let showDeleteConfirm = $state(false);

    // Action handlers
    const handlePasswordChange = async () => {
        isLoading = true;
        // TODO: Implement password change logic
        isLoading = false;
    };

    const handleEmailRemoval = async () => {
        isLoading = true;
        // TODO: Implement email removal logic
        isLoading = false;
    };

    const handleSignOutAll = async () => {
        isLoading = true;
        // TODO: Implement sign out from all devices logic
        isLoading = false;
    };

    const handleDataDownload = async () => {
        isLoading = true;
        // TODO: Implement data download logic
        isLoading = false;
    };

    const handleAccountDeletion = async () => {
        isLoading = true;
        // TODO: Implement account deletion logic
        isLoading = false;
    };
</script>

<div class="space-y-6">
    <div>
        <h3 class="font-lexend text-lg font-medium">Account Settings</h3>
        <p class="text-sm text-muted-foreground">
            Manage your account settings and set email preferences.
        </p>
    </div>

    <div class="space-y-4">
        <!-- Notification Settings -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Notification Preferences</Card.Title>
                <Card.Description>Manage how you receive notifications.</Card.Description>
            </Card.Header>
            <Card.Content>
                <Button href="/settings/notifications" variant="outline">
                    Configure Notifications
                </Button>
            </Card.Content>
        </Card.Root>

        <!-- Email Management -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Email Management</Card.Title>
                <Card.Description>Remove secondary email addresses from your account.</Card.Description>
            </Card.Header>
            <Card.Content>
                <Button variant="outline" disabled={isLoading} onclick={handleEmailRemoval}>
                    Manage Emails
                </Button>
            </Card.Content>
        </Card.Root>

        <!-- Password Change -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Change Password</Card.Title>
                <Card.Description>Update your account password.</Card.Description>
            </Card.Header>
            <Card.Content>
                <Button variant="outline" disabled={isLoading} onclick={handlePasswordChange}>
                    Change Password
                </Button>
            </Card.Content>
        </Card.Root>

        <!-- Sign Out All Devices -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Active Sessions</Card.Title>
                <Card.Description>Sign out from all devices except this one.</Card.Description>
            </Card.Header>
            <Card.Content>
                <Button variant="outline" disabled={isLoading} onclick={handleSignOutAll}>
                    Sign Out All Devices
                </Button>
            </Card.Content>
        </Card.Root>

        <!-- Data Download -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Download Your Data</Card.Title>
                <Card.Description>Get a copy of all your data stored in our system.</Card.Description>
            </Card.Header>
            <Card.Content>
                <Button variant="outline" disabled={isLoading} onclick={handleDataDownload}>
                    Download Data
                </Button>
            </Card.Content>
        </Card.Root>

        <!-- Delete Account -->
        <Card.Root class="border-destructive/50">
            <Card.Header>
                <Card.Title class="text-destructive">Danger Zone</Card.Title>
                <Card.Description>
                    Once you delete your account, there is no going back. Please be certain.
                </Card.Description>
            </Card.Header>
            <Card.Content>
                {#if !showDeleteConfirm}
                    <Button
                        variant="destructive"
                        disabled={isLoading}
                        onclick={() => (showDeleteConfirm = true)}
                    >
                        Delete Account
                    </Button>
                {:else}
                    <Alert.Root variant="destructive">
                        <AlertTriangle class="h-4 w-4" />
                        <Alert.Title>Are you absolutely sure?</Alert.Title>
                        <Alert.Description>
                            This action cannot be undone. This will permanently delete your account and remove your
                            data from our servers.
                        </Alert.Description>
                        <div class="mt-4 flex space-x-4">
                            <Button
                                variant="destructive"
                                disabled={isLoading}
                                onclick={handleAccountDeletion}
                            >
                                Yes, Delete My Account
                            </Button>
                            <Button
                                variant="outline"
                                disabled={isLoading}
                                onclick={() => (showDeleteConfirm = false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Alert.Root>
                {/if}
            </Card.Content>
        </Card.Root>
    </div>
</div>