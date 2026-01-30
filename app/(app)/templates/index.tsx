import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { useWorkoutTemplates } from '@/lib/hooks';

export default function TemplatesScreen() {
  const { data: templates } = useWorkoutTemplates();

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold mb-6">Workout Templates</Text>
      
      <Link href="/(app)/templates/new" asChild>
        <Pressable className="bg-primary p-4 rounded-lg mb-6">
          <Text className="text-white font-semibold text-center">Create Template</Text>
        </Pressable>
      </Link>

      {templates?.length === 0 ? (
        <Text className="text-gray-500">No templates yet.</Text>
      ) : (
        <View className="space-y-2">
          {templates?.map((template) => (
            <Link
              key={template.id}
              href={`/(app)/templates/${template.id}`}
              asChild
            >
              <Pressable className="bg-surface p-4 rounded-lg">
                <Text className="font-medium">{template.name}</Text>
                {template.description && (
                  <Text className="text-gray-500 text-sm">{template.description}</Text>
                )}
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    </View>
  );
}
