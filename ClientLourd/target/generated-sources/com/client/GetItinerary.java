
package com.client;

import jakarta.xml.bind.JAXBElement;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElementRef;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java pour anonymous complex type.
 * 
 * <p>Le fragment de schéma suivant indique le contenu attendu figurant dans cette classe.
 * 
 * <pre>{@code
 * <complexType>
 *   <complexContent>
 *     <restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       <sequence>
 *         <element name="departure" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         <element name="arrival" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         <element name="step" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       </sequence>
 *     </restriction>
 *   </complexContent>
 * </complexType>
 * }</pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "departure",
    "arrival",
    "step"
})
@XmlRootElement(name = "GetItinerary")
public class GetItinerary {

    @XmlElementRef(name = "departure", namespace = "http://tempuri.org/", type = JAXBElement.class, required = false)
    protected JAXBElement<String> departure;
    @XmlElementRef(name = "arrival", namespace = "http://tempuri.org/", type = JAXBElement.class, required = false)
    protected JAXBElement<String> arrival;
    @XmlElementRef(name = "step", namespace = "http://tempuri.org/", type = JAXBElement.class, required = false)
    protected JAXBElement<String> step;

    /**
     * Obtient la valeur de la propriété departure.
     * 
     * @return
     *     possible object is
     *     {@link JAXBElement }{@code <}{@link String }{@code >}
     *     
     */
    public JAXBElement<String> getDeparture() {
        return departure;
    }

    /**
     * Définit la valeur de la propriété departure.
     * 
     * @param value
     *     allowed object is
     *     {@link JAXBElement }{@code <}{@link String }{@code >}
     *     
     */
    public void setDeparture(JAXBElement<String> value) {
        this.departure = value;
    }

    /**
     * Obtient la valeur de la propriété arrival.
     * 
     * @return
     *     possible object is
     *     {@link JAXBElement }{@code <}{@link String }{@code >}
     *     
     */
    public JAXBElement<String> getArrival() {
        return arrival;
    }

    /**
     * Définit la valeur de la propriété arrival.
     * 
     * @param value
     *     allowed object is
     *     {@link JAXBElement }{@code <}{@link String }{@code >}
     *     
     */
    public void setArrival(JAXBElement<String> value) {
        this.arrival = value;
    }

    /**
     * Obtient la valeur de la propriété step.
     * 
     * @return
     *     possible object is
     *     {@link JAXBElement }{@code <}{@link String }{@code >}
     *     
     */
    public JAXBElement<String> getStep() {
        return step;
    }

    /**
     * Définit la valeur de la propriété step.
     * 
     * @param value
     *     allowed object is
     *     {@link JAXBElement }{@code <}{@link String }{@code >}
     *     
     */
    public void setStep(JAXBElement<String> value) {
        this.step = value;
    }

}
