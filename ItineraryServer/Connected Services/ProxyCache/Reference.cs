﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Ce code a été généré par un outil.
//     Version du runtime :4.0.30319.42000
//
//     Les modifications apportées à ce fichier peuvent provoquer un comportement incorrect et seront perdues si
//     le code est régénéré.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ItineraryServer.ProxyCache {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="ProxyCache.IGenericProxyCacheOf_String")]
    public interface IGenericProxyCacheOf_String {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_String/Get", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_String/GetResponse")]
        string Get(string cacheItemName);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_String/Get", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_String/GetResponse")]
        System.Threading.Tasks.Task<string> GetAsync(string cacheItemName);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_String/GetWithExpiration", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_String/GetWithExpirationResponse")]
        string GetWithExpiration(string cacheItemName, double dtSeconds);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_String/GetWithExpiration", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_String/GetWithExpirationResponse")]
        System.Threading.Tasks.Task<string> GetWithExpirationAsync(string cacheItemName, double dtSeconds);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_String/GetWithDateTimeOffset", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_String/GetWithDateTimeOffsetResponse")]
        string GetWithDateTimeOffset(string cacheItemName, System.DateTimeOffset dt);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IGenericProxyCacheOf_String/GetWithDateTimeOffset", ReplyAction="http://tempuri.org/IGenericProxyCacheOf_String/GetWithDateTimeOffsetResponse")]
        System.Threading.Tasks.Task<string> GetWithDateTimeOffsetAsync(string cacheItemName, System.DateTimeOffset dt);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IGenericProxyCacheOf_StringChannel : ItineraryServer.ProxyCache.IGenericProxyCacheOf_String, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class GenericProxyCacheOf_StringClient : System.ServiceModel.ClientBase<ItineraryServer.ProxyCache.IGenericProxyCacheOf_String>, ItineraryServer.ProxyCache.IGenericProxyCacheOf_String {
        
        public GenericProxyCacheOf_StringClient() {
        }
        
        public GenericProxyCacheOf_StringClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public GenericProxyCacheOf_StringClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public GenericProxyCacheOf_StringClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public GenericProxyCacheOf_StringClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public string Get(string cacheItemName) {
            return base.Channel.Get(cacheItemName);
        }
        
        public System.Threading.Tasks.Task<string> GetAsync(string cacheItemName) {
            return base.Channel.GetAsync(cacheItemName);
        }
        
        public string GetWithExpiration(string cacheItemName, double dtSeconds) {
            return base.Channel.GetWithExpiration(cacheItemName, dtSeconds);
        }
        
        public System.Threading.Tasks.Task<string> GetWithExpirationAsync(string cacheItemName, double dtSeconds) {
            return base.Channel.GetWithExpirationAsync(cacheItemName, dtSeconds);
        }
        
        public string GetWithDateTimeOffset(string cacheItemName, System.DateTimeOffset dt) {
            return base.Channel.GetWithDateTimeOffset(cacheItemName, dt);
        }
        
        public System.Threading.Tasks.Task<string> GetWithDateTimeOffsetAsync(string cacheItemName, System.DateTimeOffset dt) {
            return base.Channel.GetWithDateTimeOffsetAsync(cacheItemName, dt);
        }
    }
}
