import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
// Define interfaces for type safety
interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    twoFactorAuth: boolean;
  };
  updatedAt?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  className?: string;
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}

type TabType = "personal" | "address" | "preferences";

const ProfilePage: React.FC = () => {
  // Personal Information State
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  
  // Address Information State
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  
  // Preferences State
  const [newsletter, setNewsletter] = useState<boolean>(false);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = (): void => {
    // Simulate loading from in-memory storage or API
    const mockProfile: ProfileData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1990-01-15",
      gender: "male",
      address: {
        street: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "US"
      },
      preferences: {
        newsletter: true,
        smsNotifications: false,
        twoFactorAuth: true
      }
    };
    
    // Simulate async loading
    setTimeout(() => {
      setFirstName(mockProfile.firstName);
      setLastName(mockProfile.lastName);
      setEmail(mockProfile.email);
      setPhone(mockProfile.phone);
      setDateOfBirth(mockProfile.dateOfBirth);
      setGender(mockProfile.gender);
      setStreet(mockProfile.address.street);
      setCity(mockProfile.address.city);
      setState(mockProfile.address.state);
      setZipCode(mockProfile.address.zipCode);
      setCountry(mockProfile.address.country);
      setNewsletter(mockProfile.preferences.newsletter);
      setSmsNotifications(mockProfile.preferences.smsNotifications);
      setTwoFactorAuth(mockProfile.preferences.twoFactorAuth);
    }, 300);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Personal info validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    // Address validation
    if (!street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!city.trim()) {
      newErrors.city = "City is required";
    }
    if (!zipCode.trim()) {
      newErrors.zipCode = "ZIP/Postal code is required";
    }
    if (!country.trim()) {
      newErrors.country = "Country is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile data
  const handleSave = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    const profileData: ProfileData = {
      firstName,
      lastName,
      phone,
      email,
      dateOfBirth,
      gender,
      address: {
        street,
        city,
        state,
        zipCode,
        country
      },
      preferences: {
        newsletter,
        smsNotifications,
        twoFactorAuth
      },
      updatedAt: new Date().toISOString()
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Profile data saved:", profileData);
      alert("✅ Profile updated successfully!");
      
      // Clear any existing errors
      setErrors({});
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("❌ Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable Input Field Component
  const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    value, 
    onChange, 
    type = "text", 
    required = false, 
    error, 
    placeholder,
    className = ""
  }) => (
    <div className={`form-group ${className}`}>
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        required={required}
        aria-describedby={error ? `${label}-error` : undefined}
      />
      {error && (
        <span id={`${label}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );

  // Reusable Select Field Component
  const SelectField: React.FC<SelectFieldProps> = ({ 
    label, 
    value, 
    onChange, 
    options, 
    required = false, 
    error,
    className = ""
  }) => (
    <div className={`form-group ${className}`}>
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <select 
        value={value} 
        onChange={onChange} 
        className={`form-select ${error ? 'error' : ''}`}
        required={required}
        aria-describedby={error ? `${label}-error` : undefined}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${label}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );

  // Reusable Checkbox Field Component
  const CheckboxField: React.FC<CheckboxFieldProps> = ({ 
    label, 
    checked, 
    onChange, 
    description 
  }) => (
    <div className="checkbox-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="checkbox-input"
        />
        <span className="checkbox-custom"></span>
        <div className="checkbox-content">
          <span className="checkbox-text">{label}</span>
          {description && (
            <span className="checkbox-description">{description}</span>
          )}
        </div>
      </label>
    </div>
  );

  // Tab navigation handler
  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
  };

  // Gender options
  const genderOptions: SelectOption[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  // Country options
  const countryOptions: SelectOption[] = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IN', label: 'India' },
    { value: 'JP', label: 'Japan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'MX', label: 'Mexico' }
  ];

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div className="profile-info">
          <h1>My Profile</h1>
          <p>Manage your account information and shopping preferences</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Tab Navigation */}
        <div className="tab-navigation" role="tablist">
          <button 
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => handleTabChange('personal')}
            role="tab"
            aria-selected={activeTab === 'personal'}
            aria-controls="personal-panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Personal Info
          </button>
          <button 
            className={`tab-button ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => handleTabChange('address')}
            role="tab"
            aria-selected={activeTab === 'address'}
            aria-controls="address-panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Shipping Address
          </button>
          <button 
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => handleTabChange('preferences')}
            role="tab"
            aria-selected={activeTab === 'preferences'}
            aria-controls="preferences-panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
            </svg>
            Preferences
          </button>
        </div>

        {/* Form */}
        <form 
          onSubmit={(e: React.FormEvent) => { 
            e.preventDefault(); 
            handleSave(); 
          }} 
          className="profile-form"
        >
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div 
              id="personal-panel" 
              className="tab-content" 
              role="tabpanel"
              aria-labelledby="personal-tab"
            >
              <h2>Personal Information</h2>
              
              <div className="form-grid">
                <InputField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  error={errors.firstName}
                  placeholder="Enter your first name"
                />
                <InputField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  error={errors.lastName}
                  placeholder="Enter your last name"
                />
              </div>
              
              <div className="form-grid">
                <InputField
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  error={errors.email}
                  placeholder="your@email.com"
                />
                <InputField
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  required
                  error={errors.phone}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="form-grid">
                <InputField
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  type="date"
                />
                <SelectField
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={genderOptions}
                />
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div 
              id="address-panel" 
              className="tab-content" 
              role="tabpanel"
              aria-labelledby="address-tab"
            >
              <h2>Shipping Address</h2>
              
              <InputField
                label="Street Address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                error={errors.street}
                placeholder="123 Main Street, Apt 4B"
                className="full-width"
              />
              
              <div className="form-grid">
                <InputField
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  error={errors.city}
                  placeholder="New York"
                />
                <InputField
                  label="State/Province"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="NY"
                />
              </div>

              <div className="form-grid">
                <InputField
                  label="ZIP/Postal Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                  error={errors.zipCode}
                  placeholder="10001"
                />
                <SelectField
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  error={errors.country}
                  options={countryOptions}
                />
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div 
              id="preferences-panel" 
              className="tab-content" 
              role="tabpanel"
              aria-labelledby="preferences-tab"
            >
              <h2>Account Preferences</h2>
              
              <div className="preferences-section">
                <h3>Communication Settings</h3>
                <CheckboxField
                  label="Email Newsletter"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  description="Receive updates about new products, sales, and special offers"
                />
                <CheckboxField
                  label="SMS Notifications"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  description="Get order updates, shipping notifications, and delivery alerts via text message"
                />
              </div>

              <div className="preferences-section">
                <h3>Security Settings</h3>
                <CheckboxField
                  label="Two-Factor Authentication"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                  description="Add an extra layer of security to protect your account and personal information"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="save-button"
              disabled={isLoading}
              aria-describedby="save-button-description"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" aria-hidden="true"></div>
                  Saving Profile...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                  Save Profile
                </>
              )}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => loadProfileData()}
            >
              Reset Changes
            </button>
          </div>
          <p id="save-button-description" className="sr-only">
            Save all changes to your profile information
          </p>
        </form>
      </div>

      {/* Styles */}
  
    </div>
  );
};

export default ProfilePage;