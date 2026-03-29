import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/dashboard/settings/profile-form"
import { AppearanceForm } from "@/components/dashboard/settings/appearance-form"
import { NotificationsForm } from "@/components/dashboard/settings/notifications-form"
import { PasswordForm } from "@/components/dashboard/settings/password-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <h4 className="text-md font-medium">Profile</h4>
            <p className="text-sm text-muted-foreground">Update your personal details.</p>
        </div>
        <div className="md:col-span-2">
            <ProfileForm />
        </div>
      </div>
      <Separator />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <h4 className="text-md font-medium">Password</h4>
                <p className="text-sm text-muted-foreground">Change your password.</p>
            </div>
            <div className="md:col-span-2">
                <PasswordForm />
            </div>
      </div>
      <Separator />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <h4 className="text-md font-medium">Appearance</h4>
                <p className="text-sm text-muted-foreground">Customize the look and feel of the app.</p>
            </div>
            <div className="md:col-span-2">
                <AppearanceForm />
            </div>
        </div>
       <Separator />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <h4 className="text-md font-medium">Notifications</h4>
                <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
            </div>
            <div className="md:col-span-2">
                <NotificationsForm />
            </div>
      </div>
    </div>
  )
}
