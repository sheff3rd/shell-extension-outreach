import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import * as yup from 'yup';

const SettingsContext = createContext();
const useSettings = () => useContext(SettingsContext);

const SettingsProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [schema, setSchema] = useState({});

  const _setData = (tileId, newData) => (
    setData((prevData) => ({ ...prevData, [tileId]: newData }))
  );

  const _setSchema = (tileId, newSchema) => (
    setSchema((prevSchema) => ({ ...prevSchema, [tileId]: newSchema }))
  );

  const onPersist = async () => {
    // ..save the data with immideate write to the database
  };

  const value = {
    data,
    setData: _setData,
    schema,
    setSchema: _setSchema,
    onPersist,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

const SettingsModal = ({ tile, children }) => (
  <form onSubmit={handleSubmit}>
    {children}

    <button type="submit">Save Settings</button>
  </form>
);

const UserSettings = ({ tile }) => {
  /**
   * NOTE: maybe makes sense to pass tile.id, when calling useSettings,
   * or maybe each tile will have separate cotnext instance, so we don't even need to pass tile.id
   **/
  const { data, setData, setSchema } = useSettings();

  const userData = useMemo(() => data[tile.id], [data, tile.id]);

  const userSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
  });

  useEffect(() => {
    setData(tile.id, { firstName: '', lastName: '' });
    setSchema(tile.id, userSchema);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData(tile.id, { ...userData, [name]: value });
  };

  return (
    <div>
      <input
        name="firstName"
        value={userData?.firstName ?? ''}
        onChange={handleChange}
      />

      <input
        name="lastName"
        value={userData?.lastName ?? ''}
        onChange={handleChange}
      />
    </div>
  )
};

const ProfileSettings = ({ tile }) => {
  const profileSchema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
  });

  const onSubmit = async () => {
    try {
      await profileSchema.validate(data);

      return data;
    } catch (error) {
       throw error;
    }
  };

  const { initialSettings } = useSettings(onSubmit, onPersist);
  const { data, setData } = useState(initialSettings);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData({ ...data, [name]: value });
  }

  return (
    <div>
      <input
        name="username"
        value={data?.username ?? ''}
        onChange={handleChange}
      />

      <input
        name="email"
        value={data?.email ?? ''}
        onChange={handleChange}
      />
    </div>
  )
}

export const Settings = () => {
  const userTile = {
    id: 'user-settings',
  };

  const profileTile = {
    id: 'profile-settings'
  };

  return (
    <SettingsProvider>
      <SettingsModal tile={userTile}>
        <UserSettings tile={userTile} />
      </SettingsModal>

      <SettingsModal tile={profileTile}>
        <ProfileSettings tile={profileTile} />
      </SettingsModal>
    </SettingsProvider>
  )
}

export default Settings;
