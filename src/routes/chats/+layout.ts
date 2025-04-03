
import { ChannelType, type Channel, type ChannelMessage, type MyUser } from '@baragaun/bg-node-client';
import type { LayoutLoad } from './$types';

// Only initialize in browser environment
export const ssr = false;

export const load: LayoutLoad = async () => {

  const currentUserId = 'u1';

  // Mock users data
  const mockUsers: MyUser[] = [
    {
        id: 'u1',
        email: 'alice@example.com',
        userHandle: 'alice',
        firstName: 'Alice',
        lastName: 'Smith',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEmailVerified: true,
        spokenLanguagesTextIds: [],
        roles: [],
        trustLevel: 1,
        isPhoneNumberVerified: false
    },
    {
        id: 'u2',
        email: 'bob@example.com',
        userHandle: 'bob',
        firstName: 'Bob',
        lastName: 'Johnson',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEmailVerified: true,
        spokenLanguagesTextIds: [],
        roles: [],
        trustLevel: 1,
        isPhoneNumberVerified: false
    },
    {
        id: 'u3',
        email: 'carol@example.com',
        userHandle: 'carol',
        firstName: 'Carol',
        lastName: 'Williams',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEmailVerified: true,
        spokenLanguagesTextIds: [],
        roles: [],
        trustLevel: 1,
        isPhoneNumberVerified: false
    },
    {
        id: 'u4',
        email: 'dave@example.com',
        userHandle: 'dave',
        firstName: 'Dave',
        lastName: 'Brown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEmailVerified: true,
        spokenLanguagesTextIds: [],
        roles: [],
        trustLevel: 1,
        isPhoneNumberVerified: false
    }
  ];

  // Mock channel messages
  const mockMessages: Record<string, ChannelMessage[]> = {
    '1': [
      {
        id: 'm101',
        channelId: '1',
        createdBy: 'u2',
        messageText: 'Hey, how are you doing?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'm102',
        channelId: '1',
        createdBy: 'u1',
        messageText: 'I\'m good, thanks for asking! How about you?',
        createdAt: new Date(Date.now() - 3500000).toISOString(),
        updatedAt: new Date(Date.now() - 3500000).toISOString()
      },
      {
        id: 'm103',
        channelId: 'u2',
        messageText: 'Doing well! Just working on this new project.',
        createdAt: new Date(Date.now() - 3400000).toISOString(),
        updatedAt: new Date(Date.now() - 3400000).toISOString()
      }
    ],
    '2': [
      {
        id: 'm201',
        channelId: '2',
        createdBy: 'u2',
        messageText: 'Did you see the latest update?',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'm202',
        channelId: '2',
        createdBy: 'u3',
        messageText: 'Yes, it looks great! I especially like the new features.',
        createdAt: new Date(Date.now() - 7100000).toISOString(),
        updatedAt: new Date(Date.now() - 7100000).toISOString()
      }
    ],
    '3': [
      {
        id: 'm301',
        channelId: '3',
        createdBy: 'u3',
        messageText: 'Thanks for your help yesterday!',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'm302',
        channelId: '3',
        createdBy: 'u2',
        messageText: 'No problem at all, happy to help.',
        createdAt: new Date(Date.now() - 172700000).toISOString(),
        updatedAt: new Date(Date.now() - 172700000).toISOString()
      },
      {
        id: 'm303',
        channelId: '3',
        createdBy: 'u3',
        messageText: 'Let me know if you need anything else!',
        createdAt: new Date(Date.now() - 172600000).toISOString(),
        updatedAt: new Date(Date.now() - 172600000).toISOString()
      }
    ],
    '4': [
      {
        id: 'm401',
        channelId: '4',
        createdBy: 'u4',
        messageText: 'Are we still meeting tomorrow?',
        createdAt: new Date(Date.now() - 86500000).toISOString(),
        updatedAt: new Date(Date.now() - 86500000).toISOString()
      },
      {
        id: 'm402',
        channelId: '4',
        createdBy: 'u1',
        messageText: 'Yes, 2pm works for me.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'm402',
        channelId: '4',
        createdBy: 'u2',
        messageText: 'No problem at all, 2pm not works for me.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  };

  // Mock channels
  const mockChannels: Channel[] = [
    {
      id: '1',
      name: 'Alice Smith',
      createdAt: new Date(Date.now() - 4000000).toISOString(),
      updatedAt: new Date(Date.now() - 3400000).toISOString(),
      channelType: ChannelType.unset,
      participants: [
        {
          id: '1p',
          userId: 'u1',
          channelId: '1',
          createdAt: new Date(Date.now() - 4000000).toISOString()
        },
        {
          id: '2p',
          userId: 'u2',
          channelId: '1',
          createdAt: new Date(Date.now() - 4000000).toISOString()
        }
      ]
    },
    {
      id: '2',
      name: 'Bob Johnson',
      createdAt: new Date(Date.now() - 8000000).toISOString(),
      updatedAt: new Date(Date.now() - 7100000).toISOString(),
      channelType: ChannelType.unset,
      participants: [
        {
          id: '3p',
          userId: 'u2',
          channelId: '2',
          createdAt: new Date(Date.now() - 8000000).toISOString()
        },
        {
          id: '4p',
          userId: 'u3',
          channelId: '2',
          createdAt: new Date(Date.now() - 8000000).toISOString()
        }
      ]
    },
    {
      id: '3',
      name: 'First Spark Support',
      description: 'We would like to help you!',
      createdAt: new Date(Date.now() - 180000000).toISOString(),
      updatedAt: new Date(Date.now() - 172600000).toISOString(),
      channelType: ChannelType.unset,
      participants: [
        {
          id: '5p',
          userId: 'u3',
          channelId: '3',
          createdAt: new Date(Date.now() - 180000000).toISOString()
        },
        {
          id: '6p',
          userId: 'u4',
          channelId: '3',
          createdAt: new Date(Date.now() - 180000000).toISOString()
        },
        {
            id: '11p',
            userId: 'u1',
            channelId: '3',
            createdAt: new Date(Date.now() - 180000000).toISOString()
          }
      ]
    },
    {
      id: '4',
      name: 'Team Chat',
      description: 'General team chat',
      createdAt: new Date(Date.now() - 90000000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      channelType: ChannelType.support,
      participants: [
        {
          id: '7p',
          userId: 'u1',
          channelId: '4',
          createdAt: new Date(Date.now() - 90000000).toISOString()
        },
        {
          id: '8p',
          userId: 'u2',
          channelId: '4',
          createdAt: new Date(Date.now() - 90000000).toISOString()
        },
        {
          id: '9p',
          userId: 'u3',
          channelId: '4',
          createdAt: new Date(Date.now() - 90000000).toISOString()
        },
        {
          id: '10p',
          userId: 'u4',
          channelId: '4',
          createdAt: new Date(Date.now() - 90000000).toISOString()
        }
      ]
    }
  ];

  return {
    currentUserId,
    users: mockUsers,
    channels: mockChannels,
    messages: mockMessages
  };
};
