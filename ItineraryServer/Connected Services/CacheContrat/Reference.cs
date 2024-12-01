﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Ce code a été généré par un outil.
//     Version du runtime :4.0.30319.42000
//
//     Les modifications apportées à ce fichier peuvent provoquer un comportement incorrect et seront perdues si
//     le code est régénéré.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ItineraryServer.CacheContrat {
    using System.Runtime.Serialization;
    using System;
    
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="Contract", Namespace="http://schemas.datacontract.org/2004/07/")]
    [System.SerializableAttribute()]
    public partial class Contract : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string[] citiesField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string commercial_nameField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string country_codeField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string nameField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string[] cities {
            get {
                return this.citiesField;
            }
            set {
                if ((object.ReferenceEquals(this.citiesField, value) != true)) {
                    this.citiesField = value;
                    this.RaisePropertyChanged("cities");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string commercial_name {
            get {
                return this.commercial_nameField;
            }
            set {
                if ((object.ReferenceEquals(this.commercial_nameField, value) != true)) {
                    this.commercial_nameField = value;
                    this.RaisePropertyChanged("commercial_name");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string country_code {
            get {
                return this.country_codeField;
            }
            set {
                if ((object.ReferenceEquals(this.country_codeField, value) != true)) {
                    this.country_codeField = value;
                    this.RaisePropertyChanged("country_code");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string name {
            get {
                return this.nameField;
            }
            set {
                if ((object.ReferenceEquals(this.nameField, value) != true)) {
                    this.nameField = value;
                    this.RaisePropertyChanged("name");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="CacheContrat.IGenericProxyCacheOf_ListOf_Contract")]
    public interface IGenericProxyCacheOf_ListOf_Contract {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/Get", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetResponse")]
        ItineraryServer.CacheContrat.Contract[] Get(string cacheItemName);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/Get", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetResponse")]
        System.Threading.Tasks.Task<ItineraryServer.CacheContrat.Contract[]> GetAsync(string cacheItemName);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetWithExpiration", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetWithExpirationResponse" +
            "")]
        ItineraryServer.CacheContrat.Contract[] GetWithExpiration(string cacheItemName, double dtSeconds);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetWithExpiration", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetWithExpirationResponse" +
            "")]
        System.Threading.Tasks.Task<ItineraryServer.CacheContrat.Contract[]> GetWithExpirationAsync(string cacheItemName, double dtSeconds);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetWithDateTimeOffset", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetWithDateTimeOffsetResp" +
            "onse")]
        ItineraryServer.CacheContrat.Contract[] GetWithDateTimeOffset(string cacheItemName, System.DateTimeOffset dt);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetWithDateTimeOffset", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_ListOf_Contract/GetWithDateTimeOffsetResp" +
            "onse")]
        System.Threading.Tasks.Task<ItineraryServer.CacheContrat.Contract[]> GetWithDateTimeOffsetAsync(string cacheItemName, System.DateTimeOffset dt);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IGenericProxyCacheOf_ListOf_ContractChannel : ItineraryServer.CacheContrat.IGenericProxyCacheOf_ListOf_Contract, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class GenericProxyCacheOf_ListOf_ContractClient : System.ServiceModel.ClientBase<ItineraryServer.CacheContrat.IGenericProxyCacheOf_ListOf_Contract>, ItineraryServer.CacheContrat.IGenericProxyCacheOf_ListOf_Contract {
        
        public GenericProxyCacheOf_ListOf_ContractClient() {
        }
        
        public GenericProxyCacheOf_ListOf_ContractClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public GenericProxyCacheOf_ListOf_ContractClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public GenericProxyCacheOf_ListOf_ContractClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public GenericProxyCacheOf_ListOf_ContractClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public ItineraryServer.CacheContrat.Contract[] Get(string cacheItemName) {
            return base.Channel.Get(cacheItemName);
        }
        
        public System.Threading.Tasks.Task<ItineraryServer.CacheContrat.Contract[]> GetAsync(string cacheItemName) {
            return base.Channel.GetAsync(cacheItemName);
        }
        
        public ItineraryServer.CacheContrat.Contract[] GetWithExpiration(string cacheItemName, double dtSeconds) {
            return base.Channel.GetWithExpiration(cacheItemName, dtSeconds);
        }
        
        public System.Threading.Tasks.Task<ItineraryServer.CacheContrat.Contract[]> GetWithExpirationAsync(string cacheItemName, double dtSeconds) {
            return base.Channel.GetWithExpirationAsync(cacheItemName, dtSeconds);
        }
        
        public ItineraryServer.CacheContrat.Contract[] GetWithDateTimeOffset(string cacheItemName, System.DateTimeOffset dt) {
            return base.Channel.GetWithDateTimeOffset(cacheItemName, dt);
        }
        
        public System.Threading.Tasks.Task<ItineraryServer.CacheContrat.Contract[]> GetWithDateTimeOffsetAsync(string cacheItemName, System.DateTimeOffset dt) {
            return base.Channel.GetWithDateTimeOffsetAsync(cacheItemName, dt);
        }
    }
}